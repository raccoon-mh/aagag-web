'use client';

import { useState, useEffect, useMemo } from 'react';
import { Restaurant, RestaurantData } from '@/data/restaurants';

const getBasePath = () => {
    return process.env.NODE_ENV === 'production' ? '/aagag-web' : '';
};

const getAssetPrefix = () => {
    return process.env.NODE_ENV === 'production' ? '/aagag-web' : '';
};

interface UseFetchDataResult {
    data: Restaurant[];
    metadata: RestaurantData['metadata'] | null;
    loading: boolean;
    error: string | null;
    refetch: () => void;
    lastUpdated: string | null;
    totalCount: number;
    source: string | null;
}

export function useFetchData(region: string = 'seoul'): UseFetchDataResult {
    const [restaurantData, setRestaurantData] = useState<RestaurantData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            const basePath = getBasePath();
            const response = await fetch(`${basePath}/data/${region}.json`);

            if (!response.ok) {
                throw new Error(`Failed to fetch data: ${response.status}`);
            }

            const jsonData: RestaurantData = await response.json();
            setRestaurantData(jsonData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error occurred');
            console.error('Error fetching restaurant data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [region]);

    const refetch = () => {
        fetchData();
    };

    // 메모이제이션으로 성능 최적화
    const result = useMemo(() => ({
        data: restaurantData?.data || [],
        metadata: restaurantData?.metadata || null,
        loading,
        error,
        refetch,
        lastUpdated: restaurantData?.metadata?.parsed_at || null,
        totalCount: restaurantData?.metadata?.total_groups || 0,
        source: restaurantData?.metadata?.source || null
    }), [restaurantData, loading, error]);

    return result;
}

// 지역별 데이터를 미리 로드하는 훅 (대용량 데이터 최적화)
export function usePreloadData(regions: string[] = ['seoul']) {
    const [preloadedData, setPreloadedData] = useState<Record<string, RestaurantData>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadAllData = async () => {
            try {
                setLoading(true);

                // 병렬로 모든 지역 데이터 로드 (Next.js basePath 설정 반영)
                const basePath = getBasePath();
                const dataPromises = regions.map(async (region) => {
                    const response = await fetch(`${basePath}/data/${region}.json`);
                    if (!response.ok) {
                        throw new Error(`Failed to fetch ${region} data`);
                    }
                    const data: RestaurantData = await response.json();
                    return { region, data };
                });

                const results = await Promise.all(dataPromises);
                const dataMap = results.reduce((acc, { region, data }) => {
                    acc[region] = data;
                    return acc;
                }, {} as Record<string, RestaurantData>);

                setPreloadedData(dataMap);
            } catch (err) {
                console.error('Error preloading data:', err);
            } finally {
                setLoading(false);
            }
        };

        loadAllData();
    }, [regions]);

    return {
        preloadedData,
        loading
    };
}

// 사용 가능한 지역 목록을 가져오는 훅 (정적 목록)
export function useAvailableRegions() {
    const [regions] = useState<Array<{ key: string, source: string }>>([
        { key: 'owner', source: '주인장👍' },
        { key: 'seoul', source: '서울' },
        { key: 'incheon', source: '인천' },
        { key: 'gyeongsangnam-do', source: '경상남도' },
        { key: 'jeollanam-do', source: '전라남도' },
        { key: 'gyeongsangbuk-do', source: '경상북도' },
        { key: 'jeollabuk-do', source: '전라북도' },
        { key: 'chungcheongnam-do', source: '충청남도' },
        { key: 'uijeongbu', source: '의정부' },
        { key: 'namyangju', source: '남양주' },
        { key: 'dongducheon', source: '동두천' },
        { key: 'gwangju_gyeonggi', source: '경기 광주' },
        { key: 'goseong_gangwon', source: '강원 고성' },
        { key: 'goseong_gyeongsangnam', source: '경남 고성' },
        { key: 'cheongyang', source: '청양' },
        { key: 'goesan', source: '괴산' },
        { key: 'muju', source: '무주' },
        { key: 'gwangyang', source: '광양' },
        { key: 'pohang', source: '포항' },
        { key: 'tongyeong', source: '통영' },
        { key: 'jindo', source: '진도' },
        { key: 'hapcheon', source: '합천' },
        { key: 'yeongam', source: '영암' },
        { key: 'pocheon', source: '포천' },
        { key: 'naju', source: '나주' },
        { key: 'gunpo', source: '군포' },
        { key: 'boeun', source: '보은' },
        { key: 'yeongdeok', source: '영덕' },
        { key: 'yecheon', source: '예천' },
        { key: 'yeosu', source: '여수' },
        { key: 'cheongju', source: '청주' },
        { key: 'seongju', source: '성주' },
        { key: 'jecheon', source: '제천' },
        { key: 'jangsu', source: '장수' },
        { key: 'yongin', source: '용인' },
        { key: 'inje', source: '인제' },
        { key: 'hwacheon', source: '화천' },
        { key: 'changnyeong', source: '창녕' },
        { key: 'gangneung', source: '강릉' },
        { key: 'jeongeup', source: '정읍' },
        { key: 'sokcho', source: '속초' },
        { key: 'cheorwon', source: '철원' },
        { key: 'yeongwol', source: '영월' },
        { key: 'jeonju', source: '전주' },
        { key: 'gimje', source: '김제' },
        { key: 'jangseong', source: '장성' },
        { key: 'boseong', source: '보성' },
        { key: 'asan', source: '아산' },
        { key: 'gunsan', source: '군산' },
        { key: 'icheon', source: '이천' },
        { key: 'sacheon', source: '사천' },
        { key: 'ansan', source: '안산' },
        { key: 'haenam', source: '해남' },
        { key: 'sejong', source: '세종' },
        { key: 'hwaseong', source: '화성' },
        { key: 'muan', source: '무안' },
        { key: 'gurye', source: '구례' },
        { key: 'chuncheon', source: '춘천' },
        { key: 'yangpyeong', source: '양평' },
        { key: 'gimpo', source: '김포' },
        { key: 'ulleung', source: '울릉' },
        { key: 'hanam', source: '하남' },
        { key: 'gyeongju', source: '경주' },
        { key: 'seongnam', source: '성남' },
        { key: 'taebaek', source: '태백' },
        { key: 'gongju', source: '공주' },
        { key: 'samcheok', source: '삼척' },
        { key: 'hongseong', source: '홍성' },
        { key: 'sangju', source: '상주' },
        { key: 'anseong', source: '안성' },
        { key: 'wanju', source: '완주' },
        { key: 'yanggu', source: '양구' },
        { key: 'gochang', source: '고창' },
        { key: 'nonsan', source: '논산' },
        { key: 'suncheon', source: '순천' },
        { key: 'gapyeong', source: '가평' },
        { key: 'gangjin', source: '강진' },
        { key: 'changwon', source: '창원' },
        { key: 'jincheon', source: '진천' },
        { key: 'hwasun', source: '화순' },
        { key: 'wando', source: '완도' },
        { key: 'buan', source: '부안' },
        { key: 'boryeong', source: '보령' },
        { key: 'uiwang', source: '의왕' },
        { key: 'hoengseong', source: '횡성' },
        { key: 'jeungpyeong', source: '증평' },
        { key: 'andong', source: '안동' },
        { key: 'chilgok', source: '칠곡' },
        { key: 'wonju', source: '원주' },
        { key: 'bucheon', source: '부천' },
        { key: 'sancheong', source: '산청' },
        { key: 'seocheon', source: '서천' },
        { key: 'iksan', source: '익산' },
        { key: 'geumsan', source: '금산' },
        { key: 'uiryeong', source: '의령' },
        { key: 'geochang', source: '거창' },
        { key: 'jeongseon', source: '정선' },
        { key: 'siheung', source: '시흥' },
        { key: 'guri', source: '구리' },
        { key: 'jinju', source: '진주' },
        { key: 'yeongyang', source: '영양' },
        { key: 'hadong', source: '하동' },
        { key: 'haman', source: '함안' },
        { key: 'namhae', source: '남해' },
        { key: 'goheung', source: '고흥' },
        { key: 'jeju', source: '제주' },
        { key: 'gimhae', source: '김해' },
        { key: 'osan', source: '오산' },
        { key: 'donghae', source: '동해' },
        { key: 'seosan', source: '서산' },
        { key: 'pyeongchang', source: '평창' },
        { key: 'anyang', source: '안양' },
        { key: 'gimcheon', source: '김천' },
        { key: 'gokseong', source: '곡성' },
        { key: 'yangju', source: '양주' },
        { key: 'gumi', source: '구미' },
        { key: 'imsil', source: '임실' },
        { key: 'buyeo', source: '부여' },
        { key: 'yeongdong', source: '영동' },
        { key: 'damyang', source: '담양' },
        { key: 'yeoju', source: '여주' },
        { key: 'paju', source: '파주' },
        { key: 'namwon', source: '남원' },
        { key: 'yeoncheon', source: '연천' },
        { key: 'jinan', source: '진안' },
        { key: 'danyang', source: '단양' },
        { key: 'mungyeong', source: '문경' },
        { key: 'busan', source: '부산' },
        { key: 'yeongju', source: '영주' },
        { key: 'daejeon', source: '대전' },
        { key: 'taean', source: '태안' },
        { key: 'hamyang', source: '함양' },
        { key: 'uljin', source: '울진' },
        { key: 'gwangmyeong', source: '광명' },
        { key: 'cheongdo', source: '청도' },
        { key: 'gyeryong', source: '계룡' },
        { key: 'yeongcheon', source: '영천' },
        { key: 'goryeong', source: '고령' },
        { key: 'gyeongsan', source: '경산' },
        { key: 'dangjin', source: '당진' },
        { key: 'jangheung', source: '장흥' },
        { key: 'sunchang', source: '순창' },
        { key: 'daegu', source: '대구' },
        { key: 'gwangju', source: '광주' },
        { key: 'yeonggwang', source: '영광' },
        { key: 'hampyeong', source: '함평' },
        { key: 'goyang', source: '고양' },
        { key: 'suwon', source: '수원' },
        { key: 'sinan', source: '신안' },
        { key: 'pyeongtaek', source: '평택' },
        { key: 'chungju', source: '충주' },
        { key: 'uiseong', source: '의성' },
        { key: 'hongcheon', source: '홍천' },
        { key: 'miryang', source: '밀양' },
        { key: 'cheongsong', source: '청송' },
        { key: 'yangyang', source: '양양' },
        { key: 'bonghwa', source: '봉화' },
        { key: 'okcheon', source: '옥천' },
        { key: 'geoje', source: '거제' },
        { key: 'ulsan', source: '울산' },
        { key: 'yangsan', source: '양산' },
        { key: 'yesan', source: '예산' },
        { key: 'cheonan', source: '천안' },
        { key: 'eumseong', source: '음성' },
        { key: 'mokpo', source: '목포' }
    ]);

    return {
        regions,
        loading: false
    };
}
