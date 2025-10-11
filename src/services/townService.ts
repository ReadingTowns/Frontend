import type { TownInfo, UpdateTownRequest } from '@/types/town'

const BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.readingtown.site'

/**
 * Get current town information
 */
export async function getTownInfo(): Promise<TownInfo> {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/members/town`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to get town info: ${response.status}`)
    }

    const data = await response.json()

    if (data.code !== 1000) {
      throw new Error(data.message || 'Failed to get town info')
    }

    return data.result
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
    const response = await fetch(
      `${BASE_URL}/api/v1/members/town/coordinates?longitude=${longitude}&latitude=${latitude}`,
      {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to get town by coordinates: ${response.status}`)
    }

    const data = await response.json()

    if (data.code !== 1000) {
      throw new Error(data.message || 'Failed to get town by coordinates')
    }

    return data.result
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
    const response = await fetch(`${BASE_URL}/api/v1/members/town`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      throw new Error(`Failed to update town: ${response.status}`)
    }

    const data = await response.json()

    if (data.code !== 1000) {
      throw new Error(data.message || 'Failed to update town')
    }

    return data.result
  } catch (error) {
    console.error('Update town error:', error)
    throw error
  }
}
