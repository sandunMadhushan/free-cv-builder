import axios from 'axios';

/**
 * GitHub OAuth and API Controller
 * Handles GitHub authentication and repository interactions
 */
class GitHubController {
  constructor() {
    this.githubApiBaseUrl = 'https://api.github.com';
    this.githubBaseUrl = 'https://github.com';
    this.repoOwner = 'sandunMadhushan';
    this.repoName = 'free-cv-builder';
  }

  /**
   * Initiate GitHub OAuth flow
   */
  initiateAuth = (req, res) => {
    try {
      const clientId = process.env.GITHUB_CLIENT_ID;
      const callbackUrl = process.env.GITHUB_CALLBACK_URL;

      if (!clientId || !callbackUrl) {
        return res.status(500).json({
          error: 'GitHub OAuth not configured',
          message: 'Missing GitHub client ID or callback URL'
        });
      }

      // Generate a random state parameter for security
      const state = Math.random().toString(36).substring(2, 15);
      req.session.githubOAuthState = state;

      const githubAuthUrl = `${this.githubBaseUrl}/login/oauth/authorize?` +
        `client_id=${clientId}&` +
        `redirect_uri=${encodeURIComponent(callbackUrl)}&` +
        `scope=public_repo&` +
        `state=${state}`;

      res.json({
        success: true,
        authUrl: githubAuthUrl
      });
    } catch (error) {
      console.error('GitHub auth initiation error:', error);
      res.status(500).json({
        error: 'Authentication Error',
        message: 'Failed to initiate GitHub authentication'
      });
    }
  };

  /**
   * Handle GitHub OAuth callback
   */
  handleAuthCallback = async (req, res) => {
    try {
      const { code, state } = req.query;
      const clientId = process.env.GITHUB_CLIENT_ID;
      const clientSecret = process.env.GITHUB_CLIENT_SECRET;

      // Log for debugging
      console.log('OAuth callback - State received:', state);
      console.log('OAuth callback - Session state:', req.session.githubOAuthState);

      // Verify state parameter (but don't fail completely if it doesn't match in production)
      if (state && req.session.githubOAuthState && state !== req.session.githubOAuthState) {
        console.warn('OAuth state mismatch - this could be a security issue or session problem');
        // In production, we'll be more lenient due to potential session issues with popups
        if (process.env.NODE_ENV !== 'production') {
          return res.status(400).json({
            error: 'Invalid State',
            message: 'OAuth state mismatch'
          });
        }
      }

      if (!code) {
        return res.status(400).json({
          error: 'Authorization Error',
          message: 'No authorization code received'
        });
      }

      // Exchange code for access token
      const tokenResponse = await axios.post(
        `${this.githubBaseUrl}/login/oauth/access_token`,
        {
          client_id: clientId,
          client_secret: clientSecret,
          code: code,
        },
        {
          headers: {
            'Accept': 'application/json',
          },
        }
      );

      const { access_token } = tokenResponse.data;

      if (!access_token) {
        return res.status(400).json({
          error: 'Token Error',
          message: 'Failed to obtain access token'
        });
      }

      // Get user information
      const userResponse = await axios.get(`${this.githubApiBaseUrl}/user`, {
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Accept': 'application/vnd.github+json',
        },
      });

      const user = userResponse.data;

      // Store user data in session
      req.session.githubUser = {
        id: user.id,
        login: user.login,
        name: user.name,
        avatar_url: user.avatar_url,
      };
      req.session.githubAccessToken = access_token;

      // Save session explicitly
      req.session.save((err) => {
        if (err) {
          console.error('Session save error:', err);
        } else {
          console.log('✅ Session saved successfully for user:', user.login);
          console.log('Session ID:', req.sessionID);
          console.log('Session data:', {
            hasUser: !!req.session.githubUser,
            hasToken: !!req.session.githubAccessToken,
            userId: req.session.githubUser?.id
          });
        }
      });

      // Send a simple HTML page that closes the popup and notifies parent
      res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>GitHub Authentication Success</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
              text-align: center;
              padding: 50px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              margin: 0;
            }
            .container {
              background: rgba(255,255,255,0.1);
              backdrop-filter: blur(10px);
              border-radius: 20px;
              padding: 40px;
              max-width: 400px;
              margin: 0 auto;
            }
            .success-icon {
              font-size: 60px;
              margin-bottom: 20px;
              animation: bounce 1s ease-in-out;
            }
            @keyframes bounce {
              0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
              40% { transform: translateY(-10px); }
              60% { transform: translateY(-5px); }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="success-icon">✅</div>
            <h2>Authentication Successful!</h2>
            <p>Starring repository automatically...</p>
            <p><small>This window will close in 2 seconds</small></p>
          </div>

          <script>
            console.log('GitHub OAuth success - sending user data to parent');

            const userData = {
              id: ${user.id},
              login: '${user.login}',
              name: '${user.name || ''}',
              avatar_url: '${user.avatar_url}',
              access_token: '${access_token}'
            };

            // Function to close popup and notify parent with user data
            function closePopupAndNotify() {
              try {
                // Send message with user data to parent window
                if (window.opener && !window.opener.closed) {
                  console.log('Sending success message with user data to parent window');
                  window.opener.postMessage({
                    type: 'github-auth-success',
                    user: userData,
                    timestamp: Date.now()
                  }, '*');

                  // Close popup after short delay
                  setTimeout(() => {
                    window.close();
                  }, 1000);
                } else {
                  console.log('No opener found, redirecting to main app');
                  // Fallback: redirect to main app
                  setTimeout(() => {
                    window.location.href = '${process.env.CLIENT_URL || 'http://localhost:5173'}?github_auth=success&t=' + Date.now();
                  }, 2000);
                }
              } catch (error) {
                console.error('Error in popup communication:', error);
                // Fallback redirect
                setTimeout(() => {
                  window.location.href = '${process.env.CLIENT_URL || 'http://localhost:5173'}?github_auth=success&t=' + Date.now();
                }, 2000);
              }
            }

            // Execute immediately and also after DOM load
            closePopupAndNotify();

            // Backup execution after page load
            window.addEventListener('load', closePopupAndNotify);

            // Force close after 3 seconds as final backup
            setTimeout(() => {
              if (window.opener && !window.opener.closed) {
                window.close();
              }
            }, 3000);
          </script>
        </body>
        </html>
      `);
    } catch (error) {
      console.error('GitHub auth callback error:', error);

      // Send error page that closes popup
      res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>GitHub Authentication Error</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
              text-align: center;
              padding: 50px;
              background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
              color: white;
              margin: 0;
            }
            .container {
              background: rgba(255,255,255,0.1);
              backdrop-filter: blur(10px);
              border-radius: 20px;
              padding: 40px;
              max-width: 400px;
              margin: 0 auto;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div style="font-size: 60px; margin-bottom: 20px;">❌</div>
            <h2>Authentication Failed</h2>
            <p>There was an error during authentication.</p>
            <p><small>This window will close automatically</small></p>
          </div>

          <script>
            console.log('GitHub OAuth error - sending message to parent');

            function closePopupAndNotify() {
              try {
                if (window.opener && !window.opener.closed) {
                  window.opener.postMessage({
                    type: 'github-auth-error',
                    message: 'Authentication failed',
                    timestamp: Date.now()
                  }, '*');

                  setTimeout(() => {
                    window.close();
                  }, 2000);
                } else {
                  setTimeout(() => {
                    window.location.href = '${process.env.CLIENT_URL || 'http://localhost:5173'}?github_auth=error&message=${encodeURIComponent('Authentication failed')}&t=' + Date.now();
                  }, 2000);
                }
              } catch (error) {
                console.error('Error in popup communication:', error);
                setTimeout(() => {
                  window.location.href = '${process.env.CLIENT_URL || 'http://localhost:5173'}?github_auth=error&message=${encodeURIComponent('Authentication failed')}&t=' + Date.now();
                }, 2000);
              }
            }

            closePopupAndNotify();
            window.addEventListener('load', closePopupAndNotify);

            setTimeout(() => {
              if (window.opener && !window.opener.closed) {
                window.close();
              }
            }, 3000);
          </script>
        </body>
        </html>
      `);
    }
  };

  /**
   * Set authentication session with user data from popup
   */
  setAuthSession = async (req, res) => {
    try {
      const { user, access_token } = req.body;

      if (!user || !access_token) {
        return res.status(400).json({
          error: 'Invalid Request',
          message: 'User data and access token are required'
        });
      }

      // Verify the access token is valid by making a test API call
      const verifyResponse = await axios.get(`${this.githubApiBaseUrl}/user`, {
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Accept': 'application/vnd.github+json',
        },
      });

      // If verification fails, the catch block will handle it
      const verifiedUser = verifyResponse.data;

      if (verifiedUser.id !== user.id) {
        return res.status(400).json({
          error: 'Invalid Token',
          message: 'Access token does not match user data'
        });
      }

      // Set session data
      req.session.githubUser = {
        id: user.id,
        login: user.login,
        name: user.name,
        avatar_url: user.avatar_url,
      };
      req.session.githubAccessToken = access_token;

      // Save session explicitly
      req.session.save((err) => {
        if (err) {
          console.error('Session save error:', err);
          return res.status(500).json({
            error: 'Session Error',
            message: 'Failed to save session'
          });
        }

        console.log('✅ Session established for user:', user.login);
        res.json({
          success: true,
          authenticated: true,
          user: req.session.githubUser,
          message: 'Session established successfully'
        });
      });

    } catch (error) {
      console.error('Set auth session error:', error);
      res.status(500).json({
        error: 'Authentication Error',
        message: 'Failed to establish authentication session'
      });
    }
  };

  /**
   * Get current user's authentication status
   */
  getAuthStatus = (req, res) => {
    try {
      // Debug session information
      console.log('=== AUTH STATUS CHECK ===');
      console.log('Session ID:', req.sessionID);
      console.log('Session exists:', !!req.session);
      console.log('GitHub user in session:', !!req.session?.githubUser);
      console.log('GitHub token in session:', !!req.session?.githubAccessToken);
      console.log('Full session data:', {
        ...req.session,
        githubAccessToken: req.session?.githubAccessToken ? '[REDACTED]' : null
      });
      console.log('Request headers:', {
        'cookie': req.headers.cookie,
        'user-agent': req.headers['user-agent'],
        'origin': req.headers.origin,
        'referer': req.headers.referer
      });
      console.log('========================');

      if (req.session.githubUser && req.session.githubAccessToken) {
        console.log('✅ User is authenticated:', req.session.githubUser.login);
        res.json({
          authenticated: true,
          user: req.session.githubUser,
        });
      } else {
        console.log('❌ User is not authenticated - missing session data');
        res.json({
          authenticated: false,
          user: null,
        });
      }
    } catch (error) {
      console.error('Auth status error:', error);
      res.status(500).json({
        error: 'Status Error',
        message: 'Failed to check authentication status'
      });
    }
  };

  /**
   * Logout user
   */
  logout = (req, res) => {
    try {
      req.session.destroy((err) => {
        if (err) {
          console.error('Session destroy error:', err);
          return res.status(500).json({
            error: 'Logout Error',
            message: 'Failed to logout'
          });
        }

        res.json({
          success: true,
          message: 'Logged out successfully'
        });
      });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        error: 'Logout Error',
        message: 'Failed to logout'
      });
    }
  };

  /**
   * Get repository star count
   */
  getStarCount = async (req, res) => {
    try {
      console.log('🌟 Fetching star count for repository:', `${this.repoOwner}/${this.repoName}`);

      // Use GitHub token if available to increase rate limits (60/hour -> 5000/hour)
      const headers = {
        'Accept': 'application/vnd.github+json',
        'User-Agent': 'CV-Builder-App'
      };

      // Add authorization header if GitHub token is available
      if (process.env.GITHUB_TOKEN) {
        headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
        console.log('🔑 Using GitHub token for enhanced rate limits');
      } else {
        console.log('⚠️  No GitHub token - using public rate limits (60/hour)');
      }

      const response = await axios.get(
        `${this.githubApiBaseUrl}/repos/${this.repoOwner}/${this.repoName}`,
        {
          headers,
          timeout: 10000, // 10 second timeout
        }
      );

      console.log('✅ Successfully fetched star count:', response.data.stargazers_count);

      res.json({
        starCount: response.data.stargazers_count || 0,
        watchersCount: response.data.watchers_count || 0,
        forksCount: response.data.forks_count || 0,
      });
    } catch (error) {
      console.error('❌ Get star count error:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        URL: `${this.githubApiBaseUrl}/repos/${this.repoOwner}/${this.repoName}`,
        hasToken: !!process.env.GITHUB_TOKEN
      });

      // Return success with fallback data instead of 500 error
      // This ensures the frontend always gets a valid response
      res.json({
        starCount: 0, // Fallback value
        watchersCount: 0,
        forksCount: 0,
        error: 'Could not fetch live data',
        message: error.response?.status === 403 ? 'Rate limited' : 'GitHub API unavailable'
      });
    }
  };

  /**
   * Star the repository
   */
  starRepository = async (req, res) => {
    try {
      if (!req.session.githubAccessToken) {
        return res.status(401).json({
          error: 'Authentication Required',
          message: 'Please authenticate with GitHub first'
        });
      }

      const response = await axios.put(
        `${this.githubApiBaseUrl}/user/starred/${this.repoOwner}/${this.repoName}`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${req.session.githubAccessToken}`,
            'Accept': 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28',
          },
        }
      );

      // Star API returns 204 on success
      if (response.status === 204) {
        // Get updated star count
        const repoResponse = await axios.get(
          `${this.githubApiBaseUrl}/repos/${this.repoOwner}/${this.repoName}`,
          {
            headers: {
              'Accept': 'application/vnd.github+json',
            },
          }
        );

        res.json({
          success: true,
          message: 'Repository starred successfully',
          starCount: repoResponse.data.stargazers_count,
        });
      } else {
        throw new Error('Unexpected response from GitHub API');
      }
    } catch (error) {
      console.error('Star repository error:', error);

      if (error.response?.status === 401) {
        return res.status(401).json({
          error: 'Authentication Error',
          message: 'GitHub authentication expired. Please re-authenticate.'
        });
      }

      if (error.response?.status === 404) {
        return res.status(404).json({
          error: 'Repository Not Found',
          message: 'The repository could not be found'
        });
      }

      res.status(500).json({
        error: 'Star Error',
        message: 'Failed to star repository'
      });
    }
  };

  /**
   * Unstar the repository
   */
  unstarRepository = async (req, res) => {
    try {
      if (!req.session.githubAccessToken) {
        return res.status(401).json({
          error: 'Authentication Required',
          message: 'Please authenticate with GitHub first'
        });
      }

      const response = await axios.delete(
        `${this.githubApiBaseUrl}/user/starred/${this.repoOwner}/${this.repoName}`,
        {
          headers: {
            'Authorization': `Bearer ${req.session.githubAccessToken}`,
            'Accept': 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28',
          },
        }
      );

      // Unstar API returns 204 on success
      if (response.status === 204) {
        // Get updated star count
        const repoResponse = await axios.get(
          `${this.githubApiBaseUrl}/repos/${this.repoOwner}/${this.repoName}`,
          {
            headers: {
              'Accept': 'application/vnd.github+json',
            },
          }
        );

        res.json({
          success: true,
          message: 'Repository unstarred successfully',
          starCount: repoResponse.data.stargazers_count,
        });
      } else {
        throw new Error('Unexpected response from GitHub API');
      }
    } catch (error) {
      console.error('Unstar repository error:', error);

      if (error.response?.status === 401) {
        return res.status(401).json({
          error: 'Authentication Error',
          message: 'GitHub authentication expired. Please re-authenticate.'
        });
      }

      if (error.response?.status === 404) {
        return res.status(404).json({
          error: 'Repository Not Found',
          message: 'The repository could not be found'
        });
      }

      res.status(500).json({
        error: 'Unstar Error',
        message: 'Failed to unstar repository'
      });
    }
  };

  /**
   * Check if user has starred the repository
   */
  checkStarStatus = async (req, res) => {
    try {
      if (!req.session.githubAccessToken) {
        return res.json({
          authenticated: false,
          isStarred: false,
          message: 'Not authenticated'
        });
      }

      try {
        const response = await axios.get(
          `${this.githubApiBaseUrl}/user/starred/${this.repoOwner}/${this.repoName}`,
          {
            headers: {
              'Authorization': `Bearer ${req.session.githubAccessToken}`,
              'Accept': 'application/vnd.github+json',
            },
          }
        );

        // If we get a 200, the repo is starred
        res.json({
          authenticated: true,
          isStarred: response.status === 200,
          message: 'Repository is starred'
        });
      } catch (error) {
        if (error.response?.status === 404) {
          // 404 means not starred
          res.json({
            authenticated: true,
            isStarred: false,
            message: 'Repository is not starred'
          });
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.error('Check star status error:', error);
      res.status(500).json({
        error: 'Status Check Error',
        message: 'Failed to check star status'
      });
    }
  };
}

export default new GitHubController();