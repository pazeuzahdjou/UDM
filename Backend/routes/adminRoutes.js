import express from 'express';
import { protect, isAdmin } from '../middlewares/authMiddleware.js';
import {
  getCandidatures,
  getStats,
  validerCandidature,
  rejeterCandidature,
  getCandidatureById
} from '../controllers/adminController.js';

const router = express.Router();

// Toutes les routes admin sont protégées
router.use(protect);
router.use(isAdmin);

router.get('/candidatures', getCandidatures);
router.get('/stats', getStats);
router.get('/candidatures/:id', getCandidatureById);
router.put('/candidatures/:id/valider', validerCandidature);
router.put('/candidatures/:id/rejeter', rejeterCandidature);

export default router;