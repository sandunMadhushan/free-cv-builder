import React, { useState, useEffect } from "react";
import { useAutoSave } from "../../hooks/useAutoSave";

export const AutoSaveStatus = ({ className = "" }) => {
  const { isSaving, lastSavedText } = useAutoSave();
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [previousIsSaving, setPreviousIsSaving] = useState(false);

  // Show success animation when saving completes
  useEffect(() => {
    if (previousIsSaving && !isSaving) {
      setShowSaveSuccess(true);
      const timer = setTimeout(() => setShowSaveSuccess(false), 2000);
      return () => clearTimeout(timer);
    }
    setPreviousIsSaving(isSaving);
  }, [isSaving, previousIsSaving]);

  const SaveIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  );

  const LoadingSpinner = () => (
    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  return (
    <div className={`flex items-center text-sm transition-all duration-200 ${className}`}>
      {isSaving ? (
        <div className="flex items-center fade-in-corporate">
          <div className="text-primary-600 dark:text-primary-400 mr-2">
            <LoadingSpinner />
          </div>
          <span className="text-primary-600 dark:text-primary-400 font-medium">
            Saving changes...
          </span>
        </div>
      ) : showSaveSuccess ? (
        <div className="flex items-center checkmark-success">
          <div className="text-success-600 dark:text-success-400 mr-2">
            <SaveIcon />
          </div>
          <span className="text-success-600 dark:text-success-400 font-medium">
            Saved successfully!
          </span>
        </div>
      ) : (
        <div className="flex items-center fade-in-corporate">
          <div className="w-2 h-2 bg-success-500 dark:bg-success-400 rounded-full mr-2 pulse-slow" />
          <span className="text-surface-600 dark:text-surface-400">
            {lastSavedText}
          </span>
        </div>
      )}
    </div>
  );
};
