const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const projectRoutes = require('./routes/projects');
const memberRoutes = require('./routes/members');
const contactRoutes = require('./routes/contact');

const app = express();

// Middlewares
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
];
app.use(cors({
  origin: (origin, callback) => {
    // Autoriser les requêtes sans origin (Postman, curl, Thunder Client)
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS bloqué pour l'origine : ${origin}`));
  },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/projects', projectRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/contact', contactRoutes);

// Route santé
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API G2-AWS-P5 opérationnelle', version: '1.0.0' });
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Erreur serveur interne', error: process.env.NODE_ENV === 'development' ? err.message : undefined });
});

// ── Démarrage : uniquement si le fichier est exécuté directement ──
// require.main === module est FAUX quand Jest importe server.js pour les tests.
// Cela empêche app.listen() de s'exécuter pendant les tests.
const PORT = process.env.PORT || 5000;

if (require.main === module) {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      console.log('✅ MongoDB Atlas connecté');
      const server = app.listen(PORT, () =>
        console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`)
      );

      server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          console.error(`❌ Port ${PORT} déjà utilisé. Arrêtez l'autre processus et relancez.`);
          console.error(`   → Commande : taskkill /F /IM node.exe  (Windows)`);
        } else {
          console.error('❌ Erreur serveur :', err.message);
        }
        process.exit(1);
      });
    })
    .catch(err => {
      console.error('❌ Connexion MongoDB échouée :', err.message);
      process.exit(1);
    });
}

module.exports = app;
