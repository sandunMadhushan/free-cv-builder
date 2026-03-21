import React, { useState, useEffect } from 'react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { useCVStore } from '../../store/cvStore';
import { apiService } from '../../utils/apiService';

export const ShareManager = () => {
  const [shareData, setShareData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [cloudCVId, setCloudCVId] = useState(null);
  const [shareStatus, setShareStatus] = useState({ type: null, message: '' });

  const cvData = useCVStore();

  // Check if backend is available
  useEffect(() => {
    const checkBackendConnection = async () => {
      const online = await apiService.healthCheck();
      setIsOnline(online);
    };

    checkBackendConnection();

    // Check every 30 seconds
    const interval = setInterval(checkBackendConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  // Save CV to cloud
  const saveToCloud = async () => {
    setIsLoading(true);
    setShareStatus({ type: null, message: '' });

    try {
      const result = await apiService.saveCV(cvData);

      if (result.success) {
        setCloudCVId(result.data._id);
        setShareStatus({
          type: 'success',
          message: 'CV saved to cloud successfully!'
        });
      }
    } catch (error) {
      setShareStatus({
        type: 'error',
        message: `Failed to save CV: ${error.message}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Make CV public and get share link
  const generateShareLink = async () => {
    if (!cloudCVId) {
      await saveToCloud();
      return;
    }

    setIsLoading(true);
    setShareStatus({ type: null, message: '' });

    try {
      const result = await apiService.makePublic(cloudCVId);

      if (result.success) {
        setShareData(result.data);
        setShareStatus({
          type: 'success',
          message: 'Share link generated successfully!'
        });
      }
    } catch (error) {
      setShareStatus({
        type: 'error',
        message: `Failed to generate share link: ${error.message}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Make CV private
  const makePrivate = async () => {
    if (!cloudCVId) return;

    setIsLoading(true);
    setShareStatus({ type: null, message: '' });

    try {
      const result = await apiService.makePrivate(cloudCVId);

      if (result.success) {
        setShareData(null);
        setShareStatus({
          type: 'success',
          message: 'CV is now private'
        });
      }
    } catch (error) {
      setShareStatus({
        type: 'error',
        message: `Failed to make CV private: ${error.message}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Copy share link to clipboard
  const copyShareLink = async () => {
    if (!shareData?.shareUrl) return;

    try {
      await navigator.clipboard.writeText(shareData.shareUrl);
      setShareStatus({
        type: 'success',
        message: 'Share link copied to clipboard!'
      });
    } catch (error) {
      setShareStatus({
        type: 'error',
        message: 'Failed to copy link. Please copy manually.'
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b pb-3 mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Share Your CV</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Create a public link to share your CV with anyone
        </p>
      </div>

      {/* Backend Status */}
      <div className={`flex items-center gap-3 p-3 rounded-lg ${
        isOnline
          ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
          : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
      }`}>
        <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
        <span className={`text-sm font-medium ${
          isOnline ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'
        }`}>
          {isOnline ? 'Connected to cloud services' : 'Cloud services unavailable'}
        </span>
      </div>

      {!isOnline ? (
        <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
          <div className="space-y-3">
            <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 48 48">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M34 18v6a2 2 0 01-2 2H8a2 2 0 01-2-2v-6M34 6H8a2 2 0 00-2 2v4h28V8a2 2 0 00-2-2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Cloud Services Offline</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Unable to connect to cloud services. Please check your internet connection or try again later.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Share Options */}
          {!shareData ? (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="font-medium text-blue-900 dark:text-blue-200 mb-2">📤 Create Share Link</h3>
                <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                  Generate a public link that allows anyone to view your CV online. Perfect for:
                </p>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1 mb-4">
                  <li>• Sharing with potential employers</li>
                  <li>• Including in email signatures</li>
                  <li>• Adding to social media profiles</li>
                  <li>• Embedding in portfolios or websites</li>
                </ul>
              </div>

              <Button
                onClick={generateShareLink}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Generating...' : 'Generate Share Link'}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Share Link Display */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Your CV Share Link
                </label>
                <div className="flex gap-2">
                  <Input
                    value={shareData.shareUrl}
                    readOnly
                    className="flex-1"
                  />
                  <Button onClick={copyShareLink} size="sm">
                    Copy
                  </Button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Share ID: {shareData.shareId}
                </p>
              </div>

              {/* Share Actions */}
              <div className="flex gap-3">
                <Button
                  onClick={() => window.open(shareData.shareUrl, '_blank')}
                  variant="outline"
                  className="flex-1"
                >
                  Preview
                </Button>
                <Button
                  onClick={makePrivate}
                  variant="danger"
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? 'Updating...' : 'Make Private'}
                </Button>
              </div>
            </div>
          )}

          {/* Status Message */}
          {shareStatus.type && (
            <div
              className={`p-4 rounded-lg border ${
                shareStatus.type === 'success'
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200'
                  : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
              }`}
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {shareStatus.type === 'success' ? (
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-sm">{shareStatus.message}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Sharing Tips */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
        <h3 className="font-medium text-yellow-900 dark:text-yellow-200 mb-2">💡 Sharing Tips</h3>
        <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
          <li>• Your CV will be publicly accessible to anyone with the link</li>
          <li>• Update your CV anytime - the share link will always show the latest version</li>
          <li>• You can make your CV private at any time to disable the share link</li>
          <li>• The link is permanent and won't change unless you regenerate it</li>
          <li>• Consider what personal information you're comfortable sharing publicly</li>
        </ul>
      </div>
    </div>
  );
};