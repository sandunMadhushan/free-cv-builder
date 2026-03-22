import React, { useState, useRef, useEffect } from 'react';

export const RichTextEditor = ({
  value = '',
  onChange,
  placeholder = 'Enter your text...',
  className = '',
  maxLength = 2000,
  showWordCount = true,
  toolbar = ['bold', 'italic', 'underline', 'bulletList', 'numberedList'],
  disabled = false,
  error,
  success,
  ...props
}) => {
  const [content, setContent] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const editorRef = useRef(null);
  const toolbarRef = useRef(null);

  useEffect(() => {
    setContent(value);
    updateWordCount(value);
  }, [value]);

  const updateWordCount = (text) => {
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  };

  const handleInput = (e) => {
    const newContent = e.target.innerHTML;
    setContent(newContent);
    updateWordCount(e.target.textContent);
    onChange && onChange(newContent);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const execCommand = (command, value = null) => {
    if (!editorRef.current) return;

    editorRef.current.focus();
    document.execCommand(command, false, value);

    // Update content after command execution
    const newContent = editorRef.current.innerHTML;
    setContent(newContent);
    updateWordCount(editorRef.current.textContent);
    onChange && onChange(newContent);
  };

  const isCommandActive = (command) => {
    return document.queryCommandState(command);
  };

  const ToolbarButton = ({ command, icon, title, value = null }) => {
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
      const checkActive = () => {
        if (editorRef.current && document.activeElement === editorRef.current) {
          setIsActive(isCommandActive(command));
        }
      };

      const handleSelectionChange = () => {
        checkActive();
      };

      document.addEventListener('selectionchange', handleSelectionChange);
      return () => document.removeEventListener('selectionchange', handleSelectionChange);
    }, [command]);

    return (
      <button
        type="button"
        onClick={() => execCommand(command, value)}
        disabled={disabled}
        className={`
          p-2 rounded-md transition-all duration-150
          hover:bg-surface-100 dark:hover:bg-surface-700
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1
          disabled:opacity-50 disabled:cursor-not-allowed
          ${isActive
            ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
            : 'text-surface-600 dark:text-surface-400'
          }
        `}
        title={title}
      >
        {icon}
      </button>
    );
  };

  const toolbarItems = {
    bold: {
      command: 'bold',
      icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M3 4h4.5a3 3 0 110 6H3V4zm0 8h5.5a3 3 0 110 6H3v-6z"/></svg>,
      title: 'Bold (Ctrl+B)'
    },
    italic: {
      command: 'italic',
      icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M7 3h6l-2 12H5l2-12z"/></svg>,
      title: 'Italic (Ctrl+I)'
    },
    underline: {
      command: 'underline',
      icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M4 17h12v2H4v-2zM6 3v8a4 4 0 008 0V3h2v8a6 6 0 01-12 0V3h2z"/></svg>,
      title: 'Underline (Ctrl+U)'
    },
    bulletList: {
      command: 'insertUnorderedList',
      icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M3 7h2v2H3V7zm0 4h2v2H3v-2zm0-8h2v2H3V3zm4 0h10v2H7V3zm0 8h10v2H7v-2zm0-4h10v2H7V7z"/></svg>,
      title: 'Bullet List'
    },
    numberedList: {
      command: 'insertOrderedList',
      icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M2 7h1v2H2V7zm0 4h1v2H2v-2zm0-8h1v2H2V3zm3 0h13v2H5V3zm0 8h13v2H5v-2zm0-4h13v2H5V7z"/></svg>,
      title: 'Numbered List'
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Toolbar */}
      <div
        ref={toolbarRef}
        className={`
          flex items-center gap-1 p-2 border border-b-0 rounded-t-md
          bg-surface-50 dark:bg-surface-800
          border-surface-300 dark:border-surface-600
          transition-all duration-150
          ${isFocused ? 'border-primary-500 dark:border-primary-400' : ''}
          ${error ? 'border-danger-500 dark:border-danger-400' : ''}
          ${success ? 'border-success-500 dark:border-success-400' : ''}
          ${disabled ? 'opacity-60' : ''}
        `}
      >
        {toolbar.map((tool, index) => {
          const toolItem = toolbarItems[tool];
          return toolItem ? (
            <ToolbarButton
              key={tool}
              command={toolItem.command}
              icon={toolItem.icon}
              title={toolItem.title}
            />
          ) : null;
        })}

        {/* Divider */}
        <div className="w-px h-6 bg-surface-300 dark:bg-surface-600 mx-1" />

        {/* Clear formatting */}
        <button
          type="button"
          onClick={() => execCommand('removeFormat')}
          disabled={disabled}
          className="
            p-2 rounded-md transition-all duration-150
            hover:bg-surface-100 dark:hover:bg-surface-700
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1
            text-surface-600 dark:text-surface-400
            disabled:opacity-50 disabled:cursor-not-allowed
          "
          title="Clear formatting"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable={!disabled}
        onInput={handleInput}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`
          min-h-[120px] max-h-[300px] overflow-y-auto p-3
          border border-t-0 rounded-b-md
          bg-white dark:bg-surface-700
          text-surface-900 dark:text-surface-100
          border-surface-300 dark:border-surface-600
          focus:outline-none transition-all duration-150
          resize-none prose prose-sm max-w-none
          ${isFocused ? 'border-primary-500 dark:border-primary-400' : ''}
          ${error ? 'border-danger-500 dark:border-danger-400' : ''}
          ${success ? 'border-success-500 dark:border-success-400' : ''}
          ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-text'}
        `}
        style={{
          WebkitUserModify: disabled ? 'read-only' : 'read-write-plaintext-only',
        }}
        dangerouslySetInnerHTML={{ __html: content || `<p class="text-surface-500 dark:text-surface-400 italic">${placeholder}</p>` }}
        {...props}
      />

      {/* Footer */}
      <div className="flex justify-between items-center mt-2 text-xs">
        {showWordCount && (
          <span className="text-surface-500 dark:text-surface-400">
            {wordCount} words
            {maxLength && (
              <span className={wordCount > maxLength * 0.9 ? 'text-warning-500' : ''}>
                {maxLength && ` • ${Math.max(0, maxLength - content.length)} characters remaining`}
              </span>
            )}
          </span>
        )}

        {/* Error/Success Message */}
        <div>
          {error && (
            <span className="text-danger-600 dark:text-danger-400 fade-in-corporate shake-error">
              {error}
            </span>
          )}
          {success && !error && (
            <span className="text-success-600 dark:text-success-400 fade-in-corporate">
              {success}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// Professional Select Component
export const Select = ({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option...',
  required = false,
  error,
  success,
  disabled = false,
  className = '',
  searchable = false,
  multiSelect = false,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedValues, setSelectedValues] = useState(
    multiSelect ? (Array.isArray(value) ? value : []) : value
  );
  const selectRef = useRef(null);

  const filteredOptions = searchable
    ? options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  const handleSelect = (option) => {
    if (multiSelect) {
      const newValues = selectedValues.includes(option.value)
        ? selectedValues.filter(v => v !== option.value)
        : [...selectedValues, option.value];
      setSelectedValues(newValues);
      onChange && onChange(newValues);
    } else {
      setSelectedValues(option.value);
      onChange && onChange(option.value);
      setIsOpen(false);
    }
  };

  const getDisplayText = () => {
    if (multiSelect) {
      const selected = options.filter(opt => selectedValues.includes(opt.value));
      return selected.length > 0
        ? selected.map(opt => opt.label).join(', ')
        : placeholder;
    } else {
      const selected = options.find(opt => opt.value === selectedValues);
      return selected ? selected.label : placeholder;
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative w-full ${className}`} ref={selectRef}>
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
        <span className={selectedValues ? 'text-surface-900 dark:text-surface-100' : 'text-surface-500 dark:text-surface-400'}>
          {getDisplayText()}
        </span>
        <svg
          className={`w-4 h-4 transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-surface-800 border border-surface-300 dark:border-surface-600 rounded-md shadow-lg max-h-60 overflow-auto">
          {searchable && (
            <div className="p-2 border-b border-surface-200 dark:border-surface-600">
              <input
                type="text"
                placeholder="Search options..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-2 py-1 text-sm border border-surface-300 dark:border-surface-600 rounded bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-100"
              />
            </div>
          )}
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option)}
                className={`
                  w-full px-3 py-2 text-left hover:bg-surface-100 dark:hover:bg-surface-700
                  text-surface-900 dark:text-surface-100 transition-colors duration-150
                  ${(multiSelect ? selectedValues.includes(option.value) : selectedValues === option.value)
                    ? 'bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                    : ''
                  }
                `}
              >
                {multiSelect && (
                  <input
                    type="checkbox"
                    checked={selectedValues.includes(option.value)}
                    onChange={() => {}} // Handled by button click
                    className="mr-2"
                  />
                )}
                {option.label}
              </button>
            ))
          ) : (
            <div className="px-3 py-2 text-surface-500 dark:text-surface-400 text-sm">
              No options found
            </div>
          )}
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