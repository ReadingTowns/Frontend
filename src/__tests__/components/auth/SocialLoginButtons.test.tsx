import { render, screen, fireEvent } from '@testing-library/react'
import {
  GoogleLoginButton,
  KakaoLoginButton,
} from '@/components/auth/SocialLoginButtons'

describe('SocialLoginButtons', () => {
  describe('GoogleLoginButton', () => {
    it('renders Google login button with correct text', () => {
      const mockOnClick = jest.fn()
      render(<GoogleLoginButton onClick={mockOnClick} />)

      expect(screen.getByText('Google로 로그인')).toBeInTheDocument()
    })

    it('calls onClick when button is clicked', () => {
      const mockOnClick = jest.fn()
      render(<GoogleLoginButton onClick={mockOnClick} />)

      fireEvent.click(screen.getByText('Google로 로그인'))
      expect(mockOnClick).toHaveBeenCalledTimes(1)
    })

    it('has correct CSS classes for styling', () => {
      const mockOnClick = jest.fn()
      render(<GoogleLoginButton onClick={mockOnClick} />)

      const button = screen.getByRole('button')
      expect(button).toHaveClass(
        'w-full',
        'flex',
        'items-center',
        'justify-center',
        'gap-3',
        'px-4',
        'py-3',
        'border',
        'border-gray-300',
        'rounded-lg',
        'bg-white',
        'hover:bg-gray-50',
        'transition-colors'
      )
    })
  })

  describe('KakaoLoginButton', () => {
    it('renders Kakao login button with correct text', () => {
      const mockOnClick = jest.fn()
      render(<KakaoLoginButton onClick={mockOnClick} />)

      expect(screen.getByText('카카오로 로그인')).toBeInTheDocument()
    })

    it('calls onClick when button is clicked', () => {
      const mockOnClick = jest.fn()
      render(<KakaoLoginButton onClick={mockOnClick} />)

      fireEvent.click(screen.getByText('카카오로 로그인'))
      expect(mockOnClick).toHaveBeenCalledTimes(1)
    })

    it('has correct CSS classes for Kakao styling', () => {
      const mockOnClick = jest.fn()
      render(<KakaoLoginButton onClick={mockOnClick} />)

      const button = screen.getByRole('button')
      expect(button).toHaveClass(
        'w-full',
        'flex',
        'items-center',
        'justify-center',
        'gap-3',
        'px-4',
        'py-3',
        'rounded-lg',
        'bg-[#FEE500]',
        'hover:bg-[#FEE500]/90',
        'transition-colors'
      )
    })
  })
})
