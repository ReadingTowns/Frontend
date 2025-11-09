'use client'

import { useState, useEffect } from 'react'
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

export default function SocialClient() {
  const [activeTab, setActiveTab] = useState<SocialTab>('messages')
  const queryClient = useQueryClient()

  useHeaderConfig({
    variant: 'basic',
    title: '소셜',
  })

  const handleTabChange = (tab: SocialTab) => {
    setActiveTab(tab)

    // 탭 전환 시 즉시 데이터 fetch (refetchQueries로 변경)
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

  // 초기 마운트 시 (뒤로가기 등) 현재 활성 탭의 데이터 즉시 fetch
  useEffect(() => {
    switch (activeTab) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // 마운트 시 1회만 실행

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
