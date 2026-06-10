import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import './config/database.js';

// Import routes
import admissionRoutes from './routes/admissionRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import authRoutes from './routes/authRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import contactRoutes from './routes/contactRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ============ MIDDLEWARES ============
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Dossier uploads statique
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ============ ROUTES API ============
app.use('/api', admissionRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/contact', contactRoutes);


// ============ ROUTES PUBLIQUES ============
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'API Université de Moundou',
    database: 'PostgreSQL',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

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
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: `Route ${req.method} ${req.url} non trouvée` 
  });
});

app.use((err, req, res, next) => {
  console.error('❌ Erreur:', err.stack);
  
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
  
  res.status(500).json({ 
    success: false, 
    message: err.message || 'Erreur interne du serveur' 
  });
});

// Route contact
app.post('/api/contact', async (req, res) => {
  const { nom, email, sujet, message } = req.body;
  
  if (!nom || !email || !message) {
    return res.status(400).json({ success: false, message: "Champs obligatoires manquants" });
  }
  
  try {
    // Ici vous pouvez sauvegarder en base ou envoyer un email
    console.log('📩 Nouveau message de contact:', { nom, email, sujet, message });
    
    res.json({ success: true, message: "Message envoyé avec succès !" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erreur lors de l'envoi" });
  }
});

// ============ DÉMARRAGE DU SERVEUR ============
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
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