'use client';

import { useMemo, useEffect, useState, useRef } from 'react';
import { Restaurant } from '@/data/restaurants';
import VirtualizedCardList from './VirtualizedCardList';
import { useFetchData } from '@/hooks/useFetchData';
import { SortOption } from '@/types/sort';
import { gtmRestaurantClick } from '@/lib/gtm';

interface CardListProps {
    region?: string;
    onFavorite?: (name: string) => void;
    favorites?: string[];
    searchQuery?: string;
    selectedTags?: string[];
    restaurants?: Restaurant[];
    showFavoritesOnly?: boolean;
    sortOption?: SortOption;
    onShuffle?: () => void;
    shuffleTrigger?: number;
}

export default function CardList({
    region = 'seoul',
    onFavorite,
    favorites = [],
    searchQuery = '',
    selectedTags = [],
    restaurants: propRestaurants,
    showFavoritesOnly = false,
    sortOption,
    onShuffle,
    shuffleTrigger = 0
}: CardListProps) {
    const {
        data: fetchedRestaurants,
        metadata,
        loading,
        error,
        lastUpdated,
        totalCount,
        source
    } = useFetchData(region);

    const allRestaurants = propRestaurants || fetchedRestaurants;
    const [shuffledRestaurants, setShuffledRestaurants] = useState<Restaurant[]>([]);
    const lastShuffleTrigger = useRef(0);
    const lastRegion = useRef(region);

    const shuffleArray = (array: Restaurant[]): Restaurant[] => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    // 리전 변경 감지 및 셔플 상태 초기화
    useEffect(() => {
        if (lastRegion.current !== region) {
            // 리전이 변경되었을 때 셔플 상태 초기화
            setShuffledRestaurants([]);
            lastShuffleTrigger.current = 0;
            lastRegion.current = region;
        }
    }, [region]);

    // 데이터 로드 시 자동 셔플 실행
    useEffect(() => {
        if (allRestaurants.length > 0) {
            // 새로운 데이터가 로드되면 자동으로 셔플 실행
            const newShuffled = shuffleArray(allRestaurants);
            setShuffledRestaurants(newShuffled);
            lastShuffleTrigger.current = 1; // 초기 셔플 트리거 설정
        }
    }, [allRestaurants]);

    // shuffleTrigger prop과 lastShuffleTrigger.current 동기화
    useEffect(() => {
        if (shuffleTrigger !== lastShuffleTrigger.current) {
            if (shuffleTrigger > lastShuffleTrigger.current) {
                // 새로운 셔플 요청
                const newShuffled = shuffleArray(allRestaurants);
                setShuffledRestaurants(newShuffled);
                lastShuffleTrigger.current = shuffleTrigger;
            }
        }
    }, [shuffleTrigger, allRestaurants]);


    const sortRestaurants = (restaurants: Restaurant[], sortOption?: SortOption): Restaurant[] => {
        if (!sortOption || !sortOption.enabled || sortOption.field === 'none') {
            return restaurants; // 셔플은 별도로 관리
        }

        return [...restaurants].sort((a, b) => {
            let comparison = 0;

            if (sortOption.field === 'name') {
                comparison = a.name.localeCompare(b.name, 'ko');
            } else if (sortOption.field === 'rating') {
                const ratingA = a.review_star || 0;
                const ratingB = b.review_star || 0;
                comparison = ratingA - ratingB;
            }

            return sortOption.order === 'desc' ? -comparison : comparison;
        });
    };

    const filteredAndSortedRestaurants = useMemo(() => {
        if (!allRestaurants.length) return [];

        // 셔플이 실행된 경우 셔플된 배열을 사용, 그렇지 않으면 원본 배열 사용
        const restaurantsToUse = shuffledRestaurants.length > 0 ? shuffledRestaurants : allRestaurants;

        const filtered = restaurantsToUse.filter((restaurant) => {
            const matchesSearch = searchQuery === '' ||
                restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                restaurant.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                restaurant.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

            const matchesTags = selectedTags.length === 0 ||
                selectedTags.every(tag => restaurant.tags.includes(tag));

            const matchesFavorites = !showFavoritesOnly || favorites.includes(restaurant.name);

            return matchesSearch && matchesTags && matchesFavorites;
        });

        return sortRestaurants(filtered, sortOption);
    }, [allRestaurants, shuffledRestaurants, searchQuery, selectedTags, showFavoritesOnly, favorites, sortOption]);

    if (loading) {
        return (
            <div className="container py-8">
                <div className="mb-6">
                    <div className="h-8 bg-muted rounded w-48 mb-2 animate-pulse"></div>
                    <div className="h-4 bg-muted rounded w-64 animate-pulse"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className="animate-pulse">
                            <div className="bg-muted rounded-lg aspect-video mb-4"></div>
                            <div className="space-y-2">
                                <div className="h-4 bg-muted rounded w-3/4"></div>
                                <div className="h-3 bg-muted rounded w-1/2"></div>
                                <div className="h-3 bg-muted rounded w-full"></div>
                                <div className="h-3 bg-muted rounded w-2/3"></div>
                                <div className="flex gap-2 mt-4">
                                    <div className="h-8 bg-muted rounded w-20"></div>
                                    <div className="h-8 bg-muted rounded w-16"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container py-16">
                <div className="text-center">
                    <div className="text-6xl mb-4">⚠️</div>
                    <h3 className="text-xl font-semibold mb-2">데이터를 불러올 수 없습니다</h3>
                    <p className="text-muted-foreground mb-4">
                        {error}
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        다시 시도
                    </button>
                </div>
            </div>
        );
    }

    if (filteredAndSortedRestaurants.length === 0) {
        return (
            <div className="container py-16">
                <div className="text-center">
                    <div className="text-6xl mb-4">🍽️</div>
                    <h3 className="text-xl font-semibold mb-2">검색 결과가 없습니다</h3>
                    <p className="text-muted-foreground">
                        다른 키워드나 필터로 다시 검색해보세요.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-4 sm:py-8">
            <div className="mb-4 sm:mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-semibold mb-2">
                            {source} 맛집 {filteredAndSortedRestaurants.length}개
                        </h2>
                        <p className="text-sm sm:text-base text-muted-foreground">
                            별점 및 사진은 카카오 맵의 데이터를 사용합니다.
                        </p>
                    </div>
                    {metadata && (
                        <div className="text-xs sm:text-sm text-muted-foreground mt-2 sm:mt-0">
                            <p>총 {totalCount}개 그룹</p>
                            <p>업데이트: {new Date(lastUpdated || '').toLocaleDateString('ko-KR')}</p>
                        </div>
                    )}
                </div>
            </div>

            <VirtualizedCardList
                restaurants={filteredAndSortedRestaurants}
                onFavorite={onFavorite}
                favorites={favorites}
                itemsPerPage={12}
                currentRegion={region}
            />
        </div>
    );
}
