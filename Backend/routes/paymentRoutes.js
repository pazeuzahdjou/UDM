import express from 'express';
import { query } from '../config/database.js';
import { 
  initierPaiementAirtel, 
  verifierStatutPaiementAirtel,
  simulerPaiement
} from '../services/paymentService.js';

const router = express.Router();

// Mode simulation (true pour tester sans API réelle)
const USE_SIMULATION = process.env.USE_SIMULATION === 'true' || true;

// ============ Démarrer un paiement Airtel Money ============
router.post('/airtel/initiate', async (req, res) => {
  try {
    const { candidatureId, amount, phone, reference } = req.body;
    
    console.log(`📱 Paiement Airtel demandé: ${amount} FCFA, téléphone: ${phone}`);
    
    let paymentResult;
    
    if (USE_SIMULATION) {
      paymentResult = await simulerPaiement(amount, phone, reference);
    } else {
      paymentResult = await initierPaiementAirtel(amount, phone, reference);
    }
    
    if (paymentResult.success) {
      // Sauvegarder la transaction en base
      await query(
        `UPDATE admissions 
         SET paymentstatus = 'en_attente', 
             paymentreference = $1, 
             paymentphone = $2, 
             modepaiement = 'Airtel Money'
         WHERE id = $3 OR reference = $4`,
        [paymentResult.transactionId, phone, candidatureId, reference]
      );
      
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
      statusResult = { success: true, status: 'SUCCESS' };
    } else {
      statusResult = await verifierStatutPaiementAirtel(transactionId);
    }
    
    // Si le paiement est confirmé, mettre à jour la base
    if (statusResult.status === 'SUCCESS' || statusResult.status === 'SUCCESSFUL') {
      await query(
        `UPDATE admissions 
         SET paymentstatus = 'paye', 
             paymentdate = NOW()
         WHERE paymentreference = $1 AND paymentstatus != 'paye'`,
        [transactionId]
      );
      console.log(`✅ Paiement confirmé pour la transaction ${transactionId}`);
    }
    
    res.json(statusResult);
  } catch (error) {
    console.error('Erreur vérification statut:', error);
    res.status(500).json({ success: false, status: 'ERROR', message: 'Erreur serveur' });
  }
});

// ============ Confirmer paiement ============
router.post('/confirm', async (req, res) => {
  try {
    const { candidatureId, reference, amount, method, phone } = req.body;
    
    await query(
      `UPDATE admissions 
       SET paymentstatus = 'paye', 
           paymentreference = $1, 
           paymentphone = $2, 
           modepaiement = $3,
           paymentdate = NOW()
       WHERE id = $4 OR reference = $5`,
      [reference, phone, method === 'airtel' ? 'Airtel Money' : 'Moov Money', candidatureId, reference]
    );
    
    res.json({ success: true, message: 'Paiement confirmé', reference });
  } catch (error) {
    console.error('Erreur confirmation paiement:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

export default router;