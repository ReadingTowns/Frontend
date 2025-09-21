import { Metadata } from 'next'
import AddBookClient from './AddBookClient'

export const metadata: Metadata = {
  title: '책 등록 - 리딩타운',
  description: '서재에 새로운 책을 추가해보세요',
}

export default function AddLibraryBookPage() {
  return <AddBookClient />
}
