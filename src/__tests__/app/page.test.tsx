import { render } from '@testing-library/react'
import RootPage from '@/app/page'
import * as navigation from 'next/navigation'

// redirect 모킹
jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}))

describe('Root Page', () => {
  it('should call redirect to /home', () => {
    const mockRedirect = jest.mocked(navigation.redirect)

    render(<RootPage />)

    expect(mockRedirect).toHaveBeenCalledWith('/home')
  })
})