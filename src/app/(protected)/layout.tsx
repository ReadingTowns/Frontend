import { HeaderProvider } from '@/contexts/HeaderContext'
import ProtectedLayoutClient from './ProtectedLayoutClient'

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-gray-50">
      <HeaderProvider>
        <ProtectedLayoutClient>{children}</ProtectedLayoutClient>
      </HeaderProvider>
    </div>
  )
}
