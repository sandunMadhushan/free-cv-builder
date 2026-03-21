// Local sharing service that works without backend
import { nanoid } from 'nanoid';

class LocalShareService {
  constructor() {
    this.storageKey = 'cv-shares';
  }

  // Generate a shareable URL with CV data encoded
  generateShareLink(cvData) {
    try {
      // Create a unique share ID
      const shareId = nanoid(10);

      // Clean up CV data (remove empty sections, etc.)
      const cleanData = this.cleanCVData(cvData);

      // Compress and encode CV data
      const encodedData = this.encodeData(cleanData);

      // Create share URL with data as a parameter
      const baseUrl = window.location.origin + window.location.pathname;
      const shareUrl = `${baseUrl}?share=${shareId}&data=${encodedData}`;

      // Store share info locally for management
      this.saveShareInfo(shareId, {
        id: shareId,
        createdAt: new Date().toISOString(),
        title: cleanData.personalInfo?.fullName || 'Untitled CV',
        shareUrl: shareUrl
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

  // Clean CV data by removing empty sections and unnecessary data
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

  // Encode CV data for URL
  encodeData(data) {
    try {
      const jsonString = JSON.stringify(data);
      // Use base64 encoding
      return btoa(encodeURIComponent(jsonString));
    } catch (error) {
      throw new Error('Failed to encode CV data');
    }
  }

  // Decode CV data from URL
  decodeData(encodedData) {
    try {
      const jsonString = decodeURIComponent(atob(encodedData));
      return JSON.parse(jsonString);
    } catch (error) {
      throw new Error('Failed to decode CV data');
    }
  }

  // Load CV data from URL parameters
  loadSharedCV() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const shareId = urlParams.get('share');
      const encodedData = urlParams.get('data');

      if (!shareId || !encodedData) {
        return null;
      }

      const cvData = this.decodeData(encodedData);
      return {
        shareId: shareId,
        data: cvData
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