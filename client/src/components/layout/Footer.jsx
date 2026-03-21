import React, { useState, useEffect } from "react";

export const Footer = () => {
  const [starCount, setStarCount] = useState(null);
  const [lastStarCount, setLastStarCount] = useState(null);
  const [isStarring, setIsStarring] = useState(false);
  const [starMessage, setStarMessage] = useState(null); // { type: 'success' | 'info', text: string }

  // Fetch GitHub star count
  useEffect(() => {
    const fetchStarCount = async () => {
      try {
        const response = await fetch(
          "https://api.github.com/repos/sandunMadhushan/free-cv-builder",
        );
        const data = await response.json();
        setLastStarCount(starCount);
        setStarCount(data.stargazers_count);
      } catch (error) {
        console.error("Failed to fetch star count:", error);
        setStarCount("0"); // Fallback when API fails
      }
    };

    fetchStarCount();

    // Auto-refresh star count when user comes back to the tab (in case they starred the repo)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Delay refresh slightly to allow GitHub to process the star
        setTimeout(refreshStarCount, 1000);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const handleStarRepo = async () => {
    if (isStarring) return;

    setIsStarring(true);

    try {
      let starred = false;

      // Method 1: Try GitHub API with browser session authentication
      try {
        const response = await fetch('https://api.github.com/user/starred/sandunMadhushan/free-cv-builder', {
          method: 'PUT',
          headers: {
            'Accept': 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28',
            'X-Requested-With': 'XMLHttpRequest',
          },
          credentials: 'include',
          mode: 'cors'
        });

        if (response.ok || response.status === 204) {
          starred = true;
          setStarMessage({ type: 'success', text: '⭐ Repository starred successfully!' });
          console.log('Successfully starred via API!');
        }
      } catch (apiError) {
        console.log('API method failed:', apiError);
      }

      // Method 2: Try GitHub's web star endpoint
      if (!starred) {
        try {
          const response = await fetch('https://github.com/sandunMadhushan/free-cv-builder/star', {
            method: 'PUT',
            headers: {
              'Accept': '*/*',
              'X-Requested-With': 'XMLHttpRequest',
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            credentials: 'include',
            mode: 'cors'
          });

          if (response.ok || response.status === 204) {
            starred = true;
            setStarMessage({ type: 'success', text: '⭐ Repository starred successfully!' });
            console.log('Successfully starred via web endpoint!');
          }
        } catch (webError) {
          console.log('Web star endpoint failed:', webError);
        }
      }

      // Method 3: Try alternative GitHub endpoints with different approaches
      if (!starred) {
        try {
          // Try with different headers to mimic GitHub's web interface
          const response = await fetch('https://api.github.com/user/starred/sandunMadhushan/free-cv-builder', {
            method: 'PUT',
            headers: {
              'Accept': 'application/vnd.github+json',
              'X-GitHub-Api-Version': '2022-11-28',
              'User-Agent': navigator.userAgent,
              'Origin': window.location.origin,
              'Referer': window.location.href,
            },
            credentials: 'include',
            mode: 'cors'
          });

          if (response.ok || response.status === 204) {
            starred = true;
            setStarMessage({ type: 'success', text: '⭐ Repository starred successfully!' });
            console.log('Successfully starred via alternative headers!');
          }
        } catch (altError) {
          console.log('Alternative headers method failed:', altError);
        }
      }

      // Update star count if any method worked
      if (starred) {
        setLastStarCount(starCount);
        setStarCount(prev => prev !== null ? parseInt(prev) + 1 : 1);

        // Refresh real count after a delay in background
        setTimeout(refreshStarCount, 2000);
      } else {
        // All direct methods failed - show helpful message but don't open popup
        setStarMessage({
          type: 'info',
          text: '🔐 Please sign in to GitHub in this browser to star repositories directly'
        });

        // Still refresh count in background in case user starred elsewhere
        setTimeout(refreshStarCount, 3000);
      }

    } catch (error) {
      console.error('Error starring repository:', error);
      setStarMessage({
        type: 'info',
        text: '❌ Unable to star repository. Please try again.'
      });
    } finally {
      setIsStarring(false);

      // Clear message after 4 seconds
      setTimeout(() => {
        setStarMessage(null);
      }, 4000);
    }
  };

  const refreshStarCount = async () => {
    try {
      const response = await fetch(
        "https://api.github.com/repos/sandunMadhushan/free-cv-builder",
      );
      const data = await response.json();
      setLastStarCount(starCount);
      setStarCount(data.stargazers_count);

      // Reset animation after a short delay
      setTimeout(() => {
        setLastStarCount(data.stargazers_count);
      }, 2000);
    } catch (error) {
      console.error("Failed to refresh star count:", error);
    }
  };

  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4 px-6 transition-colors relative overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 via-transparent to-purple-50/30 dark:from-blue-900/10 dark:via-transparent dark:to-purple-900/10"></div>

      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
        {/* Left side - Credit */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <span>Developed with</span>
          <svg
            className="w-4 h-4 text-red-500 animate-pulse"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
              clipRule="evenodd"
            />
          </svg>
          <span>by</span>
          <a
            href="https://github.com/sandunMadhushan"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300 transition-colors cursor-pointer hover:underline"
          >
            Sandun Madhushan
          </a>
        </div>

        {/* Right side - Star count and GitHub link */}
        <div className="flex items-center space-x-3">
          {/* Star count button */}
          <button
            onClick={handleStarRepo}
            disabled={isStarring}
            className={`flex items-center space-x-2 text-sm transition-all duration-300 group px-3 py-1.5 rounded-full ${
              isStarring
                ? 'text-gray-400 dark:text-gray-600 bg-gray-100 dark:bg-gray-800 cursor-wait'
                : 'text-gray-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 bg-gray-50 dark:bg-gray-700 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 cursor-pointer'
            }`}
            title={isStarring ? "Adding star..." : "⭐ Star this repository (instantly adds to your GitHub stars)"}
          >
            {isStarring ? (
              <svg
                className="w-4 h-4 animate-spin"
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
            ) : (
              <svg
                className="w-4 h-4 group-hover:scale-110 transition-transform"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.588 4.897a1 1 0 00.95.69h5.146c.969 0 1.371 1.24.588 1.81l-4.166 3.022a1 1 0 00-.364 1.118l1.588 4.897c.3.921-.755 1.688-1.54 1.118l-4.166-3.022a1 1 0 00-1.175 0l-4.166 3.022c-.785.57-1.84-.197-1.54-1.118l1.588-4.897a1 1 0 00-.364-1.118L2.463 10.324c-.783-.57-.38-1.81.588-1.81h5.146a1 1 0 00.95-.69l1.588-4.897z" />
              </svg>
            )}
            <span className={`font-medium transition-all duration-500 ${
              lastStarCount !== null && lastStarCount !== starCount
                ? 'text-green-600 dark:text-green-400 scale-110'
                : ''
            }`}>
              {isStarring ? "..." : (starCount !== null ? starCount : "...")}
            </span>
          </button>

          {/* GitHub repo button */}
          <a
            href="https://github.com/sandunMadhushan/free-cv-builder"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 group bg-gray-50 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-3 py-1.5 rounded-full"
          >
            <svg
              className="w-4 h-4 group-hover:scale-110 transition-transform"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">GitHub</span>
            <svg
              className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>
      </div>

      {/* Additional credits row */}
      <div className="relative z-10 mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-500">
            <span className="inline-flex items-center space-x-1">
              <span>Free & Open Source CV Builder</span>
              <span className="text-blue-500">•</span>
              <span>Built with React & Tailwind CSS</span>
              <span className="text-purple-500">•</span>
              <span className="hidden sm:inline">No Registration Required</span>
            </span>
          </p>
        </div>
      </div>

      {/* Star message notification */}
      {starMessage && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
          <div
            className={`px-4 py-2 rounded-lg shadow-lg border ${
              starMessage.type === 'success'
                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200'
                : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200'
            } animate-in slide-in-from-bottom duration-300`}
          >
            <p className="text-sm font-medium text-center">{starMessage.text}</p>
          </div>
        </div>
      )}

      {/* Animated dots decoration */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
        <div className="flex space-x-1">
          <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
          <div
            className="w-1 h-1 bg-purple-400 rounded-full animate-pulse"
            style={{ animationDelay: "0.2s" }}
          ></div>
          <div
            className="w-1 h-1 bg-blue-400 rounded-full animate-pulse"
            style={{ animationDelay: "0.4s" }}
          ></div>
        </div>
      </div>
    </footer>
  );
};
