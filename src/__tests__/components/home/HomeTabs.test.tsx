import { render, screen, fireEvent } from '@testing-library/react'
import HomeTabs from '@/components/home/HomeTabs'
import { HomeTab } from '@/types/home'

describe('HomeTabs', () => {
  const mockNickname = '테스트'
  const mockOnTabChange = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render both tabs correctly', () => {
    render(
      <HomeTabs
        nickname={mockNickname}
        activeTab="myTown"
        onTabChange={mockOnTabChange}
      />
    )

    expect(screen.getByText(`${mockNickname}님의 리딩타운`)).toBeInTheDocument()
    expect(
      screen.getByText(`${mockNickname}님에게 추천하는 도서`)
    ).toBeInTheDocument()
  })

  it('should highlight active tab', () => {
    render(
      <HomeTabs
        nickname={mockNickname}
        activeTab="myTown"
        onTabChange={mockOnTabChange}
      />
    )

    const myTownTab = screen.getByText(`${mockNickname}님의 리딩타운`)
    expect(myTownTab).toHaveClass('text-primary-600')
  })

  it('should call onTabChange when clicking inactive tab', () => {
    render(
      <HomeTabs
        nickname={mockNickname}
        activeTab="myTown"
        onTabChange={mockOnTabChange}
      />
    )

    const recommendationsTab = screen.getByText(
      `${mockNickname}님에게 추천하는 도서`
    )
    fireEvent.click(recommendationsTab)

    expect(mockOnTabChange).toHaveBeenCalledWith('recommendations')
  })

  it('should have proper ARIA attributes', () => {
    render(
      <HomeTabs
        nickname={mockNickname}
        activeTab="myTown"
        onTabChange={mockOnTabChange}
      />
    )

    const myTownTab = screen.getByText(`${mockNickname}님의 리딩타운`)
    const recommendationsTab = screen.getByText(
      `${mockNickname}님에게 추천하는 도서`
    )

    expect(myTownTab).toHaveAttribute('aria-selected', 'true')
    expect(recommendationsTab).toHaveAttribute('aria-selected', 'false')
  })

  it('should switch active tab highlight when activeTab prop changes', () => {
    const { rerender } = render(
      <HomeTabs
        nickname={mockNickname}
        activeTab="myTown"
        onTabChange={mockOnTabChange}
      />
    )

    let myTownTab = screen.getByText(`${mockNickname}님의 리딩타운`)
    expect(myTownTab).toHaveClass('text-primary-600')

    rerender(
      <HomeTabs
        nickname={mockNickname}
        activeTab="recommendations"
        onTabChange={mockOnTabChange}
      />
    )

    const recommendationsTab = screen.getByText(
      `${mockNickname}님에게 추천하는 도서`
    )
    expect(recommendationsTab).toHaveClass('text-primary-600')

    myTownTab = screen.getByText(`${mockNickname}님의 리딩타운`)
    expect(myTownTab).not.toHaveClass('text-primary-600')
  })
})
