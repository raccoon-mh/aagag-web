'use client';

import { useMemo, useState, useEffect } from 'react';
import { Restaurant } from '@/data/restaurants';
import RestaurantCard from './RestaurantCard';

interface VirtualizedCardListProps {
    restaurants: Restaurant[];
    onFavorite?: (name: string) => void;
    favorites?: string[];
    itemsPerPage?: number;
    currentRegion?: string;
}

export default function VirtualizedCardList({
    restaurants,
    onFavorite,
    favorites = [],
    itemsPerPage = 12,
    currentRegion = 'seoul'
}: VirtualizedCardListProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    // 현재 페이지의 데이터만 렌더링
    const currentRestaurants = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return restaurants.slice(0, endIndex);
    }, [restaurants, currentPage, itemsPerPage]);

    const hasMore = currentRestaurants.length < restaurants.length;

    // 무한 스크롤 구현
    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + document.documentElement.scrollTop
                >= document.documentElement.offsetHeight - 1000) {
                if (hasMore && !isLoadingMore) {
                    setIsLoadingMore(true);
                    setTimeout(() => {
                        setCurrentPage(prev => prev + 1);
                        setIsLoadingMore(false);
                    }, 300);
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [hasMore, isLoadingMore]);

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {currentRestaurants.map((restaurant, index) => (
                    <RestaurantCard
                        key={`${restaurant.name}-${restaurant.location}-${index}`}
                        restaurant={restaurant}
                        onFavorite={onFavorite}
                        isFavorite={favorites.includes(restaurant.name)}
                        currentRegion={currentRegion}
                    />
                ))}
            </div>

            {/* 로딩 인디케이터 */}
            {isLoadingMore && (
                <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            )}

            {/* 더 이상 데이터가 없을 때 */}
            {!hasMore && restaurants.length > 0 && (
                <div className="text-center py-8 text-muted-foreground">
                    모든 맛집을 불러왔습니다
                </div>
            )}
        </>
    );
}
