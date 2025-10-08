# 리딩타운 Swagger API 명세서

## 개요

- **Base URL**: `https://api.readingtown.site`
- **API Version**: v1.0.0
- **Description**: 동네 기반 도서 교환 API
- **Swagger UI**: https://api.readingtown.site/swagger-ui/index.html
- **OpenAPI Spec**: https://api.readingtown.site/v3/api-docs

---

## 회원 관련 API (Member API)

### 프로필 관리

#### 내 프로필 조회
- **GET** `/api/v1/members/me/profile`
- **설명**: 로그인한 사용자의 프로필 정보를 조회합니다.

#### 다른 유저의 프로필 조회
- **GET** `/api/v1/members/{partnerId}/profile`
- **설명**: 특정 사용자의 프로필 정보를 조회합니다.
- **Path Parameter**: `partnerId` (Long) - 조회할 사용자 ID

#### 프로필 수정
- **PATCH** `/api/v1/members/profile`
- **설명**: 사용자의 프로필 정보를 수정합니다.

### 온보딩

#### 온보딩 완료 여부 확인
- **GET** `/api/v1/members/onboarding/check`
- **설명**: 사용자의 온보딩 완료 여부를 확인합니다.

#### 기본 프로필 조회
- **GET** `/api/v1/members/onboarding/default-profile`
- **설명**: 온보딩 시 사용할 기본 프로필 정보를 조회합니다.

#### 온보딩 완료
- **POST** `/api/v1/members/onboarding/complete`
- **설명**: 온보딩 정보를 저장하고 완료 처리합니다.
- **Request Body**: OnboardingCompleteRequestDto

#### 닉네임 중복 체크
- **GET** `/api/v1/members/nickname/validate`
- **설명**: 닉네임 사용 가능 여부를 확인합니다.
- **Query Parameter**: `nickname` (String)

### 동네 관리

#### 동네 조회
- **GET** `/api/v1/members/town`
- **설명**: 현재 설정된 동네 정보를 조회합니다.

#### 동네 수정
- **PUT** `/api/v1/members/town`
- **설명**: 동네 정보를 수정합니다.
- **Request Body**: UpdateTownRequestDto

### 팔로우 관리

#### 팔로우
- **POST** `/api/v1/members/{targetMemberId}/follow`
- **설명**: 특정 회원을 팔로우합니다.
- **Path Parameter**: `targetMemberId` (Long)

#### 팔로우 취소
- **DELETE** `/api/v1/members/{targetMemberId}/follow`
- **설명**: 특정 회원의 팔로우를 취소합니다.
- **Path Parameter**: `targetMemberId` (Long)

#### 팔로잉 목록 조회
- **GET** `/api/v1/members/me/following`
- **설명**: 내가 팔로우하는 사용자 목록을 조회합니다.

#### 팔로워 목록 조회
- **GET** `/api/v1/members/me/followers`
- **설명**: 나를 팔로우하는 사용자 목록을 조회합니다.

### 리뷰 및 평점

#### 내 리뷰 별점 조회
- **GET** `/api/v1/members/me/star-rating`
- **설명**: 내가 받은 리뷰 별점을 조회합니다.

#### 유저 리뷰 별점 조회
- **GET** `/api/v1/members/{partnerId}/star-rating`
- **설명**: 특정 사용자의 리뷰 별점을 조회합니다.
- **Path Parameter**: `partnerId` (Long)

#### 리뷰 별점 제출
- **POST** `/api/v1/members/star-rating`
- **설명**: 교환 후 상대방에 대한 별점을 제출합니다.
- **Request Body**: StarRatingRequestDto

### 기타

#### 유저 검색
- **GET** `/api/v1/members/search`
- **설명**: 닉네임으로 사용자를 검색합니다.
- **Query Parameter**: `nickname` (String)

#### 교환 중인 책 리스트 조회
- **GET** `/api/v1/members/me/exchanges`
- **설명**: 현재 교환 중인 책 목록을 조회합니다.

---

## 서재 관련 API (Bookhouse API)

#### 내 서재 조회
- **GET** `/api/v1/bookhouse/members/me`
- **설명**: 로그인한 사용자의 서재를 조회합니다.
- **Query Parameters**:
  - `page` (Integer) - 페이지 번호
  - `size` (Integer) - 페이지 크기

#### 회원의 서재 조회
- **GET** `/api/v1/bookhouse/members/{memberId}`
- **설명**: 특정 회원의 서재를 조회합니다.
- **Path Parameter**: `memberId` (Long)
- **Query Parameters**:
  - `page` (Integer) - 페이지 번호
  - `size` (Integer) - 페이지 크기

#### 서재에 책 추가
- **POST** `/api/v1/bookhouse/books`
- **설명**: 서재에 새로운 책을 추가합니다.
- **Request Body**: AddBookRequestDto

#### 서재에서 책 삭제
- **DELETE** `/api/v1/bookhouse/books/{bookId}`
- **설명**: 서재에서 특정 책을 삭제합니다.
- **Path Parameter**: `bookId` (Long)

---

## 채팅 관련 API (Chat API)

### 채팅방 관리

#### 채팅룸 리스트 조회
- **GET** `/api/v1/chatrooms`
- **설명**: 로그인한 유저가 속한 채팅룸 리스트를 조회합니다.

#### 채팅룸 생성
- **POST** `/api/v1/chatrooms`
- **설명**: 새로운 채팅룸을 생성하고 ID를 반환합니다.
- **Request Body**: CreateChatroomRequestDto

#### 채팅룸 나가기
- **DELETE** `/api/v1/chatrooms/{chatroomId}`
- **설명**: 특정 채팅룸에서 나갑니다.
- **Path Parameter**: `chatroomId` (Long)

### 채팅 정보

#### 이전 채팅 메시지 조회
- **GET** `/api/v1/chatrooms/{chatroomId}/messages`
- **설명**: 특정 채팅룸의 이전 메시지를 조회합니다.
- **Path Parameter**: `chatroomId` (Long)
- **Query Parameters**:
  - `limit` (Integer) - 조회할 메시지 수
  - `before` (String) - 커서 (이 시점 이전 메시지 조회)

#### 채팅 상대방 정보 조회
- **GET** `/api/v1/chatrooms/{chatroomId}/partner/profile`
- **설명**: 채팅 상대방의 프로필 정보를 조회합니다.
- **Path Parameter**: `chatroomId` (Long)

#### 교환 책 정보 조회
- **GET** `/api/v1/chatrooms/{chatroomId}/books`
- **설명**: 채팅룸에서 교환 중인 책 정보를 조회합니다.
- **Path Parameter**: `chatroomId` (Long)

### 교환 완료

#### 대면 교환 완료
- **PATCH** `/api/v1/chatrooms/{chatroomId}/exchange/complete`
- **설명**: 책의 대면 교환을 완료 처리합니다.
- **Path Parameter**: `chatroomId` (Long)

#### 대면 반납 완료
- **PATCH** `/api/v1/chatrooms/{chatroomId}/exchange/return`
- **설명**: 책의 대면 반납을 완료 처리합니다.
- **Path Parameter**: `chatroomId` (Long)

---

## 교환 요청 관련 API (ExchangeRequest API)

#### 교환 요청 생성
- **POST** `/api/v1/exchange-requests`
- **설명**: 새로운 책 교환 요청을 생성합니다.
- **Request Body**: CreateExchangeRequestDto

#### 교환 요청 수락
- **PATCH** `/api/v1/exchange-requests/{exchangeStatusId}/accept`
- **설명**: 받은 교환 요청을 수락합니다.
- **Path Parameter**: `exchangeStatusId` (Long)

#### 교환 요청 거절
- **PATCH** `/api/v1/exchange-requests/{exchangeStatusId}/reject`
- **설명**: 받은 교환 요청을 거절합니다.
- **Path Parameter**: `exchangeStatusId` (Long)

#### 교환 요청 취소
- **DELETE** `/api/v1/exchange-requests/{exchangeStatusId}/cancel`
- **설명**: 보낸 교환 요청을 취소합니다.
- **Path Parameter**: `exchangeStatusId` (Long)

---

## 키워드 관련 API (Keyword API)

#### 키워드 후보지 조회
- **GET** `/api/v1/keyword`
- **설명**: 선택 가능한 키워드 목록을 조회합니다.

#### 사용자의 키워드 조회
- **GET** `/api/v1/keyword/member`
- **설명**: 사용자가 선택한 키워드를 조회합니다.

#### 사용자 키워드 선택
- **POST** `/api/v1/keyword/member`
- **설명**: 사용자가 관심 키워드를 선택합니다.
- **Request Body**: KeywordSelectionDto

---

## 책 관련 API (Book & Review)

### 책 정보

#### 책 기본 정보 조회
- **GET** `/api/v1/books/{bookId}`
- **설명**: 특정 책의 기본 정보를 조회합니다.
- **Path Parameter**: `bookId` (Long)

### 감상평 관리

#### 책 감상평 등록
- **POST** `/api/v1/books/{bookId}/review`
- **설명**: 특정 책에 대한 감상평을 등록합니다.
- **Path Parameter**: `bookId` (Long)
- **Request Body**: CreateReviewDto

#### 책 감상평 수정
- **PATCH** `/api/v1/books/review/{reviewId}`
- **설명**: 작성한 감상평을 수정합니다.
- **Path Parameter**: `reviewId` (Long)
- **Request Body**: UpdateReviewDto

#### 감상평 목록 조회
- **GET** `/api/v1/books/{bookId}/reviews`
- **설명**: 특정 책의 모든 감상평을 조회합니다.
- **Path Parameter**: `bookId` (Long)

#### 내 감상평 조회
- **GET** `/api/v1/books/{bookId}/reviews/me`
- **설명**: 특정 책에 대한 내 감상평을 조회합니다.
- **Path Parameter**: `bookId` (Long)

#### 특정 사용자 감상평 조회
- **GET** `/api/v1/books/{bookId}/reviews/{memberId}`
- **설명**: 특정 책에 대한 특정 사용자의 감상평을 조회합니다.
- **Path Parameters**:
  - `bookId` (Long) - 책 ID
  - `memberId` (Long) - 사용자 ID

---

## 인증 관련 API (Authentication)

#### 토큰 재발급
- **POST** `/api/v1/auth/reissue`
- **설명**: Access Token과 Refresh Token을 재발급합니다.
- **Note**: 쿠키 기반 인증

#### 로그아웃
- **POST** `/api/v1/auth/logout`
- **설명**: 사용자를 로그아웃 처리합니다.
- **Note**: 쿠키 삭제

---

## Internal API (내부 서비스 간 통신용)

> **Note**: Internal API는 마이크로서비스 간 통신용으로, 클라이언트에서 직접 호출하면 안 됩니다.

### Internal Member Controller
- 회원 등록, 조회, 존재 여부 확인 등

### Internal Follow Controller
- 팔로우 관계 관리, 팔로우 여부 확인 등

### Internal Book Controller
- 책 정보 관리, 존재 여부 확인 등

### Internal Exchange Status Controller
- 교환 상태 관리, 교환 완료/반납 처리 등

---

## Health Check

#### 헬스 체크
- **GET** `/hc`
- **설명**: 서버 상태를 확인합니다.
- **Response**: 200 OK

---

## 공통 응답 형식

### 성공 응답
```json
{
  "code": "1000",
  "message": "Success",
  "result": {
    // 응답 데이터
  }
}
```

### 에러 응답
```json
{
  "code": "에러코드",
  "message": "에러 메시지",
  "result": null
}
```

---

## API 통계

- **총 엔드포인트 수**: 60개
- **Public API**: 43개
- **Internal API**: 17개

### Public API 분류
- **Member API**: 18개
- **Bookhouse API**: 4개
- **Chat API**: 8개
- **ExchangeRequest API**: 4개
- **Keyword API**: 3개
- **Book/Review API**: 6개
- **Authentication API**: 2개

---

## 문서 버전
- **최종 업데이트**: 2025-09-30
- **작성자**: Claude Code
- **출처**: Swagger OpenAPI 3.1.0 Specification