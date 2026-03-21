import React from 'react';
import { useTemplateStore } from '../../store/templateStore';

export const ColorCustomizer = () => {
  const customization = useTemplateStore((state) => state.customization);
  const updateCustomization = useTemplateStore((state) => state.updateCustomization);

  const colorOptions = [
    { name: 'Blue', value: '#3b82f6', description: 'Professional and trustworthy' },
    { name: 'Indigo', value: '#6366f1', description: 'Modern and sophisticated' },
    { name: 'Purple', value: '#8b5cf6', description: 'Creative and innovative' },
    { name: 'Pink', value: '#ec4899', description: 'Energetic and friendly' },
    { name: 'Red', value: '#ef4444', description: 'Bold and confident' },
    { name: 'Orange', value: '#f97316', description: 'Enthusiastic and warm' },
    { name: 'Yellow', value: '#eab308', description: 'Optimistic and bright' },
    { name: 'Green', value: '#22c55e', description: 'Growth and stability' },
    { name: 'Teal', value: '#14b8a6', description: 'Calm and balanced' },
    { name: 'Cyan', value: '#06b6d4', description: 'Fresh and clean' },
    { name: 'Gray', value: '#64748b', description: 'Classic and neutral' },
    { name: 'Black', value: '#1f2937', description: 'Elegant and timeless' },
  ];

  const handleColorChange = (color) => {
    updateCustomization({ primaryColor: color });
  };

  return (
    <div className="space-y-4">
      <div className="border-b pb-3 mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Color Customization</h2>
        <p className="text-sm text-gray-600 mt-1">
          Choose an accent color that reflects your personality and industry
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Primary Accent Color
          </label>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {colorOptions.map((color) => (
              <button
                key={color.value}
                onClick={() => handleColorChange(color.value)}
                className={`
                  group relative p-3 rounded-lg border-2 transition-all duration-200
                  ${customization.primaryColor === color.value
                    ? 'border-gray-400 shadow-md'
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
                title={color.description}
              >
                <div className="flex flex-col items-center space-y-2">
                  <div
                    className="w-8 h-8 rounded-full shadow-inner"
                    style={{ backgroundColor: color.value }}
                  ></div>
                  <span className="text-xs text-gray-600 font-medium">{color.name}</span>
                  {customization.primaryColor === color.value && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 text-white rounded-full flex items-center justify-center">
                      <span className="text-xs">✓</span>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Color Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Custom Color
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="color"
              value={customization.primaryColor}
              onChange={(e) => handleColorChange(e.target.value)}
              className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
            />
            <input
              type="text"
              value={customization.primaryColor}
              onChange={(e) => handleColorChange(e.target.value)}
              placeholder="#3b82f6"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm font-mono"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Enter a hex color code or use the color picker
          </p>
        </div>

        {/* Preview */}
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <h3 className="font-medium text-gray-800 mb-3">Color Preview</h3>
          <div className="space-y-2">
            <div
              className="text-lg font-bold"
              style={{ color: customization.primaryColor }}
            >
              Section Header Example
            </div>
            <div className="text-sm text-gray-600">
              This is how your accent color will appear in section headers and highlights
            </div>
            <div
              className="w-full h-1 rounded"
              style={{ backgroundColor: customization.primaryColor }}
            ></div>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="font-medium text-blue-900 mb-2">🎨 Color Psychology Tips</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li><strong>Blue/Navy:</strong> Trust, reliability - great for corporate roles</li>
            <li><strong>Green:</strong> Growth, stability - perfect for finance, healthcare</li>
            <li><strong>Purple:</strong> Creativity, innovation - ideal for design, tech</li>
            <li><strong>Gray/Black:</strong> Professional, timeless - suits any industry</li>
            <li><strong>Red/Orange:</strong> Energy, confidence - good for sales, marketing</li>
          </ul>
        </div>
      </div>
    </div>
  );
};