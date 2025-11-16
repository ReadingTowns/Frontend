# TypeScript 의존성 분석 보고서

**분석 일시**: 2025-11-17
**분석 도구**: Knip v5.69.1, madge v8.0.0

---

## 📊 분석 결과 요약

### 순환 의존성 (Circular Dependencies)
✅ **문제 없음** - 순환 의존성이 발견되지 않았습니다.

### 미사용 코드 탐지 결과

| 항목 | 개수 | 비고 |
|------|------|------|
| 미사용 파일 | 21개 | 전체 삭제 가능 |
| 미사용 dependencies | 2개 | package.json에서 제거 권장 |
| 미사용 devDependencies | 1개 | package.json에서 제거 권장 |
| Unlisted dependencies | 2개 | package.json에 추가 필요 |
| 미사용 exports | 32개 | 코드 정리 권장 |
| 미사용 exported types | 65개 | 타입 정리 권장 |

---

## 🗑️ 미사용 파일 (21개)

### 테스트 설정 파일
- `jest.setup.js` - Jest 설정 파일 (테스트가 "No tests yet" 상태이므로 현재 미사용)

### 채팅 관련 중복/미사용 컴포넌트 (7개)
```
src/app/(protected)/chat/components/ChatRoom.tsx
src/app/(protected)/chat/components/UserResultCard.tsx
src/app/(protected)/chat/components/UserSearchModal.tsx
src/app/(protected)/social/components/ChatRoom.tsx
src/app/(protected)/social/components/MessageBubble.tsx
src/app/(protected)/social/components/MessageInput.tsx
src/app/(protected)/social/components/UserResultCard.tsx
```

**권장 조치**: chat과 social에 중복된 컴포넌트가 있습니다. 실제 사용 중인 버전 확인 후 미사용 버전 삭제.

### 온보딩 키워드 관련 (4개)
```
src/components/onboarding/Keywords1Step.tsx
src/components/onboarding/Keywords2Step.tsx
src/components/onboarding/Keywords3Step.tsx
src/components/onboarding/KeywordsStep.tsx
```

**권장 조치**: 온보딩 프로세스에서 키워드 선택 기능이 제거되었다면 삭제.

### Hooks (5개)
```
src/hooks/useKeywordOnboarding.ts
src/hooks/useKeywordStatus.ts
src/hooks/useMyLibrary.ts
src/hooks/useUserRecommendations.ts
src/hooks/useVideoSearch.ts
```

**권장 조치**: 기능 제거 시 관련 hooks도 함께 삭제.

### 유틸리티 및 타입 (4개)
```
src/lib/keywordStorage.ts
src/services/userSearchService.ts
src/types/keyword.ts
src/types/userSearch.ts
```

**권장 조치**: 키워드 및 유저 검색 기능 제거 시 함께 삭제.

---

## 📦 의존성 문제

### 미사용 Dependencies (삭제 권장)
```json
"date-fns": "^4.1.0",         // package.json:29:6
"tailwind-merge": "^3.3.1"    // package.json:35:6
```

**영향**: 번들 크기 증가
**권장 조치**: `npm uninstall date-fns tailwind-merge`

### 미사용 DevDependencies (삭제 권장)
```json
"eslint-config-next": "15.4.5"  // package.json:46:6
```

**비고**: Next.js 15.4.5의 ESLint는 별도의 config 패키지가 필요 없을 수 있음.
**권장 조치**: ESLint 동작 확인 후 삭제.

### Unlisted Dependencies (추가 필요)
```json
"postcss": "latest",           // postcss.config.mjs에서 사용
"@zxing/library": "latest"     // src/app/(protected)/library/add/components/ISBNScanner.tsx:6:48
```

**권장 조치**: `npm install postcss @zxing/library`

---

## 🔧 미사용 Exports (32개)

### UI 컴포넌트
- `Skeleton` (src/components/ui/Skeleton.tsx:5:14)
- `BookCardSkeleton` (src/components/ui/Skeleton.tsx:9:14)
- `HeaderSkeleton` (src/components/ui/Skeleton.tsx:30:14)
- `LibraryStatsSkeleton` (src/components/ui/Skeleton.tsx:38:14)

**권장 조치**: 실제 사용하지 않는다면 export 제거 또는 파일 삭제.

### API/서비스 관련
- `API_MESSAGES` (src/constants/apiCodes.ts:17:14)
- `ApiError` (src/lib/api.ts:45:14)
- `apiClient` (src/lib/api.ts:285:10)
- `ExchangeService` (src/services/exchangeService.ts:38:14)
- `WebSocketService` (src/services/websocketService.ts:53:14)

### Hooks
- `useBookDetail` (src/hooks/useBookDetail.ts:11:17)
- `useMyBookReview` (src/hooks/useBookDetail.ts:26:17)
- `useCompleteExchange` (src/hooks/useChatRoom.ts:201:14)
- `useReturnExchange` (src/hooks/useChatRoom.ts:221:14)
- `useAvailableBooks` (src/hooks/useExchange.ts:33:17)
- `useDeleteLibraryBook` (src/hooks/useLibrary.ts:148:17)
- `useBookReview` (src/hooks/useLibrary.ts:215:17)
- `useAddBookReview` (src/hooks/useLibrary.ts:255:17)
- `useUpdateBookReview` (src/hooks/useLibrary.ts:296:17)
- `useLibrary` (src/hooks/useLibrary.ts:339:17)

**권장 조치**:
- 미래에 사용할 계획이라면 유지
- 사용하지 않는다면 export 제거 (함수는 유지 가능)

### 유틸리티 함수
- `isValidISBN` (src/lib/isbnService.ts:72:17)
- `formatISBN` (src/lib/isbnService.ts:82:17)
- `createQueryClient` (src/lib/queryClient.ts:3:17)
- `showCategoryToast` (src/lib/toast.ts:115:14)
- `getTownInfo` (src/services/townService.ts:7:23)
- `shouldRenderAsSeparateMessage` (src/utils/exchangeMessageUtils.ts:55:17)
- `josa_i_ga`, `josa_eul_reul`, `josa_eun_neun` (src/utils/koreanParticle.ts)

---

## 📋 미사용 Exported Types (65개)

### 주요 타입 정리 대상

#### API Response 타입
- `ApiResponse` (src/lib/api.ts:35:18)
- `LibraryBooksApiResponse` (src/types/library.ts:25:13)
- `UserProfileApiResponse` (src/types/library.ts:56:13)
- `ExchangerReviewsApiResponse` (src/types/library.ts:100:13)
- 등 다수

#### 컴포넌트 Props 타입
- `ModalProps` (src/components/common/Modal.tsx:7:18)
- `BookReviewModalProps` (src/types/library.ts:121:18)
- `LibraryStatsProps` (src/types/library.ts:130:18)
- 등 다수

#### 도메인 타입
- `ExchangeStatus` (src/types/exchange.ts:24:13)
- `ExchangeBook` (src/types/exchange.ts:37:18)
- `ChatRoomStatus` (src/types/chatroom.ts:209:13)
- 등 다수

**권장 조치**:
- 내부 구현에서만 사용되는 타입은 export 제거
- 실제 사용되지 않는 타입은 삭제
- API 타입은 백엔드 계약상 필요하다면 유지

---

## 🎯 권장 조치 단계

### Phase 1: 안전한 정리 (즉시 실행 가능)
1. **미사용 dependencies 삭제**
   ```bash
   npm uninstall date-fns tailwind-merge eslint-config-next
   ```

2. **누락된 dependencies 추가**
   ```bash
   npm install postcss @zxing/library
   ```

3. **ESLint 검증**
   ```bash
   npm run lint
   ```

### Phase 2: 코드 검토 (수동 확인 필요)
1. **미사용 파일 검토**
   - chat/social 중복 컴포넌트 확인
   - 온보딩 키워드 기능 사용 여부 확인
   - 확인 후 삭제

2. **미사용 exports/types 검토**
   - 각 파일별로 실제 사용 여부 확인
   - export 제거 또는 파일 삭제

### Phase 3: 자동 정리 (Knip 활용)
```bash
# 안전하게 수정 가능한 항목 자동 제거
npx knip --fix

# 변경사항 확인
git diff

# 문제없으면 커밋
git add .
git commit -m "chore: remove unused code detected by Knip"
```

---

## 🔄 지속적 관리

### 정기 분석 권장
```bash
# 매주 또는 매 sprint마다 실행
npm run analyze:all
```

### Git Hooks 통합 (선택사항)
`.husky/pre-push`에 추가:
```bash
#!/bin/sh
npm run analyze:circular
```

### CI/CD 통합 (선택사항)
GitHub Actions에 추가:
```yaml
- name: Check for unused code
  run: npm run analyze:unused
```

---

## 📈 예상 효과

### 코드 정리 후 예상 개선
- **번들 크기 감소**: ~10-15% (미사용 dependencies 제거)
- **코드베이스 간소화**: ~20% (미사용 파일 21개 삭제)
- **타입 안전성 향상**: 불필요한 exports 제거로 명확성 증가
- **빌드 시간 단축**: 미사용 코드 트랜스파일 제거

---

## 🛠️ 추가 분석 도구

### 번들 분석 (시각화)
```bash
npm run analyze:bundle
# → localhost:8888에서 인터랙티브 트리맵 확인
```

### 의존성 그래프 생성 (GraphViz 필요)
```bash
npm run analyze:deps
# → dependency-graph.svg 생성
```

**GraphViz 설치**:
```bash
# macOS
brew install graphviz

# Ubuntu/Debian
sudo apt-get install graphviz

# Windows
choco install graphviz
```

---

## 📝 참고 자료

### 설치된 도구
- **Knip v5.69.1**: https://github.com/webpro/knip
- **madge v8.0.0**: https://github.com/pahen/madge
- **@next/bundle-analyzer v16.0.3**: https://www.npmjs.com/package/@next/bundle-analyzer

### 설정 파일
- `package.json`: 분석 스크립트 추가됨
- `next.config.ts`: Bundle Analyzer 통합 완료

### 실행 가능한 명령어
```bash
npm run analyze:unused    # Knip으로 미사용 코드 탐지
npm run analyze:deps      # 의존성 그래프 SVG 생성
npm run analyze:circular  # 순환 의존성 검사
npm run analyze:bundle    # 번들 크기 분석 (빌드 + 서버 시작)
npm run analyze:all       # unused + circular 동시 실행
```

---

**다음 단계**: Phase 1 (안전한 정리)부터 시작하시는 것을 권장합니다.
