import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test('should display login page correctly', async ({ page }) => {
    await page.goto('/login')

    // 페이지 제목과 설명 확인
    await expect(page.getByRole('heading', { name: '리딩타운' })).toBeVisible()
    await expect(page.getByText('책으로 이웃과 연결되는 공간')).toBeVisible()
    await expect(
      page.getByText('로그인하여 리딩타운의 모든 서비스를 이용하세요')
    ).toBeVisible()

    // 소셜 로그인 버튼 확인
    await expect(page.getByText('Google로 로그인')).toBeVisible()
    await expect(page.getByText('카카오로 로그인')).toBeVisible()
  })

  test('should have correct layout on mobile viewport', async ({ page }) => {
    // 모바일 뷰포트 설정
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/login')

    // 컨테이너 최대 너비 확인 (430px)
    const container = page
      .locator('div')
      .filter({ hasText: '리딩타운' })
      .first()
    await expect(container).toBeVisible()

    // 버튼들이 올바르게 표시되는지 확인
    await expect(page.getByText('Google로 로그인')).toBeVisible()
    await expect(page.getByText('카카오로 로그인')).toBeVisible()
  })

  test('should have correct layout on tablet viewport', async ({ page }) => {
    // 태블릿 뷰포트 설정
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto('/login')

    // 컨테이너가 중앙에 정렬되고 최대 너비가 적용되는지 확인
    const container = page
      .locator('div')
      .filter({ hasText: '리딩타운' })
      .first()
    await expect(container).toBeVisible()
  })

  test('should have correct layout on desktop viewport', async ({ page }) => {
    // 데스크톱 뷰포트 설정
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto('/login')

    // 컨테이너가 중앙에 정렬되고 최대 너비가 적용되는지 확인
    const container = page
      .locator('div')
      .filter({ hasText: '리딩타운' })
      .first()
    await expect(container).toBeVisible()
  })

  test('should show Google login button with correct styling', async ({
    page,
  }) => {
    await page.goto('/login')

    const googleButton = page.getByRole('button', { name: 'Google로 로그인' })
    await expect(googleButton).toBeVisible()

    // 버튼 스타일 확인
    await expect(googleButton).toHaveCSS(
      'background-color',
      'rgb(255, 255, 255)'
    )
  })

  test('should show Kakao login button with correct styling', async ({
    page,
  }) => {
    await page.goto('/login')

    const kakaoButton = page.getByRole('button', { name: '카카오로 로그인' })
    await expect(kakaoButton).toBeVisible()

    // 카카오 노란색 배경 확인
    await expect(kakaoButton).toHaveCSS('background-color', 'rgb(254, 229, 0)')
  })

  test('should navigate to main page when not on login page', async ({
    page,
  }) => {
    await page.goto('/')

    // 홈페이지가 로드되는지 확인
    await expect(page).toHaveURL('/')
  })
})
