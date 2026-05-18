import nodemailer from 'nodemailer';

let transporter = null;

// Fonction pour initialiser Ethereal (appelée au démarrage)
const initEthereal = async () => {
  try {
    // Créer un compte de test Ethereal
    const testAccount = await nodemailer.createTestAccount();
    
    // Configurer le transporteur avec le compte de test
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
    
    console.log('✅ Email de test configuré avec Ethereal');
    console.log(`   👀 Voir les emails: https://ethereal.email/login`);
    console.log(`   📧 Login email: ${testAccount.user}`);
    console.log(`   🔑 Mot de passe: ${testAccount.pass}`);
    console.log(`   💡 Les emails seront visibles sur le site Ethereal`);
  } catch (error) {
    console.error('❌ Erreur configuration email:', error.message);
    console.log('   Les emails ne seront pas envoyés');
  }
};

// Lancer l'initialisation
initEthereal();

// Template email confirmation soumission
export const getEmailSoumission = (data) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Confirmation candidature</title>
  <style>
    body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #1e5a3a, #2e7d54); padding: 30px; text-align: center; }
    .header h1 { color: white; margin: 0; }
    .content { padding: 30px; }
    .info-box { background: #f0fdf4; border-radius: 12px; padding: 20px; margin: 20px 0; }
    .reference { background: #fef3c7; border-radius: 12px; padding: 15px; margin: 20px 0; text-align: center; }
    .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; border-top: 1px solid #e5e7eb; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎓 Université de Moundou</h1>
      <p>Confirmation de votre candidature</p>
    </div>
    <div class="content">
      <p>Bonjour <strong>${data.prenom} ${data.nom}</strong>,</p>
      <p>Nous accusons réception de votre dossier de candidature pour l'année académique <strong>2025-2026</strong>.</p>
      
      <div class="info-box">
        <h3>📋 Récapitulatif</h3>
        <p><strong>Filière:</strong> ${data.filiere}</p>
        <p><strong>Niveau:</strong> ${data.niveau} - ${data.sousNiveau}</p>
        <p><strong>Référence:</strong> ${data.reference}</p>
      </div>
      
      <div class="reference">
        <p>📌 Conservez votre référence : <strong>${data.reference}</strong></p>
        <p style="font-size: 12px;">Vous pourrez suivre l'état de votre dossier avec cette référence</p>
      </div>
      
      <p><strong>📌 Prochaines étapes :</strong></p>
      <ul>
        <li>Notre équipe examinera votre dossier sous 48h</li>
        <li>Vous recevrez un email de validation ou de rejet</li>
        <li>En cas de validation, vous pourrez effectuer le paiement en ligne</li>
      </ul>
    </div>
    <div class="footer">
      <p>Université de Moundou - Service des admissions</p>
      <p>📞 +235 XX XX XX XX | ✉️ admissions@univ-moundou.td</p>
    </div>
  </div>
</body>
</html>
`;

// Template email validation
export const getEmailValidation = (data, status, commentaire) => {
  const isValide = status === 'valide';
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${isValide ? 'Candidature Validée' : 'Candidature Non Retenue'}</title>
  <style>
    body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.1); }
    .header { background: ${isValide ? 'linear-gradient(135deg, #166534, #22c55e)' : 'linear-gradient(135deg, #991b1b, #dc2626)'}; padding: 30px; text-align: center; }
    .header h1 { color: white; margin: 0; }
    .content { padding: 30px; }
    .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; border-top: 1px solid #e5e7eb; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${isValide ? '✅ Candidature Validée' : '❌ Candidature Non Retenue'}</h1>
    </div>
    <div class="content">
      <p>Bonjour <strong>${data.prenom} ${data.nom}</strong>,</p>
      ${isValide ? `
        <p>Félicitations ! Votre candidature à l'Université de Moundou a été <strong>validée</strong>.</p>
        <div class="info-box" style="background:#f0fdf4; padding:15px; border-radius:12px;">
          <h3>🎉 Prochaines étapes :</h3>
          <ul>
            <li>Connectez-vous à votre espace candidat</li>
            <li>Effectuez le paiement des frais d'inscription</li>
          </ul>
        </div>
      ` : `
        <p>Après examen de votre dossier, votre candidature <strong>n'a pas été retenue</strong>.</p>
        ${commentaire ? `<p><strong>Motif :</strong> ${commentaire}</p>` : ''}
      `}
    </div>
    <div class="footer">
      <p>Université de Moundou</p>
    </div>
  </div>
</body>
</html>
  `;
};

// Envoyer email
export const sendEmail = async (to, subject, html) => {
  if (!transporter) {
    console.log(`📧 [SIMULATION] Email à ${to}: ${subject}`);
    return { success: true, simulated: true };
  }
  
  try {
    const info = await transporter.sendMail({
      from: '"Université de Moundou" <no-reply@ethereal.email>',
      to,
      subject,
      html
    });
    
    console.log(`✅ Email envoyé à ${to}`);
    console.log(`   🔍 Prévisualisation: ${nodemailer.getTestMessageUrl(info)}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ Erreur envoi email à ${to}:`, error.message);
    return { success: false, error: error.message };
  }
};