'use client';

import { useState, useEffect, useCallback } from 'react';

const FAVORITES_STORAGE_KEY = '애객 세끼 For Web-favorites';
const FAVORITES_COUNT_STORAGE_KEY = '애객 세끼 For Web-favorites-count';

export interface FavoriteItem {
    name: string;
    region: string;
}

export function useFavorites() {
    const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
    const [totalFavoriteCount, setTotalFavoriteCount] = useState(0);
    const [updateTrigger, setUpdateTrigger] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    // 로컬 스토리지에서 즐겨찾기 로드
    useEffect(() => {
        try {
            const storedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
            const storedCount = localStorage.getItem(FAVORITES_COUNT_STORAGE_KEY);

            if (storedFavorites) {
                const parsed = JSON.parse(storedFavorites);
                // 기존 문자열 배열을 새로운 구조로 마이그레이션
                if (Array.isArray(parsed) && parsed.length > 0) {
                    if (typeof parsed[0] === 'string') {
                        // 기존 형식: ["맛집명1", "맛집명2"]
                        const migrated = parsed.map((name: string) => ({ name, region: 'unknown' }));
                        setFavorites(migrated);
                        setTotalFavoriteCount(migrated.length);
                        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(migrated));
                        localStorage.setItem(FAVORITES_COUNT_STORAGE_KEY, migrated.length.toString());
                    } else {
                        // 새로운 형식: [{name: "맛집명", region: "지역"}]
                        setFavorites(parsed);
                        setTotalFavoriteCount(parsed.length);
                    }
                }
            }

            // 저장된 개수가 있으면 사용
            if (storedCount) {
                setTotalFavoriteCount(parseInt(storedCount, 10));
            }
        } catch (error) {
            console.error('Error loading favorites from localStorage:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // 즐겨찾기 추가/제거 (리전 정보 포함) - useCallback으로 최적화
    const toggleFavorite = useCallback((restaurantName: string, region: string) => {
        setFavorites(prev => {
            const existingIndex = prev.findIndex(fav => fav.name === restaurantName);
            let newFavorites: FavoriteItem[];

            if (existingIndex >= 0) {
                // 제거
                newFavorites = prev.filter((_, index) => index !== existingIndex);
            } else {
                // 추가
                newFavorites = [...prev, { name: restaurantName, region }];
            }

            // 로컬 스토리지에 저장
            try {
                localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(newFavorites));
                localStorage.setItem(FAVORITES_COUNT_STORAGE_KEY, newFavorites.length.toString());
            } catch (error) {
                console.error('Error saving favorites to localStorage:', error);
            }

            // 전체 개수 즉시 업데이트
            setTotalFavoriteCount(newFavorites.length);

            return newFavorites;
        });

        // UI 업데이트 트리거를 별도로 실행
        setUpdateTrigger(prev => prev + 1);
    }, []);

    // 즐겨찾기 확인 (현재 리전에서만)
    const isFavorite = (restaurantName: string, currentRegion: string) => {
        return favorites.some(fav => fav.name === restaurantName && fav.region === currentRegion);
    };

    // 현재 리전의 즐겨찾기만 가져오기
    const getCurrentRegionFavorites = (currentRegion: string) => {
        return favorites.filter(fav => fav.region === currentRegion).map(fav => fav.name);
    };

    // 즐겨찾기 개수 (전체) - 로컬 스토리지에서 관리
    const favoriteCount = totalFavoriteCount;

    // 현재 리전의 즐겨찾기 개수 (updateTrigger로 강제 업데이트)
    const getCurrentRegionFavoriteCount = useCallback((currentRegion: string) => {
        // updateTrigger를 의존성으로 사용하여 강제 리렌더링
        const count = favorites.filter(fav => fav.region === currentRegion).length;
        return count;
    }, [favorites, updateTrigger]);

    return {
        favorites,
        toggleFavorite,
        isFavorite,
        getCurrentRegionFavorites,
        favoriteCount,
        totalFavoriteCount,
        getCurrentRegionFavoriteCount,
        updateTrigger,
        isLoading
    };
}

