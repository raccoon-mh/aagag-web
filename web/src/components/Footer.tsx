'use client';

import { MapPin, Heart, Github } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="border-t bg-muted/50">
            <div className="container py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand */}
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
                            https://github.com/raccoon-mh/aagag-web
                        </p>
                    </div>

                    {/* Quick Links */}
                    {/* <div className="space-y-4">
                        <h4 className="font-semibold">서비스</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a href="/" className="text-muted-foreground hover:text-primary transition-colors">
                                    홈
                                </a>
                            </li>
                            <li>
                                <a href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                                    서비스 소개
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                    이용약관
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                    개인정보처리방침
                                </a>
                            </li>
                        </ul>
                    </div> */}

                    {/* Contact & Support */}
                    {/* <div className="space-y-4">
                        <h4 className="font-semibold">지원</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                    문의하기
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                    피드백
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                    오픈소스
                                </a>
                            </li>
                        </ul>

                        <div className="flex items-center space-x-2 pt-4">
                            <a
                                href="https://github.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                            >
                                <Github className="h-4 w-4" />
                            </a>
                            <a
                                href="#"
                                className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                            >
                                <Heart className="h-4 w-4 text-red-500" />
                            </a>
                        </div>
                    </div> */}
                </div>

                {/* Bottom */}
                <div className="border-t mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                        2024 애객 세끼 With Web Finder.
                    </p>
                    <p className="text-sm text-muted-foreground mt-2 md:mt-0">
                        Made for 애객러들
                    </p>
                </div>
            </div>
        </footer>
    );
}
