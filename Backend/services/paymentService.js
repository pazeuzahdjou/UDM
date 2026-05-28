import Payment from '../models/Payment.js';
import Admission from '../models/Admission.js';
import { sendEmail } from './mailService.js';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Générer un reçu PDF
export const genererRecuPDF = async (payment, candidature) => {
  const receiptsDir = path.join(__dirname, '../uploads/reçus');
  if (!fs.existsSync(receiptsDir)) fs.mkdirSync(receiptsDir, { recursive: true });
  
  const filename = `recu_${payment.reference}.pdf`;
  const filepath = path.join(receiptsDir, filename);
  
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(filepath));
  
  doc.fontSize(20).text('UNIVERSITÉ DE MOUNDOU', { align: 'center' });
  doc.moveDown();
  doc.fontSize(16).text('REÇU DE PAIEMENT', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12);
  doc.text(`Référence transaction: ${payment.reference}`);
  doc.text(`Date: ${new Date(payment.confirmedAt || Date.now()).toLocaleString('fr-FR')}`);
  doc.text(`Montant: ${payment.amount.toLocaleString()} FCFA`);
  doc.text(`Mode: ${payment.method === 'airtel' ? 'AIRTEL MONEY' : 'MOOV MONEY'}`);
  doc.text(`Téléphone: ${payment.phone}`);
  doc.moveDown();
  doc.text(`Étudiant: ${candidature.nom} ${candidature.prenom}`);
  doc.text(`Matricule: ${candidature.matricule || 'En cours d\'attribution'}`);
  doc.text(`Filière: ${candidature.filiere}`);
  doc.moveDown();
  doc.text('Statut: PAYÉ', { color: 'green' });
  doc.moveDown();
  doc.text('Cachet et signature :', { align: 'right' });
  doc.text('Le Receveur Financier', { align: 'right' });
  
  doc.end();
  return `/uploads/reçus/${filename}`;
};

// Confirmer un paiement (après validation admin)
export const confirmerPaiementAdmin = async (paymentId, adminId, adminNotes) => {
  const payment = await Payment.findById(paymentId).populate('candidatureId');
  if (!payment) throw new Error('Paiement non trouvé');
  
  payment.status = 'confirme';
  payment.confirmedAt = new Date();
  payment.confirmedBy = adminId;
  payment.adminNotes = adminNotes;
  await payment.save();
  
  // Mettre à jour la candidature
  const candidature = payment.candidatureId;
  candidature.paymentStatus = 'paye';
  candidature.paymentReference = payment.reference;
  candidature.paymentDate = new Date();
  await candidature.save();
  
  // Générer le reçu
  const receiptUrl = await genererRecuPDF(payment, candidature);
  payment.receiptUrl = receiptUrl;
  await payment.save();
  
  // Envoyer email à l'étudiant avec le reçu
  await sendEmail(
    candidature.email,
    '💰 Paiement confirmé - Université de Moundou',
    `
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"></head>
    <body style="font-family: Arial, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #166534, #22c55e); padding: 30px; text-align: center; border-radius: 20px 20px 0 0;">
          <h1 style="color: white;">💰 Paiement Confirmé</h1>
        </div>
        <div style="background: #f0fdf4; padding: 30px; border-radius: 0 0 20px 20px;">
          <p>Bonjour <strong>${candidature.prenom} ${candidature.nom}</strong>,</p>
          <p>Nous avons bien reçu votre paiement de <strong>${payment.amount.toLocaleString()} FCFA</strong>.</p>
          <div style="background: white; padding: 15px; border-radius: 10px; margin: 20px 0;">
            <p><strong>📌 Référence transaction:</strong> ${payment.reference}</p>
            <p><strong>📅 Date:</strong> ${new Date(payment.confirmedAt).toLocaleString('fr-FR')}</p>
            <p><strong>📱 Mode:</strong> ${payment.method === 'airtel' ? 'Airtel Money' : 'Moov Money'}</p>
          </div>
          <p>Votre attestation d'inscription est maintenant disponible dans votre espace étudiant.</p>
          <hr style="margin: 20px 0;">
          <p style="font-size: 12px; color: #666;">Ceci est une confirmation officielle. Conservez ce justificatif.</p>
        </div>
      </div>
    </body>
    </html>
    `
  );
  
  return payment;
};

// Vérifier un paiement (simulation)
export const verifierPaiementExterne = async (transactionId, provider) => {
  // Simulation - à remplacer par vraie API
  return {
    success: true,
    status: 'SUCCESS',
    providerReference: `REF-${Date.now()}`
  };
};