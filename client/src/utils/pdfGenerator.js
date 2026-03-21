import html2pdf from 'html2pdf.js';

/**
 * Generate and download PDF from the CV preview
 * @param {string} filename - Optional custom filename
 * @param {string} elementId - ID of the element to export (default: 'cv-preview-print')
 */
export const generatePDF = async (filename = 'resume.pdf', elementId = 'cv-preview-print') => {
  try {
    const element = document.getElementById(elementId);

    if (!element) {
      throw new Error('CV preview element not found. Please make sure the CV is loaded.');
    }

    // Configuration for optimal PDF output
    const options = {
      margin: 0,
      filename: filename,
      image: {
        type: 'jpeg',
        quality: 0.98
      },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        removeContainer: true,
        logging: false
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait',
        compress: true
      },
      pagebreak: {
        mode: ['avoid-all', 'css', 'legacy'],
        before: '.page-break-before',
        after: '.page-break-after',
        avoid: '.page-break-avoid'
      }
    };

    // Generate and download the PDF
    await html2pdf().set(options).from(element).save();

    return { success: true, message: 'PDF downloaded successfully!' };
  } catch (error) {
    console.error('PDF Generation Error:', error);
    return {
      success: false,
      message: `Failed to generate PDF: ${error.message}`
    };
  }
};

/**
 * Generate PDF blob for preview or further processing
 * @param {string} elementId - ID of the element to export
 */
export const generatePDFBlob = async (elementId = 'cv-preview-print') => {
  try {
    const element = document.getElementById(elementId);

    if (!element) {
      throw new Error('CV preview element not found.');
    }

    const options = {
      margin: 0,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        backgroundColor: '#ffffff',
        logging: false
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait'
      }
    };

    // Generate blob instead of downloading
    const pdfBlob = await html2pdf().set(options).from(element).outputPdf('blob');

    return { success: true, blob: pdfBlob };
  } catch (error) {
    console.error('PDF Blob Generation Error:', error);
    return {
      success: false,
      message: `Failed to generate PDF preview: ${error.message}`
    };
  }
};

/**
 * Check if the CV has sufficient content for export
 * @param {Object} cvData - CV data object
 */
export const validateCVForExport = (cvData) => {
  const { personalInfo, profile, experience, education, skills } = cvData;

  const issues = [];

  // Check for essential personal info
  if (!personalInfo?.fullName || personalInfo.fullName.trim() === '') {
    issues.push('Full name is required');
  }

  if (!personalInfo?.email || personalInfo.email.trim() === '') {
    issues.push('Email address is required');
  }

  // Check for at least one main section
  const hasContent = (
    (profile?.summary && profile.summary.trim()) ||
    (experience && experience.length > 0) ||
    (education && education.length > 0) ||
    (skills && (skills.technical?.length > 0 || skills.tools?.length > 0))
  );

  if (!hasContent) {
    issues.push('Please add some content (profile summary, experience, education, or skills)');
  }

  return {
    isValid: issues.length === 0,
    issues: issues
  };
};

/**
 * Suggest filename based on CV data
 * @param {Object} cvData - CV data object
 */
export const suggestFilename = (cvData) => {
  const { personalInfo } = cvData;

  if (personalInfo?.fullName) {
    // Clean up name for filename (remove special characters)
    const cleanName = personalInfo.fullName
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .replace(/\s+/g, '_')
      .toLowerCase();

    const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    return `${cleanName}_resume_${timestamp}.pdf`;
  }

  return `resume_${new Date().toISOString().split('T')[0]}.pdf`;
};
