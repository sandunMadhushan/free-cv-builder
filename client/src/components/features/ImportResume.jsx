import React, { useState, useCallback } from "react";
import { Button } from "../common/Button";
import { useCVStore } from "../../store/cvStore";
import * as pdfjsLib from "pdfjs-dist";
import * as mammoth from "mammoth";

// Set up PDF.js worker - use a more reliable worker setup
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

export const ImportResume = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null); // 'success' | 'error'
  const [statusMessage, setStatusMessage] = useState("");
  const updatePersonalInfo = useCVStore((state) => state.updatePersonalInfo);
  const updateProfile = useCVStore((state) => state.updateProfile);
  const addExperience = useCVStore((state) => state.addExperience);
  const addEducation = useCVStore((state) => state.addEducation);
  const updateSkills = useCVStore((state) => state.updateSkills);

  // PDF text extraction function using PDF.js
  const extractTextFromPDF = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();

      // Configure PDF.js options
      const loadingTask = pdfjsLib.getDocument({
        data: arrayBuffer,
        cMapUrl: "https://unpkg.com/pdfjs-dist@" + pdfjsLib.version + "/cmaps/",
        cMapPacked: true,
        verbosity: 0, // Reduce console output
      });

      const pdf = await loadingTask.promise;
      let fullText = "";
      let hasActualText = false;

      // Extract text from each page
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();

        if (textContent.items.length > 0) {
          const pageText = textContent.items
            .map((item) => item.str)
            .filter((str) => str.trim())
            .join(" ");

          if (pageText.trim()) {
            fullText += pageText + "\n";
            hasActualText = true;
          }
        }
      }

      // Check if we actually got meaningful text
      if (!hasActualText || fullText.trim().length < 20) {
        throw new Error(
          "This PDF appears to be a scanned image without searchable text. Please try converting it to a text-based PDF or use a different format.",
        );
      }

      return fullText;
    } catch (error) {
      console.error("PDF parsing detailed error:", error);

      if (error.message.includes("scanned image")) {
        throw error;
      } else if (error.name === "InvalidPDFException") {
        throw new Error(
          "Invalid or corrupted PDF file. Please try with a different PDF.",
        );
      } else if (error.name === "PasswordException") {
        throw new Error(
          "This PDF is password protected. Please remove the password and try again.",
        );
      } else {
        throw new Error(
          `PDF parsing failed: ${error.message || "Unknown error"}. Please try with a different file format.`,
        );
      }
    }
  };

  // Enhanced text extraction patterns
  const extractDataFromText = (text) => {
    const lines = text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line);
    const extractedData = {
      personalInfo: {},
      profile: {},
      experience: [],
      education: [],
      skills: { technical: [], soft: [], tools: [], languages: [] },
    };

    // Extract email
    const emailMatch = text.match(
      /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/,
    );
    if (emailMatch) {
      extractedData.personalInfo.email = emailMatch[0];
    }

    // Extract phone (enhanced pattern)
    const phoneMatch = text.match(
      /(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\+\d{1,3}[-.\s]?\d{1,14}/,
    );
    if (phoneMatch) {
      extractedData.personalInfo.phone = phoneMatch[0];
    }

    // Extract name (improved detection)
    const nameLines = lines
      .slice(0, 5)
      .filter(
        (line) =>
          !line.includes("@") &&
          !line.match(/\+?\d{3}/) &&
          line.length > 2 &&
          line.length < 60 &&
          !line.toLowerCase().includes("resume") &&
          !line.toLowerCase().includes("cv") &&
          line.split(" ").length <= 4,
      );
    if (nameLines.length > 0) {
      extractedData.personalInfo.fullName = nameLines[0];
    }

    // Extract LinkedIn
    const linkedinMatch = text.match(
      /(?:linkedin\.com\/in\/|linkedin\.com\/pub\/|linkedin\.com\/profile\/view\?id=)([\w-]+)/i,
    );
    if (linkedinMatch) {
      extractedData.personalInfo.linkedin = `https://linkedin.com/in/${linkedinMatch[1]}`;
    }

    // Extract GitHub
    const githubMatch = text.match(/github\.com\/([\w-]+)/i);
    if (githubMatch) {
      extractedData.personalInfo.github = `https://github.com/${githubMatch[1]}`;
    }

    // Extract website/portfolio
    const websiteMatch = text.match(
      /(?:portfolio|website|site)[\s:]*([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i,
    );
    if (websiteMatch) {
      extractedData.personalInfo.website = websiteMatch[1].includes("http")
        ? websiteMatch[1]
        : `https://${websiteMatch[1]}`;
    }

    // Extract address/location
    const locationMatch = text.match(
      /(?:address|location|based in|city)[\s:]*([^\n]{10,60})/i,
    );
    if (locationMatch) {
      extractedData.personalInfo.address = locationMatch[1].trim();
    }

    // Extract summary/profile (improved detection)
    const summaryPatterns = [
      /(SUMMARY|PROFILE|ABOUT|OBJECTIVE|PROFESSIONAL\s+SUMMARY)[\s\S]*?(?=\n[A-Z\s]{4,}|\n\n|EXPERIENCE|EDUCATION|SKILLS|WORK|EMPLOYMENT)/i,
      /(SUMMARY|PROFILE|ABOUT|OBJECTIVE)[\s:]*[\n]*([\s\S]*?)(?=\n[A-Z\s]{4,}|\n\n|EXPERIENCE|EDUCATION|SKILLS)/i,
    ];

    for (const pattern of summaryPatterns) {
      const summaryMatch = text.match(pattern);
      if (summaryMatch) {
        let summary = summaryMatch[summaryMatch.length - 1] || summaryMatch[0];
        summary = summary
          .replace(
            /(SUMMARY|PROFILE|ABOUT|OBJECTIVE|PROFESSIONAL\s+SUMMARY)/gi,
            "",
          )
          .trim()
          .split("\n")
          .map((line) => line.trim())
          .filter(
            (line) => line && !line.match(/^[A-Z\s]+$/) && line.length > 10,
          )
          .join(" ")
          .substring(0, 500); // Limit length

        if (summary.length > 20) {
          extractedData.profile.summary = summary;
          break;
        }
      }
    }

    // Extract skills (enhanced patterns)
    const skillsPatterns = [
      /SKILLS[\s\S]*?(?=\n[A-Z\s]{4,}|\n\n|EXPERIENCE|EDUCATION|WORK)/i,
      /TECHNICAL\s+SKILLS[\s\S]*?(?=\n[A-Z\s]{4,}|\n\n|EXPERIENCE|EDUCATION)/i,
      /CORE\s+COMPETENCIES[\s\S]*?(?=\n[A-Z\s]{4,}|\n\n|EXPERIENCE|EDUCATION)/i,
    ];

    for (const pattern of skillsPatterns) {
      const skillsMatch = text.match(pattern);
      if (skillsMatch) {
        const skillsText = skillsMatch[0]
          .replace(/SKILLS|TECHNICAL\s+SKILLS|CORE\s+COMPETENCIES/i, "")
          .trim();
        const skillsList = skillsText
          .split(/[,•\n|]/)
          .map((skill) => skill.trim().replace(/[^\w\s+#.-]/g, ""))
          .filter(
            (skill) =>
              skill &&
              skill.length > 1 &&
              skill.length < 40 &&
              !skill.match(/^\d+$/),
          )
          .slice(0, 15); // Limit to 15 skills

        if (skillsList.length > 0) {
          // Try to categorize skills
          const techSkills = skillsList.filter(
            (skill) =>
              /javascript|python|java|react|node|sql|html|css|php|c\+\+|c#|ruby|go|rust|swift|kotlin|typescript/i.test(
                skill,
              ) || skill.length < 20,
          );
          const tools = skillsList.filter((skill) =>
            /git|docker|aws|azure|figma|photoshop|excel|jira|slack|trello/i.test(
              skill,
            ),
          );

          extractedData.skills.technical = techSkills.slice(0, 10);
          extractedData.skills.tools = tools.slice(0, 5);
          break;
        }
      }
    }

    // Extract experience (basic pattern)
    const experiencePattern =
      /(EXPERIENCE|WORK\s+HISTORY|EMPLOYMENT)[\s\S]*?(?=\n[A-Z\s]{4,}|\n\n|EDUCATION|SKILLS)/i;
    const experienceMatch = text.match(experiencePattern);
    if (experienceMatch) {
      const expText = experienceMatch[0]
        .replace(/(EXPERIENCE|WORK\s+HISTORY|EMPLOYMENT)/i, "")
        .trim();
      const jobEntries = expText
        .split(/\n\s*\n/)
        .filter((entry) => entry.trim().length > 50);

      jobEntries.slice(0, 3).forEach((entry) => {
        const lines = entry
          .split("\n")
          .map((l) => l.trim())
          .filter((l) => l);
        if (lines.length >= 2) {
          const jobTitle = lines[0];
          const company = lines[1];
          const description = lines.slice(2).join(" ").substring(0, 300);

          extractedData.experience.push({
            id: Date.now() + Math.random(),
            jobTitle,
            company,
            description,
            startDate: "",
            endDate: "",
            isPresent: false,
          });
        }
      });
    }

    // Extract education (basic pattern)
    const educationPattern =
      /EDUCATION[\s\S]*?(?=\n[A-Z\s]{4,}|\n\n|SKILLS|EXPERIENCE)/i;
    const educationMatch = text.match(educationPattern);
    if (educationMatch) {
      const eduText = educationMatch[0].replace(/EDUCATION/i, "").trim();
      const eduEntries = eduText
        .split(/\n\s*\n/)
        .filter((entry) => entry.trim().length > 20);

      eduEntries.slice(0, 3).forEach((entry) => {
        const lines = entry
          .split("\n")
          .map((l) => l.trim())
          .filter((l) => l);
        if (lines.length >= 2) {
          const degree = lines[0];
          const school = lines[1];

          extractedData.education.push({
            id: Date.now() + Math.random(),
            degree,
            school,
            startDate: "",
            endDate: "",
            description: "",
          });
        }
      });
    }

    return extractedData;
  };

  const handleFileUpload = useCallback(
    async (event) => {
      const file = event.target.files?.[0];
      if (!file) return;

      setIsUploading(true);
      setUploadStatus(null);
      setStatusMessage("Parsing document...");

      try {
        const fileType = file.type;
        const fileName = file.name.toLowerCase();
        let text = "";

        if (fileType === "text/plain") {
          // Plain text file
          text = await file.text();
        } else if (
          fileType === "application/pdf" ||
          fileName.endsWith(".pdf")
        ) {
          // PDF file parsing using PDF.js
          setStatusMessage("Extracting text from PDF...");
          try {
            text = await extractTextFromPDF(file);
            console.log("PDF text extraction successful, length:", text.length);
          } catch (pdfError) {
            console.error("PDF parsing error:", pdfError);
            throw pdfError; // Re-throw the specific error from extractTextFromPDF
          }
        } else if (
          fileType ===
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
          fileName.endsWith(".docx")
        ) {
          // DOCX file parsing
          try {
            const arrayBuffer = await file.arrayBuffer();
            const result = await mammoth.extractRawText({ arrayBuffer });
            text = result.value;
          } catch (docxError) {
            console.error("DOCX parsing error:", docxError);
            throw new Error(
              "Unable to parse Word document. Please try with a different file format.",
            );
          }
        } else if (fileName.endsWith(".doc")) {
          // Legacy DOC format
          setStatusMessage(
            "Legacy .doc files are not supported. Please convert to .docx, .pdf, or .txt format.",
          );
          setUploadStatus("error");
          setIsUploading(false);
          return;
        } else {
          setStatusMessage(
            "Unsupported file type. Please upload a .txt, .pdf, or .docx file.",
          );
          setUploadStatus("error");
          setIsUploading(false);
          return;
        }

        // Validate extracted text with better debugging
        if (!text || text.trim().length < 20) {
          console.log("Extracted text length:", text?.length);
          console.log("Extracted text preview:", text?.substring(0, 200));
          throw new Error(`Unable to extract sufficient text from the document.

Extracted: ${text?.length || 0} characters
File type: ${fileType}
File name: ${fileName}

This might happen if:
• The PDF is a scanned image (use OCR first)
• The document is password protected
• The file is corrupted or in an unsupported format

Please try:
• Converting to a text-based PDF
• Using a DOCX or TXT file instead
• Checking if the file opens normally in a PDF reader`);
        }

        setStatusMessage("Analyzing resume content...");

        // Extract data from text
        const extractedData = extractDataFromText(text);

        // Validate extracted data
        const personalFields = Object.keys(extractedData.personalInfo).length;
        const hasSkills = extractedData.skills.technical.length > 0;
        const hasProfile = !!extractedData.profile.summary;
        const hasExperience = extractedData.experience.length > 0;
        const hasEducation = extractedData.education.length > 0;

        if (
          personalFields === 0 &&
          !hasSkills &&
          !hasProfile &&
          !hasExperience &&
          !hasEducation
        ) {
          throw new Error(
            "No recognizable resume data found. Please check your file format and content structure.",
          );
        }

        // Update the CV store with extracted data
        if (personalFields > 0) {
          updatePersonalInfo(extractedData.personalInfo);
        }

        if (hasProfile) {
          updateProfile(extractedData.profile);
        }

        if (hasSkills) {
          updateSkills(extractedData.skills);
        }

        // Add experience entries
        if (hasExperience) {
          extractedData.experience.forEach((exp) => {
            addExperience(exp);
          });
        }

        // Add education entries
        if (hasEducation) {
          extractedData.education.forEach((edu) => {
            addEducation(edu);
          });
        }

        // Generate success message with details
        const importedItems = [];
        if (personalFields > 0)
          importedItems.push(
            `${personalFields} personal detail${personalFields > 1 ? "s" : ""}`,
          );
        if (hasProfile) importedItems.push("professional summary");
        if (hasSkills)
          importedItems.push(
            `${extractedData.skills.technical.length} skill${extractedData.skills.technical.length > 1 ? "s" : ""}`,
          );
        if (hasExperience)
          importedItems.push(
            `${extractedData.experience.length} work experience${extractedData.experience.length > 1 ? "s" : ""}`,
          );
        if (hasEducation)
          importedItems.push(
            `${extractedData.education.length} education record${extractedData.education.length > 1 ? "s" : ""}`,
          );

        setStatusMessage(
          `✅ Successfully imported resume! Found: ${importedItems.join(", ")}. Please review and edit the imported data as needed.`,
        );
        setUploadStatus("success");
      } catch (error) {
        console.error("Error parsing file:", error);
        setStatusMessage(`❌ ${error.message}`);
        setUploadStatus("error");
      } finally {
        setIsUploading(false);
        // Reset file input
        event.target.value = "";
      }
    },
    [
      updatePersonalInfo,
      updateProfile,
      updateSkills,
      addExperience,
      addEducation,
    ],
  );

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 dark:border-gray-700 pb-3 mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
          Import Resume
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Upload your existing resume to automatically fill out the form
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
        <div className="space-y-4">
          <div className="flex justify-center">
            <svg
              className="h-12 w-12 text-gray-400 dark:text-gray-500"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              {isUploading ? "Processing..." : "Upload your resume"}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Supports PDF, DOCX, and TXT files
            </p>
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-2">
              Maximum file size: 10MB
            </div>
          </div>

          <div className="flex justify-center">
            <label
              htmlFor="file-upload"
              className="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 transition duration-150 ease-in-out dark:bg-blue-500 dark:hover:bg-blue-600 dark:disabled:bg-blue-700"
            >
              {isUploading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {statusMessage || "Processing..."}
                </>
              ) : (
                <>📎 Choose File</>
              )}
            </label>
            <input
              id="file-upload"
              name="file-upload"
              type="file"
              accept=".txt,.pdf,.docx"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="absolute inset-0 w-0 h-0 opacity-0 pointer-events-none"
            />
          </div>
        </div>
      </div>

      {/* Status Messages */}
      {uploadStatus && (
        <div
          className={`p-4 rounded-lg border ${
            uploadStatus === "success"
              ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300"
              : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300"
          }`}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {uploadStatus === "success" ? (
                <svg
                  className="h-5 w-5 text-green-400 dark:text-green-300"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5 text-red-400 dark:text-red-300"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm whitespace-pre-wrap">{statusMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Supported Formats */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
        <h3 className="font-medium text-blue-900 dark:text-blue-300 mb-2">
          📎 Supported File Formats
        </h3>
        <div className="text-sm text-blue-700 dark:text-blue-300 space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="flex items-center space-x-2">
              <span className="font-mono bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded text-xs">
                .PDF
              </span>
              <span>Adobe PDF files</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-mono bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded text-xs">
                .DOCX
              </span>
              <span>Microsoft Word</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-mono bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded text-xs">
                .TXT
              </span>
              <span>Plain text files</span>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
        <h3 className="font-medium text-amber-900 dark:text-amber-300 mb-2">
          💡 Tips for Best Results
        </h3>
        <div className="text-sm text-amber-700 dark:text-amber-300 space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p>
                <strong>Format Requirements:</strong>
              </p>
              <ul className="space-y-1 ml-4 mt-1">
                <li>
                  • Use clear section headers (EXPERIENCE, SKILLS, EDUCATION)
                </li>
                <li>• Ensure contact information is at the top</li>
                <li>• Use standard date formats</li>
                <li>• Avoid complex layouts or tables</li>
              </ul>
            </div>
            <div>
              <p>
                <strong>What Gets Imported:</strong>
              </p>
              <ul className="space-y-1 ml-4 mt-1">
                <li>• Personal details (name, email, phone)</li>
                <li>• Professional summary/objective</li>
                <li>• Work experience and job descriptions</li>
                <li>• Education and certifications</li>
                <li>• Technical and soft skills</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-blue-900 dark:text-blue-300 text-sm font-medium">
              🔧 <strong>Having trouble with PDF import?</strong>
            </p>
            <p className="text-blue-800 dark:text-blue-200 text-xs mt-1">
              If your PDF can't be imported (especially PDFs from other CV
              builders),
              <strong> use "Export PDF → Searchable PDF"</strong> in the header
              for text-based PDFs that can be imported back!
            </p>
          </div>
          <p className="mt-3 text-xs">
            <strong>Note:</strong> After importing, please review and edit the
            extracted data for accuracy. The AI parser works best with
            well-structured, text-based resumes.
          </p>
        </div>
      </div>
    </div>
  );
};
