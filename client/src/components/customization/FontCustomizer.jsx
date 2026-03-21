import React from 'react';
import { useTemplateStore } from '../../store/templateStore';

export const FontCustomizer = () => {
  const { customization, updateCustomization } = useTemplateStore();

  const fontOptions = [
    {
      name: 'Inter',
      family: 'Inter',
      description: 'Modern and clean',
      preview: 'AaBbCc 123',
    },
    {
      name: 'Open Sans',
      family: 'Open Sans',
      description: 'Professional and readable',
      preview: 'AaBbCc 123',
    },
    {
      name: 'Roboto',
      family: 'Roboto',
      description: 'Clean and contemporary',
      preview: 'AaBbCc 123',
    },
    {
      name: 'Lato',
      family: 'Lato',
      description: 'Friendly and professional',
      preview: 'AaBbCc 123',
    },
    {
      name: 'Georgia',
      family: 'Georgia',
      description: 'Classic serif style',
      preview: 'AaBbCc 123',
    },
  ];

  const handleFontChange = (fontFamily) => {
    updateCustomization({ fontFamily });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-1">Font Family</h3>
        <p className="text-xs text-gray-600 mb-4">
          Choose a font that matches your professional style
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {fontOptions.map((font) => (
          <div
            key={font.family}
            onClick={() => handleFontChange(font.family)}
            className={`
              relative p-4 border-2 rounded-lg cursor-pointer transition-all
              ${customization.fontFamily === font.family
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 bg-white'
              }
            `}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div className="font-medium text-gray-900">{font.name}</div>
                  <div className="text-xs text-gray-500">{font.description}</div>
                </div>

                <div
                  className="mt-2 text-lg text-gray-700"
                  style={{ fontFamily: font.family }}
                >
                  {font.preview}
                </div>

                <div
                  className="mt-1 text-sm text-gray-600"
                  style={{ fontFamily: font.family }}
                >
                  The quick brown fox jumps over the lazy dog
                </div>
              </div>

              {customization.fontFamily === font.family && (
                <div className="flex-shrink-0 ml-3">
                  <div className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-medium text-blue-900 mb-2">💡 Font Tips</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• <strong>Sans-serif fonts</strong> (Inter, Open Sans, Roboto, Lato) are modern and ATS-friendly</li>
          <li>• <strong>Serif fonts</strong> (Georgia) give a traditional, academic appearance</li>
          <li>• All fonts are web-safe and will display correctly in PDF exports</li>
          <li>• Consider your industry: tech prefers sans-serif, academia often uses serif</li>
        </ul>
      </div>
    </div>
  );
};