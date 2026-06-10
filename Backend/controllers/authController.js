import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/database.js';

// ============ LOGIN ============
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('📝 Tentative login:', email);
    
    // Chercher dans la table admins
    let result = await query('SELECT * FROM admins WHERE email = $1', [email]);
    let isAdmin = true;
    
    // Si pas trouvé, chercher dans users
    if (result.rows.length === 0) {
      result = await query('SELECT * FROM users WHERE email = $1', [email]);
      isAdmin = false;
    }
    
    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Email ou mot de passe incorrect' });
    }
    
    const user = result.rows[0];
    const isValid = await bcrypt.compare(password, user.password);
    
    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Email ou mot de passe incorrect' });
    }
    
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role || (isAdmin ? 'admin' : 'etudiant') },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );
    
    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        role: user.role || (isAdmin ? 'admin' : 'etudiant')
      }
    });
    
  } catch (error) {
    console.error('❌ Erreur login:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// ============ REGISTER ============
export const register = async (req, res) => {
  try {
    const { nom, prenom, email, password, telephone } = req.body;
    console.log('📝 Tentative inscription:', email);
    
    // Vérifier si l'utilisateur existe déjà
    const existing = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Cet email est déjà utilisé' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await query(
      `INSERT INTO users (nom, prenom, email, password, telephone, role) 
       VALUES ($1, $2, $3, $4, $5, 'etudiant') 
       RETURNING id, nom, prenom, email, role`,
      [nom, prenom, email, hashedPassword, telephone || '']
    );
    
    const user = result.rows[0];
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );
    
    res.status(201).json({
      success: true,
      token,
      user
    });
    
  } catch (error) {
    console.error('❌ Erreur register:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// ============ PROFIL ============
export const getProfil = async (req, res) => {
  try {
    const userId = req.user.id;
    let result = await query('SELECT id, nom, prenom, email, telephone, role FROM users WHERE id = $1', [userId]);
    
    if (result.rows.length === 0) {
      result = await query('SELECT id, nom, email, role FROM admins WHERE id = $1', [userId]);
    }
    
    res.json({ success: true, user: result.rows[0] });
    
  } catch (error) {
    console.error('❌ Erreur getProfil:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

export const updateProfil = async (req, res) => {
  try {
    const { nom, prenom, telephone } = req.body;
    const userId = req.user.id;
    
    await query(
      'UPDATE users SET nom = $1, prenom = $2, telephone = $3 WHERE id = $4',
      [nom, prenom, telephone, userId]
    );
    
    res.json({ success: true, message: 'Profil mis à jour' });
    
  } catch (error) {
    console.error('❌ Erreur updateProfil:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;
    
    // Récupérer l'utilisateur
    let result = await query('SELECT password FROM users WHERE id = $1', [userId]);
    let table = 'users';
    
    if (result.rows.length === 0) {
      result = await query('SELECT password FROM admins WHERE id = $1', [userId]);
      table = 'admins';
    }
    
    const isValid = await bcrypt.compare(oldPassword, result.rows[0].password);
    if (!isValid) {
      return res.status(400).json({ success: false, message: 'Mot de passe actuel incorrect' });
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await query(`UPDATE ${table} SET password = $1 WHERE id = $2`, [hashedPassword, userId]);
    
    res.json({ success: true, message: 'Mot de passe modifié' });
    
  } catch (error) {
    console.error('❌ Erreur changePassword:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

export const getMesCandidatures = async (req, res) => {
  try {
    const email = req.user.email;
    const result = await query(
      'SELECT * FROM admissions WHERE email = $1 ORDER BY datesoumission DESC',
      [email]
    );
    res.json({ success: true, candidatures: result.rows });
    
  } catch (error) {
    console.error('❌ Erreur getMesCandidatures:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

export const getAttestation = async (req, res) => {
  try {
    const { candidatureId } = req.params;
    // À implémenter : génération du PDF
    res.status(501).json({ success: false, message: 'Fonction à implémenter' });
    
  } catch (error) {
    console.error('❌ Erreur getAttestation:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};