'use client'

interface MenuItem {
  id: string
  title: string
  icon: string
  onClick: () => void
  isDanger?: boolean
}

interface MenuListProps {
  items: MenuItem[]
}

export default function MenuList({ items }: MenuListProps) {
  return (
    <div className="bg-white mt-2">
      <div className="divide-y divide-gray-100">
        {items.map(item => (
          <button
            key={item.id}
            onClick={item.onClick}
            className={`
              w-full flex items-center justify-between px-6 py-4
              transition-colors duration-150
              ${
                item.isDanger
                  ? 'hover:bg-red-50 active:bg-red-100'
                  : 'hover:bg-gray-50 active:bg-gray-100'
              }
            `}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl" role="img" aria-label={item.title}>
                {item.icon}
              </span>
              <span
                className={`
                  text-base font-medium
                  ${item.isDanger ? 'text-red-600' : 'text-gray-900'}
                `}
              >
                {item.title}
              </span>
            </div>
            <svg
              className={`w-5 h-5 ${item.isDanger ? 'text-red-400' : 'text-gray-400'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        ))}
      </div>
    </div>
  )
}
