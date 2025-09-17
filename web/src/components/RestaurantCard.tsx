'use client';

import { MapPin, ExternalLink, Heart, Star, Camera, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Restaurant } from '@/data/restaurants';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { gtmRestaurantClick, gtmFavoriteToggle } from '@/lib/gtm';

interface RestaurantCardProps {
    restaurant: Restaurant;
    onFavorite?: (name: string) => void;
    isFavorite?: boolean;
    currentRegion?: string;
}

export default function RestaurantCard({
    restaurant,
    onFavorite,
    isFavorite = false,
    currentRegion = 'seoul'
}: RestaurantCardProps) {
    const [isAnimating, setIsAnimating] = useState(false);
    const [localIsFavorite, setLocalIsFavorite] = useState(isFavorite);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const naverMapUrl = restaurant.navermapurl || `https://map.naver.com/v5/search/${encodeURIComponent(restaurant.name)}`;

    const hasReviewImages = restaurant.review_img && restaurant.review_img.length > 0;
    const currentImageUrl = hasReviewImages
        ? restaurant.review_img![currentImageIndex]
        : `https://picsum.photos/300/200?random=${restaurant.name.split('').reduce((a, b) => {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a;
        }, 0)}`;

    useEffect(() => {
        setCurrentImageIndex(0);
    }, [restaurant.review_img]);

    useEffect(() => {
        setLocalIsFavorite(isFavorite);
    }, [isFavorite]);

    const handleNaverMapClick = () => {
        // GTM 이벤트 전송
        gtmRestaurantClick(restaurant.name, restaurant.name);
        window.open(restaurant.link, '_blank');
    };

    const handleNaverBlogClick = () => {
        window.open(naverMapUrl, '_blank');
    };

    const handleKakaoMapClick = () => {
        if (restaurant.review_url) {
            window.open(restaurant.review_url, '_blank');
        }
    };

    const handlePreviousImage = () => {
        if (hasReviewImages && restaurant.review_img) {
            setCurrentImageIndex((prev) =>
                prev === 0 ? restaurant.review_img!.length - 1 : prev - 1
            );
        }
    };

    const handleNextImage = () => {
        if (hasReviewImages && restaurant.review_img) {
            setCurrentImageIndex((prev) =>
                prev === restaurant.review_img!.length - 1 ? 0 : prev + 1
            );
        }
    };

    const handleFavoriteClick = () => {
        if (onFavorite) {
            setIsAnimating(true);
            onFavorite(restaurant.name);
            setLocalIsFavorite(!localIsFavorite);
            // GTM 이벤트 전송
            gtmFavoriteToggle(restaurant.name, !localIsFavorite);
            setTimeout(() => {
                setIsAnimating(false);
            }, 300);
        }
    };

    return (
        <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="relative">
                <div className="aspect-video overflow-hidden rounded-t-lg relative">
                    <Image
                        src={currentImageUrl}
                        alt={restaurant.name}
                        width={300}
                        height={200}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {hasReviewImages && restaurant.review_img && restaurant.review_img.length > 1 && (
                        <>
                            <button
                                onClick={handlePreviousImage}
                                className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/50 hover:bg-black/70 text-white opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </button>

                            <button
                                onClick={handleNextImage}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/50 hover:bg-black/70 text-white opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </button>

                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                                {restaurant.review_img.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentImageIndex(index)}
                                        className={`w-2 h-2 rounded-full transition-all duration-200 ${index === currentImageIndex
                                            ? 'bg-white'
                                            : 'bg-white/50 hover:bg-white/75'
                                            }`}
                                    />
                                ))}
                            </div>

                            <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-black/50 text-white text-xs">
                                {currentImageIndex + 1}/{restaurant.review_img.length}
                            </div>
                        </>
                    )}
                </div>

                <button
                    onClick={handleFavoriteClick}
                    className={`absolute top-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-all duration-200 ${isAnimating ? 'scale-110' : 'scale-100'
                        } ${hasReviewImages && restaurant.review_img && restaurant.review_img.length > 1 ? 'top-12' : ''}`}
                >
                    <Heart
                        className={`h-4 w-4 favorite-heart ${localIsFavorite
                            ? 'fill-primary text-primary active'
                            : 'text-muted-foreground hover:text-primary'
                            }`}
                    />
                </button>

            </div>

            <CardContent className="p-3 sm:p-4">
                <h3 className="font-semibold text-base sm:text-lg mb-2 line-clamp-1">
                    {restaurant.name}
                </h3>

                <div className="flex items-center gap-1 text-muted-foreground mb-2">
                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span className="text-xs sm:text-sm truncate">{restaurant.location}</span>
                </div>

                <p className="text-xs sm:text-sm text-muted-foreground mb-3 line-clamp-2">
                    {restaurant.summary}
                </p>

                <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                        <Star className={`h-3 w-3 sm:h-4 sm:w-4 ${restaurant.review_star ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/50'}`} />
                        <span className={`text-xs sm:text-sm font-medium ${restaurant.review_star ? '' : 'text-muted-foreground/50'}`}>
                            {restaurant.review_star ? `${restaurant.review_star}점` : '0점'}
                        </span>
                    </div>

                    <div className="flex items-center gap-1">
                        <Camera className={`h-3 w-3 sm:h-4 sm:w-4 ${restaurant.review_img && restaurant.review_img.length > 0 ? 'text-muted-foreground' : 'text-muted-foreground/50'}`} />
                        <span className={`text-xs sm:text-sm ${restaurant.review_img && restaurant.review_img.length > 0 ? 'text-muted-foreground' : 'text-muted-foreground/50'}`}>
                            {restaurant.review_img && restaurant.review_img.length > 0 ? `${restaurant.review_img.length}장` : '0장'}
                        </span>
                    </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                    {restaurant.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                        </Badge>
                    ))}
                    {restaurant.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                            +{restaurant.tags.length - 3}
                        </Badge>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                        size="sm"
                        className="flex-1 text-xs sm:text-sm"
                        onClick={handleNaverMapClick}
                    >
                        <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        <span className="hidden sm:inline">원본 링크</span>
                        <span className="sm:hidden">원본</span>
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 text-xs sm:text-sm"
                        onClick={handleNaverBlogClick}
                    >
                        <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        <span className="hidden sm:inline">네이버 지도</span>
                        <span className="sm:hidden">네이버</span>
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={handleKakaoMapClick}
                        disabled={!restaurant.review_url}
                        className={`flex-1 text-xs sm:text-sm ${restaurant.review_url
                            ? 'bg-yellow-50 hover:bg-yellow-100 border-yellow-200 text-yellow-800'
                            : 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        <Star className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        <span className="hidden sm:inline">카카오맵</span>
                        <span className="sm:hidden">카카오</span>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
