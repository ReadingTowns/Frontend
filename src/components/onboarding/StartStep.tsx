import { StartStepProps } from '@/types/onboarding'

export default function StartStep({}: StartStepProps) {
  return (
    <div className="px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          리딩타운에 오신 것을 환영합니다! 📚
        </h1>
        <p className="text-gray-600 mb-6">
          동네 이웃들과 책을 교환하며
          <br />
          새로운 독서 경험을 시작해보세요
        </p>
        <div className="w-32 h-32 bg-primary-100 rounded-full mx-auto flex items-center justify-center mb-6">
          <span className="text-4xl">📖</span>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm">✓</span>
          </div>
          <span className="text-gray-700">동네 이웃들과 책 교환</span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm">✓</span>
          </div>
          <span className="text-gray-700">AI 기반 책 추천</span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm">✓</span>
          </div>
          <span className="text-gray-700">실시간 채팅으로 소통</span>
        </div>
      </div>
    </div>
  )
}
