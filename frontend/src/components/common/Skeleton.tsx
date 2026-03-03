import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  shimmer?: boolean;
  style?: React.CSSProperties;
}

export const Skeleton = ({ className = '', shimmer = true, style }: SkeletonProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`${shimmer ? 'skeleton-shimmer' : 'skeleton'} ${className}`}
      style={style}
    />
  );
};

export const SkeletonCard = () => (
  <div className="glass rounded-2xl p-6 space-y-4">
    <Skeleton className="h-6 w-3/4 rounded" />
    <Skeleton className="h-4 w-full rounded" />
    <Skeleton className="h-4 w-5/6 rounded" />
    <div className="flex gap-2 mt-4">
      <Skeleton className="h-10 w-24 rounded-lg" />
      <Skeleton className="h-10 w-24 rounded-lg" />
    </div>
  </div>
);

export const SkeletonTable = ({ rows = 5 }: { rows?: number }) => (
  <div className="glass rounded-2xl p-6 space-y-3">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex gap-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/3 rounded" />
          <Skeleton className="h-3 w-1/2 rounded" />
        </div>
        <Skeleton className="h-8 w-20 rounded-lg" />
      </div>
    ))}
  </div>
);

export const SkeletonChart = () => (
  <div className="glass rounded-2xl p-6 space-y-4">
    <Skeleton className="h-6 w-1/2 rounded" />
    <div className="space-y-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-end gap-2">
          <Skeleton className={`w-8 rounded-t`} style={{ height: `${Math.random() * 100 + 20}px` }} />
        </div>
      ))}
    </div>
  </div>
);
