import React from 'react';

export const createSectionRenderer = (template) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString + '-01');
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const renderSection = (sectionId, cvData, customization) => {
    const { activeSections } = cvData;

    // Don't render if section is not active
    if (!activeSections[sectionId]) {
      return null;
    }

    switch (sectionId) {
      case 'personalInfo':
        return template.renderPersonalInfo(cvData, customization);

      case 'profile':
        return cvData.profile.summary ? template.renderProfile(cvData, customization) : null;

      case 'experience':
        return cvData.experience?.length > 0 ? template.renderExperience(cvData, customization, formatDate) : null;

      case 'education':
        return cvData.education?.length > 0 ? template.renderEducation(cvData, customization, formatDate) : null;

      case 'skills':
        const { skills } = cvData;
        return (skills?.technical?.length > 0 || skills?.tools?.length > 0 || skills?.soft?.length > 0 || skills?.languages?.length > 0)
          ? template.renderSkills(cvData, customization) : null;

      case 'projects':
        return cvData.projects?.length > 0 ? template.renderProjects(cvData, customization, formatDate) : null;

      case 'certifications':
        return cvData.certifications?.length > 0 ? template.renderCertifications(cvData, customization) : null;

      case 'languages':
        return cvData.languages?.length > 0 ? template.renderLanguages(cvData, customization) : null;

      default:
        return null;
    }
  };

  return { renderSection, formatDate };
};