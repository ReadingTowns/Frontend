// API 응답 코드 상수들 (노션 API 명세서 기준)
// 백엔드가 숫자로 반환하므로 숫자 타입 사용
export const API_CODES = {
  // 성공 코드들
  SUCCESS: 1000, // 일반 성공
  CHAT_SUCCESS: 2000, // 채팅/교환 관련 성공

  // 에러 코드들
  TOKEN_EXPIRED: 3005, // 만료된 토큰
  UNAUTHORIZED: 4001,
  BAD_REQUEST: 4000,
  NOT_FOUND: 4004,
  INTERNAL_ERROR: 5000,
} as const

// 응답 메시지 상수들 (노션 API 명세서 기준)
export const API_MESSAGES = {
  // 일반
  SUCCESS: 'Success',
  OK: 'OK',

  // 인증 관련
  LOGIN_SUCCESS: '로그인 성공',
  LOGOUT_SUCCESS: '로그아웃 성공',
  UNAUTHORIZED: '인증이 필요합니다',
  TOKEN_EXPIRED: '토큰이 만료되었습니다',

  // 서재 관련
  LIBRARY_BOOKS_SUCCESS: '서재 책 리스트 조회 완료',
  BOOK_REGISTER_SUCCESS: '서재에 책 등록 완료',
  BOOK_DELETE_SUCCESS: '서재 책 삭제 완료',

  // 감상평 관련
  REVIEW_CREATE_SUCCESS: '감상평 등록 완료',
  REVIEW_UPDATE_SUCCESS: '감상평 수정 완료',
  REVIEW_GET_SUCCESS: '나의 감상평 조회 완료',
  REVIEW_NOT_FOUND: '감상평이 없습니다',

  // 프로필 관련
  PROFILE_SUCCESS: '프로필 조회 완료',

  // 채팅/교환 관련
  CHAT_ROOM_CREATE_SUCCESS: '채팅룸 생성 완료',
  CHAT_ROOM_EXIT_SUCCESS: '채팅룸 나가기 완료',
  EXCHANGE_REQUEST_SUCCESS: '교환 요청 생성 완료',
  EXCHANGE_REQUEST_ACCEPT: '교환 요청 수락 완료',
  EXCHANGE_REQUEST_REJECT: '교환 요청 거절 완료',
  EXCHANGE_REQUEST_CANCEL: '교환 신청 삭제 완료',
  EXCHANGE_COMPLETE: '반납 완료',

  // 대시보드 관련
  DASHBOARD_BOOKS_SUCCESS: '대시보드용 책방 책 리스트 조회 완료',
  BOOK_INFO_SUCCESS: '책 정보 조회 완료',
  BOOK_OWNER_SUCCESS: '책 소유자 정보 조회 완료',

  // 팔로우 관련
  FOLLOW_SUCCESS: '팔로우 완료',
  UNFOLLOW_SUCCESS: '언팔로우 완료',
} as const
