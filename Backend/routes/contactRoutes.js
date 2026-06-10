import express from 'express';
const router = express.Router();

router.post('/', async (req, res) => {
  const { nom, email, sujet, message } = req.body;

  if (!nom || !email || !message) {
    return res.status(400).json({ 
      success: false, 
      message: "Champs obligatoires manquants" 
    });
  }

  try {
    console.log('📩 Nouveau message de contact:');
    console.log(`   Nom: ${nom}`);
    console.log(`   Email: ${email}`);
    console.log(`   Sujet: ${sujet}`);
    console.log(`   Message: ${message}`);

    res.json({ 
      success: true, 
      message: "Message envoyé avec succès !" 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Erreur lors de l'envoi" 
    });
  }
});

export default router;