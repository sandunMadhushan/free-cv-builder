import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, WidthType } from "docx";
import { saveAs } from "file-saver";

/**
 * Professional DOCX Generator for CV Export
 * Creates editable Word documents that maintain template styling
 */
export class DOCXGenerator {
  constructor() {
    // Define professional styles and formatting
    this.styles = {
      fonts: {
        primary: "Calibri",
        secondary: "Arial",
        inter: "Segoe UI" // Fallback for Inter font
      },
      spacing: {
        section: 240, // 12pt
        subsection: 120, // 6pt
        normal: 0
      }
    };
  }

  /**
   * Main function to generate DOCX from CV data with template styling
   */
  async generateDOCX(cvData, templateConfig, filename = "resume.docx") {
    try {
      // Validate CV data
      const validation = this.validateCVData(cvData);
      if (!validation.isValid) {
        throw new Error(`CV validation failed: ${validation.issues.join(", ")}`);
      }

      // Extract template customization
      const customization = templateConfig?.customization || {};
      const selectedTemplate = templateConfig?.selectedTemplate || 'modern';

      // Convert template styles to Word styles
      const docStyles = this.convertTemplateStyles(customization, selectedTemplate);

      // Create document sections
      const children = [];

      // Add header with personal info
      children.push(...this.createHeader(cvData.personalInfo, docStyles));

      // Add contact information
      children.push(...this.createContactInfo(cvData.personalInfo, docStyles));

      // Add sections based on active sections and order
      const sections = cvData.sectionOrder || [
        "profile", "experience", "education", "skills",
        "projects", "certifications", "languages"
      ];

      for (const sectionName of sections) {
        if (cvData.activeSections?.[sectionName]) {
          const sectionContent = this.createSection(sectionName, cvData[sectionName], cvData, docStyles);
          if (sectionContent.length > 0) {
            children.push(...sectionContent);
          }
        }
      }

      // Create document with template-aware styling
      const doc = new Document({
        creator: "Professional CV Builder",
        title: `${cvData.personalInfo?.fullName || "Professional"} - Resume`,
        description: `Professional resume created with ${selectedTemplate} template`,
        styles: {
          default: {
            heading1: {
              run: {
                size: docStyles.heading1.size,
                bold: true,
                color: docStyles.heading1.color,
                font: docStyles.fonts.primary
              },
              paragraph: {
                spacing: {
                  after: this.styles.spacing.subsection,
                },
                alignment: docStyles.heading1.alignment
              },
            },
            heading2: {
              run: {
                size: docStyles.heading2.size,
                bold: true,
                color: docStyles.heading2.color,
                font: docStyles.fonts.primary
              },
              paragraph: {
                spacing: {
                  before: this.styles.spacing.section,
                  after: this.styles.spacing.subsection,
                },
              },
            },
            heading3: {
              run: {
                size: docStyles.heading3.size,
                bold: true,
                color: docStyles.text.color,
                font: docStyles.fonts.primary
              },
              paragraph: {
                spacing: {
                  before: this.styles.spacing.subsection,
                  after: 60,
                },
              },
            },
          },
        },
        sections: [
          {
            properties: {},
            children: children,
          },
        ],
      });

      // Generate and save the document
      const blob = await Packer.toBlob(doc);
      saveAs(blob, filename);

      return {
        success: true,
        message: `DOCX exported successfully as ${filename} with ${selectedTemplate} template styling! You can now edit it in Microsoft Word or Google Docs.`,
        format: "DOCX",
        editableInWord: true,
        editableInGoogleDocs: true,
        atsCompatible: true,
        preservesFormatting: true,
        templateUsed: selectedTemplate
      };

    } catch (error) {
      console.error("DOCX Generation Error:", error);
      return {
        success: false,
        message: `Failed to generate DOCX: ${error.message}`,
      };
    }
  }

  /**
   * Convert template customization to Word document styles
   */
  convertTemplateStyles(customization, templateName) {
    const {
      primaryColor = '#3b82f6',
      secondaryColor = '#64748b',
      fontFamily = 'Inter',
      fontSize = 'medium',
      spacing = 'comfortable',
      accentStyle = 'bold'
    } = customization;

    // Convert hex colors to RGB for Word
    const hexToRgb = (hex) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : {r: 59, g: 130, b: 246}; // Default blue
    };

    const primaryRgb = hexToRgb(primaryColor);
    const secondaryRgb = hexToRgb(secondaryColor);
    const textRgb = {r: 46, g: 52, b: 64}; // Default dark text

    // Font size mapping (in half-points for Word)
    const fontSizeMap = {
      small: { heading1: 32, heading2: 24, heading3: 20, body: 18, small: 16 },
      medium: { heading1: 36, heading2: 28, heading3: 24, body: 22, small: 18 },
      large: { heading1: 40, heading2: 32, heading3: 28, body: 26, small: 20 }
    };

    const sizes = fontSizeMap[fontSize] || fontSizeMap.medium;

    // Spacing mapping (in twips - 1/20th of a point)
    const spacingMap = {
      compact: { section: 180, subsection: 120, item: 60 },
      comfortable: { section: 240, subsection: 180, item: 120 },
      spacious: { section: 360, subsection: 240, item: 180 }
    };

    const spacingValues = spacingMap[spacing] || spacingMap.comfortable;

    return {
      fonts: {
        primary: this.mapFontFamily(fontFamily),
        body: this.mapFontFamily(fontFamily)
      },
      colors: {
        primary: `${primaryRgb.r.toString(16).padStart(2, '0')}${primaryRgb.g.toString(16).padStart(2, '0')}${primaryRgb.b.toString(16).padStart(2, '0')}`,
        secondary: `${secondaryRgb.r.toString(16).padStart(2, '0')}${secondaryRgb.g.toString(16).padStart(2, '0')}${secondaryRgb.b.toString(16).padStart(2, '0')}`,
        text: `${textRgb.r.toString(16).padStart(2, '0')}${textRgb.g.toString(16).padStart(2, '0')}${textRgb.b.toString(16).padStart(2, '0')}`
      },
      heading1: {
        size: sizes.heading1,
        color: `${primaryRgb.r.toString(16).padStart(2, '0')}${primaryRgb.g.toString(16).padStart(2, '0')}${primaryRgb.b.toString(16).padStart(2, '0')}`,
        alignment: templateName === 'minimal' ? AlignmentType.LEFT : AlignmentType.CENTER
      },
      heading2: {
        size: sizes.heading2,
        color: `${primaryRgb.r.toString(16).padStart(2, '0')}${primaryRgb.g.toString(16).padStart(2, '0')}${primaryRgb.b.toString(16).padStart(2, '0')}`
      },
      heading3: {
        size: sizes.heading3,
        color: `${textRgb.r.toString(16).padStart(2, '0')}${textRgb.g.toString(16).padStart(2, '0')}${textRgb.b.toString(16).padStart(2, '0')}`
      },
      body: {
        size: sizes.body,
        color: `${textRgb.r.toString(16).padStart(2, '0')}${textRgb.g.toString(16).padStart(2, '0')}${textRgb.b.toString(16).padStart(2, '0')}`
      },
      small: {
        size: sizes.small,
        color: `${secondaryRgb.r.toString(16).padStart(2, '0')}${secondaryRgb.g.toString(16).padStart(2, '0')}${secondaryRgb.b.toString(16).padStart(2, '0')}`
      },
      text: {
        color: `${textRgb.r.toString(16).padStart(2, '0')}${textRgb.g.toString(16).padStart(2, '0')}${textRgb.b.toString(16).padStart(2, '0')}`
      },
      spacing: spacingValues,
      accentStyle: accentStyle
    };
  }

  /**
   * Map web fonts to Word-compatible fonts
   */
  mapFontFamily(fontFamily) {
    const fontMap = {
      'Inter': 'Segoe UI',
      'Roboto': 'Calibri',
      'Open Sans': 'Arial',
      'Lato': 'Calibri',
      'Montserrat': 'Segoe UI'
    };
    return fontMap[fontFamily] || 'Calibri';
  }

  /**
   * Create document header with name and title
   */
  createHeader(personalInfo, docStyles) {
    const elements = [];

    if (personalInfo?.fullName) {
      elements.push(
        new Paragraph({
          children: [
            new TextRun({
              text: personalInfo.fullName,
              bold: true,
              size: docStyles.heading1.size,
              color: docStyles.heading1.color,
              font: docStyles.fonts.primary,
            }),
          ],
          heading: HeadingLevel.HEADING_1,
          alignment: docStyles.heading1.alignment,
          spacing: { after: 120 },
        })
      );
    }

    // Add professional title if available
    const professionalTitle = this.extractProfessionalTitle(personalInfo);
    if (professionalTitle) {
      elements.push(
        new Paragraph({
          children: [
            new TextRun({
              text: professionalTitle,
              size: docStyles.heading2.size,
              color: docStyles.colors.secondary,
              font: docStyles.fonts.primary,
            }),
          ],
          alignment: docStyles.heading1.alignment,
          spacing: { after: 240 },
        })
      );
    }

    return elements;
  }

  /**
   * Create contact information section
   */
  createContactInfo(personalInfo, docStyles) {
    const elements = [];
    const contactItems = [];

    // Collect contact information
    if (personalInfo?.email) contactItems.push(personalInfo.email);
    if (personalInfo?.phone) contactItems.push(personalInfo.phone);
    if (personalInfo?.location) contactItems.push(personalInfo.location);

    if (contactItems.length > 0) {
      elements.push(
        new Paragraph({
          children: [
            new TextRun({
              text: contactItems.join(" • "),
              size: docStyles.body.size,
              color: docStyles.text.color,
              font: docStyles.fonts.body,
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 120 },
        })
      );
    }

    // Add links on a separate line
    const links = [];
    if (personalInfo?.linkedin) links.push(personalInfo.linkedin);
    if (personalInfo?.github) links.push(personalInfo.github);
    if (personalInfo?.website) links.push(personalInfo.website);

    if (links.length > 0) {
      elements.push(
        new Paragraph({
          children: [
            new TextRun({
              text: links.join(" • "),
              size: docStyles.small.size,
              color: docStyles.colors.secondary,
              font: docStyles.fonts.body,
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 240 },
        })
      );
    }

    return elements;
  }

  /**
   * Create individual sections based on section type
   */
  createSection(sectionName, sectionData, fullCVData, docStyles) {
    switch (sectionName) {
      case "profile":
        return this.createProfileSection(sectionData, docStyles);
      case "experience":
        return this.createExperienceSection(sectionData, docStyles);
      case "education":
        return this.createEducationSection(sectionData, docStyles);
      case "skills":
        return this.createSkillsSection(sectionData, docStyles);
      case "projects":
        return this.createProjectsSection(sectionData, docStyles);
      case "certifications":
        return this.createCertificationsSection(sectionData, docStyles);
      case "languages":
        return this.createLanguagesSection(sectionData, docStyles);
      default:
        return [];
    }
  }

  /**
   * Create section header
   */
  createSectionHeader(title, docStyles) {
    return new Paragraph({
      children: [
        new TextRun({
          text: title,
          bold: true,
          size: docStyles.heading2.size,
          color: docStyles.heading2.color,
          font: docStyles.fonts.primary,
        }),
      ],
      heading: HeadingLevel.HEADING_2,
      spacing: { before: docStyles.spacing.section, after: docStyles.spacing.subsection },
      border: {
        bottom: {
          color: docStyles.colors.primary,
          space: 1,
          style: BorderStyle.SINGLE,
          size: 6,
        },
      },
    });
  }

  /**
   * Create profile/summary section
   */
  createProfileSection(profileData, docStyles) {
    const elements = [];

    if (profileData?.summary) {
      elements.push(this.createSectionHeader("PROFESSIONAL SUMMARY", docStyles));
      elements.push(
        new Paragraph({
          children: [
            new TextRun({
              text: profileData.summary,
              size: docStyles.body.size,
              color: docStyles.text.color,
              font: docStyles.fonts.body,
            }),
          ],
          spacing: { after: 240 },
        })
      );
    }

    return elements;
  }

  /**
   * Create experience section
   */
  createExperienceSection(experienceData, docStyles) {
    const elements = [];

    if (experienceData && experienceData.length > 0) {
      elements.push(this.createSectionHeader("PROFESSIONAL EXPERIENCE", docStyles));

      experienceData.forEach((exp, index) => {
        if (exp.company || exp.position) {
          // Job title and company with template styling
          const jobTitle = exp.position || "";
          const company = exp.company || "";
          const jobHeader = jobTitle && company ? `${jobTitle} at ${company}` : jobTitle || company;

          const isBold = docStyles.accentStyle === 'bold';
          const isItalic = docStyles.accentStyle === 'italic';
          const isUnderlined = docStyles.accentStyle === 'underline';

          elements.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: jobHeader,
                  bold: isBold,
                  italics: isItalic,
                  underline: isUnderlined ? {} : false,
                  size: docStyles.heading3.size,
                  color: docStyles.text.color,
                  font: docStyles.fonts.primary,
                }),
              ],
              spacing: { before: index > 0 ? 180 : 0, after: 60 },
            })
          );

          // Dates and location
          const dateInfo = [];
          if (exp.startDate) dateInfo.push(exp.startDate);
          if (exp.current) {
            dateInfo.push("Present");
          } else if (exp.endDate) {
            dateInfo.push(exp.endDate);
          }

          let dateLocationText = "";
          if (dateInfo.length > 0) {
            dateLocationText = dateInfo.join(" - ");
          }
          if (exp.location) {
            dateLocationText += dateLocationText ? ` • ${exp.location}` : exp.location;
          }

          if (dateLocationText) {
            elements.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: dateLocationText,
                    size: docStyles.small.size,
                    color: docStyles.colors.secondary,
                    font: docStyles.fonts.body,
                    italics: true,
                  }),
                ],
                spacing: { after: 120 },
              })
            );
          }

          // Description
          if (exp.description) {
            elements.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: exp.description,
                    size: docStyles.body.size,
                    color: docStyles.text.color,
                    font: docStyles.fonts.body,
                  }),
                ],
                spacing: { after: 120 },
              })
            );
          }

          // Highlights as bullet points
          if (exp.highlights && exp.highlights.length > 0) {
            exp.highlights.forEach((highlight) => {
              elements.push(
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `• ${highlight}`,
                      size: docStyles.body.size,
                      color: docStyles.text.color,
                      font: docStyles.fonts.body,
                    }),
                  ],
                  indent: { left: 360 },
                  spacing: { after: 60 },
                })
              );
            });
          }
        }
      });
    }

    return elements;
  }

  /**
   * Create skills section with template styling
   */
  createSkillsSection(skillsData, docStyles) {
    const elements = [];

    if (skillsData) {
      const hasSkills = Object.values(skillsData).some(
        (skills) => Array.isArray(skills) && skills.length > 0
      );

      if (hasSkills) {
        elements.push(this.createSectionHeader("SKILLS", docStyles));

        // Technical Skills
        if (skillsData.technical && skillsData.technical.length > 0) {
          elements.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: "Technical: ",
                  bold: true,
                  size: docStyles.body.size,
                  color: docStyles.text.color,
                  font: docStyles.fonts.body,
                }),
                new TextRun({
                  text: skillsData.technical.join(", "),
                  size: docStyles.body.size,
                  color: docStyles.text.color,
                  font: docStyles.fonts.body,
                }),
              ],
              spacing: { after: 120 },
            })
          );
        }

        // Tools & Frameworks
        if (skillsData.tools && skillsData.tools.length > 0) {
          elements.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: "Tools & Frameworks: ",
                  bold: true,
                  size: docStyles.body.size,
                  color: docStyles.text.color,
                  font: docStyles.fonts.body,
                }),
                new TextRun({
                  text: skillsData.tools.join(", "),
                  size: docStyles.body.size,
                  color: docStyles.text.color,
                  font: docStyles.fonts.body,
                }),
              ],
              spacing: { after: 120 },
            })
          );
        }

        // Soft Skills
        if (skillsData.soft && skillsData.soft.length > 0) {
          elements.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: "Soft Skills: ",
                  bold: true,
                  size: docStyles.body.size,
                  color: docStyles.text.color,
                  font: docStyles.fonts.body,
                }),
                new TextRun({
                  text: skillsData.soft.join(", "),
                  size: docStyles.body.size,
                  color: docStyles.text.color,
                  font: docStyles.fonts.body,
                }),
              ],
              spacing: { after: 120 },
            })
          );
        }

        // Programming Languages
        if (skillsData.languages && skillsData.languages.length > 0) {
          elements.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: "Programming Languages: ",
                  bold: true,
                  size: docStyles.body.size,
                  color: docStyles.text.color,
                  font: docStyles.fonts.body,
                }),
                new TextRun({
                  text: skillsData.languages.join(", "),
                  size: docStyles.body.size,
                  color: docStyles.text.color,
                  font: docStyles.fonts.body,
                }),
              ],
              spacing: { after: 120 },
            })
          );
        }
      }
    }

    return elements;
  }

  // I'll keep the other section methods similar but update them to use docStyles parameter
  createEducationSection(educationData, docStyles) {
    const elements = [];

    if (educationData && educationData.length > 0) {
      elements.push(this.createSectionHeader("EDUCATION", docStyles));

      educationData.forEach((edu, index) => {
        if (edu.institution || edu.degree) {
          // Degree and institution
          const degree = edu.degree || "";
          const field = edu.field || "";
          const institution = edu.institution || "";

          let eduHeader = "";
          if (degree && field) {
            eduHeader = `${degree} in ${field}`;
          } else {
            eduHeader = degree || field || "";
          }

          if (institution) {
            eduHeader += eduHeader ? ` - ${institution}` : institution;
          }

          const isBold = docStyles.accentStyle === 'bold';
          const isItalic = docStyles.accentStyle === 'italic';
          const isUnderlined = docStyles.accentStyle === 'underline';

          elements.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: eduHeader,
                  bold: isBold,
                  italics: isItalic,
                  underline: isUnderlined ? {} : false,
                  size: docStyles.heading3.size,
                  color: docStyles.text.color,
                  font: docStyles.fonts.primary,
                }),
              ],
              spacing: { before: index > 0 ? 180 : 0, after: 60 },
            })
          );

          // Dates and location
          const dateInfo = [];
          if (edu.startDate) dateInfo.push(edu.startDate);
          if (edu.endDate) dateInfo.push(edu.endDate);

          let dateLocationText = "";
          if (dateInfo.length > 0) {
            dateLocationText = dateInfo.join(" - ");
          }
          if (edu.location) {
            dateLocationText += dateLocationText ? ` • ${edu.location}` : edu.location;
          }
          if (edu.gpa) {
            dateLocationText += dateLocationText ? ` • GPA: ${edu.gpa}` : `GPA: ${edu.gpa}`;
          }

          if (dateLocationText) {
            elements.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: dateLocationText,
                    size: docStyles.small.size,
                    color: docStyles.colors.secondary,
                    font: docStyles.fonts.body,
                    italics: true,
                  }),
                ],
                spacing: { after: 120 },
              })
            );
          }

          // Achievements as bullet points
          if (edu.achievements && edu.achievements.length > 0) {
            edu.achievements.forEach((achievement) => {
              elements.push(
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `• ${achievement}`,
                      size: docStyles.body.size,
                      color: docStyles.text.color,
                      font: docStyles.fonts.body,
                    }),
                  ],
                  indent: { left: 360 },
                  spacing: { after: 60 },
                })
              );
            });
          }
        }
      });
    }

    return elements;
  }

  createProjectsSection(projectsData, docStyles) {
    const elements = [];

    if (projectsData && projectsData.length > 0) {
      elements.push(this.createSectionHeader("PROJECTS", docStyles));

      projectsData.forEach((project, index) => {
        if (project.name) {
          // Project name
          const isBold = docStyles.accentStyle === 'bold';
          const isItalic = docStyles.accentStyle === 'italic';
          const isUnderlined = docStyles.accentStyle === 'underline';

          elements.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: project.name,
                  bold: isBold,
                  italics: isItalic,
                  underline: isUnderlined ? {} : false,
                  size: docStyles.heading3.size,
                  color: docStyles.text.color,
                  font: docStyles.fonts.primary,
                }),
              ],
              spacing: { before: index > 0 ? 180 : 0, after: 60 },
            })
          );

          // Project dates
          if (project.startDate || project.endDate) {
            const dates = [];
            if (project.startDate) dates.push(project.startDate);
            if (project.endDate) dates.push(project.endDate);

            elements.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: dates.join(" - "),
                    size: docStyles.small.size,
                    color: docStyles.colors.secondary,
                    font: docStyles.fonts.body,
                    italics: true,
                  }),
                ],
                spacing: { after: 60 },
              })
            );
          }

          // Project description
          if (project.description) {
            elements.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: project.description,
                    size: docStyles.body.size,
                    color: docStyles.text.color,
                    font: docStyles.fonts.body,
                  }),
                ],
                spacing: { after: 120 },
              })
            );
          }

          // Technologies
          if (project.technologies && project.technologies.length > 0) {
            const techText = Array.isArray(project.technologies)
              ? project.technologies.join(", ")
              : project.technologies;

            elements.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Technologies: ",
                    bold: true,
                    size: docStyles.small.size,
                    color: docStyles.text.color,
                    font: docStyles.fonts.body,
                  }),
                  new TextRun({
                    text: techText,
                    size: docStyles.small.size,
                    color: docStyles.text.color,
                    font: docStyles.fonts.body,
                  }),
                ],
                spacing: { after: 60 },
              })
            );
          }

          // Project links
          if (project.link || project.github) {
            const links = [];
            if (project.link) links.push(`Live Demo: ${project.link}`);
            if (project.github) links.push(`GitHub: ${project.github}`);

            elements.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: links.join(" • "),
                    size: docStyles.small.size,
                    color: docStyles.colors.secondary,
                    font: docStyles.fonts.body,
                  }),
                ],
                spacing: { after: 120 },
              })
            );
          }
        }
      });
    }

    return elements;
  }

  createCertificationsSection(certificationsData, docStyles) {
    const elements = [];

    if (certificationsData && certificationsData.length > 0) {
      elements.push(this.createSectionHeader("CERTIFICATIONS", docStyles));

      certificationsData.forEach((cert, index) => {
        if (cert.name) {
          // Certification name and issuer
          let certText = cert.name;
          if (cert.issuer) {
            certText += ` - ${cert.issuer}`;
          }

          const isBold = docStyles.accentStyle === 'bold';
          const isItalic = docStyles.accentStyle === 'italic';
          const isUnderlined = docStyles.accentStyle === 'underline';

          elements.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: certText,
                  bold: isBold,
                  italics: isItalic,
                  underline: isUnderlined ? {} : false,
                  size: docStyles.heading3.size,
                  color: docStyles.text.color,
                  font: docStyles.fonts.primary,
                }),
              ],
              spacing: { before: index > 0 ? 180 : 0, after: 60 },
            })
          );

          // Certification date and credential ID
          const certDetails = [];
          if (cert.date) certDetails.push(`Earned: ${cert.date}`);
          if (cert.expiryDate) certDetails.push(`Expires: ${cert.expiryDate}`);
          if (cert.credentialId) certDetails.push(`ID: ${cert.credentialId}`);

          if (certDetails.length > 0) {
            elements.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: certDetails.join(" • "),
                    size: docStyles.small.size,
                    color: docStyles.colors.secondary,
                    font: docStyles.fonts.body,
                    italics: true,
                  }),
                ],
                spacing: { after: 60 },
              })
            );
          }

          // Verification link
          if (cert.link) {
            elements.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Verification: ${cert.link}`,
                    size: docStyles.small.size,
                    color: docStyles.colors.secondary,
                    font: docStyles.fonts.body,
                  }),
                ],
                spacing: { after: 120 },
              })
            );
          }
        }
      });
    }

    return elements;
  }

  /**
   * Create languages section with proficiency levels
   */
  createLanguagesSection(languagesData, docStyles) {
    const elements = [];

    if (languagesData && languagesData.length > 0) {
      elements.push(this.createSectionHeader("LANGUAGES", docStyles));

      languagesData.forEach((lang, index) => {
        if (lang.name) {
          // Language name and proficiency
          let langText = lang.name;
          if (lang.proficiency) {
            langText += ` - ${lang.proficiency}`;
          }

          const isBold = docStyles.accentStyle === 'bold';
          const isItalic = docStyles.accentStyle === 'italic';
          const isUnderlined = docStyles.accentStyle === 'underline';

          elements.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: langText,
                  bold: isBold,
                  italics: isItalic,
                  underline: isUnderlined ? {} : false,
                  size: docStyles.heading3.size,
                  color: docStyles.text.color,
                  font: docStyles.fonts.primary,
                }),
              ],
              spacing: { before: index > 0 ? 120 : 0, after: 60 },
            })
          );

          // Language details (certifications, etc.)
          if (lang.certification || lang.level) {
            const langDetails = [];
            if (lang.certification) langDetails.push(`Certified: ${lang.certification}`);
            if (lang.level && lang.level !== lang.proficiency) langDetails.push(`Level: ${lang.level}`);

            if (langDetails.length > 0) {
              elements.push(
                new Paragraph({
                  children: [
                    new TextRun({
                      text: langDetails.join(" • "),
                      size: docStyles.small.size,
                      color: docStyles.colors.secondary,
                      font: docStyles.fonts.body,
                      italics: true,
                    }),
                  ],
                  spacing: { after: 60 },
                })
              );
            }
          }
        }
      });
    }

    return elements;
  }

  // Remove the generic method and just keep complete implementations
  // createGenericSection(title, data, docStyles) {
  //   const elements = [];
  //   if (data && data.length > 0) {
  //     elements.push(this.createSectionHeader(title, docStyles));
  //     // Add basic content rendering here
  //   }
  //   return elements;
  // }

  /**
   * Extract professional title from CV data
   */
  extractProfessionalTitle(personalInfo) {
    // You can extend this to look in profile summary or first experience
    return null; // For now, just return null
  }

  /**
   * Validate CV data before export
   */
  validateCVData(cvData) {
    const issues = [];

    // Check essential fields
    if (!cvData.personalInfo?.fullName?.trim()) {
      issues.push("Full name is required");
    }

    if (!cvData.personalInfo?.email?.trim()) {
      issues.push("Email address is required");
    }

    // Check for at least some content
    const hasContent =
      (cvData.profile?.summary?.trim()) ||
      (cvData.experience?.length > 0) ||
      (cvData.education?.length > 0) ||
      (cvData.skills && Object.values(cvData.skills).some(skills =>
        Array.isArray(skills) && skills.length > 0
      ));

    if (!hasContent) {
      issues.push("Please add some content (profile, experience, education, or skills)");
    }

    return {
      isValid: issues.length === 0,
      issues: issues,
    };
  }

  /**
   * Generate filename suggestion
   */
  generateFilename(cvData) {
    const { personalInfo } = cvData;

    if (personalInfo?.fullName) {
      const cleanName = personalInfo.fullName
        .replace(/[^a-zA-Z0-9\s]/g, "")
        .replace(/\s+/g, "_")
        .toLowerCase();

      const timestamp = new Date().toISOString().split("T")[0];
      return `${cleanName}_resume_${timestamp}.docx`;
    }

    return `resume_${new Date().toISOString().split("T")[0]}.docx`;
  }
}

// Export default instance
export const docxGenerator = new DOCXGenerator();

/**
 * Quick export function for easy use
 */
export const generateDOCX = async (cvData, templateConfig, filename) => {
  return await docxGenerator.generateDOCX(cvData, templateConfig, filename);
};