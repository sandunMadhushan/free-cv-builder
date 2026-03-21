import React from "react";
import { useThemeStore } from "../../store/themeStore";

export const PreviewThemeToggle = ({ className = "" }) => {
  const { previewIsDark, togglePreviewTheme, getPreviewThemeInfo } =
    useThemeStore();
  const previewThemeInfo = getPreviewThemeInfo();

  return (
    <button
      onClick={togglePreviewTheme}
      className={`
        relative inline-flex items-center justify-center p-2
        rounded-lg transition-all duration-200 ease-in-out
        hover:bg-gray-100 dark:hover:bg-gray-700
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        dark:focus:ring-offset-gray-800 border border-gray-200 dark:border-gray-600
        ${className}
      `}
      title={`Switch preview to ${previewIsDark ? "light" : "dark"} mode`}
      aria-label={`Switch preview to ${previewIsDark ? "light" : "dark"} mode`}
    >
      <div className="relative w-5 h-5 transition-transform duration-300">
        {/* Sun Icon */}
        <svg
          className={`absolute inset-0 w-5 h-5 text-yellow-500 transition-all duration-300 ${
            previewIsDark
              ? "rotate-90 scale-0 opacity-0"
              : "rotate-0 scale-100 opacity-100"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
            clipRule="evenodd"
          />
        </svg>

        {/* Moon Icon */}
        <svg
          className={`absolute inset-0 w-5 h-5 text-blue-400 transition-all duration-300 ${
            previewIsDark
              ? "rotate-0 scale-100 opacity-100"
              : "-rotate-90 scale-0 opacity-0"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      </div>

      {/* Text label for preview theme */}
      <span className="ml-2 text-xs font-medium text-gray-600 dark:text-gray-300 hidden sm:inline">
        Preview: {previewThemeInfo.label}
      </span>
    </button>
  );
};
