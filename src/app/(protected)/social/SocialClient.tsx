'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { useHeaderConfig } from '@/hooks/useHeaderConfig'
import SocialTabs from './components/SocialTabs'
import MessagesTab from './components/MessagesTab'
import FollowingTab from './components/FollowingTab'
import FollowersTab from './components/FollowersTab'
import ExploreTab from './components/ExploreTab'
import ExchangeTab from './components/ExchangeTab'
import { socialKeys } from '@/types/social'
import type { SocialTab } from '@/types/social'

const VALID_TABS: SocialTab[] = [
  'messages',
  'following',
  'followers',
  'explore',
  'exchange',
]

export default function SocialClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const queryClient = useQueryClient()

  useHeaderConfig({
    variant: 'basic',
    title: '소셜',
  })

  // URL에서 탭 상태 읽기
  const tabParam = searchParams.get('tab')
  const activeTab: SocialTab = VALID_TABS.includes(tabParam as SocialTab)
    ? (tabParam as SocialTab)
    : 'messages'

  // 잘못된 탭 값이면 기본 탭으로 리다이렉트
  useEffect(() => {
    if (tabParam && !VALID_TABS.includes(tabParam as SocialTab)) {
      router.replace('/social?tab=messages', { scroll: false })
    }
  }, [tabParam, router])

  // 탭 전환 시 URL 업데이트 및 데이터 fetch
  const handleTabChange = (tab: SocialTab) => {
    router.push(`/social?tab=${tab}`, { scroll: false })

    // 탭 전환 시 즉시 데이터 fetch
    switch (tab) {
      case 'messages':
        queryClient.refetchQueries({ queryKey: socialKeys.conversations() })
        break
      case 'following':
        queryClient.refetchQueries({ queryKey: socialKeys.following() })
        break
      case 'followers':
        queryClient.refetchQueries({ queryKey: socialKeys.followers() })
        break
      case 'explore':
        queryClient.refetchQueries({
          queryKey: socialKeys.recommendations(),
        })
        break
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      <SocialTabs activeTab={activeTab} onTabChange={handleTabChange} />

      {activeTab === 'messages' && <MessagesTab />}
      {activeTab === 'following' && <FollowingTab />}
      {activeTab === 'followers' && <FollowersTab />}
      {activeTab === 'explore' && <ExploreTab />}
      {activeTab === 'exchange' && <ExchangeTab />}
    </div>
  )
}

SocialClient.displayName = 'SocialClient'
