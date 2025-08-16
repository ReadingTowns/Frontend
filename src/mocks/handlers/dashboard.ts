import { http, HttpResponse } from 'msw'

export const dashboardHandlers = [
  // 교환 중인 책 리스트 조회 (노션 API 명세 기반)
  http.get('/api/v1/members/me/exchanges', ({ request }) => {
    console.log('Current exchanges handler called:', request.url)

    return HttpResponse.json({
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      code: '2000',
      message: 'OK',
      result: {
        chatRoomId: 1,
        myBook: {
          bookhouseId: 1,
          bookName: '혼자 있는 시간의 힘',
          bookImage: 'https://via.placeholder.com/120x180?text=Book1',
        },
        yourBook: {
          bookhouseId: 2,
          bookName: '사피엔스',
          bookImage: 'https://via.placeholder.com/120x180?text=Book2',
        },
      },
    })
  }),

  // 추천 사용자 조회 (Mock API)
  http.get('/api/v1/users/recommendations', ({ request }) => {
    console.log('User recommendations handler called:', request.url)

    return HttpResponse.json({
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      code: '1000',
      message: 'Success',
      result: [
        {
          id: 1,
          nickname: '김리딩',
          profileImage:
            'https://readingtown.s3.ap-northeast-2.amazonaws.com/readingtown_profile_gray.png',
          similarityScore: 85,
          location: '우리동네',
          isFollowing: false,
        },
        {
          id: 2,
          nickname: '박북스',
          profileImage:
            'https://readingtown.s3.ap-northeast-2.amazonaws.com/readingtown_profile_gray.png',
          similarityScore: 78,
          location: '우리동네',
          isFollowing: false,
        },
        {
          id: 3,
          nickname: '이독서',
          profileImage:
            'https://readingtown.s3.ap-northeast-2.amazonaws.com/readingtown_profile_gray.png',
          similarityScore: 72,
          location: '근처동네',
          isFollowing: true,
        },
      ],
    })
  }),

  // 추천 도서 조회 (Mock API)
  http.get('/api/v1/books/recommendations', ({ request }) => {
    console.log('Book recommendations handler called:', request.url)

    return HttpResponse.json({
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      code: '1000',
      message: 'Success',
      result: [
        {
          id: 1,
          title: '사피엔스',
          author: '유발 하라리',
          image: 'https://via.placeholder.com/120x180?text=Sapiens',
          reason: '최근 읽은 책과 유사한 주제',
          categories: ['역사', '인문'],
          rating: 4.5,
        },
        {
          id: 2,
          title: '아토믹 해빗',
          author: '제임스 클리어',
          image: 'https://via.placeholder.com/120x180?text=AtomicHabits',
          reason: '자기계발 관심사 기반',
          categories: ['자기계발', '습관'],
          rating: 4.7,
        },
        {
          id: 3,
          title: '미드나이트 라이브러리',
          author: '매트 헤이그',
          image: 'https://via.placeholder.com/120x180?text=MidnightLibrary',
          reason: '감성적인 소설 선호 패턴',
          categories: ['소설', '철학'],
          rating: 4.3,
        },
      ],
    })
  }),

  // 팔로우 생성
  http.post('/api/v1/users/:userId/follow', ({ params }) => {
    console.log('Follow user handler called:', params.userId)

    return HttpResponse.json({
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      code: '1000',
      message: 'Success',
      result: null,
    })
  }),

  // 팔로우 취소
  http.delete('/api/v1/users/:userId/follow', ({ params }) => {
    console.log('Unfollow user handler called:', params.userId)

    return HttpResponse.json({
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      code: '1000',
      message: 'Success',
      result: null,
    })
  }),
]
