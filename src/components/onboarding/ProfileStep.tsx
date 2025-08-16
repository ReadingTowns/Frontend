import { useState, useEffect } from 'react'
import { ProfileStepProps } from '@/types/onboarding'

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
  const [nicknameError, setNicknameError] = useState('')
  const [isCheckingNickname, setIsCheckingNickname] = useState(false)
  const [nicknameStatus, setNicknameStatus] = useState<
    'unchecked' | 'available' | 'unavailable'
  >('unchecked')

  const checkNicknameAvailability = async () => {
    const nick = localNickname.trim()

    if (nick.length < 2 || nick.length > 20) {
      setNicknameError('닉네임은 2자 이상 20자 이하로 입력해주세요')
      setNicknameStatus('unchecked')
      return
    }

    setIsCheckingNickname(true)
    setNicknameError('')

    try {
      const response = await fetch(
        `/api/v1/members/nickname/validate?nickname=${encodeURIComponent(nick)}`
      )
      const data = await response.json()

      if (data.result.isAvailable) {
        setNicknameStatus('available')
        setNicknameError('')
        onNicknameChange(nick)
        onNicknameValidationChange(true)
      } else {
        setNicknameStatus('unavailable')
        setNicknameError('이미 사용 중인 닉네임입니다')
        onNicknameChange('')
        onNicknameValidationChange(false)
      }
    } catch {
      setNicknameError('닉네임 확인 중 오류가 발생했습니다')
      setNicknameStatus('unchecked')
      onNicknameChange('')
      onNicknameValidationChange(false)
    } finally {
      setIsCheckingNickname(false)
    }
  }

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
        const response = await fetch(
          '/api/v1/members/onboarding/default-profile'
        )
        const data = await response.json()

        if (data.result) {
          setLocalNickname(data.result.defaultUsername)
          setLocalProfileImage(data.result.defaultProfileImage)
          // 부모 컴포넌트에 기본값 전달
          onNicknameChange(data.result.defaultUsername)
          onProfileImageChange(data.result.defaultProfileImage)
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
    setNicknameStatus('unchecked')
    setNicknameError('')
    onNicknameChange('')
    onNicknameValidationChange(false)
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
        <div className="flex gap-2">
          <input
            type="text"
            value={localNickname}
            onChange={e => handleNicknameChange(e.target.value)}
            placeholder="닉네임을 입력해주세요"
            className={`flex-1 px-3 py-3 border rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent ${
              nicknameError
                ? 'border-red-500'
                : nicknameStatus === 'available'
                  ? 'border-green-500'
                  : 'border-gray-300'
            }`}
            maxLength={20}
            disabled={isCheckingNickname}
          />
          <button
            type="button"
            onClick={checkNicknameAvailability}
            disabled={
              isCheckingNickname ||
              localNickname.trim().length < 2 ||
              localNickname.trim().length > 20
            }
            className="px-4 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {isCheckingNickname ? '확인중...' : '중복확인'}
          </button>
        </div>

        {/* 상태 메시지 */}
        {nicknameError && (
          <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
            <span>❌</span>
            {nicknameError}
          </p>
        )}
        {nicknameStatus === 'available' && !nicknameError && (
          <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
            <span>✅</span>
            사용 가능한 닉네임입니다
          </p>
        )}
        {isCheckingNickname && (
          <p className="mt-2 text-sm text-blue-600 flex items-center gap-1">
            <span>🔄</span>
            닉네임 중복 확인 중...
          </p>
        )}

        <p className="mt-1 text-sm text-gray-500">
          2자 이상 20자 이하로 입력해주세요
        </p>
      </div>
    </div>
  )
}
