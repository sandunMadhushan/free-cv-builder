import React, { useState } from 'react';
import { Header } from './components/layout/Header';
import { SplitScreenLayout } from './components/layout/SplitScreenLayout';
import { SidebarForm } from './components/form/SidebarForm';
import { CVPreview } from './components/preview/CVPreview';
import { generatePDF } from './utils/pdfGenerator';

function App() {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const success = await generatePDF('my-resume.pdf');
      if (success) {
        alert('PDF exported successfully!');
      } else {
        alert('Failed to export PDF. Please try again.');
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('An error occurred while exporting PDF.');
    } finally {
      setIsExporting(false);
    }
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
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
