import React, { useState, useEffect } from 'react';
import { useScreenReader } from '../../utils/accessibilityUtils';

/**
 * Professional Loading Screen with Corporate Branding
 */
export const ProfessionalLoader = ({
  variant = 'default',
  size = 'md',
  message = 'Loading...',
  progress = null,
  showLogo = false,
  className = ''
}) => {
  const { announce } = useScreenReader();

  useEffect(() => {
    announce(`Loading: ${message}`, 'polite');
  }, [message, announce]);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  const LoaderVariants = {
    default: () => (
      <div className={`animate-spin rounded-full border-4 border-primary-200 border-t-primary-600 ${sizeClasses[size]}`} />
    ),

    corporate: () => (
      <div className="relative">
        <div className={`animate-spin rounded-full border-4 border-gradient-to-r from-primary-500 to-secondary-500 ${sizeClasses[size]}`} />
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-100 to-secondary-100 opacity-20 animate-pulse" />
      </div>
    ),

    dots: () => (
      <div className="flex space-x-2">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="w-3 h-3 rounded-full bg-primary-600 animate-bounce"
            style={{
              animationDelay: `${i * 0.1}s`,
              animationDuration: '0.6s'
            }}
          />
        ))}
      </div>
    ),

    pulse: () => (
      <div className={`rounded-full bg-primary-600 opacity-75 animate-pulse ${sizeClasses[size]}`} />
    ),

    skeleton: ({ width = '100%', height = '20px', lines = 3 }) => (
      <div className="space-y-3" style={{ width }}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="bg-gradient-to-r from-surface-200 via-surface-300 to-surface-200 rounded animate-pulse"
            style={{
              height: typeof height === 'string' ? height : `${height}px`,
              width: i === lines - 1 ? '75%' : '100%'
            }}
          />
        ))}
      </div>
    )
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      {showLogo && (
        <div className="mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" />
            </svg>
          </div>
        </div>
      )}

      <div className="flex items-center justify-center">
        {LoaderVariants[variant]()}
      </div>

      <div className="text-center space-y-2">
        <p className="text-surface-700 dark:text-surface-300 font-medium">
          {message}
        </p>

        {progress !== null && (
          <div className="w-64">
            <div className="flex justify-between text-xs text-surface-600 dark:text-surface-400 mb-1">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Full Screen Professional Loading Overlay
 */
export const LoadingOverlay = ({
  isVisible = false,
  message = 'Processing your request...',
  submessage = '',
  progress = null,
  variant = 'corporate',
  backdrop = 'blur'
}) => {
  if (!isVisible) return null;

  const backdropClasses = {
    blur: 'backdrop-blur-sm bg-white/80 dark:bg-surface-900/80',
    solid: 'bg-white dark:bg-surface-900',
    transparent: 'bg-surface-900/20 dark:bg-surface-100/20'
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${backdropClasses[backdrop]}`}
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <div className="max-w-md mx-4 p-8 bg-white dark:bg-surface-800 rounded-xl shadow-2xl border border-surface-200 dark:border-surface-700">
        <ProfessionalLoader
          variant={variant}
          size="lg"
          message={message}
          progress={progress}
          showLogo={true}
        />

        {submessage && (
          <p className="mt-4 text-sm text-surface-600 dark:text-surface-400 text-center">
            {submessage}
          </p>
        )}
      </div>
    </div>
  );
};

/**
 * Professional Success State Component
 */
export const SuccessState = ({
  title = 'Success!',
  message = 'Your action was completed successfully.',
  action,
  actionLabel = 'Continue',
  onAction,
  autoHide = 0,
  onClose,
  variant = 'default'
}) => {
  const { announce } = useScreenReader();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    announce(`Success: ${title}. ${message}`, 'polite');

    if (autoHide > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, autoHide);
      return () => clearTimeout(timer);
    }
  }, [title, message, autoHide, onClose, announce]);

  if (!isVisible) return null;

  const variants = {
    default: {
      container: 'bg-success-50 dark:bg-success-900/20 border-success-200 dark:border-success-800',
      icon: 'text-success-600 dark:text-success-400',
      title: 'text-success-900 dark:text-success-100',
      message: 'text-success-800 dark:text-success-200'
    },
    corporate: {
      container: 'bg-gradient-to-r from-success-50 to-primary-50 dark:from-success-900/20 dark:to-primary-900/20 border-success-200 dark:border-success-800',
      icon: 'text-success-600 dark:text-success-400',
      title: 'text-surface-900 dark:text-surface-100',
      message: 'text-surface-700 dark:text-surface-300'
    },
    minimal: {
      container: 'bg-white dark:bg-surface-800 border-surface-200 dark:border-surface-700',
      icon: 'text-success-500',
      title: 'text-surface-900 dark:text-surface-100',
      message: 'text-surface-600 dark:text-surface-400'
    }
  };

  const currentVariant = variants[variant];

  return (
    <div className={`p-6 rounded-lg border animate-in slide-in-from-bottom-4 fade-in duration-300 ${currentVariant.container}`}>
      <div className="flex items-start">
        {/* Success Icon */}
        <div className="flex-shrink-0">
          <div className={`w-8 h-8 rounded-full bg-success-500 flex items-center justify-center animate-in zoom-in duration-300 delay-100`}>
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <div className="ml-4 flex-1">
          <h3 className={`text-lg font-semibold ${currentVariant.title}`}>
            {title}
          </h3>
          <p className={`mt-1 text-sm ${currentVariant.message}`}>
            {message}
          </p>

          {(action || actionLabel) && (
            <div className="mt-4">
              <button
                onClick={onAction}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-success-600 hover:bg-success-700 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-success-500 focus:ring-offset-2"
              >
                {actionLabel}
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 ml-4 text-success-400 hover:text-success-600 transition-colors duration-200"
            aria-label="Dismiss success message"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

/**
 * Professional Progress Indicator
 */
export const ProgressIndicator = ({
  steps,
  currentStep = 0,
  variant = 'horizontal',
  showLabels = true,
  className = ''
}) => {
  const { announce } = useScreenReader();

  useEffect(() => {
    const step = steps[currentStep];
    if (step) {
      announce(`Step ${currentStep + 1} of ${steps.length}: ${step.label}`, 'polite');
    }
  }, [currentStep, steps, announce]);

  const Step = ({ step, index, isActive, isCompleted }) => {
    const stepClasses = `
      flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-200
      ${isCompleted
        ? 'bg-success-600 border-success-600 text-white'
        : isActive
        ? 'bg-primary-600 border-primary-600 text-white'
        : 'bg-white dark:bg-surface-800 border-surface-300 dark:border-surface-600 text-surface-500 dark:text-surface-400'
      }
    `;

    return (
      <div className="flex items-center">
        <div
          className={stepClasses}
          aria-label={`Step ${index + 1}: ${step.label}`}
          aria-current={isActive ? 'step' : undefined}
        >
          {isCompleted ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <span className="text-sm font-medium">{index + 1}</span>
          )}
        </div>

        {showLabels && (
          <div className="ml-3">
            <p className={`text-sm font-medium ${
              isActive ? 'text-primary-600 dark:text-primary-400' : 'text-surface-900 dark:text-surface-100'
            }`}>
              {step.label}
            </p>
            {step.description && (
              <p className="text-xs text-surface-600 dark:text-surface-400">
                {step.description}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  if (variant === 'horizontal') {
    return (
      <nav aria-label="Progress" className={className}>
        <ol className="flex items-center space-x-8">
          {steps.map((step, index) => (
            <li key={index} className="flex items-center">
              <Step
                step={step}
                index={index}
                isActive={index === currentStep}
                isCompleted={index < currentStep}
              />
              {index < steps.length - 1 && (
                <div className={`ml-8 w-16 h-0.5 ${
                  index < currentStep ? 'bg-success-600' : 'bg-surface-300 dark:bg-surface-600'
                }`} />
              )}
            </li>
          ))}
        </ol>
      </nav>
    );
  }

  // Vertical variant
  return (
    <nav aria-label="Progress" className={className}>
      <ol className="space-y-4">
        {steps.map((step, index) => (
          <li key={index}>
            <Step
              step={step}
              index={index}
              isActive={index === currentStep}
              isCompleted={index < currentStep}
            />
            {index < steps.length - 1 && (
              <div className={`ml-4 w-0.5 h-8 mt-2 ${
                index < currentStep ? 'bg-success-600' : 'bg-surface-300 dark:bg-surface-600'
              }`} />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

/**
 * Professional Skeleton Loader
 */
export const SkeletonLoader = ({
  variant = 'text',
  width = '100%',
  height = '1rem',
  lines = 3,
  className = ''
}) => {
  const baseClasses = 'animate-pulse bg-gradient-to-r from-surface-200 via-surface-300 to-surface-200 dark:from-surface-700 dark:via-surface-600 dark:to-surface-700 rounded';

  const variants = {
    text: () => (
      <div className={`space-y-3 ${className}`} style={{ width }}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={baseClasses}
            style={{
              height,
              width: i === lines - 1 ? '75%' : '100%'
            }}
          />
        ))}
      </div>
    ),

    card: () => (
      <div className={`p-4 ${className}`} style={{ width }}>
        <div className={`${baseClasses} w-full mb-3`} style={{ height: '200px' }} />
        <div className={`${baseClasses} w-3/4 mb-2`} style={{ height: '1rem' }} />
        <div className={`${baseClasses} w-1/2`} style={{ height: '0.75rem' }} />
      </div>
    ),

    avatar: () => (
      <div className={`flex items-center space-x-3 ${className}`}>
        <div className={`${baseClasses} rounded-full`} style={{ width: height, height }} />
        <div className="flex-1 space-y-2">
          <div className={baseClasses} style={{ height: '1rem', width: '75%' }} />
          <div className={baseClasses} style={{ height: '0.75rem', width: '50%' }} />
        </div>
      </div>
    )
  };

  return variants[variant]();
};

/**
 * Professional Save Status Indicator
 */
export const SaveStatus = ({
  status = 'saved', // 'saving', 'saved', 'error', 'offline'
  lastSaved = null,
  className = ''
}) => {
  const { announce } = useScreenReader();

  useEffect(() => {
    const messages = {
      saving: 'Saving changes...',
      saved: 'All changes saved',
      error: 'Error saving changes',
      offline: 'Working offline'
    };
    announce(messages[status], 'polite');
  }, [status, announce]);

  const statusConfig = {
    saving: {
      icon: (
        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ),
      text: 'Saving...',
      color: 'text-warning-600 dark:text-warning-400'
    },
    saved: {
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
      text: 'Saved',
      color: 'text-success-600 dark:text-success-400'
    },
    error: {
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      ),
      text: 'Error saving',
      color: 'text-danger-600 dark:text-danger-400'
    },
    offline: {
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 109.75 9.75 9.75 9.75 0 00-9.75-9.75z" />
        </svg>
      ),
      text: 'Offline',
      color: 'text-surface-500 dark:text-surface-400'
    }
  };

  const config = statusConfig[status];

  return (
    <div className={`flex items-center space-x-2 text-xs ${config.color} ${className}`}>
      {config.icon}
      <span>{config.text}</span>
      {lastSaved && status === 'saved' && (
        <span className="text-surface-500 dark:text-surface-400">
          • {new Date(lastSaved).toLocaleTimeString()}
        </span>
      )}
    </div>
  );
};