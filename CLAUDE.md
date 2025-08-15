# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Project Overview

This is a Next.js 15.4.5 application using React 19, TypeScript, and Tailwind
CSS v4. The project uses the Next.js App Router architecture.

## Commands

### Development

```bash
npm run dev      # Start development server with Turbopack
```

### Build & Production

```bash
npm run build    # Build the application for production
npm run start    # Start the production server
```

### Code Quality

```bash
npm run lint           # Run ESLint
npm run quality:check  # Run lint + build + test (full quality check)
npm run quality:fix    # Run ESLint with auto-fix
```

### Testing

```bash
# Unit Testing
npm run test            # Run Jest unit tests
npm run test:watch      # Run Jest in watch mode
npm run test:coverage   # Run Jest with coverage report

# E2E Testing
npm run test:e2e        # Run Playwright E2E tests (all browsers)
npm run test:ui         # Run Playwright with UI mode
npx playwright test --project=chromium --reporter=list  # Quick test (Chrome only, CLI output)
```

## Architecture

### Technology Stack

- **Framework**: Next.js 15.4.5 with App Router
- **UI**: React 19 with TypeScript
- **Styling**: Tailwind CSS v4 with PostCSS
- **Font**: Geist font family (Sans and Mono variants)
- **Linting**: ESLint 9 with Next.js configuration
- **State Management**: TanStack Query v5 for server state
- **Authentication**: OAuth2 (Google, Kakao) with cookie-based token management
- **Testing**: Jest + React Testing Library + Playwright + MSW

### Project Structure

- `/src/app/` - App Router pages and layouts
  - `layout.tsx` - Root layout with font configuration
  - `page.tsx` - Home page component
  - `login/page.tsx` - Login page with social authentication
  - `globals.css` - Global styles with Tailwind directives
- `/src/components/` - Reusable UI components
  - `auth/SocialLoginButtons.tsx` - Google/Kakao login buttons
- `/src/hooks/` - Custom React hooks
  - `useAuth.ts` - Authentication state management
- `/src/lib/` - Utility functions and configurations
  - `queryClient.ts` - TanStack Query client setup
- `/src/mocks/` - MSW API mocking
  - `handlers.ts` - Mock API handlers
  - `server.ts` - Mock server setup
- `/src/__tests__/` - Test files
  - `app/` - Unit tests for pages
  - `components/` - Component tests
- `/__tests__/e2e/` - Playwright E2E tests
  - `auth.spec.ts` - Authentication flow tests
- `/public/` - Static assets (SVG icons)
- TypeScript configuration uses strict mode with path alias `@/*` mapping to
  `./src/*`

### Key Configuration

- **TypeScript**: Strict mode enabled, using bundler module resolution
- **ESLint**: Configured with Next.js core-web-vitals and TypeScript rules
- **Tailwind CSS**: Version 4 with PostCSS plugin architecture
- **Jest**: Configured with next/jest for Next.js integration
- **Playwright**: Multi-browser testing with MCP integration support
- **MSW**: API mocking for development and testing

## Layout Design

- **Mobile-first fixed width**: 430px max-width for all devices
- **Center alignment**: Auto margins for desktop centering
- **Background separation**: Different background colors for body and content
  area
- **Dark mode support**: Automatic color scheme switching

## MCP Server Setup

### Playwright MCP

```bash
# Install Playwright MCP server
claude mcp add playwright -- npx -y @playwright/mcp@latest

# Verify installation
claude mcp list

# Restart Claude Code to activate MCP tools
exit
claude
```

### Context7 MCP

```bash
# Install Context7 MCP server for advanced codebase analysis
claude mcp add --transport http context7 https://mcp.context7.com

# Verify installation
claude mcp list

# Restart Claude Code to activate MCP tools
exit
claude
```

### Available Playwright Tools

After MCP setup, the following browser automation tools are available:

- `mcp__playwright__browser_navigate` - Navigate to URLs
- `mcp__playwright__browser_resize` - Set viewport size
- `mcp__playwright__browser_take_screenshot` - Capture screenshots
- `mcp__playwright__browser_snapshot` - Get accessibility tree
- `mcp__playwright__browser_click` - Click elements
- `mcp__playwright__browser_type` - Type text

### Testing Workflow

1. Start development server: `npm run dev`
2. Use Playwright MCP tools to:
   - Navigate to `http://localhost:3000`
   - Test different viewport sizes (375x812, 768x1024, 1920x1080)
   - Capture screenshots for visual verification
   - Verify 430px max-width constraint on all devices

## 인증 시스템 구현 현황

### OAuth2 소셜 로그인

현재 Google과 Kakao 소셜 로그인이 구현되어 있습니다.

#### 구현된 컴포넌트

- **로그인 페이지** (`/src/app/login/page.tsx`): 메인 로그인 UI
- **소셜 로그인 버튼** (`/src/components/auth/SocialLoginButtons.tsx`):
  Google/Kakao 버튼 컴포넌트
- **인증 훅** (`/src/hooks/useAuth.ts`): TanStack Query 기반 인증 상태 관리

#### OAuth2 엔드포인트

```typescript
// Google 로그인
window.location.assign('/oauth2/authorization/google');

// Kakao 로그인
window.location.assign('/oauth2/authorization/kakao');
```

#### 토큰 관리

- **액세스 토큰**: 쿠키 기반 저장 (`access_token`)
- **리프레시 토큰**: 쿠키 기반 저장 (`refresh_token`)
- **TanStack Query**: 서버 상태 관리 및 캐싱

### 구현 완료 상태

- ✅ 로그인 페이지 UI (반응형 디자인 포함)
- ✅ Google/Kakao 소셜 로그인 버튼
- ✅ TanStack Query 설정 및 인증 훅
- ✅ Unit 테스트 (Jest + React Testing Library)
- ✅ E2E 테스트 (Playwright + MCP 통합)
- 🔄 MSW API 모킹 설정 (진행 중)

## 테스트 환경 설정

TDD로 개발을 진행해야 함

### Unit Testing (Jest + React Testing Library)

```bash
# 설정 파일
jest.config.js          # Jest 설정 (next/jest 사용)
src/setupTests.ts       # Jest 환경 설정

# 테스트 실행
npm run test            # 모든 단위 테스트 실행
npm run test:watch      # Watch 모드
npm run test:coverage   # 커버리지 리포트
```

**주요 테스트 파일:**

- `src/__tests__/app/login/page.test.tsx` - 로그인 페이지 컴포넌트 테스트
- `src/__tests__/components/auth/SocialLoginButtons.test.tsx` - 소셜 로그인 버튼
  테스트

### E2E Testing (Playwright)

```bash
# 설정 파일
playwright.config.ts    # Playwright 설정

# 테스트 실행
npm run test:e2e        # 모든 브라우저에서 E2E 테스트
npx playwright test --project=chromium --reporter=list  # Chrome만, CLI 결과
npm run test:ui         # UI 모드로 테스트
```

**테스트 브라우저:**

- Desktop: Chrome, Firefox, Safari, Edge
- Mobile: Chrome (Pixel 5), Safari (iPhone 12)

**주요 테스트 시나리오** (`__tests__/e2e/auth.spec.ts`):

1. 로그인 페이지 기본 요소 표시 확인
2. 반응형 레이아웃 테스트 (모바일, 태블릿, 데스크톱)
3. 소셜 로그인 버튼 스타일 검증
4. OAuth 리다이렉트 기능 테스트

### MCP Playwright 통합

MCP를 통해 브라우저 자동화가 가능합니다:

```bash
# MCP 설치 및 설정
claude mcp add playwright -- npx -y @playwright/mcp@latest

# 사용 가능한 MCP 도구
mcp__playwright__browser_navigate     # URL 이동
mcp__playwright__browser_resize       # 뷰포트 크기 변경
mcp__playwright__browser_take_screenshot  # 스크린샷 촬영
mcp__playwright__browser_click        # 요소 클릭
mcp__playwright__browser_evaluate     # JavaScript 실행
```

### API Mocking (MSW)

Mock Service Worker를 사용한 API 모킹 설정:

```bash
# MSW 설정 파일
src/mocks/handlers.ts   # API 핸들러 정의
src/mocks/server.ts     # Mock 서버 설정
```

**주요 모킹 엔드포인트:**

- `/oauth2/authorization/google` - Google OAuth 시뮬레이션
- `/oauth2/authorization/kakao` - Kakao OAuth 시뮬레이션
- `/api/auth/me` - 사용자 정보 조회
- `/api/auth/logout` - 로그아웃

## 프로젝트 기능 명세서

### 1. 인증 시스템

#### 1.1 로그인

- **구글 로그인**: 기존 회원 → 메인 페이지, 신규 회원 → 회원가입
- **카카오 로그인**: 기존 회원 → 메인 페이지, 신규 회원 → 회원가입

#### 1.2 회원가입

- **전화번호 인증** (추후 2FA 추가 예정)
- **개인정보 입력**
  - 닉네임 설정
  - 프로필 사진 (선택)
  - 동네 정보 (당근마켓 참고)
- **독서 습관 입력**
  - 교환 가능 시간대 입력 (텍스트)
  - 나중에 설정하기/건너뛰기 가능
  - 마이페이지에서 수정 가능

### 2. 메인 기능

#### 2.1 대시보드

- **현재 교환 정보**: D-15, 책 제목, 책 표지, 채팅방 이동
- **사용자 추천**: 취향 비슷한 유저 (동네 가까우면 우선 추천)
- **책 추천**: 취향 기반 추천

#### 2.2 AI 기반 책 추천

- 오늘의 책 추천
- 취향 선택
- 내 주변 이웃들의 책 추천

#### 2.3 서재

- **책 관리**
  - 책 등록 (ISBN 스캔 또는 직접 입력)
  - 등록한 책들 보여주기 (무한 스크롤)
  - 내 감상평 등록
  - 독서율 표시 (완독/N회독/N%)
- **책 분류**
  - 내 책
  - 빌린 책
  - 빌려준 책
- **상호작용**: 책 세부 정보에서 채팅 버튼

#### 2.4 유저

- **유저 검색 및 팔로우**
- **유저 프로필**
  - 개인 서재 보기
  - 작성한 책 리뷰
  - 교환한 책 개수
  - 받은 리뷰 (채팅 응답률, 교환 만족도 1-5점)

#### 2.5 채팅

- **교환 프로세스**
  - 교환 약속 잡기 모듈
  - 교환 가능 시간대 표시
  - 책방 예약 상태 변경
- **채팅 진입**: 서재 게시글을 통해서만 가능
- **알림**
  - 채팅 알림
  - 교환 약속 알림
  - 반납 D-day 알림

#### 2.6 마이페이지

- 개인 정보 수정 (휴대폰 번호, 동네, 이름)
- 독서 습관 재설정
- 푸시 설정
- 버전 정보 & 개인정보처리방침

#### 2.7 알림

- 알림 모아보기
- 알림 내용 영구 보관
- 읽음 표시 기능

### 3. 책 등록 방식

#### 3.1 ISBN 등록

- 책 제목
- 저자
- 표지 사진
- 출판사

#### 3.2 직접 입력

- 책 제목
- 저자
- 표지 사진
- 출판사

## 디자인 시스템

### 컬러 팔레트

#### Primary Colors (Blue - #AFD6F8)

- primary-50: #F3FDFE
- primary-100: #DAF1FE
- primary-200: #C4E5FB
- primary-300: #9BC7EC
- **primary-400: #AFD6F8** (Main)
- primary-500: #8FC1E8
- primary-600: #6FA3CA
- primary-700: #4F85AC
- primary-800: #2F678E
- primary-900: #0F4970

#### Secondary Colors (Teal - #B8DBDE)

- secondary-50: #E2EDEB
- secondary-100: #E0F3F7
- **secondary-200: #B8DBDE** (Main)
- secondary-300: #ABDAE2
- secondary-400: #CEEDED
- secondary-500: #7FC6D7
- secondary-600: #5FA8B9
- secondary-700: #3F8A9B
- secondary-800: #1F6C7D
- secondary-900: #004E5F

### 사용 가이드

#### Tailwind 클래스 사용법

```html
<!-- Primary 색상 -->
<div className="bg-primary-400 text-white">Primary 배경</div>
<div className="text-primary-600 border-primary-400">Primary 텍스트</div>

<!-- Secondary 색상 -->
<div className="bg-secondary-200 text-gray-800">Secondary 배경</div>
<div className="text-secondary-600 border-secondary-300">Secondary 텍스트</div>

<!-- Semantic 토큰 -->
<div className="bg-surface border-border">카드 컴포넌트</div>
<div className="text-success">성공 메시지</div>
```

#### 컴포넌트 스타일 가이드

##### 버튼

- **Primary**: `bg-primary-400 hover:bg-primary-500 text-white`
- **Secondary**: `bg-secondary-200 hover:bg-secondary-300 text-gray-800`
- **Outline**:
  `border-2 border-primary-400 text-primary-600 hover:bg-primary-50`
- **Ghost**: `text-primary-600 hover:bg-gray-100`

##### 카드

- **배경**: `bg-surface dark:bg-surface`
- **테두리**: `border border-border dark:border-gray-700`
- **그림자**: `shadow-sm hover:shadow-md`

##### 폼 요소

- **Input**:
  `bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:ring-primary-400`
- **Label**: `text-gray-700 dark:text-gray-300`

##### 상태 색상

- **Success**: `bg-green-50 border-success text-success`
- **Warning**: `bg-yellow-50 border-warning text-warning`
- **Error**: `bg-red-50 border-error text-error`
- **Info**: `bg-blue-50 border-info text-info`

### 다크모드

- 시스템 설정에 따라 자동 전환
- Primary/Secondary 색상은 밝기 자동 조정
- 배경과 텍스트는 반전 처리

## 코드 품질 관리

### 자동화된 코드 품질 검사

프로젝트에는 Husky와 lint-staged를 사용한 자동화된 코드 품질 검사 시스템이 구축
되어 있습니다.

#### Git Hooks

- **pre-commit**: 커밋 전 lint, build, lint-staged 실행
- **pre-push**: 푸시 전 전체 테스트 실행

#### 코드 품질 스크립트

```bash
npm run quality:check  # 전체 품질 검사 (lint + build + test)
npm run quality:fix    # ESLint 자동 수정
```

#### Lint-staged 설정

커밋 시 staging된 파일에 대해 자동으로:

- TypeScript/JavaScript 파일: ESLint 자동 수정
- TypeScript 파일: 빌드 검증

### 코딩 표준

- **TypeScript 엄격 모드** 사용
- **ESLint 규칙** 준수 (Next.js + TypeScript)
- **any 타입 사용 금지** - unknown 타입 사용 권장
- **컴포넌트 displayName** 필수 (테스트 환경)
- **require() 대신 import() 사용** (ES6 모듈)

### 빌드 실패 감지

Git hooks를 통해 다음 상황에서 자동으로 빌드 실패를 감지:

1. ESLint 에러 발생 시
2. TypeScript 컴파일 에러 발생 시
3. 테스트 실패 시
4. 빌드 과정 실패 시

### 개발 워크플로우

1. 코드 작성
2. `npm run quality:check`로 로컬 검증
3. `git add .` (staging)
4. `git commit` (pre-commit hook 자동 실행)
5. `git push` (pre-push hook으로 테스트 실행)

이 시스템을 통해 빌드 실패나 코드 품질 문제를 사전에 방지할 수 있습니다.

## 개발 및 테스트 프로세스

### 1. 개발 환경 구성

```bash
# 의존성 설치
npm install

# 개발 서버 시작
npm run dev  # http://localhost:3000

# MCP 서버 설정 (선택사항)
claude mcp add playwright -- npx -y @playwright/mcp@latest
claude mcp add --transport http context7 https://mcp.context7.com
```

### 2. 개발 단계별 테스트 가이드

#### 2.1 기능 개발 중

```bash
# Watch 모드로 Unit 테스트 실행
npm run test:watch

# 특정 파일 테스트
npm test -- src/__tests__/components/auth/SocialLoginButtons.test.tsx

# 커버리지 확인
npm run test:coverage
```

#### 2.2 기능 개발 완료 후

```bash
# 전체 품질 검사 (필수)
npm run quality:check

# 개별 검사 단계
npm run lint           # ESLint 검사
npm run build          # 빌드 검증
npm test               # 전체 단위 테스트
```

#### 2.3 UI/UX 검증

```bash
# E2E 테스트 (권장: Chrome만 빠른 테스트)
npx playwright test --project=chromium --reporter=list

# 전체 브라우저 E2E 테스트
npm run test:e2e

# UI 모드로 시각적 테스트
npm run test:ui
```

### 3. Git 워크플로우

#### 3.1 커밋 전 체크리스트

- [ ] `npm run quality:check` 통과
- [ ] 새로운 기능에 대한 테스트 작성 완료
- [ ] ESLint 에러 해결
- [ ] TypeScript 컴파일 에러 해결

#### 3.2 자동화된 Git Hooks

```bash
# pre-commit: 자동 실행됨
npm run lint           # ESLint 검사
npx lint-staged        # Staged 파일 자동 수정

# pre-push: 자동 실행됨
npm test               # 전체 테스트 실행
```

### 4. 테스트 유형별 가이드

#### 4.1 Unit Testing (Jest + React Testing Library)

**대상**: 컴포넌트, 훅, 유틸리티 함수

```bash
# 모든 단위 테스트
npm test

# 특정 테스트 패턴
npm test -- --testNamePattern="should render"

# Watch 모드
npm run test:watch
```

**테스트 파일 위치**:

- 컴포넌트: `src/__tests__/components/`
- 페이지: `src/__tests__/app/`
- 훅: `src/__tests__/hooks/`

#### 4.2 API Mocking (MSW)

**MSW 핸들러 확인**:

```bash
# MSW 모킹 테스트
npm test -- src/__tests__/mocks.test.ts
```

**Mock API 엔드포인트**:

- `/oauth2/authorization/google` - Google OAuth
- `/oauth2/authorization/kakao` - Kakao OAuth
- `/api/auth/me` - 인증 상태 확인
- `/api/auth/logout` - 로그아웃

#### 4.3 E2E Testing (Playwright)

**대상**: 사용자 플로우, 페이지 간 이동, 브라우저 호환성

```bash
# 빠른 E2E 테스트 (Chrome만)
npx playwright test --project=chromium --reporter=list

# 전체 브라우저 테스트
npm run test:e2e

# 디버그 모드
npm run test:ui

# 특정 테스트 파일
npx playwright test __tests__/e2e/auth.spec.ts
```

**테스트 브라우저**:

- Desktop: Chrome, Firefox, Safari, Edge
- Mobile: Chrome (Pixel 5), Safari (iPhone 12)

### 5. 프로덕션 배포 전 체크리스트

#### 5.1 필수 검증 항목

- [ ] `npm run quality:check` 100% 통과
- [ ] 모든 E2E 테스트 통과
- [ ] 프로덕션 빌드 성공: `npm run build`
- [ ] 다양한 브라우저에서 기능 검증
- [ ] 모바일 반응형 동작 확인

#### 5.2 성능 검증

```bash
# 프로덕션 빌드 크기 확인
npm run build

# 로컬 프로덕션 서버 테스트
npm run start
```

### 6. 트러블슈팅 가이드

#### 6.1 테스트 실패 시

1. **Unit 테스트 실패**:

   - MSW 핸들러 설정 확인
   - 비동기 처리 (`waitFor`) 확인
   - Mock 함수 초기화 확인

2. **E2E 테스트 실패**:

   - 개발 서버 실행 상태 확인
   - 브라우저별 차이점 확인
   - 타이밍 이슈 (`page.waitFor`) 확인

3. **빌드 실패**:
   - TypeScript 에러 해결
   - ESLint 규칙 준수
   - Import 경로 확인

#### 6.2 Hook 실패 시

```bash
# Hook 비활성화 (긴급시에만)
git commit --no-verify

# Hook 재설정
npx husky install
```

### 7. 새로운 기능 개발 시 권장 프로세스

1. **기능 설계**: 요구사항 명확화
2. **테스트 우선 작성**: TDD 방식 권장
3. **컴포넌트 구현**: 기본 UI 구현
4. **인증/상태 연동**: useAuth, TanStack Query 활용
5. **Unit 테스트 보완**: 엣지 케이스 추가
6. **E2E 테스트 추가**: 사용자 시나리오 기반
7. **코드 리뷰**: `npm run quality:check` 통과 확인
8. **최종 검증**: 다양한 환경에서 테스트

이 프로세스를 따라 안정적이고 품질 높은 코드를 개발할 수 있습니다.

- dev서버는 3000포트에서 열려있으면 그거 사용하고 없을때만 키기
