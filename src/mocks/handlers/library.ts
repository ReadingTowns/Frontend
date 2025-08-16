import { http, HttpResponse } from 'msw'

// Mock 서재 데이터
const mockLibraryBooks = [
  {
    id: '1',
    image: 'https://via.placeholder.com/120x180?text=Library1',
    title: '데미안',
    authorName: '헤르만 헤세',
  },
  {
    id: '2',
    image: 'https://via.placeholder.com/120x180?text=Library2',
    title: '1984',
    authorName: '조지 오웰',
  },
  {
    id: '3',
    image: 'https://via.placeholder.com/120x180?text=Library3',
    title: '어린 왕자',
    authorName: '앙투안 드 생텍쥐페리',
  },
  {
    id: '4',
    image: 'https://via.placeholder.com/120x180?text=Library4',
    title: '해리포터와 마법사의 돌',
    authorName: 'J.K. 롤링',
  },
  {
    id: '5',
    image: 'https://via.placeholder.com/120x180?text=Library5',
    title: '반지의 제왕',
    authorName: 'J.R.R. 톨킨',
  },
  {
    id: '6',
    image: 'https://via.placeholder.com/120x180?text=Library6',
    title: '노르웨이의 숲',
    authorName: '무라카미 하루키',
  },
  {
    id: '7',
    image: 'https://via.placeholder.com/120x180?text=Library7',
    title: '백년동안의 고독',
    authorName: '가브리엘 가르시아 마르케스',
  },
  {
    id: '8',
    image: 'https://via.placeholder.com/120x180?text=Library8',
    title: '위대한 개츠비',
    authorName: 'F. 스콧 피츠제럴드',
  },
]

// Mock 사용자 프로필
const mockUserProfiles = [
  {
    memberId: 1,
    profileImage:
      'https://readingtown.s3.ap-northeast-2.amazonaws.com/readingtown_profile_gray.png',
    nickname: '김책읽',
    currentTown: '강남구',
    userRating: 4.8,
    userRatingCount: 25,
    availableTime: '평일 저녁 7시 이후',
    following: false,
  },
  {
    memberId: 2,
    profileImage:
      'https://readingtown.s3.ap-northeast-2.amazonaws.com/readingtown_profile_gray.png',
    nickname: '박문학',
    currentTown: '서초구',
    userRating: 4.3,
    userRatingCount: 18,
    availableTime: '주말 오전',
    following: true,
  },
]

// Mock 감상평 데이터
const mockReviews = [
  {
    reviewId: 1,
    content:
      '정말 인상 깊게 읽었습니다. 성장에 대한 깊은 통찰을 얻을 수 있었어요.',
    bookId: '1',
    memberId: 1,
  },
  {
    reviewId: 2,
    content:
      '디스토피아 소설의 걸작이라고 생각합니다. 현실과 너무 닮아있어서 무서웠어요.',
    bookId: '2',
    memberId: 1,
  },
]

export const libraryHandlers = [
  // 서재 책 리스트 조회 (내 서재)
  http.get('/api/v1/bookhouse/members/me', ({ request }) => {
    console.log('My library books handler called')

    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '0')
    const size = parseInt(url.searchParams.get('size') || '10')

    // 페이지네이션 시뮬레이션
    const startIndex = page * size
    const endIndex = startIndex + size
    const paginatedBooks = mockLibraryBooks.slice(startIndex, endIndex)

    const totalElements = mockLibraryBooks.length
    const totalPages = Math.ceil(totalElements / size)
    const isLast = page >= totalPages - 1

    return HttpResponse.json({
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      code: '1000',
      message: '서재 책 리스트 조회 완료',
      result: {
        content: paginatedBooks,
        curPage: page,
        curElements: paginatedBooks.length,
        totalPages,
        totalElements,
        last: isLast,
      },
    })
  }),

  // 특정 사람의 서재 책 리스트 조회
  http.get('/api/v1/bookhouse/members/:memberId', ({ request, params }) => {
    console.log('User library books handler called:', params.memberId)

    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '0')
    const size = parseInt(url.searchParams.get('size') || '10')

    // 다른 사람의 서재는 일부만 보여주기 (처음 4개)
    const otherUserBooks = mockLibraryBooks.slice(0, 4)
    const startIndex = page * size
    const endIndex = startIndex + size
    const paginatedBooks = otherUserBooks.slice(startIndex, endIndex)

    const totalElements = otherUserBooks.length
    const totalPages = Math.ceil(totalElements / size)
    const isLast = page >= totalPages - 1

    return HttpResponse.json({
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      code: '1000',
      message: 'Success',
      result: {
        content: paginatedBooks,
        curPage: page,
        curElements: paginatedBooks.length,
        totalPages,
        totalElements,
        last: isLast,
      },
    })
  }),

  // 서재에 책 등록
  http.post('/api/v1/bookhouse/books', async ({ request }) => {
    console.log('Add library book handler called')

    const body = await request.json()
    console.log('Add library book data:', body)

    return HttpResponse.json({
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      code: '1000',
      message: '서재에 책 등록 완료',
      result: null,
    })
  }),

  // 서재에서 책 삭제
  http.delete('/api/v1/bookhouse/books/:bookId', ({ params }) => {
    console.log('Delete library book handler called:', params.bookId)

    return HttpResponse.json({
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      code: '1000',
      message: '서재 책 삭제 완료',
      result: null,
    })
  }),

  // 사용자 프로필 조회
  http.get('/api/v1/members/:partnerId/profile', ({ params }) => {
    console.log('User profile handler called:', params.partnerId)

    const userId = parseInt(params.partnerId as string)
    const profile =
      mockUserProfiles.find(p => p.memberId === userId) || mockUserProfiles[0]

    return HttpResponse.json({
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      code: 1000,
      message: 'Success',
      result: profile,
    })
  }),

  // 책 감상평 등록
  http.post('/api/v1/books/:bookId/review', async ({ request, params }) => {
    console.log('Add book review handler called:', params.bookId)

    const body = (await request.json()) as { content: string }
    console.log('Review data:', body)

    return HttpResponse.json({
      code: 2000,
      message: '감상평 등록 완료',
      result: {
        content: body.content,
      },
    })
  }),

  // 나의 감상평 조회
  http.get('/api/v1/books/:bookId/reviews/me', ({ params }) => {
    console.log('Get my review handler called:', params.bookId)

    const bookId = params.bookId as string
    const review = mockReviews.find(r => r.bookId === bookId)

    if (!review) {
      return HttpResponse.json(
        {
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
          code: '4004',
          message: '감상평이 없습니다',
          result: null,
        },
        { status: 404 }
      )
    }

    return HttpResponse.json({
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      code: '2000',
      message: '나의 감상평 조회 완료',
      result: {
        reviewId: review.reviewId,
        content: review.content,
      },
    })
  }),

  // 책 감상평 수정
  http.patch('/api/v1/books/:bookId/review', async ({ request, params }) => {
    console.log('Update book review handler called:', params.bookId)

    const body = (await request.json()) as { content: string }
    console.log('Updated review data:', body)

    return HttpResponse.json({
      code: 2000,
      message: '감상평 수정 완료',
      result: {
        content: body.content,
      },
    })
  }),

  // 교환자들의 감상평 조회
  http.get('/api/v1/books/:bookId/reviews/exchangers', ({ params }) => {
    console.log('Get exchanger reviews handler called:', params.bookId)

    const exchangerReviews = [
      {
        reviewId: 101,
        memberName: '독서왕',
        memberImage:
          'https://readingtown.s3.ap-northeast-2.amazonaws.com/readingtown_profile_gray.png',
        content: '이 책은 정말 인생 책이에요! 강력 추천합니다.',
        createdAt: '2024-01-15T10:30:00Z',
      },
      {
        reviewId: 102,
        memberName: '책사랑',
        memberImage:
          'https://readingtown.s3.ap-northeast-2.amazonaws.com/readingtown_profile_gray.png',
        content: '감동적인 스토리였어요. 여러 번 다시 읽고 싶습니다.',
        createdAt: '2024-01-10T15:20:00Z',
      },
    ]

    return HttpResponse.json({
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      code: '2000',
      message: '교환자들의 감상평 조회 완료',
      result: exchangerReviews,
    })
  }),

  // 특정 사람의 특정 책 감상평 조회
  http.get('/api/v1/books/:bookId/reviews/members/:memberId', ({ params }) => {
    console.log(
      'Get user book review handler called:',
      params.bookId,
      params.memberId
    )

    const userBookReview = {
      reviewId: 201,
      content: '작가의 상상력이 정말 뛰어나다고 생각해요. 몰입도가 높았습니다.',
      memberName: '김책읽',
      memberImage:
        'https://readingtown.s3.ap-northeast-2.amazonaws.com/readingtown_profile_gray.png',
    }

    return HttpResponse.json({
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      code: '2000',
      message: '특정 사람의 감상평 조회 완료',
      result: userBookReview,
    })
  }),
]
