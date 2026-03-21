import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../common/Button';
import { AutoSaveStatus } from '../common/AutoSaveStatus';
import { ThemeToggle } from '../common/ThemeToggle';
import { Tooltip } from '../common/Tooltip';
import { useCVStore } from '../../store/cvStore';

export const Header = ({ onExport, onExportSearchable }) => {
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const resetCV = useCVStore((state) => state.resetCV);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsExportMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all data? This cannot be undone.')) {
      resetCV();
    }
  };

  const handleExportClick = (exportType) => {
    setIsExportMenuOpen(false);
    if (exportType === 'visual') {
      onExport();
    } else if (exportType === 'searchable') {
      onExportSearchable();
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm transition-colors">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Logo/Title */}
        <div className="flex items-center space-x-3">
          <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">Free CV Builder</h1>
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
          <ThemeToggle />

          {/* Export dropdown */}
          <div className="relative" ref={menuRef}>
            <Tooltip content="Export options (Ctrl+P)" position="bottom">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
                className="relative"
              >
                Export PDF
                <svg
                  className="ml-2 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </Button>
            </Tooltip>

            {/* Dropdown menu */}
            {isExportMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                <div className="py-2">
                  <button
                    onClick={() => handleExportClick('visual')}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="font-medium">Visual PDF</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Beautiful layout (image-based)
                    </div>
                  </button>

                  <button
                    onClick={() => handleExportClick('searchable')}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-t border-gray-100 dark:border-gray-600"
                  >
                    <div className="font-medium flex items-center">
                      Searchable PDF
                      <span className="ml-2 px-2 py-0.5 text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded">
                        Recommended
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Text-based, can be imported back
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>

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
