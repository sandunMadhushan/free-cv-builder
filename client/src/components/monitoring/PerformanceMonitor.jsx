import React, { useState, useEffect } from 'react';
import { performanceTracker, useMemoryMonitor } from '../utils/performanceOptimizations';
import { Button } from './common/Button';

export const PerformanceMonitor = ({
  isEnabled = process.env.NODE_ENV === 'development',
  showControls = false
}) => {
  const [metrics, setMetrics] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const memoryInfo = useMemoryMonitor();

  useEffect(() => {
    if (!isEnabled) return;

    const updateMetrics = () => {
      const currentMetrics = performanceTracker.getMetrics();
      const navigationTiming = performance.getEntriesByType('navigation')[0];
      const paintEntries = performance.getEntriesByType('paint');

      setMetrics({
        ...currentMetrics,
        navigation: navigationTiming ? {
          domContentLoaded: Math.round(navigationTiming.domContentLoadedEventEnd - navigationTiming.domContentLoadedEventStart),
          loadComplete: Math.round(navigationTiming.loadEventEnd - navigationTiming.loadEventStart),
          domInteractive: Math.round(navigationTiming.domInteractive - navigationTiming.fetchStart)
        } : null,
        paint: paintEntries.reduce((acc, entry) => {
          acc[entry.name] = Math.round(entry.startTime);
          return acc;
        }, {}),
        resourceCount: performance.getEntriesByType('resource').length
      });
    };

    updateMetrics();

    if (autoRefresh) {
      const interval = setInterval(updateMetrics, 2000);
      return () => clearInterval(interval);
    }
  }, [isEnabled, autoRefresh]);

  if (!isEnabled) return null;

  const getPerformanceScore = () => {
    if (!memoryInfo || !metrics.paint) return null;

    let score = 100;

    // Memory usage (30% weight)
    const memoryUsage = memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit;
    if (memoryUsage > 0.8) score -= 30;
    else if (memoryUsage > 0.6) score -= 15;
    else if (memoryUsage > 0.4) score -= 5;

    // First Contentful Paint (35% weight)
    if (metrics.paint['first-contentful-paint']) {
      const fcp = metrics.paint['first-contentful-paint'];
      if (fcp > 3000) score -= 35;
      else if (fcp > 2000) score -= 20;
      else if (fcp > 1000) score -= 10;
    }

    // Resource count (20% weight)
    if (metrics.resourceCount > 100) score -= 20;
    else if (metrics.resourceCount > 50) score -= 10;

    // Slow operations (15% weight)
    const slowOperations = Object.values(metrics).filter(
      metric => metric.duration && metric.duration > 100
    ).length;
    score -= slowOperations * 3;

    return Math.max(0, score);
  };

  const performanceScore = getPerformanceScore();

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-success-600';
    if (score >= 70) return 'text-warning-600';
    return 'text-danger-600';
  };

  const MetricCard = ({ title, value, unit = '', description, status = 'normal' }) => (
    <div className={`
      p-3 rounded-lg border
      ${status === 'warning' ? 'bg-warning-50 border-warning-200' :
        status === 'error' ? 'bg-danger-50 border-danger-200' :
        'bg-surface-50 border-surface-200'
      }
    `}>
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-surface-900">{title}</h4>
        <span className={`
          text-lg font-bold
          ${status === 'warning' ? 'text-warning-700' :
            status === 'error' ? 'text-danger-700' :
            'text-surface-900'
          }
        `}>
          {value}{unit}
        </span>
      </div>
      {description && (
        <p className="text-xs text-surface-600 mt-1">{description}</p>
      )}
    </div>
  );

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className={`
          w-12 h-12 rounded-full shadow-lg transition-all duration-200
          ${performanceScore !== null
            ? performanceScore >= 90 ? 'bg-success-600 hover:bg-success-700' :
              performanceScore >= 70 ? 'bg-warning-600 hover:bg-warning-700' :
              'bg-danger-600 hover:bg-danger-700'
            : 'bg-surface-600 hover:bg-surface-700'
          }
          text-white flex items-center justify-center
        `}
      >
        {performanceScore !== null ? (
          <span className="text-xs font-bold">{performanceScore}</span>
        ) : (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
      </button>

      {/* Performance Dashboard */}
      {isVisible && (
        <div className="absolute bottom-16 right-0 w-80 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-lg shadow-xl">
          {/* Header */}
          <div className="p-4 border-b border-surface-200 dark:border-surface-700">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-surface-900 dark:text-surface-100">
                Performance Monitor
              </h3>
              <div className="flex items-center space-x-2">
                {performanceScore !== null && (
                  <div className={`text-sm font-medium ${getScoreColor(performanceScore)}`}>
                    Score: {performanceScore}/100
                  </div>
                )}
                <button
                  onClick={() => setIsVisible(false)}
                  className="p-1 hover:bg-surface-100 dark:hover:bg-surface-700 rounded"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
            {/* Memory Information */}
            {memoryInfo && (
              <div>
                <h4 className="text-sm font-medium text-surface-900 dark:text-surface-100 mb-2">
                  Memory Usage
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  <MetricCard
                    title="Used Heap"
                    value={memoryInfo.usedJSHeapSize}
                    unit="MB"
                    status={memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit > 0.8 ? 'error' :
                           memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit > 0.6 ? 'warning' : 'normal'}
                  />
                  <MetricCard
                    title="Total Heap"
                    value={memoryInfo.totalJSHeapSize}
                    unit="MB"
                  />
                  <MetricCard
                    title="Heap Limit"
                    value={memoryInfo.jsHeapSizeLimit}
                    unit="MB"
                  />
                </div>
              </div>
            )}

            {/* Paint Metrics */}
            {metrics.paint && Object.keys(metrics.paint).length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-surface-900 dark:text-surface-100 mb-2">
                  Paint Timing
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {metrics.paint['first-paint'] && (
                    <MetricCard
                      title="First Paint"
                      value={metrics.paint['first-paint']}
                      unit="ms"
                      status={metrics.paint['first-paint'] > 2000 ? 'warning' : 'normal'}
                    />
                  )}
                  {metrics.paint['first-contentful-paint'] && (
                    <MetricCard
                      title="First Contentful Paint"
                      value={metrics.paint['first-contentful-paint']}
                      unit="ms"
                      status={metrics.paint['first-contentful-paint'] > 2000 ? 'error' :
                             metrics.paint['first-contentful-paint'] > 1000 ? 'warning' : 'normal'}
                    />
                  )}
                </div>
              </div>
            )}

            {/* Navigation Timing */}
            {metrics.navigation && (
              <div>
                <h4 className="text-sm font-medium text-surface-900 dark:text-surface-100 mb-2">
                  Navigation Timing
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  <MetricCard
                    title="DOM Interactive"
                    value={metrics.navigation.domInteractive}
                    unit="ms"
                  />
                  <MetricCard
                    title="DOM Content Loaded"
                    value={metrics.navigation.domContentLoaded}
                    unit="ms"
                  />
                  <MetricCard
                    title="Load Complete"
                    value={metrics.navigation.loadComplete}
                    unit="ms"
                  />
                </div>
              </div>
            )}

            {/* Resource Count */}
            {metrics.resourceCount !== undefined && (
              <MetricCard
                title="Total Resources"
                value={metrics.resourceCount}
                description="Number of resources loaded"
                status={metrics.resourceCount > 100 ? 'warning' : 'normal'}
              />
            )}

            {/* Component Render Times */}
            {Object.keys(metrics).some(key => key.endsWith('_render')) && (
              <div>
                <h4 className="text-sm font-medium text-surface-900 dark:text-surface-100 mb-2">
                  Component Render Times
                </h4>
                <div className="space-y-1 text-xs">
                  {Object.entries(metrics)
                    .filter(([key]) => key.endsWith('_render'))
                    .map(([key, metric]) => (
                      <div
                        key={key}
                        className={`
                          flex justify-between p-2 rounded
                          ${metric.duration > 100 ? 'bg-danger-50 text-danger-700' :
                            metric.duration > 50 ? 'bg-warning-50 text-warning-700' :
                            'bg-surface-50 text-surface-700'
                          }
                        `}
                      >
                        <span>{key.replace('_render', '')}</span>
                        <span className="font-mono">{metric.duration?.toFixed(1)}ms</span>
                      </div>
                    ))
                  }
                </div>
              </div>
            )}

            {/* Controls */}
            {showControls && (
              <div className="pt-3 border-t border-surface-200 dark:border-surface-700">
                <div className="flex items-center justify-between mb-3">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={autoRefresh}
                      onChange={(e) => setAutoRefresh(e.target.checked)}
                      className="rounded border-surface-300"
                    />
                    <span className="text-sm text-surface-700 dark:text-surface-300">
                      Auto refresh
                    </span>
                  </label>
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      performanceTracker.clear();
                      setMetrics({});
                    }}
                  >
                    Clear
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => console.log('Performance Metrics:', metrics)}
                  >
                    Log
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Performance-optimized route components
export const OptimizedRoutes = {
  // Code-split route components
  Dashboard: React.lazy(() => import('../pages/Dashboard')),
  TemplateCustomization: React.lazy(() => import('../pages/TemplateCustomization')),
  CVPreview: React.lazy(() => import('../pages/CVPreview')),
  ExportPage: React.lazy(() => import('../pages/ExportPage'))
};

// Performance context for sharing optimization settings
export const PerformanceContext = React.createContext({
  enableVirtualization: true,
  enableLazyLoading: true,
  optimizeImages: true,
  batchUpdates: true
});

export const PerformanceProvider = ({ children, settings = {} }) => {
  const defaultSettings = {
    enableVirtualization: true,
    enableLazyLoading: true,
    optimizeImages: true,
    batchUpdates: true,
    ...settings
  };

  return (
    <PerformanceContext.Provider value={defaultSettings}>
      {children}
    </PerformanceContext.Provider>
  );
};

export const usePerformanceSettings = () => {
  return React.useContext(PerformanceContext);
};