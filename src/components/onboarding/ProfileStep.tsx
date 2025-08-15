import { useState, useEffect } from 'react'
import { ProfileStepProps } from '@/types/onboarding'

export default function ProfileStep({
  nickname,
  profileImage,
  onNicknameChange,
  onBack,
}: ProfileStepProps) {
  const [localNickname, setLocalNickname] = useState(nickname)
  const [localProfileImage, setLocalProfileImage] = useState(profileImage)
  const [nicknameError, setNicknameError] = useState('')
  const [isCheckingNickname, setIsCheckingNickname] = useState(false)

  const checkNicknameAvailability = async (nick: string) => {
    if (nick.length < 2 || nick.length > 20) {
      setNicknameError('닉네임은 2자 이상 20자 이하로 입력해주세요')
      return false
    }

    setIsCheckingNickname(true)
    try {
      const response = await fetch(
        `/api/v1/members/nickname/validate?nickname=${encodeURIComponent(nick)}`
      )
      const data = await response.json()

      if (!data.result.isAvailable) {
        setNicknameError('이미 사용 중인 닉네임입니다')
        return false
      }

      setNicknameError('')
      return true
    } catch {
      setNicknameError('닉네임 확인 중 오류가 발생했습니다')
      return false
    } finally {
      setIsCheckingNickname(false)
    }
  }

  useEffect(() => {
    setLocalNickname(nickname)
    setLocalProfileImage(profileImage)
  }, [nickname, profileImage])

  const handleNicknameChange = async (newNickname: string) => {
    setLocalNickname(newNickname)

    if (newNickname.length >= 2 && newNickname.length <= 20) {
      const isValid = await checkNicknameAvailability(newNickname)
      if (isValid) {
        onNicknameChange(newNickname)
      }
    } else {
      onNicknameChange('')
    }
  }

  return (
    <div className="px-4 py-8">
      {/* 이전 버튼 */}
      <button onClick={onBack} className="btn-ghost text-left mb-4">
        ← 이전
      </button>

      <h2 className="text-xl font-bold text-gray-900 mb-2">
        프로필을 설정해주세요
      </h2>
      <p className="text-gray-600 mb-8">다른 사용자들에게 보여질 정보예요</p>

      {/* 프로필 이미지 */}
      <div className="flex justify-center mb-6">
        <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={
              localProfileImage ||
              'https://readingtown.s3.ap-northeast-2.amazonaws.com/readingtown_profile_gray.png'
            }
            alt="프로필 이미지"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* 닉네임 입력 */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          닉네임
        </label>
        <input
          type="text"
          value={localNickname}
          onChange={e => handleNicknameChange(e.target.value)}
          placeholder="닉네임을 입력해주세요"
          className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent ${
            nicknameError ? 'border-red-500' : 'border-gray-300'
          }`}
          maxLength={20}
          disabled={isCheckingNickname}
        />
        {nicknameError && (
          <p className="mt-1 text-sm text-red-600">{nicknameError}</p>
        )}
        {isCheckingNickname && (
          <p className="mt-1 text-sm text-blue-600">닉네임 확인 중...</p>
        )}
        <p className="mt-1 text-sm text-gray-500">
          2자 이상 20자 이하로 입력해주세요
        </p>
      </div>
    </div>
  )
}
