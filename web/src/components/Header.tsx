'use client';

import React from 'react';
import { Search, MapPin } from 'lucide-react';
import Link from 'next/link';

interface HeaderProps {
    currentRegion?: string;
}

export default function Header({ currentRegion = 'seoul' }: HeaderProps) {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6">
                <div className="flex items-center space-x-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                        <MapPin className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-lg sm:text-xl font-bold text-primary">애객 세끼 With Web Finder</h1>
                        <p className="text-xs text-muted-foreground hidden sm:block">3분 안에 맛집 찾기</p>
                    </div>
                </div>

                <nav className="hidden md:flex items-center space-x-6">
                    <Link
                        href="/"
                        className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                    >
                        홈
                    </Link>
                    <Link
                        href="/about"
                        className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                    >
                        서비스 소개
                    </Link>
                </nav>

                <div className="md:hidden">
                    <button className="p-2">
                        <Search className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </header>
    );
}
