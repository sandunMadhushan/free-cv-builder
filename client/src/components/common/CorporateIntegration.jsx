/**
 * Corporate UI Integration Helper
 * Provides hooks and utilities to integrate corporate components with the existing CV builder
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ErrorProvider,
  ToastContainer,
  ProfessionalErrorBoundary
} from './ProfessionalErrorHandling';
import { AccessibilityProvider } from '../../utils/accessibilityUtils';

/**
 * Corporate Theme Context for Global Theming
 */
const CorporateThemeContext = createContext();

export const CorporateThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('corporate-theme') || 'auto';
    }
    return 'auto';
  });

  const [corporateMode, setCorporateMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('corporate-mode') === 'true';
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem('corporate-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('corporate-mode', corporateMode.toString());
  }, [corporateMode]);

  const toggleCorporateMode = () => {
    setCorporateMode(prev => !prev);
  };

  return (
    <CorporateThemeContext.Provider value={{
      theme,
      setTheme,
      corporateMode,
      setCorporateMode,
      toggleCorporateMode
    }}>
      {children}
    </CorporateThemeContext.Provider>
  );
};

export const useCorporateTheme = () => {
  const context = useContext(CorporateThemeContext);
  if (!context) {
    throw new Error('useCorporateTheme must be used within CorporateThemeProvider');
  }
  return context;
};

/**
 * Master Corporate App Wrapper
 * Wraps the entire application with corporate enhancements
 */
export const CorporateAppWrapper = ({ children }) => {
  return (
    <ErrorProvider>
      <CorporateThemeProvider>
        <AccessibilityProvider>
          <ProfessionalErrorBoundary>
            <div className="corporate-app-wrapper">
              {children}
              <ToastContainer />
            </div>
          </ProfessionalErrorBoundary>
        </AccessibilityProvider>
      </CorporateThemeProvider>
    </ErrorProvider>
  );
};

/**
 * Enhanced Auto-Save Hook with Corporate Feedback
 */
export const useCorporateAutoSave = (data, saveFunction, interval = 3000) => {
  const [saveStatus, setSaveStatus] = useState('saved');
  const [lastSaved, setLastSaved] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!data || typeof saveFunction !== 'function') return;

    const timeoutId = setTimeout(async () => {
      try {
        setSaveStatus('saving');
        setError(null);

        await saveFunction(data);

        setSaveStatus('saved');
        setLastSaved(new Date());
      } catch (err) {
        setSaveStatus('error');
        setError(err);
        console.error('Auto-save failed:', err);
      }
    }, interval);

    return () => clearTimeout(timeoutId);
  }, [data, saveFunction, interval]);

  return {
    saveStatus,
    lastSaved,
    error,
    isAutoSaving: saveStatus === 'saving'
  };
};

/**
 * Corporate Form Validation Hook
 */
export const useCorporateValidation = (schema) => {
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  const validate = (data) => {
    const newErrors = {};
    let valid = true;

    Object.entries(schema).forEach(([field, rules]) => {
      const value = data[field];
      const fieldErrors = [];

      // Required validation
      if (rules.required && (!value || value.toString().trim() === '')) {
        fieldErrors.push(`${rules.label || field} is required`);
        valid = false;
      }

      // Type validation
      if (value && rules.type) {
        switch (rules.type) {
          case 'email':
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
              fieldErrors.push('Please enter a valid email address');
              valid = false;
            }
            break;
          case 'phone':
            if (!/^[\+]?[\d\s\-\(\)]{10,}$/.test(value)) {
              fieldErrors.push('Please enter a valid phone number');
              valid = false;
            }
            break;
          case 'url':
            try {
              new URL(value);
            } catch {
              fieldErrors.push('Please enter a valid URL');
              valid = false;
            }
            break;
        }
      }

      // Length validation
      if (value && rules.minLength && value.length < rules.minLength) {
        fieldErrors.push(`Must be at least ${rules.minLength} characters`);
        valid = false;
      }

      if (value && rules.maxLength && value.length > rules.maxLength) {
        fieldErrors.push(`Must be no more than ${rules.maxLength} characters`);
        valid = false;
      }

      // Custom validation
      if (value && rules.validate && typeof rules.validate === 'function') {
        const customError = rules.validate(value, data);
        if (customError) {
          fieldErrors.push(customError);
          valid = false;
        }
      }

      if (fieldErrors.length > 0) {
        newErrors[field] = fieldErrors;
      }
    });

    setErrors(newErrors);
    setIsValid(valid);

    return { isValid: valid, errors: newErrors };
  };

  const clearErrors = (field) => {
    if (field) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    } else {
      setErrors({});
    }
  };

  const getFieldError = (field) => {
    return errors[field]?.[0] || null;
  };

  const hasFieldError = (field) => {
    return !!errors[field]?.length;
  };

  return {
    errors,
    isValid,
    validate,
    clearErrors,
    getFieldError,
    hasFieldError
  };
};

/**
 * Corporate Navigation Hook with Analytics
 */
export const useCorporateNavigation = () => {
  const [currentPage, setCurrentPage] = useState('');
  const [navigationHistory, setNavigationHistory] = useState([]);

  const navigateTo = (page, data = {}) => {
    // Track navigation for analytics
    const navigationEvent = {
      from: currentPage,
      to: page,
      timestamp: new Date().toISOString(),
      data
    };

    setNavigationHistory(prev => [...prev.slice(-9), navigationEvent]);
    setCurrentPage(page);

    // Announce page change for accessibility
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('page-change', {
        detail: { page, data }
      });
      window.dispatchEvent(event);
    }
  };

  const goBack = () => {
    const previousPage = navigationHistory[navigationHistory.length - 2];
    if (previousPage) {
      navigateTo(previousPage.from);
    }
  };

  const canGoBack = () => {
    return navigationHistory.length > 1;
  };

  return {
    currentPage,
    navigationHistory,
    navigateTo,
    goBack,
    canGoBack
  };
};

/**
 * Corporate Performance Hook
 */
export const useCorporatePerformance = (componentName) => {
  useEffect(() => {
    const startTime = performance.now();

    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Log performance metrics
      if (renderTime > 100) { // Only log slow renders
        console.log(`🐌 Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`);
      }

      // Track performance metrics
      if (typeof window !== 'undefined' && window.corporateAnalytics) {
        window.corporateAnalytics.track('component_render', {
          component: componentName,
          renderTime,
          timestamp: new Date().toISOString()
        });
      }
    };
  });
};

/**
 * Corporate Keyboard Shortcuts Hook
 */
export const useCorporateShortcuts = () => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Global corporate shortcuts
      if (event.ctrlKey || event.metaKey) {
        switch (event.key.toLowerCase()) {
          case 's':
            event.preventDefault();
            window.dispatchEvent(new CustomEvent('corporate-save'));
            break;
          case 'p':
            event.preventDefault();
            window.dispatchEvent(new CustomEvent('corporate-export'));
            break;
          case 'k':
            event.preventDefault();
            window.dispatchEvent(new CustomEvent('corporate-search'));
            break;
          case '/':
            event.preventDefault();
            window.dispatchEvent(new CustomEvent('corporate-help'));
            break;
        }
      }

      // Escape key
      if (event.key === 'Escape') {
        window.dispatchEvent(new CustomEvent('corporate-escape'));
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
};

/**
 * Corporate Data Hook with Optimistic Updates
 */
export const useCorporateData = (initialData, updateFunction) => {
  const [data, setData] = useState(initialData);
  const [optimisticData, setOptimisticData] = useState(initialData);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);

  const updateData = async (updates, optimistic = true) => {
    setIsUpdating(true);
    setError(null);

    // Optimistic update
    if (optimistic) {
      setOptimisticData(prev => ({ ...prev, ...updates }));
    }

    try {
      const result = await updateFunction(updates);
      setData(result);
      setOptimisticData(result);
    } catch (err) {
      setError(err);
      // Revert optimistic update on error
      setOptimisticData(data);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  const resetData = () => {
    setData(initialData);
    setOptimisticData(initialData);
    setError(null);
  };

  return {
    data: optimisticData,
    originalData: data,
    isUpdating,
    error,
    updateData,
    resetData
  };
};

/**
 * Corporate Analytics Hook
 */
export const useCorporateAnalytics = () => {
  const trackEvent = (event, properties = {}) => {
    if (typeof window !== 'undefined') {
      // Track to multiple analytics services
      const trackingData = {
        event,
        properties: {
          ...properties,
          timestamp: new Date().toISOString(),
          sessionId: sessionStorage.getItem('corporate-session-id'),
          userAgent: navigator.userAgent,
          url: window.location.href
        }
      };

      // Console logging for development
      if (process.env.NODE_ENV === 'development') {
        console.log('📊 Analytics Event:', trackingData);
      }

      // Send to analytics services (implement as needed)
      if (window.gtag) {
        window.gtag('event', event, properties);
      }

      if (window.mixpanel) {
        window.mixpanel.track(event, properties);
      }

      // Custom corporate analytics
      if (window.corporateAnalytics) {
        window.corporateAnalytics.track(event, properties);
      }
    }
  };

  const trackPageView = (page, properties = {}) => {
    trackEvent('page_view', {
      page,
      ...properties
    });
  };

  const trackUserAction = (action, target, properties = {}) => {
    trackEvent('user_action', {
      action,
      target,
      ...properties
    });
  };

  const trackError = (error, context = {}) => {
    trackEvent('error', {
      error: error.toString(),
      stack: error.stack,
      context,
      severity: 'error'
    });
  };

  return {
    trackEvent,
    trackPageView,
    trackUserAction,
    trackError
  };
};

/**
 * Corporate Session Management
 */
export const useCorporateSession = () => {
  const [sessionId] = useState(() => {
    if (typeof window !== 'undefined') {
      let id = sessionStorage.getItem('corporate-session-id');
      if (!id) {
        id = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        sessionStorage.setItem('corporate-session-id', id);
      }
      return id;
    }
    return null;
  });

  const [sessionData, setSessionData] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('corporate-session-data');
      return stored ? JSON.parse(stored) : {};
    }
    return {};
  });

  const updateSession = (data) => {
    const newData = { ...sessionData, ...data };
    setSessionData(newData);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('corporate-session-data', JSON.stringify(newData));
    }
  };

  const clearSession = () => {
    setSessionData({});
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('corporate-session-data');
    }
  };

  return {
    sessionId,
    sessionData,
    updateSession,
    clearSession
  };
};

/**
 * Utility Functions for Corporate Integration
 */
export const CorporateUtils = {
  // Format currency with corporate standards
  formatCurrency: (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(amount);
  },

  // Format dates with corporate standards
  formatDate: (date, format = 'short') => {
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: format
    }).format(new Date(date));
  },

  // Format file sizes
  formatFileSize: (bytes) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  },

  // Generate professional color palettes
  generateColorPalette: (baseColor) => {
    // This would integrate with a color generation library
    return {
      50: `${baseColor}0D`,
      100: `${baseColor}1A`,
      200: `${baseColor}33`,
      300: `${baseColor}4D`,
      400: `${baseColor}66`,
      500: baseColor,
      600: `${baseColor}CC`,
      700: `${baseColor}B3`,
      800: `${baseColor}99`,
      900: `${baseColor}80`
    };
  },

  // Validate corporate standards
  validateCorporateStandards: (data) => {
    const issues = [];

    // Check accessibility
    if (!data.altText && data.images) {
      issues.push('Missing alt text for images');
    }

    // Check branding
    if (!data.brandColors || data.brandColors.length === 0) {
      issues.push('No brand colors defined');
    }

    // Check typography
    if (!data.fonts || data.fonts.length === 0) {
      issues.push('No corporate fonts specified');
    }

    return {
      isValid: issues.length === 0,
      issues
    };
  }
};