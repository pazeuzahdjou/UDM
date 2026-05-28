import express from 'express';
import Payment from '../models/Payment.js';
import Admission from '../models/Admission.js';
import { confirmerPaiementAdmin, genererRecuPDF, verifierPaiementExterne } from '../services/paymentService.js';
import { protect, isAdmin } from '../middlewares/authMiddleware.js';
import { sendEmail } from '../services/mailService.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

// ============ POUR L'ÉTUDIANT ============

// Initier un paiement (étudiant)
router.post('/initiate', protect, async (req, res) => {
  try {
    const { candidatureId, amount, method, phone } = req.body;
    
    const candidature = await Admission.findById(candidatureId);
    if (!candidature) return res.status(404).json({ message: 'Candidature non trouvée' });
    if (candidature.email !== req.user.email) return res.status(403).json({ message: 'Non autorisé' });
    
    // Vérifier que la candidature est validée
    if (candidature.status !== 'valide') {
      return res.status(400).json({ message: 'Cette candidature n\'est pas encore validée' });
    }
    
    // Créer l'enregistrement de paiement
    const payment = new Payment({
      candidatureId,
      reference: `PAY-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      amount,
      method,
      phone,
      status: 'en_attente'
    });
    
    await payment.save();
    
    res.json({
      success: true,
      paymentId: payment._id,
      reference: payment.reference,
      message: 'Paiement initié. En attente de confirmation administrative.'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Vérifier le statut d'un paiement (étudiant)
router.get('/status/:paymentId', protect, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.paymentId).populate('candidatureId');
    if (!payment) return res.status(404).json({ message: 'Paiement non trouvé' });
    if (payment.candidatureId.email !== req.user.email) return res.status(403).json({ message: 'Non autorisé' });
    
    res.json({
      status: payment.status,
      reference: payment.reference,
      confirmedAt: payment.confirmedAt,
      receiptUrl: payment.receiptUrl,
      amount: payment.amount
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Télécharger le reçu (étudiant)
router.get('/receipt/:paymentId', protect, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.paymentId).populate('candidatureId');
    if (!payment) return res.status(404).json({ message: 'Paiement non trouvé' });
    if (payment.candidatureId.email !== req.user.email) return res.status(403).json({ message: 'Non autorisé' });
    if (payment.status !== 'confirme') return res.status(400).json({ message: 'Paiement non confirmé' });
    
    const filepath = path.join(__dirname, '../uploads/reçus', path.basename(payment.receiptUrl));
    res.download(filepath);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ============ POUR L'ADMINISTRATEUR ============

// Lister tous les paiements (admin)
router.get('/admin/list', protect, isAdmin, async (req, res) => {
  try {
    const { status, search } = req.query;
    const filter = {};
    if (status && status !== 'tous') filter.status = status;
    if (search) filter.reference = { $regex: search, $options: 'i' };
    
    const payments = await Payment.find(filter)
      .populate('candidatureId', 'nom prenom email filiere reference')
      .sort({ initiatedAt: -1 });
    
    res.json({ success: true, payments });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Statistiques des paiements (admin)
router.get('/admin/stats', protect, isAdmin, async (req, res) => {
  try {
    const total = await Payment.countDocuments();
    const en_attente = await Payment.countDocuments({ status: 'en_attente' });
    const confirme = await Payment.countDocuments({ status: 'confirme' });
    const echoue = await Payment.countDocuments({ status: 'echoue' });
    
    const montantTotalResult = await Payment.aggregate([
      { $match: { status: 'confirme' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    res.json({
      total,
      en_attente,
      confirme,
      echoue,
      montantTotal: montantTotalResult[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Confirmer un paiement (admin)
router.put('/admin/confirm/:paymentId', protect, isAdmin, async (req, res) => {
  try {
    const { adminNotes } = req.body;
    const payment = await confirmerPaiementAdmin(req.params.paymentId, req.user._id, adminNotes);
    res.json({ success: true, payment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Rejeter un paiement (admin)
router.put('/admin/reject/:paymentId', protect, isAdmin, async (req, res) => {
  try {
    const { reason } = req.body;
    const payment = await Payment.findById(req.params.paymentId);
    if (!payment) return res.status(404).json({ message: 'Paiement non trouvé' });
    
    payment.status = 'echoue';
    payment.adminNotes = reason;
    await payment.save();
    
    // Envoyer email à l'étudiant
    const candidature = await Admission.findById(payment.candidatureId);
    await sendEmail(
      candidature.email,
      '❌ Paiement non confirmé - Université de Moundou',
      `<h1>Paiement non confirmé</h1><p>Votre paiement n'a pas pu être confirmé. Motif: ${reason}</p><p>Veuillez contacter l'administration.</p>`
    );
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

export default router;