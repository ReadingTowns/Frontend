'use client'

import Link from 'next/link'
import { PlusIcon } from '@heroicons/react/24/outline'

interface LibraryHeaderProps {
  title?: string
  subtitle?: string
  addButtonHref?: string
}

export default function LibraryHeader({
  title = '내 서재',
  subtitle = '나만의 책 컬렉션을 관리해보세요',
  addButtonHref = '/library/add',
}: LibraryHeaderProps) {
  return (
    <header className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <Link href={addButtonHref}>
          <button className="p-2 text-gray-600 hover:text-gray-800">
            <PlusIcon className="w-6 h-6" />
          </button>
        </Link>
      </div>
      {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
    </header>
  )
}
