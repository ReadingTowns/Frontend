import LibraryPageClient from './LibraryPageClient'

export default function LibraryPage() {
  // SSR 제거: 클라이언트에서 직접 데이터 fetch
  return <LibraryPageClient />
}
