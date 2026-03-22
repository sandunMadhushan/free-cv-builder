import React from 'react';

export const Skeleton = ({
  variant = 'rectangular',
  width = '100%',
  height = '1rem',
  className = '',
  animate = true,
  count = 1,
  ...props
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'circular':
        return 'rounded-full aspect-square';
      case 'text':
        return 'rounded h-4';
      case 'avatar':
        return 'rounded-full w-10 h-10';
      case 'button':
        return 'rounded-md h-10';
      case 'card':
        return 'rounded-lg';
      default:
        return 'rounded';
    }
  };

  const skeletonClasses = `
    bg-surface-200 dark:bg-surface-700
    ${getVariantClasses()}
    ${animate ? 'loading-corporate' : ''}
    ${className}
  `;

  const skeletonStyle = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  if (count > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: count }, (_, index) => (
          <div
            key={index}
            className={skeletonClasses}
            style={skeletonStyle}
            {...props}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={skeletonClasses}
      style={skeletonStyle}
      {...props}
    />
  );
};

export const SkeletonGroup = ({ children, loading, fallback, className = '' }) => {
  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        {fallback}
      </div>
    );
  }

  return children;
};

// Pre-built skeleton patterns for common use cases
export const FormFieldSkeleton = ({ showLabel = true }) => (
  <div className="space-y-2">
    {showLabel && <Skeleton variant="text" width="30%" height="0.875rem" />}
    <Skeleton variant="rectangular" height="2.5rem" />
  </div>
);

export const CardSkeleton = ({ showTitle = true, lines = 3 }) => (
  <div className="space-y-3">
    {showTitle && <Skeleton variant="text" width="60%" height="1.25rem" />}
    <div className="space-y-2">
      {Array.from({ length: lines }, (_, index) => (
        <Skeleton
          key={index}
          variant="text"
          width={index === lines - 1 ? "75%" : "100%"}
        />
      ))}
    </div>
  </div>
);

export const ProfileSkeleton = () => (
  <div className="flex items-center space-x-4">
    <Skeleton variant="avatar" />
    <div className="space-y-2 flex-1">
      <Skeleton variant="text" width="40%" height="1rem" />
      <Skeleton variant="text" width="60%" height="0.875rem" />
    </div>
  </div>
);

export const ButtonSkeleton = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-8 w-20',
    md: 'h-10 w-24',
    lg: 'h-12 w-28'
  };

  return <Skeleton variant="button" className={sizeClasses[size]} />;
};

export const TableRowSkeleton = ({ columns = 4 }) => (
  <div className="flex space-x-4 py-3">
    {Array.from({ length: columns }, (_, index) => (
      <Skeleton
        key={index}
        variant="text"
        className="flex-1"
        height="1rem"
      />
    ))}
  </div>
);

export const CVPreviewSkeleton = () => (
  <div className="space-y-6 p-6 bg-white dark:bg-surface-800 rounded-lg shadow-lg max-w-2xl mx-auto">
    {/* Header Section */}
    <div className="border-b border-surface-200 dark:border-surface-600 pb-4">
      <Skeleton variant="text" width="50%" height="2rem" className="mb-2" />
      <Skeleton variant="text" width="70%" height="1rem" className="mb-1" />
      <Skeleton variant="text" width="60%" height="1rem" />
    </div>

    {/* Profile Section */}
    <div className="space-y-3">
      <Skeleton variant="text" width="25%" height="1.25rem" />
      <div className="space-y-2">
        <Skeleton variant="text" count={3} />
      </div>
    </div>

    {/* Experience Section */}
    <div className="space-y-3">
      <Skeleton variant="text" width="30%" height="1.25rem" />
      <div className="space-y-4">
        {Array.from({ length: 2 }, (_, index) => (
          <div key={index} className="border-l-2 border-surface-200 dark:border-surface-600 pl-4">
            <Skeleton variant="text" width="60%" height="1rem" className="mb-2" />
            <Skeleton variant="text" width="80%" height="0.875rem" className="mb-2" />
            <div className="space-y-1">
              <Skeleton variant="text" count={2} />
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Skills Section */}
    <div className="space-y-3">
      <Skeleton variant="text" width="20%" height="1.25rem" />
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton
            key={index}
            variant="rectangular"
            width="80px"
            height="1.5rem"
            className="rounded-full"
          />
        ))}
      </div>
    </div>
  </div>
);

export const FormSectionSkeleton = ({ fields = 3, title = true }) => (
  <div className="space-y-4">
    {title && (
      <div className="border-b border-surface-200 dark:border-surface-600 pb-2">
        <Skeleton variant="text" width="40%" height="1.5rem" />
      </div>
    )}
    <div className="space-y-4">
      {Array.from({ length: fields }, (_, index) => (
        <FormFieldSkeleton key={index} />
      ))}
    </div>
  </div>
);