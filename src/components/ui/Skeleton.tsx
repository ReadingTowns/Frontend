const Skeleton = ({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
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
