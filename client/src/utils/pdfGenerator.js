import html2pdf from "html2pdf.js";

/**
 * Generate and download high-quality visual PDF from the CV preview
 * @param {string} filename - Optional custom filename
 * @param {string} elementId - ID of the element to export (default: 'cv-preview-print')
 */
export const generatePDF = async (
  filename = "resume.pdf",
  elementId = "cv-preview-print",
) => {
  try {
    const element = document.getElementById(elementId);

    if (!element) {
      throw new Error(
        "CV preview element not found. Please make sure the CV is loaded.",
      );
    }

    // Configuration optimized for beautiful visual output (fixed blank PDF issue)
    const options = {
      margin: 10,
      filename: filename,
      image: {
        type: "jpeg",
        quality: 0.98,
      },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        allowTaint: false,
        backgroundColor: "#ffffff",
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait",
      },
    };

    // Generate and download the PDF
    await html2pdf().set(options).from(element).save();

    return { success: true, message: "PDF downloaded successfully!" };
  } catch (error) {
    console.error("PDF Generation Error:", error);
    return {
      success: false,
      message: `Failed to generate PDF: ${error.message}`,
    };
  }
};

/**
 * Generate PDF blob with enhanced text preservation
 * @param {string} elementId - ID of the element to export
 */
export const generatePDFBlob = async (elementId = "cv-preview-print") => {
  try {
    const element = document.getElementById(elementId);

    if (!element) {
      throw new Error("CV preview element not found.");
    }

    const options = {
      margin: [10, 10, 10, 10],
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        backgroundColor: "#ffffff",
        logging: false,
        preserveDrawingBuffer: true,
        foreignObjectRendering: true,
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait",
        compress: false,
        userUnit: 1.0,
      },
    };

    // Generate blob with text preservation
    const pdfBlob = await html2pdf()
      .set(options)
      .from(element)
      .outputPdf("blob");

    return { success: true, blob: pdfBlob };
  } catch (error) {
    console.error("PDF Blob Generation Error:", error);
    return {
      success: false,
      message: `Failed to generate PDF preview: ${error.message}`,
    };
  }
};

/**
 * Generate a text-based PDF using alternative method
 * @param {Object} cvData - CV data to export
 * @param {string} filename - Filename for the PDF
 */
export const generateSearchablePDF = async (
  cvData,
  filename = "resume.pdf",
) => {
  try {
    // Import jsPDF for direct text-based PDF generation
    const { jsPDF } = await import("jspdf");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: false,
    });

    // Set up fonts and styling
    pdf.setFont("helvetica");
    let yPosition = 20;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - margin * 2;

    // Helper function to add text with word wrapping
    const addText = (
      text,
      fontSize = 10,
      isBold = false,
      leftMargin = margin,
    ) => {
      if (!text) return yPosition;

      pdf.setFontSize(fontSize);
      pdf.setFont("helvetica", isBold ? "bold" : "normal");

      const lines = pdf.splitTextToSize(text, maxWidth - (leftMargin - margin));

      // Check if we need a new page
      if (yPosition + lines.length * fontSize * 0.35 > 280) {
        pdf.addPage();
        yPosition = 20;
      }

      pdf.text(lines, leftMargin, yPosition);
      yPosition += lines.length * fontSize * 0.35 + 2;
      return yPosition;
    };

    // Add header with personal info
    if (cvData.personalInfo?.fullName) {
      addText(cvData.personalInfo.fullName, 16, true);
      yPosition += 3;
    }

    // Contact information
    const contactInfo = [];
    if (cvData.personalInfo?.email) contactInfo.push(cvData.personalInfo.email);
    if (cvData.personalInfo?.phone) contactInfo.push(cvData.personalInfo.phone);
    if (cvData.personalInfo?.address)
      contactInfo.push(cvData.personalInfo.address);
    if (contactInfo.length > 0) {
      addText(contactInfo.join(" | "), 10);
      yPosition += 3;
    }

    // Links
    const links = [];
    if (cvData.personalInfo?.linkedin) links.push(cvData.personalInfo.linkedin);
    if (cvData.personalInfo?.github) links.push(cvData.personalInfo.github);
    if (cvData.personalInfo?.website) links.push(cvData.personalInfo.website);
    if (links.length > 0) {
      addText(links.join(" | "), 10);
      yPosition += 5;
    }

    // Profile/Summary
    if (cvData.profile?.summary) {
      addText("PROFESSIONAL SUMMARY", 12, true);
      addText(cvData.profile.summary, 10);
      yPosition += 5;
    }

    // Experience
    if (cvData.experience?.length > 0) {
      addText("EXPERIENCE", 12, true);
      cvData.experience.forEach((exp) => {
        if (exp.jobTitle || exp.company) {
          const jobHeader = `${exp.jobTitle || ""}${exp.jobTitle && exp.company ? " at " : ""}${exp.company || ""}`;
          addText(jobHeader, 10, true);

          if (exp.startDate || exp.endDate || exp.isPresent) {
            const dates = `${exp.startDate || ""} - ${exp.isPresent ? "Present" : exp.endDate || ""}`;
            addText(dates, 9);
          }

          if (exp.description) {
            addText(exp.description, 10, false, margin + 5);
          }
          yPosition += 3;
        }
      });
      yPosition += 2;
    }

    // Education
    if (cvData.education?.length > 0) {
      addText("EDUCATION", 12, true);
      cvData.education.forEach((edu) => {
        if (edu.degree || edu.school) {
          addText(`${edu.degree || ""} - ${edu.school || ""}`, 10, true);

          if (edu.startDate || edu.endDate) {
            const dates = `${edu.startDate || ""} - ${edu.endDate || ""}`;
            addText(dates, 9);
          }

          if (edu.description) {
            addText(edu.description, 10, false, margin + 5);
          }
          yPosition += 3;
        }
      });
      yPosition += 2;
    }

    // Skills
    if (cvData.skills) {
      let hasSkills = false;
      addText("SKILLS", 12, true);

      if (cvData.skills.technical?.length > 0) {
        addText("Technical: " + cvData.skills.technical.join(", "), 10);
        hasSkills = true;
      }

      if (cvData.skills.tools?.length > 0) {
        addText("Tools: " + cvData.skills.tools.join(", "), 10);
        hasSkills = true;
      }

      if (cvData.skills.soft?.length > 0) {
        addText("Soft Skills: " + cvData.skills.soft.join(", "), 10);
        hasSkills = true;
      }

      if (cvData.skills.languages?.length > 0) {
        addText("Languages: " + cvData.skills.languages.join(", "), 10);
        hasSkills = true;
      }

      if (hasSkills) {
        yPosition += 2;
      }
    }

    // Projects
    if (cvData.projects?.length > 0) {
      addText("PROJECTS", 12, true);
      cvData.projects.forEach((project) => {
        if (project.name) {
          addText(project.name, 10, true);

          if (project.description) {
            addText(project.description, 10, false, margin + 5);
          }

          if (project.technologies) {
            addText(
              `Technologies: ${project.technologies}`,
              9,
              false,
              margin + 5,
            );
          }

          if (project.url || project.github) {
            const links = [];
            if (project.url) links.push(`Live: ${project.url}`);
            if (project.github) links.push(`GitHub: ${project.github}`);
            addText(links.join(" | "), 9, false, margin + 5);
          }
          yPosition += 3;
        }
      });
      yPosition += 2;
    }

    // Certifications
    if (cvData.certifications?.length > 0) {
      addText("CERTIFICATIONS", 12, true);
      cvData.certifications.forEach((cert) => {
        if (cert.name) {
          let certText = cert.name;
          if (cert.issuer) {
            certText += ` - ${cert.issuer}`;
          }
          addText(certText, 10, true);

          if (cert.date) {
            addText(`Earned: ${cert.date}`, 9);
          }

          if (cert.description) {
            addText(cert.description, 10, false, margin + 5);
          }
          yPosition += 3;
        }
      });
      yPosition += 2;
    }

    // Languages
    if (cvData.languages?.length > 0) {
      addText("LANGUAGES", 12, true);
      const langList = cvData.languages.map((lang) => {
        let langText = lang.name || lang;
        if (lang.proficiency && typeof lang === "object") {
          langText += ` (${lang.proficiency})`;
        }
        return langText;
      });
      addText(langList.join(", "), 10);
      yPosition += 2;
    }

    // Save PDF
    pdf.save(filename);

    return {
      success: true,
      message:
        "Searchable PDF downloaded successfully! This PDF can be imported back into the CV Builder.",
    };
  } catch (error) {
    console.error("Searchable PDF Generation Error:", error);
    return {
      success: false,
      message: `Failed to generate searchable PDF: ${error.message}`,
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
  if (!personalInfo?.fullName || personalInfo.fullName.trim() === "") {
    issues.push("Full name is required");
  }

  if (!personalInfo?.email || personalInfo.email.trim() === "") {
    issues.push("Email address is required");
  }

  // Check for at least one main section
  const hasContent =
    (profile?.summary && profile.summary.trim()) ||
    (experience && experience.length > 0) ||
    (education && education.length > 0) ||
    (skills && (skills.technical?.length > 0 || skills.tools?.length > 0));

  if (!hasContent) {
    issues.push(
      "Please add some content (profile summary, experience, education, or skills)",
    );
  }

  return {
    isValid: issues.length === 0,
    issues: issues,
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
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .replace(/\s+/g, "_")
      .toLowerCase();

    const timestamp = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    return `${cleanName}_resume_${timestamp}.pdf`;
  }

  return `resume_${new Date().toISOString().split("T")[0]}.pdf`;
};
