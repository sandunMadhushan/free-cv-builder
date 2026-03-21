import React from "react";
import { useTemplateStore } from "../../store/templateStore";

export const TypographyCustomizer = () => {
  const { customization, updateCustomization } = useTemplateStore();

  const fontSizeOptions = [
    {
      id: "small",
      label: "Small",
      description: "More content, less emphasis",
      sample: "text-sm",
    },
    {
      id: "medium",
      label: "Medium",
      description: "Balanced readability",
      sample: "text-base",
    },
    {
      id: "large",
      label: "Large",
      description: "Better visibility, larger print",
      sample: "text-lg",
    },
  ];

  const spacingOptions = [
    {
      id: "compact",
      label: "Compact",
      description: "More content on page",
      preview: "Tight spacing between sections",
    },
    {
      id: "comfortable",
      label: "Comfortable",
      description: "Balanced white space",
      preview: "Standard spacing for readability",
    },
    {
      id: "spacious",
      label: "Spacious",
      description: "Generous white space",
      preview: "Plenty of breathing room",
    },
  ];

  const accentStyleOptions = [
    {
      id: "bold",
      label: "Bold",
      description: "Strong emphasis",
      sample: "font-bold",
    },
    {
      id: "italic",
      label: "Italic",
      description: "Elegant emphasis",
      sample: "italic",
    },
    {
      id: "underline",
      label: "Underline",
      description: "Classic emphasis",
      sample: "underline",
    },
  ];

  const handleFontSizeChange = (fontSize) => {
    updateCustomization({ fontSize });
  };

  const handleSpacingChange = (spacing) => {
    updateCustomization({ spacing });
  };

  const handleAccentStyleChange = (accentStyle) => {
    updateCustomization({ accentStyle });
  };

  const OptionSelector = ({
    title,
    description,
    options,
    currentValue,
    onChange,
    renderPreview,
  }) => (
    <div className="space-y-3">
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-1">{title}</h3>
        <p className="text-xs text-gray-600 mb-3">{description}</p>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => onChange(option.id)}
            className={`
              text-left p-3 border rounded-lg transition-all
              ${
                currentValue === option.id
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300 bg-white"
              }
            `}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="font-medium text-gray-900">{option.label}</div>
                <div className="text-xs text-gray-600 mt-1">
                  {option.description}
                </div>
                {renderPreview && renderPreview(option)}
              </div>

              {currentValue === option.id && (
                <div className="flex-shrink-0 ml-3">
                  <div className="w-4 h-4 bg-blue-600 text-white rounded-full flex items-center justify-center">
                    <svg
                      className="w-2.5 h-2.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Font Size */}
      <OptionSelector
        title="Font Size"
        description="Adjust the overall text size of your CV"
        options={fontSizeOptions}
        currentValue={customization.fontSize}
        onChange={handleFontSizeChange}
        renderPreview={(option) => (
          <div className={`mt-2 ${option.sample} text-gray-700`}>
            Sample text size preview
          </div>
        )}
      />

      {/* Spacing */}
      <OptionSelector
        title="Spacing"
        description="Control the amount of white space between sections"
        options={spacingOptions}
        currentValue={customization.spacing}
        onChange={handleSpacingChange}
        renderPreview={(option) => (
          <div className="mt-2 text-xs text-gray-500">{option.preview}</div>
        )}
      />

      {/* Accent Style */}
      <OptionSelector
        title="Accent Style"
        description="Choose how headings and important text are emphasized"
        options={accentStyleOptions}
        currentValue={customization.accentStyle}
        onChange={handleAccentStyleChange}
        renderPreview={(option) => (
          <div className={`mt-2 text-sm text-gray-700 ${option.sample}`}>
            Section Heading Example
          </div>
        )}
      />

      {/* Typography Tips */}
      <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
        <h3 className="font-medium text-indigo-900 mb-2">✨ Typography Tips</h3>
        <ul className="text-sm text-indigo-700 space-y-1">
          <li>
            • <strong>Small font:</strong> Best for detailed CVs with lots of
            experience
          </li>
          <li>
            • <strong>Large font:</strong> Good for senior positions or
            accessibility needs
          </li>
          <li>
            • <strong>Compact spacing:</strong> Fits more content on single page
          </li>
          <li>
            • <strong>Spacious spacing:</strong> More readable, professional
            appearance
          </li>
          <li>
            • <strong>Bold headings:</strong> Modern, ATS-friendly choice
          </li>
        </ul>
      </div>
    </div>
  );
};
