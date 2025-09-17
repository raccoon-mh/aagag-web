'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import FilterBar from '@/components/FilterBar';
import CardList from '@/components/CardList';
import Footer from '@/components/Footer';
import { useFetchData } from '@/hooks/useFetchData';
import { useFavorites } from '@/hooks/useFavorites';
import { SortOption } from '@/types/sort';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('seoul'); // 기본값을 첫 번째 지역으로 설정
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>({ field: 'none', order: 'asc', enabled: false });
  const [shuffleTrigger, setShuffleTrigger] = useState(0);

  // 즐겨찾기 관리 (로컬 스토리지 연동)
  const { favorites, toggleFavorite, isFavorite, getCurrentRegionFavorites, updateTrigger } = useFavorites();

  // 현재 리전의 즐겨찾기만 가져오기 - updateTrigger를 의존성으로 추가
  const currentRegionFavorites = React.useMemo(() => {
    return getCurrentRegionFavorites(selectedRegion);
  }, [getCurrentRegionFavorites, selectedRegion, updateTrigger]);

  // 선택한 지역에 따라 데이터 가져오기
  const { data: restaurants, loading: dataLoading } = useFetchData(selectedRegion);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleRegionChange = (regionKey: string) => {
    setSelectedRegion(regionKey);
    // 지역이 변경되면 태그 필터와 즐겨찾기 필터 초기화
    setSelectedTags([]);
    setShowFavoritesOnly(false);
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
    // 정렬 옵션을 랜덤으로 리셋
    setSortOption({ field: 'none', order: 'asc', enabled: false });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header currentRegion={selectedRegion} />
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
