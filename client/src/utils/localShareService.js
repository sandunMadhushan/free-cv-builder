// Local sharing service that works without backend
import { nanoid } from 'nanoid';

class LocalShareService {
  constructor() {
    this.storageKey = 'cv-shares';
  }

  // Generate a shareable URL with CV data and styling encoded
  generateShareLink(cvData, themeData = {}, templateData = {}) {
    try {
      // Create a unique share ID
      const shareId = nanoid(10);

      // Clean up CV data (remove empty sections, etc.)
      const cleanCVData = this._cleanCVData(cvData);

      // Create complete share package with styling
      const sharePackage = {
        cv: cleanCVData,
        theme: themeData,
        template: templateData,
        version: '1.0'
      };

      // Compress and encode complete package
      const encodedData = this._encodeData(sharePackage);

      // Create share URL with data as a parameter
      const baseUrl = window.location.origin + window.location.pathname;
      const shareUrl = `${baseUrl}?share=${shareId}&data=${encodedData}`;

      // Store share info locally for management
      this.saveShareInfo(shareId, {
        id: shareId,
        createdAt: new Date().toISOString(),
        title: cleanCVData.personalInfo?.fullName || 'Untitled CV',
        shareUrl: shareUrl,
        hasTheme: Object.keys(themeData).length > 0,
        hasTemplate: Object.keys(templateData).length > 0
      });

      return {
        success: true,
        data: {
          shareId: shareId,
          shareUrl: shareUrl,
          createdAt: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Failed to generate share link:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Clean CSV data (public method for external use)
  cleanCVData(cvData) {
    const cleaned = { ...cvData };

    // Remove store methods and only keep data
    const dataOnly = {
      personalInfo: cleaned.personalInfo || {},
      profile: cleaned.profile || {},
      experience: cleaned.experience || [],
      education: cleaned.education || [],
      skills: cleaned.skills || {},
      projects: cleaned.projects || [],
      certifications: cleaned.certifications || [],
      languages: cleaned.languages || [],
      activeSections: cleaned.activeSections || {},
      sectionOrder: cleaned.sectionOrder || []
    };

    // Filter out empty arrays and objects
    Object.keys(dataOnly).forEach(key => {
      if (Array.isArray(dataOnly[key]) && dataOnly[key].length === 0) {
        delete dataOnly[key];
      } else if (typeof dataOnly[key] === 'object' && Object.keys(dataOnly[key]).length === 0) {
        delete dataOnly[key];
      }
    });

    return dataOnly;
  }

  // Internal clean CV data (keeping for backward compatibility)
  _cleanCVData(cvData) {
    return this.cleanCVData(cvData);
  }

  // Encode complete data package for URL (public method)
  encodeData(data) {
    try {
      const jsonString = JSON.stringify(data);
      // Use base64 encoding
      return btoa(encodeURIComponent(jsonString));
    } catch (error) {
      throw new Error('Failed to encode share data');
    }
  }

  // Internal encode function (keeping for backward compatibility)
  _encodeData(data) {
    return this.encodeData(data);
  }

  // Decode complete data package from URL
  decodeData(encodedData) {
    try {
      const jsonString = decodeURIComponent(atob(encodedData));
      return JSON.parse(jsonString);
    } catch (error) {
      throw new Error('Failed to decode share data');
    }
  }

  // Load complete CV data and styling from URL parameters
  loadSharedCV() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const shareId = urlParams.get('share');
      const encodedData = urlParams.get('data');

      if (!shareId || !encodedData) {
        return null;
      }

      const sharePackage = this.decodeData(encodedData);

      // Handle backwards compatibility with old format
      if (!sharePackage.version) {
        // Old format - just CV data
        return {
          shareId: shareId,
          data: {
            cv: sharePackage,
            theme: {},
            template: {}
          }
        };
      }

      // New format - complete package
      return {
        shareId: shareId,
        data: sharePackage
      };
    } catch (error) {
      console.error('Failed to load shared CV:', error);
      return null;
    }
  }

  // Save share information to localStorage
  saveShareInfo(shareId, shareInfo) {
    try {
      const shares = this.getShares();
      shares[shareId] = shareInfo;
      localStorage.setItem(this.storageKey, JSON.stringify(shares));
    } catch (error) {
      console.error('Failed to save share info:', error);
    }
  }

  // Get all shares from localStorage
  getShares() {
    try {
      const shares = localStorage.getItem(this.storageKey);
      return shares ? JSON.parse(shares) : {};
    } catch (error) {
      console.error('Failed to get shares:', error);
      return {};
    }
  }

  // Remove a share
  removeShare(shareId) {
    try {
      const shares = this.getShares();
      delete shares[shareId];
      localStorage.setItem(this.storageKey, JSON.stringify(shares));
      return { success: true };
    } catch (error) {
      console.error('Failed to remove share:', error);
      return { success: false, error: error.message };
    }
  }

  // Get share by ID
  getShare(shareId) {
    try {
      const shares = this.getShares();
      return shares[shareId] || null;
    } catch (error) {
      console.error('Failed to get share:', error);
      return null;
    }
  }

  // Copy to clipboard helper
  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return { success: true };
    } catch (error) {
      // Fallback for older browsers
      try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        return { success: true };
      } catch (fallbackError) {
        return { success: false, error: 'Failed to copy to clipboard' };
      }
    }
  }

  // Health check (always returns true for local service)
  async healthCheck() {
    return true;
  }

  // Check if current URL is a shared CV
  isSharedCV() {
    const urlParams = new URLSearchParams(window.location.search);
    return !!(urlParams.get('share') && urlParams.get('data'));
  }

  // Clear URL parameters after loading shared CV
  clearShareParams() {
    const url = new URL(window.location);
    url.searchParams.delete('share');
    url.searchParams.delete('data');
    window.history.replaceState({}, document.title, url.pathname);
  }
}

export const localShareService = new LocalShareService();