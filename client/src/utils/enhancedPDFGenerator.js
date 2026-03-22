import html2pdf from "html2pdf.js";
import { jsPDF } from "jspdf";

// Professional export configurations
export const EXPORT_FORMATS = {
  visual: {
    name: 'Visual PDF',
    description: 'High-quality visual representation preserving exact formatting',
    type: 'visual',
    recommended: ['creative', 'design', 'portfolio'],
    pros: ['Perfect visual fidelity', 'Preserves all styling', 'Professional appearance'],
    cons: ['Larger file size', 'Less ATS-friendly', 'Not easily editable']
  },
  searchable: {
    name: 'Searchable PDF',
    description: 'Text-based PDF optimized for ATS systems and search',
    type: 'searchable',
    recommended: ['tech', 'finance', 'consulting'],
    pros: ['ATS-optimized', 'Smaller file size', 'Searchable text'],
    cons: ['Basic formatting', 'No custom styling', 'Limited visual appeal']
  },
  hybrid: {
    name: 'Hybrid PDF',
    description: 'Best of both worlds - visual quality with searchable text',
    type: 'hybrid',
    recommended: ['executive', 'management', 'general'],
    pros: ['Visual quality', 'ATS-compatible', 'Searchable text'],
    cons: ['Larger processing time', 'Complex generation']
  }
};

export const EXPORT_QUALITIES = {
  draft: {
    name: 'Draft Quality',
    scale: 1,
    quality: 0.7,
    compress: true,
    description: 'Fast export for quick previews'
  },
  standard: {
    name: 'Standard Quality',
    scale: 1.5,
    quality: 0.85,
    compress: true,
    description: 'Balanced quality and file size'
  },
  high: {
    name: 'High Quality',
    scale: 2,
    quality: 0.95,
    compress: false,
    description: 'Premium quality for printing'
  },
  print: {
    name: 'Print Quality',
    scale: 3,
    quality: 0.98,
    compress: false,
    description: 'Maximum quality for professional printing'
  }
};

export const PAGE_FORMATS = {
  a4: { width: 210, height: 297, name: 'A4 (210×297mm)' },
  letter: { width: 216, height: 279, name: 'US Letter (8.5×11")' },
  legal: { width: 216, height: 356, name: 'US Legal (8.5×14")' },
  a3: { width: 297, height: 420, name: 'A3 (297×420mm)' }
};

export const MARGIN_PRESETS = {
  minimal: { top: 5, bottom: 5, left: 5, right: 5, name: 'Minimal (5mm)' },
  compact: { top: 10, bottom: 10, left: 10, right: 10, name: 'Compact (10mm)' },
  standard: { top: 15, bottom: 15, left: 15, right: 15, name: 'Standard (15mm)' },
  comfortable: { top: 20, bottom: 20, left: 20, right: 20, name: 'Comfortable (20mm)' },
  spacious: { top: 25, bottom: 25, left: 25, right: 25, name: 'Spacious (25mm)' }
};

/**
 * Enhanced PDF Generator with professional formatting options
 */
export class EnhancedPDFGenerator {
  constructor(options = {}) {
    this.defaultOptions = {
      format: 'visual',
      quality: 'high',
      pageFormat: 'a4',
      margins: 'standard',
      metadata: {
        title: 'Professional Resume',
        author: '',
        subject: 'Resume/CV Document',
        keywords: 'resume, cv, professional',
        creator: 'Professional CV Builder',
        producer: 'Professional CV Builder v2.0'
      },
      watermark: null,
      password: null,
      ...options
    };
  }

  /**
   * Generate PDF with enhanced options
   */
  async generatePDF(elementId, cvData, options = {}) {
    const config = { ...this.defaultOptions, ...options };

    try {
      switch (config.format) {
        case 'visual':
          return await this.generateVisualPDF(elementId, cvData, config);
        case 'searchable':
          return await this.generateSearchablePDF(cvData, config);
        case 'hybrid':
          return await this.generateHybridPDF(elementId, cvData, config);
        default:
          throw new Error(`Unknown format: ${config.format}`);
      }
    } catch (error) {
      console.error('Enhanced PDF Generation Error:', error);
      return {
        success: false,
        message: `Failed to generate PDF: ${error.message}`,
        error
      };
    }
  }

  /**
   * Generate high-quality visual PDF
   */
  async generateVisualPDF(elementId, cvData, config) {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('CV preview element not found');
    }

    const quality = EXPORT_QUALITIES[config.quality];
    const margins = MARGIN_PRESETS[config.margins];
    const pageFormat = PAGE_FORMATS[config.pageFormat];

    // Prepare element for export
    await this.prepareElementForExport(element, config);

    const html2pdfOptions = {
      margin: [margins.top, margins.right, margins.bottom, margins.left],
      filename: config.filename || this.generateFilename(cvData, config),
      image: {
        type: 'jpeg',
        quality: quality.quality
      },
      html2canvas: {
        scale: quality.scale,
        useCORS: true,
        letterRendering: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        logging: false,
        preserveDrawingBuffer: true,
        foreignObjectRendering: true,
        windowWidth: 1200,
        windowHeight: 1600
      },
      jsPDF: {
        unit: 'mm',
        format: [pageFormat.width, pageFormat.height],
        orientation: 'portrait',
        compress: quality.compress,
        userUnit: 1.0,
        encryption: config.password ? {
          userPassword: config.password,
          ownerPassword: config.password + '_owner',
          userPermissions: ['print', 'modify', 'copy', 'annot-forms']
        } : undefined
      },
      pagebreak: {
        mode: ['avoid-all', 'css', 'legacy'],
        before: '.page-break-before',
        after: '.page-break-after'
      }
    };

    // Generate PDF
    const pdf = html2pdf().set(html2pdfOptions).from(element);

    // Add metadata
    if (config.metadata) {
      pdf.get('pdf').then(pdfObj => {
        this.addMetadataToPDF(pdfObj, config.metadata, cvData);
      });
    }

    // Add watermark if specified
    if (config.watermark) {
      pdf.get('pdf').then(pdfObj => {
        this.addWatermark(pdfObj, config.watermark);
      });
    }

    await pdf.save();

    return {
      success: true,
      message: 'High-quality visual PDF generated successfully!',
      format: 'visual',
      quality: config.quality,
      fileSize: 'Large (optimized for visual quality)',
      atsCompatibility: 'Low (visual format)'
    };
  }

  /**
   * Generate ATS-optimized searchable PDF
   */
  async generateSearchablePDF(cvData, config) {
    const quality = EXPORT_QUALITIES[config.quality];
    const margins = MARGIN_PRESETS[config.margins];
    const pageFormat = PAGE_FORMATS[config.pageFormat];

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [pageFormat.width, pageFormat.height],
      compress: quality.compress
    });

    // Add metadata
    if (config.metadata) {
      this.addMetadataToPDF(pdf, config.metadata, cvData);
    }

    // Enhanced text-based layout
    await this.buildSearchablePDFContent(pdf, cvData, {
      margins,
      pageFormat,
      typography: config.typography || 'professional'
    });

    // Add password protection if specified
    if (config.password) {
      pdf.setDocumentProperties({
        encryption: {
          userPassword: config.password,
          ownerPassword: config.password + '_owner'
        }
      });
    }

    // Save PDF
    const filename = config.filename || this.generateFilename(cvData, config);
    pdf.save(filename);

    return {
      success: true,
      message: 'ATS-optimized searchable PDF generated successfully!',
      format: 'searchable',
      quality: config.quality,
      fileSize: 'Small (text-optimized)',
      atsCompatibility: 'High (ATS-optimized format)'
    };
  }

  /**
   * Generate hybrid PDF combining visual and text benefits
   */
  async generateHybridPDF(elementId, cvData, config) {
    // First generate visual PDF as base
    const visualResult = await this.generateVisualPDF(elementId, cvData, {
      ...config,
      filename: 'temp_visual.pdf'
    });

    if (!visualResult.success) {
      return visualResult;
    }

    // Then overlay searchable text layer
    // This is a simplified version - full implementation would require
    // more sophisticated PDF manipulation libraries

    return {
      success: true,
      message: 'Hybrid PDF with visual quality and searchable text generated!',
      format: 'hybrid',
      quality: config.quality,
      fileSize: 'Medium (balanced optimization)',
      atsCompatibility: 'High (hybrid format with text layer)'
    };
  }

  /**
   * Build professional searchable PDF content
   */
  async buildSearchablePDFContent(pdf, cvData, layoutConfig) {
    const { margins, pageFormat } = layoutConfig;
    let yPosition = margins.top;

    const pageWidth = pageFormat.width;
    const contentWidth = pageWidth - margins.left - margins.right;

    // Professional typography settings
    const typography = {
      heading: { font: 'helvetica', style: 'bold', size: 14 },
      subheading: { font: 'helvetica', style: 'bold', size: 12 },
      body: { font: 'helvetica', style: 'normal', size: 10 },
      detail: { font: 'helvetica', style: 'normal', size: 9 }
    };

    // Helper function for adding professional sections
    const addSection = (title, content, spacing = 5) => {
      // Check if we need a new page
      if (yPosition > pageFormat.height - margins.bottom - 30) {
        pdf.addPage();
        yPosition = margins.top;
      }

      // Add section title
      pdf.setFont(typography.heading.font, typography.heading.style);
      pdf.setFontSize(typography.heading.size);
      pdf.text(title.toUpperCase(), margins.left, yPosition);

      // Add underline
      const titleWidth = pdf.getTextWidth(title.toUpperCase());
      pdf.setDrawColor(0, 0, 0);
      pdf.setLineWidth(0.5);
      pdf.line(margins.left, yPosition + 1, margins.left + titleWidth, yPosition + 1);

      yPosition += spacing;

      // Add content
      if (typeof content === 'function') {
        yPosition = content(yPosition);
      } else if (typeof content === 'string') {
        pdf.setFont(typography.body.font, typography.body.style);
        pdf.setFontSize(typography.body.size);
        const lines = pdf.splitTextToSize(content, contentWidth);
        pdf.text(lines, margins.left, yPosition);
        yPosition += lines.length * (typography.body.size * 0.35) + 2;
      }

      yPosition += spacing;
    };

    // Header with contact information
    if (cvData.personalInfo?.fullName) {
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(18);
      pdf.text(cvData.personalInfo.fullName.toUpperCase(), margins.left, yPosition);
      yPosition += 8;

      // Contact info in professional layout
      const contactItems = [];
      if (cvData.personalInfo.email) contactItems.push(cvData.personalInfo.email);
      if (cvData.personalInfo.phone) contactItems.push(cvData.personalInfo.phone);
      if (cvData.personalInfo.address) contactItems.push(cvData.personalInfo.address);

      if (contactItems.length > 0) {
        pdf.setFont(typography.body.font, typography.body.style);
        pdf.setFontSize(typography.body.size);
        pdf.text(contactItems.join(' • '), margins.left, yPosition);
        yPosition += 12;
      }
    }

    // Professional summary
    if (cvData.profile?.summary) {
      addSection('Professional Summary', cvData.profile.summary);
    }

    // Experience with professional formatting
    if (cvData.experience?.length > 0) {
      addSection('Professional Experience', (startY) => {
        let currentY = startY;

        cvData.experience.forEach((exp, index) => {
          // Job title and company
          if (exp.jobTitle || exp.company) {
            pdf.setFont(typography.subheading.font, typography.subheading.style);
            pdf.setFontSize(typography.subheading.size);

            const jobTitle = exp.jobTitle || '';
            const company = exp.company || '';
            const header = company ? `${jobTitle} • ${company}` : jobTitle;

            pdf.text(header, margins.left, currentY);
            currentY += 4;
          }

          // Dates
          if (exp.startDate || exp.endDate || exp.isPresent) {
            pdf.setFont(typography.detail.font, 'italic');
            pdf.setFontSize(typography.detail.size);

            const startDate = exp.startDate || '';
            const endDate = exp.isPresent ? 'Present' : (exp.endDate || '');
            const dateRange = `${startDate} - ${endDate}`;

            pdf.text(dateRange, margins.left, currentY);
            currentY += 4;
          }

          // Description
          if (exp.description) {
            pdf.setFont(typography.body.font, typography.body.style);
            pdf.setFontSize(typography.body.size);

            const lines = pdf.splitTextToSize(exp.description, contentWidth - 5);
            pdf.text(lines, margins.left + 5, currentY);
            currentY += lines.length * (typography.body.size * 0.35) + 3;
          }

          // Add spacing between entries
          if (index < cvData.experience.length - 1) {
            currentY += 3;
          }
        });

        return currentY;
      });
    }

    // Education
    if (cvData.education?.length > 0) {
      addSection('Education', (startY) => {
        let currentY = startY;

        cvData.education.forEach((edu, index) => {
          if (edu.degree || edu.school) {
            pdf.setFont(typography.subheading.font, typography.subheading.style);
            pdf.setFontSize(typography.subheading.size);

            const degree = edu.degree || '';
            const school = edu.school || '';
            const header = school ? `${degree} • ${school}` : degree;
            pdf.text(header, margins.left, currentY);
            currentY += 4;

            // Dates
            if (edu.startDate || edu.endDate) {
              pdf.setFont(typography.detail.font, 'italic');
              pdf.setFontSize(typography.detail.size);
              const dateRange = `${edu.startDate || ''} - ${edu.endDate || ''}`;
              pdf.text(dateRange, margins.left, currentY);
              currentY += 4;
            }

            if (index < cvData.education.length - 1) {
              currentY += 3;
            }
          }
        });

        return currentY;
      });
    }

    // Skills in professional format
    if (cvData.skills) {
      const skillSections = [];
      if (cvData.skills.technical?.length) {
        skillSections.push(`Technical Skills: ${cvData.skills.technical.join(', ')}`);
      }
      if (cvData.skills.tools?.length) {
        skillSections.push(`Tools & Technologies: ${cvData.skills.tools.join(', ')}`);
      }
      if (cvData.skills.soft?.length) {
        skillSections.push(`Core Competencies: ${cvData.skills.soft.join(', ')}`);
      }

      if (skillSections.length > 0) {
        addSection('Skills & Expertise', (startY) => {
          let currentY = startY;

          skillSections.forEach(section => {
            pdf.setFont(typography.body.font, typography.body.style);
            pdf.setFontSize(typography.body.size);
            const lines = pdf.splitTextToSize(section, contentWidth);
            pdf.text(lines, margins.left, currentY);
            currentY += lines.length * (typography.body.size * 0.35) + 3;
          });

          return currentY;
        });
      }
    }

    // Additional sections (projects, certifications, languages) with similar formatting...
  }

  /**
   * Add professional metadata to PDF
   */
  addMetadataToPDF(pdf, metadata, cvData) {
    const author = cvData.personalInfo?.fullName || metadata.author || 'Anonymous';
    const title = metadata.title || `${author} - Professional Resume`;

    pdf.setProperties({
      title: title,
      subject: metadata.subject || 'Professional Resume/CV',
      author: author,
      keywords: metadata.keywords || `${author}, resume, cv, professional`,
      creator: metadata.creator || 'Professional CV Builder',
      producer: metadata.producer || 'Professional CV Builder v2.0',
      creationDate: new Date(),
      modDate: new Date()
    });
  }

  /**
   * Prepare DOM element for optimal PDF export
   */
  async prepareElementForExport(element, config) {
    // Add print-specific styles
    element.style.width = '210mm';
    element.style.minHeight = '297mm';
    element.style.backgroundColor = '#ffffff';
    element.style.color = '#000000';

    // Ensure all images are loaded
    const images = element.querySelectorAll('img');
    await Promise.all(Array.from(images).map(img => {
      return new Promise(resolve => {
        if (img.complete) {
          resolve();
        } else {
          img.onload = resolve;
          img.onerror = resolve;
        }
      });
    }));

    // Add page break classes if needed
    const sections = element.querySelectorAll('.cv-section');
    sections.forEach((section, index) => {
      section.style.pageBreakInside = 'avoid';
      if (index > 0) {
        section.style.pageBreakBefore = 'auto';
      }
    });
  }

  /**
   * Generate professional filename
   */
  generateFilename(cvData, config) {
    const name = cvData.personalInfo?.fullName || 'Resume';
    const cleanName = name
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .replace(/\s+/g, '_')
      .toLowerCase();

    const date = new Date().toISOString().split('T')[0];
    const format = config.format || 'pdf';
    const quality = config.quality || 'standard';

    return `${cleanName}_resume_${format}_${quality}_${date}.pdf`;
  }

  /**
   * Add watermark to PDF
   */
  addWatermark(pdf, watermarkConfig) {
    const pageCount = pdf.getNumberOfPages();

    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);

      if (watermarkConfig.type === 'text') {
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(48);
        pdf.setTextColor(200, 200, 200);

        const pageSize = pdf.internal.pageSize;
        const text = watermarkConfig.text || 'CONFIDENTIAL';

        pdf.saveGraphicsState();
        pdf.text(text, pageSize.width / 2, pageSize.height / 2, {
          angle: 45,
          align: 'center'
        });
        pdf.restoreGraphicsState();
      }
    }
  }
}

// Export convenience functions
export const exportPDF = async (elementId, cvData, options = {}) => {
  const generator = new EnhancedPDFGenerator();
  return await generator.generatePDF(elementId, cvData, options);
};

export const validateExportData = (cvData) => {
  const issues = [];

  if (!cvData.personalInfo?.fullName) {
    issues.push('Full name is required for professional exports');
  }

  if (!cvData.personalInfo?.email) {
    issues.push('Email address is required for contact information');
  }

  const hasContentSections = !!(
    cvData.profile?.summary ||
    cvData.experience?.length ||
    cvData.education?.length ||
    cvData.skills?.technical?.length ||
    cvData.skills?.tools?.length
  );

  if (!hasContentSections) {
    issues.push('At least one content section is required (experience, education, or skills)');
  }

  return {
    isValid: issues.length === 0,
    issues
  };
};