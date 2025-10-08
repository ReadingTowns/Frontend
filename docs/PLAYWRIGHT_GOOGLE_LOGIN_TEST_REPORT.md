# Playwright Google 로그인 테스트 보고서

## 테스트 정보
- **일시**: 2025-10-04
- **테스트 도구**: Playwright MCP
- **테스트 환경**: localhost:3000 (개발 서버)
- **테스트 대상**: Google OAuth2 로그인 플로우

## 테스트 시나리오

### 1. 로그인 페이지 접근
✅ **성공**: http://localhost:3000/login 정상 접근

### 2. UI 요소 확인
✅ **확인된 요소**:
- 타이틀: "리딩타운"
- 서브타이틀: "책으로 이웃과 연결되는 공간"
- Google 로그인 버튼
- 카카오 로그인 버튼
- 개발자 로그인 버튼 (Dev Mode)

### 3. Google 로그인 버튼 클릭
✅ **동작 확인**: 버튼 클릭 시 OAuth 플로우 시작

## OAuth 리다이렉트 플로우 분석

### 네트워크 요청 시퀀스
1. **초기 요청**: `/api/oauth2/authorization/google`
   - 응답: 307 Temporary Redirect

2. **백엔드 리다이렉트**: `https://readingtown.site/oauth2/authorization/google`
   - 응답: 302 Redirect

3. **Google OAuth**: `https://accounts.google.com/o/oauth2/v2/auth`
   - Parameters:
     - client_id: 539547550749-2vjk6os6755ks550l86kp9n1ra2hma36.apps.googleusercontent.com
     - scope: email profile
     - redirect_uri: https://readingtown.site/login/oauth2/code/google
   - 응답: 302 (인증 완료)

4. **콜백 처리**: `https://readingtown.site/login/oauth2/code/google`
   - 인증 코드 수신
   - 응답: 302 Redirect to /home

5. **최종 리다이렉트**: `https://readingtowns.vercel.app/home`
   - /home 접근 시도
   - 인증 실패로 /login 으로 리다이렉트

## 발견된 이슈

### 🔴 Critical Issue: 리다이렉트 URI 불일치
**문제점**: 백엔드와 프론트엔드 간 리다이렉트 URI 설정 불일치
- **백엔드 설정**: `https://readingtown.site/login/oauth2/code/google`
- **프론트엔드 기대**: `/auth/callback/google`

**영향**:
- OAuth 콜백이 프론트엔드에서 처리되지 않음
- 인증 완료 후에도 로그인 페이지로 돌아옴

### 🟡 Medium Issue: 도메인 불일치
**문제점**: 개발 환경과 프로덕션 도메인 혼재
- 로컬 개발: `localhost:3000`
- 백엔드: `readingtown.site`
- Vercel 배포: `readingtowns.vercel.app`

**영향**:
- 쿠키 공유 불가능
- 세션 유지 실패

### 🟡 Medium Issue: API Route 미구현
**문제점**: `/api/oauth2/authorization/google` API Route가 단순 리다이렉트만 수행
- 백엔드 직접 호출 대신 프록시 역할만 수행

## 권장 해결 방안

### 즉시 조치 필요
1. **리다이렉트 URI 통일**
   ```javascript
   // 백엔드에 요청: redirect_uri 변경
   // FROM: https://readingtown.site/login/oauth2/code/google
   // TO: https://readingtown.site/auth/callback/google
   ```

2. **API Route 수정**
   ```typescript
   // src/app/api/oauth2/authorization/google/route.ts
   export async function GET() {
     // 백엔드 URL과 일치하도록 수정
     const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://readingtown.site';
     return NextResponse.redirect(
       `${backendUrl}/oauth2/authorization/google`
     );
   }
   ```

3. **콜백 라우트 생성**
   ```typescript
   // src/app/login/oauth2/code/google/page.tsx
   // 백엔드 콜백을 처리할 새로운 페이지 생성
   // 기존 /auth/callback/google 로직 재사용
   ```

### 장기 개선 사항
1. **환경 변수 통일**
   - NEXT_PUBLIC_BACKEND_URL 환경 변수 추가
   - 개발/스테이징/프로덕션 환경 구분

2. **에러 처리 강화**
   - OAuth 에러 파라미터 처리
   - 사용자 친화적 에러 메시지

3. **로컬 개발 환경 개선**
   - 백엔드 Mock 서버 구축
   - 또는 로컬 백엔드 실행 가이드

## 테스트 증거

### 스크린샷
1. **초기 로그인 페이지**: `login-page-initial.png`
2. **OAuth 후 결과**: `google-oauth-redirect-result.png`

### 네트워크 로그
- 총 45개 요청 캡처
- OAuth 플로우 전체 추적 완료
- 쿠키 설정 확인 (JSESSIONID)

## 결론

Google OAuth 인증 플로우는 백엔드 측에서는 정상 작동하나, **프론트엔드와 백엔드 간 리다이렉트 URI 불일치**로 인해 완전한 인증이 불가능한 상태입니다.

**우선순위**:
1. 🔴 리다이렉트 URI 통일 (Critical)
2. 🟡 API Route 정리 (Medium)
3. 🔵 환경 변수 설정 (Low)

이 문제들을 해결하면 Google 로그인이 정상 작동할 것으로 예상됩니다.