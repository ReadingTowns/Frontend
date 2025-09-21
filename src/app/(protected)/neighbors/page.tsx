import { Metadata } from 'next'
import NeighborsPageClient from './NeighborsPageClient'

export const metadata: Metadata = {
  title: '이웃 - 리딩타운',
  description: '책을 사랑하는 이웃들과 연결되세요',
}

export default function NeighborsPage() {
  return <NeighborsPageClient />
}
