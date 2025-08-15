# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15.4.5 application using React 19, TypeScript, and Tailwind CSS v4. The project uses the Next.js App Router architecture.

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
npm run lint     # Run ESLint
```

## Architecture

### Technology Stack
- **Framework**: Next.js 15.4.5 with App Router
- **UI**: React 19 with TypeScript
- **Styling**: Tailwind CSS v4 with PostCSS
- **Font**: Geist font family (Sans and Mono variants)
- **Linting**: ESLint 9 with Next.js configuration

### Project Structure
- `/src/app/` - App Router pages and layouts
  - `layout.tsx` - Root layout with font configuration
  - `page.tsx` - Home page component
  - `globals.css` - Global styles with Tailwind directives
- `/public/` - Static assets (SVG icons)
- TypeScript configuration uses strict mode with path alias `@/*` mapping to `./src/*`

### Key Configuration
- **TypeScript**: Strict mode enabled, using bundler module resolution
- **ESLint**: Configured with Next.js core-web-vitals and TypeScript rules
- **Tailwind CSS**: Version 4 with PostCSS plugin architecture

## Layout Design
- **Mobile-first fixed width**: 430px max-width for all devices
- **Center alignment**: Auto margins for desktop centering
- **Background separation**: Different background colors for body and content area
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
- **Outline**: `border-2 border-primary-400 text-primary-600 hover:bg-primary-50`
- **Ghost**: `text-primary-600 hover:bg-gray-100`

##### 카드
- **배경**: `bg-surface dark:bg-surface`
- **테두리**: `border border-border dark:border-gray-700`
- **그림자**: `shadow-sm hover:shadow-md`

##### 폼 요소
- **Input**: `bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:ring-primary-400`
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