'use client';

import React, { useState, useMemo } from 'react';
import { Search, Filter, X, Heart, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Restaurant } from '@/data/restaurants';
import { useAvailableRegions, useFetchData } from '@/hooks/useFetchData';
import { useFavorites } from '@/hooks/useFavorites';
import { SortOption, SORT_OPTIONS } from '@/types/sort';

interface FilterBarProps {
    onSearch: (query: string) => void;
    onRegionChange: (regionKey: string) => void;
    onTagFilter: (tag: string) => void;
    onFavoritesOnly?: (showOnly: boolean) => void;
    onSortChange?: (sortOption: SortOption) => void;
    selectedRegion: string;
    selectedTags: string[];
    restaurants: Restaurant[];
    isLoading?: boolean;
    showFavoritesOnly?: boolean;
    sortOption?: SortOption;
}

export default function FilterBar({
    onSearch,
    onRegionChange,
    onTagFilter,
    onFavoritesOnly,
    onSortChange,
    selectedRegion,
    selectedTags,
    restaurants,
    isLoading = false,
    showFavoritesOnly = false,
    sortOption
}: FilterBarProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [tagSearchQuery, setTagSearchQuery] = useState('');

    // 동적 지역 목록 로드
    const { regions: availableRegions, loading: regionsLoading } = useAvailableRegions();

    // 즐겨찾기 기능만 사용 (개수 표시 제거)
    const { favorites } = useFavorites();

    // 현재 지역의 source 정보 가져오기 (CardList와 동일한 방식)
    const { source: currentRegionName } = useFetchData(selectedRegion);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(searchQuery);
    };

    const removeTag = (tagToRemove: string) => {
        onTagFilter(tagToRemove);
    };

    const handleSortChange = (value: string) => {
        const option = SORT_OPTIONS.find(opt => opt.value === value);
        if (option && onSortChange) {
            onSortChange({
                field: option.field,
                order: option.order,
                enabled: option.field !== 'none'
            });
        }
    };

    const getCurrentSortValue = () => {
        if (!sortOption || !sortOption.enabled) return 'none';
        return `${sortOption.field}-${sortOption.order}`;
    };

    // 실제 데이터에서 태그를 동적으로 추출
    const availableTags = useMemo(() => {
        const allTags = new Set<string>();

        restaurants.forEach(restaurant => {
            restaurant.tags.forEach(tag => {
                allTags.add(tag);
            });
        });

        return Array.from(allTags).sort();
    }, [restaurants]);

    // 태그 검색 필터링
    const filteredTags = useMemo(() => {
        if (!tagSearchQuery) return availableTags;
        return availableTags.filter(tag =>
            tag.toLowerCase().includes(tagSearchQuery.toLowerCase())
        );
    }, [availableTags, tagSearchQuery]);

    return (
        <div className="w-full bg-background border-b">
            <div className="container py-4">
                {/* Top Row: Region + Search + Sort */}
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                    {/* Region Filter - 모바일에서는 위, 데스크톱에서는 왼쪽 */}
                    <div className="w-full md:w-48 flex-shrink-0">
                        <Select value={selectedRegion} onValueChange={onRegionChange}>
                            <SelectTrigger>
                                <SelectValue placeholder={regionsLoading ? "로딩 중..." : "지역을 선택하세요"} />
                            </SelectTrigger>
                            <SelectContent>
                                {availableRegions.map((region) => (
                                    <SelectItem key={region.key} value={region.key}>
                                        {region.source}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Search Bar - 모바일에서는 아래, 데스크톱에서는 오른쪽 */}
                    <form onSubmit={handleSearch} className="flex gap-2 flex-1">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="이름 또는 태그 검색..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Button type="submit" size="lg">
                            검색
                        </Button>
                    </form>

                    {/* Sort Filter */}
                    {onSortChange && (
                        <div className="w-full md:w-48 flex-shrink-0">
                            <Select value={getCurrentSortValue()} onValueChange={handleSortChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="정렬 기준" />
                                </SelectTrigger>
                                <SelectContent>
                                    {SORT_OPTIONS.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </div>

                {/* Filter Toggle */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2"
                        >
                            <Filter className="h-4 w-4" />
                            필터
                        </Button>

                        {/* 즐겨찾기 필터 버튼 - 항상 표시 */}
                        {onFavoritesOnly && (
                            <Button
                                variant={showFavoritesOnly ? "default" : "outline"}
                                size="sm"
                                onClick={() => onFavoritesOnly(!showFavoritesOnly)}
                                className="flex items-center gap-2 transition-all duration-300"
                            >
                                <Heart className={`h-4 w-4 ${showFavoritesOnly ? 'fill-current' : ''}`} />
                                <span>{currentRegionName} 즐겨찾기만 보기</span>
                            </Button>
                        )}
                    </div>

                    {/* Selected Tags */}
                    {selectedTags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {selectedTags.map((tag) => (
                                <Badge
                                    key={tag}
                                    variant="secondary"
                                    className="flex items-center gap-1"
                                >
                                    {tag}
                                    <button
                                        onClick={() => removeTag(tag)}
                                        className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                    )}
                </div>

                {/* Tags Filter - 필터 펼칠 때만 표시 */}
                {showFilters && (
                    <div className="mb-4">
                        <label className="text-sm font-medium mb-2 block">
                            태그 ({availableTags.length}개)
                        </label>

                        {/* 태그 검색 */}
                        {availableTags.length > 10 && (
                            <div className="mb-2">
                                <Input
                                    type="text"
                                    placeholder="태그 검색..."
                                    value={tagSearchQuery}
                                    onChange={(e) => setTagSearchQuery(e.target.value)}
                                    className="text-sm"
                                />
                            </div>
                        )}

                        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                            {isLoading ? (
                                <div className="text-sm text-muted-foreground">데이터 로딩 중...</div>
                            ) : (
                                filteredTags.map((tag) => (
                                    <Button
                                        key={tag}
                                        variant={selectedTags.includes(tag) ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => onTagFilter(tag)}
                                        className="text-xs"
                                    >
                                        {tag}
                                    </Button>
                                ))
                            )}
                        </div>

                        {tagSearchQuery && filteredTags.length === 0 && (
                            <p className="text-sm text-muted-foreground mt-2">
                                "{tagSearchQuery}"에 해당하는 태그가 없습니다.
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
