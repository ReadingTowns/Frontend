import { Metadata } from 'next'
import EditKeywordsClient from './EditKeywordsClient'

export const metadata: Metadata = {
  title: '키워드 변경 | ReadingTown',
  description: '취향 키워드를 다시 선택하세요',
}

export default function EditKeywordsPage() {
  return <EditKeywordsClient />
}
