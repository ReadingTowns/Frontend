'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useHeader } from '@/contexts/HeaderContext'

interface UserProfile {
  memberId: number
  nickname: string
  profileImage?: string
  phoneNumber?: string
  currentTown?: string
  availableTime?: string
  userRating?: number
  userRatingCount: number
}

export default function ProfileEditClient() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { setHeaderContent } = useHeader()

  const [nickname, setNickname] = useState('')
  const [availableTime, setAvailableTime] = useState('')
  const [profileImage, setProfileImage] = useState('')
  const [isCheckingNickname, setIsCheckingNickname] = useState(false)
  const [nicknameError, setNicknameError] = useState('')
  const [nicknameAvailable, setNicknameAvailable] = useState<boolean | null>(
    null
  )

  useEffect(() => {
    setHeaderContent(
      <header className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <span className="text-xl">←</span>
        </button>
        <h1 className="text-xl font-bold">프로필 수정</h1>
      </header>
    )

    return () => {
      setHeaderContent(null)
    }
  }, [setHeaderContent, router])

  // 현재 프로필 정보 가져오기
  const { data: profile, isLoading } = useQuery<UserProfile>({
    queryKey: ['members', 'me', 'profile'],
    queryFn: async () => {
      const response = await fetch('/api/v1/members/me/profile', {
        credentials: 'include',
      })
      if (!response.ok) {
        throw new Error('프로필을 불러오는데 실패했습니다')
      }
      const data = await response.json()
      return data.result
    },
  })

  // 프로필 데이터로 초기값 설정
  useEffect(() => {
    if (profile) {
      setNickname(profile.nickname || '')
      setAvailableTime(profile.availableTime || '')
      setProfileImage(profile.profileImage || '')
    }
  }, [profile])

  // 닉네임 중복 확인
  const checkNickname = async (nicknameToCheck: string) => {
    if (!nicknameToCheck || nicknameToCheck === profile?.nickname) {
      setNicknameError('')
      setNicknameAvailable(null)
      return
    }

    if (nicknameToCheck.length < 2) {
      setNicknameError('닉네임은 2자 이상이어야 합니다')
      setNicknameAvailable(false)
      return
    }

    setIsCheckingNickname(true)
    setNicknameError('')

    try {
      const response = await fetch(
        `/api/v1/members/nickname/validate?nickname=${encodeURIComponent(nicknameToCheck)}`
      )
      const data = await response.json()

      if (data.result?.isAvailable) {
        setNicknameAvailable(true)
        setNicknameError('')
      } else {
        setNicknameAvailable(false)
        setNicknameError('이미 사용 중인 닉네임입니다')
      }
    } catch (error) {
      setNicknameError('닉네임 확인 중 오류가 발생했습니다')
      setNicknameAvailable(false)
    } finally {
      setIsCheckingNickname(false)
    }
  }

  // 닉네임 변경 시 디바운싱
  useEffect(() => {
    const timer = setTimeout(() => {
      if (nickname && nickname !== profile?.nickname) {
        checkNickname(nickname)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [nickname, profile?.nickname])

  // 프로필 수정 mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: {
      nickname: string
      availableTime: string
      profileImage: string
    }) => {
      const response = await fetch('/api/v1/members/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('프로필 수정에 실패했습니다')
      }

      return response.json()
    },
    onSuccess: () => {
      // 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['members', 'me', 'profile'] })
      router.push('/mypage')
    },
    onError: error => {
      console.error('프로필 수정 오류:', error)
      alert('프로필 수정 중 오류가 발생했습니다')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (nickname !== profile?.nickname && !nicknameAvailable) {
      alert('닉네임을 확인해주세요')
      return
    }

    updateProfileMutation.mutate({
      nickname,
      availableTime,
      profileImage,
    })
  }

  const timeSlots = [
    '평일 오전',
    '평일 오후',
    '평일 저녁',
    '주말 오전',
    '주말 오후',
    '주말 저녁',
    '평일 저녁 / 주말 오전',
    '평일 저녁 / 주말 오후',
  ]

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin text-4xl">⏳</div>
      </div>
    )
  }

  return (
    <div className="flex-1 bg-white">
      <form onSubmit={handleSubmit} className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          {/* 프로필 이미지 */}
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="프로필"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-4xl">👤</span>
              )}
            </div>
            <button
              type="button"
              className="text-primary-600 text-sm font-medium"
              onClick={() => alert('이미지 업로드 기능은 준비 중입니다')}
            >
              프로필 사진 변경
            </button>
          </div>

          {/* 닉네임 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              닉네임
            </label>
            <div className="relative">
              <input
                type="text"
                value={nickname}
                onChange={e => setNickname(e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 ${
                  nicknameError ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="닉네임을 입력하세요"
              />
              {isCheckingNickname && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  확인 중...
                </span>
              )}
              {nicknameAvailable === true && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
                  ✓
                </span>
              )}
            </div>
            {nicknameError && (
              <p className="mt-1 text-sm text-red-500">{nicknameError}</p>
            )}
          </div>

          {/* 동네 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              내 동네
            </label>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">
                  {profile?.currentTown || '동네 미설정'}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  동네 인증 후 근처 이웃과 책을 교환할 수 있어요
                </p>
              </div>
              <button
                type="button"
                className="text-primary-600 text-sm font-medium"
                onClick={() => alert('동네 인증 기능은 준비 중입니다')}
              >
                인증하기
              </button>
            </div>
          </div>

          {/* 교환 가능 시간대 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              교환 가능 시간대
            </label>
            <select
              value={availableTime}
              onChange={e => setAvailableTime(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
            >
              <option value="">시간대를 선택하세요</option>
              {timeSlots.map(slot => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
            <p className="mt-2 text-sm text-gray-500">
              책 교환이 가능한 시간대를 선택해주세요
            </p>
          </div>

          {/* 전화번호 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              전화번호
            </label>
            <input
              type="tel"
              value={profile?.phoneNumber || ''}
              disabled
              className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
            />
            <p className="mt-2 text-sm text-gray-500">
              전화번호는 변경할 수 없습니다
            </p>
          </div>
        </div>

        {/* 저장 버튼 */}
        <div className="p-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={
              updateProfileMutation.isPending ||
              (nickname !== profile?.nickname && !nicknameAvailable)
            }
            className="w-full py-3 bg-primary-400 text-white rounded-lg font-medium hover:bg-primary-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {updateProfileMutation.isPending ? '저장 중...' : '저장하기'}
          </button>
        </div>
      </form>
    </div>
  )
}
