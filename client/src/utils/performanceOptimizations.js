import React, { Suspense, lazy, memo, useMemo, useCallback } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

/**
 * Performance optimization utilities for the CV Builder application
 */

// Lazy loading components for code splitting
export const LazyComponents = {
  // Advanced form components (only load when needed)
  RichTextEditor: lazy(() =>
    import('../common/AdvancedFormComponents').then(module => ({
      default: module.RichTextEditor
    }))
  ),

  Select: lazy(() =>
    import('../common/AdvancedFormComponents').then(module => ({
      default: module.Select
    }))
  ),

  DatePicker: lazy(() =>
    import('../common/AdvancedFormComponents2').then(module => ({
      default: module.DatePicker
    }))
  ),

  FileUpload: lazy(() =>
    import('../common/AdvancedFormComponents2').then(module => ({
      default: module.FileUpload
    }))
  ),

  // Enhanced template selector (heavy component)
  EnhancedTemplateSelector: lazy(() =>
    import('../customization/EnhancedTemplateSelector')
  ),

  // Professional export modal (heavy component with PDF generation)
  ProfessionalExportModal: lazy(() =>
    import('../export/ProfessionalExportModal')
  ),

  // Skeleton components for loading states
  Skeleton: lazy(() =>
    import('../common/Skeleton').then(module => ({
      default: module.Skeleton
    }))
  )
};

/**
 * Suspense wrapper with professional loading states
 */
export const SuspenseWrapper = memo(({
  children,
  fallback = null,
  errorFallback = null,
  onError = null
}) => {
  const defaultFallback = (
    <div className="flex items-center justify-center p-8">
      <div className="loading-corporate w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full"></div>
      <span className="ml-3 text-surface-600 dark:text-surface-400">Loading...</span>
    </div>
  );

  const defaultErrorFallback = ({ error, resetErrorBoundary }) => (
    <div className="p-6 bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 rounded-lg">
      <h3 className="font-medium text-danger-900 dark:text-danger-100 mb-2">
        Something went wrong
      </h3>
      <p className="text-sm text-danger-800 dark:text-danger-200 mb-4">
        {error.message}
      </p>
      <button
        onClick={resetErrorBoundary}
        className="px-3 py-1.5 text-sm bg-danger-600 text-white rounded hover:bg-danger-700 transition-colors"
      >
        Try again
      </button>
    </div>
  );

  return (
    <ErrorBoundary
      FallbackComponent={errorFallback || defaultErrorFallback}
      onError={onError}
    >
      <Suspense fallback={fallback || defaultFallback}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
});

/**
 * Performance monitoring hook
 */
export const usePerformanceMonitor = (componentName) => {
  const startTime = useMemo(() => performance.now(), []);

  React.useEffect(() => {
    const endTime = performance.now();
    const renderTime = endTime - startTime;

    if (renderTime > 100) {
      console.warn(`${componentName} took ${renderTime.toFixed(2)}ms to render`);
    }

    // Track performance metrics
    if (window.gtag) {
      window.gtag('event', 'performance_timing', {
        component: componentName,
        render_time: Math.round(renderTime),
        slow_render: renderTime > 100
      });
    }
  });

  return { startTime };
};

/**
 * Optimized CV Data Hook with memoization
 */
export const useOptimizedCVData = (cvStore) => {
  return useMemo(() => {
    const data = cvStore.cvData;

    // Only recompute when actual data changes, not store references
    return {
      personalInfo: data.personalInfo,
      profile: data.profile,
      experience: data.experience,
      education: data.education,
      skills: data.skills,
      projects: data.projects,
      certifications: data.certifications,
      languages: data.languages,
      // Computed properties for performance
      hasExperience: Boolean(data.experience?.length),
      hasEducation: Boolean(data.education?.length),
      hasSkills: Boolean(
        data.skills?.technical?.length ||
        data.skills?.tools?.length ||
        data.skills?.soft?.length
      ),
      completionPercentage: calculateCompletionPercentage(data)
    };
  }, [
    cvStore.cvData.personalInfo,
    cvStore.cvData.profile,
    cvStore.cvData.experience,
    cvStore.cvData.education,
    cvStore.cvData.skills,
    cvStore.cvData.projects,
    cvStore.cvData.certifications,
    cvStore.cvData.languages
  ]);
};

/**
 * Calculate CV completion percentage (memoized)
 */
const calculateCompletionPercentage = (cvData) => {
  const sections = [
    { key: 'personalInfo', weight: 25, check: () =>
      cvData.personalInfo?.fullName && cvData.personalInfo?.email
    },
    { key: 'profile', weight: 15, check: () =>
      cvData.profile?.summary && cvData.profile.summary.trim().length > 50
    },
    { key: 'experience', weight: 30, check: () =>
      cvData.experience?.length > 0
    },
    { key: 'education', weight: 15, check: () =>
      cvData.education?.length > 0
    },
    { key: 'skills', weight: 15, check: () =>
      cvData.skills?.technical?.length > 0 || cvData.skills?.tools?.length > 0
    }
  ];

  const completedWeight = sections.reduce((total, section) => {
    return total + (section.check() ? section.weight : 0);
  }, 0);

  return Math.round(completedWeight);
};

/**
 * Debounced auto-save hook
 */
export const useDebouncedAutoSave = (saveFunction, delay = 1000) => {
  const timeoutRef = React.useRef(null);

  const debouncedSave = useCallback((...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      saveFunction(...args);
    }, delay);
  }, [saveFunction, delay]);

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedSave;
};

/**
 * Virtual list component for large datasets
 */
export const VirtualizedList = memo(({
  items = [],
  itemHeight = 60,
  containerHeight = 400,
  renderItem,
  overscan = 3
}) => {
  const [scrollTop, setScrollTop] = React.useState(0);
  const scrollElementRef = React.useRef(null);

  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / itemHeight) + overscan,
    items.length
  );

  const visibleItems = items.slice(visibleStart, visibleEnd);

  const handleScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop);
  }, []);

  return (
    <div
      ref={scrollElementRef}
      className="overflow-auto custom-scrollbar"
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: items.length * itemHeight, position: 'relative' }}>
        {visibleItems.map((item, index) => (
          <div
            key={visibleStart + index}
            style={{
              position: 'absolute',
              top: (visibleStart + index) * itemHeight,
              left: 0,
              right: 0,
              height: itemHeight
            }}
          >
            {renderItem(item, visibleStart + index)}
          </div>
        ))}
      </div>
    </div>
  );
});

/**
 * Image lazy loading component
 */
export const LazyImage = memo(({
  src,
  alt,
  className = '',
  placeholder = null,
  onLoad = null,
  onError = null
}) => {
  const [loaded, setLoaded] = React.useState(false);
  const [error, setError] = React.useState(false);
  const imgRef = React.useRef(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && imgRef.current) {
          const img = imgRef.current;
          img.src = src;

          img.onload = () => {
            setLoaded(true);
            onLoad?.();
          };

          img.onerror = () => {
            setError(true);
            onError?.();
          };

          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [src, onLoad, onError]);

  if (error) {
    return (
      <div className={`bg-surface-200 dark:bg-surface-700 flex items-center justify-center ${className}`}>
        <svg className="w-6 h-6 text-surface-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
        </svg>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <img
        ref={imgRef}
        alt={alt}
        className={`
          transition-opacity duration-200
          ${loaded ? 'opacity-100' : 'opacity-0'}
          ${className}
        `}
      />
      {!loaded && (placeholder || (
        <div className="absolute inset-0 bg-surface-200 dark:bg-surface-700 loading-corporate"></div>
      ))}
    </div>
  );
});

/**
 * Performance analytics tracker
 */
export class PerformanceTracker {
  constructor() {
    this.metrics = new Map();
    this.observers = new Map();
  }

  startTiming(label) {
    this.metrics.set(label, {
      start: performance.now(),
      end: null,
      duration: null
    });
  }

  endTiming(label) {
    const metric = this.metrics.get(label);
    if (metric) {
      metric.end = performance.now();
      metric.duration = metric.end - metric.start;

      // Log slow operations
      if (metric.duration > 100) {
        console.warn(`Slow operation "${label}": ${metric.duration.toFixed(2)}ms`);
      }

      return metric.duration;
    }
    return null;
  }

  trackComponentRender(componentName, renderFunction) {
    return (...args) => {
      this.startTiming(`${componentName}_render`);
      const result = renderFunction(...args);
      this.endTiming(`${componentName}_render`);
      return result;
    };
  }

  observeElementPerformance(element, callback) {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach(callback);
    });

    observer.observe({ entryTypes: ['measure', 'paint', 'layout-shift'] });
    this.observers.set(element, observer);

    return () => {
      observer.disconnect();
      this.observers.delete(element);
    };
  }

  getMetrics() {
    return Object.fromEntries(this.metrics);
  }

  clear() {
    this.metrics.clear();
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
  }
}

// Global performance tracker instance
export const performanceTracker = new PerformanceTracker();

/**
 * HOC for performance monitoring
 */
export const withPerformanceMonitoring = (WrappedComponent, componentName) => {
  const MemoizedComponent = memo(WrappedComponent);

  return React.forwardRef((props, ref) => {
    usePerformanceMonitor(componentName);

    return <MemoizedComponent ref={ref} {...props} />;
  });
};

/**
 * Bundle analyzer utility (for development)
 */
export const analyzeBundleSize = async () => {
  if (process.env.NODE_ENV !== 'development') {
    console.warn('Bundle analysis is only available in development mode');
    return;
  }

  try {
    const { default: analyzer } = await import('webpack-bundle-analyzer');
    // Implementation would depend on your build setup
    console.log('Bundle analysis started...');
  } catch (error) {
    console.warn('Bundle analyzer not available:', error.message);
  }
};

/**
 * Memory usage monitor
 */
export const useMemoryMonitor = () => {
  const [memoryInfo, setMemoryInfo] = React.useState(null);

  React.useEffect(() => {
    const updateMemoryInfo = () => {
      if (performance.memory) {
        setMemoryInfo({
          usedJSHeapSize: Math.round(performance.memory.usedJSHeapSize / 1048576), // MB
          totalJSHeapSize: Math.round(performance.memory.totalJSHeapSize / 1048576), // MB
          jsHeapSizeLimit: Math.round(performance.memory.jsHeapSizeLimit / 1048576) // MB
        });
      }
    };

    updateMemoryInfo();
    const interval = setInterval(updateMemoryInfo, 5000);

    return () => clearInterval(interval);
  }, []);

  return memoryInfo;
};

/**
 * Component render count tracker (development only)
 */
export const useRenderCount = (componentName) => {
  const renderCount = React.useRef(0);

  if (process.env.NODE_ENV === 'development') {
    renderCount.current++;
    console.log(`${componentName} rendered ${renderCount.current} times`);
  }

  return renderCount.current;
};