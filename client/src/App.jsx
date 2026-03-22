import React, { useState, useEffect } from "react";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { ShareOverlay } from "./components/layout/ShareOverlay";
import { SplitScreenLayout } from "./components/layout/SplitScreenLayout";
import { SidebarForm } from "./components/form/SidebarForm";
import { CVPreview } from "./components/preview/CVPreview";
import { ProfessionalExportModal } from "./components/export/ProfessionalExportModal";
import {
  generatePDF,
  validateCVForExport,
  suggestFilename,
} from "./utils/pdfGenerator";
import { useCVStore } from "./store/cvStore";
import { useThemeStore } from "./store/themeStore";
import { useTemplateStore } from "./store/templateStore";
import { useGlobalKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { localShareService } from "./utils/localShareService";

function App() {
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState(null); // success | error
  const [exportMessage, setExportMessage] = useState("");
  const [isShareOverlayOpen, setIsShareOverlayOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const cvData = useCVStore();
  const { resetCV, loadCV } = useCVStore();
  const { initializeTheme, setTheme } = useThemeStore();
  const templateStore = useTemplateStore();

  // Initialize theme on app load
  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  // Check for shared CV data on app load
  useEffect(() => {
    const sharedCV = localShareService.loadSharedCV();
    if (sharedCV) {
      const { cv, theme, template } = sharedCV.data;

      // Load the shared CV data into the store
      if (cv) {
        loadCV(cv);
      }

      // Load theme data if available
      if (theme && Object.keys(theme).length > 0) {
        // Apply theme settings
        if (theme.theme) {
          setTheme(theme.theme);
        }
        // Note: themeStore will automatically handle the theme application
      }

      // Load template data if available
      if (template && Object.keys(template).length > 0) {
        // Apply template settings
        if (template.selectedTemplate) {
          templateStore.setTemplate(template.selectedTemplate);
        }
        if (template.customization) {
          templateStore.updateCustomization(template.customization);
        }
        if (template.showPhoto !== undefined) {
          if (template.showPhoto !== templateStore.showPhoto) {
            templateStore.togglePhoto();
          }
        }
        if (template.pageSize) {
          templateStore.setPageSize(template.pageSize);
        }
      }

      // Show a notification that shared CV was loaded
      setExportStatus("success");
      const cvName = cv?.personalInfo?.fullName || "Untitled CV";
      const hasCustomizations =
        (theme && Object.keys(theme).length > 0) ||
        (template && Object.keys(template).length > 0);
      setExportMessage(
        `Loaded shared CV: ${cvName}${hasCustomizations ? " (with styling preserved)" : ""}`,
      );

      // Clear the URL parameters after loading
      setTimeout(() => {
        localShareService.clearShareParams();
        setTimeout(() => {
          setExportStatus(null);
        }, 3000);
      }, 1000);
    }
  }, [loadCV, setTheme, templateStore]);

  // Define functions first
  const handleExport = () => {
    setIsExportModalOpen(true);
  };

  const closeStatusMessage = () => {
    setExportStatus(null);
    setExportMessage("");
  };

  const handleShare = () => {
    setIsShareOverlayOpen(true);
  };

  const closeShareOverlay = () => {
    setIsShareOverlayOpen(false);
  };

  const closeExportModal = () => {
    setIsExportModalOpen(false);
  };

  // Now setup keyboard shortcuts with the defined functions
  useGlobalKeyboardShortcuts(
    handleExport, // Ctrl+P or Ctrl+E
    () => {
      // Auto-save is already handled by Zustand, just show feedback
      setExportStatus("success");
      setExportMessage("CV auto-saved successfully!");
      setTimeout(() => setExportStatus(null), 2000);
    }, // Ctrl+S
    resetCV, // Ctrl+Shift+R
  );

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header onExport={handleExport} onShare={handleShare} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <SplitScreenLayout
          leftPanel={<SidebarForm />}
          rightPanel={<CVPreview />}
        />
      </div>

      <Footer />

      {/* Share Overlay */}
      <ShareOverlay isOpen={isShareOverlayOpen} onClose={closeShareOverlay} />

      {/* Export Modal */}
      <ProfessionalExportModal
        isOpen={isExportModalOpen}
        onClose={closeExportModal}
      />

      {/* Loading overlay during export */}
      {isExporting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-700 dark:text-gray-200">
              Generating your PDF...
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              This may take a few seconds
            </p>
          </div>
        </div>
      )}

      {/* Status notification */}
      {exportStatus && (
        <div className="fixed bottom-4 right-4 z-50">
          <div
            className={`max-w-sm rounded-lg shadow-lg p-4 ${
              exportStatus === "success"
                ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
            }`}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {exportStatus === "success" ? (
                  <svg
                    className="h-5 w-5 text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-5 w-5 text-red-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <div className="ml-3 flex-1">
                <p
                  className={`text-sm font-medium ${
                    exportStatus === "success"
                      ? "text-green-800 dark:text-green-200"
                      : "text-red-800 dark:text-red-200"
                  }`}
                >
                  {exportStatus === "success"
                    ? "Export Successful!"
                    : "Export Failed"}
                </p>
                <p
                  className={`text-sm mt-1 whitespace-pre-line ${
                    exportStatus === "success"
                      ? "text-green-700 dark:text-green-300"
                      : "text-red-700 dark:text-red-300"
                  }`}
                >
                  {exportMessage}
                </p>
              </div>
              <div className="ml-4 flex-shrink-0">
                <button
                  onClick={closeStatusMessage}
                  className={`inline-flex rounded-md p-1.5 hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    exportStatus === "success"
                      ? "text-green-500 hover:bg-green-200 focus:ring-green-600"
                      : "text-red-500 hover:bg-red-200 focus:ring-red-600"
                  }`}
                >
                  <svg
                    className="h-4 w-4"
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
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
