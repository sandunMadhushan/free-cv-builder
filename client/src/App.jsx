import React, { useState } from 'react';
import { Header } from './components/layout/Header';
import { SplitScreenLayout } from './components/layout/SplitScreenLayout';
import { SidebarForm } from './components/form/SidebarForm';
import { CVPreview } from './components/preview/CVPreview';
import { generatePDF, validateCVForExport, suggestFilename } from './utils/pdfGenerator';
import { useCVStore } from './store/cvStore';

function App() {
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState(null); // success | error
  const [exportMessage, setExportMessage] = useState('');

  const cvData = useCVStore();

  const handleExport = async () => {
    setIsExporting(true);
    setExportStatus(null);
    setExportMessage('');

    try {
      // Validate CV data before export
      const validation = validateCVForExport(cvData);

      if (!validation.isValid) {
        setExportStatus('error');
        setExportMessage(`Please fix the following issues before exporting:\n• ${validation.issues.join('\n• ')}`);
        return;
      }

      // Generate suggested filename
      const filename = suggestFilename(cvData);

      // Generate and download PDF
      const result = await generatePDF(filename);

      if (result.success) {
        setExportStatus('success');
        setExportMessage(result.message);
      } else {
        setExportStatus('error');
        setExportMessage(result.message);
      }
    } catch (error) {
      console.error('Export error:', error);
      setExportStatus('error');
      setExportMessage(`An unexpected error occurred: ${error.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  const closeStatusMessage = () => {
    setExportStatus(null);
    setExportMessage('');
  };

  return (
    <div className="h-screen flex flex-col">
      <Header onExport={handleExport} />

      <SplitScreenLayout
        leftPanel={<SidebarForm />}
        rightPanel={<CVPreview />}
      />

      {/* Loading overlay during PDF export */}
      {isExporting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-700">Generating your PDF...</p>
            <p className="text-sm text-gray-500 mt-2">This may take a few seconds</p>
          </div>
        </div>
      )}

      {/* Status notification */}
      {exportStatus && (
        <div className="fixed bottom-4 right-4 z-50">
          <div
            className={`max-w-sm rounded-lg shadow-lg p-4 ${
              exportStatus === 'success'
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {exportStatus === 'success' ? (
                  <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
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
                    exportStatus === 'success' ? 'text-green-800' : 'text-red-800'
                  }`}
                >
                  {exportStatus === 'success' ? 'Export Successful!' : 'Export Failed'}
                </p>
                <p
                  className={`text-sm mt-1 whitespace-pre-line ${
                    exportStatus === 'success' ? 'text-green-700' : 'text-red-700'
                  }`}
                >
                  {exportMessage}
                </p>
              </div>
              <div className="ml-4 flex-shrink-0">
                <button
                  onClick={closeStatusMessage}
                  className={`inline-flex rounded-md p-1.5 hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    exportStatus === 'success'
                      ? 'text-green-500 hover:bg-green-200 focus:ring-green-600'
                      : 'text-red-500 hover:bg-red-200 focus:ring-red-600'
                  }`}
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
