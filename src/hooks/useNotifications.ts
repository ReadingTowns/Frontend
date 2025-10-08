import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  InfiniteData,
} from '@tanstack/react-query'
import {
  fetchNotifications,
  markNotificationAsRead,
  deleteNotificationById,
  deleteAllUserNotifications,
  FetchNotificationsParams,
} from '@/services/notificationService'
import { NotificationListResponse } from '@/types/notification'

// 알림 목록 조회 훅
export function useNotifications(params: FetchNotificationsParams = {}) {
  return useInfiniteQuery({
    queryKey: ['notifications', params.filter || 'all'],
    queryFn: ({ pageParam = null }) =>
      fetchNotifications({ ...params, cursor: pageParam }),
    getNextPageParam: lastPage => lastPage.result.nextCursor,
    staleTime: 1000 * 60, // 1분
    refetchOnWindowFocus: true,
    retry: 2,
    initialPageParam: null,
  })
}

// 알림 뮤테이션 훅
export function useNotificationMutations() {
  const queryClient = useQueryClient()

  const markAsRead = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      // 모든 알림 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
    onError: error => {
      console.error('알림 읽음 처리 실패:', error)
    },
  })

  const deleteNotification = useMutation({
    mutationFn: deleteNotificationById,
    onMutate: async notificationId => {
      // 낙관적 업데이트
      await queryClient.cancelQueries({ queryKey: ['notifications'] })

      const previousData = queryClient.getQueriesData({
        queryKey: ['notifications'],
      })

      // 캐시에서 알림 제거
      queryClient.setQueriesData(
        { queryKey: ['notifications'] },
        (oldData: InfiniteData<NotificationListResponse> | undefined) => {
          if (!oldData?.pages) return oldData

          return {
            ...oldData,
            pages: oldData.pages.map(page => ({
              ...page,
              result: {
                ...page.result,
                notifications: page.result.notifications.filter(
                  n => n.notificationId !== notificationId
                ),
                totalCount: page.result.totalCount - 1,
              },
            })),
          }
        }
      )

      return { previousData }
    },
    onError: (error, notificationId, context) => {
      // 에러 시 이전 데이터로 롤백
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
      console.error('알림 삭제 실패:', error)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })

  const deleteAllNotifications = useMutation({
    mutationFn: deleteAllUserNotifications,
    onSuccess: () => {
      // 모든 알림 캐시 초기화
      queryClient.setQueriesData(
        { queryKey: ['notifications'] },
        (oldData: InfiniteData<NotificationListResponse> | undefined) => ({
          ...oldData,
          pages: [
            {
              code: '1000',
              message: 'Success',
              result: {
                notifications: [],
                totalCount: 0,
                unreadCount: 0,
                hasNext: false,
                nextCursor: undefined,
              },
            },
          ],
        })
      )
    },
    onError: error => {
      console.error('알림 일괄 삭제 실패:', error)
    },
  })

  return {
    markAsRead,
    deleteNotification,
    deleteAllNotifications,
  }
}

// 읽지 않은 알림 수 조회 훅
export function useUnreadNotificationCount() {
  const { data } = useNotifications({ filter: 'unread', limit: 1 })

  return data?.pages?.[0]?.result?.unreadCount || 0
}
