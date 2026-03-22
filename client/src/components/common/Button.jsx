import React from "react";

export const Button = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  className = "",
  ...props
}) => {
  const baseClasses =
    "font-medium rounded-md transition-corporate focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 btn-press inline-flex items-center justify-center";

  const variantClasses = {
    primary:
      "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 disabled:bg-primary-300 dark:bg-primary-500 dark:hover:bg-primary-600 dark:disabled:bg-primary-700 hover-lift",
    secondary:
      "bg-surface-200 text-surface-800 hover:bg-surface-300 focus:ring-surface-500 disabled:bg-surface-100 dark:bg-surface-700 dark:text-surface-200 dark:hover:bg-surface-600 dark:disabled:bg-surface-800 hover-lift",
    outline:
      "border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500 disabled:border-primary-300 disabled:text-primary-300 dark:border-primary-400 dark:text-primary-400 dark:hover:bg-primary-900/10 dark:disabled:border-primary-700 dark:disabled:text-primary-700 hover-lift",
    danger:
      "bg-danger-600 text-white hover:bg-danger-700 focus:ring-danger-500 disabled:bg-danger-300 dark:bg-danger-600 dark:hover:bg-danger-500 dark:disabled:bg-danger-700 hover-lift",
    success:
      "bg-success-600 text-white hover:bg-success-700 focus:ring-success-500 disabled:bg-success-300 dark:bg-success-600 dark:hover:bg-success-500 dark:disabled:bg-success-700 hover-lift",
    warning:
      "bg-warning-600 text-white hover:bg-warning-700 focus:ring-warning-500 disabled:bg-warning-300 dark:bg-warning-600 dark:hover:bg-warning-500 dark:disabled:bg-warning-700 hover-lift",
    corporate:
      "gradient-corporate text-surface-700 border border-surface-300 focus:ring-primary-500 disabled:opacity-60 dark:text-surface-300 dark:border-surface-600 hover-lift",
    ghost:
      "text-surface-700 hover:bg-surface-100 focus:ring-surface-500 disabled:text-surface-400 dark:text-surface-300 dark:hover:bg-surface-800 dark:disabled:text-surface-600 hover-lift",
  };

  const sizeClasses = {
    xs: "px-2 py-1 text-xs",
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
    xl: "px-8 py-4 text-xl",
  };

  const LoadingSpinner = () => (
    <svg
      className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${disabled || loading ? "cursor-not-allowed opacity-60" : "cursor-pointer"}
        ${className}
      `}
      {...props}
    >
      {loading && <LoadingSpinner />}
      {children}
    </button>
  );
};
