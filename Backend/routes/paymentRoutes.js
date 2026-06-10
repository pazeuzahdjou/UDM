import express from 'express';
import { query } from '../config/database.js';

const router = express.Router();

// Initier un paiement Airtel (simulation)
router.post('/airtel/initiate', async (req, res) => {
  try {
    const { candidatureId, amount, phone, reference } = req.body;
    console.log('💰 Paiement Airtel simulé:', { candidatureId, amount, phone, reference });
    
    const transactionId = `TXN-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    
    res.json({
      success: true,
      transactionId,
      message: 'Paiement initié avec succès'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Vérifier statut paiement Airtel
router.get('/airtel/status/:transactionId', async (req, res) => {
  res.json({ success: true, status: 'SUCCESS' });
});

// Initier un paiement Moov
router.post('/moov/initiate', async (req, res) => {
  const transactionId = `MOOV-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  res.json({ success: true, transactionId });
});

// Vérifier statut paiement Moov
router.get('/moov/status/:transactionId', async (req, res) => {
  res.json({ success: true, status: 'SUCCESS' });
});

// Confirmer un paiement
router.post('/confirm', async (req, res) => {
  try {
    const { candidatureId, reference, amount, method, phone } = req.body;
    console.log('✅ Paiement confirmé:', { candidatureId, reference, amount, method, phone });
    
    // Mettre à jour le statut dans la base
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
    console.error('Erreur:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;