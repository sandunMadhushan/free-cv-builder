import React from 'react';
import { Button } from '../common/Button';
import { AutoSaveStatus } from '../common/AutoSaveStatus';
import { ThemeToggle } from '../common/ThemeToggle';
import { Tooltip } from '../common/Tooltip';
import { useCVStore } from '../../store/cvStore';

export const Header = ({ onExport }) => {
  const resetCV = useCVStore((state) => state.resetCV);

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all data? This cannot be undone.')) {
      resetCV();
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

          <Tooltip content="Export as PDF (Ctrl+P)" position="bottom">
            <Button variant="primary" size="sm" onClick={onExport}>
              Export PDF
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
