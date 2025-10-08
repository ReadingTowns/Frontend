# 리딩타운 API 명세서

## 개요

- **Base URL**: `https://readingtown.site`
- **인증 방식**: Cookie 기반 (access_token, refresh_token)
- **응답 형식**: JSON

### 공통 응답 구조
```json
{
  "code": "1000",
  "message": "Success",
  "result": {
    // 응답 데이터
  }
}
```

### 에러 코드
- **3005**: 만료된 토큰

---

## 인증 (OAuth2 & Auth)

### OAuth2 소셜 로그인

#### 구글 로그인
- **Method**: `GET`
- **Endpoint**: `/oauth2/authorization/google`
- **설명**: 사용자를 구글 OAuth 로그인 페이지로 리다이렉션
- **백엔드 담당자**: 고여경
- **백엔드 완료**: ✅

#### 카카오 로그인
- **Method**: `GET`
- **Endpoint**: `/oauth2/authorization/kakao`
- **설명**: 사용자를 카카오 OAuth 로그인 페이지로 리다이렉션
- **백엔드 담당자**: 최서지
- **백엔드 완료**: ✅

### Auth

#### Access Token 재발급
- **Method**: `POST`
- **Endpoint**: `/api/v1/auth/reissue`
- **설명**: access_token, refresh_token 모두 새로 발급 (쿠키)
- **백엔드 담당자**: 최서지
- **백엔드 완료**: ✅

#### 로그아웃
- **Method**: `POST`
- **Endpoint**: `/api/v1/auth/logout`
- **설명**: 사용자 로그아웃 처리
- **백엔드 담당자**: 최서지
- **백엔드 완료**: ✅

---

## 회원 (Member) - 총 17개 API

### 온보딩

#### 온보딩 완료 여부 확인
- **Method**: `GET`
- **Endpoint**: `/api/v1/members/onboarding/check`
- **백엔드 완료**: ✅

#### 온보딩 기본 프로필 조회
- **Method**: `GET`
- **Endpoint**: `/api/v1/members/onboarding/default-profile`
- **백엔드 담당자**: 고여경
- **백엔드 완료**: ✅

#### 온보딩 완료 후 저장
- **Method**: `POST`
- **Endpoint**: `/api/v1/members/onboarding/complete`
- **백엔드 담당자**: 고여경
- **백엔드 완료**: ✅

#### 닉네임 중복 확인
- **Method**: `GET`
- **Endpoint**: `/api/v1/members/nickname/validate?nickname=리딩여우abcd12`
- **Note**: username은 본명, nickname은 실제 닉네임
- **백엔드 담당자**: 고여경
- **백엔드 완료**: ✅

### 프로필 관리

#### 나의 프로필 조회
- **Method**: `GET`
- **Endpoint**: `/api/v1/members/me/profile`
- **백엔드 완료**: ✅

#### 프로필 조회 (특정 사용자)
- **Method**: `GET`
- **Endpoint**: `/api/v1/members/{partnerId}/profile`
- **백엔드 완료**: ✅

#### 프로필 수정
- **Method**: `PATCH`
- **Endpoint**: `/api/v1/members/profile`
- **백엔드 담당자**: 고여경
- **백엔드 완료**: ✅

### 동네 관리

#### 동네 조회
- **Method**: `GET`
- **Endpoint**: `/api/v1/members/town`
- **백엔드 담당자**: 고여경
- **백엔드 완료**: ✅

#### 동네 수정
- **Method**: `PUT`
- **Endpoint**: `/api/v1/members/town`
- **백엔드 담당자**: 고여경
- **백엔드 완료**: ✅

### 교환 정보

#### 교환 중인 책 리스트 조회
- **Method**: `GET`
- **Endpoint**: `/api/v1/members/me/exchanges`
- **백엔드 완료**: ✅

### 사용자 검색

#### 유저 검색
- **Method**: `GET`
- **Endpoint**: `/api/v1/members/search?nickname=닉`
- **백엔드 완료**: ✅

### 리뷰 및 평점

#### 나의 리뷰 별점 조회
- **Method**: `GET`
- **Endpoint**: `/api/v1/members/me/star-rating`
- **백엔드 완료**: ✅

#### 리뷰 별점 제출
- **Method**: `POST`
- **Endpoint**: `/api/v1/members/{partnerId}/star-rating`
- **백엔드 담당자**: 고여경
- **백엔드 완료**: ✅

#### 리뷰 별점 조회 (특정 사용자)
- **Method**: `GET`
- **Endpoint**: `/api/v1/members/star-rating?memberId=1`
- **백엔드 담당자**: 고여경
- **백엔드 완료**: ✅

### 팔로우 관리

#### 팔로우 생성
- **Method**: `POST`
- **Endpoint**: `/api/v1/members/{targetMemberId}/follow`
- **백엔드 완료**: ✅

#### 팔로우 취소
- **Method**: `DELETE`
- **Endpoint**: `/api/v1/members/{targetMemberId}/follow`
- **백엔드 완료**: ✅

#### 내가 팔로우 중인 유저 리스트 조회
- **Method**: `GET`
- **Endpoint**: `/api/v1/members/me/following`
- **백엔드 완료**: ✅

#### 나의 팔로워 리스트 조회
- **Method**: `GET`
- **Endpoint**: `/api/v1/members/me/followers`
- **백엔드 완료**: ✅

### 채팅 관련 (미사용)

#### 채팅 응답률 조회 (미사용)
- **Method**: `GET`
- **Endpoint**: `/api/v1/members/chat/response-rate`
- **백엔드 담당자**: 고여경
- **백엔드 완료**: ❌

#### 채팅 평균 응답 시간 조회 (미사용)
- **Method**: `GET`
- **Endpoint**: `/api/v1/members/chat/avg-response-time`
- **백엔드 담당자**: 고여경
- **백엔드 완료**: ❌

---

## 서재 (Bookhouse) - 총 4개 API

#### 서재에 책 등록
- **Method**: `POST`
- **Endpoint**: `/api/v1/bookhouse/books`
- **백엔드 담당자**: 최서지
- **백엔드 완료**: ✅

#### 서재에 책 삭제
- **Method**: `DELETE`
- **Endpoint**: `/api/v1/bookhouse/books/{bookId}`
- **백엔드 담당자**: 최서지
- **백엔드 완료**: ✅

#### 서재 책 리스트 조회 (본인)
- **Method**: `GET`
- **Endpoint**: `/api/v1/bookhouse/members/me?page={}&size={}`
- **백엔드 담당자**: 최서지
- **백엔드 완료**: ✅

#### 특정 사람의 서재 책 리스트 조회
- **Method**: `GET`
- **Endpoint**: `/api/v1/bookhouse/members/{memberId}?page={}&size={}`
- **백엔드 담당자**: 최서지
- **백엔드 완료**: ✅

---

## 책 (Books) - 총 6개 API

#### 책 기본 정보 조회
- **Method**: `GET`
- **Endpoint**: `/api/v1/books/{bookId}`
- **백엔드 담당자**: 최서지
- **백엔드 완료**: ✅

#### 책 감상평 등록
- **Method**: `POST`
- **Endpoint**: `/api/v1/books/{bookId}/review`
- **백엔드 담당자**: 최서지
- **백엔드 완료**: ✅

#### 책 감상평 수정
- **Method**: `PATCH`
- **Endpoint**: `/api/v1/books/review/{reviewId}`
- **백엔드 담당자**: 최서지
- **백엔드 완료**: ✅

#### 나의 감상평 조회
- **Method**: `GET`
- **Endpoint**: `/api/v1/books/{bookId}/reviews/me`
- **백엔드 담당자**: 최서지
- **백엔드 완료**: ✅

#### 특정 사람의 특정 책 감상평 조회
- **Method**: `GET`
- **Endpoint**: `/api/v1/books/{bookId}/reviews/{memberId}`
- **백엔드 담당자**: 최서지
- **백엔드 완료**: ✅

#### 교환자들의 감상평 조회
- **Method**: `GET`
- **Endpoint**: `/api/v1/books/{bookId}/reviews`
- **백엔드 담당자**: 최서지
- **백엔드 완료**: ✅

---

## 교환 요청 (Exchange Request) - 총 4개 API

#### 교환 요청 생성
- **Method**: `POST`
- **Endpoint**: `/api/v1/exchange-requests`
- **백엔드 담당자**: 고여경
- **백엔드 완료**: ✅

#### 교환 요청 수락
- **Method**: `PATCH`
- **Endpoint**: `/api/v1/exchange-requests/{exchangeStatusId}/accept`
- **Note**: 백엔드에서 exchangeRequestId가 exchangeStatusId임
- **백엔드 담당자**: 고여경
- **백엔드 완료**: ✅

#### 교환 요청 거절
- **Method**: `PATCH`
- **Endpoint**: `/api/v1/exchange-requests/{exchangeStatusId}/reject`
- **백엔드 담당자**: 고여경
- **백엔드 완료**: ✅

#### 교환 요청 취소
- **Method**: `DELETE`
- **Endpoint**: `/api/v1/exchange-requests/{exchangeStatusId}/cancel`
- **백엔드 담당자**: 고여경
- **백엔드 완료**: ✅

---

## 채팅 (ChatRoom) - 총 8개 API

#### 채팅으로 책 교환 요청 보내기
- **Method**: `POST`
- **Endpoint**: `/api/v1/chatrooms`
- **백엔드 담당자**: 최서지
- **백엔드 완료**: ✅

#### 채팅룸 리스트 조회
- **Method**: `GET`
- **Endpoint**: `/api/v1/chatrooms`
- **백엔드 담당자**: 최서지
- **백엔드 완료**: ✅

#### 채팅룸 메시지 조회
- **Method**: `GET`
- **Endpoint**: `/api/v1/chatrooms/{chatroomId}/messages?limit={가져올 메시지 수}&before={next cursor}`
- **백엔드 담당자**: 최서지
- **백엔드 완료**: ✅

#### 채팅룸 상대방 정보 조회
- **Method**: `GET`
- **Endpoint**: `/api/v1/chatrooms/{chatroomId}/partner/profile`
- **백엔드 담당자**: 최서지
- **백엔드 완료**: ✅

#### 채팅룸 교환 책 정보 조회
- **Method**: `GET`
- **Endpoint**: `/api/v1/chatrooms/{chatroomId}/books`
- **백엔드 담당자**: 최서지
- **백엔드 완료**: ✅

#### 채팅룸 나가기 (삭제)
- **Method**: `DELETE`
- **Endpoint**: `/api/v1/chatrooms/{chatroomId}`
- **백엔드 담당자**: 최서지
- **백엔드 완료**: ✅

#### 대면 교환 완료
- **Method**: `PATCH`
- **Endpoint**: `/api/v1/chatrooms/{chatroomId}/exchange/complete`
- **Note**: Bookhouse의 교환 상태 필드 (실제 대면 교환 완료)
- **백엔드 담당자**: 고여경
- **백엔드 완료**: ✅

#### 대면 반납 완료
- **Method**: `PATCH`
- **Endpoint**: `/api/v1/chatrooms/{chatroomId}/exchange/return`
- **백엔드 담당자**: 고여경
- **백엔드 완료**: ✅

---

## 알림 (Notification) - 총 3개 API

#### 알림 조회
- **Method**: `GET`
- **Endpoint**: `/api/v1/notifications`
- **백엔드 완료**: ❌

#### 알림 읽음 요청
- **Method**: `POST`
- **Endpoint**: `/api/v1/notifications/{notificationId}`
- **백엔드 완료**: ❌

#### 알림 삭제
- **Method**: `DELETE`
- **Endpoint**: `/api/v1/notifications/{notificationId}`
- **백엔드 완료**: ❌

---

## 책방 (Bookstore) - 총 6개 API

#### 책방에 책 등록
- **Method**: `POST`
- **Endpoint**: `/api/v1/bookstores/{bookstoreId}/books`
- **백엔드 완료**: ❌

#### 책방 책 리스트 조회
- **Method**: `GET`
- **Endpoint**: `/api/v1/bookstores/{bookstoreId}/books`
- **백엔드 완료**: ❌

#### 책방 책 정보 조회
- **Method**: `GET`
- **Endpoint**: `/api/v1/bookstores/{bookstoreId}/books/{bookId}`
- **백엔드 완료**: ❌

#### 책방 책 소유자 정보 조회
- **Method**: `GET`
- **Endpoint**: `/api/v1/bookstores/{bookstoreId}/books/{bookId}/owner`
- **백엔드 완료**: ❌

#### 대시보드용 책방 책 리스트 조회
- **Method**: `GET`
- **Endpoint**: `/api/v1/bookstores/{bookstoreId}/books/preview`
- **백엔드 완료**: ❌

#### 대시보드용 책방 인기 TOP10 조회
- **Method**: `GET`
- **Endpoint**: `/api/v1/bookstores/{bookstoreId}/books/popular/preview`
- **백엔드 완료**: ❌

---

## 구현 현황 요약

### Domain별 구현 상태

| Domain | 총 API 수 | 백엔드 완료 | 백엔드 미완료 |
|--------|----------|------------|--------------|
| OAuth2 | 2 | 2 | 0 |
| Auth | 2 | 2 | 0 |
| Member | 17 | 15 | 2 |
| Bookhouse | 4 | 4 | 0 |
| Books | 6 | 6 | 0 |
| ExchangeRequest | 4 | 4 | 0 |
| ChatRoom | 8 | 8 | 0 |
| Notification | 3 | 0 | 3 |
| Bookstore | 6 | 0 | 6 |

### 전체 구현 상태
- **총 API 수**: 52개
- **백엔드 완료**: 41개 (78.8%)
- **백엔드 미완료**: 11개 (21.2%)
- **프론트엔드 완료**: 0개 (0%)

### 백엔드 담당자별 현황
- **최서지**: OAuth2(카카오), Auth(2), Bookhouse(4), Books(6), ChatRoom(6)
- **고여경**: OAuth2(구글), Member(온보딩/프로필/동네/리뷰), ExchangeRequest(4), ChatRoom(대면교환/반납)

---

## 주의사항

1. **인증**: 모든 API는 인증이 필요하며, access_token이 쿠키에 포함되어야 합니다.
2. **토큰 만료**: 토큰 만료 시 에러 코드 3005가 반환되며, `/api/v1/auth/reissue`를 호출하여 재발급 받아야 합니다.
3. **Exchange Status ID**: Exchange Request API에서 exchangeRequestId는 실제로 exchangeStatusId입니다.
4. **닉네임 관련**: username은 본명, nickname은 실제 닉네임입니다.
5. **페이지네이션**: 서재 책 리스트 조회 시 page와 size 파라미터를 사용합니다.
6. **채팅 메시지 조회**: limit과 before(cursor) 파라미터를 사용하여 페이지네이션합니다.

---

## 문서 버전
- **최종 업데이트**: 2025-09-30
- **작성자**: Claude Code
- **출처**: Notion API 명세서 CSV Export