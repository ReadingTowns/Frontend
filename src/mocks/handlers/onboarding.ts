import { http, HttpResponse } from 'msw'

export const onboardingHandlers = [
  // 온보딩 기본 프로필 조회
  http.get('/api/v1/members/onboarding/default-profile', ({ request }) => {
    console.log('Default profile handler called:', request.url)

    return HttpResponse.json({
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      code: 1000,
      message: 'Success',
      result: {
        defaultUsername: `리딩여우${Math.random().toString(36).substr(2, 6)}`,
        defaultProfileImage:
          'https://readingtown.s3.ap-northeast-2.amazonaws.com/readingtown_profile_gray.png',
      },
    })
  }),

  // 닉네임 중복 확인
  http.get('/api/v1/members/nickname/validate', ({ request }) => {
    const url = new URL(request.url)
    const nickname = url.searchParams.get('nickname')
    console.log('Nickname validation handler called:', nickname)

    // 테스트용으로 특정 닉네임들을 중복으로 처리
    const duplicateNicknames = ['테스트', 'admin', 'root', '리딩타운']
    const isAvailable = !duplicateNicknames.includes(nickname || '')

    return HttpResponse.json({
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      code: 1000,
      message: 'Success',
      result: {
        isAvailable,
      },
    })
  }),

  // 온보딩 완료
  http.post('/api/v1/members/onboarding/complete', async ({ request }) => {
    console.log('Onboarding complete handler called')

    const body = (await request.json()) as {
      phoneNumber: string
      latitude: number
      longitude: number
      nickname: string
      profileImage: string
      availableTime?: string
    }

    console.log('Onboarding data:', body)

    // 온보딩 완료 상태를 localStorage에 저장 (개발 환경용)
    if (typeof window !== 'undefined') {
      localStorage.setItem('onboardingCompleted', 'true')
      localStorage.setItem('userProfile', JSON.stringify(body))
    }

    return HttpResponse.json({
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      code: 1000,
      message: 'Success',
      result: null,
    })
  }),
]
