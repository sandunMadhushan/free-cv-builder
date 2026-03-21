import React from "react";
import { useUIStore } from "../../store/uiStore";

export const SplitScreenLayout = ({ leftPanel, rightPanel }) => {
  const { isMobilePreviewOpen, toggleMobilePreview } = useUIStore();

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Mobile Navigation Bar */}
      <div className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex">
          <button
            onClick={() => toggleMobilePreview(false)}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors border-r border-gray-200 dark:border-gray-700 ${
              !isMobilePreviewOpen
                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            ✏️ Edit CV
          </button>
          <button
            onClick={() => toggleMobilePreview(true)}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              isMobilePreviewOpen
                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            👁️ Preview
          </button>
        </div>
      </div>

      {/* Desktop: Split Screen | Mobile: Tabs */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Form */}
        <div
          className={`
            w-full lg:w-1/2 overflow-y-auto border-r border-gray-200 dark:border-gray-700
            bg-gray-50 dark:bg-gray-900 transition-colors custom-scrollbar
            ${isMobilePreviewOpen ? "hidden lg:block" : "block"}
          `}
        >
          <div className="p-4 lg:p-6">{leftPanel}</div>
        </div>

        {/* Right Panel - Preview */}
        <div
          className={`
            w-full lg:w-1/2 overflow-y-auto bg-gray-100 dark:bg-gray-800 transition-colors custom-scrollbar
            ${isMobilePreviewOpen ? "block" : "hidden lg:block"}
          `}
        >
          <div className="p-4 lg:p-6 flex justify-center">
            <div className="w-full max-w-none lg:max-w-4xl">{rightPanel}</div>
          </div>
        </div>
      </div>

      {/* Mobile Quick Actions - Floating */}
      <div className="lg:hidden fixed bottom-4 right-4 z-50 space-y-2">
        {!isMobilePreviewOpen && (
          <button
            onClick={() => toggleMobilePreview(true)}
            className="bg-blue-600 dark:bg-blue-500 text-white p-3 rounded-full shadow-lg
                       hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors
                       focus:outline-none focus:ring-4 focus:ring-blue-500/50"
            title="Preview CV"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </button>
        )}

        {isMobilePreviewOpen && (
          <button
            onClick={() => toggleMobilePreview(false)}
            className="bg-green-600 dark:bg-green-500 text-white p-3 rounded-full shadow-lg
                       hover:bg-green-700 dark:hover:bg-green-600 transition-colors
                       focus:outline-none focus:ring-4 focus:ring-green-500/50"
            title="Edit CV"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002 2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};
