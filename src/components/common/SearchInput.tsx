'use client'

import { useEffect, useCallback, useMemo } from 'react'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { debounce } from 'lodash'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  showClearButton?: boolean
  autoFocus?: boolean
  isLoading?: boolean
  debounceMs?: number
  onDebouncedChange?: (value: string) => void
  className?: string
  inputClassName?: string
  'aria-label'?: string
  id?: string
}

export function SearchInput({
  value,
  onChange,
  placeholder = '검색...',
  showClearButton = true,
  autoFocus = false,
  isLoading = false,
  debounceMs = 300,
  onDebouncedChange,
  className = '',
  inputClassName = '',
  'aria-label': ariaLabel,
  id,
}: SearchInputProps) {
  // 디바운스된 콜백 생성
  const debouncedCallback = useMemo(
    () =>
      debounce((searchValue: string) => {
        if (onDebouncedChange) {
          onDebouncedChange(searchValue)
        }
      }, debounceMs),
    [onDebouncedChange, debounceMs]
  )

  // value 변경 시 디바운스된 콜백 실행
  useEffect(() => {
    if (onDebouncedChange) {
      debouncedCallback(value)
    }
    // 컴포넌트 언마운트 시 디바운스 취소
    return () => {
      debouncedCallback.cancel()
    }
  }, [value, debouncedCallback, onDebouncedChange])

  const handleClear = useCallback(() => {
    onChange('')
    if (onDebouncedChange) {
      onDebouncedChange('')
    }
  }, [onChange, onDebouncedChange])

  return (
    <div className={`relative ${className}`}>
      {/* 검색 아이콘 (왼쪽) */}
      <MagnifyingGlassIcon
        className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 ${
          isLoading ? 'animate-spin' : ''
        }`}
      />

      {/* 검색 입력 */}
      <input
        id={id}
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        aria-label={ariaLabel || placeholder}
        className={`
          w-full
          px-4 py-2.5
          pl-10 pr-10
          bg-gray-50
          border border-gray-200
          rounded-lg
          text-sm text-gray-900
          placeholder-gray-500
          focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent focus:bg-white
          transition-all
          ${inputClassName}
        `}
      />

      {/* 클리어 버튼 (오른쪽) */}
      {showClearButton && value && !isLoading && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors"
          aria-label="검색어 지우기"
        >
          <XMarkIcon className="w-4 h-4 text-gray-500" />
        </button>
      )}
    </div>
  )
}

SearchInput.displayName = 'SearchInput'
