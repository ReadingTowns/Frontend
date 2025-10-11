'use client'

import { useState, useEffect } from 'react'
import { useHeader } from '@/contexts/HeaderContext'
import SocialTabs from './components/SocialTabs'
import MessagesTab from './components/MessagesTab'
import FollowingTab from './components/FollowingTab'
import ExploreTab from './components/ExploreTab'
import type { SocialTab } from '@/types/social'

export default function SocialClient() {
  const [activeTab, setActiveTab] = useState<SocialTab>('messages')
  const { setHeaderContent } = useHeader()

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
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      <SocialTabs activeTab={activeTab} onTabChange={handleTabChange} />

      {activeTab === 'messages' && <MessagesTab />}
      {activeTab === 'following' && <FollowingTab />}
      {activeTab === 'explore' && <ExploreTab />}
    </div>
  )
}

SocialClient.displayName = 'SocialClient'
