import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, Table, TableRow, TableCell, WidthType } from 'docx';
import { saveAs } from 'file-saver';

/**
 * Generate and download a Word document that matches the current template style
 * @param {Object} cvData - CV data object
 * @param {Object} customization - Theme customization (colors, fonts, etc.)
 * @param {string} filename - Optional custom filename
 * @param {string} elementId - ID of the preview element to capture styling from
 */
export const generateWordDocument = async (cvData, customization, filename = 'resume.docx', elementId = 'cv-preview-print') => {
  try {
    // Get the preview element to read styles
    const previewElement = document.getElementById(elementId);

    if (!previewElement) {
      throw new Error('CV preview element not found. Please make sure the CV is loaded.');
    }

    // Extract computed styles from the preview
    const computedStyle = window.getComputedStyle(previewElement);

    // Create document sections with template-based styling
    const sections = [];

    // Document styling options based on template
    const primaryColor = customization?.primaryColor || '#3b82f6';
    const secondaryColor = customization?.secondaryColor || '#64748b';
    const fontFamily = computedStyle.fontFamily?.split(',')[0]?.replace(/['"]/g, '') || customization?.fontFamily || 'Calibri';

    // Base font size from template
    const baseFontSize = parseInt(computedStyle.fontSize) || 22;

    // Helper function to create styled text runs that match template
    const createTextRun = (text, options = {}) => {
      return new TextRun({
        text: text,
        font: fontFamily,
        size: options.size || baseFontSize,
        bold: options.bold || false,
        color: options.color || '000000',
        italic: options.italic || false,
        ...options
      });
    };

    // Helper function to create section headings matching template style
    const createSectionHeading = (title) => {
      return new Paragraph({
        children: [
          createTextRun(title.toUpperCase(), {
            bold: true,
            size: Math.round(baseFontSize * 1.2), // 20% larger than base
            color: primaryColor.replace('#', '')
          })
        ],
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 240, after: 120 },
        border: {
          bottom: {
            color: primaryColor.replace('#', ''),
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6,
          },
        },
      });
    };

    // Extract the template structure by reading the actual preview content
    const nameElement = previewElement.querySelector('h1, [class*="name"], .cv-name');
    const contactElement = previewElement.querySelector('[class*="contact"], .cv-contact');

    // Name and Header - Match template styling
    if (cvData.personalInfo?.fullName) {
      const nameStyle = nameElement ? window.getComputedStyle(nameElement) : null;
      const nameSize = nameStyle ? parseInt(nameStyle.fontSize) * 2 : Math.round(baseFontSize * 1.6);
      const nameColor = nameStyle?.color || primaryColor;

      sections.push(
        new Paragraph({
          children: [
            createTextRun(cvData.personalInfo.fullName, {
              bold: true,
              size: nameSize,
              color: nameColor === 'rgb(0, 0, 0)' ? primaryColor.replace('#', '') : primaryColor.replace('#', '')
            })
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 120 }
        })
      );
    }

    // Contact Information - Match template layout
    const contactInfo = [];
    if (cvData.personalInfo?.email) contactInfo.push(cvData.personalInfo.email);
    if (cvData.personalInfo?.phone) contactInfo.push(cvData.personalInfo.phone);
    if (cvData.personalInfo?.address) contactInfo.push(cvData.personalInfo.address);

    if (contactInfo.length > 0) {
      const contactStyle = contactElement ? window.getComputedStyle(contactElement) : null;
      const contactSize = contactStyle ? parseInt(contactStyle.fontSize) * 2 : Math.round(baseFontSize * 0.9);

      sections.push(
        new Paragraph({
          children: [createTextRun(contactInfo.join(' • '), { size: contactSize })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 120 }
        })
      );
    }

    // Links
    const links = [];
    if (cvData.personalInfo?.linkedin) links.push(cvData.personalInfo.linkedin);
    if (cvData.personalInfo?.github) links.push(cvData.personalInfo.github);
    if (cvData.personalInfo?.website) links.push(cvData.personalInfo.website);

    if (links.length > 0) {
      sections.push(
        new Paragraph({
          children: [createTextRun(links.join(' • '), {
            size: Math.round(baseFontSize * 0.9),
            color: secondaryColor.replace('#', '')
          })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 240 }
        })
      );
    }

    // Function to process sections based on template order
    const processSections = () => {
      const sectionsToProcess = [
        { key: 'profile', title: 'Professional Summary', data: cvData.profile?.summary },
        { key: 'experience', title: 'Professional Experience', data: cvData.experience },
        { key: 'education', title: 'Education', data: cvData.education },
        { key: 'skills', title: 'Skills', data: cvData.skills },
        { key: 'projects', title: 'Projects', data: cvData.projects },
        { key: 'certifications', title: 'Certifications', data: cvData.certifications },
        { key: 'languages', title: 'Languages', data: cvData.languages }
      ];

      // Process sections in the order they appear in the template
      sectionsToProcess.forEach(section => {
        if (section.data && ((Array.isArray(section.data) && section.data.length > 0) ||
            (typeof section.data === 'string' && section.data.trim()) ||
            (typeof section.data === 'object' && Object.keys(section.data).length > 0))) {

          sections.push(createSectionHeading(section.title));

          switch(section.key) {
            case 'profile':
              sections.push(
                new Paragraph({
                  children: [createTextRun(section.data, { size: baseFontSize })],
                  spacing: { after: 240 },
                  alignment: AlignmentType.JUSTIFIED
                })
              );
              break;

            case 'experience':
              section.data.forEach((exp, index) => {
                if (exp.jobTitle || exp.company) {
                  const titleParts = [];
                  if (exp.jobTitle) titleParts.push(createTextRun(exp.jobTitle, { bold: true, size: Math.round(baseFontSize * 1.1) }));
                  if (exp.company) {
                    if (exp.jobTitle) titleParts.push(createTextRun(' at ', { size: baseFontSize }));
                    titleParts.push(createTextRun(exp.company, { size: baseFontSize, italic: true, color: secondaryColor.replace('#', '') }));
                  }

                  sections.push(
                    new Paragraph({
                      children: titleParts,
                      spacing: { before: index > 0 ? 120 : 0, after: 60 }
                    })
                  );
                }

                // Dates and location
                const dateLocationInfo = [];
                if (exp.startDate || exp.endDate || exp.isPresent) {
                  const dates = `${exp.startDate || ''} - ${exp.isPresent ? 'Present' : exp.endDate || ''}`;
                  dateLocationInfo.push(dates);
                }
                if (exp.location) dateLocationInfo.push(exp.location);

                if (dateLocationInfo.length > 0) {
                  sections.push(
                    new Paragraph({
                      children: [createTextRun(dateLocationInfo.join(' • '), {
                        size: Math.round(baseFontSize * 0.85),
                        italic: true,
                        color: secondaryColor.replace('#', '')
                      })],
                      spacing: { after: 80 }
                    })
                  );
                }

                // Description with bullet points
                if (exp.description) {
                  const points = exp.description.split(/[•\n]/).filter(point => point.trim());

                  if (points.length > 1) {
                    points.forEach(point => {
                      if (point.trim()) {
                        sections.push(
                          new Paragraph({
                            children: [
                              createTextRun('• ', { size: baseFontSize }),
                              createTextRun(point.trim(), { size: baseFontSize })
                            ],
                            spacing: { after: 60 },
                            indent: { left: 360 }
                          })
                        );
                      }
                    });
                  } else {
                    sections.push(
                      new Paragraph({
                        children: [createTextRun(exp.description, { size: baseFontSize })],
                        spacing: { after: 120 },
                        indent: { left: 360 },
                        alignment: AlignmentType.JUSTIFIED
                      })
                    );
                  }
                }
              });
              break;

            case 'education':
              section.data.forEach((edu, index) => {
                if (edu.degree || edu.school) {
                  const titleParts = [];
                  if (edu.degree) titleParts.push(createTextRun(edu.degree, { bold: true, size: Math.round(baseFontSize * 1.1) }));
                  if (edu.school) {
                    if (edu.degree) titleParts.push(createTextRun(' - ', { size: baseFontSize }));
                    titleParts.push(createTextRun(edu.school, { size: baseFontSize, italic: true, color: secondaryColor.replace('#', '') }));
                  }

                  sections.push(
                    new Paragraph({
                      children: titleParts,
                      spacing: { before: index > 0 ? 120 : 0, after: 60 }
                    })
                  );
                }

                const dateLocationInfo = [];
                if (edu.startDate || edu.endDate) {
                  const dates = `${edu.startDate || ''} - ${edu.endDate || ''}`;
                  dateLocationInfo.push(dates);
                }
                if (edu.location) dateLocationInfo.push(edu.location);

                if (dateLocationInfo.length > 0) {
                  sections.push(
                    new Paragraph({
                      children: [createTextRun(dateLocationInfo.join(' • '), {
                        size: Math.round(baseFontSize * 0.85),
                        italic: true,
                        color: secondaryColor.replace('#', '')
                      })],
                      spacing: { after: 80 }
                    })
                  );
                }

                if (edu.description) {
                  sections.push(
                    new Paragraph({
                      children: [createTextRun(edu.description, { size: baseFontSize })],
                      spacing: { after: 120 },
                      indent: { left: 360 },
                      alignment: AlignmentType.JUSTIFIED
                    })
                  );
                }
              });
              break;

            case 'skills':
              if (section.data.technical?.length > 0) {
                sections.push(
                  new Paragraph({
                    children: [
                      createTextRun('Technical: ', { bold: true, size: baseFontSize, color: primaryColor.replace('#', '') }),
                      createTextRun(section.data.technical.join(', '), { size: baseFontSize })
                    ],
                    spacing: { after: 80 }
                  })
                );
              }

              if (section.data.tools?.length > 0) {
                sections.push(
                  new Paragraph({
                    children: [
                      createTextRun('Tools & Technologies: ', { bold: true, size: baseFontSize, color: primaryColor.replace('#', '') }),
                      createTextRun(section.data.tools.join(', '), { size: baseFontSize })
                    ],
                    spacing: { after: 80 }
                  })
                );
              }

              if (section.data.soft?.length > 0) {
                sections.push(
                  new Paragraph({
                    children: [
                      createTextRun('Soft Skills: ', { bold: true, size: baseFontSize, color: primaryColor.replace('#', '') }),
                      createTextRun(section.data.soft.join(', '), { size: baseFontSize })
                    ],
                    spacing: { after: 80 }
                  })
                );
              }

              if (section.data.languages?.length > 0) {
                sections.push(
                  new Paragraph({
                    children: [
                      createTextRun('Programming Languages: ', { bold: true, size: baseFontSize, color: primaryColor.replace('#', '') }),
                      createTextRun(section.data.languages.join(', '), { size: baseFontSize })
                    ],
                    spacing: { after: 120 }
                  })
                );
              }
              break;

            case 'projects':
              section.data.forEach((project, index) => {
                if (project.name) {
                  sections.push(
                    new Paragraph({
                      children: [createTextRun(project.name, { bold: true, size: Math.round(baseFontSize * 1.1), color: primaryColor.replace('#', '') })],
                      spacing: { before: index > 0 ? 120 : 0, after: 60 }
                    })
                  );

                  if (project.description) {
                    sections.push(
                      new Paragraph({
                        children: [createTextRun(project.description, { size: baseFontSize })],
                        spacing: { after: 80 },
                        indent: { left: 360 }
                      })
                    );
                  }

                  if (project.technologies) {
                    sections.push(
                      new Paragraph({
                        children: [
                          createTextRun('Technologies: ', { bold: true, size: Math.round(baseFontSize * 0.9), color: secondaryColor.replace('#', '') }),
                          createTextRun(project.technologies, { size: Math.round(baseFontSize * 0.9) })
                        ],
                        spacing: { after: 80 },
                        indent: { left: 360 }
                      })
                    );
                  }

                  const projectLinks = [];
                  if (project.url) projectLinks.push(`Live: ${project.url}`);
                  if (project.github) projectLinks.push(`GitHub: ${project.github}`);

                  if (projectLinks.length > 0) {
                    sections.push(
                      new Paragraph({
                        children: [createTextRun(projectLinks.join(' • '), { size: Math.round(baseFontSize * 0.9), italic: true, color: secondaryColor.replace('#', '') })],
                        spacing: { after: 120 },
                        indent: { left: 360 }
                      })
                    );
                  }
                }
              });
              break;

            case 'certifications':
              section.data.forEach((cert, index) => {
                if (cert.name) {
                  const certTitle = [];
                  certTitle.push(createTextRun(cert.name, { bold: true, size: Math.round(baseFontSize * 1.1) }));
                  if (cert.issuer) {
                    certTitle.push(createTextRun(` - ${cert.issuer}`, { size: baseFontSize, italic: true, color: secondaryColor.replace('#', '') }));
                  }

                  sections.push(
                    new Paragraph({
                      children: certTitle,
                      spacing: { before: index > 0 ? 120 : 0, after: 60 }
                    })
                  );

                  if (cert.date) {
                    sections.push(
                      new Paragraph({
                        children: [createTextRun(`Earned: ${cert.date}`, { size: Math.round(baseFontSize * 0.85), italic: true, color: secondaryColor.replace('#', '') })],
                        spacing: { after: 80 },
                        indent: { left: 360 }
                      })
                    );
                  }

                  if (cert.description) {
                    sections.push(
                      new Paragraph({
                        children: [createTextRun(cert.description, { size: baseFontSize })],
                        spacing: { after: 120 },
                        indent: { left: 360 }
                      })
                    );
                  }
                }
              });
              break;

            case 'languages':
              const langList = section.data.map(lang => {
                let langText = lang.name || lang;
                if (lang.proficiency && typeof lang === 'object') {
                  langText += ` (${lang.proficiency})`;
                }
                return langText;
              });

              sections.push(
                new Paragraph({
                  children: [createTextRun(langList.join(', '), { size: baseFontSize })],
                  spacing: { after: 120 }
                })
              );
              break;
          }

          // Add spacing after each section
          sections.push(new Paragraph({ text: '', spacing: { after: 120 } }));
        }
      });
    };

    // Process all sections
    processSections();

    // Create the document with template-based styling
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: sections,
        },
      ],
    });

    // Generate and save the document
    const buffer = await Packer.toBlob(doc);
    saveAs(buffer, filename);

    return {
      success: true,
      message: 'Word document downloaded successfully! The document preserves your template styling and is fully editable.'
    };

  } catch (error) {
    console.error('Word Document Generation Error:', error);
    return {
      success: false,
      message: `Failed to generate Word document: ${error.message}`
    };
  }
};

/**
 * Suggest Word filename based on CV data
 * @param {Object} cvData - CV data object
 */
export const suggestWordFilename = (cvData) => {
  const { personalInfo } = cvData;

  if (personalInfo?.fullName) {
    const cleanName = personalInfo.fullName
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .replace(/\s+/g, '_')
      .toLowerCase();

    const timestamp = new Date().toISOString().split('T')[0];
    return `${cleanName}_resume_${timestamp}.docx`;
  }

  return `resume_${new Date().toISOString().split('T')[0]}.docx`;
};