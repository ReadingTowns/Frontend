# 홈 화면 개편 설계서

## 1. 개요

리딩타운 홈 화면을 사용자 경험 중심으로 개편하여 동네 기반 책 추천 및 교환 기능을 강화합니다.

## 2. 전체 구조

### 2.1 레이아웃 구성

```
┌─────────────────────────────────────┐
│  상단 탭바 (고정)                      │
│  [---님의 리딩타운] [---님에게 추천]   │
├─────────────────────────────────────┤
│                                     │
│  --- 님의 리딩타운 탭 내용            │
│                                     │
│  1. 동네 인기 도서 Top 10            │
│     (횡스크롤, 클릭시 하단 확장)       │
│                                     │
│  2. 추천 도서 (2개 카드)              │
│     (클릭시 추천도서 탭으로 이동)      │
│                                     │
│  3. 이웃과 교환한 도서 (3개 카드)      │
│     (클릭시 게시글로 이동)            │
│                                     │
│  4. 나의 서재 (6개 카드, 2x3 그리드)  │
│     (클릭시 서재의 책으로 이동)        │
│                                     │
└─────────────────────────────────────┘
```

## 3. 컴포넌트 상세 설계

### 3.1 상단 탭바 (HomeTabs)

**위치**: 화면 최상단 고정
**스타일**: 이미지 #1 참조

#### 기능
- 2개 탭: "---님의 리딩타운", "---님에게 추천하는 도서"
- 탭 전환 시 페이지 전환 없이 콘텐츠 영역만 변경
- 현재 탭 하이라이트 표시

#### 기술 구현
- 컴포넌트: `HomeTabs.tsx`
- 상태 관리: `useState`로 activeTab 관리
- 스타일: Tailwind CSS - 탭 활성화 시 언더라인 또는 배경색 변경

```typescript
interface HomeTabsProps {
  nickname: string;
  activeTab: 'myTown' | 'recommendations';
  onTabChange: (tab: 'myTown' | 'recommendations') => void;
}
```

---

### 3.2 동네 인기 도서 Top 10 섹션

**위치**: --- 님의 리딩타운 탭 최상단
**스타일**: 이미지 #2 참조

#### 기능
- **초기 상태**: 횡스크롤로 10개 도서 표지 표시
- **클릭 시**: 좌우 스크롤 영역이 아래로 펼쳐지며 도서 상세 정보 표시
- 각 도서 카드 클릭 시 → 도서 상세 페이지로 이동

#### UI 요소
- 섹션 제목: "클릭 시 좌우 스크롤 영역 아래로 펼쳐짐"
- 부제목: "가양동 인기 도서 Top 10"
- 도서 카드:
  - 표지 이미지 (회색 플레이스홀더)
  - 제목 텍스트 ("책 제목")

#### 기술 구현
- 컴포넌트: `PopularBooksSection.tsx`
- 상태: `isExpanded` - 확장/축소 토글
- 스크롤: `overflow-x-auto` + `snap-x` (Tailwind)
- 애니메이션: `transition-all duration-300` (확장/축소)

```typescript
interface PopularBook {
  id: string;
  title: string;
  coverImage: string;
  rank: number;
}

interface PopularBooksSectionProps {
  townName: string; // "가양동"
  books: PopularBook[];
}
```

#### API 엔드포인트
```
GET /api/v1/towns/{townId}/popular-books
Response: {
  townName: string;
  books: [
    { id, title, coverImage, rank, author, publisher }
  ]
}
```

---

### 3.3 추천 도서 섹션

**위치**: 인기 도서 섹션 하단
**스타일**: 이미지 #3 참조

#### 기능
- 2개 도서 카드 수평 배치
- "클릭 시 ---님에게 추천하는 도서 탭으로 전환" 텍스트 표시
- 카드 클릭 시 → 상단 탭바의 "추천 도서" 탭으로 자동 전환

#### UI 요소
- 섹션 제목: "---님에게 추천하는 도서"
- 안내 텍스트: "클릭 시 ---님에게 추천하는 도서 탭으로 전환"
- 도서 카드 (2개):
  - 표지 이미지
  - 제목 ("책 제목")

#### 기술 구현
- 컴포넌트: `RecommendedBooksPreview.tsx`
- 클릭 이벤트: `onTabChange('recommendations')`
- 레이아웃: `grid grid-cols-2 gap-4`

```typescript
interface RecommendedBooksPreviewProps {
  nickname: string;
  books: PopularBook[]; // 최대 2개
  onTabChange: (tab: 'recommendations') => void;
}
```

#### API 엔드포인트
```
GET /api/v1/books/recommendations
Response: {
  books: [
    { id, title, coverImage, reason, matchScore }
  ]
}
```

---

### 3.4 이웃과 교환한 도서 섹션

**위치**: 추천 도서 섹션 하단
**스타일**: 이미지 #4 참조

#### 기능
- 3개 도서 카드 횡스크롤
- 각 카드 클릭 시 → 게시글 상세 페이지로 이동

#### UI 요소
- 섹션 제목: "이웃과 교환한 도서"
- 도서 카드 (3개):
  - 표지 이미지
  - 제목 ("책 제목")

#### 기술 구현
- 컴포넌트: `ExchangedBooksSection.tsx`
- 스크롤: `overflow-x-auto flex gap-4`
- 라우팅: `router.push(/posts/${postId})`

```typescript
interface ExchangedBook {
  id: string;
  title: string;
  coverImage: string;
  postId: string;
  exchangeDate: string;
  partnerNickname: string;
}

interface ExchangedBooksSectionProps {
  books: ExchangedBook[];
}
```

#### API 엔드포인트
```
GET /api/v1/members/me/exchanges
Response: {
  exchanges: [
    { id, title, coverImage, postId, exchangeDate, partnerNickname }
  ]
}
```

---

### 3.5 나의 서재 섹션

**위치**: 페이지 하단
**스타일**: 이미지 #6 참조

#### 기능
- 6개 도서 카드 2x3 그리드 배치
- 각 카드에 카테고리 태그 표시 (예: #드라마 #성장소설)
- 카드 클릭 시 → 서재의 해당 책 상세 페이지로 이동

#### UI 요소
- 섹션 제목: "나의 서재"
- 도서 카드 (6개):
  - 표지 이미지
  - 제목 ("책 제목")
  - 카테고리 태그 (#드라마 #성장소설 등)

#### 기술 구현
- 컴포넌트: `MyLibrarySection.tsx`
- 레이아웃: `grid grid-cols-2 gap-4` (모바일 2열)
- 라우팅: `router.push(/library/${bookId})`

```typescript
interface LibraryBook {
  id: string;
  title: string;
  coverImage: string;
  categories: string[]; // ["드라마", "성장소설"]
  readingStatus: 'reading' | 'completed' | 'wish';
}

interface MyLibrarySectionProps {
  books: LibraryBook[];
}
```

#### API 엔드포인트
```
GET /api/v1/bookhouse/members/me?limit=6
Response: {
  books: [
    { id, title, coverImage, categories, readingStatus }
  ]
}
```

---

## 4. 페이지 라우팅 구조

```
/home (새로운 홈 화면)
├── /home#myTown (기본 탭)
├── /home#recommendations (추천 도서 탭)
├── /posts/{postId} (교환 도서 게시글)
├── /library/{bookId} (서재 책 상세)
└── /books/{bookId} (인기 도서 상세)
```

---

## 5. 데이터 흐름

### 5.1 페이지 로드 시
1. 사용자 정보 조회 → 닉네임, 동네 정보 획득
2. 병렬 API 호출:
   - 동네 인기 도서 Top 10
   - 추천 도서 (2개)
   - 교환한 도서 (3개)
   - 나의 서재 (6개)

### 5.2 TanStack Query 활용
```typescript
// useHomeData.ts
export function useHomeData() {
  const { data: popularBooks } = useQuery({
    queryKey: ['popular-books', townId],
    queryFn: () => fetchPopularBooks(townId)
  });

  const { data: recommendations } = useQuery({
    queryKey: ['recommendations'],
    queryFn: fetchRecommendations
  });

  const { data: exchanges } = useQuery({
    queryKey: ['exchanges'],
    queryFn: fetchExchanges
  });

  const { data: library } = useQuery({
    queryKey: ['library'],
    queryFn: () => fetchLibrary({ limit: 6 })
  });

  return { popularBooks, recommendations, exchanges, library };
}
```

---

## 6. 스타일 가이드

### 6.1 컬러
- Primary: `#AFD6F8` (파란색 - 탭바, 버튼)
- Secondary: `#B8DBDE` (청록색 - 카드 배경)
- 배경: `#FFFFFF`

### 6.2 타이포그래피
- 섹션 제목: `text-xl font-bold`
- 부제목: `text-sm text-gray-600`
- 책 제목: `text-base font-medium`
- 카테고리 태그: `text-xs text-gray-500`

### 6.3 간격
- 섹션 간 여백: `mb-8`
- 카드 간 간격: `gap-4`
- 패딩: `px-4 py-6`

---

## 7. 접근성 (A11y)

- 모든 이미지에 `alt` 속성 필수
- 탭 네비게이션 키보드 접근 가능
- 포커스 스타일 명확히 표시
- 색상 대비 비율 WCAG AA 준수

---

## 8. 성능 최적화

- 이미지 lazy loading (`next/image` 사용)
- 횡스크롤 가상화 (react-window 고려)
- TanStack Query 캐싱 전략:
  - staleTime: 5분
  - cacheTime: 10분
- 초기 로딩 시 Skeleton UI 표시

---

## 9. 구현 우선순위

### Phase 1: 기본 구조 (1주)
1. 상단 탭바 컴포넌트
2. 홈 페이지 레이아웃
3. API 엔드포인트 연동

### Phase 2: 섹션 구현 (2주)
1. 동네 인기 도서 섹션 (확장 기능 포함)
2. 추천 도서 섹션
3. 교환한 도서 섹션
4. 나의 서재 섹션

### Phase 3: 인터랙션 & 최적화 (1주)
1. 페이지 전환 애니메이션
2. 스켈레톤 로딩 UI
3. 에러 핸들링
4. 성능 최적화

---

## 10. 테스트 계획

### 10.1 Unit Tests
- 각 섹션 컴포넌트 렌더링 테스트
- 탭 전환 로직 테스트
- API 응답 모킹 테스트

### 10.2 Integration Tests
- 페이지 전체 렌더링 테스트
- 라우팅 테스트
- TanStack Query 캐싱 테스트

### 10.3 E2E Tests (Playwright)
- 사용자 플로우: 홈 → 인기 도서 클릭 → 상세 페이지
- 탭 전환 시나리오
- 횡스크롤 인터랙션

---

## 11. 마일스톤

| 주차 | 목표 | 완료 기준 |
|-----|------|----------|
| 1주 | 기본 구조 완성 | 탭바 + 빈 섹션 렌더링 |
| 2주 | 인기 도서 섹션 | 확장 기능 동작 |
| 3주 | 나머지 섹션 완성 | 모든 섹션 데이터 표시 |
| 4주 | 최적화 & 테스트 | 성능 목표 달성, 테스트 커버리지 80% |

---

## 12. 추가 고려사항

### 12.1 오프라인 대응
- TanStack Query의 `refetchOnReconnect` 활용
- 캐시된 데이터 우선 표시

### 12.2 에러 처리
- API 실패 시 재시도 로직 (3회)
- 에러 바운더리 설정
- 사용자 친화적 에러 메시지

### 12.3 향후 확장 가능성
- 무한 스크롤 지원 (서재 섹션)
- 필터링 기능 (카테고리별, 독서 상태별)
- 개인화 추천 알고리즘 고도화
