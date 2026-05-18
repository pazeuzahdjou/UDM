import express from 'express';
import { uploadAdmissionDocs } from '../middlewares/uploadMiddlewares.js';
import { 
  soumettreCandidature, 
  verifierStatut, 
  enregistrerPaiement,
  confirmerPaiement,
  soumettreReinscription 
} from '../controllers/admissionController.js';

const router = express.Router();

// Soumettre candidature (nouvel étudiant)
router.post('/admissions', uploadAdmissionDocs, soumettreCandidature);

// Soumettre réinscription (ancien étudiant)
router.post('/reinscription', soumettreReinscription);

// Vérifier statut
router.get('/statut/:reference', verifierStatut);

// Enregistrer paiement
router.post('/payments', enregistrerPaiement);

// Confirmation paiement
router.post('/payments/confirm', confirmerPaiement);

export default router;