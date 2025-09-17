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

    useEffect(() => {
        try {
            const storedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
            const storedCount = localStorage.getItem(FAVORITES_COUNT_STORAGE_KEY);

            if (storedFavorites) {
                const parsed = JSON.parse(storedFavorites);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    if (typeof parsed[0] === 'string') {
                        const migrated = parsed.map((name: string) => ({ name, region: 'unknown' }));
                        setFavorites(migrated);
                        setTotalFavoriteCount(migrated.length);
                        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(migrated));
                        localStorage.setItem(FAVORITES_COUNT_STORAGE_KEY, migrated.length.toString());
                    } else {
                        setFavorites(parsed);
                        setTotalFavoriteCount(parsed.length);
                    }
                }
            }

            if (storedCount) {
                setTotalFavoriteCount(parseInt(storedCount, 10));
            }
        } catch (error) {
            console.error('Error loading favorites from localStorage:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const toggleFavorite = useCallback((restaurantName: string, region: string) => {
        setFavorites(prev => {
            const existingIndex = prev.findIndex(fav => fav.name === restaurantName);
            let newFavorites: FavoriteItem[];

            if (existingIndex >= 0) {
                newFavorites = prev.filter((_, index) => index !== existingIndex);
            } else {
                newFavorites = [...prev, { name: restaurantName, region }];
            }

            try {
                localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(newFavorites));
                localStorage.setItem(FAVORITES_COUNT_STORAGE_KEY, newFavorites.length.toString());
            } catch (error) {
                console.error('Error saving favorites to localStorage:', error);
            }

            setTotalFavoriteCount(newFavorites.length);
            return newFavorites;
        });

        setUpdateTrigger(prev => prev + 1);
    }, []);

    const isFavorite = (restaurantName: string, currentRegion: string) => {
        return favorites.some(fav => fav.name === restaurantName && fav.region === currentRegion);
    };

    const getCurrentRegionFavorites = (currentRegion: string) => {
        return favorites.filter(fav => fav.region === currentRegion).map(fav => fav.name);
    };

    const favoriteCount = totalFavoriteCount;

    const getCurrentRegionFavoriteCount = useCallback((currentRegion: string) => {
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

