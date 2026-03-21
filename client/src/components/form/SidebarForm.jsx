import React, { useState } from 'react';
import { PersonalInfoForm } from './sections/PersonalInfoForm';
import { ProfileForm } from './sections/ProfileForm';
import { ExperienceForm } from './sections/ExperienceForm';
import { EducationForm } from './sections/EducationForm';
import { SkillsForm } from './sections/SkillsForm';
import { SectionManager } from './SectionManager';

export const SidebarForm = () => {
  const [activeTab, setActiveTab] = useState('personal');

  const tabs = [
    { id: 'personal', label: 'Personal Info', component: PersonalInfoForm },
    { id: 'profile', label: 'Profile', component: ProfileForm },
    { id: 'experience', label: 'Experience', component: ExperienceForm },
    { id: 'education', label: 'Education', component: EducationForm },
    { id: 'skills', label: 'Skills', component: SkillsForm },
    { id: 'sections', label: 'Manage Sections', component: SectionManager },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="h-full flex flex-col">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors
              ${activeTab === tab.id
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Active Form Component */}
      <div className="flex-1 overflow-y-auto">
        {ActiveComponent && <ActiveComponent />}
      </div>
    </div>
  );
};
