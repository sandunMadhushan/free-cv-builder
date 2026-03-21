import React, { useState, useCallback } from 'react';
import { Button } from '../common/Button';
import { useCVStore } from '../../store/cvStore';

export const ImportResume = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null); // 'success' | 'error'
  const [statusMessage, setStatusMessage] = useState('');
  const updatePersonalInfo = useCVStore(state => state.updatePersonalInfo);
  const updateProfile = useCVStore(state => state.updateProfile);
  const addExperience = useCVStore(state => state.addExperience);
  const addEducation = useCVStore(state => state.addEducation);
  const updateSkills = useCVStore(state => state.updateSkills);

  // Simple text extraction patterns
  const extractDataFromText = (text) => {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);
    const extractedData = {
      personalInfo: {},
      profile: {},
      experience: [],
      education: [],
      skills: { technical: [], soft: [], tools: [], languages: [] }
    };

    // Extract email
    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    if (emailMatch) {
      extractedData.personalInfo.email = emailMatch[0];
    }

    // Extract phone
    const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
    if (phoneMatch) {
      extractedData.personalInfo.phone = phoneMatch[0];
    }

    // Extract name (first few lines, excluding email/phone)
    const nameLines = lines.slice(0, 3).filter(line =>
      !line.includes('@') &&
      !line.match(/\d{3}/) &&
      line.length > 2 &&
      line.length < 50
    );
    if (nameLines.length > 0) {
      extractedData.personalInfo.fullName = nameLines[0];
    }

    // Extract LinkedIn
    const linkedinMatch = text.match(/linkedin\.com\/in\/[\w-]+/);
    if (linkedinMatch) {
      extractedData.personalInfo.linkedin = linkedinMatch[0];
    }

    // Extract GitHub
    const githubMatch = text.match(/github\.com\/[\w-]+/);
    if (githubMatch) {
      extractedData.personalInfo.github = githubMatch[0];
    }

    // Extract summary/profile (look for common section headers)
    const summaryMatch = text.match(/(SUMMARY|PROFILE|ABOUT|OBJECTIVE)[\s\S]*?(?=\n[A-Z]{2,}|\n\n|EXPERIENCE|EDUCATION|SKILLS)/i);
    if (summaryMatch) {
      const summary = summaryMatch[0]
        .replace(/(SUMMARY|PROFILE|ABOUT|OBJECTIVE)/i, '')
        .trim()
        .split('\n')
        .map(line => line.trim())
        .filter(line => line && !line.match(/^[A-Z\s]+$/))
        .join(' ');

      if (summary.length > 20) {
        extractedData.profile.summary = summary;
      }
    }

    // Extract skills (look for skills section)
    const skillsMatch = text.match(/SKILLS[\s\S]*?(?=\n[A-Z]{2,}|\n\n|EXPERIENCE|EDUCATION)/i);
    if (skillsMatch) {
      const skillsText = skillsMatch[0].replace(/SKILLS/i, '').trim();
      const skillsList = skillsText
        .split(/[,•\n]/)
        .map(skill => skill.trim())
        .filter(skill => skill && skill.length > 1 && skill.length < 30);

      extractedData.skills.technical = skillsList.slice(0, 10); // Take first 10 as technical skills
    }

    return extractedData;
  };

  const handleFileUpload = useCallback(async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadStatus(null);
    setStatusMessage('');

    try {
      const fileType = file.type;
      let text = '';

      if (fileType === 'text/plain') {
        // Plain text file
        text = await file.text();
      } else if (fileType === 'application/pdf') {
        setStatusMessage('PDF parsing is not yet supported. Please try with a text file (.txt) for now.');
        setUploadStatus('error');
        setIsUploading(false);
        return;
      } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        setStatusMessage('DOCX parsing is not yet supported. Please try with a text file (.txt) for now.');
        setUploadStatus('error');
        setIsUploading(false);
        return;
      } else {
        setStatusMessage('Unsupported file type. Please upload a .txt, .pdf, or .docx file.');
        setUploadStatus('error');
        setIsUploading(false);
        return;
      }

      // Extract data from text
      const extractedData = extractDataFromText(text);

      // Update the CV store with extracted data
      if (extractedData.personalInfo && Object.keys(extractedData.personalInfo).length > 0) {
        updatePersonalInfo(extractedData.personalInfo);
      }

      if (extractedData.profile.summary) {
        updateProfile(extractedData.profile);
      }

      if (extractedData.skills.technical.length > 0) {
        updateSkills(extractedData.skills);
      }

      setStatusMessage(
        `Successfully imported resume! Found: ${
          Object.keys(extractedData.personalInfo).length
        } personal details, ${
          extractedData.skills.technical.length
        } skills${extractedData.profile.summary ? ', and profile summary' : ''}.`
      );
      setUploadStatus('success');
    } catch (error) {
      console.error('Error parsing file:', error);
      setStatusMessage(`Error parsing file: ${error.message}`);
      setUploadStatus('error');
    } finally {
      setIsUploading(false);
      // Reset file input
      event.target.value = '';
    }
  }, [updatePersonalInfo, updateProfile, updateSkills]);

  return (
    <div className="space-y-6">
      <div className="border-b pb-3 mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Import Resume</h2>
        <p className="text-sm text-gray-600 mt-1">
          Upload your existing resume to automatically fill out the form
        </p>
      </div>

      <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <div className="space-y-4">
          <div className="flex justify-center">
            <svg
              className="h-12 w-12 text-gray-400"
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
            <h3 className="text-lg font-medium text-gray-900">
              {isUploading ? 'Processing...' : 'Upload your resume'}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Support for .txt files (PDF and DOCX coming soon)
            </p>
          </div>

          <div className="flex justify-center">
            <label htmlFor="file-upload" className="cursor-pointer">
              <Button
                as="span"
                disabled={isUploading}
                className="inline-flex items-center"
              >
                {isUploading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Choose File'
                )}
              </Button>
            </label>
            <input
              id="file-upload"
              name="file-upload"
              type="file"
              accept=".txt,.pdf,.docx"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="hidden"
            />
          </div>
        </div>
      </div>

      {/* Status Messages */}
      {uploadStatus && (
        <div
          className={`p-4 rounded-lg border ${
            uploadStatus === 'success'
              ? 'bg-green-50 border-green-200 text-green-700'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {uploadStatus === 'success' ? (
                <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm">{statusMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
        <h3 className="font-medium text-amber-900 mb-2">📋 How to prepare your resume for import</h3>
        <div className="text-sm text-amber-700 space-y-2">
          <p><strong>For best results:</strong></p>
          <ul className="space-y-1 ml-4">
            <li>• Save your resume as a plain text file (.txt) for now</li>
            <li>• Ensure contact information (email, phone) is clearly visible</li>
            <li>• Use standard section headers like "SKILLS", "EXPERIENCE", "EDUCATION"</li>
            <li>• Remove any special formatting or complex layouts</li>
            <li>• Review and edit the imported data after upload</li>
          </ul>
          <p className="mt-3">
            <strong>Note:</strong> PDF and DOCX support will be added in a future update.
            This feature is currently in beta and works best with simple text formats.
          </p>
        </div>
      </div>
    </div>
  );
};