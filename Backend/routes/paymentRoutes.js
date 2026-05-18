import express from 'express';
import Admission from '../models/Admission.js';
import { 
  initierPaiementAirtel, 
  verifierStatutPaiementAirtel,
  initierPaiementMoov,
  verifierStatutPaiementMoov,
  simulerPaiement
} from '../services/paymentService.js';

const router = express.Router();

// Mode simulation (true pour tester sans API réelle)
const USE_SIMULATION = true; // Mettre à false quand les API sont prêtes

// ============ Démarrer un paiement Airtel Money ============
router.post('/airtel/initiate', async (req, res) => {
  try {
    const { candidatureId, amount, phone, reference } = req.body;
    
    console.log(`📱 Paiement Airtel demandé: ${amount} FCFA, téléphone: ${phone}`);
    
    // Vérifier que la candidature existe
    const candidature = await Admission.findById(candidatureId);
    if (!candidature) {
      return res.status(404).json({ success: false, message: 'Candidature non trouvée' });
    }
    
    let paymentResult;
    
    if (USE_SIMULATION) {
      paymentResult = await simulerPaiement(amount, phone, reference);
    } else {
      paymentResult = await initierPaiementAirtel(amount, phone, reference);
    }
    
    if (paymentResult.success) {
      // Sauvegarder la transaction en base
      candidature.paymentStatus = 'en_attente';
      candidature.paymentReference = paymentResult.transactionId;
      candidature.paymentPhone = phone;
      candidature.modePaiement = 'Airtel Money';
      await candidature.save();
      
      res.json({
        success: true,
        transactionId: paymentResult.transactionId,
        message: paymentResult.message
      });
    } else {
      res.status(400).json({ success: false, message: paymentResult.message });
    }
  } catch (error) {
    console.error('Erreur initiation paiement Airtel:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// ============ Vérifier statut paiement Airtel ============
router.get('/airtel/status/:transactionId', async (req, res) => {
  try {
    const { transactionId } = req.params;
    
    let statusResult;
    
    if (USE_SIMULATION) {
      // En simulation, retourner succès après quelques secondes
      statusResult = { success: true, status: 'SUCCESS' };
    } else {
      statusResult = await verifierStatutPaiementAirtel(transactionId);
    }
    
    // Si le paiement est confirmé, mettre à jour la base
    if (statusResult.status === 'SUCCESS' || statusResult.status === 'SUCCESSFUL') {
      const candidature = await Admission.findOne({ paymentReference: transactionId });
      if (candidature && candidature.paymentStatus !== 'paye') {
        candidature.paymentStatus = 'paye';
        candidature.paymentDate = new Date();
        await candidature.save();
        console.log(`✅ Paiement confirmé pour la candidature ${candidature.reference}`);
      }
    }
    
    res.json(statusResult);
  } catch (error) {
    console.error('Erreur vérification statut:', error);
    res.status(500).json({ success: false, status: 'ERROR', message: 'Erreur serveur' });
  }
});

// ============ Démarrer un paiement Moov Money ============
router.post('/moov/initiate', async (req, res) => {
  try {
    const { candidatureId, amount, phone, reference } = req.body;
    
    console.log(`📱 Paiement Moov demandé: ${amount} FCFA, téléphone: ${phone}`);
    
    const candidature = await Admission.findById(candidatureId);
    if (!candidature) {
      return res.status(404).json({ success: false, message: 'Candidature non trouvée' });
    }
    
    let paymentResult;
    
    if (USE_SIMULATION) {
      paymentResult = await simulerPaiement(amount, phone, reference);
    } else {
      paymentResult = await initierPaiementMoov(amount, phone, reference);
    }
    
    if (paymentResult.success) {
      candidature.paymentStatus = 'en_attente';
      candidature.paymentReference = paymentResult.transactionId;
      candidature.paymentPhone = phone;
      candidature.modePaiement = 'Moov Money';
      await candidature.save();
      
      res.json({
        success: true,
        transactionId: paymentResult.transactionId,
        message: paymentResult.message
      });
    } else {
      res.status(400).json({ success: false, message: paymentResult.message });
    }
  } catch (error) {
    console.error('Erreur initiation paiement Moov:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// ============ Vérifier statut paiement Moov ============
router.get('/moov/status/:transactionId', async (req, res) => {
  try {
    const { transactionId } = req.params;
    
    let statusResult;
    
    if (USE_SIMULATION) {
      statusResult = { success: true, status: 'SUCCESS' };
    } else {
      statusResult = await verifierStatutPaiementMoov(transactionId);
    }
    
    if (statusResult.status === 'SUCCESS' || statusResult.status === 'SUCCESSFUL') {
      const candidature = await Admission.findOne({ paymentReference: transactionId });
      if (candidature && candidature.paymentStatus !== 'paye') {
        candidature.paymentStatus = 'paye';
        candidature.paymentDate = new Date();
        await candidature.save();
      }
    }
    
    res.json(statusResult);
  } catch (error) {
    console.error('Erreur vérification statut Moov:', error);
    res.status(500).json({ success: false, status: 'ERROR', message: 'Erreur serveur' });
  }
});

// ============ Paiement direct (sans redirection) ============
router.post('/direct', async (req, res) => {
  try {
    const { candidatureId, amount, method, phone, reference } = req.body;
    
    let paymentResult;
    
    if (method === 'airtel') {
      paymentResult = await initierPaiementAirtel(amount, phone, reference);
    } else if (method === 'moov') {
      paymentResult = await initierPaiementMoov(amount, phone, reference);
    } else {
      paymentResult = await simulerPaiement(amount, phone, reference);
    }
    
    if (paymentResult.success) {
      const candidature = await Admission.findById(candidatureId);
      if (candidature) {
        candidature.paymentStatus = 'en_attente';
        candidature.paymentReference = paymentResult.transactionId;
        candidature.paymentPhone = phone;
        candidature.modePaiement = method === 'airtel' ? 'Airtel Money' : 'Moov Money';
        await candidature.save();
      }
      
      res.json({
        success: true,
        transactionId: paymentResult.transactionId,
        message: 'Paiement initié avec succès'
      });
    } else {
      res.status(400).json({ success: false, message: paymentResult.message });
    }
  } catch (error) {
    console.error('Erreur paiement direct:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// ============ Confirmer paiement (callback) ============
router.post('/confirm', async (req, res) => {
  try {
    const { candidatureId, reference, amount, method, phone } = req.body;
    
    const candidature = await Admission.findById(candidatureId);
    
    if (!candidature) {
      return res.status(404).json({ success: false, message: 'Candidature non trouvée' });
    }
    
    candidature.paymentStatus = 'paye';
    candidature.paymentReference = reference;
    candidature.paymentDate = new Date();
    candidature.paymentPhone = phone;
    candidature.modePaiement = method === 'airtel' ? 'Airtel Money' : 'Moov Money';
    
    await candidature.save();
    
    console.log(`✅ Paiement confirmé pour ${candidature.nom} ${candidature.prenom}`);
    
    res.json({ 
      success: true, 
      message: 'Paiement confirmé avec succès',
      reference: reference
    });
  } catch (error) {
    console.error('Erreur confirmation paiement:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

export default router;