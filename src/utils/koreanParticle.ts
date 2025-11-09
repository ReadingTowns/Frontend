/**
 * 한국어 조사 자동 선택 유틸리티
 * 받침 유무에 따라 적절한 조사를 선택
 *
 * @example
 * withJosa('홍길동', '이/가') // "홍길동이"
 * withJosa('내', '이/가')     // "내가"
 * withJosa('김철수', '이/가') // "김철수가"
 */

/**
 * 받침 유무 판단
 * @param str 판단할 문자열 (마지막 글자 기준)
 * @returns 받침 있으면 true, 없으면 false
 *
 * @description
 * 한글 유니코드 구조:
 * - 범위: 0xAC00(가) ~ 0xD7A3(힣)
 * - 구조: 초성(19) × 중성(21) × 종성(28) = 11,172자
 * - 받침 판단: (code - 0xAC00) % 28 === 0 → 받침 없음
 */
function hasFinalConsonant(str: string): boolean {
  if (!str || str.length === 0) return false

  const lastChar = str[str.length - 1]
  const code = lastChar.charCodeAt(0)

  // 한글 유니코드 범위: 0xAC00(가) ~ 0xD7A3(힣)
  if (code < 0xac00 || code > 0xd7a3) {
    // 한글이 아닌 경우 (영어, 숫자 등)
    // 영어는 받침 없음으로 처리
    return false
  }

  // 받침 여부: (code - 0xAC00) % 28 === 0이면 받침 없음
  return (code - 0xac00) % 28 !== 0
}

/**
 * 이/가 조사 선택
 * @param name 주어 (예: "홍길동", "내")
 * @returns "이" 또는 "가"
 *
 * @example
 * josa_i_ga('홍길동') // "이"
 * josa_i_ga('내')     // "가"
 */
export function josa_i_ga(name: string): string {
  return hasFinalConsonant(name) ? '이' : '가'
}

/**
 * 을/를 조사 선택
 * @param name 목적어
 * @returns "을" 또는 "를"
 *
 * @example
 * josa_eul_reul('홍길동') // "을"
 * josa_eul_reul('내')     // "를"
 */
export function josa_eul_reul(name: string): string {
  return hasFinalConsonant(name) ? '을' : '를'
}

/**
 * 은/는 조사 선택
 * @param name 주제어
 * @returns "은" 또는 "는"
 *
 * @example
 * josa_eun_neun('홍길동') // "은"
 * josa_eun_neun('내')     // "는"
 */
export function josa_eun_neun(name: string): string {
  return hasFinalConsonant(name) ? '은' : '는'
}

/**
 * 조사와 함께 이름 반환
 * @param name 이름
 * @param josaType 조사 타입 ('이/가', '을/를', '은/는')
 * @returns "이름+조사" (예: "홍길동이", "내가")
 *
 * @example
 * withJosa('홍길동', '이/가') // "홍길동이"
 * withJosa('내', '이/가')     // "내가"
 * withJosa('김철수', '이/가') // "김철수가"
 * withJosa('Alice', '이/가')  // "Alice가"
 */
export function withJosa(
  name: string,
  josaType: '이/가' | '을/를' | '은/는'
): string {
  switch (josaType) {
    case '이/가':
      return `${name}${josa_i_ga(name)}`
    case '을/를':
      return `${name}${josa_eul_reul(name)}`
    case '은/는':
      return `${name}${josa_eun_neun(name)}`
  }
}
