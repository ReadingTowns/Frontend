import { getTownInfo, updateTown } from '@/services/townService'
import type { TownInfo, UpdateTownRequest } from '@/types/town'

// Mock fetch
global.fetch = jest.fn()

describe('townService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getTownInfo', () => {
    it('should fetch town information successfully', async () => {
      const mockTownInfo: TownInfo = {
        townId: 1,
        townName: '강남구 삼성동',
        address: '서울시 강남구 삼성동 123-45',
        latitude: 37.5665,
        longitude: 126.978,
        isVerified: true,
        verifiedAt: '2025-01-01T00:00:00Z',
      }

      const mockResponse = {
        code: 1000,
        message: 'success',
        result: mockTownInfo,
      }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await getTownInfo()

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.readingtown.site/api/v1/members/town',
        {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      expect(result).toEqual(mockTownInfo)
    })

    it('should throw error when response is not ok', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
      })

      await expect(getTownInfo()).rejects.toThrow(
        'Failed to get town info: 404'
      )
    })

    it('should throw error when API returns error code', async () => {
      const mockResponse = {
        code: 2000,
        message: 'Town not found',
        result: null,
      }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      await expect(getTownInfo()).rejects.toThrow('Town not found')
    })
  })

  describe('updateTown', () => {
    it('should update town information successfully', async () => {
      const request: UpdateTownRequest = {
        townName: '강남구 삼성동',
        address: '서울시 강남구 삼성동 123-45',
        latitude: 37.5665,
        longitude: 126.978,
      }

      const mockTownInfo: TownInfo = {
        townId: 1,
        ...request,
        isVerified: true,
        verifiedAt: '2025-01-01T00:00:00Z',
      }

      const mockResponse = {
        code: 1000,
        message: 'success',
        result: mockTownInfo,
      }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await updateTown(request)

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.readingtown.site/api/v1/members/town',
        {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(request),
        }
      )
      expect(result).toEqual(mockTownInfo)
    })

    it('should throw error when response is not ok', async () => {
      const request: UpdateTownRequest = {
        townName: '강남구 삼성동',
        address: '서울시 강남구 삼성동 123-45',
        latitude: 37.5665,
        longitude: 126.978,
      }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
      })

      await expect(updateTown(request)).rejects.toThrow(
        'Failed to update town: 400'
      )
    })

    it('should throw error when API returns error code', async () => {
      const request: UpdateTownRequest = {
        townName: '강남구 삼성동',
        address: '서울시 강남구 삼성동 123-45',
        latitude: 37.5665,
        longitude: 126.978,
      }

      const mockResponse = {
        code: 4000,
        message: 'Invalid location',
        result: null,
      }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      await expect(updateTown(request)).rejects.toThrow('Invalid location')
    })
  })
})
