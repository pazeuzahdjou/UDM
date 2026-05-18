import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Login
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
      user: { id: user._id, nom: user.nom, email: user.email, role: user.role }
    });
    
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Créer admin par défaut
export const createDefaultAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (!existingAdmin) {
      const admin = new User({
        nom: 'Super Administrateur',
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        role: 'super_admin'
      });
      await admin.save();
      console.log('✅ Admin par défaut créé');
      console.log(`📧 Email: ${process.env.ADMIN_EMAIL}`);
      console.log(`🔑 Mot de passe: ${process.env.ADMIN_PASSWORD}`);
    }
  } catch (error) {
    console.error('❌ Erreur création admin:', error);
  }
};