import BookDetailClient from './BookDetailClient'

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ bookId: string }>
}) {
  const { bookId } = await params
  return <BookDetailClient bookId={bookId} />
}
