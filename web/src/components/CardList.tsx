'use client';

import { useMemo, useEffect, useState } from 'react';
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

    const shuffleArray = (array: Restaurant[]): Restaurant[] => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    const sortRestaurants = (restaurants: Restaurant[], sortOption?: SortOption): Restaurant[] => {
        if (!sortOption || !sortOption.enabled || sortOption.field === 'none') {
            return shuffleArray(restaurants);
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

        const filtered = allRestaurants.filter((restaurant) => {
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
    }, [allRestaurants, searchQuery, selectedTags, showFavoritesOnly, favorites, sortOption, shuffleTrigger]);

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
