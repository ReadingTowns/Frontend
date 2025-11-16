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
