import React, { useState } from 'react';
import { PersonalInfoForm } from './sections/PersonalInfoForm';
import { ProfileForm } from './sections/ProfileForm';
import { ExperienceForm } from './sections/ExperienceForm';
import { EducationForm } from './sections/EducationForm';
import { SkillsForm } from './sections/SkillsForm';
import { ProjectsForm } from './sections/ProjectsForm';
import { CertificationsForm } from './sections/CertificationsForm';
import { LanguagesForm } from './sections/LanguagesForm';
import { SectionManager } from './SectionManager';
import { Customization } from '../customization/Customization';
import { ImportResume } from '../features/ImportResume';
import { VersionManager } from '../features/VersionManager';

export const SidebarForm = () => {
  const [activeTab, setActiveTab] = useState('personal');

  const tabs = [
    { id: 'personal', label: 'Personal Info', component: PersonalInfoForm },
    { id: 'profile', label: 'Profile', component: ProfileForm },
    { id: 'experience', label: 'Experience', component: ExperienceForm },
    { id: 'education', label: 'Education', component: EducationForm },
    { id: 'skills', label: 'Skills', component: SkillsForm },
    { id: 'projects', label: 'Projects', component: ProjectsForm },
    { id: 'certifications', label: 'Certifications', component: CertificationsForm },
    { id: 'languages', label: 'Languages', component: LanguagesForm },
    { id: 'import', label: 'Import Resume', component: ImportResume },
    { id: 'versions', label: 'My CVs', component: VersionManager },
    { id: 'customize', label: 'Customize', component: Customization },
    { id: 'sections', label: 'Manage Sections', component: SectionManager },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="h-full flex flex-col">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4 lg:mb-6 overflow-x-auto thin-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              px-3 lg:px-4 py-2 lg:py-3 text-xs lg:text-sm font-medium whitespace-nowrap transition-colors
              min-w-fit flex-shrink-0 touch-manipulation
              ${activeTab === tab.id
                ? 'border-b-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Active Form Component */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {ActiveComponent && <ActiveComponent />}
      </div>
    </div>
  );
};
