interface PageSkeletonProps {
  variant?: 'cards' | 'table' | 'form';
}

const shimmer =
  'animate-pulse rounded-xl bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200';

const PageSkeleton = ({ variant = 'cards' }: PageSkeletonProps) => {
  if (variant === 'table') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className={`${shimmer} h-10 w-72`} />
          <div className={`${shimmer} h-12 w-36`} />
        </div>
        <div className="bg-white rounded-xl p-6 space-y-5">
          <div className={`${shimmer} h-12 w-full`} />
          <div className="space-y-3">
            {[...Array(6)].map((_, idx) => (
              <div key={idx} className={`${shimmer} h-14 w-full`} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'form') {
    return (
      <div className="space-y-6">
        <div className={`${shimmer} h-10 w-72`} />
        <div className="bg-white rounded-xl p-6 space-y-4">
          {[...Array(6)].map((_, idx) => (
            <div key={idx} className={`${shimmer} h-14 w-full`} />
          ))}
          <div className={`${shimmer} h-12 w-56`} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className={`${shimmer} h-10 w-72`} />
        <div className={`${shimmer} h-14 w-56`} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, idx) => (
          <div key={idx} className={`${shimmer} h-32 w-full`} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`${shimmer} h-72 w-full`} />
        <div className={`${shimmer} h-72 w-full`} />
      </div>
    </div>
  );
};

export default PageSkeleton;
