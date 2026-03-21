import React from 'react';

export const ClassicTemplate = ({ cvData, customization }) => {
  const { personalInfo, profile, experience, education, skills, projects, certifications, languages, activeSections } = cvData;

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString + '-01');
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div
      id="cv-preview-print"
      className="bg-white dark:bg-gray-800 shadow-lg w-full max-w-[210mm] min-h-[297mm] p-12 transition-colors"
      style={{ fontFamily: customization?.fontFamily || 'Georgia, serif' }}
    >
      {/* Header - Personal Info */}
      <div className="text-center border-b border-gray-400 dark:border-gray-600 pb-6 mb-8">
        <h1 className="text-3xl font-bold mb-3 text-gray-900 dark:text-gray-100">
          {personalInfo.fullName || 'YOUR NAME'}
        </h1>

        {/* Contact Information in a single line */}
        <div className="flex justify-center items-center gap-6 text-sm text-gray-700 dark:text-gray-300">
          {personalInfo.email && (
            <span>{personalInfo.email}</span>
          )}
          {personalInfo.phone && (
            <span>•</span>
          )}
          {personalInfo.phone && (
            <span>{personalInfo.phone}</span>
          )}
          {personalInfo.location && (
            <span>•</span>
          )}
          {personalInfo.location && (
            <span>{personalInfo.location}</span>
          )}
        </div>

        {/* Professional Links */}
        {(personalInfo.linkedin || personalInfo.github || personalInfo.website) && (
          <div className="flex justify-center items-center gap-6 mt-2 text-sm text-gray-600 dark:text-gray-400">
            {personalInfo.linkedin && (
              <span>{personalInfo.linkedin}</span>
            )}
            {personalInfo.github && personalInfo.linkedin && <span>•</span>}
            {personalInfo.github && (
              <span>{personalInfo.github}</span>
            )}
            {personalInfo.website && (personalInfo.github || personalInfo.linkedin) && <span>•</span>}
            {personalInfo.website && (
              <span>{personalInfo.website}</span>
            )}
          </div>
        )}
      </div>

      {/* Professional Summary */}
      {activeSections.profile && profile.summary && (
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-3 text-gray-900 dark:text-gray-100 uppercase tracking-wider border-b border-gray-300 dark:border-gray-600 pb-1">
            Professional Summary
          </h2>
          <p className="text-gray-800 dark:text-gray-200 leading-relaxed text-justify">{profile.summary}</p>
        </div>
      )}

      {/* Work Experience */}
      {activeSections.experience && experience && experience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100 uppercase tracking-wider border-b border-gray-300 dark:border-gray-600 pb-1">
            Professional Experience
          </h2>

          <div className="space-y-6">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="mb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-base text-gray-900 dark:text-gray-100">{exp.position || 'Position'}</h3>
                      <h4 className="text-gray-700 dark:text-gray-300 italic">{exp.company || 'Company'}</h4>
                    </div>
                    <div className="text-right text-sm text-gray-600 dark:text-gray-400">
                      <p className="font-medium">
                        {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                      </p>
                      {exp.location && <p>{exp.location}</p>}
                    </div>
                  </div>
                </div>

                {exp.description && (
                  <div className="ml-4 text-gray-800 dark:text-gray-200 text-sm leading-relaxed whitespace-pre-line">
                    {exp.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {activeSections.education && education && education.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100 uppercase tracking-wider border-b border-gray-300 dark:border-gray-600 pb-1">
            Education
          </h2>

          <div className="space-y-4">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-base text-gray-900 dark:text-gray-100">{edu.degree || 'Degree'}</h3>
                    <h4 className="text-gray-700 dark:text-gray-300 italic">{edu.institution || 'Institution'}</h4>
                    {edu.field && <p className="text-gray-600 dark:text-gray-400 text-sm">{edu.field}</p>}
                  </div>
                  <div className="text-right text-sm text-gray-600 dark:text-gray-400">
                    <p className="font-medium">
                      {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                    </p>
                    {edu.location && <p>{edu.location}</p>}
                    {edu.gpa && <p>GPA: {edu.gpa}</p>}
                  </div>
                </div>

                {edu.achievements && edu.achievements.length > 0 && (
                  <div className="ml-4 mt-2">
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
      )}

      {/* Skills */}
      {activeSections.skills && skills && (skills.technical?.length > 0 || skills.tools?.length > 0 || skills.soft?.length > 0 || skills.languages?.length > 0) && (
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100 uppercase tracking-wider border-b border-gray-300 dark:border-gray-600 pb-1">
            Skills & Competencies
          </h2>

          <div className="space-y-3">
            {skills.technical?.length > 0 && (
              <div>
                <span className="font-semibold text-gray-800 dark:text-gray-200">Technical Skills: </span>
                <span className="text-gray-700 dark:text-gray-300">{skills.technical.join(', ')}</span>
              </div>
            )}

            {skills.tools?.length > 0 && (
              <div>
                <span className="font-semibold text-gray-800 dark:text-gray-200">Tools & Technologies: </span>
                <span className="text-gray-700 dark:text-gray-300">{skills.tools.join(', ')}</span>
              </div>
            )}

            {skills.soft?.length > 0 && (
              <div>
                <span className="font-semibold text-gray-800 dark:text-gray-200">Core Competencies: </span>
                <span className="text-gray-700 dark:text-gray-300">{skills.soft.join(', ')}</span>
              </div>
            )}

            {skills.languages?.length > 0 && (
              <div>
                <span className="font-semibold text-gray-800 dark:text-gray-200">Languages: </span>
                <span className="text-gray-700 dark:text-gray-300">{skills.languages.join(', ')}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Projects */}
      {activeSections.projects && projects && projects.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100 uppercase tracking-wider border-b border-gray-300 dark:border-gray-600 pb-1">
            Projects
          </h2>

          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-base text-gray-900 dark:text-gray-100">{project.name || 'Project Name'}</h3>
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="mt-1">
                        <span className="text-gray-600 dark:text-gray-400 text-sm">
                          Technologies: {project.technologies.join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="text-right text-sm text-gray-600 dark:text-gray-400">
                    {project.startDate && project.endDate && (
                      <p className="font-medium">
                        {formatDate(project.startDate)} - {formatDate(project.endDate)}
                      </p>
                    )}
                    {project.link && (
                      <a href={project.link} className="text-blue-600 dark:text-blue-400 underline text-xs">
                        View Project
                      </a>
                    )}
                  </div>
                </div>

                {project.description && (
                  <div className="ml-4 text-gray-800 dark:text-gray-200 text-sm leading-relaxed whitespace-pre-line mt-2">
                    {project.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {activeSections.certifications && certifications && certifications.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100 uppercase tracking-wider border-b border-gray-300 dark:border-gray-600 pb-1">
            Certifications
          </h2>

          <div className="space-y-3">
            {certifications.map((cert) => (
              <div key={cert.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-base text-gray-900 dark:text-gray-100">{cert.name || 'Certification Name'}</h3>
                    <h4 className="text-gray-700 dark:text-gray-300 italic text-sm">{cert.issuer || 'Issuing Organization'}</h4>
                    {cert.credentialId && (
                      <p className="text-gray-600 dark:text-gray-400 text-xs">Credential ID: {cert.credentialId}</p>
                    )}
                  </div>
                  <div className="text-right text-sm text-gray-600 dark:text-gray-400">
                    <p className="font-medium">{formatDate(cert.date)}</p>
                    {cert.expiryDate && (
                      <p className="text-xs">Expires: {formatDate(cert.expiryDate)}</p>
                    )}
                    {cert.link && (
                      <a href={cert.link} className="text-blue-600 dark:text-blue-400 underline text-xs">
                        Verify
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Languages */}
      {activeSections.languages && languages && languages.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100 uppercase tracking-wider border-b border-gray-300 dark:border-gray-600 pb-1">
            Languages
          </h2>

          <div className="space-y-2">
            {languages.map((lang) => (
              <div key={lang.id} className="flex justify-between items-center">
                <span className="font-semibold text-gray-800 dark:text-gray-200">{lang.name || 'Language'}</span>
                <span className="text-sm text-gray-700 dark:text-gray-300">{lang.proficiency || 'Intermediate'}</span>
              </div>
            ))}
          </div>
        </div>
      )}

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