'use client'

import { useState, useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useHeader } from '@/contexts/HeaderContext'
import SocialTabs from './components/SocialTabs'
import MessagesTab from './components/MessagesTab'
import FollowingTab from './components/FollowingTab'
import FollowersTab from './components/FollowersTab'
import ExploreTab from './components/ExploreTab'
import { socialKeys } from '@/types/social'
import type { SocialTab } from '@/types/social'

export default function SocialClient() {
  const [activeTab, setActiveTab] = useState<SocialTab>('messages')
  const { setHeaderContent } = useHeader()
  const queryClient = useQueryClient()

  useEffect(() => {
    setHeaderContent(
      <header>
        <h1 className="text-2xl font-bold">소셜</h1>
        <p className="text-sm text-gray-600 mt-1">이웃과 소통하세요</p>
      </header>
    )

    return () => {
      setHeaderContent(null)
    }
  }, [setHeaderContent])

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
    </div>
  )
}

SocialClient.displayName = 'SocialClient'
