import { CompleteStepProps } from '@/types/onboarding'

export default function CompleteStep({ data }: CompleteStepProps) {
  return (
    <div className="px-4 py-8 text-center">
      <div className="mb-8">
        <div className="w-20 h-20 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-4">
          <span className="text-3xl">🎉</span>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          설정이 완료되었어요!
        </h2>
        <p className="text-gray-600 mb-6">
          이제 동네 이웃들과 책을 교환해보세요
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-8 text-left">
        <h3 className="font-medium text-gray-900 mb-3">설정 정보</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">닉네임:</span>
            <span className="text-gray-900">{data.nickname}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">전화번호:</span>
            <span className="text-gray-900">{data.phoneNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">교환 시간:</span>
            <span className="text-gray-900">{data.availableTime}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
