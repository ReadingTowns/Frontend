'use client'

/**
 * Exchange Request Creation Page
 * 교환 요청 생성 플로우 페이지
 */

import { useState } from 'react'
import { BookSearchStep } from '@/components/exchange/BookSearchStep'
import { OwnerSelectStep } from '@/components/exchange/OwnerSelectStep'
import { ConfirmCreateStep } from '@/components/exchange/ConfirmCreateStep'
import type { BookSearchResult, BookhouseOwner } from '@/types/exchange'

type Step = 'search' | 'select' | 'confirm'

export default function NewExchangePage() {
  const [currentStep, setCurrentStep] = useState<Step>('search')
  const [selectedBook, setSelectedBook] = useState<BookSearchResult | null>(
    null
  )
  const [selectedOwner, setSelectedOwner] = useState<BookhouseOwner | null>(
    null
  )

  const handleBookSelect = (book: BookSearchResult) => {
    setSelectedBook(book)
    setCurrentStep('select')
  }

  const handleOwnerSelect = (owner: BookhouseOwner) => {
    setSelectedOwner(owner)
    setCurrentStep('confirm')
  }

  const handleBackFromSelect = () => {
    setSelectedBook(null)
    setCurrentStep('search')
  }

  const handleBackFromConfirm = () => {
    setSelectedOwner(null)
    setCurrentStep('select')
  }

  return (
    <div className="h-screen bg-white dark:bg-gray-900">
      {currentStep === 'search' && (
        <BookSearchStep onBookSelect={handleBookSelect} />
      )}

      {currentStep === 'select' && selectedBook && (
        <OwnerSelectStep
          selectedBook={selectedBook}
          onOwnerSelect={handleOwnerSelect}
          onBack={handleBackFromSelect}
        />
      )}

      {currentStep === 'confirm' && selectedBook && selectedOwner && (
        <ConfirmCreateStep
          selectedBook={selectedBook}
          selectedOwner={selectedOwner}
          onBack={handleBackFromConfirm}
        />
      )}
    </div>
  )
}
