import { useState, useEffect } from 'react'
import { LocationStepProps } from '@/types/onboarding'

export default function LocationStep({
  latitude,
  longitude,
  onLocationChange,
  onBack,
}: LocationStepProps) {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    latitude && longitude ? { lat: latitude, lng: longitude } : null
  )
  const [address, setAddress] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const getCurrentLocation = () => {
    setIsLoading(true)

    if (!navigator.geolocation) {
      alert('위치 서비스를 지원하지 않는 브라우저입니다')
      setIsLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords
        handleLocationSet(latitude, longitude)
        setAddress('현재 위치')
        setIsLoading(false)
      },
      error => {
        console.error('위치 정보를 가져올 수 없습니다:', error)
        alert('위치 정보를 가져올 수 없습니다. 위치 권한을 확인해주세요.')
        setIsLoading(false)
      }
    )
  }

  useEffect(() => {
    if (latitude && longitude) {
      setLocation({ lat: latitude, lng: longitude })
    }
  }, [latitude, longitude])

  const handleLocationSet = (lat: number, lng: number) => {
    setLocation({ lat, lng })
    onLocationChange(lat, lng)
  }

  return (
    <div className="px-4 py-8">
      {/* 이전 버튼 */}
      <button onClick={onBack} className="btn-ghost text-left mb-4">
        ← 이전
      </button>

      <h2 className="text-xl font-bold text-gray-900 mb-2">
        동네를 설정해주세요
      </h2>
      <p className="text-gray-600 mb-8">
        가까운 이웃들과 책을 교환할 수 있어요
      </p>

      <div className="mb-6">
        <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
          {location ? (
            <div className="text-center">
              <div className="text-2xl mb-2">📍</div>
              <p className="text-sm text-gray-600">{address}</p>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <div className="text-2xl mb-2">🗺️</div>
              <p className="text-sm">위치를 설정해주세요</p>
            </div>
          )}
        </div>

        <button
          onClick={getCurrentLocation}
          disabled={isLoading}
          className="btn-secondary"
        >
          {isLoading ? '위치 확인 중...' : '현재 위치로 설정'}
        </button>
      </div>
    </div>
  )
}
