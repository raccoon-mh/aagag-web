'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Clock, Zap, Users, Heart } from 'lucide-react';
import Link from 'next/link';

export default function About() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="bg-gradient-to-br from-primary/5 to-accent/5 py-16">
                    <div className="container">
                        <div className="max-w-3xl mx-auto text-center">
                            <h1 className="text-4xl md:text-6xl font-bold mb-6">
                                애객 세끼 With Web Finder
                            </h1>
                            <p className="text-xl text-muted-foreground mb-8">
                                3분 안에 맛집을 찾는 가장 빠른 방법
                            </p>
                            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-2">
                                    <Zap className="h-4 w-4" />
                                    1초 이하 로딩
                                </span>
                                <span className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    3분 안에 결정
                                </span>
                                <span className="flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    DAU 1,000명 목표
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Problem & Solution */}
                <section className="py-16">
                    <div className="container">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl font-bold mb-6">문제점</h2>
                                <div className="space-y-4 text-muted-foreground">
                                    <p>
                                        인터넷과 앱에 흩어진 방대한 맛집 정보 때문에
                                        <strong className="text-foreground"> 결정 시간이 길어집니다.</strong>
                                    </p>
                                    <p>
                                        광고와 협찬 리뷰로 인해 신뢰도가 낮아져
                                        <strong className="text-foreground"> 빠른 의사결정이 어렵습니다.</strong>
                                    </p>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-3xl font-bold mb-6">해결책</h2>
                                <div className="space-y-4 text-muted-foreground">
                                    <p>
                                        방대한 맛집 데이터를
                                        <strong className="text-foreground"> 카드 리스트 + 태그·검색 필터</strong> UI에 집약합니다.
                                    </p>
                                    <p>
                                        상세 페이지 대신
                                        <strong className="text-foreground"> 외부(네이버 지도) 링크</strong>로
                                        추가 정보를 연결해 탐색 단계를 최소화합니다.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features */}
                <section className="py-16 bg-muted/50">
                    <div className="container">
                        <h2 className="text-3xl font-bold text-center mb-12">핵심 기능</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Zap className="h-8 w-8 text-primary" />
                                </div>
                                <h3 className="font-semibold mb-2">초경량 로딩</h3>
                                <p className="text-sm text-muted-foreground">
                                    스태틱 JSON과 Lazy Load로 1초 이하 로딩
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Clock className="h-8 w-8 text-accent" />
                                </div>
                                <h3 className="font-semibold mb-2">빠른 탐색</h3>
                                <p className="text-sm text-muted-foreground">
                                    태그와 필터로 3분 안에 맛집 결정
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Users className="h-8 w-8 text-secondary-foreground" />
                                </div>
                                <h3 className="font-semibold mb-2">광고 없는 환경</h3>
                                <p className="text-sm text-muted-foreground">
                                    깔끔한 UI로 신뢰할 수 있는 정보만 제공
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Heart className="h-8 w-8 text-primary" />
                                </div>
                                <h3 className="font-semibold mb-2">즐겨찾기</h3>
                                <p className="text-sm text-muted-foreground">
                                    마음에 드는 맛집을 저장하고 관리
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats */}
                <section className="py-16">
                    <div className="container">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                            <div>
                                <div className="text-4xl font-bold text-primary mb-2">15,000+</div>
                                <p className="text-muted-foreground">전국 맛집 데이터</p>
                            </div>
                            <div>
                                <div className="text-4xl font-bold text-primary mb-2">50+</div>
                                <p className="text-muted-foreground">지역 커버</p>
                            </div>
                            <div>
                                <div className="text-4xl font-bold text-primary mb-2">1초</div>
                                <p className="text-muted-foreground">초기 로딩 시간</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-16 bg-primary/5">
                    <div className="container text-center">
                        <h2 className="text-3xl font-bold mb-4">
                            지금 바로 맛집을 찾아보세요!
                        </h2>
                        <p className="text-muted-foreground mb-8">
                            3분 안에 마음에 드는 맛집을 찾을 수 있습니다.
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                        >
                            맛집 탐색하기
                        </Link>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
