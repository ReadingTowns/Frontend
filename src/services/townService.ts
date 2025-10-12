import type { TownInfo, UpdateTownRequest } from '@/types/town'
import { api } from '@/lib/api'

/**
 * Get current town information
 */
export async function getTownInfo(): Promise<TownInfo> {
  try {
    return await api.get<TownInfo>('/api/v1/members/town')
  } catch (error) {
    console.error('Get town info error:', error)
    throw error
  }
}

/**
 * Get town name by coordinates (latitude, longitude)
 */
export async function getTownByCoordinates(
  longitude: number,
  latitude: number
): Promise<{ currentTown: string }> {
  try {
    return await api.get<{ currentTown: string }>(
      '/api/v1/members/town/coordinates',
      { longitude, latitude }
    )
  } catch (error) {
    console.error('Get town by coordinates error:', error)
    throw error
  }
}

/**
 * Update town information
 */
export async function updateTown(
  request: UpdateTownRequest
): Promise<TownInfo> {
  try {
    return await api.put<TownInfo>('/api/v1/members/town', request)
  } catch (error) {
    console.error('Update town error:', error)
    throw error
  }
}
