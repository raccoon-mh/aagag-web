// 구조화된 데이터 (JSON-LD) 생성 함수들

export const generateWebsiteStructuredData = () => {
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "애객 세끼 With Web Finder",
        "alternateName": "애객 세끼",
        "description": "전국 15,000개 맛집을 3분 안에 찾는 가장 빠른 맛집 검색 서비스",
        "url": "https://raccoon-mh.github.io/aagag-web/",
        "publisher": {
            "@type": "Organization",
            "name": "애객 세끼 With Web Finder Team",
            "url": "https://raccoon-mh.github.io/aagag-web/"
        },
        "inLanguage": "ko-KR",
        "copyrightYear": "2025",
        "genre": "Food & Dining"
    };
};

export const generateOrganizationStructuredData = () => {
    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "애객 세끼 With Web Finder",
        "url": "https://raccoon-mh.github.io/aagag-web/",
        "logo": "https://raccoon-mh.github.io/aagag-web/logo.png",
        "description": "전국 맛집을 빠르게 찾을 수 있는 검색 서비스",
        "foundingDate": "2025",
        "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer service",
            "availableLanguage": "Korean"
        },
        "sameAs": [
            "https://github.com/raccoon-mh/aagag-web"
        ]
    };
};

export const generateRestaurantStructuredData = (restaurant: any) => {
    return {
        "@context": "https://schema.org",
        "@type": "Restaurant",
        "name": restaurant.name,
        "description": restaurant.summary,
        "address": {
            "@type": "PostalAddress",
            "addressLocality": restaurant.location,
            "addressCountry": "KR"
        },
        "url": restaurant.link,
        "aggregateRating": restaurant.review_star ? {
            "@type": "AggregateRating",
            "ratingValue": restaurant.review_star,
            "bestRating": 5,
            "worstRating": 1
        } : undefined,
        "servesCuisine": restaurant.tags,
        "image": restaurant.review_img || [],
        "priceRange": "$$"
    };
};

export const generateBreadcrumbStructuredData = (items: Array<{ name: string, url: string }>) => {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": item.url
        }))
    };
};

export const generateFAQStructuredData = (faqs: Array<{ question: string, answer: string }>) => {
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    };
};
