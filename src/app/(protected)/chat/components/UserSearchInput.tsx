'use client'

import React from 'react'

interface UserSearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder: string
  isLoading: boolean
  onClear?: () => void
}

export default function UserSearchInput({
  value,
  onChange,
  placeholder,
  isLoading,
  onClear,
}: UserSearchInputProps) {
  const handleClear = () => {
    onChange('')
    onClear?.()
  }

  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        {isLoading ? (
          <span className="inline-block animate-spin">⏳</span>
        ) : (
          <span>🔍</span>
        )}
      </div>

      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-12 pl-10 pr-10 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
        autoFocus
      />

      {value && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <span className="text-gray-500 text-lg">✕</span>
        </button>
      )}
    </div>
  )
}
