import jwt from 'jsonwebtoken';
import { query } from '../config/database.js';

export const protect = async (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  
  if (!token) {
    return res.status(401).json({ message: 'Non autorisé - Token manquant' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Chercher d'abord dans la table admins
    let result = await query('SELECT id, nom, email, role FROM admins WHERE id = $1', [decoded.id]);
    
    // Si pas trouvé, chercher dans users
    if (result.rows.length === 0) {
      result = await query('SELECT id, nom, prenom, email, role FROM users WHERE id = $1', [decoded.id]);
    }
    
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Non autorisé - Utilisateur non trouvé' });
    }
    
    req.user = result.rows[0];
    next();
    
  } catch (error) {
    console.error('❌ Erreur auth:', error);
    return res.status(401).json({ message: 'Non autorisé - Token invalide' });
  }
};

export const isSuperAdmin = async (req, res, next) => {
  if (req.user.role !== 'super_admin') {
    return res.status(403).json({ message: 'Accès refusé - Droits insuffisants' });
  }
  next();
};

export const isAdmin = async (req, res, next) => {
  if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
    return res.status(403).json({ message: 'Accès refusé - Droits administrateur requis' });
  }
  next();
};