'use client'

import { useState, useEffect, useMemo } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { debounce } from 'lodash'

interface BookSearchInputProps {
  onSearchChange: (query: string) => void
  placeholder?: string
}

export default function BookSearchInput({
  onSearchChange,
  placeholder = '책 제목을 입력하세요',
}: BookSearchInputProps) {
  const [inputValue, setInputValue] = useState('')

  // Debounced search (300ms)
  const debouncedSearch = useMemo(
    () => debounce((value: string) => onSearchChange(value), 300),
    [onSearchChange]
  )

  useEffect(() => {
    debouncedSearch(inputValue)
    return () => {
      debouncedSearch.cancel()
    }
  }, [inputValue, debouncedSearch])

  return (
    <div className="relative">
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      <input
        type="text"
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400 outline-none"
      />
    </div>
  )
}
