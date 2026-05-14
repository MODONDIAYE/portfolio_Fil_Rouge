require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/connectdb');
const projetRoutes = require('./src/routes/projetRoutes');

// ─── Connexion à MongoDB ──────────────────────────────────────────────────────
connectDB();

// ─── Initialisation Express ───────────────────────────────────────────────────
const app = express();

// ─── Middlewares ──────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/projets', projetRoutes);

// ─── Route racine ─────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: '🚀 API Portfolio Express/MongoDB V5 — opérationnelle' });
});

// ─── Middleware 404 ───────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route non trouvée' });
});

// ─── Démarrage du serveur ─────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
