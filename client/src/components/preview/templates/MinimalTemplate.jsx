import React from 'react';

export const MinimalTemplate = ({ cvData, customization }) => {
  const { personalInfo, profile, experience, education, skills, projects, certifications, languages, activeSections } = cvData;
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
      className="bg-white dark:bg-gray-800 shadow-lg w-full max-w-[210mm] min-h-[297mm] flex transition-colors"
      style={{ fontFamily: customization?.fontFamily || 'system-ui, sans-serif' }}
    >
      {/* Left Sidebar */}
      <div className="w-1/3 bg-gray-50 dark:bg-gray-700 p-8 transition-colors">
        {/* Contact Information */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            {personalInfo.fullName || 'Your Name'}
          </h1>

          <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            {personalInfo.email && (
              <div className="flex items-center">
                <span className="w-4 text-gray-500 dark:text-gray-400">✉</span>
                <span className="ml-2">{personalInfo.email}</span>
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-center">
                <span className="w-4 text-gray-500 dark:text-gray-400">📞</span>
                <span className="ml-2">{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo.location && (
              <div className="flex items-center">
                <span className="w-4 text-gray-500 dark:text-gray-400">📍</span>
                <span className="ml-2">{personalInfo.location}</span>
              </div>
            )}
            {personalInfo.linkedin && (
              <div className="flex items-center">
                <span className="w-4 text-gray-500 dark:text-gray-400">💼</span>
                <span className="ml-2 text-xs">{personalInfo.linkedin}</span>
              </div>
            )}
            {personalInfo.github && (
              <div className="flex items-center">
                <span className="w-4 text-gray-500 dark:text-gray-400">⚡</span>
                <span className="ml-2 text-xs">{personalInfo.github}</span>
              </div>
            )}
            {personalInfo.website && (
              <div className="flex items-center">
                <span className="w-4 text-gray-500 dark:text-gray-400">🌐</span>
                <span className="ml-2 text-xs">{personalInfo.website}</span>
              </div>
            )}
          </div>
        </div>

        {/* Skills */}
        {activeSections.skills && skills && (skills.technical?.length > 0 || skills.tools?.length > 0 || skills.soft?.length > 0 || skills.languages?.length > 0) && (
          <div className="mb-8">
            <h2 className="text-sm font-bold mb-3 text-gray-900 dark:text-gray-100 uppercase tracking-wider"
                style={{ color: primaryColor }}>
              Skills
            </h2>

            <div className="space-y-4">
              {skills.technical?.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase">Technical</h3>
                  <div className="space-y-1">
                    {skills.technical.map((skill, index) => (
                      <div key={index} className="text-xs text-gray-600 dark:text-gray-400">{skill}</div>
                    ))}
                  </div>
                </div>
              )}

              {skills.tools?.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase">Tools</h3>
                  <div className="space-y-1">
                    {skills.tools.map((tool, index) => (
                      <div key={index} className="text-xs text-gray-600 dark:text-gray-400">{tool}</div>
                    ))}
                  </div>
                </div>
              )}

              {skills.soft?.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase">Soft Skills</h3>
                  <div className="space-y-1">
                    {skills.soft.map((skill, index) => (
                      <div key={index} className="text-xs text-gray-600 dark:text-gray-400">{skill}</div>
                    ))}
                  </div>
                </div>
              )}

              {skills.languages?.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase">Languages</h3>
                  <div className="space-y-1">
                    {skills.languages.map((language, index) => (
                      <div key={index} className="text-xs text-gray-600 dark:text-gray-400">{language}</div>
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
            <h2 className="text-sm font-bold mb-3 text-gray-900 dark:text-gray-100 uppercase tracking-wider"
                style={{ color: primaryColor }}>
              About
            </h2>
            <p className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed">{profile.summary}</p>
          </div>
        )}

        {/* Work Experience */}
        {activeSections.experience && experience && experience.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-bold mb-4 text-gray-900 dark:text-gray-100 uppercase tracking-wider"
                style={{ color: primaryColor }}>
              Experience
            </h2>

            <div className="space-y-6">
              {experience.map((exp) => (
                <div key={exp.id} className="relative pl-4 border-l-2 border-gray-200 dark:border-gray-600">
                  <div className="absolute w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full -left-1 top-1"></div>

                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-base text-gray-900 dark:text-gray-100">{exp.position || 'Position'}</h3>
                      <h4 className="text-gray-600 dark:text-gray-400 text-sm">{exp.company || 'Company'}</h4>
                    </div>
                    <div className="text-right text-xs text-gray-500 dark:text-gray-400">
                      <p>
                        {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                      </p>
                      {exp.location && <p>{exp.location}</p>}
                    </div>
                  </div>

                  {exp.description && (
                    <p className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed whitespace-pre-line">
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
            <h2 className="text-sm font-bold mb-4 text-gray-900 dark:text-gray-100 uppercase tracking-wider"
                style={{ color: primaryColor }}>
              Education
            </h2>

            <div className="space-y-6">
              {education.map((edu) => (
                <div key={edu.id} className="relative pl-4 border-l-2 border-gray-200 dark:border-gray-600">
                  <div className="absolute w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full -left-1 top-1"></div>

                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-base text-gray-900 dark:text-gray-100">{edu.degree || 'Degree'}</h3>
                      <h4 className="text-gray-600 dark:text-gray-400 text-sm">{edu.institution || 'Institution'}</h4>
                      {edu.field && <p className="text-gray-500 dark:text-gray-400 text-xs">{edu.field}</p>}
                    </div>
                    <div className="text-right text-xs text-gray-500 dark:text-gray-400">
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
                        <p key={index} className="text-gray-600 dark:text-gray-300 text-xs">
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

        {/* Projects */}
        {activeSections.projects && projects && projects.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-bold mb-4 text-gray-900 dark:text-gray-100 uppercase tracking-wider"
                style={{ color: primaryColor }}>
              Projects
            </h2>

            <div className="space-y-6">
              {projects.map((project) => (
                <div key={project.id} className="relative pl-4 border-l-2 border-gray-200 dark:border-gray-600">
                  <div className="absolute w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full -left-1 top-1"></div>

                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-base text-gray-900 dark:text-gray-100">{project.name || 'Project Name'}</h3>
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="mt-1">
                          <span className="text-gray-500 dark:text-gray-400 text-xs">
                            {project.technologies.join(' • ')}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="text-right text-xs text-gray-500 dark:text-gray-400">
                      {project.startDate && project.endDate && (
                        <p>
                          {formatDate(project.startDate)} - {formatDate(project.endDate)}
                        </p>
                      )}
                      {project.link && (
                        <a href={project.link} className="text-blue-600 dark:text-blue-400 hover:underline">
                          View
                        </a>
                      )}
                    </div>
                  </div>

                  {project.description && (
                    <p className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed whitespace-pre-line">
                      {project.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {activeSections.certifications && certifications && certifications.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-bold mb-4 text-gray-900 dark:text-gray-100 uppercase tracking-wider"
                style={{ color: primaryColor }}>
              Certifications
            </h2>

            <div className="space-y-4">
              {certifications.map((cert) => (
                <div key={cert.id} className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100">{cert.name || 'Certification Name'}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-xs">{cert.issuer || 'Issuing Organization'}</p>
                    {cert.credentialId && (
                      <p className="text-gray-500 dark:text-gray-400 text-xs">ID: {cert.credentialId}</p>
                    )}
                  </div>
                  <div className="text-right text-xs text-gray-500 dark:text-gray-400">
                    <p>{formatDate(cert.date)}</p>
                    {cert.expiryDate && (
                      <p>Exp: {formatDate(cert.expiryDate)}</p>
                    )}
                    {cert.link && (
                      <a href={cert.link} className="text-blue-600 dark:text-blue-400 hover:underline">
                        Verify
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {activeSections.languages && languages && languages.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-bold mb-4 text-gray-900 dark:text-gray-100 uppercase tracking-wider"
                style={{ color: primaryColor }}>
              Languages
            </h2>

            <div className="grid grid-cols-2 gap-2">
              {languages.map((lang) => (
                <div key={lang.id} className="flex justify-between items-center bg-gray-50 dark:bg-gray-600 px-3 py-2 rounded transition-colors">
                  <span className="font-medium text-gray-800 dark:text-gray-200 text-xs">{lang.name || 'Language'}</span>
                  <span className="text-gray-600 dark:text-gray-300 text-xs">{lang.proficiency || 'Intermediate'}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Empty State */}
      {!personalInfo.fullName && !profile.summary && experience.length === 0 && education.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500">
          <div className="text-center">
            <p className="text-lg">Start filling out the form to see your CV preview</p>
            <p className="text-sm mt-2">Changes will appear here in real-time</p>
          </div>
        </div>
      )}
    </div>
  );
};