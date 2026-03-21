import React from 'react';
import { useCVStore } from '../../store/cvStore';

export const SectionManager = () => {
  const activeSections = useCVStore((state) => state.activeSections);
  const toggleSection = useCVStore((state) => state.toggleSection);

  const sections = [
    { id: 'personalInfo', label: 'Personal Info', required: true },
    { id: 'profile', label: 'Professional Summary' },
    { id: 'experience', label: 'Work Experience' },
    { id: 'education', label: 'Education' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'certifications', label: 'Certifications' },
    { id: 'languages', label: 'Languages' },
  ];

  return (
    <div className="bg-gray-50 p-4 rounded-lg border">
      <h3 className="font-medium text-gray-800 mb-3">CV Sections</h3>
      <p className="text-sm text-gray-600 mb-4">
        Toggle sections to include or exclude them from your CV
      </p>

      <div className="space-y-2">
        {sections.map((section) => (
          <label key={section.id} className="flex items-center justify-between">
            <span className="text-sm text-gray-700">{section.label}</span>
            <div className="flex items-center">
              {section.required && (
                <span className="text-xs text-gray-500 mr-2">Required</span>
              )}
              <input
                type="checkbox"
                checked={activeSections[section.id]}
                onChange={() => !section.required && toggleSection(section.id)}
                disabled={section.required}
                className={`
                  w-4 h-4 text-blue-600 border-gray-300 rounded
                  focus:ring-blue-500 focus:ring-2
                  ${section.required ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
              />
            </div>
          </label>
        ))}
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded text-sm text-blue-700">
        💡 <strong>Tip:</strong> Only include sections relevant to your target role.
        A focused CV is more effective than a comprehensive one.
      </div>
    </div>
  );
};