import html2pdf from 'html2pdf.js';

export const generatePDF = async (filename = 'resume.pdf') => {
  const element = document.getElementById('cv-preview-print');

  if (!element) {
    console.error('CV preview element not found');
    return;
  }

  const options = {
    margin: 0,
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      letterRendering: true,
      logging: false,
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait',
      compress: true,
    },
    pagebreak: {
      mode: ['avoid-all', 'css', 'legacy'],
      before: '.page-break-before',
      after: '.page-break-after',
      avoid: '.page-break-avoid',
    },
  };

  try {
    await html2pdf().set(options).from(element).save();
    return true;
  } catch (error) {
    console.error('PDF generation failed:', error);
    return false;
  }
};
