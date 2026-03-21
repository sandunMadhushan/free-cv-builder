import React from 'react';
import { useUIStore } from '../../store/uiStore';

export const SplitScreenLayout = ({ leftPanel, rightPanel }) => {
  const { isMobilePreviewOpen } = useUIStore();

  return (
    <div className="flex flex-col h-screen">
      {/* Desktop: Split Screen | Mobile: Tabs */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Form */}
        <div
          className={`
            w-full lg:w-1/2 overflow-y-auto border-r border-gray-200 bg-gray-50
            ${isMobilePreviewOpen ? 'hidden lg:block' : 'block'}
          `}
        >
          <div className="p-6">
            {leftPanel}
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div
          className={`
            w-full lg:w-1/2 overflow-y-auto bg-gray-100
            ${isMobilePreviewOpen ? 'block' : 'hidden lg:block'}
          `}
        >
          <div className="p-6 flex justify-center">
            {rightPanel}
          </div>
        </div>
      </div>

      {/* Mobile Toggle Button */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        <button
          onClick={() => useUIStore.getState().toggleMobilePreview()}
          className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition"
        >
          {isMobilePreviewOpen ? 'Edit CV' : 'Preview CV'}
        </button>
      </div>
    </div>
  );
};
