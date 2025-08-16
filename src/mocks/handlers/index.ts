import { authHandlers } from './auth'
import { onboardingHandlers } from './onboarding'
import { dashboardHandlers } from './dashboard'
import { libraryHandlers } from './library'

export const handlers = [
  ...authHandlers,
  ...onboardingHandlers,
  ...dashboardHandlers,
  ...libraryHandlers,
]
