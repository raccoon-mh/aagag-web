// Google Tag Manager 유틸리티 함수들

declare global {
    interface Window {
        dataLayer: any[];
    }
}

// GTM 이벤트 전송 함수
export const gtmEvent = (eventName: string, parameters?: Record<string, any>) => {
    if (typeof window !== 'undefined' && window.dataLayer) {
        window.dataLayer.push({
            event: eventName,
            ...parameters,
        });
    }
};

// 페이지뷰 이벤트
export const gtmPageView = (url: string, title?: string) => {
    gtmEvent('page_view', {
        page_title: title || document.title,
        page_location: url,
    });
};

// 사용자 액션 이벤트들
export const gtmSearch = (searchTerm: string, resultsCount?: number) => {
    gtmEvent('search', {
        search_term: searchTerm,
        results_count: resultsCount,
    });
};

export const gtmRestaurantClick = (restaurantName: string, restaurantId?: string) => {
    gtmEvent('restaurant_click', {
        restaurant_name: restaurantName,
        restaurant_id: restaurantId,
    });
};

export const gtmFilterChange = (filterType: string, filterValue: string) => {
    gtmEvent('filter_change', {
        filter_type: filterType,
        filter_value: filterValue,
    });
};

export const gtmFavoriteToggle = (restaurantName: string, isFavorite: boolean) => {
    gtmEvent('favorite_toggle', {
        restaurant_name: restaurantName,
        is_favorite: isFavorite,
    });
};
