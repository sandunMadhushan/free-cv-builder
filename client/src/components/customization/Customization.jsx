import React, { useState } from 'react';
import { TemplateSelector } from './TemplateSelector';
import { ColorCustomizer } from './ColorCustomizer';
import { SectionReorder } from './SectionReorder';

export const Customization = () => {
  const [activeSection, setActiveSection] = useState('templates');

  const sections = [
    { id: 'templates', label: 'Templates', component: TemplateSelector },
    { id: 'colors', label: 'Colors', component: ColorCustomizer },
    { id: 'reorder', label: 'Section Order', component: SectionReorder },
  ];

  const ActiveComponent = sections.find(section => section.id === activeSection)?.component;

  return (
    <div className="space-y-4">
      <div className="border-b pb-3 mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Customize Your CV</h2>
        <p className="text-sm text-gray-600 mt-1">
          Personalize your CV template and styling
        </p>
      </div>

      {/* Sub-navigation */}
      <div className="flex border-b border-gray-200 mb-6">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`
              px-4 py-2 text-sm font-medium transition-colors
              ${activeSection === section.id
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
              }
            `}
          >
            {section.label}
          </button>
        ))}
      </div>

      {/* Active Section Component */}
      <div>
        {ActiveComponent && <ActiveComponent />}
      </div>
    </div>
  );
};