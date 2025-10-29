# 헤더 시스템 마이그레이션 가이드

## 개요

새로운 통합 헤더 시스템으로 마이그레이션하는 방법을 설명합니다.

## 🚀 빠른 시작

### 1. 기존 코드 (Before)
```tsx
import { useHeader } from '@/contexts/HeaderContext'

export default function MyPage() {
  const { setHeaderContent } = useHeader()

  useEffect(() => {
    setHeaderContent(
      <header className="mb-6">
        <button onClick={() => router.back()}>← 뒤로</button>
        <h1 className="text-2xl font-bold">페이지 제목</h1>
      </header>
    )

    return () => setHeaderContent(null)
  }, [setHeaderContent])
}
```

### 2. 새로운 코드 (After)
```tsx
import { useHeaderConfig } from '@/hooks/useHeaderConfig'

export default function MyPage() {
  // 한 줄로 헤더 설정 완료!
  useHeaderConfig({
    variant: 'navigation',
    title: '페이지 제목'
  })
}
```

## 📋 헤더 변형별 사용법

### Basic Header (제목만)
```tsx
useHeaderConfig({
  variant: 'basic',
  title: '마이페이지'
})
```

### Navigation Header (뒤로가기 + 제목)
```tsx
useHeaderConfig({
  variant: 'navigation',
  title: '나의 서재',
  subtitle: '책을 관리해보세요',  // 선택사항
  onBack: () => router.push('/home')  // 선택사항, 기본값: router.back()
})
```

### Action Header (제목 + 우측 액션)
```tsx
useHeaderConfig({
  variant: 'action',
  title: '서재',
  actions: (
    <button className="p-2">
      <CogIcon className="w-5 h-5" />
    </button>
  )
})
```

### Progress Header (진행 표시)
```tsx
useHeaderConfig({
  variant: 'progress',
  title: '온보딩',
  currentStep: 2,
  totalSteps: 4
})
```

### Chat Header (채팅 특수)
```tsx
useHeaderConfig({
  variant: 'chat',
  partner: {
    id: 123,
    nickname: '김철수',
    profileImage: '/profile.jpg'
  },
  isConnected: true,
  bookInfo: {
    bookName: '클린 코드',
    bookImage: '/book.jpg'
  }
})
```

## 🔄 마이그레이션 체크리스트

### Step 1: Import 변경
```tsx
// Before
import { useHeader } from '@/contexts/HeaderContext'

// After
import { useHeaderConfig } from '@/hooks/useHeaderConfig'
```

### Step 2: useEffect 제거
```tsx
// Before
useEffect(() => {
  setHeaderContent(...)
  return () => setHeaderContent(null)
}, [])

// After
useHeaderConfig({...})  // 자동으로 cleanup 처리됨
```

### Step 3: 헤더 타입 선택
- `basic`: 제목만 있는 단순 헤더
- `navigation`: 뒤로가기 버튼이 있는 헤더 (대부분의 상세 페이지)
- `action`: 우측 액션 버튼이 있는 헤더
- `progress`: 단계 진행 표시가 있는 헤더 (온보딩, 설정 플로우)
- `chat`: 채팅방 전용 특수 헤더

### Step 4: 동적 데이터 처리
```tsx
// 동적 데이터가 있는 경우
const { data: user } = useQuery(...)

useHeaderConfig({
  variant: 'navigation',
  title: user?.nickname || '로딩중...'
}, [user])  // 의존성 배열 추가
```

## 🎨 스타일 커스터마이징

### 기본 스타일
- 높이: 56px (서브타이틀 있으면 72px)
- 배경: 흰색 (bg-white)
- 하단 테두리: border-b border-gray-200
- Sticky 포지션: 항상 상단 고정

### 투명 배경 사용
```tsx
useHeaderConfig({
  variant: 'navigation',
  title: '갤러리',
  transparent: true  // 투명 배경
})
```

### 커스텀 클래스 추가
```tsx
useHeaderConfig({
  variant: 'navigation',
  title: '특별 페이지',
  className: 'bg-gradient-to-r from-primary-400 to-secondary-400'
})
```

## ⚠️ 주의사항

1. **레거시 지원**: 기존 `setHeaderContent`도 당분간 작동합니다
2. **우선순위**: `headerConfig`가 `headerContent`보다 우선합니다
3. **자동 cleanup**: 컴포넌트 언마운트 시 자동으로 헤더가 제거됩니다
4. **TypeScript**: 모든 헤더 설정은 타입 안전합니다

## 📊 마이그레이션 현황

### ✅ 완료된 페이지
- [x] 마이페이지 (/mypage)

### 🔄 진행중
- [ ] 서재 (/library)
- [ ] 채팅 (/chat)
- [ ] 온보딩 (/onboarding)
- [ ] 프로필 편집 (/mypage/profile)
- [ ] 동네 설정 (/mypage/town)
- [ ] 책 추가 (/library/add)
- [ ] 책 상세 (/books/[bookId])
- [ ] 소셜 (/social)
- [ ] 추천 키워드 편집 (/recommendations/keywords/edit)

## 🐛 트러블슈팅

### 헤더가 표시되지 않음
```tsx
// CommonHeader가 ProtectedLayoutClient에 추가되었는지 확인
// src/app/(protected)/ProtectedLayoutClient.tsx
{headerConfig && <CommonHeader />}
```

### 타입 에러 발생
```tsx
// @/types/header 파일이 있는지 확인
// tsconfig.json의 paths 설정 확인
```

### 뒤로가기가 작동하지 않음
```tsx
// onBack 핸들러 확인
useHeaderConfig({
  variant: 'navigation',
  title: '제목',
  onBack: () => console.log('뒤로가기 클릭')  // 디버깅
})
```

## 📚 관련 파일

- `/src/types/header.ts` - 헤더 타입 정의
- `/src/components/layout/CommonHeader.tsx` - 통합 헤더 컴포넌트
- `/src/contexts/HeaderContext.tsx` - 헤더 컨텍스트
- `/src/hooks/useHeaderConfig.ts` - 헤더 설정 훅
- `/src/app/(protected)/ProtectedLayoutClient.tsx` - 레이아웃 통합