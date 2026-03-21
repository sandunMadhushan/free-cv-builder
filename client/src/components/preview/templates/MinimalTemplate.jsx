import React from 'react';

export const MinimalTemplate = ({ cvData, customization }) => {
  const { personalInfo, profile, experience, education, skills, activeSections } = cvData;
  const { primaryColor } = customization;

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString + '-01');
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div
      id="cv-preview-print"
      className="bg-white shadow-lg w-full max-w-[210mm] min-h-[297mm] flex"
      style={{ fontFamily: 'system-ui, sans-serif' }}
    >
      {/* Left Sidebar */}
      <div className="w-1/3 bg-gray-50 p-8">
        {/* Contact Information */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-4 text-gray-900">
            {personalInfo.fullName || 'Your Name'}
          </h1>

          <div className="space-y-2 text-sm text-gray-700">
            {personalInfo.email && (
              <div className="flex items-center">
                <span className="w-4 text-gray-500">✉</span>
                <span className="ml-2">{personalInfo.email}</span>
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-center">
                <span className="w-4 text-gray-500">📞</span>
                <span className="ml-2">{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo.location && (
              <div className="flex items-center">
                <span className="w-4 text-gray-500">📍</span>
                <span className="ml-2">{personalInfo.location}</span>
              </div>
            )}
            {personalInfo.linkedin && (
              <div className="flex items-center">
                <span className="w-4 text-gray-500">💼</span>
                <span className="ml-2 text-xs">{personalInfo.linkedin}</span>
              </div>
            )}
            {personalInfo.github && (
              <div className="flex items-center">
                <span className="w-4 text-gray-500">⚡</span>
                <span className="ml-2 text-xs">{personalInfo.github}</span>
              </div>
            )}
            {personalInfo.website && (
              <div className="flex items-center">
                <span className="w-4 text-gray-500">🌐</span>
                <span className="ml-2 text-xs">{personalInfo.website}</span>
              </div>
            )}
          </div>
        </div>

        {/* Skills */}
        {activeSections.skills && skills && (skills.technical?.length > 0 || skills.tools?.length > 0 || skills.soft?.length > 0 || skills.languages?.length > 0) && (
          <div className="mb-8">
            <h2 className="text-sm font-bold mb-3 text-gray-900 uppercase tracking-wider"
                style={{ color: primaryColor }}>
              Skills
            </h2>

            <div className="space-y-4">
              {skills.technical?.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-700 mb-2 uppercase">Technical</h3>
                  <div className="space-y-1">
                    {skills.technical.map((skill, index) => (
                      <div key={index} className="text-xs text-gray-600">{skill}</div>
                    ))}
                  </div>
                </div>
              )}

              {skills.tools?.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-700 mb-2 uppercase">Tools</h3>
                  <div className="space-y-1">
                    {skills.tools.map((tool, index) => (
                      <div key={index} className="text-xs text-gray-600">{tool}</div>
                    ))}
                  </div>
                </div>
              )}

              {skills.soft?.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-700 mb-2 uppercase">Soft Skills</h3>
                  <div className="space-y-1">
                    {skills.soft.map((skill, index) => (
                      <div key={index} className="text-xs text-gray-600">{skill}</div>
                    ))}
                  </div>
                </div>
              )}

              {skills.languages?.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-700 mb-2 uppercase">Languages</h3>
                  <div className="space-y-1">
                    {skills.languages.map((language, index) => (
                      <div key={index} className="text-xs text-gray-600">{language}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Professional Summary */}
        {activeSections.profile && profile.summary && (
          <div className="mb-8">
            <h2 className="text-sm font-bold mb-3 text-gray-900 uppercase tracking-wider"
                style={{ color: primaryColor }}>
              About
            </h2>
            <p className="text-gray-700 text-sm leading-relaxed">{profile.summary}</p>
          </div>
        )}

        {/* Work Experience */}
        {activeSections.experience && experience && experience.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-bold mb-4 text-gray-900 uppercase tracking-wider"
                style={{ color: primaryColor }}>
              Experience
            </h2>

            <div className="space-y-6">
              {experience.map((exp) => (
                <div key={exp.id} className="relative pl-4 border-l-2 border-gray-200">
                  <div className="absolute w-2 h-2 bg-gray-400 rounded-full -left-1 top-1"></div>

                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-base text-gray-900">{exp.position || 'Position'}</h3>
                      <h4 className="text-gray-600 text-sm">{exp.company || 'Company'}</h4>
                    </div>
                    <div className="text-right text-xs text-gray-500">
                      <p>
                        {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                      </p>
                      {exp.location && <p>{exp.location}</p>}
                    </div>
                  </div>

                  {exp.description && (
                    <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {activeSections.education && education && education.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-bold mb-4 text-gray-900 uppercase tracking-wider"
                style={{ color: primaryColor }}>
              Education
            </h2>

            <div className="space-y-6">
              {education.map((edu) => (
                <div key={edu.id} className="relative pl-4 border-l-2 border-gray-200">
                  <div className="absolute w-2 h-2 bg-gray-400 rounded-full -left-1 top-1"></div>

                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-base text-gray-900">{edu.degree || 'Degree'}</h3>
                      <h4 className="text-gray-600 text-sm">{edu.institution || 'Institution'}</h4>
                      {edu.field && <p className="text-gray-500 text-xs">{edu.field}</p>}
                    </div>
                    <div className="text-right text-xs text-gray-500">
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
                        <p key={index} className="text-gray-600 text-xs">
                          • {achievement}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Empty State */}
      {!personalInfo.fullName && !profile.summary && experience.length === 0 && education.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          <div className="text-center">
            <p className="text-lg">Start filling out the form to see your CV preview</p>
            <p className="text-sm mt-2">Changes will appear here in real-time</p>
          </div>
        </div>
      )}
    </div>
  );
};