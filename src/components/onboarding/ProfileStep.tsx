import { useState, useEffect } from 'react'
import { ProfileStepProps } from '@/types/onboarding'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import NicknameInput from '@/components/common/NicknameInput'
import ProfileImageUpload from '@/components/profile/ProfileImageUpload'
import { api } from '@/lib/api'

export default function ProfileStep({
  nickname,
  profileImage,
  onNicknameChange,
  onProfileImageChange,
  onNicknameValidationChange,
  onBack,
}: ProfileStepProps) {
  const [localNickname, setLocalNickname] = useState(nickname)
  const [localProfileImage, setLocalProfileImage] = useState(profileImage)

  useEffect(() => {
    setLocalNickname(nickname)
    setLocalProfileImage(profileImage)
  }, [nickname, profileImage])

  // 기본 프로필 로드
  useEffect(() => {
    const loadDefaultProfile = async () => {
      // 이미 값이 있다면 API 호출하지 않음
      if (nickname || profileImage) return

      try {
        const data = await api.get<{
          defaultUsername: string
          defaultProfileImage: string
        }>('/api/v1/members/onboarding/default-profile')

        if (data) {
          setLocalNickname(data.defaultUsername)
          setLocalProfileImage(data.defaultProfileImage)
          // 부모 컴포넌트에 기본값 전달
          onNicknameChange(data.defaultUsername)
          onProfileImageChange(data.defaultProfileImage)
        }
      } catch (error) {
        console.error('기본 프로필 로드 실패:', error)
      }
    }

    loadDefaultProfile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleNicknameChange = (newNickname: string) => {
    setLocalNickname(newNickname)
    onNicknameChange(newNickname)
  }

  const handleNicknameValidation = (isValid: boolean) => {
    onNicknameValidationChange(isValid)
  }

  const handleImageChange = (url: string) => {
    setLocalProfileImage(url)
    onProfileImageChange(url)
  }

  return (
    <div className="px-4 py-8">
      {/* 이전 버튼 */}
      <button
        onClick={onBack}
        className="btn-ghost text-left mb-4 flex items-center gap-1"
      >
        <ArrowLeftIcon className="w-5 h-5" />
        이전
      </button>

      <h2 className="text-xl font-bold text-gray-900 mb-2">
        프로필을 설정해주세요
      </h2>
      <p className="text-gray-600 mb-8">다른 사용자들에게 보여질 정보예요</p>

      {/* 프로필 이미지 */}
      <div className="flex justify-center mb-6">
        <ProfileImageUpload
          currentImage={
            localProfileImage ||
            'https://readingtown.s3.ap-northeast-2.amazonaws.com/readingtown_profile_gray.png'
          }
          onImageChange={handleImageChange}
          size="large"
          editable={true}
        />
      </div>

      {/* 닉네임 입력 */}
      <div className="mb-6">
        <NicknameInput
          value={localNickname}
          onChange={handleNicknameChange}
          onValidationChange={handleNicknameValidation}
        />
      </div>
    </div>
  )
}
