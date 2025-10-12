# Snackbar 시스템 사용 가이드

## 개요

`alert()`를 대체하는 전역 스낵바 시스템입니다. Context API 기반으로 구현되어 전역 어디서나 사용 가능합니다.

## 주요 특징

- ✅ **비차단 알림**: 사용자 작업을 방해하지 않음
- ✅ **4가지 타입**: success, error, warning, info
- ✅ **자동 제거**: 기본 3초 후 자동 제거 (커스터마이즈 가능)
- ✅ **애니메이션**: 부드러운 슬라이드 인/아웃
- ✅ **모바일 최적화**: 430px 고정 너비, 하단 중앙 배치
- ✅ **다크모드 지원**: 자동 테마 대응
- ✅ **접근성**: ARIA 속성 포함

## 기본 사용법

### 1. 훅 임포트

```typescript
import { useSnackbar } from '@/hooks/useSnackbar'
```

### 2. 컴포넌트에서 사용

```tsx
function MyComponent() {
  const { showSuccess, showError, showWarning, showInfo } = useSnackbar()

  const handleSuccess = () => {
    showSuccess('작업이 완료되었습니다!')
  }

  const handleError = () => {
    showError('오류가 발생했습니다.')
  }

  return (
    <div>
      <button onClick={handleSuccess}>성공 알림</button>
      <button onClick={handleError}>에러 알림</button>
    </div>
  )
}
```

## API 레퍼런스

### useSnackbar()

반환하는 메서드들:

#### showSuccess(message, duration?)
성공 메시지 표시 (녹색)

```typescript
showSuccess('저장되었습니다!')
showSuccess('저장되었습니다!', 5000) // 5초 동안 표시
```

#### showError(message, duration?)
에러 메시지 표시 (빨간색)

```typescript
showError('저장에 실패했습니다.')
showError('네트워크 오류입니다.', 4000)
```

#### showWarning(message, duration?)
경고 메시지 표시 (노란색)

```typescript
showWarning('파일 크기를 확인해주세요.')
```

#### showInfo(message, duration?)
정보 메시지 표시 (파란색)

```typescript
showInfo('처리 중입니다...')
```

#### showSnackbar(message, type, duration?)
범용 메서드 (타입 직접 지정)

```typescript
showSnackbar('메시지', 'success', 3000)
```

**매개변수:**
- `message` (string): 표시할 메시지
- `duration` (number, optional): 표시 시간 (ms), 기본값 3000ms

## 실전 예시

### 1. API 호출 성공/실패 처리

```typescript
import { useSnackbar } from '@/hooks/useSnackbar'
import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'

function BookForm() {
  const { showSuccess, showError } = useSnackbar()

  const mutation = useMutation({
    mutationFn: (data) => api.post('/api/v1/books', data),
    onSuccess: () => {
      showSuccess('책이 등록되었습니다!')
    },
    onError: (error) => {
      showError('책 등록에 실패했습니다.')
    }
  })

  return <form onSubmit={mutation.mutate}>...</form>
}
```

### 2. 유효성 검증

```typescript
function ReviewForm() {
  const { showWarning, showSuccess } = useSnackbar()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!reviewText.trim()) {
      showWarning('감상평을 입력해주세요.')
      return
    }

    try {
      await saveReview(reviewText)
      showSuccess('감상평이 저장되었습니다!')
    } catch (error) {
      showError('저장에 실패했습니다.')
    }
  }

  return <form onSubmit={handleSubmit}>...</form>
}
```

### 3. 파일 업로드 검증

```typescript
function ImageUpload() {
  const { showError } = useSnackbar()

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      showError('파일 크기는 5MB 이하여야 합니다.')
      return
    }

    if (!file.type.startsWith('image/')) {
      showError('이미지 파일만 업로드 가능합니다.')
      return
    }

    // 업로드 처리...
  }

  return <input type="file" onChange={handleFileChange} />
}
```

### 4. 비동기 작업 진행 상황

```typescript
function DataSync() {
  const { showInfo, showSuccess, showError } = useSnackbar()

  const handleSync = async () => {
    showInfo('동기화 중입니다...')

    try {
      await syncData()
      showSuccess('동기화가 완료되었습니다!')
    } catch (error) {
      showError('동기화에 실패했습니다.')
    }
  }

  return <button onClick={handleSync}>동기화</button>
}
```

## alert() 마이그레이션 가이드

### Before (alert)

```typescript
// ❌ 차단 알림
alert('저장되었습니다!')
alert('오류가 발생했습니다.')
```

### After (Snackbar)

```typescript
// ✅ 비차단 알림
const { showSuccess, showError } = useSnackbar()

showSuccess('저장되었습니다!')
showError('오류가 발생했습니다.')
```

## 스타일 커스터마이징

스낵바 색상은 Tailwind CSS 설정을 따릅니다:

- **Success**: Green (bg-green-50, border-green-200)
- **Error**: Red (bg-red-50, border-red-200)
- **Warning**: Yellow (bg-yellow-50, border-yellow-200)
- **Info**: Blue (bg-blue-50, border-blue-200)

다크모드는 자동으로 대응됩니다.

## 주의사항

1. **Provider 필수**: `SnackbarProvider`가 상위에 있어야 합니다 (이미 `src/app/providers/index.tsx`에 적용됨)
2. **클라이언트 컴포넌트**: `'use client'` 디렉티브 필요
3. **메시지 중복**: 같은 메시지를 여러 번 호출하면 모두 표시됩니다
4. **duration = 0**: 자동 제거 비활성화 (수동 닫기만 가능)

## 파일 구조

```
src/
├── types/
│   └── snackbar.ts              # 타입 정의
├── contexts/
│   └── SnackbarContext.tsx      # Context 및 Provider
├── components/
│   └── common/
│       └── SnackbarContainer.tsx # UI 컴포넌트
├── hooks/
│   └── useSnackbar.ts           # 훅 (재export)
└── app/
    └── providers/
        └── index.tsx            # Provider 통합
```

## 트러블슈팅

### "useSnackbar must be used within a SnackbarProvider" 에러

**원인**: SnackbarProvider 외부에서 useSnackbar 호출

**해결**: 컴포넌트가 SnackbarProvider 내부에 있는지 확인

### 스낵바가 표시되지 않음

1. Provider가 정상 적용되었는지 확인
2. `'use client'` 디렉티브 확인
3. 브라우저 콘솔에서 에러 확인

### 여러 개의 스낵바가 겹침

**정상 동작**: 여러 알림을 동시에 표시할 수 있습니다. 최대 개수 제한을 원하면 `SnackbarContext.tsx`에서 `setMessages` 로직 수정 가능.

## 다음 단계

- [ ] 프로젝트 전체에서 `alert()` → `useSnackbar()` 마이그레이션
- [ ] 애니메이션 커스터마이징 (선택)
- [ ] 최대 스낵바 개수 제한 (선택)
- [ ] Toast 음향 효과 추가 (선택)
