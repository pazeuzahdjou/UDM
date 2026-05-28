import User from '../models/User.js';
import Admission from '../models/Admission.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { genererAttestation } from '../services/pdfService.js';

//  INSCRIPTION ÉTUDIANT 
export const register = async (req, res) => {
  try {
    const { nom, prenom, email, password, telephone, adresse } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Cet email est déjà utilisé' });
    }
    
    const user = new User({
      nom,
      prenom,
      email,
      password,
      telephone,
      adresse,
      role: 'etudiant'
    });
    
    await user.save();
    
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );
    
    res.status(201).json({
      success: true,
      message: 'Compte créé avec succès',
      token,
      user: { id: user._id, nom: user.nom, email: user.email, role: user.role }
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// LOGIN 
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }
    
    user.lastLogin = new Date();
    await user.save();
    
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );
    
    res.json({
      success: true,
      token,
      user: { 
        id: user._id, 
        nom: user.nom, 
        prenom: user.prenom,
        email: user.email, 
        role: user.role,
        telephone: user.telephone,
        adresse: user.adresse
      }
    });
    
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

//  CRÉER ADMIN UNIQUE 
export const createDefaultAdmin = async () => {
  try {
    const existingSuperAdmin = await User.findOne({ role: 'super_admin' });
    
    if (!existingSuperAdmin) {
      const admin = new User({
        nom: 'Super Administrateur',
        prenom: 'Principal',
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        role: 'super_admin'
      });
      await admin.save();
      console.log('✅ Super Administrateur unique créé');
      console.log(`   Email: ${process.env.ADMIN_EMAIL}`);
    } else {
      console.log('✅ Super Administrateur déjà existant (unique)');
    }
    
    // Vérifier unicité
    const superAdminCount = await User.countDocuments({ role: 'super_admin' });
    if (superAdminCount > 1) {
      console.error('⚠️ ERREUR: Plusieurs super_admin détectés !');
      const superAdmins = await User.find({ role: 'super_admin' }).sort({ createdAt: 1 });
      for (let i = 1; i < superAdmins.length; i++) {
        superAdmins[i].role = 'admin';
        await superAdmins[i].save();
        console.log(`   ${superAdmins[i].email} rétrogradé en admin`);
      }
    }
    
  } catch (error) {
    console.error('❌ Erreur création admin:', error);
  }
};

// PROFIL 
export const getProfil = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

export const updateProfil = async (req, res) => {
  try {
    const { nom, prenom, telephone, adresse } = req.body;
    
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
    }
    
    if (nom) user.nom = nom;
    if (prenom) user.prenom = prenom;
    if (telephone) user.telephone = telephone;
    if (adresse) user.adresse = adresse;
    
    await user.save();
    
    res.json({
      success: true,
      user: { id: user._id, nom: user.nom, prenom: user.prenom, email: user.email, telephone: user.telephone, adresse: user.adresse }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// CHANGER MOT DE PASSE 
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
    }
    
    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Mot de passe actuel incorrect' });
    }
    
    user.password = newPassword;
    await user.save();
    
    res.json({ success: true, message: 'Mot de passe modifié avec succès' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

//  MES CANDIDATURES 
export const getMesCandidatures = async (req, res) => {
  try {
    const candidatures = await Admission.find({ email: req.user.email }).sort({ dateSoumission: -1 });
    res.json({ success: true, candidatures });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

//  TÉLÉCHARGER ATTESTATION 
export const getAttestation = async (req, res) => {
  try {
    const { candidatureId } = req.params;
    
    const candidature = await Admission.findOne({ _id: candidatureId, email: req.user.email });
    
    if (!candidature) {
      return res.status(404).json({ success: false, message: 'Candidature non trouvée' });
    }
    
    if (candidature.status !== 'valide') {
      return res.status(400).json({ success: false, message: 'Votre dossier n\'est pas encore validé' });
    }
    
    if (candidature.paymentStatus !== 'paye') {
      return res.status(400).json({ success: false, message: 'Le paiement n\'a pas été effectué' });
    }
    
    const filepath = await genererAttestation(candidature);
    res.download(filepath, `attestation_${candidature.reference}.pdf`);
    
  } catch (error) {
    console.error('Erreur attestation:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la génération de l\'attestation' });
  }
};