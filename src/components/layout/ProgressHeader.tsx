'use client'

interface ProgressHeaderProps {
  title?: string
  currentStep: number
  totalSteps: number
}

export default function ProgressHeader({
  title = '온보딩',
  currentStep,
  totalSteps,
}: ProgressHeaderProps) {
  const progressPercentage = (currentStep / totalSteps) * 100

  return (
    <div className="bg-white border-b border-gray-200 flex-shrink-0">
      <div className="max-w-[430px] mx-auto px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">{title}</span>
          <span className="text-sm text-gray-600">
            {currentStep} / {totalSteps}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${progressPercentage}%`,
            }}
          />
        </div>
      </div>
    </div>
  )
}
