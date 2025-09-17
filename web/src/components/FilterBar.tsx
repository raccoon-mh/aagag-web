'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, Filter, X, Heart, ArrowUpDown, ChevronDown, Shuffle } from 'lucide-react';
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
    onShuffle?: () => void;
    selectedRegion: string;
    selectedTags: string[];
    restaurants: Restaurant[];
    isLoading?: boolean;
    showFavoritesOnly?: boolean;
    sortOption?: SortOption;
}

// 검색 가능한 지역 선택 컴포넌트
interface SearchableRegionSelectProps {
    regions: Array<{ key: string, source: string }>;
    selectedRegion: string;
    onRegionChange: (regionKey: string) => void;
    loading?: boolean;
}

function SearchableRegionSelect({ regions, selectedRegion, onRegionChange, loading = false }: SearchableRegionSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // 검색된 지역 목록
    const filteredRegions = useMemo(() => {
        if (!searchQuery) return regions;
        return regions.filter(region =>
            region.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
            region.key.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [regions, searchQuery]);

    // 선택된 지역 정보
    const selectedRegionInfo = regions.find(r => r.key === selectedRegion);

    // 드롭다운 열기/닫기
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            setTimeout(() => searchInputRef.current?.focus(), 100);
        } else {
            setSearchQuery('');
            setHighlightedIndex(-1);
        }
    };

    // 지역 선택
    const selectRegion = (regionKey: string) => {
        onRegionChange(regionKey);
        setIsOpen(false);
        setSearchQuery('');
        setHighlightedIndex(-1);
    };

    // 키보드 네비게이션
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isOpen) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setHighlightedIndex(prev =>
                    prev < filteredRegions.length - 1 ? prev + 1 : 0
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setHighlightedIndex(prev =>
                    prev > 0 ? prev - 1 : filteredRegions.length - 1
                );
                break;
            case 'Enter':
                e.preventDefault();
                if (highlightedIndex >= 0 && filteredRegions[highlightedIndex]) {
                    selectRegion(filteredRegions[highlightedIndex].key);
                }
                break;
            case 'Escape':
                setIsOpen(false);
                setSearchQuery('');
                setHighlightedIndex(-1);
                break;
        }
    };

    // 외부 클릭 시 드롭다운 닫기
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearchQuery('');
                setHighlightedIndex(-1);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <button
                type="button"
                onClick={toggleDropdown}
                onKeyDown={handleKeyDown}
                className="w-full h-10 px-3 py-2 text-left bg-background border border-input rounded-md shadow-sm hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-between"
            >
                <span className="truncate">
                    {loading ? "로딩 중..." : selectedRegionInfo?.source || "지역을 선택하세요"}
                </span>
                <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg">
                    {/* 검색 입력 */}
                    <div className="p-2 border-b">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                ref={searchInputRef}
                                type="text"
                                placeholder="지역 검색..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setHighlightedIndex(-1);
                                }}
                                onKeyDown={handleKeyDown}
                                className="pl-10 h-8 text-sm"
                            />
                        </div>
                    </div>

                    {/* 지역 목록 */}
                    <div className="max-h-60 overflow-y-auto scrollbar-hide">
                        {filteredRegions.length === 0 ? (
                            <div className="px-3 py-2 text-sm text-muted-foreground">
                                검색 결과가 없습니다.
                            </div>
                        ) : (
                            filteredRegions.map((region, index) => (
                                <button
                                    key={region.key}
                                    type="button"
                                    onClick={() => selectRegion(region.key)}
                                    className={`w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none ${index === highlightedIndex ? 'bg-accent text-accent-foreground' : ''
                                        } ${region.key === selectedRegion ? 'bg-primary text-primary-foreground' : ''}`}
                                >
                                    {region.source}
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function FilterBar({
    onSearch,
    onRegionChange,
    onTagFilter,
    onFavoritesOnly,
    onSortChange,
    onShuffle,
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
                <div className="space-y-3 md:space-y-0 md:flex md:flex-row md:gap-4 mb-4">
                    {/* Region Filter - 검색 가능한 드롭다운 */}
                    <div className="w-full md:w-48 flex-shrink-0">
                        <SearchableRegionSelect
                            regions={availableRegions}
                            selectedRegion={selectedRegion}
                            onRegionChange={onRegionChange}
                            loading={regionsLoading}
                        />
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
                                className="pl-10 h-10"
                            />
                        </div>
                        <Button type="submit" size="lg" className="h-10 px-4">
                            <span className="hidden sm:inline">검색</span>
                            <Search className="h-4 w-4 sm:hidden" />
                        </Button>
                    </form>

                    {/* Sort Filter */}
                    {onSortChange && (
                        <div className="w-full md:w-48 flex-shrink-0">
                            <Select value={getCurrentSortValue()} onValueChange={handleSortChange}>
                                <SelectTrigger className="h-10">
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
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 h-9"
                        >
                            <Filter className="h-4 w-4" />
                            <span className="hidden sm:inline">필터</span>
                        </Button>

                        {/* 즐겨찾기 필터 버튼 - 항상 표시 */}
                        {onFavoritesOnly && (
                            <Button
                                variant={showFavoritesOnly ? "default" : "outline"}
                                size="sm"
                                onClick={() => onFavoritesOnly(!showFavoritesOnly)}
                                className="flex items-center gap-2 transition-all duration-300 h-9"
                            >
                                <Heart className={`h-4 w-4 ${showFavoritesOnly ? 'fill-current' : ''}`} />
                                <span className="hidden sm:inline">{currentRegionName} 즐겨찾기만 보기</span>
                                <span className="sm:hidden">즐겨찾기</span>
                            </Button>
                        )}

                        {/* I'm Feeling Lucky Button - 즐겨찾기 옆에 배치 */}
                        {onShuffle && (
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={onShuffle}
                                className="h-9 px-3 bg-gradient-to-r from-primary/10 to-accent/10 hover:from-primary/20 hover:to-accent/20 border-primary/20 hover:border-primary/40 transition-all duration-300"
                            >
                                <Shuffle className="h-4 w-4 mr-1" />
                                <span className="hidden sm:inline">I'm Feeling Lucky</span>
                                <span className="sm:hidden">랜덤</span>
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
