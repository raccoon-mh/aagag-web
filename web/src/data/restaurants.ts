export interface Restaurant {
    name: string;
    location: string;
    link: string;
    summary: string;
    tags: string[];
    navermapurl?: string;
    review_star?: number | null;
    review_img?: string[];
    review_url?: string;
}

export interface RestaurantData {
    metadata: {
        parsed_at: string;
        total_groups: number;
        source: string;
        has_actual_links: boolean;
        has_naver_map_urls?: boolean;
        has_kakao_reviews?: boolean;
        has_kakao_map_urls?: boolean;
    };
    data: Restaurant[];
}

