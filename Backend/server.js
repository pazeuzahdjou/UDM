import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

// Import routes
import admissionRoutes from './routes/admissionRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import authRoutes from './routes/authRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import { createDefaultAdmin } from './controllers/authController.js';

// Configuration des chemins
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ============ MIDDLEWARES ============
// CORS - Autoriser les requêtes du frontend
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Dossier uploads statique (accessible publiquement)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ============ CONNEXION MONGODB ============
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    });
    console.log('✅ MongoDB connecté avec succès');
    
    // Créer l'admin par défaut (un seul possible)
    await createDefaultAdmin();
    
  } catch (error) {
    console.error('❌ Erreur MongoDB:', error.message);
    console.log('⚠️ Le serveur continue sans base de données...');
    console.log('   Pour corriger:');
    console.log('   1. Vérifiez que MongoDB est installé: `mongod --version`');
    console.log('   2. Démarrez MongoDB: `sudo systemctl start mongod`');
    console.log('   3. Vérifiez l\'URI dans .env');
  }
};

connectDB();

// ============ ROUTES API ============
app.use('/api', admissionRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/payments', paymentRoutes);

// ============ ROUTES PUBLIQUES ============
// Route de test de santé
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({
    status: 'OK',
    message: 'API Université de Moundou',
    database: dbStatus,
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Route racine
app.get('/', (req, res) => {
  res.json({
    name: 'API Université de Moundou',
    version: '1.0.0',
    description: 'Plateforme d\'admission en ligne avec paiement mobile',
    endpoints: {
      health: '/api/health',
      admissions: '/api/admissions',
      admin: '/api/admin',
      auth: '/api/auth',
      payments: '/api/payments'
    }
  });
});

// ============ GESTION DES ERREURS ============
// Middleware pour les routes non trouvées (404)
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: `Route ${req.method} ${req.url} non trouvée` 
  });
});

// Middleware global de gestion des erreurs
app.use((err, req, res, next) => {
  console.error('❌ Erreur:', err.stack);
  
  // Erreur Multer (upload de fichier)
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ 
      success: false, 
      message: 'Fichier trop volumineux (max 5MB)' 
    });
  }
  
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({ 
      success: false, 
      message: 'Fichier non attendu' 
    });
  }
  
  // Erreur de validation MongoDB
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ 
      success: false, 
      message: messages.join(', ') 
    });
  }
  
  // Erreur de duplication (index unique)
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({ 
      success: false, 
      message: `La valeur du champ "${field}" existe déjà` 
    });
  }
  
  // Erreur par défaut
  res.status(500).json({ 
    success: false, 
    message: err.message || 'Erreur interne du serveur' 
  });
});

// ============ DÉMARRAGE DU SERVEUR ============
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log('');
  console.log('='.repeat(50));
  console.log('🚀 SERVEUR DÉMARRÉ AVEC SUCCÈS');
  console.log('='.repeat(50));
  console.log(`📡 URL API: http://localhost:${PORT}`);
  console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📁 Uploads: http://localhost:${PORT}/uploads/`);
  console.log('='.repeat(50));
  console.log('');
});

// Gestion de l'arrêt propre du serveur
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM reçu, arrêt du serveur...');
  server.close(() => {
    console.log('✅ Serveur arrêté');
    mongoose.connection.close();
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT reçu, arrêt du serveur...');
  server.close(() => {
    console.log('✅ Serveur arrêté');
    mongoose.connection.close();
  });
});

export default app;