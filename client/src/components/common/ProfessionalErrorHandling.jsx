import React, { Component, useState, useEffect, useRef, createContext, useContext } from 'react';
import { useScreenReader } from '../../utils/accessibilityUtils';

/**
 * Professional Error Context for Global State Management
 */
const ErrorContext = createContext();

export const ErrorProvider = ({ children }) => {
  const [errors, setErrors] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const addError = (error) => {
    const errorId = Date.now() + Math.random();
    const newError = {
      id: errorId,
      timestamp: new Date(),
      ...error
    };
    setErrors(prev => [...prev, newError]);
    return errorId;
  };

  const removeError = (errorId) => {
    setErrors(prev => prev.filter(err => err.id !== errorId));
  };

  const addNotification = (notification) => {
    const notificationId = Date.now() + Math.random();
    const newNotification = {
      id: notificationId,
      timestamp: new Date(),
      ...notification
    };
    setNotifications(prev => [...prev, newNotification]);
    return notificationId;
  };

  const removeNotification = (notificationId) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
  };

  const clearAll = () => {
    setErrors([]);
    setNotifications([]);
  };

  return (
    <ErrorContext.Provider value={{
      errors,
      notifications,
      addError,
      removeError,
      addNotification,
      removeNotification,
      clearAll
    }}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useErrorHandler = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useErrorHandler must be used within ErrorProvider');
  }
  return context;
};

/**
 * Professional Error Boundary Component
 */
export class ProfessionalErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
      errorId: Date.now().toString()
    };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo,
      hasError: true
    });

    // Log error to external service in production
    if (process.env.NODE_ENV === 'production') {
      this.logErrorToService(error, errorInfo);
    }

    // Announce error to screen reader
    setTimeout(() => {
      const announcement = `An error occurred: ${error.message}. Please try refreshing the page or contact support.`;
      const event = new CustomEvent('announce-error', { detail: announcement });
      window.dispatchEvent(event);
    }, 100);
  }

  logErrorToService = (error, errorInfo) => {
    // Implement your error logging service here
    console.error('Error logged to service:', {
      error: error.toString(),
      errorInfo,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    });
  };

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    });
  };

  handleReportError = () => {
    const errorReport = {
      error: this.state.error?.toString(),
      stack: this.state.error?.stack,
      componentStack: this.state.errorInfo?.componentStack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    // Copy to clipboard or send to support
    navigator.clipboard?.writeText(JSON.stringify(errorReport, null, 2));
    alert('Error details copied to clipboard. Please send this to our support team.');
  };

  render() {
    if (this.state.hasError) {
      const { fallback: Fallback } = this.props;

      if (Fallback) {
        return (
          <Fallback
            error={this.state.error}
            errorInfo={this.state.errorInfo}
            onRetry={this.handleRetry}
            onReport={this.handleReportError}
          />
        );
      }

      return (
        <ProfessionalErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          errorId={this.state.errorId}
          onRetry={this.handleRetry}
          onReport={this.handleReportError}
        />
      );
    }

    return this.props.children;
  }
}

/**
 * Professional Error Fallback UI
 */
const ProfessionalErrorFallback = ({
  error,
  errorInfo,
  errorId,
  onRetry,
  onReport,
  variant = 'full'
}) => {
  const variants = {
    full: (
      <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-900 p-4">
        <div className="max-w-md w-full bg-white dark:bg-surface-800 rounded-lg shadow-xl border border-surface-200 dark:border-surface-700 p-8 text-center">
          <ErrorContent />
        </div>
      </div>
    ),
    compact: (
      <div className="p-6 bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 rounded-lg">
        <ErrorContent compact />
      </div>
    ),
    inline: (
      <div className="p-4 bg-danger-50 dark:bg-danger-900/20 border-l-4 border-danger-500 text-sm">
        <ErrorContent inline />
      </div>
    )
  };

  const ErrorContent = ({ compact = false, inline = false }) => (
    <>
      <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-danger-100 dark:bg-danger-900/50 rounded-full">
        <svg className="w-8 h-8 text-danger-600 dark:text-danger-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>

      <h2 className="text-xl font-semibold text-surface-900 dark:text-surface-100 mb-2">
        Something went wrong
      </h2>

      <p className="text-surface-600 dark:text-surface-400 mb-6">
        We encountered an unexpected error. This has been automatically reported to our team.
      </p>

      {!inline && (
        <div className="bg-surface-50 dark:bg-surface-700/50 rounded-lg p-4 mb-6 text-left">
          <p className="text-xs font-mono text-surface-700 dark:text-surface-300 break-all">
            Error ID: {errorId}
          </p>
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-2">
              <summary className="text-xs text-surface-600 dark:text-surface-400 cursor-pointer">
                Error Details (Development)
              </summary>
              <pre className="text-xs text-surface-700 dark:text-surface-300 mt-2 whitespace-pre-wrap">
                {error?.toString()}
              </pre>
            </details>
          )}
        </div>
      )}

      <div className={`flex ${compact ? 'flex-col space-y-2' : 'space-x-3'} justify-center`}>
        <button
          onClick={onRetry}
          className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Try Again
        </button>

        <button
          onClick={onReport}
          className="inline-flex items-center px-4 py-2 bg-surface-100 hover:bg-surface-200 text-surface-700 font-medium rounded-md border border-surface-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-surface-500 focus:ring-offset-2"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Report Issue
        </button>
      </div>

      <p className="text-xs text-surface-500 dark:text-surface-400 mt-4">
        If the problem persists, please contact support with error ID: {errorId}
      </p>
    </>
  );

  return variants[variant];
};

/**
 * Professional Toast Notification System
 */
export const ToastContainer = () => {
  const { notifications, removeNotification } = useErrorHandler();
  const { announce } = useScreenReader();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map(notification => (
        <Toast
          key={notification.id}
          notification={notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
};

const Toast = ({ notification, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const { announce } = useScreenReader();
  const timeoutRef = useRef();

  useEffect(() => {
    setIsVisible(true);

    // Announce to screen reader
    const message = `${notification.type}: ${notification.title}. ${notification.message}`;
    announce(message, notification.type === 'error' ? 'assertive' : 'polite');

    // Auto-hide after duration
    if (notification.autoHide !== false) {
      const duration = notification.duration || (notification.type === 'error' ? 7000 : 5000);
      timeoutRef.current = setTimeout(() => {
        handleClose();
      }, duration);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [notification, announce]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for animation
  };

  const typeConfig = {
    success: {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
      bgColor: 'bg-success-50 dark:bg-success-900/20',
      borderColor: 'border-success-200 dark:border-success-800',
      iconColor: 'text-success-600 dark:text-success-400',
      textColor: 'text-success-900 dark:text-success-100'
    },
    error: {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
      bgColor: 'bg-danger-50 dark:bg-danger-900/20',
      borderColor: 'border-danger-200 dark:border-danger-800',
      iconColor: 'text-danger-600 dark:text-danger-400',
      textColor: 'text-danger-900 dark:text-danger-100'
    },
    warning: {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      ),
      bgColor: 'bg-warning-50 dark:bg-warning-900/20',
      borderColor: 'border-warning-200 dark:border-warning-800',
      iconColor: 'text-warning-600 dark:text-warning-400',
      textColor: 'text-warning-900 dark:text-warning-100'
    },
    info: {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bgColor: 'bg-primary-50 dark:bg-primary-900/20',
      borderColor: 'border-primary-200 dark:border-primary-800',
      iconColor: 'text-primary-600 dark:text-primary-400',
      textColor: 'text-primary-900 dark:text-primary-100'
    }
  };

  const config = typeConfig[notification.type] || typeConfig.info;

  return (
    <div
      className={`
        transform transition-all duration-300 ease-out
        ${isVisible ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-full opacity-0 scale-95'}
      `}
      role="alert"
      aria-live={notification.type === 'error' ? 'assertive' : 'polite'}
    >
      <div className={`
        p-4 rounded-lg border shadow-lg backdrop-blur-sm
        ${config.bgColor} ${config.borderColor}
      `}>
        <div className="flex items-start">
          <div className={`flex-shrink-0 ${config.iconColor}`}>
            {config.icon}
          </div>

          <div className="ml-3 flex-1">
            <h4 className={`text-sm font-semibold ${config.textColor}`}>
              {notification.title}
            </h4>
            {notification.message && (
              <p className={`mt-1 text-sm ${config.textColor} opacity-90`}>
                {notification.message}
              </p>
            )}

            {notification.actions && (
              <div className="mt-3 flex space-x-2">
                {notification.actions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.handler}
                    className={`text-xs font-medium px-2 py-1 rounded transition-colors duration-200 ${
                      action.primary
                        ? `${config.iconColor} hover:opacity-80`
                        : `${config.textColor} opacity-70 hover:opacity-100`
                    }`}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleClose}
            className={`flex-shrink-0 ml-3 ${config.iconColor} hover:opacity-70 transition-opacity duration-200`}
            aria-label="Dismiss notification"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Progress bar for auto-hide */}
        {notification.autoHide !== false && (
          <div className="mt-3 w-full bg-white/20 dark:bg-surface-800/20 rounded-full h-1">
            <div
              className={`h-1 rounded-full ${config.iconColor.replace('text-', 'bg-')}`}
              style={{
                animation: `shrink ${notification.duration || 5000}ms linear forwards`
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Professional Form Error Handler
 */
export const useFormErrorHandler = () => {
  const { addNotification } = useErrorHandler();

  const handleValidationErrors = (errors, formName = 'form') => {
    if (Array.isArray(errors)) {
      errors.forEach(error => {
        addNotification({
          type: 'error',
          title: 'Validation Error',
          message: error.message || error,
          duration: 6000
        });
      });
    } else if (typeof errors === 'object') {
      Object.entries(errors).forEach(([field, error]) => {
        addNotification({
          type: 'error',
          title: `${field} Error`,
          message: Array.isArray(error) ? error[0] : error,
          duration: 6000
        });
      });
    } else {
      addNotification({
        type: 'error',
        title: 'Form Error',
        message: errors?.toString() || 'Please check your inputs and try again.',
        duration: 6000
      });
    }
  };

  const handleApiError = (error, context = 'API call') => {
    let title = 'Error';
    let message = 'An unexpected error occurred. Please try again.';

    if (error.response) {
      // Server responded with error status
      title = `${context} Failed`;
      message = error.response.data?.message || `Server error: ${error.response.status}`;
    } else if (error.request) {
      // Network error
      title = 'Network Error';
      message = 'Unable to connect to the server. Please check your internet connection.';
    } else {
      // Client error
      title = 'Application Error';
      message = error.message || message;
    }

    addNotification({
      type: 'error',
      title,
      message,
      duration: 8000,
      actions: [
        {
          label: 'Retry',
          primary: true,
          handler: () => window.location.reload()
        }
      ]
    });
  };

  const handleSuccess = (message, title = 'Success') => {
    addNotification({
      type: 'success',
      title,
      message,
      duration: 4000
    });
  };

  return {
    handleValidationErrors,
    handleApiError,
    handleSuccess
  };
};

// CSS for toast animations
const toastStyles = `
@keyframes shrink {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}
`;

// Inject styles
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = toastStyles;
  document.head.appendChild(style);
}