import React from 'react';

export const ModernTemplate = ({ cvData, customization }) => {
  const { personalInfo, profile, experience, education, skills, projects, certifications, languages, activeSections, sectionOrder } = cvData;
  const { primaryColor, fontSize, spacing, accentStyle } = customization;

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString + '-01');
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  // Dynamic classes based on customization
  const getFontSizeClasses = () => {
    switch (fontSize) {
      case 'small':
        return {
          body: 'text-sm',
          heading: 'text-lg',
          subheading: 'text-base',
          small: 'text-xs',
        };
      case 'large':
        return {
          body: 'text-lg',
          heading: 'text-2xl',
          subheading: 'text-xl',
          small: 'text-base',
        };
      default: // medium
        return {
          body: 'text-base',
          heading: 'text-xl',
          subheading: 'text-lg',
          small: 'text-sm',
        };
    }
  };

  const getSpacingClasses = () => {
    switch (spacing) {
      case 'compact':
        return {
          section: 'mb-4',
          subsection: 'mb-3',
          item: 'mb-2',
          padding: 'p-8',
        };
      case 'spacious':
        return {
          section: 'mb-10',
          subsection: 'mb-6',
          item: 'mb-4',
          padding: 'p-16',
        };
      default: // comfortable
        return {
          section: 'mb-6',
          subsection: 'mb-4',
          item: 'mb-3',
          padding: 'p-12',
        };
    }
  };

  const getAccentClassess = () => {
    switch (accentStyle) {
      case 'italic':
        return 'font-semibold italic';
      case 'underline':
        return 'font-semibold underline';
      default: // bold
        return 'font-bold';
    }
  };

  const fontSizes = getFontSizeClasses();
  const spacingClasses = getSpacingClasses();
  const accentClass = getAccentClassess();

  // Section renderers
  const renderSection = (sectionId) => {
    if (!activeSections[sectionId]) return null;

    switch (sectionId) {
      case 'personalInfo':
        return null; // Always rendered at top

      case 'profile':
        return profile.summary ? (
          <div key="profile" className={spacingClasses.section}>
            <h2 className={`${fontSizes.heading} ${accentClass} mb-3`} style={{ color: primaryColor }}>
              PROFESSIONAL SUMMARY
            </h2>
            <p className={`text-gray-700 dark:text-gray-200 leading-relaxed ${fontSizes.body}`}>{profile.summary}</p>
          </div>
        ) : null;

      case 'experience':
        return experience && experience.length > 0 ? (
          <div key="experience" className="mb-6">
            <h2 className="text-xl font-bold mb-3" style={{ color: primaryColor }}>
              WORK EXPERIENCE
            </h2>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">{exp.position || 'Position'}</h3>
                      <p className="text-gray-700 dark:text-gray-300">{exp.company || 'Company'}</p>
                    </div>
                    <div className="text-right text-sm text-gray-600 dark:text-gray-400">
                      <p>
                        {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                      </p>
                      {exp.location && <p>{exp.location}</p>}
                    </div>
                  </div>
                  {exp.description && (
                    <p className="text-gray-700 dark:text-gray-200 mt-2 leading-relaxed whitespace-pre-line">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case 'education':
        return education && education.length > 0 ? (
          <div key="education" className="mb-6">
            <h2 className="text-xl font-bold mb-3" style={{ color: primaryColor }}>
              EDUCATION
            </h2>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">{edu.degree || 'Degree'}</h3>
                      <p className="text-gray-700 dark:text-gray-300">{edu.institution || 'Institution'}</p>
                      {edu.field && <p className="text-gray-600 dark:text-gray-400 text-sm">{edu.field}</p>}
                    </div>
                    <div className="text-right text-sm text-gray-600 dark:text-gray-400">
                      <p>
                        {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                      </p>
                      {edu.location && <p>{edu.location}</p>}
                      {edu.gpa && <p>GPA: {edu.gpa}</p>}
                    </div>
                  </div>
                  {edu.achievements && edu.achievements.length > 0 && (
                    <div className="mt-2">
                      {edu.achievements.map((achievement, index) => (
                        <p key={index} className="text-gray-700 dark:text-gray-200 text-sm">
                          • {achievement}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case 'skills':
        return (skills?.technical?.length > 0 || skills?.tools?.length > 0 || skills?.soft?.length > 0 || skills?.languages?.length > 0) ? (
          <div key="skills" className="mb-6">
            <h2 className="text-xl font-bold mb-3" style={{ color: primaryColor }}>
              SKILLS
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {skills.technical?.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Technical Skills</h3>
                  <div className="flex flex-wrap gap-1">
                    {skills.technical.map((skill, index) => (
                      <span key={index} className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-2 py-1 text-sm rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {skills.tools?.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Tools & Technologies</h3>
                  <div className="flex flex-wrap gap-1">
                    {skills.tools.map((tool, index) => (
                      <span key={index} className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-2 py-1 text-sm rounded">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {skills.soft?.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Soft Skills</h3>
                  <div className="flex flex-wrap gap-1">
                    {skills.soft.map((skill, index) => (
                      <span key={index} className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-2 py-1 text-sm rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {skills.languages?.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Languages</h3>
                  <div className="flex flex-wrap gap-1">
                    {skills.languages.map((language, index) => (
                      <span key={index} className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-2 py-1 text-sm rounded">
                        {language}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : null;

      case 'projects':
        return projects && projects.length > 0 ? (
          <div key="projects" className="mb-6">
            <h2 className="text-xl font-bold mb-3" style={{ color: primaryColor }}>
              PROJECTS
            </h2>
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id}>
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">{project.name || 'Project Name'}</h3>
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {project.technologies.map((tech, index) => (
                            <span key={index} className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 px-2 py-0.5 text-xs rounded">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="text-right text-sm text-gray-600 dark:text-gray-400">
                      {project.startDate && project.endDate && (
                        <p>
                          {formatDate(project.startDate)} - {formatDate(project.endDate)}
                        </p>
                      )}
                      {project.link && (
                        <a href={project.link} className="text-blue-600 dark:text-blue-400 hover:underline text-xs">
                          View Project
                        </a>
                      )}
                    </div>
                  </div>
                  {project.description && (
                    <p className="text-gray-700 dark:text-gray-200 mt-2 leading-relaxed whitespace-pre-line">
                      {project.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case 'certifications':
        return certifications && certifications.length > 0 ? (
          <div key="certifications" className="mb-6">
            <h2 className="text-xl font-bold mb-3" style={{ color: primaryColor }}>
              CERTIFICATIONS
            </h2>
            <div className="space-y-3">
              {certifications.map((cert) => (
                <div key={cert.id} className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-base text-gray-900 dark:text-gray-100">{cert.name || 'Certification Name'}</h3>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">{cert.issuer || 'Issuing Organization'}</p>
                    {cert.credentialId && (
                      <p className="text-gray-500 dark:text-gray-400 text-xs">ID: {cert.credentialId}</p>
                    )}
                  </div>
                  <div className="text-right text-sm text-gray-600 dark:text-gray-400">
                    <p>{formatDate(cert.date)}</p>
                    {cert.expiryDate && <p className="text-xs">Expires: {formatDate(cert.expiryDate)}</p>}
                    {cert.link && (
                      <a href={cert.link} className="text-blue-600 dark:text-blue-400 hover:underline text-xs">
                        Verify
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case 'languages':
        return languages && languages.length > 0 ? (
          <div key="languages" className="mb-6">
            <h2 className="text-xl font-bold mb-3" style={{ color: primaryColor }}>
              LANGUAGES
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {languages.map((lang) => (
                <div key={lang.id} className="flex justify-between items-center">
                  <span className="font-medium text-gray-800 dark:text-gray-200">{lang.name || 'Language'}</span>
                  <span className="text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                    {lang.proficiency || 'Intermediate'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : null;

      default:
        return null;
    }
  };

  return (
    <div
      id="cv-preview-print"
      className={`bg-white dark:bg-gray-800 shadow-lg w-full max-w-[210mm] min-h-[297mm] ${spacingClasses.padding} transition-colors`}
      style={{ fontFamily: customization.fontFamily || 'Inter, sans-serif' }}
    >
      {/* Header - Personal Info */}
      <div className={`border-b-2 pb-6 ${spacingClasses.section}`} style={{ borderColor: primaryColor }}>
        <h1 className={`${fontSizes.heading === 'text-2xl' ? 'text-4xl' : fontSizes.heading === 'text-lg' ? 'text-2xl' : 'text-3xl'} ${accentClass} mb-2`} style={{ color: primaryColor }}>
          {personalInfo.fullName || 'Your Name'}
        </h1>

        <div className={`flex flex-wrap gap-x-4 gap-y-1 ${fontSizes.small} text-gray-600 dark:text-gray-400`}>
          {personalInfo.email && (
            <div className="flex items-center">
              <span>✉</span>
              <span className="ml-1">{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center">
              <span>📞</span>
              <span className="ml-1">{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.location && (
            <div className="flex items-center">
              <span>📍</span>
              <span className="ml-1">{personalInfo.location}</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-x-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
          {personalInfo.linkedin && (
            <a href={`https://${personalInfo.linkedin}`} className="hover:underline text-blue-600 dark:text-blue-400">
              LinkedIn
            </a>
          )}
          {personalInfo.github && (
            <a href={`https://${personalInfo.github}`} className="hover:underline text-blue-600 dark:text-blue-400">
              GitHub
            </a>
          )}
          {personalInfo.website && (
            <a href={`https://${personalInfo.website}`} className="hover:underline text-blue-600 dark:text-blue-400">
              Website
            </a>
          )}
        </div>
      </div>

      {/* Dynamic sections based on sectionOrder */}
      {sectionOrder.map(sectionId => renderSection(sectionId)).filter(Boolean)}

      {/* Empty State */}
      {!personalInfo.fullName && !profile.summary && experience.length === 0 && education.length === 0 && (
        <div className="text-center py-12 text-gray-400 dark:text-gray-500">
          <p className="text-lg">Start filling out the form to see your CV preview</p>
          <p className="text-sm mt-2">Changes will appear here in real-time</p>
        </div>
      )}
    </div>
  );
};
