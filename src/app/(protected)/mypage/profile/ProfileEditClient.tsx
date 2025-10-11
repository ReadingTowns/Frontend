'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useHeader } from '@/contexts/HeaderContext'
import NicknameInput from '@/components/common/NicknameInput'
import {
  ArrowLeftIcon,
  ClockIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline'

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
  const [nicknameValid, setNicknameValid] = useState(false)

  useEffect(() => {
    setHeaderContent(
      <header className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeftIcon className="w-6 h-6" />
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
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.readingtown.site'
      const response = await fetch(`${backendUrl}/api/v1/members/me/profile`, {
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
      // 초기에는 현재 닉네임이므로 valid로 설정
      setNicknameValid(true)
    }
  }, [profile])

  // 프로필 수정 mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: {
      nickname: string
      availableTime: string
      profileImage: string
    }) => {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.readingtown.site'
      const response = await fetch(`${backendUrl}/api/v1/members/profile`, {
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

    if (!nicknameValid) {
      alert('닉네임 중복 확인을 해주세요')
      return
    }

    updateProfileMutation.mutate({
      nickname,
      availableTime,
      profileImage,
    })
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <ClockIcon className="w-8 h-8 animate-spin text-primary-400" />
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
                <UserCircleIcon className="w-16 h-16 text-gray-400" />
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
          <NicknameInput
            value={nickname}
            onChange={setNickname}
            onValidationChange={setNicknameValid}
            currentNickname={profile?.nickname}
          />

          {/* 교환 가능 시간대 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              교환 가능 시간대
            </label>
            <textarea
              value={availableTime}
              onChange={e => setAvailableTime(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none"
              rows={3}
              placeholder="예: 평일 저녁 7시 이후, 주말 오전 가능"
            />
            <p className="mt-2 text-sm text-gray-500">
              책 교환이 가능한 시간대를 자유롭게 입력해주세요
            </p>
          </div>
        </div>

        {/* 저장 버튼 */}
        <div className="p-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={updateProfileMutation.isPending || !nicknameValid}
            className="w-full py-3 bg-primary-400 text-white rounded-lg font-medium hover:bg-primary-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {updateProfileMutation.isPending ? '저장 중...' : '저장하기'}
          </button>
        </div>
      </form>
    </div>
  )
}
