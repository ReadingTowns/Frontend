/**
 * Town information
 */
export interface TownInfo {
  townId?: number
  townName?: string
  address?: string
  latitude?: number
  longitude?: number
  isVerified?: boolean
  verifiedAt?: string
}

/**
 * Request to update town information
 */
export interface UpdateTownRequest {
  latitude: number
  longitude: number
}

/**
 * API response wrapper
 */
export interface TownApiResponse {
  code: string
  message: string
  result: TownInfo
}
