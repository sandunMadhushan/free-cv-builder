import express from 'express';
import { cvController } from '../controllers/cvController.js';

const router = express.Router();

// CV CRUD endpoints
router.post('/', cvController.create);           // Create new CV
router.get('/:id', cvController.getById);       // Get CV by ID
router.put('/:id', cvController.update);        // Update CV
router.delete('/:id', cvController.delete);     // Delete CV

// Sharing endpoints
router.post('/:id/public', cvController.makePublic);      // Make CV public
router.post('/:id/private', cvController.makePrivate);    // Make CV private
router.get('/:id/analytics', cvController.getAnalytics);  // Get CV analytics

export default router;