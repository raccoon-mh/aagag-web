'use client';

import { MapPin, Heart, Github } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="border-t bg-muted/50">
            <div className="container py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                                <MapPin className="h-5 w-5 text-primary-foreground" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">애객 세끼 With Web Finder</h3>
                                <p className="text-sm text-muted-foreground">3분 안에 맛집 찾기</p>
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            <a href="https://github.com/raccoon-mh/aagag-web" target="_blank" rel="noopener noreferrer">github</a>
                        </p>
                    </div>
                </div>

                <div className="border-t mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                        2025 애객 세끼 With Web Finder.
                    </p>
                    <p className="text-sm text-muted-foreground mt-2 md:mt-0">
                        Made for 애객러들
                    </p>
                </div>
            </div>
        </footer>
    );
}
