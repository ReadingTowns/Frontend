'use client'

interface NeighborsHeaderProps {
  title?: string
  subtitle?: string
}

export default function NeighborsHeader({
  title = '이웃',
  subtitle = '책을 사랑하는 이웃들과 연결되세요',
}: NeighborsHeaderProps) {
  return (
    <header className="mb-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
      {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
    </header>
  )
}
