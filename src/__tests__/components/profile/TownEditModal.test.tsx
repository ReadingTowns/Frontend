import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import TownEditModal from '../../../components/profile/TownEditModal'
import * as townService from '../../../services/townService'

// Mock the town service
jest.mock('../../../services/townService')

describe('TownEditModal', () => {
  const mockOnClose = jest.fn()
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })
    jest.clearAllMocks()

    // Mock window.alert
    global.alert = jest.fn()

    // Mock navigator.geolocation
    const mockGeolocation = {
      getCurrentPosition: jest.fn(),
    }
    Object.defineProperty(global.navigator, 'geolocation', {
      value: mockGeolocation,
      writable: true,
    })
  })

  const renderComponent = (props = {}) => {
    const defaultProps = {
      isOpen: true,
      onClose: mockOnClose,
      currentTown: '',
    }

    return render(
      <QueryClientProvider client={queryClient}>
        <TownEditModal {...defaultProps} {...props} />
      </QueryClientProvider>
    )
  }

  it('should not render when isOpen is false', () => {
    renderComponent({ isOpen: false })
    expect(screen.queryByText('동네 인증')).not.toBeInTheDocument()
  })

  it('should render when isOpen is true', () => {
    renderComponent()
    expect(screen.getByText('동네 인증')).toBeInTheDocument()
  })

  it('should display current town when provided', () => {
    renderComponent({ currentTown: '강남구 삼성동' })
    expect(screen.getByText('현재 설정된 동네')).toBeInTheDocument()
    expect(screen.getByText('강남구 삼성동')).toBeInTheDocument()
  })

  it('should close modal when close button is clicked', () => {
    renderComponent()
    // Find the close button by its position - first button in the header
    const buttons = screen.getAllByRole('button')
    const closeButton = buttons[0] // First button is the X close button
    fireEvent.click(closeButton)
    expect(mockOnClose).toHaveBeenCalled()
  })

  it('should close modal when cancel button is clicked after detecting location', async () => {
    const mockPosition = {
      coords: {
        latitude: 37.5665,
        longitude: 126.978,
      },
    }

    const getCurrentPositionMock = navigator.geolocation
      .getCurrentPosition as jest.Mock
    getCurrentPositionMock.mockImplementation((success: PositionCallback) => {
      success(mockPosition as GeolocationPosition)
    })

    renderComponent()

    const locationButton = screen.getByText(/현재 위치로 동네 인증하기/)
    fireEvent.click(locationButton)

    await waitFor(() => {
      expect(screen.getByText('취소')).toBeInTheDocument()
    })

    const cancelButton = screen.getByText('취소')
    fireEvent.click(cancelButton)
    expect(mockOnClose).toHaveBeenCalled()
  })

  it('should get current location and show GPS coordinates when button is clicked', async () => {
    const mockPosition = {
      coords: {
        latitude: 37.5665,
        longitude: 126.978,
      },
    }

    const getCurrentPositionMock = navigator.geolocation
      .getCurrentPosition as jest.Mock
    getCurrentPositionMock.mockImplementation((success: PositionCallback) => {
      success(mockPosition as GeolocationPosition)
    })

    renderComponent()

    const locationButton = screen.getByText(/현재 위치로 동네 인증하기/)
    fireEvent.click(locationButton)

    await waitFor(() => {
      expect(screen.getByText('GPS 위치 확인 완료')).toBeInTheDocument()
      expect(screen.getByText(/위도: 37.566500/)).toBeInTheDocument()
      expect(screen.getByText(/경도: 126.978000/)).toBeInTheDocument()
    })
  })

  it('should not show submit button when location is not detected', () => {
    renderComponent()
    expect(screen.queryByText('이 위치로 설정')).not.toBeInTheDocument()
  })

  it('should submit successfully after detecting location', async () => {
    const mockUpdateTown = townService.updateTown as jest.Mock
    mockUpdateTown.mockResolvedValueOnce({
      townId: 1,
      townName: '명동',
      latitude: 37.5665,
      longitude: 126.978,
      isVerified: true,
    })

    // Mock getCurrentPosition
    const mockPosition = {
      coords: {
        latitude: 37.5665,
        longitude: 126.978,
      },
    }

    const getCurrentPositionMock = navigator.geolocation
      .getCurrentPosition as jest.Mock
    getCurrentPositionMock.mockImplementation((success: PositionCallback) => {
      success(mockPosition as GeolocationPosition)
    })

    renderComponent()

    // Get location
    const locationButton = screen.getByText(/현재 위치로 동네 인증하기/)
    fireEvent.click(locationButton)

    await waitFor(() => {
      expect(screen.getByText('GPS 위치 확인 완료')).toBeInTheDocument()
    })

    // Submit
    const submitButton = screen.getByText('이 위치로 설정')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockUpdateTown).toHaveBeenCalledWith({
        latitude: 37.5665,
        longitude: 126.978,
      })
      expect(mockOnClose).toHaveBeenCalled()
    })
  })

  it('should handle error when update fails', async () => {
    const mockUpdateTown = townService.updateTown as jest.Mock
    mockUpdateTown.mockRejectedValueOnce(new Error('Update failed'))

    // Mock getCurrentPosition
    const mockPosition = {
      coords: {
        latitude: 37.5665,
        longitude: 126.978,
      },
    }

    const getCurrentPositionMock = navigator.geolocation
      .getCurrentPosition as jest.Mock
    getCurrentPositionMock.mockImplementation((success: PositionCallback) => {
      success(mockPosition as GeolocationPosition)
    })

    renderComponent()

    // Get location
    const locationButton = screen.getByText(/현재 위치로 동네 인증하기/)
    fireEvent.click(locationButton)

    await waitFor(() => {
      expect(screen.getByText('GPS 위치 확인 완료')).toBeInTheDocument()
    })

    // Submit
    const submitButton = screen.getByText('이 위치로 설정')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockUpdateTown).toHaveBeenCalled()
    })
  })
})
