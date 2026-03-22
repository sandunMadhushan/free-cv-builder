import React, { useRef, useEffect } from 'react';
import {
  useKeyboardShortcut,
  useFocusManagement,
  useScreenReader,
  useAccessibility,
  SkipLink
} from '../../utils/accessibilityUtils';

/**
 * Accessibility-Enhanced Button Component
 * Includes keyboard navigation, screen reader support, and focus management
 */
export const AccessibleButton = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  ariaLabel,
  ariaDescribedBy,
  keyboardShortcut,
  announceAction,
  className = '',
  ...props
}) => {
  const buttonRef = useRef(null);
  const { announce } = useScreenReader();
  const { keyboardNavigationEnabled } = useAccessibility();

  // Register keyboard shortcut if provided
  useKeyboardShortcut(
    keyboardShortcut,
    () => {
      if (!disabled && !loading) {
        onClick?.();
        if (announceAction) {
          announce(announceAction, 'polite');
        }
      }
    },
    'global',
    ariaLabel || children?.toString() || 'Button action'
  );

  const handleClick = (e) => {
    if (disabled || loading) {
      e.preventDefault();
      return;
    }

    onClick?.(e);
    if (announceAction) {
      announce(announceAction, 'polite');
    }
  };

  const baseClasses = `
    relative inline-flex items-center justify-center font-medium rounded-lg
    transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    ${keyboardNavigationEnabled ? 'focus:ring-primary-500' : ''}
  `;

  const variantClasses = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500',
    secondary: 'bg-surface-100 hover:bg-surface-200 text-surface-900 border border-surface-300 focus:ring-surface-500',
    success: 'bg-success-600 hover:bg-success-700 text-white focus:ring-success-500',
    warning: 'bg-warning-600 hover:bg-warning-700 text-white focus:ring-warning-500',
    danger: 'bg-danger-600 hover:bg-danger-700 text-white focus:ring-danger-500',
    ghost: 'hover:bg-surface-100 text-surface-700 focus:ring-surface-500'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-busy={loading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {loading && (
        <svg
          className="w-4 h-4 mr-2 animate-spin"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      <span className={loading ? 'opacity-70' : ''}>{children}</span>
      {keyboardShortcut && (
        <span className="sr-only">Keyboard shortcut: {keyboardShortcut}</span>
      )}
    </button>
  );
};

/**
 * Accessibility-Enhanced Form Field
 * Includes proper labeling, error handling, and screen reader support
 */
export const AccessibleFormField = ({
  label,
  id,
  error,
  hint,
  required = false,
  children,
  className = ''
}) => {
  const { announceFormError } = useScreenReader();

  useEffect(() => {
    if (error) {
      announceFormError(label, error);
    }
  }, [error, label, announceFormError]);

  const fieldId = id || `field-${label.toLowerCase().replace(/\s+/g, '-')}`;
  const hintId = hint ? `${fieldId}-hint` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={`space-y-1 ${className}`}>
      <label
        htmlFor={fieldId}
        className="block text-sm font-medium text-surface-900 dark:text-surface-100"
      >
        {label}
        {required && (
          <span className="ml-1 text-danger-500" aria-label="required">
            *
          </span>
        )}
      </label>

      {hint && (
        <p id={hintId} className="text-xs text-surface-600 dark:text-surface-400">
          {hint}
        </p>
      )}

      <div className="relative">
        {React.cloneElement(children, {
          id: fieldId,
          'aria-describedby': describedBy,
          'aria-invalid': error ? 'true' : 'false',
          required
        })}
      </div>

      {error && (
        <p
          id={errorId}
          className="text-xs text-danger-600 dark:text-danger-400 flex items-center"
          role="alert"
          aria-live="polite"
        >
          <svg
            className="w-3 h-3 mr-1 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

/**
 * Accessibility-Enhanced Modal Dialog
 * Includes focus trap, escape key handling, and screen reader support
 */
export const AccessibleModal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  closeOnBackdrop = true,
  className = ''
}) => {
  const modalRef = useRef(null);
  const { focusElement, restoreFocus, trapFocus } = useFocusManagement();
  const { announce } = useScreenReader();

  useEffect(() => {
    if (isOpen) {
      const cleanup = trapFocus(modalRef.current);
      announce(`Dialog opened: ${title}`, 'polite');
      document.body.style.overflow = 'hidden';

      return () => {
        cleanup?.();
        document.body.style.overflow = 'unset';
        restoreFocus();
      };
    }
  }, [isOpen, title, trapFocus, announce, restoreFocus]);

  // Handle escape key
  useKeyboardShortcut('escape', () => {
    if (isOpen) {
      onClose();
      announce('Dialog closed', 'polite');
    }
  });

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4'
  };

  const handleBackdropClick = (e) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose();
      announce('Dialog closed', 'polite');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby={description ? "modal-description" : undefined}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-surface-900/60 dark:bg-surface-100/20 backdrop-blur-sm transition-opacity"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div
        ref={modalRef}
        className={`
          relative bg-white dark:bg-surface-900 rounded-lg shadow-xl
          border border-surface-200 dark:border-surface-700
          transform transition-all duration-200 ease-out
          ${sizeClasses[size]} w-full max-h-[90vh] overflow-hidden
          ${className}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-surface-200 dark:border-surface-700">
          <div className="flex-1 pr-4">
            <h2
              id="modal-title"
              className="text-lg font-semibold text-surface-900 dark:text-surface-100"
            >
              {title}
            </h2>
            {description && (
              <p
                id="modal-description"
                className="mt-1 text-sm text-surface-600 dark:text-surface-400"
              >
                {description}
              </p>
            )}
          </div>

          <AccessibleButton
            onClick={onClose}
            variant="ghost"
            size="sm"
            ariaLabel="Close dialog"
            keyboardShortcut="escape"
            announceAction="Dialog closed"
            className="flex-shrink-0"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </AccessibleButton>
        </div>

        {/* Content */}
        <div className="overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

/**
 * Accessibility-Enhanced Navigation Component
 */
export const AccessibleNavigation = ({
  items,
  currentPath,
  orientation = 'horizontal',
  onNavigate,
  className = ''
}) => {
  const { announce } = useScreenReader();

  const handleNavigation = (item, index) => {
    onNavigate?.(item, index);
    announce(`Navigated to ${item.label}`, 'polite');
  };

  const orientationClasses = {
    horizontal: 'flex space-x-1',
    vertical: 'flex flex-col space-y-1'
  };

  return (
    <nav
      role="navigation"
      aria-label="Main navigation"
      className={`${orientationClasses[orientation]} ${className}`}
    >
      {items.map((item, index) => (
        <AccessibleButton
          key={item.path || index}
          onClick={() => handleNavigation(item, index)}
          variant={currentPath === item.path ? 'primary' : 'ghost'}
          ariaLabel={`Navigate to ${item.label}`}
          aria-current={currentPath === item.path ? 'page' : undefined}
          className="text-left justify-start"
        >
          {item.icon && (
            <span className="mr-2" aria-hidden="true">
              {item.icon}
            </span>
          )}
          {item.label}
          {item.badge && (
            <span
              className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
              aria-label={`${item.badge} notifications`}
            >
              {item.badge}
            </span>
          )}
        </AccessibleButton>
      ))}
    </nav>
  );
};

/**
 * Accessibility-Enhanced Tooltip
 */
export const AccessibleTooltip = ({
  children,
  content,
  placement = 'top',
  delay = 500,
  className = ''
}) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [timeoutId, setTimeoutId] = React.useState(null);
  const tooltipRef = useRef(null);

  const showTooltip = () => {
    const id = setTimeout(() => setIsVisible(true), delay);
    setTimeoutId(id);
  };

  const hideTooltip = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    setIsVisible(false);
  };

  const placementClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      {isVisible && (
        <div
          ref={tooltipRef}
          role="tooltip"
          className={`
            absolute z-50 px-2 py-1 text-xs font-medium text-white
            bg-surface-900 dark:bg-surface-100 dark:text-surface-900
            rounded shadow-lg pointer-events-none
            ${placementClasses[placement]} ${className}
          `}
        >
          {content}
          {/* Tooltip Arrow */}
          <div className={`
            absolute w-2 h-2 bg-surface-900 dark:bg-surface-100 transform rotate-45
            ${placement === 'top' ? 'top-full left-1/2 -translate-x-1/2 -mt-1' : ''}
            ${placement === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 -mb-1' : ''}
            ${placement === 'left' ? 'left-full top-1/2 -translate-y-1/2 -ml-1' : ''}
            ${placement === 'right' ? 'right-full top-1/2 -translate-y-1/2 -mr-1' : ''}
          `} />
        </div>
      )}
    </div>
  );
};

// Export SkipLink from accessibility utils
export { SkipLink };