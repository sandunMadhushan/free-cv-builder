import express from 'express';
import githubController from '../controllers/githubController.js';

const router = express.Router();

/**
 * GitHub Authentication Routes
 */

// @route   GET /api/auth/github
// @desc    Initiate GitHub OAuth flow
// @access  Public
router.get('/github', githubController.initiateAuth);

// @route   GET /api/auth/github/callback
// @desc    Handle GitHub OAuth callback
// @access  Public
router.get('/github/callback', githubController.handleAuthCallback);

// @route   GET /api/auth/status
// @desc    Get current authentication status
// @access  Public
router.get('/status', githubController.getAuthStatus);

// @route   POST /api/auth/session
// @desc    Set authentication session with user data from popup
// @access  Public
router.post('/session', githubController.setAuthSession);

// @route   GET /api/auth/token/:token
// @desc    Retrieve authentication data using temporary token
// @access  Public
router.get('/token/:token', githubController.getAuthByToken);

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Public
router.post('/logout', githubController.logout);

/**
 * GitHub Repository Routes
 */

// @route   GET /api/auth/repo/stars
// @desc    Get repository star count
// @access  Public
router.get('/repo/stars', githubController.getStarCount);

// @route   POST /api/auth/repo/star
// @desc    Star the repository
// @access  Private (requires GitHub auth)
router.post('/repo/star', githubController.starRepository);

// @route   DELETE /api/auth/repo/star
// @desc    Unstar the repository
// @access  Private (requires GitHub auth)
router.delete('/repo/star', githubController.unstarRepository);

// @route   GET /api/auth/repo/star/status
// @desc    Check if user has starred the repository
// @access  Private (requires GitHub auth)
router.get('/repo/star/status', githubController.checkStarStatus);

export default router;