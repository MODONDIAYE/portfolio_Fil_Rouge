const Projet = require('../models/projetModel');

/**
 * projetController — Logique métier pour la gestion des projets du portfolio.
 *
 * POST   /projets          → ajouterProjet
 * GET    /projets          → getTousProjets
 * GET    /projets/:id      → getProjetById
 * PUT    /projets/:id      → modifierProjet
 * DELETE /projets/:id      → supprimerProjet
 */

// ─── Ajouter un projet ────────────────────────────────────────────────────────
const ajouterProjet = async (req, res) => {
  try {
    const projet = await Projet.create(req.body);
    res.status(201).json({ success: true, data: projet });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ─── Retourner tous les projets ───────────────────────────────────────────────
const getTousProjets = async (req, res) => {
  try {
    const projets = await Projet.find().sort({ date: -1 });
    res.status(200).json({ success: true, count: projets.length, data: projets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Retourner un projet par ID ───────────────────────────────────────────────
const getProjetById = async (req, res) => {
  try {
    const projet = await Projet.findById(req.params.id);
    if (!projet) {
      return res.status(404).json({ success: false, message: 'Projet non trouvé' });
    }
    res.status(200).json({ success: true, data: projet });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Modifier un projet ───────────────────────────────────────────────────────
const modifierProjet = async (req, res) => {
  try {
    const projet = await Projet.findByIdAndUpdate(req.params.id, req.body, {
      new: true,           // retourne le document mis à jour
      runValidators: true, // applique les validations du schéma
    });
    if (!projet) {
      return res.status(404).json({ success: false, message: 'Projet non trouvé' });
    }
    res.status(200).json({ success: true, data: projet });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ─── Supprimer un projet ──────────────────────────────────────────────────────
const supprimerProjet = async (req, res) => {
  try {
    const projet = await Projet.findByIdAndDelete(req.params.id);
    if (!projet) {
      return res.status(404).json({ success: false, message: 'Projet non trouvé' });
    }
    res.status(200).json({ success: true, message: 'Projet supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  ajouterProjet,
  getTousProjets,
  getProjetById,
  modifierProjet,
  supprimerProjet,
};
