import { useState, useEffect } from 'react'
import { PreferencesStepProps } from '@/types/onboarding'

export default function PreferencesStep({
  value,
  onChange,
  onBack,
}: PreferencesStepProps) {
  const [availableTime, setAvailableTime] = useState(value)

  useEffect(() => {
    setAvailableTime(value)
  }, [value])

  const handleTimeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    setAvailableTime(newValue)
    onChange(newValue)
  }

  return (
    <div className="px-4 py-8">
      {/* 이전 버튼 */}
      <button onClick={onBack} className="btn-ghost text-left mb-4">
        ← 이전
      </button>

      <h2 className="text-xl font-bold text-gray-900 mb-2">
        교환 가능한 시간대를 알려주세요
      </h2>
      <p className="text-gray-600 mb-8">
        이웃들과 약속 잡기가 쉬워져요 (나중에 변경 가능)
      </p>

      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          교환 가능한 시간대
        </label>
        <textarea
          value={availableTime}
          onChange={handleTimeChange}
          placeholder="예: 평일 저녁 6시 이후, 주말 오후 시간대 가능해요"
          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent resize-none"
          rows={4}
          maxLength={200}
        />
        <p className="mt-1 text-sm text-gray-500">
          이웃들과 약속 잡기가 쉬워져요 (나중에 변경 가능, 최대 200자)
        </p>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>💡 예시:</strong> &ldquo;평일 저녁 7시 이후, 주말 오후
            시간대 가능합니다&rdquo; 또는 &ldquo;나중에 설정하기&rdquo;
          </p>
        </div>
      </div>
    </div>
  )
}
