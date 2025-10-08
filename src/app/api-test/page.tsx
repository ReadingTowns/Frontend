'use client'

import React, { useState, useEffect } from 'react'

interface ApiEndpoint {
  name: string
  method: string
  url: string
  category: string
  source: 'Notion' | 'Swagger' | 'Both'
  description?: string
  requiresAuth: boolean
}

interface TestResult {
  endpoint: ApiEndpoint
  status: 'pending' | 'success' | 'error' | 'testing'
  statusCode?: number
  responseTime?: number
  error?: string
  timestamp?: Date
}

const API_BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://api.readingtown.site'
    : 'https://api.readingtown.site'

const ENDPOINTS: ApiEndpoint[] = [
  // OAuth2 (Notion only)
  {
    name: '구글 로그인',
    method: 'GET',
    url: '/oauth2/authorization/google',
    category: 'OAuth2',
    source: 'Notion',
    requiresAuth: false,
  },
  {
    name: '카카오 로그인',
    method: 'GET',
    url: '/oauth2/authorization/kakao',
    category: 'OAuth2',
    source: 'Notion',
    requiresAuth: false,
  },

  // Auth API (Both sources)
  {
    name: '토큰 재발급',
    method: 'POST',
    url: '/api/v1/auth/reissue',
    category: 'Auth',
    source: 'Both',
    requiresAuth: false,
  },
  {
    name: '로그아웃',
    method: 'POST',
    url: '/api/v1/auth/logout',
    category: 'Auth',
    source: 'Both',
    requiresAuth: true,
  },

  // Member API (Both sources)
  {
    name: '내 프로필 조회',
    method: 'GET',
    url: '/api/v1/members/me/profile',
    category: 'Member',
    source: 'Both',
    requiresAuth: true,
  },
  {
    name: '다른 유저 프로필 조회',
    method: 'GET',
    url: '/api/v1/members/{partnerId}/profile',
    category: 'Member',
    source: 'Both',
    requiresAuth: true,
  },
  {
    name: '프로필 수정',
    method: 'PATCH',
    url: '/api/v1/members/profile',
    category: 'Member',
    source: 'Both',
    requiresAuth: true,
  },
  {
    name: '온보딩 완료 여부 확인',
    method: 'GET',
    url: '/api/v1/members/onboarding/check',
    category: 'Member',
    source: 'Both',
    requiresAuth: true,
  },
  {
    name: '기본 프로필 조회',
    method: 'GET',
    url: '/api/v1/members/onboarding/default-profile',
    category: 'Member',
    source: 'Both',
    requiresAuth: true,
  },
  {
    name: '온보딩 완료',
    method: 'POST',
    url: '/api/v1/members/onboarding/complete',
    category: 'Member',
    source: 'Both',
    requiresAuth: true,
  },
  {
    name: '닉네임 중복 체크',
    method: 'GET',
    url: '/api/v1/members/nickname/validate',
    category: 'Member',
    source: 'Both',
    requiresAuth: false,
  },
  {
    name: '동네 조회',
    method: 'GET',
    url: '/api/v1/members/town',
    category: 'Member',
    source: 'Both',
    requiresAuth: true,
  },
  {
    name: '동네 수정',
    method: 'PUT',
    url: '/api/v1/members/town',
    category: 'Member',
    source: 'Both',
    requiresAuth: true,
  },
  {
    name: '팔로우',
    method: 'POST',
    url: '/api/v1/members/{targetMemberId}/follow',
    category: 'Member',
    source: 'Both',
    requiresAuth: true,
  },
  {
    name: '팔로우 취소',
    method: 'DELETE',
    url: '/api/v1/members/{targetMemberId}/follow',
    category: 'Member',
    source: 'Both',
    requiresAuth: true,
  },
  {
    name: '팔로잉 목록 조회',
    method: 'GET',
    url: '/api/v1/members/me/following',
    category: 'Member',
    source: 'Both',
    requiresAuth: true,
  },
  {
    name: '팔로워 목록 조회',
    method: 'GET',
    url: '/api/v1/members/me/followers',
    category: 'Member',
    source: 'Both',
    requiresAuth: true,
  },
  {
    name: '내 리뷰 별점 조회',
    method: 'GET',
    url: '/api/v1/members/me/star-rating',
    category: 'Member',
    source: 'Both',
    requiresAuth: true,
  },
  {
    name: '유저 리뷰 별점 조회',
    method: 'GET',
    url: '/api/v1/members/{partnerId}/star-rating',
    category: 'Member',
    source: 'Both',
    requiresAuth: true,
  },
  {
    name: '리뷰 별점 제출',
    method: 'POST',
    url: '/api/v1/members/star-rating',
    category: 'Member',
    source: 'Both',
    requiresAuth: true,
  },
  {
    name: '유저 검색',
    method: 'GET',
    url: '/api/v1/members/search',
    category: 'Member',
    source: 'Both',
    requiresAuth: true,
  },
  {
    name: '교환 중인 책 리스트 조회',
    method: 'GET',
    url: '/api/v1/members/me/exchanges',
    category: 'Member',
    source: 'Both',
    requiresAuth: true,
  },

  // Bookhouse API (Both sources)
  {
    name: '내 서재 조회',
    method: 'GET',
    url: '/api/v1/bookhouse/members/me',
    category: 'Bookhouse',
    source: 'Both',
    requiresAuth: true,
  },
  {
    name: '회원의 서재 조회',
    method: 'GET',
    url: '/api/v1/bookhouse/members/{memberId}',
    category: 'Bookhouse',
    source: 'Both',
    requiresAuth: true,
  },
  {
    name: '서재에 책 추가',
    method: 'POST',
    url: '/api/v1/bookhouse/books',
    category: 'Bookhouse',
    source: 'Both',
    requiresAuth: true,
  },
  {
    name: '서재에서 책 삭제',
    method: 'DELETE',
    url: '/api/v1/bookhouse/books/{bookId}',
    category: 'Bookhouse',
    source: 'Both',
    requiresAuth: true,
  },

  // Chat API (Both sources)
  {
    name: '채팅룸 리스트 조회',
    method: 'GET',
    url: '/api/v1/chatrooms',
    category: 'Chat',
    source: 'Both',
    requiresAuth: true,
  },
  {
    name: '채팅룸 생성',
    method: 'POST',
    url: '/api/v1/chatrooms',
    category: 'Chat',
    source: 'Both',
    requiresAuth: true,
  },
  {
    name: '채팅룸 나가기',
    method: 'DELETE',
    url: '/api/v1/chatrooms/{chatroomId}',
    category: 'Chat',
    source: 'Both',
    requiresAuth: true,
  },
  {
    name: '이전 채팅 메시지 조회',
    method: 'GET',
    url: '/api/v1/chatrooms/{chatroomId}/messages',
    category: 'Chat',
    source: 'Both',
    requiresAuth: true,
  },
  {
    name: '채팅 상대방 정보 조회',
    method: 'GET',
    url: '/api/v1/chatrooms/{chatroomId}/partner/profile',
    category: 'Chat',
    source: 'Both',
    requiresAuth: true,
  },
  {
    name: '교환 책 정보 조회',
    method: 'GET',
    url: '/api/v1/chatrooms/{chatroomId}/books',
    category: 'Chat',
    source: 'Both',
    requiresAuth: true,
  },
  {
    name: '대면 교환 완료',
    method: 'PATCH',
    url: '/api/v1/chatrooms/{chatroomId}/exchange/complete',
    category: 'Chat',
    source: 'Both',
    requiresAuth: true,
  },
  {
    name: '대면 반납 완료',
    method: 'PATCH',
    url: '/api/v1/chatrooms/{chatroomId}/exchange/return',
    category: 'Chat',
    source: 'Both',
    requiresAuth: true,
  },

  // ExchangeRequest API (Both sources)
  {
    name: '교환 요청 생성',
    method: 'POST',
    url: '/api/v1/exchange-requests',
    category: 'ExchangeRequest',
    source: 'Both',
    requiresAuth: true,
  },
  {
    name: '교환 요청 수락',
    method: 'PATCH',
    url: '/api/v1/exchange-requests/{exchangeStatusId}/accept',
    category: 'ExchangeRequest',
    source: 'Both',
    requiresAuth: true,
  },
  {
    name: '교환 요청 거절',
    method: 'PATCH',
    url: '/api/v1/exchange-requests/{exchangeStatusId}/reject',
    category: 'ExchangeRequest',
    source: 'Both',
    requiresAuth: true,
  },
  {
    name: '교환 요청 취소',
    method: 'DELETE',
    url: '/api/v1/exchange-requests/{exchangeStatusId}/cancel',
    category: 'ExchangeRequest',
    source: 'Both',
    requiresAuth: true,
  },

  // Books API (Both sources)
  {
    name: '책 기본 정보 조회',
    method: 'GET',
    url: '/api/v1/books/{bookId}',
    category: 'Books',
    source: 'Both',
    requiresAuth: true,
  },
  {
    name: '책 감상평 등록',
    method: 'POST',
    url: '/api/v1/books/{bookId}/review',
    category: 'Books',
    source: 'Both',
    requiresAuth: true,
  },
  {
    name: '책 감상평 수정',
    method: 'PATCH',
    url: '/api/v1/books/review/{reviewId}',
    category: 'Books',
    source: 'Both',
    requiresAuth: true,
  },
  {
    name: '감상평 목록 조회',
    method: 'GET',
    url: '/api/v1/books/{bookId}/reviews',
    category: 'Books',
    source: 'Both',
    requiresAuth: true,
  },
  {
    name: '내 감상평 조회',
    method: 'GET',
    url: '/api/v1/books/{bookId}/reviews/me',
    category: 'Books',
    source: 'Both',
    requiresAuth: true,
  },
  {
    name: '특정 사용자 감상평 조회',
    method: 'GET',
    url: '/api/v1/books/{bookId}/reviews/{memberId}',
    category: 'Books',
    source: 'Both',
    requiresAuth: true,
  },

  // Keyword API (Swagger only)
  {
    name: '키워드 후보지 조회',
    method: 'GET',
    url: '/api/v1/keyword',
    category: 'Keyword',
    source: 'Swagger',
    requiresAuth: true,
  },
  {
    name: '사용자의 키워드 조회',
    method: 'GET',
    url: '/api/v1/keyword/member',
    category: 'Keyword',
    source: 'Swagger',
    requiresAuth: true,
  },
  {
    name: '사용자 키워드 선택',
    method: 'POST',
    url: '/api/v1/keyword/member',
    category: 'Keyword',
    source: 'Swagger',
    requiresAuth: true,
  },

  // Notification API (Notion only)
  {
    name: '알림 조회',
    method: 'GET',
    url: '/api/v1/notifications',
    category: 'Notification',
    source: 'Notion',
    requiresAuth: true,
  },
  {
    name: '알림 읽음 요청',
    method: 'POST',
    url: '/api/v1/notifications/{notificationId}',
    category: 'Notification',
    source: 'Notion',
    requiresAuth: true,
  },
  {
    name: '알림 삭제',
    method: 'DELETE',
    url: '/api/v1/notifications/{notificationId}',
    category: 'Notification',
    source: 'Notion',
    requiresAuth: true,
  },

  // Bookstore API (Notion only)
  {
    name: '책방 책 정보 조회',
    method: 'GET',
    url: '/api/v1/bookstores/{bookstoreId}/books/{bookId}',
    category: 'Bookstore',
    source: 'Notion',
    requiresAuth: true,
  },
  {
    name: '책방 책 소유자 정보 조회',
    method: 'GET',
    url: '/api/v1/bookstores/{bookstoreId}/books/{bookId}/owner',
    category: 'Bookstore',
    source: 'Notion',
    requiresAuth: true,
  },
  {
    name: '책방에 책 등록',
    method: 'POST',
    url: '/api/v1/bookstores/{bookstoreId}/books',
    category: 'Bookstore',
    source: 'Notion',
    requiresAuth: true,
  },
  {
    name: '책방 책 리스트 조회',
    method: 'GET',
    url: '/api/v1/bookstores/{bookstoreId}/books',
    category: 'Bookstore',
    source: 'Notion',
    requiresAuth: true,
  },
  {
    name: '대시보드용 책방 인기 TOP10 조회',
    method: 'GET',
    url: '/api/v1/bookstores/{bookstoreId}/books/popular/preview',
    category: 'Bookstore',
    source: 'Notion',
    requiresAuth: true,
  },
  {
    name: '대시보드용 책방 책 리스트 조회',
    method: 'GET',
    url: '/api/v1/bookstores/{bookstoreId}/books/preview',
    category: 'Bookstore',
    source: 'Notion',
    requiresAuth: true,
  },

  // Health Check (Swagger only)
  {
    name: '헬스 체크',
    method: 'GET',
    url: '/hc',
    category: 'Health',
    source: 'Swagger',
    requiresAuth: false,
  },
]

export default function ApiTestPage() {
  const [results, setResults] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [filter, setFilter] = useState<'all' | 'success' | 'error' | 'pending'>(
    'all'
  )

  const categories = Array.from(new Set(ENDPOINTS.map(e => e.category)))

  useEffect(() => {
    setResults(
      ENDPOINTS.map(endpoint => ({
        endpoint,
        status: 'pending',
      }))
    )
  }, [])

  const testEndpoint = async (endpoint: ApiEndpoint): Promise<TestResult> => {
    const startTime = Date.now()

    try {
      // Replace path parameters with sample values
      let testUrl = endpoint.url
        .replace('{partnerId}', '1')
        .replace('{targetMemberId}', '1')
        .replace('{memberId}', '1')
        .replace('{bookId}', '1')
        .replace('{reviewId}', '1')
        .replace('{chatroomId}', '1')
        .replace('{exchangeStatusId}', '1')
        .replace('{notificationId}', '1')
        .replace('{bookstoreId}', '1')

      // Add query parameters for endpoints that need them
      if (testUrl.includes('/nickname/validate')) {
        testUrl += '?nickname=test'
      }
      if (testUrl.includes('/members/me') && testUrl.includes('page=')) {
        testUrl += '?page=0&size=10'
      }

      const fullUrl = `${API_BASE_URL}${testUrl}`

      const response = await fetch(fullUrl, {
        method: endpoint.method,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        credentials: 'include', // Include cookies for authentication
        // Add request body for POST/PATCH methods
        ...(endpoint.method === 'POST' || endpoint.method === 'PATCH'
          ? {
              body: JSON.stringify({}),
            }
          : {}),
      })

      const responseTime = Date.now() - startTime

      return {
        endpoint,
        status: response.ok ? 'success' : 'error',
        statusCode: response.status,
        responseTime,
        timestamp: new Date(),
        error: response.ok
          ? undefined
          : `HTTP ${response.status} ${response.statusText}`,
      }
    } catch (error) {
      const responseTime = Date.now() - startTime
      return {
        endpoint,
        status: 'error',
        responseTime,
        timestamp: new Date(),
        error: error instanceof Error ? error.message : 'Network error',
      }
    }
  }

  const runAllTests = async () => {
    setIsRunning(true)

    const filteredEndpoints =
      selectedCategories.length > 0
        ? ENDPOINTS.filter(e => selectedCategories.includes(e.category))
        : ENDPOINTS

    // Reset results for selected endpoints
    setResults(prev =>
      prev.map(result =>
        filteredEndpoints.some(e => e.name === result.endpoint.name)
          ? { ...result, status: 'pending' as const }
          : result
      )
    )

    for (const endpoint of filteredEndpoints) {
      setResults(prev =>
        prev.map(result =>
          result.endpoint.name === endpoint.name
            ? { ...result, status: 'testing' as const }
            : result
        )
      )

      const result = await testEndpoint(endpoint)

      setResults(prev =>
        prev.map(existing =>
          existing.endpoint.name === endpoint.name ? result : existing
        )
      )

      // Small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    setIsRunning(false)
  }

  const testSingle = async (endpoint: ApiEndpoint) => {
    setResults(prev =>
      prev.map(result =>
        result.endpoint.name === endpoint.name
          ? { ...result, status: 'testing' as const }
          : result
      )
    )

    const result = await testEndpoint(endpoint)

    setResults(prev =>
      prev.map(existing =>
        existing.endpoint.name === endpoint.name ? result : existing
      )
    )
  }

  const filteredResults = results.filter(result => {
    if (
      selectedCategories.length > 0 &&
      !selectedCategories.includes(result.endpoint.category)
    ) {
      return false
    }
    if (filter !== 'all' && result.status !== filter) {
      return false
    }
    return true
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-50'
      case 'error':
        return 'text-red-600 bg-red-50'
      case 'testing':
        return 'text-blue-600 bg-blue-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const getSourceBadgeColor = (source: string) => {
    switch (source) {
      case 'Notion':
        return 'bg-purple-100 text-purple-700'
      case 'Swagger':
        return 'bg-blue-100 text-blue-700'
      case 'Both':
        return 'bg-green-100 text-green-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const stats = {
    total: filteredResults.length,
    success: filteredResults.filter(r => r.status === 'success').length,
    error: filteredResults.filter(r => r.status === 'error').length,
    pending: filteredResults.filter(r => r.status === 'pending').length,
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            API 엔드포인트 테스트
          </h1>
          <p className="text-gray-600 mb-6">
            Notion과 Swagger 명세서의 모든 API 엔드포인트를 실제로 테스트하여
            사용 가능 여부를 확인합니다.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-gray-900">
                {stats.total}
              </div>
              <div className="text-gray-600">전체</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-green-600">
                {stats.success}
              </div>
              <div className="text-gray-600">성공</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-red-600">
                {stats.error}
              </div>
              <div className="text-gray-600">실패</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-gray-600">
                {stats.pending}
              </div>
              <div className="text-gray-600">대기</div>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-4 items-center">
                <button
                  onClick={runAllTests}
                  disabled={isRunning}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isRunning ? '테스트 중...' : '모든 API 테스트'}
                </button>

                <select
                  value={filter}
                  onChange={e => setFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="all">모든 상태</option>
                  <option value="success">성공만</option>
                  <option value="error">실패만</option>
                  <option value="pending">대기중만</option>
                </select>
              </div>

              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <label key={category} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={e => {
                        if (e.target.checked) {
                          setSelectedCategories(prev => [...prev, category])
                        } else {
                          setSelectedCategories(prev =>
                            prev.filter(c => c !== category)
                          )
                        }
                      }}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-700">{category}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    API 이름
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    메서드
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    URL
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    카테고리
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    출처
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    응답시간
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    액션
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredResults.map((result, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {result.endpoint.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          result.endpoint.method === 'GET'
                            ? 'bg-green-100 text-green-800'
                            : result.endpoint.method === 'POST'
                              ? 'bg-blue-100 text-blue-800'
                              : result.endpoint.method === 'PATCH'
                                ? 'bg-yellow-100 text-yellow-800'
                                : result.endpoint.method === 'DELETE'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {result.endpoint.method}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                      {result.endpoint.url}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {result.endpoint.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getSourceBadgeColor(result.endpoint.source)}`}
                      >
                        {result.endpoint.source}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(result.status)}`}
                        >
                          {result.status === 'success'
                            ? '✅ 성공'
                            : result.status === 'error'
                              ? '❌ 실패'
                              : result.status === 'testing'
                                ? '🔄 테스트중'
                                : '⏳ 대기'}
                        </span>
                        {result.statusCode && (
                          <span className="text-xs text-gray-500">
                            ({result.statusCode})
                          </span>
                        )}
                      </div>
                      {result.error && (
                        <div className="text-xs text-red-600 mt-1 max-w-xs truncate">
                          {result.error}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {result.responseTime ? `${result.responseTime}ms` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => testSingle(result.endpoint)}
                        disabled={result.status === 'testing'}
                        className="text-blue-600 hover:text-blue-800 disabled:opacity-50"
                      >
                        테스트
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">범례</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">출처별 구분</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-700">
                    Notion
                  </span>
                  <span className="text-sm text-gray-600">
                    Notion 데이터베이스에서만 확인된 API
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                    Swagger
                  </span>
                  <span className="text-sm text-gray-600">
                    Swagger 문서에서만 확인된 API
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                    Both
                  </span>
                  <span className="text-sm text-gray-600">
                    두 문서 모두에서 확인된 API
                  </span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">테스트 결과</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-green-600">✅ 성공</span>
                  <span className="text-sm text-gray-600">
                    API가 정상적으로 응답함
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-red-600">❌ 실패</span>
                  <span className="text-sm text-gray-600">
                    API 오류 또는 네트워크 오류
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-blue-600">🔄 테스트중</span>
                  <span className="text-sm text-gray-600">
                    현재 테스트 진행 중
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">⏳ 대기</span>
                  <span className="text-sm text-gray-600">
                    아직 테스트하지 않음
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
