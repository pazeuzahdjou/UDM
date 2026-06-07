import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration du transporteur Gmail
let transporter = null;
let emailEnabled = false;

// Lire le logo en base64 pour l'incorporer dans les emails
let logoBase64 = null;
// 📌 CORRECTION DU CHEMIN - Utilisez le bon dossier
const logoPath = path.join(__dirname, '..', 'images', 'udm2.png'); // ou 'logo.png'

try {
  if (fs.existsSync(logoPath)) {
    const logoBuffer = fs.readFileSync(logoPath);
    logoBase64 = logoBuffer.toString('base64');
    console.log('✅ Logo chargé avec succès depuis:', logoPath);
  } else {
    console.log('⚠️ Logo non trouvé à:', logoPath);
    console.log('   Chemins alternatifs essayés:');
    console.log(`   - ${path.join(__dirname, 'assets', 'images', 'logo.png')}`);
    console.log(`   - ${path.join(__dirname, '..', 'images', 'udm2.png')}`);
  }
} catch (error) {
  console.log('⚠️ Erreur chargement logo:', error.message);
}

// Initialiser le transporteur
const initTransporter = () => {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  
  if (user && pass && pass !== 'votre_mot_de_passe_application_16_caracteres') {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: user,
        pass: pass.replace(/\s/g, '')
      },
      tls: { rejectUnauthorized: false },
      pool: true,
      maxConnections: 5
    });
    
    emailEnabled = true;
    console.log('✅ Email configuré avec succès pour:', user);
    
    transporter.verify((error, success) => {
      if (error) {
        console.error('❌ Erreur email:', error.message);
        emailEnabled = false;
      } else {
        console.log('✅ Serveur email prêt');
      }
    });
  } else {
    console.log('⚠️ Email non configuré - Mode simulation');
  }
};

initTransporter();


const getLogoHtml = () => {
  // Retourner directement le texte sans chercher le logo
  return `<div style="font-size: 20px; font-weight: bold; color: #1e5a3a; text-align: center;">🎓 Université de Moundou</div>`;
};

// ============ TEMPLATES EMAIL AVEC LOGO ============

// 1. Email de confirmation de soumission
export const getEmailSoumission = (candidature) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Confirmation de candidature</title>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #f4f7fc; margin: 0; padding: 20px; }
    .container { max-width: 650px; margin: 0 auto; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #1e5a3a, #2e7d54); padding: 30px; text-align: center; }
    .header h1 { color: white; margin: 10px 0 0; font-size: 24px; }
    .content { padding: 30px; }
    .info-section { background: #f8fafc; border-radius: 15px; padding: 20px; margin: 20px 0; }
    .info-title { font-size: 18px; font-weight: bold; color: #1e5a3a; margin-bottom: 15px; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; }
    .info-row { display: flex; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
    .info-label { width: 40%; font-weight: bold; color: #334155; }
    .info-value { width: 60%; color: #1e293b; }
    .reference-box { background: #fef3c7; border-radius: 15px; padding: 20px; text-align: center; margin: 20px 0; border-left: 4px solid #f59e0b; }
    .reference-code { font-size: 28px; font-weight: bold; color: #92400e; font-family: monospace; letter-spacing: 2px; }
    .btn { display: inline-block; background: #2e7d54; color: white; padding: 12px 30px; text-decoration: none; border-radius: 10px; margin-top: 15px; font-weight: bold; }
    .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; border-top: 1px solid #e5e7eb; }
    .step { display: flex; align-items: center; gap: 12px; margin: 15px 0; }
    .step-number { width: 28px; height: 28px; background: #2e7d54; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      ${getLogoHtml()}
      <h1>🎓 Université de Moundou</h1>
      <p style="color: #c8e6d9; margin: 10px 0 0;">Confirmation de votre candidature</p>
    </div>
    <div class="content">
      <p style="font-size: 16px;">Bonjour <strong>${candidature.prenom} ${candidature.nom}</strong>,</p>
      <p>Nous accusons réception de votre dossier de candidature pour l'année académique <strong>2025-2026</strong>.</p>
      
      <div class="info-section">
        <div class="info-title">📋 Récapitulatif de votre candidature</div>
        <div class="info-row"><div class="info-label">👤 Nom complet :</div><div class="info-value">${candidature.nom} ${candidature.prenom}</div></div>
        <div class="info-row"><div class="info-label">📧 Email :</div><div class="info-value">${candidature.email}</div></div>
        <div class="info-row"><div class="info-label">📞 Téléphone :</div><div class="info-value">${candidature.telephone}</div></div>
        <div class="info-row"><div class="info-label">📚 Filière :</div><div class="info-value">${candidature.filiere}</div></div>
        <div class="info-row"><div class="info-label">📖 Niveau :</div><div class="info-value">${candidature.niveau} ${candidature.sousNiveau || ''}</div></div>
        <div class="info-row"><div class="info-label">💰 Frais d'inscription :</div><div class="info-value"><strong>${candidature.montant?.toLocaleString()} FCFA</strong></div></div>
      </div>
      
      <div class="reference-box">
        <p style="margin: 0 0 10px 0;">📌 Votre référence unique</p>
        <div class="reference-code">${candidature.reference}</div>
        <p style="margin: 10px 0 0 0; font-size: 12px;">Conservez cette référence pour suivre votre dossier</p>
      </div>
      
      <div class="info-section">
        <div class="info-title">📌 Prochaines étapes</div>
        <div class="step"><div class="step-number">1</div><div>Notre équipe examinera votre dossier sous <strong>48 à 72 heures</strong></div></div>
        <div class="step"><div class="step-number">2</div><div>Vous recevrez un email de <strong>validation ou de rejet</strong></div></div>
        <div class="step"><div class="step-number">3</div><div>En cas de validation, vous pourrez effectuer le <strong>paiement en ligne</strong></div></div>
      </div>
      
      <div style="text-align: center;">
        <a href="http://localhost:5173/admission" class="btn">🔍 Suivre ma candidature</a>
      </div>
    </div>
    <div class="footer">
      <p>Université de Moundou - Service des Admissions</p>
      <p>📞 +235 63 89 98 36 | ✉️ ${process.env.EMAIL_USER || 'admissions@univ-moundou.td'}</p>
      <p>© ${new Date().getFullYear()} Tous droits réservés</p>
    </div>
  </div>
</body>
</html>
`;

// 2. Email de validation
export const getEmailValidation = (candidature, commentaire) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Candidature Validée</title>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #f4f7fc; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #166534, #22c55e); padding: 30px; text-align: center; }
    .header h1 { color: white; margin: 10px 0 0; }
    .content { padding: 30px; }
    .success-box { background: #f0fdf4; border-radius: 15px; padding: 20px; margin: 20px 0; border-left: 4px solid #22c55e; }
    .payment-info { background: #e0f2fe; border-radius: 15px; padding: 20px; margin: 20px 0; text-align: center; }
    .btn { display: inline-block; background: #166534; color: white; padding: 14px 35px; text-decoration: none; border-radius: 10px; margin-top: 10px; font-weight: bold; font-size: 16px; }
    .btn-payment { background: linear-gradient(135deg, #f59e0b, #ea580c); }
    .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; border-top: 1px solid #e5e7eb; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      ${getLogoHtml()}
      <h1>✅ Félicitations !</h1>
    </div>
    <div class="content">
      <p>Bonjour <strong>${candidature.prenom} ${candidature.nom}</strong>,</p>
      <p>Nous avons le plaisir de vous informer que votre dossier de candidature a été <strong>validé</strong> par notre commission d'admission.</p>
      
      <div class="success-box">
        <h3 style="margin: 0 0 15px 0; color: #166534;">🎉 Votre admission est confirmée</h3>
        <p><strong>📚 Filière :</strong> ${candidature.filiere}</p>
        <p><strong>📖 Niveau :</strong> ${candidature.niveau} ${candidature.sousNiveau || ''}</p>
        <p><strong>📌 Référence :</strong> ${candidature.reference}</p>
        ${commentaire ? `<p><strong>📝 Commentaire :</strong> ${commentaire}</p>` : ''}
      </div>
      
      <div class="payment-info">
        <h3 style="margin: 0 0 15px 0;">💰 Procédez au paiement</h3>
        <p style="font-size: 14px;">Frais d'inscription : <strong style="font-size: 24px;">${candidature.montant?.toLocaleString()} FCFA</strong></p>
        <p>📍 Modes de paiement acceptés : <strong>AIRTEL MONEY</strong> et <strong>MOOV MONEY</strong></p>
        <a href="http://localhost:5173/admission" class="btn btn-payment">💳 Payer en ligne</a>
      </div>
    </div>
    <div class="footer">
      <p>Université de Moundou - Service des Admissions</p>
      <p>📞 +235 66 XX XX XX | ✉️ ${process.env.EMAIL_USER || 'admissions@univ-moundou.td'}</p>
    </div>
  </div>
</body>
</html>
`;

// 3. Email de rejet
export const getEmailRejet = (candidature, commentaire) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Candidature Non Retenue</title>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #f4f7fc; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #991b1b, #dc2626); padding: 30px; text-align: center; }
    .header h1 { color: white; margin: 10px 0 0; }
    .content { padding: 30px; }
    .reject-box { background: #fef2f2; border-radius: 15px; padding: 20px; margin: 20px 0; border-left: 4px solid #dc2626; }
    .btn { display: inline-block; background: #166534; color: white; padding: 12px 30px; text-decoration: none; border-radius: 10px; margin-top: 15px; }
    .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; border-top: 1px solid #e5e7eb; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      ${getLogoHtml()}
      <h1>❌ Mise à jour de votre candidature</h1>
    </div>
    <div class="content">
      <p>Bonjour <strong>${candidature.prenom} ${candidature.nom}</strong>,</p>
      <p>Après examen approfondi de votre dossier, nous sommes au regret de vous informer que votre candidature <strong>n'a pas été retenue</strong>.</p>
      
      <div class="reject-box">
        ${commentaire ? `<p><strong>📝 Motif :</strong> ${commentaire}</p>` : '<p>Les critères d\'admission n\'ont pas été remplis pour cette session.</p>'}
      </div>
      
      <p>💡 Vous pouvez soumettre une nouvelle candidature pour la prochaine session.</p>
      
      <div style="text-align: center;">
        <a href="http://localhost:5173/admission" class="btn">📝 Nouvelle candidature</a>
      </div>
    </div>
    <div class="footer">
      <p>Université de Moundou - Service des Admissions</p>
      <p>📞 +235 66 XX XX XX | ✉️ ${process.env.EMAIL_USER || 'admissions@univ-moundou.td'}</p>
    </div>
  </div>
</body>
</html>
`;

// 4. Email de confirmation de paiement
export const getEmailPaiement = (candidature, paymentRef) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Confirmation de paiement</title>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #f4f7fc; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #166534, #22c55e); padding: 30px; text-align: center; }
    .header h1 { color: white; margin: 10px 0 0; }
    .content { padding: 30px; }
    .payment-box { background: #f0fdf4; border-radius: 15px; padding: 20px; margin: 20px 0; text-align: center; }
    .btn { display: inline-block; background: #166534; color: white; padding: 12px 30px; text-decoration: none; border-radius: 10px; margin-top: 15px; }
    .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      ${getLogoHtml()}
      <h1>💰 Paiement confirmé</h1>
    </div>
    <div class="content">
      <p>Bonjour <strong>${candidature.prenom} ${candidature.nom}</strong>,</p>
      <p>Nous avons bien reçu votre paiement pour votre inscription.</p>
      
      <div class="payment-box">
        <p><strong>💰 Montant réglé :</strong> ${candidature.montant?.toLocaleString()} FCFA</p>
        <p><strong>📱 Mode de paiement :</strong> ${candidature.modePaiement || 'Mobile Money'}</p>
        <p><strong>📌 Référence transaction :</strong> ${paymentRef}</p>
      </div>
      
      <p>✅ Votre inscription est maintenant finalisée.</p>
      
      <div style="text-align: center;">
        <a href="http://localhost:5173/profil" class="btn">📄 Télécharger mon attestation</a>
      </div>
    </div>
    <div class="footer">
      <p>Université de Moundou - Service des Admissions</p>
      <p>📞 +235 66 XX XX XX | ✉️ ${process.env.EMAIL_USER || 'admissions@univ-moundou.td'}</p>
    </div>
  </div>
</body>
</html>
`;

// 5. Email de confirmation de réinscription
export const getEmailReinscription = (candidature) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Confirmation de réinscription</title>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #f4f7fc; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #1e5a3a, #2e7d54); padding: 30px; text-align: center; }
    .header h1 { color: white; margin: 10px 0 0; }
    .content { padding: 30px; }
    .info-box { background: #f0fdf4; border-radius: 15px; padding: 20px; margin: 20px 0; }
    .btn { display: inline-block; background: #2e7d54; color: white; padding: 12px 30px; text-decoration: none; border-radius: 10px; margin-top: 15px; }
    .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      ${getLogoHtml()}
      <h1>🔄 Confirmation de réinscription</h1>
    </div>
    <div class="content">
      <p>Bonjour <strong>${candidature.prenom} ${candidature.nom}</strong>,</p>
      <p>Votre réinscription pour l'année académique <strong>2025-2026</strong> a été enregistrée avec succès.</p>
      
      <div class="info-box">
        <p><strong>📌 Matricule :</strong> ${candidature.matricule}</p>
        <p><strong>📚 Filière :</strong> ${candidature.filiere}</p>
        <p><strong>📖 Niveau :</strong> ${candidature.niveau}</p>
        <p><strong>💰 Frais de scolarité :</strong> 100 000 FCFA (50 000 + 50 000)</p>
      </div>
      
      <div style="text-align: center;">
        <a href="http://localhost:5173/admission" class="btn">💰 Payer en ligne</a>
      </div>
    </div>
    <div class="footer">
      <p>Université de Moundou - Service des Admissions</p>
      <p>📞 +235 66 XX XX XX | ✉️ ${process.env.EMAIL_USER || 'admissions@univ-moundou.td'}</p>
    </div>
  </div>
</body>
</html>
`;

// ============ FONCTION PRINCIPALE D'ENVOI ============

export const sendEmail = async (to, subject, html) => {
  if (!emailEnabled || !transporter) {
    console.log(`📧 [SIMULATION] Email à ${to}: ${subject}`);
    return { success: true, simulated: true };
  }
  
  try {
    const info = await transporter.sendMail({
      from: `"Université de Moundou" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      html: html,
      bcc: process.env.ADMIN_EMAIL
    });
    
    console.log(`✅ Email envoyé à ${to}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ Erreur email:`, error.message);
    return { success: false, error: error.message };
  }
};