import express from 'express';
import { 
  login, 
  register,
  changePassword, 
  getProfil, 
  updateProfil, 
  getMesCandidatures, 
  getAttestation 
} from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Routes publiques
router.post('/login', login);
router.post('/register', register);

// Routes protégées
router.use(protect);
router.get('/profil', getProfil);
router.put('/profil', updateProfil);
router.put('/change-password', changePassword);
router.get('/mes-candidatures', getMesCandidatures);
router.get('/attestation/:candidatureId', getAttestation);

export default router;