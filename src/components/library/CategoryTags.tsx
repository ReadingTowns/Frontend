'use client'

interface CategoryTagsProps {
  categories: string[]
  maxDisplay?: number
}

export function CategoryTags({
  categories,
  maxDisplay = 2,
}: CategoryTagsProps) {
  if (!categories || categories.length === 0) return null

  const displayCategories = categories.slice(0, maxDisplay)
  const remainingCount = categories.length - maxDisplay

  return (
    <div className="flex flex-wrap gap-1">
      {displayCategories.map((category, index) => (
        <span key={index} className="text-xs text-gray-600">
          #{category}
        </span>
      ))}
      {remainingCount > 0 && (
        <span className="text-xs text-gray-400">+{remainingCount}</span>
      )}
    </div>
  )
}
