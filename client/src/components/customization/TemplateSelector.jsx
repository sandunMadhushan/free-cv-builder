import React from 'react';
import { useTemplateStore } from '../../store/templateStore';
import { TEMPLATES } from '../../config/templates';

export const TemplateSelector = () => {
  const selectedTemplate = useTemplateStore((state) => state.selectedTemplate);
  const setTemplate = useTemplateStore((state) => state.setTemplate);

  const handleTemplateChange = (templateId) => {
    setTemplate(templateId);
  };

  return (
    <div className="space-y-4">
      <div className="border-b pb-3 mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Template Selection</h2>
        <p className="text-sm text-gray-600 mt-1">
          Choose a template that best fits your industry and personal style
        </p>
      </div>

      <div className="space-y-4">
        {Object.values(TEMPLATES).map((template) => (
          <div
            key={template.id}
            className={`
              border rounded-lg p-4 cursor-pointer transition-all duration-200
              ${selectedTemplate === template.id
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
              }
            `}
            onClick={() => handleTemplateChange(template.id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <h3 className="font-semibold text-gray-900">{template.name}</h3>
                  {selectedTemplate === template.id && (
                    <span className="ml-2 px-2 py-1 text-xs bg-blue-500 text-white rounded-full">
                      Selected
                    </span>
                  )}
                </div>

                <p className="text-sm text-gray-600 mb-3">{template.description}</p>

                <p className="text-xs text-gray-500 mb-3 italic">{template.preview}</p>

                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                    <span>ATS Score: {template.features.atsScore}%</span>
                  </div>

                  {template.features.twoColumn && (
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
                      <span>Two Column</span>
                    </div>
                  )}

                  {template.features.supportsAccentColor && (
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-1"></div>
                      <span>Customizable Colors</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="ml-4 flex-shrink-0">
                {/* Template Preview Mockup */}
                <div className={`
                  w-16 h-20 border border-gray-300 rounded shadow-sm relative overflow-hidden
                  ${selectedTemplate === template.id ? 'border-blue-500' : ''}
                `}>
                  {template.id === 'modern' && (
                    <div className="p-1">
                      <div className="h-1 bg-blue-500 mb-1 rounded"></div>
                      <div className="space-y-0.5">
                        <div className="h-0.5 bg-gray-400 rounded"></div>
                        <div className="h-0.5 bg-gray-300 rounded w-3/4"></div>
                        <div className="h-0.5 bg-gray-300 rounded w-1/2"></div>
                      </div>
                      <div className="mt-2 space-y-0.5">
                        <div className="h-0.5 bg-blue-400 rounded w-2/3"></div>
                        <div className="h-0.5 bg-gray-300 rounded"></div>
                        <div className="h-0.5 bg-gray-300 rounded w-5/6"></div>
                      </div>
                    </div>
                  )}

                  {template.id === 'classic' && (
                    <div className="p-1">
                      <div className="text-center border-b border-gray-300 pb-1 mb-1">
                        <div className="h-0.5 bg-gray-800 rounded mx-auto w-3/4 mb-0.5"></div>
                        <div className="h-0.5 bg-gray-400 rounded mx-auto w-1/2"></div>
                      </div>
                      <div className="space-y-1">
                        <div className="h-0.5 bg-gray-600 rounded w-2/3"></div>
                        <div className="space-y-0.5">
                          <div className="h-0.5 bg-gray-400 rounded"></div>
                          <div className="h-0.5 bg-gray-300 rounded w-3/4"></div>
                        </div>
                        <div className="space-y-0.5">
                          <div className="h-0.5 bg-gray-400 rounded w-5/6"></div>
                          <div className="h-0.5 bg-gray-300 rounded w-2/3"></div>
                        </div>
                      </div>
                    </div>
                  )}

                  {template.id === 'minimal' && (
                    <div className="flex h-full">
                      <div className="w-1/3 bg-gray-100 p-0.5">
                        <div className="space-y-0.5">
                          <div className="h-0.5 bg-gray-600 rounded"></div>
                          <div className="h-0.5 bg-gray-400 rounded w-3/4"></div>
                          <div className="mt-1 space-y-0.5">
                            <div className="h-0.5 bg-blue-400 rounded w-1/2"></div>
                            <div className="h-0.5 bg-gray-400 rounded w-2/3"></div>
                            <div className="h-0.5 bg-gray-400 rounded w-3/4"></div>
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 p-0.5">
                        <div className="space-y-1">
                          <div className="h-0.5 bg-blue-400 rounded w-1/2"></div>
                          <div className="space-y-0.5">
                            <div className="h-0.5 bg-gray-400 rounded"></div>
                            <div className="h-0.5 bg-gray-300 rounded w-3/4"></div>
                            <div className="h-0.5 bg-gray-300 rounded w-5/6"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <h3 className="font-medium text-yellow-900 mb-2">💡 Template Tips</h3>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li><strong>Modern:</strong> Best for tech, creative, and modern industries</li>
          <li><strong>Classic:</strong> Perfect for traditional sectors like law, finance, government</li>
          <li><strong>Minimal:</strong> Great for design, consulting, and startup environments</li>
          <li><strong>ATS Score:</strong> Higher scores = better compatibility with applicant tracking systems</li>
        </ul>
      </div>
    </div>
  );
};