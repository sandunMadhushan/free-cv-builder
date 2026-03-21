import React from 'react';

export const ModernTemplate = ({ cvData, customization }) => {
  const { personalInfo, profile, experience } = cvData;
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

      {/* Professional Summary */}
      {profile.summary && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3" style={{ color: primaryColor }}>
            PROFESSIONAL SUMMARY
          </h2>
          <p className="text-gray-700 leading-relaxed">{profile.summary}</p>
        </div>
      )}

      {/* Work Experience */}
      {experience && experience.length > 0 && (
        <div className="mb-6">
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
      )}

      {/* Empty State */}
      {!personalInfo.fullName && !profile.summary && experience.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p className="text-lg">Start filling out the form to see your CV preview</p>
          <p className="text-sm mt-2">Changes will appear here in real-time</p>
        </div>
      )}
    </div>
  );
};
