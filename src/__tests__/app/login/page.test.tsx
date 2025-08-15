import { render, screen, fireEvent } from '@testing-library/react'
import LoginPage from '@/app/login/page'

const mockPush = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    back: jest.fn(),
  }),
}))

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    global.window.location.assign.mockClear()
  })

  it('renders login page with title and description', () => {
    render(<LoginPage />)

    expect(screen.getByText('리딩타운')).toBeInTheDocument()
    expect(screen.getByText('책으로 이웃과 연결되는 공간')).toBeInTheDocument()
    expect(
      screen.getByText('로그인하여 리딩타운의 모든 서비스를 이용하세요')
    ).toBeInTheDocument()
  })

  it('renders Google and Kakao login buttons', () => {
    render(<LoginPage />)

    expect(screen.getByText('Google로 로그인')).toBeInTheDocument()
    expect(screen.getByText('카카오로 로그인')).toBeInTheDocument()
  })

  it('redirects to Google OAuth when Google button is clicked', () => {
    render(<LoginPage />)

    fireEvent.click(screen.getByText('Google로 로그인'))

    expect(global.window.location.assign).toHaveBeenCalledWith('/oauth2/authorization/google')
  })

  it('redirects to Kakao OAuth when Kakao button is clicked', () => {
    render(<LoginPage />)

    fireEvent.click(screen.getByText('카카오로 로그인'))

    expect(global.window.location.assign).toHaveBeenCalledWith('/oauth2/authorization/kakao')
  })

  it('has proper layout structure', () => {
    render(<LoginPage />)

    const titleContainer = screen.getByText('리딩타운').closest('div')
    expect(titleContainer).toHaveClass('text-center', 'space-y-4')

    const buttonContainer = screen
      .getByText('Google로 로그인')
      .closest('button')
      ?.parentElement
    expect(buttonContainer).toHaveClass('w-full', 'max-w-sm', 'space-y-4')
  })
})