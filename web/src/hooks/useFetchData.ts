'use client';

import { useState, useEffect, useMemo } from 'react';
import { Restaurant, RestaurantData } from '@/data/restaurants';

interface UseFetchDataResult {
    data: Restaurant[];
    metadata: RestaurantData['metadata'] | null;
    loading: boolean;
    error: string | null;
    refetch: () => void;
    lastUpdated: string | null;
    totalCount: number;
    source: string | null;
}

export function useFetchData(region: string = 'seoul'): UseFetchDataResult {
    const [restaurantData, setRestaurantData] = useState<RestaurantData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            // 정적 JSON 파일에서 데이터 로드
            const response = await fetch(`/data/${region}.json`);

            if (!response.ok) {
                throw new Error(`Failed to fetch data: ${response.status}`);
            }

            const jsonData: RestaurantData = await response.json();
            setRestaurantData(jsonData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error occurred');
            console.error('Error fetching restaurant data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [region]);

    const refetch = () => {
        fetchData();
    };

    // 메모이제이션으로 성능 최적화
    const result = useMemo(() => ({
        data: restaurantData?.data || [],
        metadata: restaurantData?.metadata || null,
        loading,
        error,
        refetch,
        lastUpdated: restaurantData?.metadata?.parsed_at || null,
        totalCount: restaurantData?.metadata?.total_groups || 0,
        source: restaurantData?.metadata?.source || null
    }), [restaurantData, loading, error]);

    return result;
}

// 지역별 데이터를 미리 로드하는 훅 (대용량 데이터 최적화)
export function usePreloadData(regions: string[] = ['seoul']) {
    const [preloadedData, setPreloadedData] = useState<Record<string, RestaurantData>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadAllData = async () => {
            try {
                setLoading(true);

                // 병렬로 모든 지역 데이터 로드
                const dataPromises = regions.map(async (region) => {
                    const response = await fetch(`/data/${region}.json`);
                    if (!response.ok) {
                        throw new Error(`Failed to fetch ${region} data`);
                    }
                    const data: RestaurantData = await response.json();
                    return { region, data };
                });

                const results = await Promise.all(dataPromises);
                const dataMap = results.reduce((acc, { region, data }) => {
                    acc[region] = data;
                    return acc;
                }, {} as Record<string, RestaurantData>);

                setPreloadedData(dataMap);
            } catch (err) {
                console.error('Error preloading data:', err);
            } finally {
                setLoading(false);
            }
        };

        loadAllData();
    }, [regions]);

    return {
        preloadedData,
        loading
    };
}

// 사용 가능한 지역 목록을 가져오는 훅
export function useAvailableRegions() {
    const [regions, setRegions] = useState<Array<{ key: string, source: string }>>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadRegions = async () => {
            try {
                setLoading(true);

                // 하드코딩된 지역 목록 (실제로는 API나 파일 목록에서 가져와야 함)
                const regionFiles = ['seoul', 'incheon'];

                const regionPromises = regionFiles.map(async (regionFile) => {
                    try {
                        const response = await fetch(`/data/${regionFile}.json`);
                        if (!response.ok) return null;
                        const data: RestaurantData = await response.json();
                        return {
                            key: regionFile,
                            source: data.metadata.source
                        };
                    } catch {
                        return null;
                    }
                });

                const results = await Promise.all(regionPromises);
                const validRegions = results.filter((region): region is { key: string, source: string } => region !== null);

                setRegions(validRegions);
            } catch (err) {
                console.error('Error loading regions:', err);
            } finally {
                setLoading(false);
            }
        };

        loadRegions();
    }, []);

    return {
        regions,
        loading
    };
}
