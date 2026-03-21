import React from 'react';

export const ModernTemplate = ({ cvData, customization }) => {
  const { personalInfo, profile, experience, education, skills, activeSections, sectionOrder } = cvData;
  const { primaryColor } = customization;

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString + '-01');
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  // Section renderers
  const renderSection = (sectionId) => {
    if (!activeSections[sectionId]) return null;

    switch (sectionId) {
      case 'personalInfo':
        return null; // Always rendered at top

      case 'profile':
        return profile.summary ? (
          <div key="profile" className="mb-6">
            <h2 className="text-xl font-bold mb-3" style={{ color: primaryColor }}>
              PROFESSIONAL SUMMARY
            </h2>
            <p className="text-gray-700 leading-relaxed">{profile.summary}</p>
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
                      <h3 className="font-bold text-lg">{exp.position || 'Position'}</h3>
                      <p className="text-gray-700">{exp.company || 'Company'}</p>
                    </div>
                    <div className="text-right text-sm text-gray-600">
                      <p>
                        {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                      </p>
                      {exp.location && <p>{exp.location}</p>}
                    </div>
                  </div>
                  {exp.description && (
                    <p className="text-gray-700 mt-2 leading-relaxed whitespace-pre-line">
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
                      <h3 className="font-bold text-lg">{edu.degree || 'Degree'}</h3>
                      <p className="text-gray-700">{edu.institution || 'Institution'}</p>
                      {edu.field && <p className="text-gray-600 text-sm">{edu.field}</p>}
                    </div>
                    <div className="text-right text-sm text-gray-600">
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
                        <p key={index} className="text-gray-700 text-sm">
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
                  <h3 className="font-semibold text-gray-800 mb-2">Technical Skills</h3>
                  <div className="flex flex-wrap gap-1">
                    {skills.technical.map((skill, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 text-sm rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {skills.tools?.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Tools & Technologies</h3>
                  <div className="flex flex-wrap gap-1">
                    {skills.tools.map((tool, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 text-sm rounded">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {skills.soft?.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Soft Skills</h3>
                  <div className="flex flex-wrap gap-1">
                    {skills.soft.map((skill, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 text-sm rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {skills.languages?.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Languages</h3>
                  <div className="flex flex-wrap gap-1">
                    {skills.languages.map((language, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 text-sm rounded">
                        {language}
                      </span>
                    ))}
                  </div>
                </div>
              )}
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
      className="bg-white shadow-lg w-full max-w-[210mm] min-h-[297mm] p-12"
      style={{ fontFamily: customization.fontFamily || 'Inter, sans-serif' }}
    >
      {/* Header - Personal Info */}
      <div className="border-b-2 pb-6 mb-6" style={{ borderColor: primaryColor }}>
        <h1 className="text-4xl font-bold mb-2" style={{ color: primaryColor }}>
          {personalInfo.fullName || 'Your Name'}
        </h1>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
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

        <div className="flex flex-wrap gap-x-4 mt-2 text-sm text-gray-600">
          {personalInfo.linkedin && (
            <a href={`https://${personalInfo.linkedin}`} className="hover:underline">
              LinkedIn
            </a>
          )}
          {personalInfo.github && (
            <a href={`https://${personalInfo.github}`} className="hover:underline">
              GitHub
            </a>
          )}
          {personalInfo.website && (
            <a href={`https://${personalInfo.website}`} className="hover:underline">
              Website
            </a>
          )}
        </div>
      </div>

      {/* Dynamic sections based on sectionOrder */}
      {sectionOrder.map(sectionId => renderSection(sectionId)).filter(Boolean)}

      {/* Empty State */}
      {!personalInfo.fullName && !profile.summary && experience.length === 0 && education.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p className="text-lg">Start filling out the form to see your CV preview</p>
          <p className="text-sm mt-2">Changes will appear here in real-time</p>
        </div>
      )}
    </div>
  );
};
