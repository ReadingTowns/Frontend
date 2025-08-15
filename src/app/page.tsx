import { redirect } from 'next/navigation'

export default function RootPage() {
  // 미들웨어에서 리다이렉트 처리하므로 이 페이지는 도달하지 않아야 함
  // 만약 도달한다면 /home으로 리다이렉트
  redirect('/home')
}