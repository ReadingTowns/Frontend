/**
 * Jest 설정 테스트
 * Jest와 React Testing Library가 올바르게 설정되었는지 확인
 */

describe('Jest Setup', () => {
  it('should run basic test', () => {
    expect(1 + 1).toBe(2)
  })

  it('should have jest-dom matchers available', () => {
    const element = document.createElement('div')
    element.textContent = 'Hello World'
    document.body.appendChild(element)

    expect(element).toBeInTheDocument()
    expect(element).toHaveTextContent('Hello World')
  })

  it('should mock Next.js navigation', async () => {
    const { useRouter } = await import('next/navigation')
    const router = useRouter()

    expect(router.push).toBeDefined()
    expect(typeof router.push).toBe('function')
  })
})
