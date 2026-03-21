import React, { useState, useEffect } from 'react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { useCVStore } from '../../store/cvStore';
import { localShareService } from '../../utils/localShareService';

export const ShareManager = () => {
  const [shareData, setShareData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [shares, setShares] = useState({});
  const [shareStatus, setShareStatus] = useState({ type: null, message: '' });

  const cvData = useCVStore();

  // Load existing shares on component mount
  useEffect(() => {
    const existingShares = localShareService.getShares();
    setShares(existingShares);
  }, []);

  // Generate share link
  const generateShareLink = async () => {
    setIsLoading(true);
    setShareStatus({ type: null, message: '' });

    try {
      const result = localShareService.generateShareLink(cvData);

      if (result.success) {
        setShareData(result.data);
        setShareStatus({
          type: 'success',
          message: 'Share link generated successfully!'
        });

        // Update local shares list
        const updatedShares = localShareService.getShares();
        setShares(updatedShares);
      } else {
        throw new Error(result.error);
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

  // Remove share link
  const removeShareLink = async () => {
    if (!shareData?.shareId) return;

    setIsLoading(true);
    setShareStatus({ type: null, message: '' });

    try {
      const result = localShareService.removeShare(shareData.shareId);

      if (result.success) {
        setShareData(null);
        setShareStatus({
          type: 'success',
          message: 'Share link removed successfully'
        });

        // Update local shares list
        const updatedShares = localShareService.getShares();
        setShares(updatedShares);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      setShareStatus({
        type: 'error',
        message: `Failed to remove share link: ${error.message}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Copy share link to clipboard
  const copyShareLink = async () => {
    if (!shareData?.shareUrl) return;

    try {
      const result = await localShareService.copyToClipboard(shareData.shareUrl);

      if (result.success) {
        setShareStatus({
          type: 'success',
          message: 'Share link copied to clipboard!'
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      setShareStatus({
        type: 'error',
        message: 'Failed to copy link. Please copy manually.'
      });
    }
  };

  // Get current share if any
  const currentShare = shareData || Object.values(shares)[0] || null;

  return (
    <div className="space-y-6">
      <div className="border-b pb-3 mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Share Your CV</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Create a shareable link to your CV that works instantly - no server required!
        </p>
      </div>

      {/* Local sharing info */}
      <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
        <div className="w-3 h-3 rounded-full bg-blue-500" />
        <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
          ✨ Local sharing enabled - works offline!
        </span>
      </div>

      <div className="space-y-4">
        {/* Share Options */}
        {!currentShare ? (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <h3 className="font-medium text-green-900 dark:text-green-200 mb-2">🔗 Create Share Link</h3>
              <p className="text-sm text-green-700 dark:text-green-300 mb-3">
                Generate a link that contains your CV data. Perfect for:
              </p>
              <ul className="text-sm text-green-700 dark:text-green-300 space-y-1 mb-4">
                <li>• Sharing with potential employers</li>
                <li>• Including in email signatures</li>
                <li>• Adding to social media profiles</li>
                <li>• Embedding in portfolios or websites</li>
                <li>• Works without internet connection!</li>
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
                  value={currentShare.shareUrl}
                  readOnly
                  className="flex-1 text-xs"
                />
                <Button onClick={copyShareLink} size="sm">
                  Copy
                </Button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Share ID: {currentShare.shareId} | Created: {new Date(currentShare.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* Share Actions */}
            <div className="flex gap-3">
              <Button
                onClick={() => window.open(currentShare.shareUrl, '_blank')}
                variant="outline"
                className="flex-1"
              >
                Preview
              </Button>
              <Button
                onClick={removeShareLink}
                variant="danger"
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? 'Removing...' : 'Remove Link'}
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

      {/* Sharing Tips */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
        <h3 className="font-medium text-yellow-900 dark:text-yellow-200 mb-2">💡 How Local Sharing Works</h3>
        <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
          <li>• Your CV data is encoded directly into the URL - no server needed!</li>
          <li>• Links work offline and don't require any external services</li>
          <li>• Your data stays private - it's not stored on any server</li>
          <li>• Recipients can view your CV in any modern web browser</li>
          <li>• Links are permanent but regenerate when your CV changes</li>
          <li>• Be mindful of URL length limits in some messaging platforms</li>
        </ul>
      </div>
    </div>
  );
};