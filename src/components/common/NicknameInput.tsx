import { useState } from 'react'
import {
  XCircleIcon,
  CheckCircleIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/solid'
import { api } from '@/lib/api'

interface NicknameInputProps {
  value: string
  onChange: (value: string) => void
  onValidationChange: (isValid: boolean) => void
  currentNickname?: string // 현재 닉네임 (프로필 수정 시)
}

export default function NicknameInput({
  value,
  onChange,
  onValidationChange,
  currentNickname,
}: NicknameInputProps) {
  const [nicknameError, setNicknameError] = useState('')
  const [isCheckingNickname, setIsCheckingNickname] = useState(false)
  const [nicknameStatus, setNicknameStatus] = useState<
    'unchecked' | 'available' | 'unavailable'
  >('unchecked')

  const checkNicknameAvailability = async () => {
    const nick = value.trim()

    // 현재 닉네임과 같으면 검증 통과
    if (currentNickname && nick === currentNickname) {
      setNicknameStatus('available')
      setNicknameError('')
      onValidationChange(true)
      return
    }

    if (nick.length < 2 || nick.length > 20) {
      setNicknameError('닉네임은 2자 이상 20자 이하로 입력해주세요')
      setNicknameStatus('unchecked')
      onValidationChange(false)
      return
    }

    setIsCheckingNickname(true)
    setNicknameError('')

    try {
      const data = await api.get<{ isAvailable: boolean }>(
        '/api/v1/members/nickname/validate',
        { nickname: nick }
      )

      if (data.isAvailable) {
        setNicknameStatus('available')
        setNicknameError('')
        onValidationChange(true)
      } else {
        setNicknameStatus('unavailable')
        setNicknameError('이미 사용 중인 닉네임입니다')
        onValidationChange(false)
      }
    } catch {
      setNicknameError('닉네임 확인 중 오류가 발생했습니다')
      setNicknameStatus('unchecked')
      onValidationChange(false)
    } finally {
      setIsCheckingNickname(false)
    }
  }

  const handleNicknameChange = (newNickname: string) => {
    onChange(newNickname)
    setNicknameStatus('unchecked')
    setNicknameError('')
    onValidationChange(false)
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        닉네임
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
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
            value.trim().length < 2 ||
            value.trim().length > 20
          }
          className="px-4 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {isCheckingNickname ? '확인중...' : '중복확인'}
        </button>
      </div>

      {/* 상태 메시지 */}
      {nicknameError && (
        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
          <XCircleIcon className="w-4 h-4" />
          {nicknameError}
        </p>
      )}
      {nicknameStatus === 'available' && !nicknameError && (
        <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
          <CheckCircleIcon className="w-4 h-4" />
          사용 가능한 닉네임입니다
        </p>
      )}
      {isCheckingNickname && (
        <p className="mt-2 text-sm text-blue-600 flex items-center gap-1">
          <ArrowPathIcon className="w-4 h-4 animate-spin" />
          닉네임 중복 확인 중...
        </p>
      )}

      <p className="mt-1 text-sm text-gray-500">
        2자 이상 20자 이하로 입력해주세요
      </p>
    </div>
  )
}
