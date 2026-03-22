import React, { useState, useEffect } from 'react';
import { Button } from '../common/Button';
import { Select } from '../common/AdvancedFormComponents';
import { Input } from '../common/Input';
import {
  EXPORT_FORMATS,
  EXPORT_QUALITIES,
  PAGE_FORMATS,
  MARGIN_PRESETS,
  EnhancedPDFGenerator,
  validateExportData
} from '../../utils/enhancedPDFGenerator';
import { useCVStore } from '../../store/cvStore';

export const ProfessionalExportModal = ({ isOpen, onClose }) => {
  const [exportConfig, setExportConfig] = useState({
    format: 'visual',
    quality: 'high',
    pageFormat: 'a4',
    margins: 'standard',
    filename: '',
    includeMetadata: true,
    password: '',
    watermark: null,
    customOptions: {
      includePhoto: true,
      colorMode: 'color', // color, grayscale, blackwhite
      compression: 'balanced', // none, balanced, maximum
      accessibility: true
    }
  });

  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportResult, setExportResult] = useState(null);
  const [validationResult, setValidationResult] = useState({ isValid: true, issues: [] });
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  const cvData = useCVStore((state) => state.cvData);

  // Validate CV data on component mount and when data changes
  useEffect(() => {
    const validation = validateExportData(cvData);
    setValidationResult(validation);

    // Auto-generate filename
    if (!exportConfig.filename && cvData.personalInfo?.fullName) {
      const generator = new EnhancedPDFGenerator();
      const suggestedFilename = generator.generateFilename(cvData, exportConfig);
      setExportConfig(prev => ({ ...prev, filename: suggestedFilename }));
    }
  }, [cvData, exportConfig.format, exportConfig.quality]);

  const handleExportConfigChange = (key, value) => {
    setExportConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleCustomOptionChange = (key, value) => {
    setExportConfig(prev => ({
      ...prev,
      customOptions: {
        ...prev.customOptions,
        [key]: value
      }
    }));
  };

  const handleExport = async () => {
    if (!validationResult.isValid) {
      return;
    }

    setIsExporting(true);
    setExportProgress(0);
    setExportResult(null);

    try {
      // Simulate export progress
      const progressInterval = setInterval(() => {
        setExportProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const generator = new EnhancedPDFGenerator();

      // Prepare metadata
      const metadata = exportConfig.includeMetadata ? {
        title: `${cvData.personalInfo?.fullName || 'Professional'} - Resume`,
        author: cvData.personalInfo?.fullName || '',
        subject: 'Professional Resume/CV Document',
        keywords: [
          cvData.personalInfo?.fullName,
          'resume', 'cv', 'professional',
          ...(cvData.skills?.technical || []).slice(0, 5)
        ].filter(Boolean).join(', '),
        creator: 'Professional CV Builder',
        producer: 'Professional CV Builder v2.0'
      } : null;

      // Prepare export options
      const exportOptions = {
        ...exportConfig,
        metadata,
        password: exportConfig.password || null,
        filename: exportConfig.filename || undefined
      };

      // Generate PDF
      const result = await generator.generatePDF('cv-preview-print', cvData, exportOptions);

      clearInterval(progressInterval);
      setExportProgress(100);
      setExportResult(result);

    } catch (error) {
      console.error('Export error:', error);
      setExportResult({
        success: false,
        message: `Export failed: ${error.message}`,
        error
      });
    }

    setTimeout(() => {
      setIsExporting(false);
      setExportProgress(0);
    }, 1500);
  };

  const FormatCard = ({ formatKey, format, selected, onSelect }) => (
    <div
      onClick={() => onSelect(formatKey)}
      className={`
        p-4 border-2 rounded-lg cursor-pointer transition-all duration-200
        ${selected
          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
          : 'border-surface-200 dark:border-surface-700 hover:border-primary-300 dark:hover:border-primary-600'
        }
      `}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-surface-900 dark:text-surface-100">
          {format.name}
        </h3>
        {selected && (
          <div className="w-5 h-5 bg-primary-600 text-white rounded-full flex items-center justify-center">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>

      <p className="text-sm text-surface-600 dark:text-surface-400 mb-3">
        {format.description}
      </p>

      <div className="space-y-2">
        <div>
          <p className="text-xs font-medium text-success-700 dark:text-success-400 mb-1">Pros:</p>
          <ul className="text-xs text-success-600 dark:text-success-400 space-y-0.5">
            {format.pros.map((pro, index) => (
              <li key={index} className="flex items-center">
                <span className="w-1 h-1 bg-success-500 rounded-full mr-2"></span>
                {pro}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-medium text-warning-700 dark:text-warning-400 mb-1">Considerations:</p>
          <ul className="text-xs text-warning-600 dark:text-warning-400 space-y-0.5">
            {format.cons.map((con, index) => (
              <li key={index} className="flex items-center">
                <span className="w-1 h-1 bg-warning-500 rounded-full mr-2"></span>
                {con}
              </li>
            ))}
          </ul>
        </div>

        {format.recommended && (
          <div className="pt-2 border-t border-surface-200 dark:border-surface-700">
            <p className="text-xs text-surface-500 dark:text-surface-400">
              <span className="font-medium">Recommended for:</span> {format.recommended.join(', ')}
            </p>
          </div>
        )}
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-surface-900/60 dark:bg-surface-100/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-4xl mx-4 max-h-[90vh] bg-white dark:bg-surface-900 rounded-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white dark:bg-surface-900 border-b border-surface-200 dark:border-surface-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-surface-900 dark:text-surface-100">
                Professional Export Options
              </h2>
              <p className="text-sm text-surface-600 dark:text-surface-400">
                Configure your resume export with professional formatting options
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)] p-6 space-y-6">
          {/* Validation Issues */}
          {!validationResult.isValid && (
            <div className="bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 p-4 rounded-lg">
              <h3 className="font-medium text-danger-900 dark:text-danger-100 mb-2">
                ⚠️ Please address these issues before exporting:
              </h3>
              <ul className="text-sm text-danger-800 dark:text-danger-200 space-y-1">
                {validationResult.issues.map((issue, index) => (
                  <li key={index} className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-danger-500 rounded-full mr-2"></span>
                    {issue}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Format Selection */}
          <div>
            <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-4">
              Choose Export Format
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              {Object.entries(EXPORT_FORMATS).map(([key, format]) => (
                <FormatCard
                  key={key}
                  formatKey={key}
                  format={format}
                  selected={exportConfig.format === key}
                  onSelect={(formatKey) => handleExportConfigChange('format', formatKey)}
                />
              ))}
            </div>
          </div>

          {/* Quality and Format Settings */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-4">
                Quality Settings
              </h3>
              <div className="space-y-4">
                <Select
                  label="Export Quality"
                  value={exportConfig.quality}
                  onChange={(value) => handleExportConfigChange('quality', value)}
                  options={Object.entries(EXPORT_QUALITIES).map(([key, quality]) => ({
                    value: key,
                    label: `${quality.name} - ${quality.description}`
                  }))}
                />

                <Select
                  label="Page Format"
                  value={exportConfig.pageFormat}
                  onChange={(value) => handleExportConfigChange('pageFormat', value)}
                  options={Object.entries(PAGE_FORMATS).map(([key, format]) => ({
                    value: key,
                    label: format.name
                  }))}
                />

                <Select
                  label="Page Margins"
                  value={exportConfig.margins}
                  onChange={(value) => handleExportConfigChange('margins', value)}
                  options={Object.entries(MARGIN_PRESETS).map(([key, preset]) => ({
                    value: key,
                    label: preset.name
                  }))}
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-4">
                File Options
              </h3>
              <div className="space-y-4">
                <Input
                  label="Filename"
                  value={exportConfig.filename}
                  onChange={(e) => handleExportConfigChange('filename', e.target.value)}
                  placeholder="resume.pdf"
                />

                <Input
                  label="Password Protection (Optional)"
                  type="password"
                  value={exportConfig.password}
                  onChange={(e) => handleExportConfigChange('password', e.target.value)}
                  placeholder="Enter password to protect PDF"
                />

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="includeMetadata"
                    checked={exportConfig.includeMetadata}
                    onChange={(e) => handleExportConfigChange('includeMetadata', e.target.checked)}
                    className="rounded border-surface-300 dark:border-surface-600"
                  />
                  <label htmlFor="includeMetadata" className="text-sm text-surface-700 dark:text-surface-300">
                    Include professional metadata
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Advanced Options */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
                Advanced Options
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
              >
                {showAdvancedOptions ? 'Hide' : 'Show'} Advanced
              </Button>
            </div>

            {showAdvancedOptions && (
              <div className="grid md:grid-cols-2 gap-6 p-4 bg-surface-50 dark:bg-surface-800 rounded-lg">
                <div className="space-y-4">
                  <Select
                    label="Color Mode"
                    value={exportConfig.customOptions.colorMode}
                    onChange={(value) => handleCustomOptionChange('colorMode', value)}
                    options={[
                      { value: 'color', label: 'Full Color' },
                      { value: 'grayscale', label: 'Grayscale' },
                      { value: 'blackwhite', label: 'Black & White' }
                    ]}
                  />

                  <Select
                    label="Compression"
                    value={exportConfig.customOptions.compression}
                    onChange={(value) => handleCustomOptionChange('compression', value)}
                    options={[
                      { value: 'none', label: 'No Compression (Largest)' },
                      { value: 'balanced', label: 'Balanced (Recommended)' },
                      { value: 'maximum', label: 'Maximum (Smallest)' }
                    ]}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="includePhoto"
                      checked={exportConfig.customOptions.includePhoto}
                      onChange={(e) => handleCustomOptionChange('includePhoto', e.target.checked)}
                      className="rounded border-surface-300 dark:border-surface-600"
                    />
                    <label htmlFor="includePhoto" className="text-sm text-surface-700 dark:text-surface-300">
                      Include profile photo
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="accessibility"
                      checked={exportConfig.customOptions.accessibility}
                      onChange={(e) => handleCustomOptionChange('accessibility', e.target.checked)}
                      className="rounded border-surface-300 dark:border-surface-600"
                    />
                    <label htmlFor="accessibility" className="text-sm text-surface-700 dark:text-surface-300">
                      Accessibility features
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Export Progress */}
          {isExporting && (
            <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-primary-900 dark:text-primary-100">
                  Generating professional PDF...
                </span>
                <span className="text-sm text-primary-700 dark:text-primary-300">
                  {exportProgress}%
                </span>
              </div>
              <div className="w-full bg-primary-200 dark:bg-primary-800 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${exportProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Export Result */}
          {exportResult && (
            <div className={`p-4 rounded-lg ${
              exportResult.success
                ? 'bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800'
                : 'bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800'
            }`}>
              <div className="flex items-start">
                <div className={`w-5 h-5 rounded-full mr-3 mt-0.5 flex items-center justify-center ${
                  exportResult.success ? 'bg-success-500' : 'bg-danger-500'
                }`}>
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    {exportResult.success ? (
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    ) : (
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    )}
                  </svg>
                </div>
                <div className="flex-1">
                  <p className={`font-medium ${
                    exportResult.success
                      ? 'text-success-900 dark:text-success-100'
                      : 'text-danger-900 dark:text-danger-100'
                  }`}>
                    {exportResult.success ? 'Export Successful!' : 'Export Failed'}
                  </p>
                  <p className={`text-sm mt-1 ${
                    exportResult.success
                      ? 'text-success-800 dark:text-success-200'
                      : 'text-danger-800 dark:text-danger-200'
                  }`}>
                    {exportResult.message}
                  </p>
                  {exportResult.success && (
                    <div className="mt-2 text-xs space-y-1">
                      <div className="text-success-700 dark:text-success-300">
                        Format: {exportResult.format} | Quality: {exportConfig.quality}
                      </div>
                      <div className="text-success-700 dark:text-success-300">
                        ATS Compatibility: {exportResult.atsCompatibility}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white dark:bg-surface-900 border-t border-surface-200 dark:border-surface-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-surface-600 dark:text-surface-400">
              {validationResult.isValid ? (
                `Ready to export as ${EXPORT_FORMATS[exportConfig.format].name}`
              ) : (
                'Please address validation issues before exporting'
              )}
            </div>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isExporting}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleExport}
                disabled={!validationResult.isValid || isExporting}
                loading={isExporting}
              >
                {isExporting ? 'Generating...' : 'Export PDF'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};