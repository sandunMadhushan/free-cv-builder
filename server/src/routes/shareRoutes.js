import express from 'express';
import { cvController } from '../controllers/cvController.js';

const router = express.Router();

// Public sharing endpoint - no authentication required
router.get('/:shareId', cvController.getByShareId);  // Get CV by share ID (public)

export default router;