import React from 'react';
import { useAutoSave } from '../../hooks/useAutoSave';

export const AutoSaveStatus = ({ className = '' }) => {
  const { isSaving, lastSavedText } = useAutoSave();

  return (
    <div className={`flex items-center text-sm ${className}`}>
      {isSaving ? (
        <>
          <div className="animate-spin inline-block w-4 h-4 border-2 border-green-600 dark:border-green-400 border-r-transparent rounded-full mr-2" />
          <span className="text-green-600 dark:text-green-400 font-medium">Saving...</span>
        </>
      ) : (
        <>
          <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full mr-2" />
          <span className="text-gray-600 dark:text-gray-300">{lastSavedText}</span>
        </>
      )}
    </div>
  );
};