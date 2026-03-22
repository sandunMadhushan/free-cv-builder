import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useReducedMotion, useAccessibility } from '../../utils/accessibilityUtils';

/**
 * Corporate Animation System with Motion Preferences
 */
export const useMotion = () => {
  const prefersReducedMotion = useReducedMotion();

  const createAnimation = useCallback((animation) => {
    if (prefersReducedMotion) {
      return { ...animation, duration: 0, delay: 0 };
    }
    return animation;
  }, [prefersReducedMotion]);

  return {
    prefersReducedMotion,
    createAnimation,
    // Pre-defined corporate animations
    slideUp: createAnimation({
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
    }),
    slideDown: createAnimation({
      initial: { opacity: 0, y: -20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
    }),
    fadeIn: createAnimation({
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.25 }
    }),
    scaleIn: createAnimation({
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] }
    }),
    slideInFromRight: createAnimation({
      initial: { opacity: 0, x: 20 },
      animate: { opacity: 1, x: 0 },
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
    })
  };
};

/**
 * Professional Corporate Card Component with Micro-interactions
 */
export const CorporateCard = ({
  children,
  variant = 'default',
  hover = true,
  onClick,
  className = '',
  elevation = 'low',
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const { prefersReducedMotion } = useMotion();

  const elevationClasses = {
    none: '',
    low: 'shadow-sm hover:shadow-md',
    medium: 'shadow-md hover:shadow-lg',
    high: 'shadow-lg hover:shadow-xl',
    corporate: 'shadow-lg hover:shadow-2xl'
  };

  const variantClasses = {
    default: 'bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700',
    corporate: 'bg-gradient-to-br from-white to-surface-50 dark:from-surface-800 dark:to-surface-900 border border-surface-200 dark:border-surface-700',
    premium: 'bg-gradient-to-br from-primary-50 to-white dark:from-primary-900/20 dark:to-surface-800 border border-primary-200 dark:border-primary-800',
    glass: 'bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm border border-surface-200/50 dark:border-surface-700/50'
  };

  const baseClasses = `
    rounded-lg transition-all duration-200 ease-corporate
    ${!prefersReducedMotion && hover ? 'hover-lift' : ''}
    ${onClick ? 'cursor-pointer' : ''}
    ${elevationClasses[elevation]}
    ${variantClasses[variant]}
    ${isHovered && !prefersReducedMotion ? 'scale-[1.02]' : ''}
    ${isFocused ? 'ring-2 ring-primary-500 ring-offset-2 ring-offset-white dark:ring-offset-surface-800' : ''}
  `;

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <div
      className={`${baseClasses} ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onClick={onClick}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? 'button' : undefined}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * Professional Badge Component with Corporate Styling
 */
export const CorporateBadge = ({
  children,
  variant = 'primary',
  size = 'md',
  pill = false,
  icon,
  onRemove,
  className = ''
}) => {
  const variants = {
    primary: 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300',
    success: 'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-300',
    warning: 'bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-300',
    danger: 'bg-danger-100 text-danger-800 dark:bg-danger-900/30 dark:text-danger-300',
    neutral: 'bg-surface-100 text-surface-800 dark:bg-surface-700 dark:text-surface-200',
    corporate: 'bg-gradient-to-r from-primary-100 to-secondary-100 text-primary-800 dark:from-primary-900/30 dark:to-secondary-900/30 dark:text-primary-300'
  };

  const sizes = {
    xs: 'px-2 py-0.5 text-xs',
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  };

  const baseClasses = `
    inline-flex items-center font-medium
    transition-all duration-150 ease-corporate
    ${pill ? 'rounded-full' : 'rounded-md'}
    ${variants[variant]}
    ${sizes[size]}
  `;

  return (
    <span className={`${baseClasses} ${className}`}>
      {icon && <span className="mr-1.5">{icon}</span>}
      {children}
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-1.5 -mr-1 hover:bg-black/10 dark:hover:bg-white/10 rounded-full p-0.5 transition-colors duration-150"
          aria-label="Remove badge"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  );
};

/**
 * Professional Divider with Corporate Styling
 */
export const CorporateDivider = ({
  orientation = 'horizontal',
  variant = 'default',
  label,
  className = ''
}) => {
  const variants = {
    default: 'border-surface-200 dark:border-surface-700',
    corporate: 'border-gradient-to-r from-primary-200 via-surface-200 to-secondary-200 dark:from-primary-800 dark:via-surface-700 dark:to-secondary-800',
    subtle: 'border-surface-100 dark:border-surface-800',
    strong: 'border-surface-300 dark:border-surface-600'
  };

  if (orientation === 'vertical') {
    return (
      <div className={`border-l ${variants[variant]} ${className}`} />
    );
  }

  if (label) {
    return (
      <div className={`relative ${className}`}>
        <div className="absolute inset-0 flex items-center">
          <div className={`w-full border-t ${variants[variant]}`} />
        </div>
        <div className="relative flex justify-center">
          <span className="px-3 bg-white dark:bg-surface-900 text-sm text-surface-500 dark:text-surface-400 font-medium">
            {label}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`border-t ${variants[variant]} ${className}`} />
  );
};

/**
 * Professional Avatar Component with Corporate Styling
 */
export const CorporateAvatar = ({
  src,
  alt,
  name,
  size = 'md',
  variant = 'circular',
  status,
  onClick,
  className = ''
}) => {
  const [imageError, setImageError] = useState(false);

  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
    '2xl': 'w-20 h-20 text-2xl'
  };

  const statusColors = {
    online: 'bg-success-500',
    away: 'bg-warning-500',
    busy: 'bg-danger-500',
    offline: 'bg-surface-400'
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const baseClasses = `
    relative inline-flex items-center justify-center
    ${sizes[size]}
    ${variant === 'circular' ? 'rounded-full' : 'rounded-lg'}
    ${onClick ? 'cursor-pointer hover:opacity-80 transition-opacity duration-200' : ''}
    overflow-hidden
  `;

  const handleImageError = () => setImageError(true);

  return (
    <div className={`${baseClasses} ${className}`} onClick={onClick}>
      {src && !imageError ? (
        <img
          src={src}
          alt={alt || name}
          onError={handleImageError}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-primary-400 to-secondary-500 text-white font-semibold flex items-center justify-center">
          {name ? getInitials(name) : (
            <svg className="w-1/2 h-1/2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          )}
        </div>
      )}

      {/* Status Indicator */}
      {status && (
        <div className={`absolute bottom-0 right-0 w-3 h-3 ${statusColors[status]} border-2 border-white dark:border-surface-800 rounded-full`} />
      )}
    </div>
  );
};

/**
 * Professional Accordion Component with Corporate Styling
 */
export const CorporateAccordion = ({ items, allowMultiple = false, className = '' }) => {
  const [openItems, setOpenItems] = useState(new Set());
  const { prefersReducedMotion } = useMotion();

  const toggleItem = (index) => {
    setOpenItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        if (!allowMultiple) {
          newSet.clear();
        }
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <div className={`space-y-1 ${className}`}>
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          item={item}
          index={index}
          isOpen={openItems.has(index)}
          onToggle={() => toggleItem(index)}
          prefersReducedMotion={prefersReducedMotion}
        />
      ))}
    </div>
  );
};

const AccordionItem = ({ item, index, isOpen, onToggle, prefersReducedMotion }) => {
  const contentRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen]);

  return (
    <div className="border border-surface-200 dark:border-surface-700 rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 text-left bg-surface-50 dark:bg-surface-800 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset"
        aria-expanded={isOpen}
        aria-controls={`accordion-content-${index}`}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-surface-900 dark:text-surface-100">
            {item.title}
          </h3>
          <svg
            className={`w-4 h-4 text-surface-500 transition-transform duration-200 ${
              isOpen ? 'transform rotate-180' : ''
            } ${prefersReducedMotion ? '' : 'ease-corporate'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      <div
        id={`accordion-content-${index}`}
        className={`overflow-hidden transition-all duration-300 ${
          prefersReducedMotion ? '' : 'ease-corporate'
        }`}
        style={{ height: `${height}px` }}
      >
        <div ref={contentRef} className="px-6 py-4 bg-white dark:bg-surface-900">
          <div className="text-sm text-surface-700 dark:text-surface-300">
            {item.content}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Professional Stats Component with Corporate Styling
 */
export const CorporateStats = ({ stats, layout = 'horizontal', className = '' }) => {
  const { prefersReducedMotion } = useMotion();

  const StatItem = ({ stat, index }) => (
    <div className={`text-center ${!prefersReducedMotion ? 'animate-in slide-in-from-bottom-4' : ''}`} style={{ animationDelay: `${index * 100}ms` }}>
      <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
        <CountUp
          end={stat.value}
          duration={prefersReducedMotion ? 0 : 2}
          separator=","
          prefix={stat.prefix}
          suffix={stat.suffix}
        />
      </div>
      <div className="text-sm font-medium text-surface-900 dark:text-surface-100 mt-1">
        {stat.label}
      </div>
      {stat.description && (
        <div className="text-xs text-surface-600 dark:text-surface-400 mt-1">
          {stat.description}
        </div>
      )}
      {stat.change && (
        <div className={`text-xs mt-1 flex items-center justify-center ${
          stat.change >= 0 ? 'text-success-600' : 'text-danger-600'
        }`}>
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={stat.change >= 0 ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" : "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"}
            />
          </svg>
          {Math.abs(stat.change)}%
        </div>
      )}
    </div>
  );

  const layoutClasses = {
    horizontal: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6',
    vertical: 'space-y-6',
    compact: 'flex flex-wrap gap-4'
  };

  return (
    <div className={`${layoutClasses[layout]} ${className}`}>
      {stats.map((stat, index) => (
        <StatItem key={index} stat={stat} index={index} />
      ))}
    </div>
  );
};

/**
 * Simple CountUp Component (internal use)
 */
const CountUp = ({ end, duration, separator = '', prefix = '', suffix = '' }) => {
  const [count, setCount] = useState(0);
  const { prefersReducedMotion } = useMotion();

  useEffect(() => {
    if (prefersReducedMotion || duration === 0) {
      setCount(end);
      return;
    }

    const startTime = Date.now();
    const endTime = startTime + (duration * 1000);

    const updateCount = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / (endTime - startTime), 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setCount(Math.floor(end * easeOut));

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(updateCount);
  }, [end, duration, prefersReducedMotion]);

  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  };

  return `${prefix}${formatNumber(count)}${suffix}`;
};

/**
 * Professional Breadcrumb Component
 */
export const CorporateBreadcrumb = ({ items, separator, className = '' }) => {
  const defaultSeparator = (
    <svg className="w-4 h-4 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <span className="mx-2" aria-hidden="true">
                {separator || defaultSeparator}
              </span>
            )}
            {item.href ? (
              <a
                href={item.href}
                onClick={item.onClick}
                className="text-sm font-medium text-surface-600 dark:text-surface-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                aria-current={index === items.length - 1 ? 'page' : undefined}
              >
                {item.label}
              </a>
            ) : (
              <span className={`text-sm font-medium ${
                index === items.length - 1
                  ? 'text-surface-900 dark:text-surface-100'
                  : 'text-surface-600 dark:text-surface-400'
              }`}>
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};