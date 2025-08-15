import { useState, useEffect } from 'react'
import { PhoneStepProps } from '@/types/onboarding'

export default function PhoneStep({ value, onChange, onBack }: PhoneStepProps) {
  const [phoneNumber, setPhoneNumber] = useState(value)
  const [error, setError] = useState('')

  const validatePhone = (phone: string) => {
    const phoneRegex = /^010-\d{4}-\d{4}$/
    return phoneRegex.test(phone)
  }

  useEffect(() => {
    setPhoneNumber(value)
  }, [value])

  const handlePhoneChange = (newPhone: string) => {
    const formatted = formatPhoneNumber(newPhone)
    setPhoneNumber(formatted)

    if (validatePhone(formatted)) {
      setError('')
      onChange(formatted)
    } else {
      setError('')
      onChange('')
    }
  }

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/[^\d]/g, '')
    if (numbers.length <= 3) return numbers
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`
  }

  return (
    <div className="px-4 py-8">
      {/* 이전 버튼 */}
      <button onClick={onBack} className="btn-ghost text-left mb-4">
        ← 이전
      </button>

      <h2 className="text-xl font-bold text-gray-900 mb-2">
        전화번호를 입력해주세요
      </h2>
      <p className="text-gray-600 mb-8">안전한 교환을 위해 연락처가 필요해요</p>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          전화번호
        </label>
        <input
          type="tel"
          value={phoneNumber}
          onChange={e => handlePhoneChange(e.target.value)}
          placeholder="010-0000-0000"
          className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
          maxLength={13}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    </div>
  )
}
