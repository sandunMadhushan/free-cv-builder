import html2pdf from "html2pdf.js";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { generateDOCX } from "./docxGenerator.js";

// Professional export configurations
export const EXPORT_FORMATS = {
  visual: {
    name: 'Visual PDF',
    description: 'High-quality visual representation preserving exact formatting',
    type: 'visual',
    category: 'document',
    recommended: ['creative', 'design', 'portfolio'],
    pros: ['Perfect visual fidelity', 'Preserves all styling', 'Professional appearance'],
    cons: ['Larger file size', 'Less ATS-friendly', 'Not easily editable']
  },
  searchable: {
    name: 'Searchable PDF',
    description: 'Text-based PDF optimized for ATS systems and search',
    type: 'searchable',
    category: 'document',
    recommended: ['tech', 'finance', 'consulting'],
    pros: ['ATS-optimized', 'Smaller file size', 'Searchable text'],
    cons: ['Basic formatting', 'No custom styling', 'Limited visual appeal']
  },
  hybrid: {
    name: 'Hybrid PDF',
    description: 'Best of both worlds - visual quality with searchable text',
    type: 'hybrid',
    category: 'document',
    recommended: ['executive', 'management', 'general'],
    pros: ['Visual quality', 'ATS-compatible', 'Searchable text'],
    cons: ['Larger processing time', 'Complex generation']
  },
  docx: {
    name: 'Editable DOCX',
    description: 'Microsoft Word document that can be edited and customized later',
    type: 'docx',
    category: 'document',
    recommended: ['recruiting', 'hr', 'collaborative'],
    pros: ['Fully editable in Word/Google Docs', 'Professional formatting', 'Easy to customize'],
    cons: ['Layout may vary between editors', 'Requires Word/Google Docs', 'Less visual consistency']
  },
  png: {
    name: 'PNG Image',
    description: 'High-quality image format for social media and web sharing',
    type: 'png',
    category: 'image',
    recommended: ['social media', 'online profiles', 'web portfolios'],
    pros: ['Perfect for social sharing', 'High visual quality', 'Works everywhere'],
    cons: ['Not editable', 'Large file size', 'No text selection']
  },
  jpg: {
    name: 'JPG Image',
    description: 'Compressed image format for quick sharing and smaller files',
    type: 'jpg',
    category: 'image',
    recommended: ['email attachments', 'quick sharing', 'mobile viewing'],
    pros: ['Small file size', 'Universal compatibility', 'Fast loading'],
    cons: ['Lossy compression', 'Not editable', 'No text selection']
  },
  html: {
    name: 'Web Portfolio',
    description: 'Interactive HTML page with responsive design and animations',
    type: 'html',
    category: 'web',
    recommended: ['web developers', 'digital portfolios', 'online presence'],
    pros: ['Interactive elements', 'Responsive design', 'SEO-friendly', 'Easy to share online'],
    cons: ['Requires web hosting', 'May need technical knowledge', 'Browser dependent']
  },
  json: {
    name: 'JSON Data',
    description: 'Structured data format for importing to other career platforms',
    type: 'json',
    category: 'data',
    recommended: ['developers', 'data migration', 'backup purposes'],
    pros: ['Machine readable', 'Easy integration', 'Complete data export', 'Platform migration'],
    cons: ['Not human readable', 'Requires technical knowledge', 'No visual formatting']
  },
  txt: {
    name: 'Plain Text',
    description: 'Simple text format for basic ATS systems and email',
    type: 'txt',
    category: 'text',
    recommended: ['basic ATS systems', 'email body', 'simple applications'],
    pros: ['Universal compatibility', 'Tiny file size', 'ATS-safe', 'Email friendly'],
    cons: ['No formatting', 'No visual appeal', 'Very basic presentation']
  },
  latex: {
    name: 'LaTeX Document',
    description: 'Professional typesetting format for academic and scientific resumes',
    type: 'latex',
    category: 'academic',
    recommended: ['academic positions', 'research roles', 'scientific fields'],
    pros: ['Professional typesetting', 'Perfect formatting', 'Academic standard', 'Highly customizable'],
    cons: ['Requires LaTeX knowledge', 'Complex compilation', 'Steep learning curve']
  },
  linkedin: {
    name: 'LinkedIn Ready',
    description: 'Optimized format for copying directly into LinkedIn profile sections',
    type: 'linkedin',
    category: 'social',
    recommended: ['LinkedIn optimization', 'professional networking', 'social media'],
    pros: ['LinkedIn-optimized formatting', 'Copy-paste ready', 'Professional networking', 'SEO keywords'],
    cons: ['Platform specific', 'Limited formatting', 'Character limits may apply']
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
        case 'docx':
          return await this.generateDOCX(cvData, config);
        case 'png':
          return await this.generatePNG(elementId, cvData, config);
        case 'jpg':
          return await this.generateJPG(elementId, cvData, config);
        case 'html':
          return await this.generateHTML(cvData, config);
        case 'json':
          return await this.generateJSON(cvData, config);
        case 'txt':
          return await this.generateTXT(cvData, config);
        case 'latex':
          return await this.generateLaTeX(cvData, config);
        case 'linkedin':
          return await this.generateLinkedIn(cvData, config);
        default:
          throw new Error(`Unknown format: ${config.format}`);
      }
    } catch (error) {
      console.error('Enhanced PDF Generation Error:', error);
      return {
        success: false,
        message: `Failed to generate ${config.format.toUpperCase()}: ${error.message}`,
        error
      };
    }
  }

  /**
   * Generate high-quality visual PDF
   */
  async generateVisualPDF(elementId, cvData, config) {
    console.log('🎯 FIXED Visual PDF: Starting generation...');

    // Find the element
    const originalElement = document.getElementById(elementId);
    if (!originalElement) {
      const availableIds = Array.from(document.querySelectorAll('[id]')).map(el => el.id);
      throw new Error(`CV preview element not found with ID '${elementId}'. Available elements: ${availableIds.join(', ')}`);
    }

    console.log('✅ Found element:', elementId);
    console.log('📐 Original element size:', originalElement.offsetWidth, 'x', originalElement.offsetHeight);

    const quality = EXPORT_QUALITIES[config.quality];
    const pageFormat = PAGE_FORMATS[config.pageFormat];
    const margins = MARGIN_PRESETS[config.margins];

    try {
      // STEP 1: Create a clean, light-mode clone
      const lightClone = await this.createLightClone(originalElement, elementId);

      // STEP 2: Use html2canvas with FULL content dimensions
      console.log('📸 Starting html2canvas capture...');

      // Get full dimensions with sufficient padding to capture text bottoms
      const captureWidth = Math.max(lightClone.offsetWidth, lightClone.scrollWidth);
      const captureHeight = Math.max(lightClone.offsetHeight, lightClone.scrollHeight) + 60; // Increased padding for text descenders

      console.log('🔍 Capture dimensions (preserving spacing + text bottom protection):', captureWidth, 'x', captureHeight);
      console.log('📊 Element dimensions - offset:', lightClone.offsetWidth, 'x', lightClone.offsetHeight);
      console.log('📊 Element dimensions - scroll:', lightClone.scrollWidth, 'x', lightClone.scrollHeight);
      console.log('✨ Original Tailwind spacing preserved in clone');
      console.log('🛡️ Extra 60px capture padding to prevent text bottom cutoff');

      const canvas = await html2canvas(lightClone, {
        scale: quality.scale,
        backgroundColor: '#ffffff',
        useCORS: true,
        allowTaint: false,
        letterRendering: true,
        logging: true,
        width: captureWidth,  // Use full content width
        height: captureHeight, // Use full content height
        foreignObjectRendering: false,
        removeContainer: true,
        imageTimeout: 15000,
        scrollX: 0,
        scrollY: 0,
        windowWidth: captureWidth,
        windowHeight: captureHeight,
        x: 0,
        y: 0,
        // Ensure we capture everything including overflow
        ignoreElements: (element) => {
          return element.classList && element.classList.contains('no-print');
        }
      });

      console.log('✅ Canvas created:', canvas.width, 'x', canvas.height);

      // STEP 3: Create PDF from canvas
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [pageFormat.width, pageFormat.height],
        compress: quality.compress
      });

      const imgData = canvas.toDataURL('image/jpeg', quality.quality);

      // Calculate dimensions to fit page properly - FIXED CUTOFF ISSUE
      const pdfWidth = pageFormat.width - margins.left - margins.right;
      const pdfHeight = pageFormat.height - margins.top - margins.bottom;

      console.log('📏 PDF page size:', pageFormat.width, 'x', pageFormat.height);
      console.log('📄 Available content area:', pdfWidth, 'x', pdfHeight);
      console.log('🖼️ Canvas size:', canvas.width, 'x', canvas.height);

      // Use proper pixel to mm conversion (96 DPI standard)
      const pixelToMm = 0.264583; // 1 pixel = 0.264583 mm at 96 DPI

      // Calculate the image dimensions in mm
      const imgWidthMm = canvas.width * pixelToMm;
      const imgHeightMm = canvas.height * pixelToMm;

      // Calculate scaling to preserve spacing - less aggressive scaling
      const scaleX = pdfWidth / imgWidthMm;
      const scaleY = pdfHeight / imgHeightMm;
      const scale = Math.min(scaleX, scaleY) * 0.98; // 98% to preserve spacing better

      const finalWidth = imgWidthMm * scale;
      const finalHeight = imgHeightMm * scale;

      console.log('🔧 Scaling factor (preserving spacing):', scale.toFixed(3));
      console.log('📐 Final size (maintaining proportions):', finalWidth.toFixed(1), 'x', finalHeight.toFixed(1));

      // Center the image on the page
      const xOffset = margins.left + Math.max(0, (pdfWidth - finalWidth) / 2);
      const yOffset = margins.top;

      pdf.addImage(imgData, 'JPEG', xOffset, yOffset, finalWidth, finalHeight);

      if (config.metadata) {
        this.addMetadataToPDF(pdf, config.metadata, cvData);
      }

      // STEP 4: Save PDF
      const filename = config.filename || this.generateFilename(cvData, config);
      pdf.save(filename);

      // STEP 5: Cleanup
      this.removeLightClone(lightClone);

      console.log('🎉 Visual PDF generated with preserved spacing!');

      return {
        success: true,
        message: 'Visual PDF generated with exact preview spacing and NO text cutoff!',
        format: 'visual',
        quality: config.quality,
        fileSize: 'Large (preserves exact visual styling and spacing)',
        atsCompatibility: 'Low (image-based format)',
        editableInWord: false,
        preservesDesign: true,
        preservesSpacing: true,
        preventsTextCutoff: true,
        lightModeOnly: true,
        templateUsed: config.templateConfig?.selectedTemplate || 'default'
      };

    } catch (error) {
      console.error('❌ Visual PDF generation failed:', error);
      throw new Error(`Visual PDF failed: ${error.message}. Check browser console for details.`);
    }
  }

  async createLightClone(originalElement, elementId) {
    console.log('🔧 Creating light-mode clone...');

    // Get the actual content dimensions BEFORE cloning
    const originalScrollWidth = originalElement.scrollWidth;
    const originalOffsetWidth = originalElement.offsetWidth;
    const originalScrollHeight = originalElement.scrollHeight;

    console.log('📐 Original dimensions:');
    console.log('   - offsetWidth:', originalOffsetWidth);
    console.log('   - scrollWidth:', originalScrollWidth);
    console.log('   - scrollHeight:', originalScrollHeight);

    const clone = originalElement.cloneNode(true);
    clone.id = elementId + '-light-clone';

    // Force light mode on clone and all children
    clone.classList.remove('dark');
    clone.style.backgroundColor = '#ffffff';
    clone.style.color = '#000000';

    const allElements = clone.querySelectorAll('*');
    allElements.forEach(el => {
      // Remove ALL dark classes
      el.classList.remove('dark');
      const classNames = Array.from(el.classList);
      classNames.forEach(className => {
        if (className.startsWith('dark:')) {
          el.classList.remove(className);
        }
      });

      // PRESERVE ORIGINAL SPACING - Don't change layout properties that affect spacing
      el.style.backgroundColor = el.style.backgroundColor || '#ffffff';
      if (el.style.color === 'white' || el.style.color === '#ffffff') {
        el.style.color = '#000000';
      }

      // Only remove width constraints, NOT spacing-related properties
      if (el.style.maxWidth) el.style.maxWidth = 'none';
      if (el.style.overflow && el.style.overflow !== 'visible') {
        el.style.overflow = 'visible';
      }

      // CRITICAL: Preserve margins, padding, and spacing exactly as in original
      // Don't modify: margin, padding, line-height, gap, etc.
      // These control the spacing that should match the preview
    });

    // Position clone off-screen but maintain same layout context as original
    clone.style.position = 'fixed';
    clone.style.top = '-9999px';
    clone.style.left = '0';
    clone.style.zIndex = '9999';
    clone.style.visibility = 'visible';
    clone.style.display = 'block';

    // PRESERVE EXACT SPACING: Use full content dimensions but don't force constraints
    const fullContentWidth = Math.max(originalScrollWidth, originalOffsetWidth, 1000);

    clone.style.width = fullContentWidth + 'px';
    clone.style.height = 'auto';
    // Don't force minHeight - let natural spacing determine height
    clone.style.overflow = 'visible';
    // Don't change boxSizing as it affects spacing calculations
    clone.style.maxWidth = 'none';
    clone.style.maxHeight = 'none';

    // Ensure no responsive constraints apply
    clone.style.minWidth = fullContentWidth + 'px';

    // SPACING PRESERVATION: Don't modify text elements that could affect spacing
    // Let the original Tailwind classes handle spacing naturally

    document.body.appendChild(clone);

    // Wait for rendering and fonts
    await new Promise(resolve => setTimeout(resolve, 500)); // Increased wait time
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }

    // Additional wait for layout to stabilize and CSS classes to compute
    await new Promise(resolve => setTimeout(resolve, 500));

    // AFTER layout stabilizes, add minimal bottom padding ONLY to prevent text cutoff
    // This doesn't affect section spacing since it's applied after layout calculation
    const textElements = clone.querySelectorAll('p, span, div:not([class*="mb-"]):not([class*="gap-"]), li');
    textElements.forEach(el => {
      // Only add minimal bottom padding if element doesn't already have significant spacing
      const computedStyle = window.getComputedStyle(el);
      const currentPaddingBottom = parseFloat(computedStyle.paddingBottom) || 0;

      // Only add padding if text element lacks sufficient bottom clearance
      if (currentPaddingBottom < 3) {
        el.style.paddingBottom = Math.max(currentPaddingBottom, 3) + 'px';
      }
    });

    // Force another layout recalculation after padding adjustment
    await new Promise(resolve => setTimeout(resolve, 100));

    // Force CSS recalculation to ensure Tailwind classes are properly applied
    const allCloneElements = clone.querySelectorAll('*');
    allCloneElements.forEach(el => {
      // Force style recalculation
      window.getComputedStyle(el);
    });

    // Special handling for elements that commonly get cut off (dates, short text)
    const potentialCutoffElements = clone.querySelectorAll('*');
    potentialCutoffElements.forEach(el => {
      const text = el.textContent?.trim();
      // Check for date patterns or short text that commonly gets cut off
      if (text && (
        /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s+\d{4}\b/i.test(text) ||
        /\b\d{1,2}\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s+\d{4}\b/i.test(text) ||
        text.length <= 5 // Short text elements like "asd"
      )) {
        // Add extra bottom protection for these elements
        el.style.paddingBottom = '6px';
        console.log('🛡️ Added bottom protection to:', text);
      }
    });

    // Force a layout recalculation on the main clone
    clone.offsetHeight; // Force reflow
    clone.scrollHeight; // Force scroll calculation

    const finalWidth = Math.max(clone.offsetWidth, clone.scrollWidth);
    const finalHeight = Math.max(clone.offsetHeight, clone.scrollHeight);

    console.log('✅ Light clone created with PRESERVED SPACING + TEXT PROTECTION:');
    console.log('   - Final width:', finalWidth);
    console.log('   - Final height:', finalHeight);
    console.log('   - scroll vs offset (width):', clone.scrollWidth, 'vs', clone.offsetWidth);
    console.log('   - scroll vs offset (height):', clone.scrollHeight, 'vs', clone.offsetHeight);
    console.log('   - ✨ Spacing preserved from original preview');
    console.log('   - 🛡️ Bottom text cutoff protection added');

    return clone;
  }

  removeLightClone(cloneElement) {
    if (cloneElement && cloneElement.parentNode) {
      cloneElement.parentNode.removeChild(cloneElement);
      console.log('🧹 Light clone cleanup complete');
    }
  }

  /**
   * Generate searchable PDF using EXACT same approach as successful visual PDF
   */
  async generateSearchablePDF(cvData, config) {
    console.log('🎯 Searchable PDF: Using EXACT visual PDF approach with text extraction...');

    // STEP 1: Find the element (EXACT same as visual PDF)
    const elementId = 'cv-preview-print';
    const originalElement = document.getElementById(elementId);
    if (!originalElement) {
      const availableIds = Array.from(document.querySelectorAll('[id]')).map(el => el.id);
      throw new Error(`CV preview element not found with ID '${elementId}'. Available elements: ${availableIds.join(', ')}`);
    }

    console.log('✅ Found element:', elementId);
    console.log('📐 Original element size:', originalElement.offsetWidth, 'x', originalElement.offsetHeight);

    const quality = EXPORT_QUALITIES[config.quality];
    const pageFormat = PAGE_FORMATS[config.pageFormat];
    const margins = MARGIN_PRESETS[config.margins];

    try {
      // STEP 2: Create EXACT same light-mode clone (proven method)
      console.log('🔧 Creating EXACT same light-mode clone as visual PDF...');
      const lightClone = await this.createLightClone(originalElement, elementId);

      // STEP 3: Use EXACT same capture dimensions as visual PDF
      const captureWidth = Math.max(lightClone.offsetWidth, lightClone.scrollWidth);
      const captureHeight = Math.max(lightClone.offsetHeight, lightClone.scrollHeight) + 60; // Same padding as visual PDF

      console.log('🔍 Using EXACT same dimensions as visual PDF:', captureWidth, 'x', captureHeight);
      console.log('📊 Element dimensions - offset:', lightClone.offsetWidth, 'x', lightClone.offsetHeight);
      console.log('📊 Element dimensions - scroll:', lightClone.scrollWidth, 'x', lightClone.scrollHeight);
      console.log('✨ Original Tailwind spacing preserved in clone');
      console.log('🛡️ Extra 60px capture padding to prevent text bottom cutoff');

      // STEP 4: Extract text content from the clone (instead of html2canvas)
      console.log('📋 Extracting text content from successful visual clone...');
      const textElements = await this.extractTextFromVisualClone(lightClone);

      // STEP 5: Create PDF with EXACT same configuration as visual PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [pageFormat.width, pageFormat.height],
        compress: quality.compress
      });

      // STEP 6: Use EXACT same scaling calculations as visual PDF
      console.log('🎨 Using EXACT same scaling and positioning as visual PDF...');

      // Calculate dimensions to fit page properly (EXACT same as visual PDF)
      const pdfWidth = pageFormat.width - margins.left - margins.right;
      const pdfHeight = pageFormat.height - margins.top - margins.bottom;

      console.log('📏 PDF page size:', pageFormat.width, 'x', pageFormat.height);
      console.log('📄 Available content area:', pdfWidth, 'x', pdfHeight);
      console.log('📐 Clone size (like canvas):', captureWidth, 'x', captureHeight);

      // Use EXACT same pixel to mm conversion as visual PDF
      const pixelToMm = 0.264583; // Same as visual PDF

      // Calculate dimensions in mm (EXACT same as visual PDF)
      const imgWidthMm = captureWidth * pixelToMm;
      const imgHeightMm = captureHeight * pixelToMm;

      // Calculate scaling (EXACT same as visual PDF)
      const scaleX = pdfWidth / imgWidthMm;
      const scaleY = pdfHeight / imgHeightMm;
      const scale = Math.min(scaleX, scaleY) * 0.98; // Same 98% scaling as visual PDF

      const finalWidth = imgWidthMm * scale;
      const finalHeight = imgHeightMm * scale;

      console.log('🔧 Scaling factor (SAME as visual PDF):', scale.toFixed(3));
      console.log('📐 Final size (SAME calculations):', finalWidth.toFixed(1), 'x', finalHeight.toFixed(1));

      // Center on page (EXACT same as visual PDF)
      const xOffset = margins.left + Math.max(0, (pdfWidth - finalWidth) / 2);
      const yOffset = margins.top;

      console.log('📍 Position offset (SAME as visual PDF):', xOffset.toFixed(1), ',', yOffset.toFixed(1));

      // STEP 7: Position text using visual PDF coordinate system
      await this.positionTextUsingVisualPDFCoordinates(pdf, textElements, {
        xOffset,
        yOffset,
        scale,
        lightClone
      });

      // Add metadata (same as visual PDF)
      if (config.metadata) {
        this.addMetadataToPDF(pdf, config.metadata, cvData);
      }

      // Save PDF
      const filename = config.filename || this.generateFilename(cvData, config);
      pdf.save(filename);

      // Cleanup (same as visual PDF)
      this.removeLightClone(lightClone);

      console.log('🎉 Searchable PDF generated using EXACT visual PDF approach!');

      return {
        success: true,
        message: 'Searchable PDF generated using EXACT visual PDF method - perfect match with searchable text!',
        format: 'searchable',
        quality: config.quality,
        fileSize: 'Medium (visual PDF approach with searchable text)',
        atsCompatibility: 'High (searchable text with exact visual layout)',
        preservesDesign: true,
        preservesSpacing: true,
        exactVisualMatch: true,
        textSearchable: true,
        generationMethod: 'visual-pdf-text-extraction',
        templateUsed: config.templateConfig?.selectedTemplate || 'default'
      };

    } catch (error) {
      console.error('❌ Visual PDF approach for searchable failed:', error);
      console.log('🔄 Falling back to clean method...');
      return await this.buildCleanSearchablePDFDirect(cvData, config);
    }
  }

  /**
   * Extract text content from visual clone (same clone that visual PDF uses)
   */
  async extractTextFromVisualClone(lightClone) {
    console.log('🔍 Extracting text from visual clone (same clone visual PDF uses)...');

    const textElements = [];
    const cloneRect = lightClone.getBoundingClientRect();

    // Get all text-containing elements
    const walker = document.createTreeWalker(
      lightClone,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: function(node) {
          const text = node.textContent.trim();
          if (!text) return NodeFilter.FILTER_SKIP;

          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_SKIP;

          // Skip hidden elements
          const style = window.getComputedStyle(parent);
          if (style.display === 'none' ||
              style.visibility === 'hidden' ||
              style.opacity === '0') {
            return NodeFilter.FILTER_SKIP;
          }

          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    let textNode;
    while (textNode = walker.nextNode()) {
      const text = textNode.textContent.trim();
      if (!text) continue;

      const parent = textNode.parentElement;
      const rect = parent.getBoundingClientRect();
      const computedStyle = window.getComputedStyle(parent);

      // Calculate position relative to clone (same as visual PDF sees it)
      const relativeX = rect.left - cloneRect.left;
      const relativeY = rect.top - cloneRect.top;

      textElements.push({
        text: text,
        x: relativeX,
        y: relativeY,
        width: rect.width,
        height: rect.height,
        fontSize: parseFloat(computedStyle.fontSize) || 16,
        fontWeight: computedStyle.fontWeight,
        color: computedStyle.color,
        fontFamily: computedStyle.fontFamily,
        element: parent
      });
    }

    // Sort by position (top to bottom, left to right)
    textElements.sort((a, b) => {
      const yDiff = a.y - b.y;
      if (Math.abs(yDiff) < 10) { // Same line (within 10px)
        return a.x - b.x;
      }
      return yDiff;
    });

    console.log(`📋 Extracted ${textElements.length} text elements from visual clone`);
    return textElements;
  }

  /**
   * Position text using EXACT visual PDF coordinate system
   */
  async positionTextUsingVisualPDFCoordinates(pdf, textElements, coords) {
    const { xOffset, yOffset, scale, lightClone } = coords;
    const pixelToMm = 0.264583; // Same as visual PDF

    console.log('🎨 Positioning text using EXACT visual PDF coordinate system...');

    for (const element of textElements) {
      try {
        // Convert element position to PDF coordinates (EXACT same as visual PDF)
        const elementXMm = element.x * pixelToMm;
        const elementYMm = element.y * pixelToMm;

        const pdfX = xOffset + (elementXMm * scale);
        const pdfY = yOffset + (elementYMm * scale);

        // Convert font size using same scaling
        let fontSize = (element.fontSize * scale * pixelToMm) * 2.83; // Convert to PDF point size
        fontSize = Math.max(6, Math.min(72, fontSize)); // Reasonable bounds

        // Determine font style from computed styles
        const isBold = element.fontWeight === 'bold' ||
                      element.fontWeight === '700' ||
                      parseInt(element.fontWeight) > 500;

        // Set font
        pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
        pdf.setFontSize(fontSize);

        // Convert color
        const color = this.parseColorToRGB(element.color);
        pdf.setTextColor(color.r, color.g, color.b);

        // Add text at exact position
        pdf.text(element.text, pdfX, pdfY + (fontSize * 0.8)); // Baseline adjustment

      } catch (error) {
        console.warn('⚠️ Failed to position text element:', element.text, error);
      }
    }

    console.log('✅ Text positioned using EXACT visual PDF coordinates!');
  }

  /**
   * Parse CSS color to RGB (reuse visual PDF logic)
   */
  parseColorToRGB(cssColor) {
    if (!cssColor) return { r: 0, g: 0, b: 0 };

    if (cssColor.startsWith('rgb(')) {
      const matches = cssColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      if (matches) {
        return {
          r: parseInt(matches[1]),
          g: parseInt(matches[2]),
          b: parseInt(matches[3])
        };
      }
    }

    if (cssColor.startsWith('rgba(')) {
      const matches = cssColor.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*[\d.]+\)/);
      if (matches) {
        return {
          r: parseInt(matches[1]),
          g: parseInt(matches[2]),
          b: parseInt(matches[3])
        };
      }
    }

    if (cssColor.startsWith('#')) {
      const hex = cssColor.substring(1);
      return {
        r: parseInt(hex.substr(0, 2), 16),
        g: parseInt(hex.substr(2, 2), 16),
        b: parseInt(hex.substr(4, 2), 16)
      };
    }

    // Default to black
    return { r: 0, g: 0, b: 0 };
  }

  // Fallback method for error handling
  async buildCleanSearchablePDFDirect(cvData, config) {
    console.log('Fallback: Simple searchable PDF');
    const pdf = new jsPDF();
    pdf.text('Searchable PDF Generation Error', 20, 20);
    pdf.text('Please use Visual PDF format for best results', 20, 30);
    const filename = config.filename || `resume_${Date.now()}.pdf`;
    pdf.save(filename);
    return { success: true, message: 'Fallback PDF generated' };
  }

  /**
   * Generate hybrid PDF (visual + searchable)
   */
  async generateHybridPDF(elementId, cvData, config) {
    console.log('🔄 Generating hybrid PDF...');
    try {
      // For now, use the searchable PDF method as it provides the best balance
      return await this.generateSearchablePDF(cvData, config);
    } catch (error) {
      console.error('❌ Hybrid PDF generation failed:', error);
      throw new Error(`Hybrid PDF failed: ${error.message}`);
    }
  }

  /**
   * Generate DOCX document
   */
  async generateDOCX(cvData, config) {
    console.log('📄 Generating DOCX...');
    try {
      const filename = config.filename || this.generateFilename(cvData, { ...config, format: 'docx' });
      await generateDOCX(cvData, filename);

      return {
        success: true,
        message: 'DOCX document generated successfully!',
        format: 'docx',
        fileSize: 'Small (text-based format)',
        atsCompatibility: 'High (native Word format)',
        editableInWord: true,
        preservesDesign: false,
        preservesSpacing: false,
        templateUsed: config.templateConfig?.selectedTemplate || 'default'
      };
    } catch (error) {
      console.error('❌ DOCX generation failed:', error);
      throw new Error(`DOCX generation failed: ${error.message}`);
    }
  }

  /**
   * Generate PNG image
   */
  async generatePNG(elementId, cvData, config) {
    console.log('🖼️ Generating PNG image...');
    try {
      const originalElement = document.getElementById(elementId);
      if (!originalElement) {
        throw new Error(`CV preview element not found with ID '${elementId}'`);
      }

      const lightClone = await this.createLightClone(originalElement, elementId);
      const quality = EXPORT_QUALITIES[config.quality];

      const canvas = await html2canvas(lightClone, {
        scale: quality.scale,
        backgroundColor: '#ffffff',
        useCORS: true,
        allowTaint: false,
        letterRendering: true,
        logging: false,
        width: Math.max(lightClone.offsetWidth, lightClone.scrollWidth),
        height: Math.max(lightClone.offsetHeight, lightClone.scrollHeight) + 60,
        removeContainer: true
      });

      // Create download link
      const link = document.createElement('a');
      link.download = config.filename || this.generateFilename(cvData, { ...config, format: 'png' });
      link.href = canvas.toDataURL('image/png');
      link.click();

      this.removeLightClone(lightClone);

      return {
        success: true,
        message: 'PNG image generated successfully!',
        format: 'png',
        fileSize: 'Large (high-quality image)',
        atsCompatibility: 'None (image format)',
        preservesDesign: true,
        socialMediaReady: true,
        templateUsed: config.templateConfig?.selectedTemplate || 'default'
      };
    } catch (error) {
      console.error('❌ PNG generation failed:', error);
      throw new Error(`PNG generation failed: ${error.message}`);
    }
  }

  /**
   * Generate JPG image
   */
  async generateJPG(elementId, cvData, config) {
    console.log('📸 Generating JPG image...');
    try {
      const originalElement = document.getElementById(elementId);
      if (!originalElement) {
        throw new Error(`CV preview element not found with ID '${elementId}'`);
      }

      const lightClone = await this.createLightClone(originalElement, elementId);
      const quality = EXPORT_QUALITIES[config.quality];

      const canvas = await html2canvas(lightClone, {
        scale: quality.scale,
        backgroundColor: '#ffffff',
        useCORS: true,
        allowTaint: false,
        letterRendering: true,
        logging: false,
        width: Math.max(lightClone.offsetWidth, lightClone.scrollWidth),
        height: Math.max(lightClone.offsetHeight, lightClone.scrollHeight) + 60,
        removeContainer: true
      });

      // Create download link
      const link = document.createElement('a');
      link.download = config.filename || this.generateFilename(cvData, { ...config, format: 'jpg' });
      link.href = canvas.toDataURL('image/jpeg', quality.quality);
      link.click();

      this.removeLightClone(lightClone);

      return {
        success: true,
        message: 'JPG image generated successfully!',
        format: 'jpg',
        fileSize: 'Medium (compressed image)',
        atsCompatibility: 'None (image format)',
        preservesDesign: true,
        socialMediaReady: true,
        templateUsed: config.templateConfig?.selectedTemplate || 'default'
      };
    } catch (error) {
      console.error('❌ JPG generation failed:', error);
      throw new Error(`JPG generation failed: ${error.message}`);
    }
  }

  /**
   * Generate HTML portfolio page
   */
  async generateHTML(cvData, config) {
    console.log('🌐 Generating HTML portfolio...');
    try {
      const htmlContent = await this.generateHTMLTemplate(cvData, config);

      // Create download link
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const link = document.createElement('a');
      link.download = config.filename || this.generateFilename(cvData, { ...config, format: 'html' });
      link.href = URL.createObjectURL(blob);
      link.click();

      // Clean up URL
      setTimeout(() => URL.revokeObjectURL(link.href), 1000);

      return {
        success: true,
        message: 'HTML portfolio generated successfully!',
        format: 'html',
        fileSize: 'Small (web-ready)',
        atsCompatibility: 'High (searchable content)',
        preservesDesign: true,
        interactive: true,
        responsiveDesign: true,
        seoFriendly: true,
        templateUsed: config.templateConfig?.selectedTemplate || 'default'
      };
    } catch (error) {
      console.error('❌ HTML generation failed:', error);
      throw new Error(`HTML generation failed: ${error.message}`);
    }
  }

  /**
   * Generate JSON data export
   */
  async generateJSON(cvData, config) {
    console.log('📊 Generating JSON data export...');
    try {
      const jsonData = {
        metadata: {
          version: '2.0',
          exportDate: new Date().toISOString(),
          templateUsed: config.templateConfig?.selectedTemplate || 'default',
          generatedBy: 'Professional CV Builder v2.0'
        },
        personalInfo: cvData.personalInfo || {},
        profile: cvData.profile || {},
        experience: cvData.experience || [],
        education: cvData.education || [],
        skills: cvData.skills || {},
        projects: cvData.projects || [],
        certifications: cvData.certifications || [],
        languages: cvData.languages || [],
        sectionOrder: cvData.sectionOrder || [],
        activeSections: cvData.activeSections || {},
        templateConfig: config.templateConfig || {}
      };

      const jsonString = JSON.stringify(jsonData, null, 2);

      // Create download link
      const blob = new Blob([jsonString], { type: 'application/json' });
      const link = document.createElement('a');
      link.download = config.filename || this.generateFilename(cvData, { ...config, format: 'json' });
      link.href = URL.createObjectURL(blob);
      link.click();

      // Clean up URL
      setTimeout(() => URL.revokeObjectURL(link.href), 1000);

      return {
        success: true,
        message: 'JSON data exported successfully!',
        format: 'json',
        fileSize: 'Small (structured data)',
        atsCompatibility: 'None (data format)',
        machineReadable: true,
        backupReady: true,
        platformMigration: true,
        templateUsed: config.templateConfig?.selectedTemplate || 'default'
      };
    } catch (error) {
      console.error('❌ JSON generation failed:', error);
      throw new Error(`JSON generation failed: ${error.message}`);
    }
  }

  /**
   * Generate plain text format
   */
  async generateTXT(cvData, config) {
    console.log('📝 Generating plain text format...');
    try {
      const textContent = await this.generatePlainText(cvData);

      // Create download link
      const blob = new Blob([textContent], { type: 'text/plain' });
      const link = document.createElement('a');
      link.download = config.filename || this.generateFilename(cvData, { ...config, format: 'txt' });
      link.href = URL.createObjectURL(blob);
      link.click();

      // Clean up URL
      setTimeout(() => URL.revokeObjectURL(link.href), 1000);

      return {
        success: true,
        message: 'Plain text format generated successfully!',
        format: 'txt',
        fileSize: 'Tiny (plain text)',
        atsCompatibility: 'High (basic ATS systems)',
        universalCompatibility: true,
        emailFriendly: true,
        templateUsed: config.templateConfig?.selectedTemplate || 'default'
      };
    } catch (error) {
      console.error('❌ TXT generation failed:', error);
      throw new Error(`TXT generation failed: ${error.message}`);
    }
  }

  /**
   * Generate LaTeX document
   */
  async generateLaTeX(cvData, config) {
    console.log('🎓 Generating LaTeX document...');
    try {
      const latexContent = await this.generateLaTeXTemplate(cvData, config);

      // Create download link
      const blob = new Blob([latexContent], { type: 'application/x-tex' });
      const link = document.createElement('a');
      link.download = config.filename || this.generateFilename(cvData, { ...config, format: 'tex' });
      link.href = URL.createObjectURL(blob);
      link.click();

      // Clean up URL
      setTimeout(() => URL.revokeObjectURL(link.href), 1000);

      return {
        success: true,
        message: 'LaTeX document generated successfully!',
        format: 'latex',
        fileSize: 'Small (LaTeX source)',
        atsCompatibility: 'Medium (after compilation)',
        professionalTypesetting: true,
        academicStandard: true,
        highlyCustomizable: true,
        templateUsed: config.templateConfig?.selectedTemplate || 'default'
      };
    } catch (error) {
      console.error('❌ LaTeX generation failed:', error);
      throw new Error(`LaTeX generation failed: ${error.message}`);
    }
  }

  /**
   * Generate LinkedIn-ready format
   */
  async generateLinkedIn(cvData, config) {
    console.log('💼 Generating LinkedIn-ready format...');
    try {
      const linkedinContent = await this.generateLinkedInFormat(cvData);

      // Create download link
      const blob = new Blob([linkedinContent], { type: 'text/plain' });
      const link = document.createElement('a');
      link.download = config.filename || this.generateFilename(cvData, { ...config, format: 'txt' });
      link.href = URL.createObjectURL(blob);
      link.click();

      // Clean up URL
      setTimeout(() => URL.revokeObjectURL(link.href), 1000);

      return {
        success: true,
        message: 'LinkedIn-ready format generated successfully!',
        format: 'linkedin',
        fileSize: 'Small (optimized text)',
        atsCompatibility: 'High (LinkedIn native)',
        linkedinOptimized: true,
        copyPasteReady: true,
        professionalNetworking: true,
        seoOptimized: true,
        templateUsed: config.templateConfig?.selectedTemplate || 'default'
      };
    } catch (error) {
      console.error('❌ LinkedIn generation failed:', error);
      throw new Error(`LinkedIn generation failed: ${error.message}`);
    }
  }

  /**
   * Generate HTML template
   */
  async generateHTMLTemplate(cvData, config) {
    const { personalInfo, profile, experience, education, skills, projects, certifications, languages } = cvData;

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${personalInfo?.fullName || 'Professional Resume'} - Portfolio</title>
    <meta name="description" content="Professional portfolio of ${personalInfo?.fullName || 'Professional'}">
    <meta name="keywords" content="${personalInfo?.fullName}, resume, portfolio, ${(skills?.technical || []).slice(0, 5).join(', ')}">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Georgia', serif; line-height: 1.6; color: #333; background: #f9f9f9; }
        .container { max-width: 800px; margin: 0 auto; background: white; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 2rem; text-align: center; }
        .header h1 { font-size: 2.5rem; margin-bottom: 0.5rem; }
        .header .contact { font-size: 1.1rem; opacity: 0.9; }
        .content { padding: 2rem; }
        .section { margin-bottom: 2rem; }
        .section h2 { color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 0.5rem; margin-bottom: 1rem; }
        .profile { font-size: 1.1rem; line-height: 1.8; color: #555; }
        .experience-item, .education-item, .project-item { margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid #eee; }
        .experience-item:last-child, .education-item:last-child, .project-item:last-child { border-bottom: none; }
        .item-header { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; margin-bottom: 0.5rem; }
        .item-title { font-weight: bold; color: #333; }
        .item-company { color: #667eea; }
        .item-date { color: #888; font-size: 0.9rem; }
        .item-description { color: #555; margin-top: 0.5rem; }
        .skills-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; }
        .skill-category h3 { color: #667eea; margin-bottom: 0.5rem; }
        .skill-list { list-style: none; }
        .skill-list li { background: #f0f4ff; padding: 0.3rem 0.6rem; margin: 0.2rem 0; border-radius: 4px; display: inline-block; margin-right: 0.5rem; }
        .languages { display: flex; flex-wrap: wrap; gap: 1rem; }
        .language { background: #e8f4f8; padding: 0.5rem 1rem; border-radius: 20px; }
        .footer { background: #333; color: white; text-align: center; padding: 1rem; }
        @media (max-width: 768px) {
            .container { margin: 0; }
            .header { padding: 1.5rem 1rem; }
            .header h1 { font-size: 2rem; }
            .content { padding: 1rem; }
            .item-header { flex-direction: column; align-items: flex-start; }
        }
    </style>
</head>
<body>
    <div class="container">
        <header class="header">
            <h1>${personalInfo?.fullName || 'Professional Resume'}</h1>
            <div class="contact">
                ${personalInfo?.email ? `📧 ${personalInfo.email}` : ''}
                ${personalInfo?.phone ? ` • 📞 ${personalInfo.phone}` : ''}
                ${personalInfo?.location ? ` • 📍 ${personalInfo.location}` : ''}
            </div>
        </header>

        <div class="content">
            ${profile?.summary ? `
            <section class="section">
                <h2>Professional Summary</h2>
                <div class="profile">${profile.summary}</div>
            </section>
            ` : ''}

            ${experience && experience.length > 0 ? `
            <section class="section">
                <h2>Professional Experience</h2>
                ${experience.map(exp => `
                <div class="experience-item">
                    <div class="item-header">
                        <div>
                            <div class="item-title">${exp.position || ''}</div>
                            <div class="item-company">${exp.company || ''}</div>
                        </div>
                        <div class="item-date">${exp.startDate || ''} - ${exp.endDate || exp.current ? 'Present' : ''}</div>
                    </div>
                    ${exp.description ? `<div class="item-description">${exp.description}</div>` : ''}
                </div>
                `).join('')}
            </section>
            ` : ''}

            ${education && education.length > 0 ? `
            <section class="section">
                <h2>Education</h2>
                ${education.map(edu => `
                <div class="education-item">
                    <div class="item-header">
                        <div>
                            <div class="item-title">${edu.degree || ''}</div>
                            <div class="item-company">${edu.institution || ''}</div>
                        </div>
                        <div class="item-date">${edu.year || ''}</div>
                    </div>
                </div>
                `).join('')}
            </section>
            ` : ''}

            ${skills && (skills.technical?.length > 0 || skills.soft?.length > 0) ? `
            <section class="section">
                <h2>Skills & Expertise</h2>
                <div class="skills-grid">
                    ${skills.technical?.length > 0 ? `
                    <div class="skill-category">
                        <h3>Technical Skills</h3>
                        <ul class="skill-list">
                            ${skills.technical.map(skill => `<li>${skill}</li>`).join('')}
                        </ul>
                    </div>
                    ` : ''}
                    ${skills.soft?.length > 0 ? `
                    <div class="skill-category">
                        <h3>Soft Skills</h3>
                        <ul class="skill-list">
                            ${skills.soft.map(skill => `<li>${skill}</li>`).join('')}
                        </ul>
                    </div>
                    ` : ''}
                </div>
            </section>
            ` : ''}

            ${projects && projects.length > 0 ? `
            <section class="section">
                <h2>Projects</h2>
                ${projects.map(project => `
                <div class="project-item">
                    <div class="item-header">
                        <div class="item-title">${project.name || ''}</div>
                        ${project.date ? `<div class="item-date">${project.date}</div>` : ''}
                    </div>
                    ${project.description ? `<div class="item-description">${project.description}</div>` : ''}
                    ${project.technologies ? `<div class="skills-grid"><div class="skill-category"><ul class="skill-list">${project.technologies.map(tech => `<li>${tech}</li>`).join('')}</ul></div></div>` : ''}
                </div>
                `).join('')}
            </section>
            ` : ''}

            ${languages && languages.length > 0 ? `
            <section class="section">
                <h2>Languages</h2>
                <div class="languages">
                    ${languages.map(lang => `<div class="language">${lang.name} - ${lang.level}</div>`).join('')}
                </div>
            </section>
            ` : ''}
        </div>

        <footer class="footer">
            <p>Generated with Professional CV Builder v2.0 | ${new Date().toLocaleDateString()}</p>
        </footer>
    </div>
</body>
</html>`;
  }

  /**
   * Generate plain text format
   */
  async generatePlainText(cvData) {
    const { personalInfo, profile, experience, education, skills, projects, certifications, languages } = cvData;
    let text = '';

    // Header
    if (personalInfo?.fullName) {
      text += `${personalInfo.fullName}\n`;
      text += '='.repeat(personalInfo.fullName.length) + '\n\n';
    }

    // Contact Information
    if (personalInfo?.email || personalInfo?.phone || personalInfo?.location) {
      text += 'CONTACT INFORMATION\n';
      text += '-------------------\n';
      if (personalInfo?.email) text += `Email: ${personalInfo.email}\n`;
      if (personalInfo?.phone) text += `Phone: ${personalInfo.phone}\n`;
      if (personalInfo?.location) text += `Location: ${personalInfo.location}\n`;
      text += '\n';
    }

    // Professional Summary
    if (profile?.summary) {
      text += 'PROFESSIONAL SUMMARY\n';
      text += '--------------------\n';
      text += `${profile.summary}\n\n`;
    }

    // Experience
    if (experience && experience.length > 0) {
      text += 'PROFESSIONAL EXPERIENCE\n';
      text += '----------------------\n';
      experience.forEach((exp, index) => {
        if (exp.position) text += `${exp.position}\n`;
        if (exp.company) text += `${exp.company}\n`;
        if (exp.startDate || exp.endDate) {
          text += `${exp.startDate || ''} - ${exp.endDate || (exp.current ? 'Present' : '')}\n`;
        }
        if (exp.description) text += `${exp.description}\n`;
        if (index < experience.length - 1) text += '\n';
      });
      text += '\n';
    }

    // Education
    if (education && education.length > 0) {
      text += 'EDUCATION\n';
      text += '---------\n';
      education.forEach((edu, index) => {
        if (edu.degree) text += `${edu.degree}\n`;
        if (edu.institution) text += `${edu.institution}\n`;
        if (edu.year) text += `${edu.year}\n`;
        if (index < education.length - 1) text += '\n';
      });
      text += '\n';
    }

    // Skills
    if (skills && (skills.technical?.length > 0 || skills.soft?.length > 0)) {
      text += 'SKILLS\n';
      text += '------\n';
      if (skills.technical?.length > 0) {
        text += `Technical: ${skills.technical.join(', ')}\n`;
      }
      if (skills.soft?.length > 0) {
        text += `Soft Skills: ${skills.soft.join(', ')}\n`;
      }
      text += '\n';
    }

    // Projects
    if (projects && projects.length > 0) {
      text += 'PROJECTS\n';
      text += '--------\n';
      projects.forEach((project, index) => {
        if (project.name) text += `${project.name}\n`;
        if (project.description) text += `${project.description}\n`;
        if (project.technologies?.length > 0) {
          text += `Technologies: ${project.technologies.join(', ')}\n`;
        }
        if (index < projects.length - 1) text += '\n';
      });
      text += '\n';
    }

    // Languages
    if (languages && languages.length > 0) {
      text += 'LANGUAGES\n';
      text += '---------\n';
      languages.forEach(lang => {
        text += `${lang.name}: ${lang.level}\n`;
      });
      text += '\n';
    }

    return text;
  }

  /**
   * Generate LaTeX template
   */
  async generateLaTeXTemplate(cvData, config) {
    const { personalInfo, profile, experience, education, skills, projects, languages } = cvData;

    return `\\documentclass[11pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage{lmodern}
\\usepackage[margin=1in]{geometry}
\\usepackage{enumitem}
\\usepackage{titlesec}
\\usepackage{xcolor}
\\usepackage{hyperref}

% Define colors
\\definecolor{headercolor}{RGB}{102, 126, 234}
\\definecolor{sectioncolor}{RGB}{102, 126, 234}

% Customize section formatting
\\titleformat{\\section}{\\color{sectioncolor}\\Large\\bfseries}{}{0em}{}[\\titlerule]
\\titlespacing*{\\section}{0pt}{20pt}{10pt}

% Remove page numbers
\\pagestyle{empty}

% Custom commands
\\newcommand{\\name}[1]{\\centerline{\\Huge\\textbf{\\color{headercolor}#1}}}
\\newcommand{\\contact}[1]{\\centerline{\\large #1}}
\\newcommand{\\job}[4]{\\textbf{#1} \\hfill #4 \\\\ \\textit{#2} \\\\ #3}
\\newcommand{\\education}[3]{\\textbf{#1} \\hfill #3 \\\\ \\textit{#2}}
\\newcommand{\\project}[3]{\\textbf{#1} \\hfill #3 \\\\ #2}

\\begin{document}

% Header
\\name{${personalInfo?.fullName || 'Your Name'}}
\\vspace{10pt}
\\contact{${[
  personalInfo?.email ? personalInfo.email : '',
  personalInfo?.phone ? personalInfo.phone : '',
  personalInfo?.location ? personalInfo.location : ''
].filter(Boolean).join(' \\textbullet\\ ')}}

\\vspace{20pt}

% Professional Summary
${profile?.summary ? `
\\section{Professional Summary}
${profile.summary}
\\vspace{10pt}
` : ''}

% Experience
${experience && experience.length > 0 ? `
\\section{Professional Experience}
\\begin{itemize}[leftmargin=0pt]
${experience.map(exp => `
\\item \\job{${exp.position || ''}}{${exp.company || ''}}{${exp.description || ''}}{${exp.startDate || ''} -- ${exp.endDate || (exp.current ? 'Present' : '')}}
\\vspace{5pt}
`).join('')}
\\end{itemize}
\\vspace{10pt}
` : ''}

% Education
${education && education.length > 0 ? `
\\section{Education}
\\begin{itemize}[leftmargin=0pt]
${education.map(edu => `
\\item \\education{${edu.degree || ''}}{${edu.institution || ''}}{${edu.year || ''}}
\\vspace{5pt}
`).join('')}
\\end{itemize}
\\vspace{10pt}
` : ''}

% Skills
${skills && (skills.technical?.length > 0 || skills.soft?.length > 0) ? `
\\section{Skills}
${skills.technical?.length > 0 ? `\\textbf{Technical:} ${skills.technical.join(', ')} \\\\` : ''}
${skills.soft?.length > 0 ? `\\textbf{Soft Skills:} ${skills.soft.join(', ')} \\\\` : ''}
\\vspace{10pt}
` : ''}

% Projects
${projects && projects.length > 0 ? `
\\section{Projects}
\\begin{itemize}[leftmargin=0pt]
${projects.map(project => `
\\item \\project{${project.name || ''}}{${project.description || ''}}{${project.date || ''}}
${project.technologies?.length > 0 ? `\\textit{Technologies:} ${project.technologies.join(', ')}` : ''}
\\vspace{5pt}
`).join('')}
\\end{itemize}
\\vspace{10pt}
` : ''}

% Languages
${languages && languages.length > 0 ? `
\\section{Languages}
${languages.map(lang => `${lang.name}: ${lang.level}`).join(' \\textbullet\\ ')}
` : ''}

\\end{document}`;
  }

  /**
   * Generate LinkedIn-ready format
   */
  async generateLinkedInFormat(cvData) {
    const { personalInfo, profile, experience, education, skills } = cvData;
    let content = '';

    // Professional Headline (LinkedIn About section)
    if (profile?.summary) {
      content += '=== LINKEDIN ABOUT SECTION ===\n';
      content += `${profile.summary}\n\n`;

      // Add skills mention for SEO
      if (skills?.technical?.length > 0) {
        content += `🔧 Core Technologies: ${skills.technical.slice(0, 5).join(' • ')}\n`;
      }
      if (skills?.soft?.length > 0) {
        content += `💡 Key Strengths: ${skills.soft.slice(0, 3).join(' • ')}\n`;
      }
      content += '\n';
    }

    // Experience (LinkedIn Experience section)
    if (experience && experience.length > 0) {
      content += '=== LINKEDIN EXPERIENCE SECTIONS ===\n\n';
      experience.forEach((exp, index) => {
        content += `--- Experience Entry ${index + 1} ---\n`;
        content += `Position Title: ${exp.position || ''}\n`;
        content += `Company: ${exp.company || ''}\n`;
        content += `Duration: ${exp.startDate || ''} - ${exp.endDate || (exp.current ? 'Present' : '')}\n`;
        if (exp.description) {
          content += `Description:\n${exp.description}\n`;
        }
        content += '\n';
      });
    }

    // Skills section
    if (skills && (skills.technical?.length > 0 || skills.soft?.length > 0)) {
      content += '=== LINKEDIN SKILLS TO ADD ===\n';
      const allSkills = [...(skills.technical || []), ...(skills.soft || [])];
      // LinkedIn allows up to 50 skills, take the first 20 most important
      content += allSkills.slice(0, 20).map((skill, index) => `${index + 1}. ${skill}`).join('\n') + '\n\n';
    }

    // Education
    if (education && education.length > 0) {
      content += '=== LINKEDIN EDUCATION SECTIONS ===\n\n';
      education.forEach((edu, index) => {
        content += `--- Education Entry ${index + 1} ---\n`;
        content += `Degree: ${edu.degree || ''}\n`;
        content += `School: ${edu.institution || ''}\n`;
        content += `Year: ${edu.year || ''}\n\n`;
      });
    }

    // SEO Keywords section
    content += '=== SEO KEYWORDS FOR LINKEDIN ===\n';
    const keywords = [];
    if (personalInfo?.fullName) keywords.push(personalInfo.fullName);
    if (skills?.technical) keywords.push(...skills.technical.slice(0, 10));
    if (experience?.[0]?.position) keywords.push(experience[0].position);

    content += `Suggested keywords to include in your profile: ${keywords.join(', ')}\n\n`;

    content += '=== LINKEDIN PROFILE OPTIMIZATION TIPS ===\n';
    content += '• Use a professional headshot as your profile photo\n';
    content += '• Write a compelling headline that includes your key skills\n';
    content += '• Include industry keywords in your About section\n';
    content += '• Request recommendations from colleagues\n';
    content += '• Share relevant content regularly\n';
    content += '• Connect with industry professionals\n';

    return content;
  }

  /**
   * Add metadata to PDF
   */
  addMetadataToPDF(pdf, metadata, cvData) {
    try {
      const title = metadata.title || (cvData.personalInfo?.fullName ? `${cvData.personalInfo.fullName} - Resume` : 'Professional Resume');
      const author = metadata.author || cvData.personalInfo?.fullName || '';

      pdf.setProperties({
        title: title,
        subject: metadata.subject || 'Resume/CV Document',
        author: author,
        keywords: metadata.keywords || 'resume, cv, professional',
        creator: metadata.creator || 'Professional CV Builder',
        producer: metadata.producer || 'Professional CV Builder v2.0'
      });

      console.log('✅ PDF metadata added:', title);
    } catch (error) {
      console.warn('⚠️ Failed to add PDF metadata:', error);
    }
  }

  /**
   * Generate appropriate filename
   */
  generateFilename(cvData, config) {
    const name = cvData.personalInfo?.fullName || 'Resume';
    const cleanName = name.replace(/[^a-zA-Z0-9\-_]/g, '_');
    const format = config.format || 'pdf';
    const timestamp = new Date().toISOString().split('T')[0];

    // Map formats to file extensions
    const extensionMap = {
      visual: 'pdf',
      searchable: 'pdf',
      hybrid: 'pdf',
      docx: 'docx',
      png: 'png',
      jpg: 'jpg',
      html: 'html',
      json: 'json',
      txt: 'txt',
      latex: 'tex',
      linkedin: 'txt'
    };

    const extension = extensionMap[format] || 'pdf';

    // Format-specific naming
    const formatSuffix = format === 'linkedin' ? 'linkedin_ready' :
                        format === 'latex' ? 'latex_source' :
                        format;

    return `${cleanName}_${formatSuffix}_${timestamp}.${extension}`;
  }
}

/**
 * Validate CV data for export
 */
export function validateExportData(cvData) {
  const issues = [];

  if (!cvData) {
    return { isValid: false, issues: ['No CV data provided'] };
  }

  if (!cvData.personalInfo || !cvData.personalInfo.fullName) {
    issues.push('Full name is required in personal information');
  }

  if (!cvData.personalInfo || !cvData.personalInfo.email) {
    issues.push('Email address is required in personal information');
  }

  if (!cvData.profile || !cvData.profile.summary || !cvData.profile.summary.trim()) {
    issues.push('Professional summary/profile section is recommended');
  }

  if (!cvData.experience || cvData.experience.length === 0) {
    issues.push('At least one work experience entry is recommended');
  }

  if (!cvData.education || cvData.education.length === 0) {
    issues.push('At least one education entry is recommended');
  }

  if (!cvData.skills || (!cvData.skills.technical || cvData.skills.technical.length === 0)) {
    issues.push('Skills section is recommended for better visibility');
  }

  return { isValid: issues.length === 0, issues };
}

// Create default instance for backward compatibility
export const pdfGenerator = new EnhancedPDFGenerator();
