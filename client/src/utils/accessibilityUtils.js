import React, { useEffect, useRef, useCallback, createContext, useContext } from 'react';

/**
 * Advanced Accessibility Utilities for Professional CV Builder
 * Ensures WCAG 2.1 AA compliance and enterprise-grade accessibility
 */

// Accessibility configuration
export const ACCESSIBILITY_CONFIG = {
  // WCAG 2.1 AA compliance settings
  minimumContrastRatio: 4.5,
  minimumTouchTargetSize: 44, // pixels
  maximumLineHeight: 1.6,
  minimumFontSize: 14,

  // Keyboard navigation
  focusOutlineWidth: 2,
  focusOutlineOffset: 2,
  skipLinkPosition: 'top-left',

  // Screen reader settings
  announceDelay: 100,
  liveRegionPoliteness: 'polite', // 'off', 'polite', 'assertive'

  // Animation preferences
  respectReducedMotion: true,
  defaultAnimationDuration: 200
};

// Global keyboard shortcuts registry
export class KeyboardShortcutManager {
  constructor() {
    this.shortcuts = new Map();
    this.contexts = new Map();
    this.activeContext = 'global';
    this.isEnabled = true;

    this.handleKeyDown = this.handleKeyDown.bind(this);
    document.addEventListener('keydown', this.handleKeyDown);
  }

  register(key, handler, context = 'global', description = '', preventDefault = true) {
    const contextShortcuts = this.shortcuts.get(context) || new Map();

    contextShortcuts.set(key, {
      handler,
      description,
      preventDefault,
      context
    });

    this.shortcuts.set(context, contextShortcuts);

    // Register in global help system
    this.updateHelpSystem();
  }

  unregister(key, context = 'global') {
    const contextShortcuts = this.shortcuts.get(context);
    if (contextShortcuts) {
      contextShortcuts.delete(key);
      this.updateHelpSystem();
    }
  }

  setActiveContext(context) {
    this.activeContext = context;
  }

  handleKeyDown(event) {
    if (!this.isEnabled) return;

    const key = this.getKeyString(event);

    // Check active context first, then global
    const contexts = [this.activeContext, 'global'];

    for (const context of contexts) {
      const contextShortcuts = this.shortcuts.get(context);
      const shortcut = contextShortcuts?.get(key);

      if (shortcut) {
        if (shortcut.preventDefault) {
          event.preventDefault();
        }

        shortcut.handler(event);
        break;
      }
    }
  }

  getKeyString(event) {
    const parts = [];

    if (event.ctrlKey) parts.push('ctrl');
    if (event.altKey) parts.push('alt');
    if (event.shiftKey) parts.push('shift');
    if (event.metaKey) parts.push('meta');

    parts.push(event.key.toLowerCase());

    return parts.join('+');
  }

  enable() {
    this.isEnabled = true;
  }

  disable() {
    this.isEnabled = false;
  }

  getAllShortcuts() {
    const allShortcuts = {};

    for (const [context, shortcuts] of this.shortcuts.entries()) {
      allShortcuts[context] = {};
      for (const [key, shortcut] of shortcuts.entries()) {
        allShortcuts[context][key] = shortcut;
      }
    }

    return allShortcuts;
  }

  updateHelpSystem() {
    // Trigger help system update
    window.dispatchEvent(new CustomEvent('keyboardShortcutsUpdated', {
      detail: this.getAllShortcuts()
    }));
  }

  destroy() {
    document.removeEventListener('keydown', this.handleKeyDown);
    this.shortcuts.clear();
  }
}

// Global instance
export const keyboardManager = new KeyboardShortcutManager();

/**
 * Focus management utilities
 */
export class FocusManager {
  constructor() {
    this.focusStack = [];
    this.focusTrapElements = new Set();
  }

  // Save current focus and focus target element
  moveFocusTo(element, saveCurrentFocus = true) {
    if (saveCurrentFocus && document.activeElement) {
      this.focusStack.push(document.activeElement);
    }

    if (element && typeof element.focus === 'function') {
      element.focus();
    }
  }

  // Restore previous focus
  restoreFocus() {
    const previousElement = this.focusStack.pop();
    if (previousElement && typeof previousElement.focus === 'function') {
      previousElement.focus();
    }
  }

  // Create focus trap within container
  trapFocus(container) {
    if (!container) return;

    const focusableElements = this.getFocusableElements(container);
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (event) => {
      if (event.key === 'Tab') {
        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    this.focusTrapElements.add(container);

    // Focus first element
    firstElement.focus();

    // Return cleanup function
    return () => {
      container.removeEventListener('keydown', handleKeyDown);
      this.focusTrapElements.delete(container);
    };
  }

  getFocusableElements(container) {
    const focusableSelector = [
      'button:not([disabled])',
      'input:not([disabled])',
      'textarea:not([disabled])',
      'select:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"]):not([disabled])',
      '[contenteditable="true"]'
    ].join(', ');

    return Array.from(container.querySelectorAll(focusableSelector))
      .filter(element => this.isVisible(element));
  }

  isVisible(element) {
    const style = window.getComputedStyle(element);
    return style.display !== 'none' &&
           style.visibility !== 'hidden' &&
           style.opacity !== '0';
  }

  // Get next/previous focusable element
  getNextFocusableElement(currentElement, direction = 1) {
    const allFocusable = this.getFocusableElements(document.body);
    const currentIndex = allFocusable.indexOf(currentElement);

    if (currentIndex === -1) return null;

    const nextIndex = currentIndex + direction;

    if (nextIndex < 0) return allFocusable[allFocusable.length - 1];
    if (nextIndex >= allFocusable.length) return allFocusable[0];

    return allFocusable[nextIndex];
  }

  clearFocusStack() {
    this.focusStack = [];
  }

  destroy() {
    this.clearFocusStack();
    this.focusTrapElements.forEach(element => {
      // Cleanup would happen through returned functions
    });
    this.focusTrapElements.clear();
  }
}

// Global instance
export const focusManager = new FocusManager();

/**
 * Screen Reader utilities
 */
export class ScreenReaderManager {
  constructor() {
    this.liveRegions = new Map();
    this.announcements = [];
    this.setupLiveRegions();
  }

  setupLiveRegions() {
    // Create polite live region
    const politeRegion = document.createElement('div');
    politeRegion.setAttribute('aria-live', 'polite');
    politeRegion.setAttribute('aria-relevant', 'additions text');
    politeRegion.setAttribute('id', 'sr-polite-region');
    politeRegion.style.position = 'absolute';
    politeRegion.style.left = '-10000px';
    politeRegion.style.width = '1px';
    politeRegion.style.height = '1px';
    politeRegion.style.overflow = 'hidden';

    document.body.appendChild(politeRegion);
    this.liveRegions.set('polite', politeRegion);

    // Create assertive live region
    const assertiveRegion = document.createElement('div');
    assertiveRegion.setAttribute('aria-live', 'assertive');
    assertiveRegion.setAttribute('aria-relevant', 'additions text');
    assertiveRegion.setAttribute('id', 'sr-assertive-region');
    assertiveRegion.style.position = 'absolute';
    assertiveRegion.style.left = '-10000px';
    assertiveRegion.style.width = '1px';
    assertiveRegion.style.height = '1px';
    assertiveRegion.style.overflow = 'hidden';

    document.body.appendChild(assertiveRegion);
    this.liveRegions.set('assertive', assertiveRegion);
  }

  announce(message, priority = 'polite', delay = ACCESSIBILITY_CONFIG.announceDelay) {
    if (!message) return;

    const region = this.liveRegions.get(priority);
    if (!region) return;

    // Queue announcement
    this.announcements.push({ message, priority, delay });
    this.processAnnouncements();
  }

  async processAnnouncements() {
    if (this.announcements.length === 0) return;

    const announcement = this.announcements.shift();
    const region = this.liveRegions.get(announcement.priority);

    if (region) {
      // Clear region first
      region.textContent = '';

      // Wait for delay
      await new Promise(resolve => setTimeout(resolve, announcement.delay));

      // Set message
      region.textContent = announcement.message;

      // Process next announcement
      if (this.announcements.length > 0) {
        setTimeout(() => this.processAnnouncements(), 500);
      }
    }
  }

  announceRouteChange(routeName) {
    this.announce(`Navigated to ${routeName}`, 'polite');
  }

  announceFormError(fieldName, errorMessage) {
    this.announce(`Error in ${fieldName}: ${errorMessage}`, 'assertive');
  }

  announceFormSuccess(message) {
    this.announce(message, 'polite');
  }

  announceProgress(current, total, action = 'Processing') {
    const percentage = Math.round((current / total) * 100);
    this.announce(`${action} ${percentage}% complete`, 'polite');
  }

  destroy() {
    this.liveRegions.forEach(region => {
      if (region.parentNode) {
        region.parentNode.removeChild(region);
      }
    });
    this.liveRegions.clear();
    this.announcements = [];
  }
}

// Global instance
export const screenReaderManager = new ScreenReaderManager();

/**
 * Accessibility React Hooks
 */

// Hook for keyboard shortcuts
export const useKeyboardShortcut = (key, handler, context = 'global', description = '') => {
  useEffect(() => {
    keyboardManager.register(key, handler, context, description);

    return () => {
      keyboardManager.unregister(key, context);
    };
  }, [key, handler, context, description]);
};

// Hook for focus management
export const useFocusManagement = () => {
  const focusElement = useCallback((element, saveCurrentFocus = true) => {
    focusManager.moveFocusTo(element, saveCurrentFocus);
  }, []);

  const restoreFocus = useCallback(() => {
    focusManager.restoreFocus();
  }, []);

  const trapFocus = useCallback((container) => {
    return focusManager.trapFocus(container);
  }, []);

  return {
    focusElement,
    restoreFocus,
    trapFocus,
    getFocusableElements: focusManager.getFocusableElements.bind(focusManager)
  };
};

// Hook for screen reader announcements
export const useScreenReader = () => {
  const announce = useCallback((message, priority = 'polite', delay) => {
    screenReaderManager.announce(message, priority, delay);
  }, []);

  const announceFormError = useCallback((fieldName, errorMessage) => {
    screenReaderManager.announceFormError(fieldName, errorMessage);
  }, []);

  const announceFormSuccess = useCallback((message) => {
    screenReaderManager.announceFormSuccess(message);
  }, []);

  const announceProgress = useCallback((current, total, action) => {
    screenReaderManager.announceProgress(current, total, action);
  }, []);

  return {
    announce,
    announceFormError,
    announceFormSuccess,
    announceProgress
  };
};

// Hook for reduced motion preference
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handleChange = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
};

// Hook for high contrast mode
export const useHighContrast = () => {
  const [highContrast, setHighContrast] = React.useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-contrast: high)').matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');

    const handleChange = () => {
      setHighContrast(mediaQuery.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return highContrast;
};

/**
 * Accessibility Context
 */
const AccessibilityContext = createContext({
  keyboardNavigationEnabled: true,
  screenReaderEnabled: true,
  highContrastMode: false,
  reducedMotion: false,
  announcements: true
});

export const AccessibilityProvider = ({ children }) => {
  const reducedMotion = useReducedMotion();
  const highContrast = useHighContrast();

  const [settings, setSettings] = React.useState({
    keyboardNavigationEnabled: true,
    screenReaderEnabled: true,
    announcements: true
  });

  const updateSettings = useCallback((newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const contextValue = {
    ...settings,
    highContrastMode: highContrast,
    reducedMotion,
    updateSettings
  };

  return (
    <AccessibilityContext.Provider value={contextValue}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
};

/**
 * Accessibility testing utilities
 */
export const AccessibilityTester = {
  // Check color contrast ratio
  checkContrastRatio(foreground, background) {
    const rgb1 = this.hexToRgb(foreground);
    const rgb2 = this.hexToRgb(background);

    const l1 = this.getLuminance(rgb1);
    const l2 = this.getLuminance(rgb2);

    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);

    return (lighter + 0.05) / (darker + 0.05);
  },

  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  },

  getLuminance({ r, g, b }) {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  },

  // Check if element meets WCAG guidelines
  auditElement(element) {
    const issues = [];

    // Check focus indicator
    const computedStyle = window.getComputedStyle(element, ':focus');
    if (!computedStyle.outline && !computedStyle.boxShadow) {
      issues.push('Missing focus indicator');
    }

    // Check touch target size
    const rect = element.getBoundingClientRect();
    if (rect.width < ACCESSIBILITY_CONFIG.minimumTouchTargetSize ||
        rect.height < ACCESSIBILITY_CONFIG.minimumTouchTargetSize) {
      issues.push('Touch target too small');
    }

    // Check ARIA labels
    if (element.tagName === 'BUTTON' && !element.textContent &&
        !element.getAttribute('aria-label') &&
        !element.getAttribute('aria-labelledby')) {
      issues.push('Button missing accessible name');
    }

    return issues;
  },

  // Generate accessibility report
  generateReport(container = document.body) {
    const report = {
      totalElements: 0,
      issues: [],
      warnings: [],
      passed: []
    };

    const elements = container.querySelectorAll('*');
    report.totalElements = elements.length;

    elements.forEach(element => {
      const elementIssues = this.auditElement(element);
      if (elementIssues.length > 0) {
        report.issues.push({
          element: element.tagName,
          issues: elementIssues
        });
      } else {
        report.passed.push(element.tagName);
      }
    });

    return report;
  }
};

/**
 * Skip Link Component
 */
export const SkipLink = ({ href = '#main', children = 'Skip to main content' }) => (
  <a
    href={href}
    className="
      absolute top-0 left-0 z-50 px-4 py-2
      bg-primary-600 text-white font-medium
      transform -translate-y-full focus:translate-y-0
      transition-transform duration-200 ease-in-out
      focus:outline-none focus:ring-2 focus:ring-white
    "
  >
    {children}
  </a>
);