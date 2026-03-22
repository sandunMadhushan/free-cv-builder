import React, { useState, useRef, useEffect } from 'react';

// Professional DatePicker Component
export const DatePicker = ({
  label,
  value,
  onChange,
  placeholder = 'Select date...',
  required = false,
  error,
  success,
  disabled = false,
  className = '',
  variant = 'full', // 'full', 'month-year', 'year-only'
  allowFuture = true,
  allowPast = true,
  minDate,
  maxDate,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value || '');
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const datePickerRef = useRef(null);

  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return '';

    if (variant === 'year-only') {
      return dateStr;
    }

    if (variant === 'month-year') {
      const [year, month] = dateStr.split('-');
      const date = new Date(year, month - 1);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    }

    // Full date format
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDateSelect = (date) => {
    let formatData;

    if (variant === 'year-only') {
      formatData = date.getFullYear().toString();
    } else if (variant === 'month-year') {
      formatData = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    } else {
      formatData = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }

    setInputValue(formatData);
    onChange && onChange(formatData);
    setIsOpen(false);
  };

  const renderCalendar = () => {
    if (variant === 'year-only') {
      const startYear = Math.floor(currentYear / 10) * 10;
      const years = [];

      for (let i = 0; i < 12; i++) {
        const year = startYear + i;
        years.push(
          <button
            key={year}
            onClick={() => handleDateSelect(new Date(year, 0, 1))}
            className={`
              p-2 text-sm rounded hover:bg-primary-100 dark:hover:bg-primary-800
              ${inputValue === year.toString()
                ? 'bg-primary-600 text-white'
                : 'text-surface-700 dark:text-surface-300'
              }
            `}
          >
            {year}
          </button>
        );
      }

      return (
        <div className="grid grid-cols-3 gap-1 p-2">
          {years}
        </div>
      );
    }

    if (variant === 'month-year') {
      const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];

      return (
        <div className="p-2">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => setCurrentYear(currentYear - 1)}
              className="p-1 rounded hover:bg-surface-100 dark:hover:bg-surface-700"
            >
              ←
            </button>
            <span className="font-medium">{currentYear}</span>
            <button
              onClick={() => setCurrentYear(currentYear + 1)}
              className="p-1 rounded hover:bg-surface-100 dark:hover:bg-surface-700"
            >
              →
            </button>
          </div>
          <div className="grid grid-cols-3 gap-1">
            {months.map((month, index) => {
              const monthValue = `${currentYear}-${String(index + 1).padStart(2, '0')}`;
              return (
                <button
                  key={month}
                  onClick={() => handleDateSelect(new Date(currentYear, index, 1))}
                  className={`
                    p-2 text-xs rounded hover:bg-primary-100 dark:hover:bg-primary-800
                    ${inputValue === monthValue
                      ? 'bg-primary-600 text-white'
                      : 'text-surface-700 dark:text-surface-300'
                    }
                  `}
                >
                  {month}
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    // Full calendar implementation would be more complex
    // For now, return a simplified month/year input
    return (
      <div className="p-4 space-y-4">
        <input
          type="date"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            onChange && onChange(e.target.value);
            setIsOpen(false);
          }}
          min={minDate}
          max={maxDate}
          className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-md bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-100"
        />
      </div>
    );
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative w-full ${className}`} ref={datePickerRef}>
      {label && (
        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
          {label}
          {required && <span className="text-danger-500 dark:text-danger-400 ml-1">*</span>}
        </label>
      )}

      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full px-3 py-2 text-left border rounded-md
          bg-white dark:bg-surface-700
          text-surface-900 dark:text-surface-100
          border-surface-300 dark:border-surface-600
          focus:outline-none focus:ring-2 focus:border-transparent
          transition-all duration-150 flex items-center justify-between
          ${error ? 'border-danger-500 dark:border-danger-400 focus:ring-danger-500' : ''}
          ${success ? 'border-success-500 dark:border-success-400 focus:ring-success-500' : ''}
          ${!error && !success ? 'focus:ring-primary-500 dark:focus:ring-primary-400' : ''}
          ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:border-surface-400 dark:hover:border-surface-500'}
        `}
        {...props}
      >
        <span className={inputValue ? 'text-surface-900 dark:text-surface-100' : 'text-surface-500 dark:text-surface-400'}>
          {inputValue ? formatDateDisplay(inputValue) : placeholder}
        </span>
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
        </svg>
      </button>

      {/* Calendar Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-surface-800 border border-surface-300 dark:border-surface-600 rounded-md shadow-lg">
          {renderCalendar()}
        </div>
      )}

      {/* Error/Success Message */}
      {error && (
        <p className="mt-1 text-sm text-danger-600 dark:text-danger-400 fade-in-corporate shake-error">
          {error}
        </p>
      )}
      {success && !error && (
        <p className="mt-1 text-sm text-success-600 dark:text-success-400 fade-in-corporate">
          {success}
        </p>
      )}
    </div>
  );
};

// Professional FileUpload Component
export const FileUpload = ({
  label,
  accept = '*/*',
  multiple = false,
  maxSize = 5 * 1024 * 1024, // 5MB default
  maxFiles = 5,
  onChange,
  onError,
  disabled = false,
  className = '',
  dragAndDrop = true,
  showPreview = true,
  allowedTypes = [],
  ...props
}) => {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    const errors = [];

    // Size validation
    if (file.size > maxSize) {
      errors.push(`File size exceeds ${(maxSize / (1024 * 1024)).toFixed(1)}MB limit`);
    }

    // Type validation
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      errors.push(`File type ${file.type} is not allowed`);
    }

    return errors;
  };

  const handleFileSelect = (selectedFiles) => {
    const fileList = Array.from(selectedFiles);
    const validFiles = [];
    const errors = [];

    // Validate each file
    fileList.forEach(file => {
      const fileErrors = validateFile(file);
      if (fileErrors.length > 0) {
        errors.push(`${file.name}: ${fileErrors.join(', ')}`);
      } else {
        validFiles.push(file);
      }
    });

    // Check total file count
    if (!multiple && validFiles.length > 1) {
      errors.push('Only one file is allowed');
      return;
    }

    if (multiple && (files.length + validFiles.length) > maxFiles) {
      errors.push(`Maximum ${maxFiles} files allowed`);
      return;
    }

    if (errors.length > 0) {
      onError && onError(errors);
      return;
    }

    const newFiles = multiple ? [...files, ...validFiles] : validFiles;
    setFiles(newFiles);
    onChange && onChange(newFiles);
  };

  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onChange && onChange(newFiles);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) {
      return (
        <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
        </svg>
      );
    }

    if (fileType === 'application/pdf') {
      return (
        <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
        </svg>
      );
    }

    return (
      <svg className="w-6 h-6 text-surface-500" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
      </svg>
    );
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled && dragAndDrop) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    if (!disabled && dragAndDrop) {
      const droppedFiles = e.dataTransfer.files;
      handleFileSelect(droppedFiles);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
          {label}
        </label>
      )}

      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200
          ${isDragging
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
            : 'border-surface-300 dark:border-surface-600 hover:border-surface-400 dark:hover:border-surface-500'
          }
          ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
        `}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <div className="space-y-2">
          <svg
            className={`mx-auto w-12 h-12 ${isDragging ? 'text-primary-500' : 'text-surface-400'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 48 48"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
            />
          </svg>

          <div>
            <p className="text-sm text-surface-600 dark:text-surface-400">
              {dragAndDrop ? (
                <>
                  <span className="font-medium text-primary-600 dark:text-primary-400">
                    Click to upload
                  </span>{' '}
                  or drag and drop
                </>
              ) : (
                <span className="font-medium text-primary-600 dark:text-primary-400">
                  Click to upload
                </span>
              )}
            </p>
            <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">
              {allowedTypes.length > 0
                ? `Supported: ${allowedTypes.join(', ')}`
                : `Max size: ${(maxSize / (1024 * 1024)).toFixed(1)}MB`
              }
            </p>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
          disabled={disabled}
          {...props}
        />
      </div>

      {/* File List */}
      {files.length > 0 && showPreview && (
        <div className="mt-4 space-y-2">
          {files.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center justify-between p-3 bg-surface-50 dark:bg-surface-800 rounded-lg border border-surface-200 dark:border-surface-600"
            >
              <div className="flex items-center space-x-3">
                {getFileIcon(file.type)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-surface-900 dark:text-surface-100 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-surface-500 dark:text-surface-400">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(index);
                }}
                className="p-1 text-surface-400 hover:text-danger-600 dark:hover:text-danger-400 transition-colors duration-150"
                title="Remove file"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};