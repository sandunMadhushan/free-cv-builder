import React, { useMemo } from 'react';
import { useCVStore } from '../../store/cvStore';
import { useTemplateStore } from '../../store/templateStore';
import { ModernTemplate } from './templates/ModernTemplate';
import { ClassicTemplate } from './templates/ClassicTemplate';
import { MinimalTemplate } from './templates/MinimalTemplate';

export const CVPreview = () => {
  // Subscribe to individual pieces of CV data to avoid infinite loops
  const personalInfo = useCVStore((state) => state.personalInfo);
  const profile = useCVStore((state) => state.profile);
  const experience = useCVStore((state) => state.experience);
  const education = useCVStore((state) => state.education);
  const skills = useCVStore((state) => state.skills);
  const projects = useCVStore((state) => state.projects);
  const certifications = useCVStore((state) => state.certifications);
  const languages = useCVStore((state) => state.languages);
  const sectionOrder = useCVStore((state) => state.sectionOrder);
  const activeSections = useCVStore((state) => state.activeSections);

  // Subscribe to template settings
  const selectedTemplate = useTemplateStore((state) => state.selectedTemplate);
  const customization = useTemplateStore((state) => state.customization);

  // Memoize the cvData object to prevent unnecessary re-renders
  const cvData = useMemo(() => ({
    personalInfo,
    profile,
    experience,
    education,
    skills,
    projects,
    certifications,
    languages,
    sectionOrder,
    activeSections,
  }), [
    personalInfo,
    profile,
    experience,
    education,
    skills,
    projects,
    certifications,
    languages,
    sectionOrder,
    activeSections,
  ]);

  // Template rendering logic
  const renderTemplate = () => {
    switch (selectedTemplate) {
      case 'modern':
        return <ModernTemplate cvData={cvData} customization={customization} />;
      case 'classic':
        return <ClassicTemplate cvData={cvData} customization={customization} />;
      case 'minimal':
        return <MinimalTemplate cvData={cvData} customization={customization} />;
      default:
        return <ModernTemplate cvData={cvData} customization={customization} />;
    }
  };

  return (
    <div className="w-full flex justify-center">
      {renderTemplate()}
    </div>
  );
};
