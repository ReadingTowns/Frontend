# Notion MCP 서버 설치 가이드 (Claude Code/Cursor)

**연구 날짜**: 2025-11-15
**신뢰도**: ⭐⭐⭐⭐⭐ (공식 문서 및 검증된 소스 기반)

---

## 📋 목차

1. [개요](#개요)
2. [설치 방법](#설치-방법)
3. [Notion Integration Token 생성](#notion-integration-token-생성)
4. [Claude Code/Cursor 설정](#claude-codecursor-설정)
5. [검증 및 사용법](#검증-및-사용법)
6. [문제 해결](#문제-해결)

---

## 개요

**Notion MCP란?**
- Model Context Protocol을 통해 AI 도구(Claude, Cursor 등)가 Notion workspace와 직접 연동되는 시스템
- 실시간으로 Notion 페이지 읽기/쓰기/수정 가능
- Claude Code, Cursor, ChatGPT Pro 등에서 사용 가능

**주요 기능**:
- Notion 페이지, 데이터베이스, 코멘트 접근
- 자연어로 Notion 콘텐츠 생성/수정
- 사용자 권한에 따른 자동 접근 제어

---

## 설치 방법

### 방법 1: Notion 호스팅 MCP 서버 (추천) ✅

가장 간단한 방법으로, Notion이 공식 제공하는 호스팅 서버 사용

**장점**:
- API 토큰 불필요
- 별도 설정 최소화
- 자동 업데이트

**설치 단계**:

1. **Cursor/Claude Code MCP 설정 파일 열기**:
   ```bash
   # Cursor
   ~/.cursor/mcp.json

   # Claude Desktop (MacOS)
   ~/Library/Application Support/Claude/claude_desktop_config.json
   ```

2. **MCP 설정 추가**:
   ```json
   {
     "mcpServers": {
       "notionMCP": {
         "command": "npx",
         "args": ["-y", "mcp-remote", "https://mcp.notion.com/mcp"]
       }
     }
   }
   ```

3. **애플리케이션 재시작**:
   - Cursor: 완전히 종료 후 재실행
   - Claude Desktop: Quit 후 재시작

### 방법 2: 로컬 Notion MCP 서버 (API 토큰 방식)

자체 호스팅 방식으로 더 많은 제어가 필요한 경우

**필수 요구사항**:
- Node.js 설치
- Notion Integration Token (API 키)

**설치 단계**:

1. **Smithery CLI 사용 (가장 쉬운 방법)**:
   ```bash
   npx -y @smithery/cli install @makenotion/notion-mcp-server --client claude
   ```

2. **수동 설정**:

   MCP 설정 파일에 다음 추가:
   ```json
   {
     "mcpServers": {
       "notionApi": {
         "command": "npx",
         "args": ["-y", "@notionhq/notion-mcp-server"],
         "env": {
           "OPENAPI_MCP_HEADERS": "{\"Authorization\": \"Bearer YOUR_NOTION_TOKEN\", \"Notion-Version\": \"2022-06-28\"}"
         }
       }
     }
   }
   ```

3. **GitHub 저장소 클론 방식**:
   ```bash
   git clone https://github.com/makenotion/notion-mcp-server
   cd notion-mcp-server
   npm install
   npm run build
   ```

---

## Notion Integration Token 생성

API 토큰 방식을 사용하는 경우 필수 단계

### 단계별 가이드

1. **Integration 생성 페이지 접속**:
   - URL: https://www.notion.so/my-integrations
   - **주의**: Workspace Owner 권한 필요

2. **"+ New integration" 클릭**:
   - Integration 이름 입력 (예: "Claude MCP Server")
   - Associated workspace 선택
   - Capabilities 설정:
     - ✅ Read content
     - ✅ Update content
     - ✅ Insert content

3. **Integration Token 복사**:
   - Configuration 탭에서 "Internal Integration Token" 복사
   - 형식: `secret_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`
   - **보안 주의**: 이 토큰을 공개 저장소에 커밋하지 말 것

4. **페이지 공유 설정**:
   - Notion 페이지 우측 상단 `•••` 메뉴 클릭
   - "Add connections" 선택
   - 생성한 Integration 검색 후 추가
   - **중요**: 공유하지 않은 페이지는 MCP가 접근 불가

---

## Claude Code/Cursor 설정

### Cursor 설정

1. **MCP 설정 파일 위치**:
   ```bash
   ~/.cursor/mcp.json
   ```

2. **설정 파일 편집**:
   ```json
   {
     "mcpServers": {
       "notionMCP": {
         "command": "npx",
         "args": ["-y", "mcp-remote", "https://mcp.notion.com/mcp"]
       }
     }
   }
   ```

3. **Cursor MCP 설정 UI**:
   - Cursor 메뉴: Settings → MCP
   - Refresh 버튼 클릭
   - Notion MCP 서버 활성화 확인

4. **Agent 모드 활성화**:
   - Cursor는 Agent 모드에서만 MCP 사용 가능
   - **중요**: 최대 40개 도구까지 동시 사용 가능 (필요시 비활성화)

### Claude Code CLI 설정

```bash
# 프로젝트 범위 설정
claude mcp add notion-mcp -s project -- npx -y mcp-remote https://mcp.notion.com/mcp

# 사용자 범위 설정 (전역)
claude mcp add notion-mcp -s user -- npx -y mcp-remote https://mcp.notion.com/mcp
```

### 설정 검증

```bash
# MCP 서버 목록 확인
claude mcp list

# 예상 출력:
# - notion-mcp (active)
# - serena (active)
# - context7 (active)
# ...
```

---

## 검증 및 사용법

### 1. MCP 서버 활성화 확인

**Cursor**:
- Settings → MCP 메뉴에서 "notionMCP" 활성화 확인
- 도구 목록에 Notion 관련 도구 표시 여부 확인

**Claude Code**:
```bash
claude mcp list
```

### 2. 기본 테스트

Cursor 또는 Claude Desktop에서 다음 명령 시도:

```
"Notion에서 '프로젝트 노트' 페이지를 찾아줘"
"새로운 Notion 페이지를 만들어줘: 제목은 'MCP 테스트'"
"내 Notion 데이터베이스 목록 보여줘"
```

### 3. 사용 예시

**페이지 생성**:
```
Notion에 '챗봇 연동 계획' 페이지를 만들고 다음 내용을 추가해줘:
- 목표: AI 챗봇과 Notion 연동
- 주요 기능: 실시간 문서 동기화
- 기술 스택: MCP, Next.js
```

**데이터베이스 조회**:
```
Notion '프로젝트' 데이터베이스에서 진행 중인 항목만 보여줘
```

**검색**:
```
Notion에서 '챗봇'이라는 키워드가 포함된 모든 페이지 찾아줘
```

---

## 문제 해결

### 일반적인 문제

#### 1. MCP 서버가 감지되지 않음

**해결 방법**:
- 애플리케이션 완전 재시작 (Quit 후 재실행)
- MCP 설정 파일 JSON 문법 검증 (콤마, 중괄호 확인)
- `npx` 명령어 실행 가능 여부 확인:
  ```bash
  npx --version
  ```

#### 2. "Page not found" 또는 권한 오류

**해결 방법**:
- Notion 페이지 공유 설정 확인 (Add connections)
- Integration에 올바른 Capabilities 부여 확인
- Workspace Owner 권한 확인

#### 3. API 토큰 인증 실패

**해결 방법**:
- Integration Token 형식 확인 (`secret_` 접두사 포함)
- `OPENAPI_MCP_HEADERS` JSON escape 처리 확인
- Token 만료 여부 확인 (Notion Integration 페이지)

#### 4. Cursor에서 40개 도구 제한

**해결 방법**:
- Settings → MCP에서 사용하지 않는 서버 비활성화
- 필요한 MCP 서버만 선택적으로 활성화

### 로그 확인

**Cursor 로그**:
```bash
~/Library/Logs/Cursor/
```

**Claude Desktop 로그**:
```bash
~/Library/Logs/Claude/
```

---

## 대체 패키지

공식 Notion MCP 외에 커뮤니티 구현체:

### 1. notion-mcp-server
```bash
npm install -g notion-mcp-server
```
- 프로덕션 준비 완료
- 자연어 인터페이스
- 169+ 다운로드

### 2. @larryhudson/simple-notion-mcp-server
```bash
npm install -g @larryhudson/simple-notion-mcp-server
```
- Markdown 렌더링 최적화
- LLM 효율적 처리
- 경량화 버전

### 3. @ramidecodes/mcp-server-notion
```bash
npm install -g @ramidecodes/mcp-server-notion
```
- 공식 Notion SDK 래퍼
- 완전한 API 접근

---

## 참고 자료

### 공식 문서
- **Notion MCP 공식 페이지**: https://developers.notion.com/docs/mcp
- **Notion Integration 생성**: https://www.notion.so/my-integrations
- **Claude Code MCP 가이드**: https://docs.claude.com/en/docs/claude-code/mcp

### GitHub 저장소
- **공식 Notion MCP Server**: https://github.com/makenotion/notion-mcp-server
- **Claude Code MCP**: https://github.com/steipete/claude-code-mcp

### 커뮤니티 가이드
- **Medium 튜토리얼**: "How I Connected Claude to Notion Using MCP"
- **DEV Community**: "Operating Notion via Claude Desktop Using MCP"
- **Complete Setup Guide**: https://matthiasfrank.de/en/notion-mcp-setup/

---

## 요약 체크리스트

- [ ] Node.js 설치 확인
- [ ] Notion Integration 생성 (https://www.notion.so/my-integrations)
- [ ] Integration Token 복사
- [ ] MCP 설정 파일 편집 (`~/.cursor/mcp.json` 또는 Claude Desktop 설정)
- [ ] 설정에 Notion MCP 추가
- [ ] 애플리케이션 재시작
- [ ] Notion 페이지에 Integration 연결 (Add connections)
- [ ] 테스트 명령어로 검증
- [ ] MCP 서버 목록에서 활성화 확인

---

**마지막 업데이트**: 2025-11-15
**신뢰도**: ⭐⭐⭐⭐⭐ (공식 문서 + 커뮤니티 검증)
