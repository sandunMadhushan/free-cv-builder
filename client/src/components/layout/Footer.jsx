import React, { useState, useEffect, useRef } from "react";

export const Footer = () => {
  const [starCount, setStarCount] = useState(null);
  const [lastStarCount, setLastStarCount] = useState(null);
  const [isStarring, setIsStarring] = useState(false);
  const [starMessage, setStarMessage] = useState(null); // { type: 'success' | 'info', text: string }
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isStarred, setIsStarred] = useState(false);
  const [accessToken, setAccessToken] = useState(null); // Store GitHub access token

  // Ref to prevent auth status checks from overriding fresh authentication
  const freshAuthRef = useRef(false);

  // Ref to trigger starring after state updates
  const pendingStarRef = useRef(false);

  const API_BASE_URL =
    import.meta.env.VITE_API_URL || "https://cv-builder-api-fexd.onrender.com";

  // Handle URL-based OAuth success fallback (when postMessage fails)
  useEffect(() => {
    const handleOAuthFallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const githubAuth = urlParams.get('github_auth');
      const authToken = urlParams.get('token');

      if (githubAuth === 'success') {
        // IMMEDIATELY set fresh auth protection BEFORE any async operations
        freshAuthRef.current = true;

        console.log("🔄 Detected OAuth success via URL fallback", {
          hasToken: !!authToken,
          token: authToken ? `${authToken.substring(0, 8)}...` : null,
          freshAuthProtection: 'SET IMMEDIATELY'
        });

        // Check if this was from an OAuth state (intent to star)
        const oauthState = sessionStorage.getItem('cv-builder-oauth-state');
        let shouldAutoStar = false;

        if (oauthState) {
          try {
            const state = JSON.parse(oauthState);
            if (state.intentToStar && Date.now() - state.timestamp < 5 * 60 * 1000) { // 5 min
              shouldAutoStar = true;
              console.log("🎯 OAuth was initiated for starring - will proceed automatically");
            }
            // Clean up state
            sessionStorage.removeItem('cv-builder-oauth-state');
          } catch (error) {
            console.error("Error parsing OAuth state:", error);
          }
        }

        setStarMessage({
          type: "success",
          text: shouldAutoStar
            ? "🔍 GitHub authentication successful! Establishing session and starring..."
            : "🔍 GitHub authentication successful! Establishing session...",
        });

        // Clean up URL parameters
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);

        if (authToken) {
          // Use the auth token to establish session
          try {
            console.log("🔑 Using auth token to establish session...");

            const response = await fetch(`${API_BASE_URL}/api/auth/token/${authToken}`, {
              method: "GET",
              credentials: "include",
            });

            if (response.ok) {
              const data = await response.json();
              console.log("✅ Session established via auth token:", data);

              if (data.success && data.authenticated) {
                // Update local state
                setIsAuthenticated(true);
                setUser(data.user);
                setAccessToken(data.accessToken); // Store access token for API requests

                // Keep fresh auth protection active
                setTimeout(() => {
                  freshAuthRef.current = false;
                  console.log("🔓 Fresh auth protection expired - normal auth checks resumed");
                }, 10000); // Extended to 10 seconds

                console.log("✅ Session established successfully, user authenticated:", {
                  userId: data.user?.id,
                  username: data.user?.login,
                  hasAccessToken: !!data.accessToken,
                  shouldAutoStar,
                  freshAuthProtection: freshAuthRef.current
                });

                if (shouldAutoStar) {
                  setStarMessage({
                    type: "success",
                    text: "✅ Authentication successful! Checking repository status...",
                  });

                  // Check current star status first, then toggle appropriately
                  console.log("🔍 Auto-star requested - checking current star status to decide action");

                  setTimeout(async () => {
                    try {
                      const statusHeaders = {};
                      if (data.accessToken) {
                        statusHeaders.Authorization = `Bearer ${data.accessToken}`;
                      }

                      const statusResponse = await fetch(
                        `${API_BASE_URL}/api/auth/repo/star/status`,
                        {
                          method: "GET",
                          credentials: "include",
                          headers: statusHeaders,
                        },
                      );

                      const statusData = await statusResponse.json();
                      const isCurrentlyStarred = statusData.authenticated ? statusData.isStarred : false;

                      console.log("🎯 Auto-star decision making:", {
                        authenticated: statusData.authenticated,
                        currentlyStarred: isCurrentlyStarred,
                        willPerform: isCurrentlyStarred ? 'unstar' : 'star'
                      });

                      // Update local state to match server
                      setIsStarred(isCurrentlyStarred);

                      // Show appropriate message based on what we'll do
                      setStarMessage({
                        type: "success",
                        text: isCurrentlyStarred
                          ? "⭐ Repository already starred! Unstarring..."
                          : "⭐ Repository not starred! Starring...",
                      });

                      // Set pending star flag - this will trigger the toggle action
                      pendingStarRef.current = true;

                    } catch (error) {
                      console.error("❌ Error checking star status for auto-toggle:", error);
                      // Fallback to normal starring if status check fails
                      pendingStarRef.current = true;
                    }
                  }, 1000);
                } else {
                  setStarMessage({
                    type: "success",
                    text: "✅ Authentication successful!",
                  });

                  // Clear message after delay
                  setTimeout(() => {
                    setStarMessage(null);
                  }, 3000);
                }
                return;
              }
            }

            console.error("❌ Auth token session establishment failed");
            throw new Error("Token authentication failed");

          } catch (error) {
            console.error("❌ Error using auth token:", error);
            setStarMessage({
              type: "info",
              text: "❌ Session establishment failed. Please click the star button to try again.",
            });
            return;
          }
        }

        // Fallback: wait and check auth status (old logic for backward compatibility)
        setTimeout(async () => {
          console.log("🔍 Checking auth status after URL-based OAuth fallback (no token)...");
          const authResult = await checkAuthStatus();

          if (authResult) {
            console.log("✅ Session found after URL fallback - proceeding to star");
            setStarMessage({
              type: "success",
              text: "✅ Authentication successful! Starring repository...",
            });
            setTimeout(() => handleStarRepo(true), 1000);
          } else {
            console.log("❌ No session found after OAuth success");
            console.log("🔄 Trying to re-establish session by checking backend logs...");

            // Try a direct auth check one more time
            setTimeout(async () => {
              const finalAuthCheck = await checkAuthStatus();
              if (finalAuthCheck) {
                console.log("✅ Session found on retry!");
                setStarMessage({
                  type: "success",
                  text: "✅ Authentication successful! Starring repository...",
                });
                setTimeout(() => handleStarRepo(true), 500);
              } else {
                console.log("❌ Session still not found - OAuth may need to be repeated");
                setStarMessage({
                  type: "info",
                  text: "❌ Session not established. Please click the star button to try again.",
                });
              }
            }, 3000);
          }
        }, 2000);
      }
    };

    handleOAuthFallback();
  }, []);

  // Fetch GitHub star count and auth status
  useEffect(() => {
    const initializeData = async () => {
      // Check if we're in an OAuth flow - if so, skip auth status check to avoid race condition
      const urlParams = new URLSearchParams(window.location.search);
      const isOAuthFlow = urlParams.get('github_auth') === 'success';

      if (isOAuthFlow) {
        console.log("🔄 OAuth flow detected - skipping initial auth check to prevent race condition");
        await fetchStarCount();
      } else {
        await Promise.all([fetchStarCount(), checkAuthStatus()]);
      }
    };

    initializeData();

    // Auto-refresh star count and status when user comes back to the tab
    const handleVisibilityChange = () => {
      if (!document.hidden && isAuthenticated) {
        console.log("👁️ Tab became visible - immediately checking for star status changes across sessions");
        // Immediate check for cross-session changes
        fetchStarCount();
        checkStarStatus();
      }
    };

    // Auto-refresh when window gains focus (switching between browser windows)
    const handleWindowFocus = () => {
      if (isAuthenticated) {
        console.log("🔍 Window gained focus - immediately checking for star status changes across browsers");
        // Immediate check for cross-browser changes
        fetchStarCount();
        checkStarStatus();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleWindowFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleWindowFocus);

      // Clean up any GitHub auth handlers on unmount
      if (window.githubAuthHandlers) {
        console.log("🧹 Component unmounting - cleaning up GitHub auth handlers");
        window.githubAuthHandlers.forEach(handler => {
          window.removeEventListener("message", handler);
        });
        window.githubAuthHandlers = [];
      }
    };
  }, []);

  // Check star status when authentication status changes
  useEffect(() => {
    if (isAuthenticated) {
      checkStarStatus();

      // Check if we have a pending star action
      if (pendingStarRef.current) {
        console.log("🌟 Pending star detected - executing now that auth state is ready", {
          isAuthenticated,
          user: user?.login,
          pendingStar: pendingStarRef.current
        });

        pendingStarRef.current = false;

        // Small delay to ensure state is fully settled
        setTimeout(() => {
          console.log("🎯 Executing pending star action with confirmed auth state", {
            isAuthenticated,
            user: user?.login
          });
          handleStarRepo(true);
        }, 300);
      }
    }
  }, [isAuthenticated, user]);

  // Periodic star status sync for real-time updates across sessions
  useEffect(() => {
    if (!isAuthenticated) return;

    console.log("🔄 Setting up periodic star status sync for cross-session updates");

    const syncInterval = setInterval(() => {
      // Only sync if tab is visible and user is authenticated
      if (!document.hidden && isAuthenticated) {
        console.log("🔄 Periodic sync - checking for star status changes");
        checkStarStatus();
      }
    }, 30000); // Check every 30 seconds for more responsive sync

    return () => {
      console.log("🛑 Clearing periodic star status sync");
      clearInterval(syncInterval);
    };
  }, [isAuthenticated, accessToken]);

  const fetchStarCount = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/repo/stars`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        console.warn("Star count API returned error:", data.error, data.message);
      }

      // Detect star count changes (possibly from other sessions)
      const newStarCount = data.starCount || 0;
      const previousStarCount = starCount;

      if (previousStarCount !== null && previousStarCount !== newStarCount) {
        console.log("📊 Star count changed:", {
          previous: previousStarCount,
          current: newStarCount,
          difference: newStarCount - previousStarCount
        });
      }

      setLastStarCount(starCount);
      setStarCount(newStarCount);
    } catch (error) {
      console.error("Failed to fetch star count:", error);
      setStarCount(0); // Fallback when API fails
    }
  };

  const establishSession = async (userData) => {
    try {
      console.log("🔄 Establishing session with user data...", {
        hasUser: !!userData,
        hasToken: !!userData?.access_token,
        userId: userData?.id,
        username: userData?.login
      });

      const response = await fetch(`${API_BASE_URL}/api/auth/session`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: userData,
          access_token: userData.access_token,
        }),
      });

      console.log("📡 Session establishment response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Session establishment failed:", {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("✅ Session establishment response:", data);

      if (data.success && data.authenticated) {
        // Update local state
        setIsAuthenticated(true);
        setUser(data.user);
        setAccessToken(data.accessToken); // Store access token for API requests

        // Keep fresh auth protection active
        setTimeout(() => {
          freshAuthRef.current = false;
          console.log("🔓 Fresh auth protection expired - normal auth checks resumed");
        }, 10000); // Extended to 10 seconds

        console.log("🎉 Session successfully established! User is now authenticated", {
          userId: data.user?.id,
          username: data.user?.login,
          hasAccessToken: !!data.accessToken,
          freshAuthProtection: freshAuthRef.current
        });

        // Show success message and check what action to take
        setStarMessage({
          type: "success",
          text: "✅ Authentication complete! Checking repository status...",
        });

        // Check current star status first, then toggle appropriately
        console.log("🔍 Session established - checking current star status to decide action");

        setTimeout(async () => {
          try {
            const statusHeaders = {};
            if (data.accessToken) {
              statusHeaders.Authorization = `Bearer ${data.accessToken}`;
            }

            const statusResponse = await fetch(
              `${API_BASE_URL}/api/auth/repo/star/status`,
              {
                method: "GET",
                credentials: "include",
                headers: statusHeaders,
              },
            );

            const statusData = await statusResponse.json();
            const isCurrentlyStarred = statusData.authenticated ? statusData.isStarred : false;

            console.log("🎯 Session auto-star decision making:", {
              authenticated: statusData.authenticated,
              currentlyStarred: isCurrentlyStarred,
              willPerform: isCurrentlyStarred ? 'unstar' : 'star'
            });

            // Update local state to match server
            setIsStarred(isCurrentlyStarred);

            // Show appropriate message based on what we'll do
            setStarMessage({
              type: "success",
              text: isCurrentlyStarred
                ? "⭐ Repository already starred! Unstarring..."
                : "⭐ Repository not starred! Starring...",
            });

            // Set pending star flag - this will trigger the toggle action
            pendingStarRef.current = true;

          } catch (error) {
            console.error("❌ Error checking star status for session auto-toggle:", error);
            // Fallback to normal starring if status check fails
            pendingStarRef.current = true;
          }
        }, 1000);
      } else {
        console.error("❌ Session establishment returned success=false:", data);
        throw new Error(data.message || "Session establishment failed");
      }
    } catch (error) {
      console.error("❌ Session establishment error:", {
        message: error.message,
        stack: error.stack
      });

      // More specific error handling
      if (error.message.includes('HTTP 401')) {
        setStarMessage({
          type: "info",
          text: "❌ Authentication failed. The GitHub token may be invalid. Please try again.",
        });
      } else if (error.message.includes('HTTP 500')) {
        setStarMessage({
          type: "info",
          text: "❌ Server error during authentication. Please try again in a moment.",
        });
      } else {
        setStarMessage({
          type: "info",
          text: "❌ Authentication session failed. Please click the star button to try again.",
        });
      }
    }
  };

  const checkAuthStatus = async () => {
    try {
      console.log("Checking GitHub auth status...");

      // Don't override fresh authentication
      if (freshAuthRef.current) {
        console.log("🔒 Skipping auth status check - fresh authentication in progress", {
          isAuthenticated,
          user: user?.login || 'null'
        });
        return isAuthenticated;
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/status`, {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();

      console.log("Auth status response:", data);

      // Double check we're not overriding fresh auth
      if (freshAuthRef.current) {
        console.log("🔒 Fresh auth detected during API call - not updating state");
        return isAuthenticated;
      }

      setIsAuthenticated(data.authenticated);
      setUser(data.user);

      return data.authenticated;
    } catch (error) {
      console.error("Failed to check auth status:", error);
      setIsAuthenticated(false);
      setUser(null);
      return false;
    }
  };

  const checkStarStatus = async () => {
    if (!isAuthenticated) return;

    try {
      // Use Authorization header with access token if available
      const headers = {};
      if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
        console.log("🔑 Using access token for star status check");
      }

      const response = await fetch(
        `${API_BASE_URL}/api/auth/repo/star/status`,
        {
          method: "GET",
          credentials: "include",
          headers,
        },
      );
      const data = await response.json();

      if (data.authenticated) {
        const newStarStatus = data.isStarred;
        const previousStarStatus = isStarred;

        // Detect changes from other browser sessions
        if (previousStarStatus !== null && previousStarStatus !== newStarStatus) {
          console.log("🔄 Star status changed in another session!", {
            previous: previousStarStatus,
            current: newStarStatus,
            user: user?.login
          });

          // Show notification about cross-session change
          setStarMessage({
            type: "info",
            text: newStarStatus
              ? "⭐ Repository was starred in another browser session"
              : "⭐ Repository was unstarred in another browser session",
          });

          // Also refresh star count to get the latest numbers
          setTimeout(() => {
            fetchStarCount();
          }, 1000);

          // Clear notification after delay
          setTimeout(() => {
            setStarMessage(null);
          }, 4000);
        }

        setIsStarred(newStarStatus);
      }
    } catch (error) {
      console.error("Failed to check star status:", error);
    }
  };

  const handleStarRepo = async (skipAuthCheck = false) => {
    if (isStarring) {
      console.log("Already starring, skipping...");
      return;
    }

    console.log("🎯 handleStarRepo called:", {
      isAuthenticated,
      skipAuthCheck,
      source: skipAuthCheck ? 'automatic' : 'button-click',
      freshAuthActive: freshAuthRef.current,
      userState: user?.login || 'null'
    });

    // Always check if user is actually authenticated before proceeding with starring
    // skipAuthCheck only means we skip showing the OAuth popup, not the authentication requirement
    if (!isAuthenticated) {
      // If skipAuthCheck is true but user still not authenticated, show an error
      if (skipAuthCheck) {
        console.log("❌ Auto-starring failed - user authentication state lost", {
          expectedAuthenticated: true,
          actualAuthenticated: isAuthenticated,
          freshAuthProtection: freshAuthRef.current,
          suggestedAction: 'Check for race condition in auth status calls'
        });
        setStarMessage({
          type: "info",
          text: "❌ Authentication failed. Please try again.",
        });
        return;
      }

      console.log("🔐 User not authenticated, initiating OAuth...");

      // Store current state for restoration after OAuth
      const authState = {
        intentToStar: true,
        timestamp: Date.now(),
        currentPath: window.location.pathname,
        currentHash: window.location.hash
      };
      sessionStorage.setItem('cv-builder-oauth-state', JSON.stringify(authState));

      // Initiate GitHub OAuth flow in same window
      try {
        console.log("📡 Fetching GitHub auth URL...");
        const response = await fetch(`${API_BASE_URL}/api/auth/github`, {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        console.log("🔑 Auth response:", data);

        if (data.success && data.authUrl) {
          console.log("🔄 Redirecting to GitHub OAuth (same window)...");

          setStarMessage({
            type: "success",
            text: "🔄 Redirecting to GitHub for authentication...",
          });

          // Redirect the current window to GitHub OAuth
          setTimeout(() => {
            window.location.href = data.authUrl;
          }, 1000);
        } else {
          setStarMessage({
            type: "info",
            text: "❌ Failed to initiate GitHub authentication",
          });
        }
      } catch (error) {
        console.error("❌ GitHub auth error:", error);
        setStarMessage({
          type: "info",
          text: "❌ Failed to connect to authentication service",
        });
      }
      return;
    }

    // User is authenticated, proceed with starring
    console.log("User is authenticated, proceeding with starring...");
    setIsStarring(true);

    try {
      // Always check current star status first to ensure accuracy across sessions
      console.log("🔍 Checking current star status before proceeding...");

      const statusHeaders = {};
      if (accessToken) {
        statusHeaders.Authorization = `Bearer ${accessToken}`;
      }

      const statusResponse = await fetch(
        `${API_BASE_URL}/api/auth/repo/star/status`,
        {
          method: "GET",
          credentials: "include",
          headers: statusHeaders,
        },
      );

      const statusData = await statusResponse.json();
      const currentStarStatus = statusData.authenticated ? statusData.isStarred : false;

      console.log("📊 Current star status from server:", {
        authenticated: statusData.authenticated,
        currentlyStarred: currentStarStatus,
        localState: isStarred,
        statusMatch: currentStarStatus === isStarred
      });

      // Update local state to match server reality
      if (statusData.authenticated && currentStarStatus !== isStarred) {
        console.log("🔄 Updating local star status to match server:", {
          from: isStarred,
          to: currentStarStatus
        });
        setIsStarred(currentStarStatus);

        // Show sync message
        setStarMessage({
          type: "info",
          text: currentStarStatus
            ? "⭐ Repository status synced - you've already starred this!"
            : "⭐ Repository status synced - not currently starred",
        });

        // Clear sync message quickly
        setTimeout(() => {
          setStarMessage(null);
        }, 2000);

        // Don't proceed with star/unstar action, just sync the state
        setIsStarring(false);
        return;
      }

      // Proceed with star/unstar based on current status
      const method = currentStarStatus ? "DELETE" : "POST";
      const actionText = currentStarStatus ? "unstarring" : "starring";

      console.log(`📌 Proceeding with ${actionText} (current status: ${currentStarStatus ? 'starred' : 'not starred'})`);

      // Use Authorization header with access token
      const headers = {
        "Content-Type": "application/json",
      };

      if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
        console.log("🔑 Using access token for star request");
      } else {
        console.log("⚠️ No access token available, relying on session cookies");
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/repo/star`, {
        method,
        credentials: "include",
        headers,
      });

      const data = await response.json();

      if (data.success) {
        const newStarStatus = !currentStarStatus;
        setIsStarred(newStarStatus);
        setLastStarCount(starCount);
        setStarCount(data.starCount);

        setStarMessage({
          type: "success",
          text: newStarStatus
            ? "⭐ Repository starred successfully!"
            : "⭐ Repository unstarred successfully!",
        });

        console.log("✅ Star action completed:", {
          action: newStarStatus ? 'starred' : 'unstarred',
          newStarCount: data.starCount,
          previousStarCount: starCount
        });
      } else {
        throw new Error(data.message || "Failed to update star status");
      }
    } catch (error) {
      console.error("Error starring repository:", error);

      if (error.message?.includes("Authentication")) {
        setStarMessage({
          type: "info",
          text: "🔑 Authentication expired. Please sign in again.",
        });
        // Reset auth state
        setIsAuthenticated(false);
        setUser(null);
      } else {
        setStarMessage({
          type: "info",
          text: "❌ Failed to update star. Please try again.",
        });
      }
    } finally {
      setIsStarring(false);

      // Clear message after 5 seconds
      setTimeout(() => {
        setStarMessage(null);
      }, 5000);
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
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log("🖱️ Star button clicked by user");
              handleStarRepo(false); // Explicitly set skipAuthCheck to false for button clicks
            }}
            disabled={isStarring}
            className={`flex items-center space-x-2 text-sm transition-all duration-300 group px-3 py-1.5 rounded-full ${
              isStarring
                ? "text-gray-400 dark:text-gray-600 bg-gray-100 dark:bg-gray-800 cursor-wait"
                : isStarred
                  ? "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 cursor-pointer"
                  : "text-gray-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 bg-gray-50 dark:bg-gray-700 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 cursor-pointer"
            }`}
            title={
              isStarring
                ? "Processing..."
                : !isAuthenticated
                  ? "⭐ Click to sign in with GitHub and star this repository"
                  : isStarred
                    ? "⭐ Unstar this repository"
                    : "⭐ Star this repository"
            }
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
                className={`w-4 h-4 group-hover:scale-110 transition-transform ${
                  isStarred ? "text-yellow-500" : ""
                }`}
                fill={isStarred ? "currentColor" : "currentColor"}
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.588 4.897a1 1 0 00.95.69h5.146c.969 0 1.371 1.24.588 1.81l-4.166 3.022a1 1 0 00-.364 1.118l1.588 4.897c.3.921-.755 1.688-1.54 1.118l-4.166-3.022a1 1 0 00-1.175 0l-4.166 3.022c-.785.57-1.84-.197-1.54-1.118l1.588-4.897a1 1 0 00-.364-1.118L2.463 10.324c-.783-.57-.38-1.81.588-1.81h5.146a1 1 0 00.95-.69l1.588-4.897z" />
              </svg>
            )}
            <span
              className={`font-medium transition-all duration-500 ${
                lastStarCount !== null && lastStarCount !== starCount
                  ? "text-green-600 dark:text-green-400 scale-110"
                  : ""
              }`}
            >
              {isStarring ? "..." : starCount !== null ? starCount : "..."}
            </span>
            {!isAuthenticated && !isStarring && (
              <svg
                className="w-3 h-3 opacity-70"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
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

      {/* Authentication status (for development) */}
      {import.meta.env.DEV && isAuthenticated && user && (
        <div className="relative z-10 mt-2 text-center">
          <p className="text-xs text-green-600 dark:text-green-400">
            ✅ Signed in as {user.name || user.login}
          </p>
        </div>
      )}

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
              starMessage.type === "success"
                ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200"
                : "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200"
            } animate-in slide-in-from-bottom duration-300`}
          >
            <p className="text-sm font-medium text-center">
              {starMessage.text}
            </p>
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
