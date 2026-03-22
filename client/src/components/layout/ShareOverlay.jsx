import React, { useEffect, useRef } from "react";
import { ShareManager } from "../features/ShareManager";

export const ShareOverlay = ({ isOpen, onClose }) => {
  const overlayRef = useRef(null);
  const previousFocusRef = useRef(null);
  const closeButtonRef = useRef(null);

  // Handle focus management for accessibility
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement;
      // Focus the close button after animation completes
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 300);
    } else if (previousFocusRef.current) {
      // Return focus to previous element when closing
      previousFocusRef.current.focus();
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Focus trap within modal
  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      const focusableElements = overlayRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (focusableElements && focusableElements.length > 0) {
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-end"
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-title"
      aria-describedby="share-description"
    >
      {/* Enhanced Backdrop with blur effect */}
      <div
        className={`
          fixed inset-0 bg-surface-900/60 dark:bg-surface-100/20
          backdrop-blur-sm transition-all duration-300 ease-out
          ${isOpen ? 'opacity-100' : 'opacity-0'}
        `}
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* Enhanced Overlay Panel */}
      <div
        ref={overlayRef}
        onKeyDown={handleKeyDown}
        className={`
          relative h-full w-full max-w-md
          bg-white dark:bg-surface-900
          shadow-2xl border-l border-surface-200 dark:border-surface-700
          transform transition-all duration-300 ease-out
          ${isOpen ? "translate-x-0 scale-100" : "translate-x-full scale-95"}
          slide-in-corporate
        `}
      >
        {/* Enhanced Header with better visual hierarchy */}
        <div className="sticky top-0 z-10 bg-white dark:bg-surface-900 border-b border-surface-200 dark:border-surface-700 shadow-sm">
          <div className="flex items-center justify-between p-6">
            <div>
              <h2
                id="share-title"
                className="text-xl font-semibold text-surface-900 dark:text-surface-100 mb-1"
              >
                Share Your CV
              </h2>
              <p
                id="share-description"
                className="text-sm text-surface-600 dark:text-surface-400"
              >
                Generate a shareable link for your CV
              </p>
            </div>

            {/* Enhanced close button */}
            <button
              ref={closeButtonRef}
              onClick={onClose}
              className={`
                p-2 rounded-lg transition-all duration-200
                hover:bg-surface-100 dark:hover:bg-surface-800
                focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                hover-lift group
              `}
              aria-label="Close share panel"
              title="Close (Esc)"
            >
              <svg
                className="w-5 h-5 text-surface-500 dark:text-surface-400 group-hover:text-surface-700 dark:group-hover:text-surface-200 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Enhanced Content with better scrolling */}
        <div className="h-full flex flex-col">
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="p-6 pb-8 fade-in-corporate">
              <ShareManager />
            </div>
          </div>

          {/* Professional footer gradient for better UX */}
          <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white dark:from-surface-900 to-transparent pointer-events-none" />
        </div>
      </div>
    </div>
  );
};
