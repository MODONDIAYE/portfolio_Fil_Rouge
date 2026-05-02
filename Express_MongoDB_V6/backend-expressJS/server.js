const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const projectRoutes = require('./routes/projects');
const memberRoutes = require('./routes/members');
const contactRoutes = require('./routes/contact');

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Connexion MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/g2_aws_p5')
  .then(() => console.log('MongoDB connecté'))
  .catch(err => console.error('erreur MongoDB :', err));

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Serveur démarré sur le port ${PORT}`));

module.exports = app;
