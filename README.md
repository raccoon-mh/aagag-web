# aagag-web
> 애객세끼 With Web Finder – 누구나 접근할 수 있는 간단한 정적 웹사이트입니다.
광고나 수익 목적 없이 순수한 정보 공유를 지향합니다.

## 🚀 GitHub Pages 배포

이 프로젝트는 GitHub Pages를 통해 자동으로 배포됩니다.

### 배포 설정

- **Next.js 15** 기반의 정적 웹사이트
- **GitHub Actions**를 통한 자동 배포
- **정적 파일 최적화** 및 SEO 설정

### 로컬 개발

```bash
cd web
npm install
npm run dev
```

### 빌드 및 배포

```bash
cd web
npm run build
npm run deploy
```

## 📁 프로젝트 구조

```
aagag-web/
├── web/                    # Next.js 애플리케이션
│   ├── src/
│   │   ├── app/           # App Router 페이지
│   │   ├── components/    # React 컴포넌트
│   │   ├── hooks/         # 커스텀 훅
│   │   └── lib/           # 유틸리티 함수
│   ├── public/
│   │   └── data/          # JSON 데이터 파일
│   └── package.json
├── .github/
│   └── workflows/         # GitHub Actions 워크플로우
└── README.md
```

## 🛠 기술 스택

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Data**: JSON 파일 기반 정적 데이터
- **Deployment**: GitHub Pages, GitHub Actions

## 📊 데이터

- 서울 지역 맛집 정보 (`seoul.json`)
- 인천 지역 맛집 정보 (`incheon.json`)

## 감사의 말

기초 데이터셋 AAGAG의 제작자 및 기여자 분들께 깊은 감사를 드립니다.
이 프로젝트는 그들의 소중한 작업을 바탕으로 만들어졌습니다.

## 원본 데이터셋
[AAGAG 원본 Google 스프레드시트 보기](https://docs.google.com/spreadsheets/d/1VkCrA0KODJUfr89z8vnWNDJLFz2AtOSGG-JsBLzdGww/edit?gid=1764281125#gid=1764281125)