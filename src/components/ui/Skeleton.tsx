interface SkeletonProps {
  className?: string
}

export const Skeleton = ({ className = '' }: SkeletonProps) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
)

export const BookCardSkeleton = () => (
  <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
    <Skeleton className="w-full h-32 mb-3" />
    <Skeleton className="h-4 mb-2" />
    <Skeleton className="h-3" />
  </div>
)

export const ProfileSkeleton = () => (
  <div className="bg-white rounded-lg p-4 border border-gray-200">
    <div className="flex items-center gap-4 mb-4">
      <Skeleton className="w-16 h-16 rounded-full" />
      <div className="flex-1">
        <Skeleton className="h-5 w-24 mb-2" />
        <Skeleton className="h-4 w-32 mb-1" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  </div>
)

export const HeaderSkeleton = () => (
  <div className="mb-6">
    <Skeleton className="h-6 w-20 mb-4" />
    <Skeleton className="h-8 w-32 mb-2" />
    <Skeleton className="h-4 w-48" />
  </div>
)

export const LibraryStatsSkeleton = () => (
  <div className="bg-white rounded-lg p-4 border border-gray-200 mb-6">
    <div className="flex items-center justify-between mb-4">
      <Skeleton className="h-6 w-20" />
      <Skeleton className="h-5 w-12" />
    </div>
    <div className="grid grid-cols-2 gap-4 mb-4">
      <div className="text-center">
        <Skeleton className="h-8 w-8 mx-auto mb-1" />
        <Skeleton className="h-4 w-16 mx-auto" />
      </div>
      <div className="text-center">
        <Skeleton className="h-8 w-8 mx-auto mb-1" />
        <Skeleton className="h-4 w-12 mx-auto" />
      </div>
    </div>
    <div className="mb-4">
      <Skeleton className="h-4 w-24 mb-2" />
      <Skeleton className="h-2 w-full" />
    </div>
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-12" />
      </div>
      <Skeleton className="h-4 w-16" />
    </div>
  </div>
)
