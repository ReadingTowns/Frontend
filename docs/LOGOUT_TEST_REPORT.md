# Logout Functionality Test Report

## Executive Summary
The logout functionality has a critical issue where users remain authenticated after clicking logout. This is caused by HttpOnly cookies from previous OAuth attempts that persist across domains.

## Test Results

### ✅ Frontend Implementation
- **Logout button**: Properly triggers logout action
- **useAuth hook**: Correctly calls logout mutation
- **State management**: TanStack Query properly invalidates auth queries
- **Redirection**: Attempts to redirect to login page

### ✅ Logout API Endpoint (`/api/auth/logout`)
- **Response**: Returns success (code 1000)
- **Cookie clearing**: Sets cookies to expire (maxAge: 0)
- **Headers**: Properly sets Set-Cookie headers with expiration

### ❌ Authentication Persistence Issue
- **Problem**: `/api/auth/me` still returns authenticated after logout
- **Root cause**: Refresh token from OAuth persists on `api.readingtown.site` domain
- **Impact**: Users cannot logout properly

## Detailed Analysis

### 1. Cookie Domain Issue
```
Current behavior:
- OAuth sets cookies on: api.readingtown.site
- Frontend tries to clear cookies on: readingtown.site
- Result: OAuth cookies persist, user stays logged in
```

### 2. Authentication Check Logic Issue
The `/api/auth/me` endpoint checks for ANY token existence:
```typescript
const isAuthenticated = isMockMode
  ? accessToken?.value?.startsWith('mock_') ||
    refreshToken?.value?.startsWith('mock_') ||
    accessToken?.value?.startsWith('dev_') ||
    refreshToken?.value?.startsWith('dev_')
  : !!(accessToken?.value || refreshToken?.value)
```

If a refresh_token exists from OAuth (set on different domain), the user is considered authenticated.

### 3. Test Evidence
- Logout API test passes: Cookies are set to expire
- Browser test shows: Authentication persists after logout
- Network logs confirm: `/api/auth/me` returns authenticated status

## Solution

### Option 1: Backend Cookie Domain Fix (Recommended)
Configure backend to set cookies with domain `.readingtown.site`:
```java
@Bean
public CookieSameSiteSupplier cookieSameSiteSupplier() {
    return CookieSameSiteSupplier.of(SameSite.LAX)
        .domain(".readingtown.site");  // Allow access from subdomains
}
```

### Option 2: Proxy Logout to Backend
Make the frontend logout endpoint proxy to backend:
```typescript
export async function POST() {
  // Call backend logout endpoint
  const backendResponse = await fetch('https://api.readingtown.site/api/auth/logout', {
    method: 'POST',
    headers: {
      Cookie: request.headers.get('cookie') || '',
    },
  });

  // Forward the Set-Cookie headers from backend
  const response = NextResponse.json({...});
  backendResponse.headers.getSetCookie().forEach(cookie => {
    response.headers.append('Set-Cookie', cookie);
  });

  return response;
}
```

### Option 3: Clear All Possible Cookies
Update logout endpoint to clear cookies on multiple domains:
```typescript
// Clear on main domain
response.cookies.set('refresh_token', '', {
  path: '/',
  domain: '.readingtown.site',
  maxAge: 0,
});

// Clear on API subdomain
response.cookies.set('refresh_token', '', {
  path: '/',
  domain: 'api.readingtown.site',
  maxAge: 0,
});
```

## Test Commands

### Unit Tests
```bash
# Test logout API endpoint
npm test -- src/__tests__/api/logout.test.ts

# Test auth hook
npm test -- src/__tests__/hooks/useAuth.test.ts
```

### E2E Tests
```bash
# Test full logout flow
npx playwright test --grep "logout"
```

### Manual Testing Steps
1. Login with OAuth (Google/Kakao)
2. Verify authentication on home page
3. Click logout button
4. Check if redirected to login page
5. Try accessing protected routes
6. Check browser cookies in DevTools

## Recommendations

1. **Immediate**: Implement Option 2 (Proxy logout) as a quick fix
2. **Long-term**: Work with backend team to implement Option 1 (Cookie domain fix)
3. **Testing**: Add E2E tests for logout functionality
4. **Monitoring**: Add logging to track logout failures in production

## Impact

- **Severity**: High - Users cannot logout properly
- **User Experience**: Confusing - Logout appears to work but user remains logged in
- **Security**: Medium - Session persists when user expects to be logged out
- **Scope**: Affects all OAuth users (Google and Kakao)

## Next Steps

1. Implement proxy logout endpoint (Option 2)
2. Test with OAuth providers
3. Deploy fix to staging environment
4. Verify fix with E2E tests
5. Deploy to production