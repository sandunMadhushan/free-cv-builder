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

      // Verify state parameter
      if (state !== req.session.githubOAuthState) {
        return res.status(400).json({
          error: 'Invalid State',
          message: 'OAuth state mismatch'
        });
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

      // Redirect to client with success
      const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
      res.redirect(`${clientUrl}?github_auth=success`);
    } catch (error) {
      console.error('GitHub auth callback error:', error);
      const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
      res.redirect(`${clientUrl}?github_auth=error&message=${encodeURIComponent('Authentication failed')}`);
    }
  };

  /**
   * Get current user's authentication status
   */
  getAuthStatus = (req, res) => {
    try {
      if (req.session.githubUser && req.session.githubAccessToken) {
        res.json({
          authenticated: true,
          user: req.session.githubUser,
        });
      } else {
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
      const response = await axios.get(
        `${this.githubApiBaseUrl}/repos/${this.repoOwner}/${this.repoName}`,
        {
          headers: {
            'Accept': 'application/vnd.github+json',
          },
        }
      );

      res.json({
        starCount: response.data.stargazers_count,
        watchersCount: response.data.watchers_count,
        forksCount: response.data.forks_count,
      });
    } catch (error) {
      console.error('Get star count error:', error);
      res.status(500).json({
        error: 'API Error',
        message: 'Failed to fetch star count',
        starCount: 0,
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