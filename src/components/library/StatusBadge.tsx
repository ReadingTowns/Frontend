'use client'

interface StatusBadgeProps {
  label: string
  color: 'blue' | 'pink' | 'gray'
}

export function StatusBadge({ label, color }: StatusBadgeProps) {
  const colorClasses = {
    blue: 'bg-blue-400 text-white',
    pink: 'bg-pink-400 text-white',
    gray: 'bg-gray-400 text-white',
  }

  if (!label) return null

  return (
    <div
      className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${colorClasses[color]}`}
    >
      <span>{label}</span>
      <span className="w-2 h-2 bg-white rounded-full" />
    </div>
  )
}
