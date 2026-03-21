import React, { useState, useEffect } from "react";
import { Button } from "../common/Button";
import { Input } from "../common/Input";
import { useCVStore } from "../../store/cvStore";
import { useThemeStore } from "../../store/themeStore";
import { useTemplateStore } from "../../store/templateStore";
import { localShareService } from "../../utils/localShareService";

export const ShareManager = () => {
  const [shareData, setShareData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [shares, setShares] = useState({});
  const [shareStatus, setShareStatus] = useState({ type: null, message: "" });
  const [hasChanges, setHasChanges] = useState(false);

  const cvData = useCVStore();
  const themeData = useThemeStore();
  const templateData = useTemplateStore();

  // Get current data for comparison
  const getCurrentShareData = () => {
    return {
      cv: localShareService.cleanCVData(cvData),
      theme: {
        isDark: themeData.isDark,
        theme: themeData.theme,
        previewIsDark: themeData.previewIsDark,
        previewTheme: themeData.previewTheme,
      },
      template: {
        selectedTemplate: templateData.selectedTemplate,
        customization: templateData.customization,
        showPhoto: templateData.showPhoto,
        pageSize: templateData.pageSize,
      },
    };
  };

  // Check if current data differs from existing share
  const detectChanges = () => {
    const currentShare = shareData || Object.values(shares)[0] || null;
    if (!currentShare?.shareUrl) {
      setHasChanges(false);
      return;
    }

    try {
      // Extract data from existing share URL
      const urlParams = new URLSearchParams(
        new URL(currentShare.shareUrl).search,
      );
      const encodedData = urlParams.get("data");
      if (!encodedData) {
        setHasChanges(true);
        return;
      }

      const existingData = localShareService.decodeData(encodedData);
      const currentData = getCurrentShareData();

      // Compare the data
      const existingString = JSON.stringify(existingData);
      const currentString = JSON.stringify({ ...currentData, version: "1.0" });

      setHasChanges(existingString !== currentString);
    } catch (error) {
      console.error("Error detecting changes:", error);
      setHasChanges(true); // Assume changes if we can't detect
    }
  };

  // Load existing shares and detect changes
  useEffect(() => {
    const existingShares = localShareService.getShares();
    setShares(existingShares);
    detectChanges();
  }, []);

  // Detect changes whenever CV data changes
  useEffect(() => {
    detectChanges();
  }, [cvData, themeData, templateData, shareData, shares]);

  // Generate share link
  const generateShareLink = async () => {
    setIsLoading(true);
    setShareStatus({ type: null, message: "" });

    try {
      // Extract only the data we need from stores (remove functions)
      const cleanThemeData = {
        isDark: themeData.isDark,
        theme: themeData.theme,
        previewIsDark: themeData.previewIsDark,
        previewTheme: themeData.previewTheme,
      };

      const cleanTemplateData = {
        selectedTemplate: templateData.selectedTemplate,
        customization: templateData.customization,
        showPhoto: templateData.showPhoto,
        pageSize: templateData.pageSize,
      };

      const result = localShareService.generateShareLink(
        cvData,
        cleanThemeData,
        cleanTemplateData,
      );

      if (result.success) {
        setShareData(result.data);
        setHasChanges(false); // Reset change detection since we just created a fresh link
        setShareStatus({
          type: "success",
          message:
            "🎉 Share link generated successfully with complete styling preserved!",
        });

        // Update local shares list
        const updatedShares = localShareService.getShares();
        setShares(updatedShares);

        // Clear status after 4 seconds
        setTimeout(() => {
          setShareStatus({ type: null, message: "" });
        }, 4000);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      setShareStatus({
        type: "error",
        message: `Failed to generate share link: ${error.message}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Remove share link
  const removeShareLink = async () => {
    const currentShare = shareData || Object.values(shares)[0] || null;
    if (!currentShare?.shareId) return;

    setIsLoading(true);
    setShareStatus({ type: null, message: "" });

    try {
      const result = localShareService.removeShare(currentShare.shareId);

      if (result.success) {
        setShareData(null);
        setShareStatus({
          type: "success",
          message: "Share link removed successfully!",
        });

        // Update local shares list and reset change detection
        const updatedShares = localShareService.getShares();
        setShares(updatedShares);
        setHasChanges(false);

        // Clear status after 3 seconds
        setTimeout(() => {
          setShareStatus({ type: null, message: "" });
        }, 3000);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      setShareStatus({
        type: "error",
        message: `Failed to remove share link: ${error.message}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Generate temporary preview with latest CV data
  const generateLivePreview = async () => {
    try {
      const currentData = getCurrentShareData();

      // Generate temporary share package
      const sharePackage = {
        ...currentData,
        version: "1.0",
      };

      const encodedData = localShareService.encodeData(sharePackage);
      const baseUrl = window.location.origin + window.location.pathname;
      const tempUrl = `${baseUrl}?share=preview&data=${encodedData}`;

      window.open(tempUrl, "_blank");

      setShareStatus({
        type: "success",
        message: "Live preview opened with your current CV!",
      });

      // Clear status after 3 seconds
      setTimeout(() => {
        setShareStatus({ type: null, message: "" });
      }, 3000);
    } catch (error) {
      setShareStatus({
        type: "error",
        message: "Failed to open preview. Please try again.",
      });
    }
  };

  // Update existing share link with current data
  const updateShareLink = async () => {
    const currentShare = shareData || Object.values(shares)[0] || null;
    if (!currentShare?.shareId) return;

    if (!hasChanges) {
      setShareStatus({
        type: "success",
        message: "Your share link is already up to date! No changes detected.",
      });
      setTimeout(() => {
        setShareStatus({ type: null, message: "" });
      }, 4000);
      return;
    }

    setIsLoading(true);
    setShareStatus({ type: null, message: "" });

    try {
      // Remove old share
      localShareService.removeShare(currentShare.shareId);

      // Generate new share with current data
      const currentData = getCurrentShareData();
      const result = localShareService.generateShareLink(
        cvData,
        currentData.theme,
        currentData.template,
      );

      if (result.success) {
        setShareData(result.data);
        setHasChanges(false); // Reset change detection
        setShareStatus({
          type: "success",
          message:
            "🎉 Share link updated successfully with all your latest changes!",
        });

        // Update local shares list
        const updatedShares = localShareService.getShares();
        setShares(updatedShares);

        // Clear status after 5 seconds for success message
        setTimeout(() => {
          setShareStatus({ type: null, message: "" });
        }, 5000);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      setShareStatus({
        type: "error",
        message: `Failed to update share link: ${error.message}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Copy share link to clipboard
  const copyShareLink = async () => {
    const currentShare = shareData || Object.values(shares)[0] || null;
    if (!currentShare?.shareUrl) return;

    try {
      const result = await localShareService.copyToClipboard(
        currentShare.shareUrl,
      );

      if (result.success) {
        setShareStatus({
          type: "success",
          message: "📋 Share link copied to clipboard!",
        });

        // Clear status after 3 seconds
        setTimeout(() => {
          setShareStatus({ type: null, message: "" });
        }, 3000);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      setShareStatus({
        type: "error",
        message: "Failed to copy link. Please copy manually.",
      });
    }
  };

  // Get current share if any
  const currentShare = shareData || Object.values(shares)[0] || null;

  return (
    <div className="space-y-6">
      <div className="border-b pb-3 mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Share Your CV
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Create a shareable link to your CV that works instantly - no server
          required!
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
              <h3 className="font-medium text-green-900 dark:text-green-200 mb-2">
                🔗 Create Share Link
              </h3>
              <p className="text-sm text-green-700 dark:text-green-300 mb-3">
                Generate a link that contains your CV data. Perfect for:
              </p>
              <ul className="text-sm text-green-700 dark:text-green-300 space-y-1 mb-4">
                <li>• Sharing with potential employers</li>
                <li>• Including in email signatures</li>
                <li>• Adding to social media profiles</li>
                <li>• Embedding in portfolios or websites</li>
                <li>
                  • <strong>Preserves exact colors and template!</strong>
                </li>
                <li>• Works without internet connection!</li>
              </ul>
            </div>

            <Button
              onClick={generateShareLink}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Generating..." : "Generate Share Link"}
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
                Share ID: {currentShare.shareId} | Created:{" "}
                {new Date(currentShare.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* Update notification - only show if there are changes */}
            {hasChanges ? (
              <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 text-amber-600 dark:text-amber-400 mr-2 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    <strong>Changes detected!</strong> Click "Update Link" to
                    include your latest changes
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 text-green-600 dark:text-green-400 mr-2 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    <strong>All up to date!</strong> Your share link includes
                    all current changes
                  </p>
                </div>
              </div>
            )}

            {/* Share Actions */}
            <div
              className={
                hasChanges ? "grid grid-cols-2 gap-3" : "grid grid-cols-1 gap-3"
              }
            >
              <Button
                onClick={generateLivePreview}
                variant="outline"
                className="flex items-center justify-center"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                Live Preview
              </Button>
              {hasChanges && (
                <Button
                  onClick={updateShareLink}
                  variant="primary"
                  disabled={isLoading}
                  className="flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin w-4 h-4 mr-2"
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
                      Updating...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                      Update Link
                    </>
                  )}
                </Button>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                onClick={removeShareLink}
                variant="danger"
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? "Removing..." : "Remove Link"}
              </Button>
            </div>
          </div>
        )}

        {/* Status Message */}
        {shareStatus.type && (
          <div
            className={`p-4 rounded-lg border ${
              shareStatus.type === "success"
                ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200"
                : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200"
            }`}
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {shareStatus.type === "success" ? (
                  <svg
                    className="h-5 w-5"
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
                    className="h-5 w-5"
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
                <p className="text-sm">{shareStatus.message}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sharing Tips */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
        <h3 className="font-medium text-yellow-900 dark:text-yellow-200 mb-2">
          🎨 Smart Sharing Features
        </h3>
        <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
          <li>
            • <strong>Template & colors preserved:</strong> Recipients see the
            exact same design
          </li>
          <li>
            • <strong>Theme included:</strong> Dark/light mode preference is
            maintained
          </li>
          <li>
            • <strong>Live Preview:</strong> Preview button always shows your
            current CV
          </li>
          <li>
            • <strong>Smart updates:</strong> "Update Link" only appears when
            you have changes
          </li>
          <li>
            • <strong>Change detection:</strong> Automatically detects CV,
            styling, and template changes
          </li>
          <li>
            • <strong>No server needed:</strong> All data encoded directly into
            the URL
          </li>
          <li>
            • <strong>Works offline:</strong> Links work without any external
            services
          </li>
          <li>
            • <strong>Privacy first:</strong> Your data never touches any server
          </li>
          <li>
            • <strong>Universal compatibility:</strong> Works in any modern web
            browser
          </li>
          <li>• Be mindful of URL length limits on some messaging platforms</li>
        </ul>
      </div>
    </div>
  );
};
