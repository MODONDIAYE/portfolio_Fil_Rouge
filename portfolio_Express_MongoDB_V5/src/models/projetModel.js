const mongoose = require('mongoose');

/**
 * ProjetSchema — Modèle de données d'un projet du portfolio.
 * Inspiré de la structure utilisée dans portfolio-react-spa_V4 (db.json)
 */
const projetSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: [true, 'Le nom du projet est requis'],
      trim: true,
    },
    categorie: {
      type: String,
      enum: ['Web', 'App', 'UI/UX', 'Mobile', 'E-commerce', 'Santé'],
      default: 'Web',
    },
    date: {
      type: Date,
      default: Date.now,
    },
    description: {
      type: String,
      required: [true, 'La description est requise'],
      trim: true,
    },
    description2: {
      type: String,
      trim: true,
      default: '',
    },
    technologies: {
      type: [String],
      required: [true, 'Au moins une technologie est requise'],
    },
    image: {
      type: String,
      default: '',
    },
    lien: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true, // ajoute createdAt et updatedAt automatiquement
  }
);

module.exports = mongoose.model('Projet', projetSchema);
