import React, { useEffect, useState, useRef } from "react";
import { useUIStore } from "../../store/uiStore";

export const SplitScreenLayout = ({ leftPanel, rightPanel }) => {
  const { isMobilePreviewOpen, toggleMobilePreview } = useUIStore();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const containerRef = useRef(null);

  // Handle touch gestures for swipe navigation
  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;

    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && !isMobilePreviewOpen) {
      handleTabTransition(() => toggleMobilePreview(true));
    }
    if (isRightSwipe && isMobilePreviewOpen) {
      handleTabTransition(() => toggleMobilePreview(false));
    }

    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  const handleTabTransition = (callback) => {
    setIsTransitioning(true);
    callback();
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const handleTabClick = (previewState) => {
    handleTabTransition(() => toggleMobilePreview(previewState));
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Mobile Navigation Bar - Enhanced */}
      <div className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex relative">
          {/* Background indicator */}
          <div
            className={`
              absolute top-0 h-full w-1/2
              bg-surface-100 dark:bg-surface-700
              transition-transform duration-300 ease-out
              border-b-2 border-primary-500 dark:border-primary-400
              ${isMobilePreviewOpen ? 'translate-x-full' : 'translate-x-0'}
            `}
          />

          {/* Tab buttons with enhanced styling */}
          <button
            onClick={() => handleTabClick(false)}
            disabled={isTransitioning}
            className={`
              relative flex-1 px-4 py-3 text-sm font-medium
              transition-all duration-200 ease-out
              border-r border-gray-200 dark:border-gray-700
              hover-lift focus:outline-none focus:z-10
              min-h-[44px] flex items-center justify-center
              ${!isMobilePreviewOpen
                ? "text-primary-600 dark:text-primary-400 z-10"
                : "text-surface-600 dark:text-surface-400 hover:text-surface-800 dark:hover:text-surface-200"
              }
              ${isTransitioning ? 'pointer-events-none' : ''}
            `}
          >
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              <span>Edit CV</span>
            </div>
          </button>

          <button
            onClick={() => handleTabClick(true)}
            disabled={isTransitioning}
            className={`
              relative flex-1 px-4 py-3 text-sm font-medium
              transition-all duration-200 ease-out
              hover-lift focus:outline-none focus:z-10
              min-h-[44px] flex items-center justify-center
              ${isMobilePreviewOpen
                ? "text-primary-600 dark:text-primary-400 z-10"
                : "text-surface-600 dark:text-surface-400 hover:text-surface-800 dark:hover:text-surface-200"
              }
              ${isTransitioning ? 'pointer-events-none' : ''}
            `}
          >
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              <span>Preview</span>
            </div>
          </button>
        </div>
      </div>

      {/* Enhanced Desktop/Mobile Content with Gestures */}
      <div
        ref={containerRef}
        className="flex-1 flex overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Left Panel - Form - Enhanced */}
        <div
          className={`
            w-full lg:w-1/2 overflow-y-auto border-r border-gray-200 dark:border-gray-700
            bg-surface-50 dark:bg-surface-900 transition-all duration-300 ease-out
            custom-scrollbar
            ${isMobilePreviewOpen ? "hidden lg:block" : "block"}
            ${isTransitioning ? 'pointer-events-none' : ''}
          `}
        >
          <div className="p-4 lg:p-6">
            <div className={`
              transition-all duration-200 ease-out
              ${isTransitioning && !isMobilePreviewOpen ? 'fade-in-corporate' : ''}
            `}>
              {leftPanel}
            </div>
          </div>
        </div>

        {/* Right Panel - Preview - Enhanced */}
        <div
          className={`
            w-full lg:w-1/2 overflow-y-auto
            bg-surface-100 dark:bg-surface-800
            transition-all duration-300 ease-out custom-scrollbar
            ${isMobilePreviewOpen ? "block" : "hidden lg:block"}
            ${isTransitioning ? 'pointer-events-none' : ''}
          `}
        >
          <div className="p-4 lg:p-6 flex justify-center">
            <div className={`
              w-full max-w-none lg:max-w-4xl
              transition-all duration-200 ease-out
              ${isTransitioning && isMobilePreviewOpen ? 'fade-in-corporate' : ''}
            `}>
              {rightPanel}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Mobile Quick Actions - Professional Floating Buttons */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50 space-y-3">
        {!isMobilePreviewOpen && (
          <div className="relative group">
            <button
              onClick={() => handleTabClick(true)}
              disabled={isTransitioning}
              className={`
                bg-primary-600 dark:bg-primary-500 text-white
                w-14 h-14 rounded-full shadow-lg hover-lift
                hover:bg-primary-700 dark:hover:bg-primary-600
                transition-all duration-200 ease-out
                focus:outline-none focus:ring-4 focus:ring-primary-500/30
                flex items-center justify-center
                ${isTransitioning ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              title="Preview CV"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
            </button>

            {/* Tooltip */}
            <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2
                           bg-surface-900 dark:bg-surface-100 text-white dark:text-surface-900
                           px-2 py-1 rounded text-xs font-medium whitespace-nowrap
                           opacity-0 group-hover:opacity-100 transition-opacity duration-200
                           pointer-events-none">
              Preview CV
            </div>
          </div>
        )}

        {isMobilePreviewOpen && (
          <div className="relative group">
            <button
              onClick={() => handleTabClick(false)}
              disabled={isTransitioning}
              className={`
                bg-success-600 dark:bg-success-500 text-white
                w-14 h-14 rounded-full shadow-lg hover-lift
                hover:bg-success-700 dark:hover:bg-success-600
                transition-all duration-200 ease-out
                focus:outline-none focus:ring-4 focus:ring-success-500/30
                flex items-center justify-center
                ${isTransitioning ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              title="Edit CV"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>

            {/* Tooltip */}
            <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2
                           bg-surface-900 dark:bg-surface-100 text-white dark:text-surface-900
                           px-2 py-1 rounded text-xs font-medium whitespace-nowrap
                           opacity-0 group-hover:opacity-100 transition-opacity duration-200
                           pointer-events-none">
              Edit CV
            </div>
          </div>
        )}
      </div>

      {/* Swipe gesture indicator for first-time users */}
      <div className="lg:hidden fixed bottom-20 left-1/2 transform -translate-x-1/2 z-40
                     bg-surface-800/90 dark:bg-surface-200/90 text-white dark:text-surface-900
                     px-3 py-2 rounded-full text-xs font-medium opacity-0 pointer-events-none
                     animate-pulse" id="swipe-hint">
        ← Swipe to navigate →
      </div>
    </div>
  );
};
