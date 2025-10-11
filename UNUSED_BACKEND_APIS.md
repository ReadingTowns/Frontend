# 미사용 백엔드 API 목록

백엔드에서 개발 완료되었으나 프론트엔드에서 아직 사용되지 않는 API 목록입니다.

**분석 기준일**: 2025-10-12
**총 백엔드 완료 API**: 31개
**프론트엔드 사용 중**: 11개
**미사용 API**: 20개

---

## 📊 요약

### ✅ 프론트엔드에서 사용 중인 API (11개)

| 기능 | End Point | 사용 위치 |
|------|-----------|----------|
| 온보딩 완료 여부 확인 | `/api/v1/members/onboarding/check` | `useAuth.ts:54` |
| 온보딩 완료 후 저장 | `/api/v1/members/onboarding/complete` | `onboarding/page.tsx:116` |
| 로그아웃 | `/api/v1/auth/logout` | `useAuth.ts:71`, `MypageClient.tsx:77` |
| access token 재발급 | `/api/v1/auth/reissue` | `useAuth.ts:125` |
| 동네 수정 | `/api/v1/members/town` | `townService.ts:43` |
| 프로필 수정 | `/api/v1/members/profile` | `ProfileEditClient.tsx:90` |
| 유저 검색 | `/api/v1/members/search` | `userSearchService.ts:18`, `NeighborsPageClient.tsx:89`, `FollowingTab.tsx:56`, `ExploreTab.tsx:57` |
| 교환 중인 책 리스트 조회 | `/api/v1/members/me/exchanges` | `useDashboard.ts:19`, `useExchangedBooks.ts:23` |
| 서재 책 리스트 조회 | `/api/v1/bookhouse/members/me` | `useLibrary.ts:35`, `useMyLibrary.ts:24` |
| 서재에 책 등록 | `/api/v1/bookhouse/books` | `useLibrary.ts:89`, `BookForm.tsx:90` |
| 채팅룸 생성 | `/api/v1/chatrooms` | `userSearchService.ts:49` |

---

## ❌ 미사용 API 목록 (20개)

### 🔐 인증 (OAuth2)

| 기능 | Method | End Point | 비고 |
|------|--------|-----------|------|
| 구글 로그인 | GET | `/oauth2/authorization/google` | OAuth 자동 리다이렉트로 프론트 직접 호출 불필요 |
| 카카오 로그인 | GET | `/oauth2/authorization/kakao` | OAuth 자동 리다이렉트로 프론트 직접 호출 불필요 |

### 💬 채팅 (ChatRoom) - 5개

| 기능 | Method | End Point | 우선순위 |
|------|--------|-----------|----------|
| 채팅룸 리스트 조회 | GET | `/api/v1/chatrooms` | 🔥 높음 |
| 채팅룸 메시지 조회 | GET | `/api/v1/chatrooms/{chatroomId}/messages` | 🔥 높음 |
| 채팅룸 교환 책 정보 조회 | GET | `/api/v1/chatrooms/{chatroomId}/books` | 🔥 높음 |
| 채팅룸 나가기 | DELETE | `/api/v1/chatrooms/{chatroomId}` | 📌 중간 |
| 대면 교환 완료 | PATCH | `/api/v1/chatrooms/{chatroomId}/exchange/complete` | 📌 중간 |
| 대면 반납 완료 | PATCH | `/api/v1/chatrooms/{chatroomId}/exchange/return` | 📌 중간 |

**구현 필요 페이지**: `/social` (채팅 탭)

### 🔄 교환 요청 (ExchangeRequest) - 4개

| 기능 | Method | End Point | 우선순위 |
|------|--------|-----------|----------|
| 교환 요청 생성 | POST | `/api/v1/exchange-requests` | 🔥 높음 |
| 교환 요청 수락 | PATCH | `/api/v1/exchange-requests/{exchangeStatusId}/accept` | 🔥 높음 |
| 교환 요청 거절 | PATCH | `/api/v1/exchange-requests/{exchangeStatusId}/reject` | 🔥 높음 |
| 교환 요청 취소 | DELETE | `/api/v1/exchange-requests/{exchangeStatusId}/cancel` | 📌 중간 |

**구현 필요 페이지**: `/social` (채팅 탭 내 교환 요청 기능)

### 📚 서재 (Bookhouse) - 2개

| 기능 | Method | End Point | 우선순위 |
|------|--------|-----------|----------|
| 특정 사람의 서재 책 리스트 | GET | `/api/v1/bookhouse/members/{memberId}` | 🔥 높음 |
| 서재에 책 삭제 | DELETE | `/api/v1/bookhouse/books/{bookId}` | 📌 중간 |

**구현 필요 페이지**: `/library` (서재), `/neighbors/[userId]` (타인 서재)

### 📖 감상평 (Books/Review) - 5개

| 기능 | Method | End Point | 우선순위 |
|------|--------|-----------|----------|
| 책 감상평 등록 | POST | `/api/v1/books/{bookId}/review` | 🔥 높음 |
| 나의 감상평 조회 | GET | `/api/v1/books/{bookId}/reviews/me` | 🔥 높음 |
| 책 감상평 수정 | PATCH | `/api/v1/books/review/{reviewId}` | 📌 중간 |
| 교환자들의 감상평 조회 | GET | `/api/v1/books/{bookId}/reviews` | 💡 낮음 |
| 특정 사람의 특정 책 감상평 조회 | GET | `/api/v1/books/{bookId}/reviews/{memberId}` | 💡 낮음 |

**구현 필요 페이지**: `/library` (서재 책 상세)

### ⭐ 별점 리뷰 (Member/Star Rating) - 2개

| 기능 | Method | End Point | 우선순위 |
|------|--------|-----------|----------|
| 리뷰 별점 조회 | GET | `/api/v1/members/star-rating?memberId={memberId}` | 📌 중간 |
| 리뷰 별점 제출 | POST | `/api/v1/members/{partnerId}/star-rating` | 📌 중간 |

**구현 필요 페이지**: `/neighbors/[userId]` (유저 프로필), 교환 완료 후 리뷰

---

## 🎯 구현 우선순위별 분류

### 🔥 높음 (10개) - 핵심 기능, 즉시 구현 필요

1. **채팅 기능** (3개)
   - 채팅룸 리스트 조회
   - 채팅룸 메시지 조회
   - 채팅룸 교환 책 정보 조회

2. **교환 요청 기능** (3개)
   - 교환 요청 생성
   - 교환 요청 수락
   - 교환 요청 거절

3. **서재 기능** (1개)
   - 특정 사람의 서재 책 리스트

4. **감상평 기능** (2개)
   - 책 감상평 등록
   - 나의 감상평 조회

### 📌 중간 (7개) - 부가 기능, 단계적 구현

1. **채팅 부가 기능** (3개)
   - 채팅룸 나가기
   - 대면 교환 완료
   - 대면 반납 완료

2. **교환 관리** (1개)
   - 교환 요청 취소

3. **서재 관리** (1개)
   - 서재에 책 삭제

4. **감상평 관리** (1개)
   - 책 감상평 수정

5. **별점 시스템** (2개)
   - 리뷰 별점 조회
   - 리뷰 별점 제출

### 💡 낮음 (3개) - 선택적 기능

1. **OAuth 로그인** (2개) - 자동 리다이렉트로 직접 호출 불필요
2. **감상평 고급 조회** (2개)

---

## 📋 구현 권장 순서

### Phase 1: 채팅 & 교환 시스템 (핵심)
1. 채팅룸 리스트/메시지 조회 구현
2. 채팅룸 교환 책 정보 조회 구현
3. 교환 요청 생성/수락/거절 구현

**예상 작업 기간**: 2-3주

### Phase 2: 서재 & 감상평 시스템
1. 타인 서재 조회 기능
2. 감상평 등록/조회 기능
3. 서재 책 삭제 기능
4. 감상평 수정 기능

**예상 작업 기간**: 1-2주

### Phase 3: 부가 기능
1. 채팅룸 나가기
2. 교환 완료/반납 기능
3. 별점 시스템
4. 교환 요청 취소

**예상 작업 기간**: 1-2주

---

## 🔍 참고 사항

### 이미 구현된 유사 패턴

다음 파일들을 참고하여 미사용 API를 구현할 수 있습니다:

- **TanStack Query 패턴**: `src/hooks/useAuth.ts`, `src/hooks/useDashboard.ts`
- **Mutation 패턴**: `src/hooks/useLibrary.ts` (책 등록/삭제)
- **페이지네이션**: `src/hooks/useLibrary.ts:35` (서재 리스트)
- **검색 기능**: `src/services/userSearchService.ts`

### API 테스트 페이지

`src/app/api-test/page.tsx`에 모든 API 엔드포인트가 정의되어 있으므로, 이를 참고하여 구현할 수 있습니다.

---

## 📝 체크리스트

미사용 API 구현 시 다음 사항을 확인하세요:

- [ ] TanStack Query 사용 (캐싱, 자동 재시도)
- [ ] 에러 핸들링 (try-catch, 사용자 피드백)
- [ ] 로딩 상태 관리 (스켈레톤 UI)
- [ ] Optimistic Update 적용 (필요시)
- [ ] TypeScript 타입 정의
- [ ] 쿠키 기반 인증 (`credentials: 'include'`)
- [ ] 백엔드 URL 환경변수 사용 (`NEXT_PUBLIC_BACKEND_URL`)

---

**생성일**: 2025-10-12
**마지막 업데이트**: 2025-10-12
