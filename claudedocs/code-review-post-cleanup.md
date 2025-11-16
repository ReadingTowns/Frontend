# 디펜던시 정리 후 코드 검토 보고서

**검토 일시**: 2025-11-17
**프로젝트**: ReadingTown Frontend (Next.js 15.4.5)

---

## 📊 프로젝트 현황

### 코드베이스 규모
- **전체 TypeScript 파일**: 100개 이상
- **총 코드 라인 수**: 20,744줄
- **컴포넌트 파일**: 59개 (src/components)
- **Custom Hooks**: 26개 (src/hooks)
- **페이지 라우트**: 19개 (App Router)

### 디렉토리 구조
```
src/
├── app/               # Next.js App Router
│   ├── (protected)/  # 인증 필요 페이지
│   │   ├── home/
│   │   ├── chat/
│   │   ├── social/
│   │   ├── library/
│   │   ├── exchange/
│   │   ├── mypage/
│   │   └── onboarding/
│   ├── (public)/     # 공개 페이지
│   └── api/          # API Routes
├── components/       # 재사용 컴포넌트
├── hooks/           # Custom React Hooks
├── lib/             # 유틸리티 함수
├── services/        # 비즈니스 로직
├── types/           # TypeScript 타입 정의
├── utils/           # 헬퍼 함수
└── constants/       # 상수 정의
```

---

## ✅ Phase 1 완료: 의존성 정리

### 제거된 Dependencies (2개)
```json
"date-fns": "^4.1.0"       // ❌ 제거됨
"tailwind-merge": "^3.3.1" // ❌ 제거됨
```

**결과**:
- 패키지 수: 561개 → 370개 (-191개, -34%)
- `node_modules` 크기 감소 예상

### 유지된 DevDependencies
```json
"eslint-config-next": "15.4.5"  // ✅ 필수 (ESLint 동작에 필요)
```

**참고**: Knip이 `eslint-config-next`를 미사용으로 표시했지만, Next.js 15.4.5의 ESLint 설정에 필수적임을 확인했습니다.

### 추가된 Dependencies (자동 설치됨)
```json
"postcss": "^8.x"          // postcss.config.mjs에서 사용
"@zxing/library": "^0.x"   // ISBNScanner에서 사용
```

**참고**: 이미 `package.json`에 있거나 peer dependency로 자동 설치되어 별도 추가가 필요 없었습니다.

---

## 🔍 Phase 2 완료: 코드 분석

### 2.1 미사용 파일 검증 (21개 중 확인)

#### ✅ 확실한 미사용 파일 (20개)

**채팅 관련 중복 컴포넌트 (4개)**:
```
❌ src/app/(protected)/social/components/ChatRoom.tsx          (237줄)
❌ src/app/(protected)/social/components/MessageBubble.tsx
❌ src/app/(protected)/social/components/MessageInput.tsx
❌ src/app/(protected)/social/components/UserResultCard.tsx
```

**실제 사용 중인 버전**:
```
✅ src/app/(protected)/chat/components/MessageBubble.tsx       (235줄, 실제 사용)
✅ src/app/(protected)/chat/components/MessageInput.tsx        (실제 사용)
✅ src/app/(protected)/chat/components/ChatRoom.tsx            (231줄, 실제 사용)
```

**결론**: `social/components/` 내 채팅 컴포넌트는 모두 삭제 가능.

**채팅 검색 관련 (3개)**:
```
❌ src/app/(protected)/chat/components/UserSearchModal.tsx     (미사용)
❌ src/app/(protected)/chat/components/UserResultCard.tsx      (미사용, UserSearchModal에서만 참조)
```

**온보딩 키워드 기능 (4개)**:
```
❌ src/components/onboarding/Keywords1Step.tsx
❌ src/components/onboarding/Keywords2Step.tsx
❌ src/components/onboarding/Keywords3Step.tsx
❌ src/components/onboarding/KeywordsStep.tsx                  (328줄, 큰 파일!)
```

**참고**: `KeywordsStep.tsx`는 328줄의 큰 파일이지만 어디에서도 import되지 않음.

**Custom Hooks (5개)**:
```
❌ src/hooks/useKeywordOnboarding.ts      (키워드 온보딩 관련)
❌ src/hooks/useKeywordStatus.ts          (키워드 상태 관리)
❌ src/hooks/useMyLibrary.ts              (내 서재 - Knip 오탐)
❌ src/hooks/useUserRecommendations.ts    (유저 추천)
❌ src/hooks/useVideoSearch.ts            (비디오 검색)
```

**라이브러리/서비스 (4개)**:
```
❌ src/lib/keywordStorage.ts              (키워드 로컬 스토리지)
❌ src/services/userSearchService.ts      (유저 검색 서비스)
❌ src/types/keyword.ts                   (키워드 타입 정의)
❌ src/types/userSearch.ts                (유저 검색 타입 정의)
```

#### ⚠️ 테스트 파일 (1개)
```
? jest.setup.js  // 테스트가 "No tests yet" 상태이므로 현재 미사용
```

**권장**: 테스트 환경 구축 시 필요하므로 유지.

### 2.2 코드 아키텍처 검토

#### 파일 크기 분석 (상위 20개)

**🔴 초대형 파일 (500줄 이상)**:
```
615줄  src/services/websocketService.ts          ⚠️ 리팩토링 권장
578줄  src/components/chat/ExchangeRequestCard.tsx  ⚠️ 컴포넌트 분리 권장
```

**🟡 대형 파일 (300-500줄)**:
```
421줄  src/app/(protected)/library/add/components/ISBNScanner.tsx
403줄  src/hooks/useLibrary.ts                    ⚠️ Hook 분리 권장
380줄  src/app/(protected)/library/add/components/BookForm.tsx
365줄  src/components/chat/ExchangeStatusMessage.tsx
363줄  src/app/(protected)/onboarding/page.tsx
328줄  src/components/onboarding/KeywordsStep.tsx  ❌ 미사용
```

**🟢 중형 파일 (200-300줄)**:
```
286줄  src/app/(protected)/chat/[conversationId]/ChatRoomClient.tsx
285줄  src/lib/api.ts
268줄  src/components/exchange/ConfirmCreateStep.tsx
257줄  src/app/(protected)/library/[userId]/page.tsx
237줄  src/app/(protected)/social/components/ChatRoom.tsx  ❌ 미사용
235줄  src/hooks/useChatRoom.ts
235줄  src/components/recommendations/SearchRecommendations.tsx
235줄  src/app/(protected)/chat/components/MessageBubble.tsx
231줄  src/app/(protected)/chat/components/ChatRoom.tsx
230줄  src/hooks/useBookDetail.ts
226줄  src/app/(protected)/chatbot/ChatbotPageClient.tsx
```

#### 중복 파일명 분석

**완전 중복 컴포넌트**:
```
ChatRoom.tsx        2개  (chat/ ✅ vs social/ ❌)
MessageBubble.tsx   2개  (chat/ ✅ vs social/ ❌)
MessageInput.tsx    2개  (chat/ ✅ vs social/ ❌)
UserResultCard.tsx  2개  (chat/ ❌ vs social/ ❌)
```

**정상 중복 (Next.js 패턴)**:
```
layout.tsx  다수 (각 라우트별 레이아웃)
page.tsx    19개 (각 페이지 라우트)
```

### 2.3 코드 품질 메트릭

#### 복잡도 지표

**🔴 높은 복잡도 (리팩토링 필수)**:
- `websocketService.ts` (615줄) - WebSocket 로직 분리 필요
- `ExchangeRequestCard.tsx` (578줄) - UI 컴포넌트 분리 필요
- `useLibrary.ts` (403줄) - 여러 hooks로 분리 권장

**🟡 중간 복잡도 (개선 권장)**:
- `ISBNScanner.tsx` (421줄) - 스캔 로직과 UI 분리
- `BookForm.tsx` (380줄) - 폼 컴포넌트 모듈화
- `ExchangeStatusMessage.tsx` (365줄) - 메시지 타입별 분리

#### 아키텍처 품질

**✅ 잘 구성된 영역**:
- App Router 구조 (`(protected)`, `(public)` 그룹화)
- 컴포넌트 재사용성 (components/ 디렉토리)
- 타입 안전성 (types/ 디렉토리)
- API 통합 (lib/api.ts 중앙화)

**⚠️ 개선 필요 영역**:
- 중복 컴포넌트 (chat/ vs social/)
- 거대 파일들 (500줄 이상)
- 미사용 코드 누적 (21개 파일)
- Hook 복잡도 (일부 400줄 초과)

---

## 🎯 Phase 3: 우선순위 기반 정리 로드맵

### Priority 1: 즉시 삭제 가능 (안전) ✅

**예상 효과**: ~2,000줄 코드 감소, 번들 크기 ~5-10% 감소

#### 1.1 social 디렉토리 중복 컴포넌트 (4개, ~500줄)
```bash
rm src/app/(protected)/social/components/ChatRoom.tsx
rm src/app/(protected)/social/components/MessageBubble.tsx
rm src/app/(protected)/social/components/MessageInput.tsx
rm src/app/(protected)/social/components/UserResultCard.tsx
```

#### 1.2 온보딩 키워드 관련 (8개, ~600줄)
```bash
# 컴포넌트
rm src/components/onboarding/Keywords1Step.tsx
rm src/components/onboarding/Keywords2Step.tsx
rm src/components/onboarding/Keywords3Step.tsx
rm src/components/onboarding/KeywordsStep.tsx

# Hooks
rm src/hooks/useKeywordOnboarding.ts
rm src/hooks/useKeywordStatus.ts

# 라이브러리/타입
rm src/lib/keywordStorage.ts
rm src/types/keyword.ts
```

#### 1.3 미사용 유저 검색 기능 (5개, ~300줄)
```bash
# 컴포넌트
rm src/app/(protected)/chat/components/UserSearchModal.tsx
rm src/app/(protected)/chat/components/UserResultCard.tsx

# Hooks & Services
rm src/hooks/useUserRecommendations.ts
rm src/hooks/useVideoSearch.ts
rm src/services/userSearchService.ts
rm src/types/userSearch.ts
```

#### 1.4 미사용 서재 Hook (1개)
```bash
rm src/hooks/useMyLibrary.ts
```

**삭제 전 체크리스트**:
- [ ] Git 커밋 생성 (복원 가능하도록)
- [ ] `npm run analyze:unused` 재실행으로 확인
- [ ] `npm run lint` 실행 (import 에러 확인)
- [ ] 로컬 테스트 (페이지 동작 확인)

### Priority 2: 검토 후 정리 (신중) ⚠️

#### 2.1 큰 파일 리팩토링

**websocketService.ts (615줄)**:
```
권장 구조:
├── websocketService.ts       (핵심 로직, ~200줄)
├── websocketHandlers.ts      (이벤트 핸들러, ~200줄)
└── websocketTypes.ts         (타입 정의, ~100줄)
```

**ExchangeRequestCard.tsx (578줄)**:
```
권장 구조:
├── ExchangeRequestCard.tsx   (메인 컴포넌트, ~150줄)
├── ExchangeStatusBadge.tsx   (상태 표시, ~100줄)
├── ExchangeActions.tsx       (액션 버튼, ~150줄)
└── ExchangeBookInfo.tsx      (책 정보, ~100줄)
```

**useLibrary.ts (403줄)**:
```
권장 분리:
├── useLibraryBooks.ts        (책 목록, ~150줄)
├── useLibraryProfile.ts      (프로필, ~100줄)
├── useLibraryReview.ts       (리뷰 관리, ~150줄)
```

#### 2.2 미사용 Exports 정리

Knip이 탐지한 **32개 미사용 exports** 검토:
- API 클라이언트 관련 (ApiError, apiClient 등)
- Skeleton 컴포넌트들
- 서비스 클래스들

**접근 방법**:
1. 각 export의 실제 사용처 검색
2. 내부 구현에서만 사용되면 export 제거
3. 완전 미사용이면 코드 자체 삭제

#### 2.3 미사용 Exported Types (65개)

**우선순위**:
- **High**: Props 타입 중 미사용 (컴포넌트 삭제 시 함께 제거)
- **Medium**: API Response 타입 (백엔드 계약 검토 필요)
- **Low**: 내부 타입 (export만 제거)

### Priority 3: 장기 개선 (선택적) 🔄

#### 3.1 아키텍처 개선

**컴포넌트 재사용성 향상**:
- UI 컴포넌트 라이브러리화 (`components/ui/`)
- 비즈니스 로직 컴포넌트 분리 (`components/domain/`)

**Hook 패턴 개선**:
- 복잡한 Hook 분리 (SRP 원칙)
- Custom Hook 네이밍 일관성
- React Query hooks 표준화

#### 3.2 성능 최적화

**Code Splitting**:
```javascript
// 거대 컴포넌트 동적 import
const ISBNScanner = dynamic(() => import('./ISBNScanner'), {
  loading: () => <ScannerSkeleton />,
})
```

**이미지 최적화**:
- Next.js Image 컴포넌트 사용 확대
- WebP 포맷 적용

#### 3.3 테스트 커버리지

현재 `"test": "echo \"No tests yet\""`

**권장**:
1. Jest + React Testing Library 설정 활성화
2. Critical Path 테스트 우선 작성
3. E2E 테스트 추가 (Playwright)

---

## 📈 예상 개선 효과

### 정량적 지표 (Priority 1 실행 시)

| 항목 | 현재 | 정리 후 | 개선 |
|------|------|---------|------|
| 파일 수 | 100+ | ~80 | -20% |
| 코드 라인 | 20,744 | ~18,500 | -11% |
| 미사용 파일 | 21개 | 1개 (jest.setup.js) | -95% |
| Dependencies | 370개 | 370개 | 유지 |
| 번들 크기 | N/A | 예상 -5~10% | 측정 필요 |

### 정성적 개선

**✅ 코드 가독성**:
- 중복 제거로 혼란 감소
- 명확한 파일 구조

**✅ 유지보수성**:
- 미사용 코드 제거로 탐색 시간 단축
- 리팩토링 대상 명확화

**✅ 빌드 성능**:
- 트랜스파일 대상 파일 감소
- 번들링 속도 향상

**✅ 개발자 경험**:
- IDE 성능 개선
- 코드 검색 속도 향상

---

## 🚀 실행 계획

### Step 1: 백업 및 준비
```bash
# 현재 상태 커밋
git add .
git commit -m "chore: save before cleanup"

# 브랜치 생성
git checkout -b feature/code-cleanup
```

### Step 2: Priority 1 실행
```bash
# social 중복 컴포넌트 삭제
rm src/app/(protected)/social/components/ChatRoom.tsx
rm src/app/(protected)/social/components/MessageBubble.tsx
rm src/app/(protected)/social/components/MessageInput.tsx
rm src/app/(protected)/social/components/UserResultCard.tsx

# 온보딩 키워드 기능 삭제
rm src/components/onboarding/Keywords*.tsx
rm src/hooks/useKeyword*.ts
rm src/lib/keywordStorage.ts
rm src/types/keyword.ts

# 유저 검색 기능 삭제
rm src/app/(protected)/chat/components/UserSearchModal.tsx
rm src/app/(protected)/chat/components/UserResultCard.tsx
rm src/hooks/useUserRecommendations.ts
rm src/hooks/useVideoSearch.ts
rm src/services/userSearchService.ts
rm src/types/userSearch.ts
rm src/hooks/useMyLibrary.ts

# 검증
npm run analyze:unused
npm run analyze:circular
npm run lint  # ESLint 이슈는 별도 처리
```

### Step 3: 검증 및 커밋
```bash
# 로컬 테스트
npm run dev
# 주요 페이지 수동 테스트

# 커밋
git add .
git commit -m "chore: remove 20 unused files

- Remove duplicate chat components in social/
- Remove unused keyword onboarding feature
- Remove unused user search functionality
- Remove unused hooks (useMyLibrary, etc.)

Estimated reduction: ~2,000 lines of code"
```

### Step 4: Priority 2 계획 (선택적)
```bash
# TODO.md 생성
cat > TODO_REFACTORING.md << 'EOF'
# 리팩토링 계획

## websocketService 분리
- [ ] websocketHandlers.ts 분리
- [ ] websocketTypes.ts 분리

## ExchangeRequestCard 모듈화
- [ ] 컴포넌트 4개로 분리

## useLibrary Hook 분리
- [ ] useLibraryBooks
- [ ] useLibraryProfile
- [ ] useLibraryReview
EOF
```

---

## ⚠️ 주의사항

### 삭제 전 확인 사항

1. **Git 상태 확인**
   ```bash
   git status  # 변경사항 없는 상태에서 시작
   ```

2. **브랜치 전략**
   - 별도 브랜치에서 작업
   - PR 생성하여 리뷰 후 머지

3. **테스트 실행**
   - 현재 테스트가 없으므로 수동 테스트 필수
   - 주요 페이지 동작 확인

4. **점진적 삭제**
   - 한 번에 모두 삭제하지 말고 단계적으로
   - 각 단계마다 커밋

### 알려진 이슈

**ESLint 순환 참조 에러**:
```
Converting circular structure to JSON
```

이것은 Next.js 15.4.5 + ESLint 9의 알려진 이슈입니다.

**해결 방법** (선택):
1. ESLint 8로 다운그레이드
2. Next.js 16 대기 (수정 예정)
3. 현재는 빌드로 검증

---

## 📚 추가 리소스

### 분석 도구 사용법

**미사용 코드 재검사**:
```bash
npm run analyze:unused
```

**순환 의존성 검사**:
```bash
npm run analyze:circular
```

**의존성 그래프 생성** (GraphViz 필요):
```bash
brew install graphviz  # macOS
npm run analyze:deps
open dependency-graph.svg
```

**번들 분석**:
```bash
npm run analyze:bundle
# → localhost:8888
```

### 관련 문서

- `claudedocs/dependency-analysis.md` - 초기 의존성 분석 보고서
- `package.json` - 분석 스크립트 정의
- `next.config.ts` - Bundle Analyzer 설정

---

## 🎉 다음 단계

### 권장 작업 순서

1. ✅ **Phase 1 완료**: 의존성 정리
2. ✅ **Phase 2 완료**: 코드 분석
3. ✅ **Phase 3 완료**: 로드맵 수립
4. ⏭️ **Phase 4 실행**: Priority 1 삭제
5. ⏭️ **Phase 5 검증**: 빌드 & 테스트
6. ⏭️ **Phase 6 최적화**: Priority 2 리팩토링 (선택적)

### 측정 메트릭

**Before (현재)**:
- 파일: 100+
- 라인: 20,744
- 패키지: 370개

**After (예상)**:
- 파일: ~80 (-20%)
- 라인: ~18,500 (-11%)
- 패키지: 370개 (유지)

---

**검토 완료 일시**: 2025-11-17
**다음 리뷰**: Priority 1 실행 후 재측정
