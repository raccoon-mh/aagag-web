'use client';

import { useMemo, useEffect } from 'react';
import { Restaurant } from '@/data/restaurants';
import VirtualizedCardList from './VirtualizedCardList';
import { useFetchData } from '@/hooks/useFetchData';
import { SortOption } from '@/types/sort';

interface CardListProps {
    region?: string;
    onFavorite?: (name: string) => void;
    favorites?: string[];
    searchQuery?: string;
    selectedTags?: string[];
    restaurants?: Restaurant[];
    showFavoritesOnly?: boolean;
    sortOption?: SortOption;
}

export default function CardList({
    region = 'seoul',
    onFavorite,
    favorites = [],
    searchQuery = '',
    selectedTags = [],
    restaurants: propRestaurants,
    showFavoritesOnly = false,
    sortOption
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

    // props로 받은 데이터가 있으면 사용, 없으면 fetch한 데이터 사용
    const allRestaurants = propRestaurants || fetchedRestaurants;

    // 정렬 함수
    const sortRestaurants = (restaurants: Restaurant[], sortOption?: SortOption): Restaurant[] => {
        if (!sortOption || !sortOption.enabled || sortOption.field === 'none') return restaurants;

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

    // 필터링 및 정렬 로직 - useMemo로 최적화
    const filteredAndSortedRestaurants = useMemo(() => {
        if (!allRestaurants.length) return [];

        const filtered = allRestaurants.filter((restaurant) => {
            // 검색 쿼리 필터
            const matchesSearch = searchQuery === '' ||
                restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                restaurant.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                restaurant.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

            // 태그 필터 - 선택한 모든 태그가 포함된 레스토랑만 표시
            const matchesTags = selectedTags.length === 0 ||
                selectedTags.every(tag => restaurant.tags.includes(tag));

            // 즐겨찾기 필터
            const matchesFavorites = !showFavoritesOnly || favorites.includes(restaurant.name);

            return matchesSearch && matchesTags && matchesFavorites;
        });

        // 정렬 적용
        return sortRestaurants(filtered, sortOption);
    }, [allRestaurants, searchQuery, selectedTags, showFavoritesOnly, favorites, sortOption]);

    if (loading) {
        return (
            <div className="container py-8">
                <div className="mb-6">
                    <div className="h-8 bg-muted rounded w-48 mb-2 animate-pulse"></div>
                    <div className="h-4 bg-muted rounded w-64 animate-pulse"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        <div className="container py-8">
            <div className="mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                        <h2 className="text-2xl font-semibold mb-2">
                            {source} 맛집 {filteredAndSortedRestaurants.length}개
                        </h2>
                        <p className="text-muted-foreground">
                            별점 및 사진은 카카오 맵의 데이터를 사용합니다.
                        </p>
                    </div>
                    {metadata && (
                        <div className="text-sm text-muted-foreground mt-2 md:mt-0">
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
