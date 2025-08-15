export interface OnboardingData {
  phoneNumber?: string
  nickname?: string
  profileImage?: string
  latitude?: number
  longitude?: number
  availableTime?: string
}

export type OnboardingStep =
  | 'start'
  | 'phone'
  | 'profile'
  | 'location'
  | 'preferences'
  | 'complete'

export interface PhoneStepProps {
  value: string
  onChange: (phoneNumber: string) => void
  onBack: () => void
}

export interface ProfileStepProps {
  nickname: string
  profileImage: string
  onNicknameChange: (nickname: string) => void
  onProfileImageChange: (profileImage: string) => void
  onNicknameValidationChange: (isValid: boolean) => void
  onBack: () => void
}

export interface LocationStepProps {
  latitude?: number
  longitude?: number
  onLocationChange: (latitude: number, longitude: number) => void
  onBack: () => void
}

export interface PreferencesStepProps {
  value: string
  onChange: (availableTime: string) => void
  onBack: () => void
}

export interface CompleteStepProps {
  data: OnboardingData
}
