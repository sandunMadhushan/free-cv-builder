/**
 * Online Sharing System for CV Builder
 * Provides shareable links, QR codes, and social media integration
 */

import QRCode from 'qrcode';

/**
 * Sharing System Class
 */
export class CVSharingSystem {
  constructor() {
    this.baseURL = window.location.origin;
    this.shareEndpoint = '/api/share';
  }

  /**
   * Generate shareable link for CV
   */
  async generateShareableLink(cvData, options = {}) {
    try {
      const shareId = this.generateShareId();
      const shareData = {
        id: shareId,
        cvData,
        options: {
          expiresIn: options.expiresIn || '30d', // 30 days default
          password: options.password || null,
          allowDownload: options.allowDownload !== false,
          allowCopy: options.allowCopy !== false,
          analytics: options.analytics !== false,
          customDomain: options.customDomain || null
        },
        metadata: {
          createdAt: new Date().toISOString(),
          createdBy: cvData.personalInfo?.fullName || 'Anonymous',
          views: 0,
          downloads: 0
        }
      };

      // Store share data (for now in localStorage, in production use backend)
      this.storeShareData(shareId, shareData);

      const shareURL = `${this.baseURL}/share/${shareId}`;

      return {
        success: true,
        shareId,
        shareURL,
        qrCode: await this.generateQRCode(shareURL),
        shortURL: await this.generateShortURL(shareURL),
        socialLinks: this.generateSocialMediaLinks(shareURL, cvData),
        embedCode: this.generateEmbedCode(shareId),
        analytics: {
          viewsURL: `${this.baseURL}/analytics/${shareId}`,
          enabled: options.analytics !== false
        }
      };
    } catch (error) {
      console.error('Share link generation failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Generate QR Code for sharing
   */
  async generateQRCode(url, options = {}) {
    try {
      const qrOptions = {
        width: options.size || 256,
        margin: options.margin || 2,
        color: {
          dark: options.darkColor || '#000000',
          light: options.lightColor || '#FFFFFF'
        },
        errorCorrectionLevel: 'M'
      };

      const qrDataURL = await QRCode.toDataURL(url, qrOptions);

      return {
        dataURL: qrDataURL,
        downloadURL: this.generateQRDownloadLink(qrDataURL),
        sharing: {
          whatsapp: `https://wa.me/?text=Check out my resume: ${encodeURIComponent(url)}`,
          email: `mailto:?subject=My Professional Resume&body=Please check out my resume: ${encodeURIComponent(url)}`,
          sms: `sms:?body=Check out my resume: ${encodeURIComponent(url)}`
        }
      };
    } catch (error) {
      console.error('QR code generation failed:', error);
      throw new Error(`QR code generation failed: ${error.message}`);
    }
  }

  /**
   * Generate social media sharing links
   */
  generateSocialMediaLinks(url, cvData) {
    const name = cvData.personalInfo?.fullName || 'Professional';
    const title = `${name}'s Professional Resume`;
    const description = cvData.profile?.summary?.substring(0, 100) || `Check out ${name}'s professional resume and portfolio`;

    return {
      linkedin: {
        url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
        text: `Share on LinkedIn`,
        icon: 'linkedin'
      },
      twitter: {
        url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
        text: 'Share on Twitter',
        icon: 'twitter'
      },
      facebook: {
        url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        text: 'Share on Facebook',
        icon: 'facebook'
      },
      whatsapp: {
        url: `https://wa.me/?text=${encodeURIComponent(`${title} - ${url}`)}`,
        text: 'Share via WhatsApp',
        icon: 'whatsapp'
      },
      telegram: {
        url: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
        text: 'Share on Telegram',
        icon: 'telegram'
      },
      email: {
        url: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${description}\n\nView resume: ${url}`)}`,
        text: 'Share via Email',
        icon: 'email'
      },
      copy: {
        url: url,
        text: 'Copy Link',
        icon: 'copy'
      }
    };
  }

  /**
   * Generate embed code for websites
   */
  generateEmbedCode(shareId, options = {}) {
    const width = options.width || '100%';
    const height = options.height || '600px';
    const theme = options.theme || 'light';

    return {
      iframe: `<iframe src="${this.baseURL}/embed/${shareId}?theme=${theme}" width="${width}" height="${height}" frameborder="0" allowfullscreen></iframe>`,
      responsive: `<div style="position: relative; padding-bottom: 75%; height: 0; overflow: hidden;">
  <iframe src="${this.baseURL}/embed/${shareId}?theme=${theme}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" frameborder="0" allowfullscreen></iframe>
</div>`,
      widget: `<script async src="${this.baseURL}/js/cv-widget.js" data-cv-id="${shareId}" data-theme="${theme}"></script>`
    };
  }

  /**
   * Create portfolio website
   */
  async generatePortfolioWebsite(portfolioData) {
    try {
      const { personalInfo, resumes, projects, settings } = portfolioData;

      const portfolioId = this.generateShareId();
      const portfolioURL = `${this.baseURL}/portfolio/${portfolioId}`;

      const portfolioConfig = {
        id: portfolioId,
        personalInfo,
        resumes: resumes.map(resume => ({
          id: resume.id,
          title: resume.title,
          description: resume.description,
          shareId: resume.shareId,
          featured: resume.featured || false
        })),
        projects: projects || [],
        settings: {
          theme: settings?.theme || 'professional',
          customDomain: settings?.customDomain || null,
          analytics: settings?.analytics !== false,
          seo: {
            title: `${personalInfo?.fullName} - Professional Portfolio`,
            description: `Professional portfolio of ${personalInfo?.fullName}. View resumes, projects, and professional experience.`,
            keywords: [
              personalInfo?.fullName,
              'portfolio',
              'resume',
              'professional',
              ...(personalInfo?.keywords || [])
            ].join(', ')
          }
        },
        metadata: {
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
          views: 0
        }
      };

      // Store portfolio data
      this.storePortfolioData(portfolioId, portfolioConfig);

      return {
        success: true,
        portfolioId,
        portfolioURL,
        qrCode: await this.generateQRCode(portfolioURL),
        socialLinks: this.generateSocialMediaLinks(portfolioURL, { personalInfo }),
        embedCode: this.generateEmbedCode(portfolioId, { type: 'portfolio' }),
        customization: {
          themeEditorURL: `${this.baseURL}/portfolio/${portfolioId}/edit`,
          domainSetupURL: `${this.baseURL}/portfolio/${portfolioId}/domain`,
          analyticsURL: `${this.baseURL}/portfolio/${portfolioId}/analytics`
        }
      };
    } catch (error) {
      console.error('Portfolio generation failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Track sharing analytics
   */
  async trackShareEvent(shareId, eventType, metadata = {}) {
    try {
      const event = {
        shareId,
        eventType, // 'view', 'download', 'share', 'copy'
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        referrer: document.referrer,
        metadata
      };

      // Store analytics (in production, send to analytics service)
      const analytics = this.getAnalytics(shareId) || [];
      analytics.push(event);
      localStorage.setItem(`cv_share_analytics_${shareId}`, JSON.stringify(analytics));

      return { success: true, event };
    } catch (error) {
      console.error('Analytics tracking failed:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get sharing analytics
   */
  getShareAnalytics(shareId) {
    try {
      const analytics = this.getAnalytics(shareId) || [];

      const summary = {
        totalViews: analytics.filter(e => e.eventType === 'view').length,
        totalDownloads: analytics.filter(e => e.eventType === 'download').length,
        totalShares: analytics.filter(e => e.eventType === 'share').length,
        totalCopies: analytics.filter(e => e.eventType === 'copy').length,
        lastViewed: analytics.length > 0 ? analytics[analytics.length - 1].timestamp : null,
        topReferrers: this.getTopReferrers(analytics),
        dailyViews: this.getDailyViews(analytics),
        deviceTypes: this.getDeviceTypes(analytics)
      };

      return {
        success: true,
        shareId,
        summary,
        events: analytics
      };
    } catch (error) {
      console.error('Analytics retrieval failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Helper methods
  generateShareId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  storeShareData(shareId, data) {
    localStorage.setItem(`cv_share_${shareId}`, JSON.stringify(data));
  }

  getShareData(shareId) {
    const data = localStorage.getItem(`cv_share_${shareId}`);
    return data ? JSON.parse(data) : null;
  }

  storePortfolioData(portfolioId, data) {
    localStorage.setItem(`cv_portfolio_${portfolioId}`, JSON.stringify(data));
  }

  getPortfolioData(portfolioId) {
    const data = localStorage.getItem(`cv_portfolio_${portfolioId}`);
    return data ? JSON.parse(data) : null;
  }

  getAnalytics(shareId) {
    const data = localStorage.getItem(`cv_share_analytics_${shareId}`);
    return data ? JSON.parse(data) : [];
  }

  generateQRDownloadLink(qrDataURL) {
    return qrDataURL; // Can be enhanced to create actual download
  }

  async generateShortURL(url) {
    // Placeholder for URL shortening service integration
    return url.length > 50 ? url.substring(0, 47) + '...' : url;
  }

  getTopReferrers(analytics) {
    const referrers = {};
    analytics.forEach(event => {
      const referrer = event.referrer || 'Direct';
      referrers[referrer] = (referrers[referrer] || 0) + 1;
    });
    return Object.entries(referrers)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([referrer, count]) => ({ referrer, count }));
  }

  getDailyViews(analytics) {
    const dailyViews = {};
    analytics
      .filter(e => e.eventType === 'view')
      .forEach(event => {
        const date = new Date(event.timestamp).toISOString().split('T')[0];
        dailyViews[date] = (dailyViews[date] || 0) + 1;
      });
    return Object.entries(dailyViews)
      .sort((a, b) => new Date(a[0]) - new Date(b[0]))
      .map(([date, views]) => ({ date, views }));
  }

  getDeviceTypes(analytics) {
    const devices = {};
    analytics.forEach(event => {
      const ua = event.userAgent || '';
      const deviceType = /Mobile|Android|iPhone|iPad/.test(ua) ? 'Mobile' : 'Desktop';
      devices[deviceType] = (devices[deviceType] || 0) + 1;
    });
    return devices;
  }
}

// Create default instance
export const sharingSystem = new CVSharingSystem();

/**
 * Sharing utilities
 */
export const SharingUtils = {
  /**
   * Copy text to clipboard
   */
  async copyToClipboard(text) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        return { success: true };
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const result = document.execCommand('copy');
        textArea.remove();
        return { success: result };
      }
    } catch (error) {
      console.error('Copy failed:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Download data as file
   */
  downloadAsFile(content, filename, mimeType = 'text/plain') {
    try {
      const blob = new Blob([content], { type: mimeType });
      const link = document.createElement('a');
      link.download = filename;
      link.href = URL.createObjectURL(blob);
      link.click();
      setTimeout(() => URL.revokeObjectURL(link.href), 1000);
      return { success: true };
    } catch (error) {
      console.error('Download failed:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Open social share window
   */
  openShareWindow(url, width = 600, height = 400) {
    const left = (screen.width / 2) - (width / 2);
    const top = (screen.height / 2) - (height / 2);

    window.open(
      url,
      'shareWindow',
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
    );
  }
};

export default { CVSharingSystem, sharingSystem, SharingUtils };