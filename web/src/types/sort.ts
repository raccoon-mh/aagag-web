export type SortField = 'name' | 'rating' | 'none';
export type SortOrder = 'asc' | 'desc';

export interface SortOption {
    field: SortField;
    order: SortOrder;
    enabled: boolean;
}

export const SORT_OPTIONS = [
    { value: 'none', label: '정렬 없음', field: 'none' as SortField, order: 'asc' as SortOrder },
    { value: 'name-asc', label: '이름 오름차순', field: 'name' as SortField, order: 'asc' as SortOrder },
    { value: 'name-desc', label: '이름 내림차순', field: 'name' as SortField, order: 'desc' as SortOrder },
    { value: 'rating-desc', label: '별점 높은 순', field: 'rating' as SortField, order: 'desc' as SortOrder },
    { value: 'rating-asc', label: '별점 낮은 순', field: 'rating' as SortField, order: 'asc' as SortOrder },
] as const;
