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

  console.log(
    '🔍 [SocialClient] Component mounted/rendered, activeTab:',
    activeTab
  )

  useHeaderConfig({
    variant: 'basic',
    title: '소셜',
  })

  const handleTabChange = (tab: SocialTab) => {
    console.log(
      '🔍 [SocialClient] handleTabChange called, from:',
      activeTab,
      'to:',
      tab
    )
    setActiveTab(tab)

    // 탭 전환 시 즉시 데이터 fetch (refetchQueries로 변경)
    console.log('🔍 [SocialClient] handleTabChange - switch case for:', tab)
    switch (tab) {
      case 'messages':
        console.log(
          '🔍 [SocialClient] Fetching messages (handleTabChange), queryKey:',
          socialKeys.conversations()
        )
        queryClient.refetchQueries({ queryKey: socialKeys.conversations() })
        console.log('🔍 [SocialClient] refetchQueries called (handleTabChange)')
        break
      case 'following':
        console.log(
          '🔍 [SocialClient] Fetching following (handleTabChange), queryKey:',
          socialKeys.following()
        )
        queryClient.refetchQueries({ queryKey: socialKeys.following() })
        break
      case 'followers':
        console.log(
          '🔍 [SocialClient] Fetching followers (handleTabChange), queryKey:',
          socialKeys.followers()
        )
        queryClient.refetchQueries({ queryKey: socialKeys.followers() })
        break
      case 'explore':
        console.log(
          '🔍 [SocialClient] Fetching explore (handleTabChange), queryKey:',
          socialKeys.recommendations()
        )
        queryClient.refetchQueries({
          queryKey: socialKeys.recommendations(),
        })
        break
    }
  }

  // 초기 마운트 시 (뒤로가기 등) 현재 활성 탭의 데이터 즉시 fetch
  useEffect(() => {
    console.log('🔍 [SocialClient] useEffect running, activeTab:', activeTab)
    console.log('🔍 [SocialClient] useEffect - queryClient state:', {
      queryCache: queryClient.getQueryCache().getAll().length,
    })

    switch (activeTab) {
      case 'messages':
        console.log(
          '🔍 [SocialClient] Fetching messages (useEffect), queryKey:',
          socialKeys.conversations()
        )
        queryClient.refetchQueries({ queryKey: socialKeys.conversations() })
        console.log('🔍 [SocialClient] refetchQueries called (useEffect)')
        break
      case 'following':
        console.log(
          '🔍 [SocialClient] Fetching following (useEffect), queryKey:',
          socialKeys.following()
        )
        queryClient.refetchQueries({ queryKey: socialKeys.following() })
        break
      case 'followers':
        console.log(
          '🔍 [SocialClient] Fetching followers (useEffect), queryKey:',
          socialKeys.followers()
        )
        queryClient.refetchQueries({ queryKey: socialKeys.followers() })
        break
      case 'explore':
        console.log(
          '🔍 [SocialClient] Fetching explore (useEffect), queryKey:',
          socialKeys.recommendations()
        )
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
