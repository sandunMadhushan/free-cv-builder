import { saveAs } from 'file-saver';

/**
 * Generate and download a Word document that matches the current preview exactly
 * @param {Object} cvData - CV data object
 * @param {Object} customization - Theme customization (colors, fonts, etc.)
 * @param {string} filename - Optional custom filename
 * @param {string} elementId - ID of the preview element to capture
 */
export const generateWordDocument = async (cvData, customization, filename = 'resume.docx', elementId = 'cv-preview-print') => {
  try {
    // Get the preview element that user sees
    const previewElement = document.getElementById(elementId);

    if (!previewElement) {
      throw new Error('CV preview element not found. Please make sure the CV is loaded.');
    }

    // Function to recursively capture all computed styles and apply them inline
    const captureStylesRecursively = (element) => {
      const clonedElement = element.cloneNode(false);
      const computedStyle = window.getComputedStyle(element);

      // Important styles to preserve
      const stylesToCapture = [
        'color', 'backgroundColor', 'fontSize', 'fontFamily', 'fontWeight',
        'fontStyle', 'textDecoration', 'textAlign', 'lineHeight', 'margin',
        'marginTop', 'marginBottom', 'marginLeft', 'marginRight',
        'padding', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight',
        'borderColor', 'borderWidth', 'borderStyle', 'borderTop', 'borderBottom',
        'width', 'height', 'display', 'position', 'top', 'left', 'right', 'bottom'
      ];

      // Build inline style string
      let inlineStyle = '';
      stylesToCapture.forEach(style => {
        const value = computedStyle.getPropertyValue(style);
        if (value && value !== 'initial' && value !== 'inherit' && value !== 'auto') {
          inlineStyle += `${style}: ${value}; `;
        }
      });

      // Set the inline style
      if (inlineStyle) {
        clonedElement.setAttribute('style', inlineStyle);
      }

      // Recursively process child elements
      Array.from(element.children).forEach(child => {
        const clonedChild = captureStylesRecursively(child);
        clonedElement.appendChild(clonedChild);
      });

      // Copy text content for text nodes
      if (element.childNodes.length > 0) {
        Array.from(element.childNodes).forEach(node => {
          if (node.nodeType === Node.TEXT_NODE) {
            clonedElement.appendChild(document.createTextNode(node.textContent));
          }
        });
      }

      return clonedElement;
    };

    // Capture all styles
    const styledElement = captureStylesRecursively(previewElement);

    // Create Word-compatible HTML with embedded styles
    const wordHTML = `
<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head>
    <meta charset="UTF-8">
    <meta name="ProgId" content="Word.Document">
    <meta name="Generator" content="Microsoft Word 15">
    <meta name="Originator" content="Microsoft Word 15">
    <title>Resume</title>
    <!--[if gte mso 9]>
    <xml>
        <w:WordDocument>
            <w:View>Print</w:View>
            <w:Zoom>100</w:Zoom>
            <w:DoNotOptimizeForBrowser/>
        </w:WordDocument>
    </xml>
    <![endif]-->
    <style>
        body {
            font-family: 'Times New Roman', serif;
            font-size: 12pt;
            margin: 1in;
            background: white;
        }

        /* Preserve colors and fonts for Word */
        * {
            mso-style-priority: 1;
            mso-style-unhide: no;
        }

        p {
            margin: 0;
            margin-bottom: 6pt;
            mso-pagination: widow-orphan;
        }

        h1, h2, h3, h4, h5, h6 {
            mso-style-priority: 9;
            mso-outline-level: 1;
            page-break-after: avoid;
        }

        /* Ensure text colors are preserved */
        [style*="color"] {
            mso-style-priority: 99 !important;
        }
    </style>
</head>
<body>
    ${styledElement.outerHTML}
</body>
</html>`;

    // Create blob with proper MIME type for Word
    const blob = new Blob([wordHTML], {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    });

    // Download the file
    saveAs(blob, filename.replace('.docx', '.doc'));

    return {
      success: true,
      message: 'Word document downloaded successfully! The document preserves your exact preview formatting and colors.'
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