'use client'

import { useState } from 'react'
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

    // 탭 전환 시 해당 탭의 데이터 쿼리 무효화 (최신 데이터 가져오기)
    switch (tab) {
      case 'messages':
        queryClient.invalidateQueries({ queryKey: socialKeys.conversations() })
        break
      case 'following':
        queryClient.invalidateQueries({ queryKey: socialKeys.following() })
        break
      case 'followers':
        queryClient.invalidateQueries({ queryKey: socialKeys.followers() })
        break
      case 'explore':
        queryClient.invalidateQueries({
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
