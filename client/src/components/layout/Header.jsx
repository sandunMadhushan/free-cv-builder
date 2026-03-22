import React from "react";
import { Button } from "../common/Button";
import { AutoSaveStatus } from "../common/AutoSaveStatus";
import { ThemeToggle } from '../common/ThemeToggle';
import { Tooltip } from "../common/Tooltip";
import { useCVStore } from "../../store/cvStore";

export const Header = ({ onExport, onShare }) => {
  const resetCV = useCVStore((state) => state.resetCV);

  const handleReset = () => {
    if (
      window.confirm(
        "Are you sure you want to reset all data? This cannot be undone.",
      )
    ) {
      resetCV();
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm transition-colors">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Logo/Title */}
        <div className="flex items-center space-x-3">
          <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            Free CV Builder
          </h1>
          <span className="text-sm text-gray-500 dark:text-gray-400 hidden md:inline">
            Create professional resumes for free
          </span>
        </div>

        {/* Center - Auto-save status */}
        <div className="hidden md:block">
          <AutoSaveStatus />
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Share CV button */}
          <Tooltip content="Share CV online" position="bottom">
            <Button
              variant="outline"
              size="sm"
              onClick={onShare}
              className="flex items-center"
            >
              <svg
                className="w-4 h-4 mr-2 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                />
              </svg>
              <span className="whitespace-nowrap">Share CV</span>
            </Button>
          </Tooltip>

          {/* Export button */}
          <Tooltip content="Export CV (PDF or DOCX)" position="bottom">
            <Button variant="primary" size="sm" onClick={onExport}>
              Export CV
            </Button>
          </Tooltip>

          <Tooltip content="Reset all data (Ctrl+Shift+R)" position="bottom">
            <Button variant="outline" size="sm" onClick={handleReset}>
              Reset
            </Button>
          </Tooltip>
        </div>
      </div>
    </header>
  );
};
