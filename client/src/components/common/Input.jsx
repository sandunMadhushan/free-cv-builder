import React, { useState, useRef } from "react";

export const Input = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  error,
  success,
  className = "",
  variant = "default", // 'default', 'floating', 'minimal'
  size = "md", // 'sm', 'md', 'lg'
  leftIcon,
  rightIcon,
  disabled = false,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  const hasValue = value && value.length > 0;
  const isFloating = variant === 'floating';
  const shouldFloatLabel = isFloating && (isFocused || hasValue);

  const handleFocus = (e) => {
    setIsFocused(true);
    if (props.onFocus) props.onFocus(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    if (props.onBlur) props.onBlur(e);
  };

  const handleLabelClick = () => {
    inputRef.current?.focus();
  };

  const getVariantClasses = () => {
    const baseClasses = "transition-corporate focus:outline-none touch-manipulation";

    switch (variant) {
      case 'floating':
        return `${baseClasses} w-full px-3 pt-6 pb-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
          ${error ? 'border-danger-500 dark:border-danger-400 focus:border-danger-500 dark:focus:border-danger-400 focus:ring-danger-500' :
            success ? 'border-success-500 dark:border-success-400 focus:border-success-500 dark:focus:border-success-400 focus:ring-success-500' :
            'border-gray-300 dark:border-gray-600 focus:border-primary-500 dark:focus:border-primary-400 focus:ring-primary-500'}
          focus:ring-2 focus:ring-offset-0`;

      case 'minimal':
        return `${baseClasses} w-full px-0 py-2 bg-transparent border-0 border-b-2 rounded-none text-gray-900 dark:text-gray-100
          ${error ? 'border-danger-500 dark:border-danger-400 focus:border-danger-500' :
            success ? 'border-success-500 dark:border-success-400 focus:border-success-500' :
            'border-gray-300 dark:border-gray-600 focus:border-primary-500'}`;

      default:
        return `${baseClasses} w-full px-3 border border-gray-300 dark:border-gray-600 rounded-md
          bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
          placeholder-gray-500 dark:placeholder-gray-400
          ${error ? 'border-danger-500 dark:border-danger-400 focus:ring-danger-500 dark:focus:ring-danger-400' :
            success ? 'border-success-500 dark:border-success-400 focus:ring-success-500 dark:focus:ring-success-400' :
            'focus:ring-primary-500 dark:focus:ring-primary-400'}
          focus:border-transparent focus:ring-2`;
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return isFloating ? 'text-sm' : 'py-1.5 text-sm';
      case 'lg':
        return isFloating ? 'text-lg' : 'py-3 text-lg';
      default:
        return isFloating ? 'text-base' : 'py-2 lg:py-2.5 text-base lg:text-sm';
    }
  };

  const getIconClasses = () => {
    return size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5';
  };

  const ValidationIcon = () => {
    if (error) {
      return (
        <svg className={`${getIconClasses()} text-danger-500 checkmark-success`} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      );
    }
    if (success) {
      return (
        <svg className={`${getIconClasses()} text-success-500 checkmark-success`} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      );
    }
    return null;
  };

  if (isFloating) {
    return (
      <div className={`relative w-full ${className}`}>
        <input
          ref={inputRef}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          className={`
            ${getVariantClasses()}
            ${getSizeClasses()}
            ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-text'}
            ${leftIcon ? 'pl-10' : ''}
            ${rightIcon || error || success ? 'pr-10' : ''}
          `}
          {...props}
        />

        {/* Floating Label */}
        {label && (
          <label
            onClick={handleLabelClick}
            className={`
              absolute left-3 transition-all duration-200 ease-in-out cursor-text pointer-events-none
              ${shouldFloatLabel
                ? 'top-2 text-xs text-primary-600 dark:text-primary-400'
                : 'top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400'}
              ${error ? 'text-danger-600 dark:text-danger-400' : ''}
              ${success ? 'text-success-600 dark:text-success-400' : ''}
              ${disabled ? 'opacity-60' : ''}
            `}
          >
            {label}
            {required && <span className="text-danger-500 ml-1">*</span>}
          </label>
        )}

        {/* Left Icon */}
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <div className={`${getIconClasses()} text-gray-400 dark:text-gray-500`}>
              {leftIcon}
            </div>
          </div>
        )}

        {/* Right Icon / Validation Icon */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          {rightIcon ? (
            <div className={`${getIconClasses()} text-gray-400 dark:text-gray-500`}>
              {rightIcon}
            </div>
          ) : (
            <ValidationIcon />
          )}
        </div>

        {/* Error/Success Message */}
        {error && (
          <p className={`mt-1 text-sm text-danger-600 dark:text-danger-400 fade-in-corporate ${error ? 'shake-error' : ''}`}>
            {error}
          </p>
        )}
        {success && !error && (
          <p className="mt-1 text-sm text-success-600 dark:text-success-400 fade-in-corporate">
            {success}
          </p>
        )}
      </div>
    );
  }

  // Default and Minimal variants
  return (
    <div className={`w-full ${className}`}>
      {label && !isFloating && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
          {required && <span className="text-danger-500 dark:text-danger-400 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          ref={inputRef}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            ${getVariantClasses()}
            ${getSizeClasses()}
            ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
            ${leftIcon ? 'pl-10' : ''}
            ${rightIcon || error || success ? 'pr-10' : ''}
          `}
          {...props}
        />

        {/* Left Icon */}
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <div className={`${getIconClasses()} text-gray-400 dark:text-gray-500`}>
              {leftIcon}
            </div>
          </div>
        )}

        {/* Right Icon / Validation Icon */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          {rightIcon ? (
            <div className={`${getIconClasses()} text-gray-400 dark:text-gray-500`}>
              {rightIcon}
            </div>
          ) : (
            <ValidationIcon />
          )}
        </div>
      </div>

      {/* Error/Success Message */}
      {error && (
        <p className={`mt-1 text-sm text-danger-600 dark:text-danger-400 fade-in-corporate ${error ? 'shake-error' : ''}`}>
          {error}
        </p>
      )}
      {success && !error && (
        <p className="mt-1 text-sm text-success-600 dark:text-success-400 fade-in-corporate">
          {success}
        </p>
      )}
    </div>
  );
};
