'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import FilterBar from '@/components/FilterBar';
import CardList from '@/components/CardList';
import Footer from '@/components/Footer';
import { useFetchData } from '@/hooks/useFetchData';
import { useFavorites } from '@/hooks/useFavorites';
import { SortOption } from '@/types/sort';

const LAST_REGION_STORAGE_KEY = '애객 세끼 For Web-last-region';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('seoul');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>({ field: 'none', order: 'asc', enabled: false });
  const [shuffleTrigger, setShuffleTrigger] = useState(1); // 초기값을 1로 설정하여 자동 셔플 활성화

  // 페이지 로드 시 마지막 선택 지역 복원
  useEffect(() => {
    try {
      const storedRegion = localStorage.getItem(LAST_REGION_STORAGE_KEY);
      if (storedRegion && storedRegion !== 'seoul') {
        setSelectedRegion(storedRegion);
      }
    } catch (error) {
      console.error('Error loading last region from localStorage:', error);
    }
  }, []);


  const { favorites, toggleFavorite, isFavorite, getCurrentRegionFavorites, updateTrigger } = useFavorites();

  const currentRegionFavorites = React.useMemo(() => {
    return getCurrentRegionFavorites(selectedRegion);
  }, [getCurrentRegionFavorites, selectedRegion, updateTrigger]);

  const { data: restaurants, loading: dataLoading } = useFetchData(selectedRegion);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleRegionChange = (regionKey: string) => {
    setSelectedRegion(regionKey);
    setSelectedTags([]);
    setShowFavoritesOnly(false);
    setShuffleTrigger(prev => prev + 1); // 지역 변경 시 새로운 셔플 실행

    // 마지막 선택 지역을 localStorage에 저장
    try {
      localStorage.setItem(LAST_REGION_STORAGE_KEY, regionKey);
    } catch (error) {
      console.error('Error saving last region to localStorage:', error);
    }
  };

  const handleSortChange = (newSortOption: SortOption) => {
    setSortOption(newSortOption);
  };

  const handleTagFilter = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleShuffle = () => {
    setShuffleTrigger(prev => prev + 1);
    setSortOption({ field: 'none', order: 'asc', enabled: false });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header currentRegion={selectedRegion} />

      {/* SEO를 위한 숨겨진 헤딩 */}
      <h1 className="sr-only">
        {selectedRegion === 'seoul' ? '서울' :
          selectedRegion === 'busan' ? '부산' :
            selectedRegion === 'daegu' ? '대구' :
              selectedRegion === 'gwangju' ? '광주' :
                selectedRegion === 'daejeon' ? '대전' :
                  selectedRegion === 'incheon' ? '인천' : '전국'} 맛집 검색 - 애객 세끼 With Web Finder
      </h1>

      <FilterBar
        onSearch={handleSearch}
        onRegionChange={handleRegionChange}
        onTagFilter={handleTagFilter}
        onFavoritesOnly={setShowFavoritesOnly}
        onSortChange={handleSortChange}
        onShuffle={handleShuffle}
        selectedRegion={selectedRegion}
        selectedTags={selectedTags}
        restaurants={restaurants}
        isLoading={dataLoading}
        showFavoritesOnly={showFavoritesOnly}
        sortOption={sortOption}
      />
      <main className="flex-1">
        <CardList
          region={selectedRegion}
          onFavorite={(name) => toggleFavorite(name, selectedRegion)}
          favorites={currentRegionFavorites}
          searchQuery={searchQuery}
          selectedTags={selectedTags}
          restaurants={restaurants}
          showFavoritesOnly={showFavoritesOnly}
          sortOption={sortOption}
          shuffleTrigger={shuffleTrigger}
        />
      </main>
      <Footer />
    </div>
  );
}
