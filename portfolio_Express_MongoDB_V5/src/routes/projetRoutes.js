const express = require('express');
const router = express.Router();
const {
  ajouterProjet,
  getTousProjets,
  getProjetById,
  modifierProjet,
  supprimerProjet,
} = require('../controllers/projetController');

/**
 * Routes de l'API portfolio
 *
 * POST   /api/projets       → Ajouter un projet
 * GET    /api/projets       → Retourner tous les projets
 * GET    /api/projets/:id   → Retourner un projet par ID
 * PUT    /api/projets/:id   → Modifier un projet
 * DELETE /api/projets/:id   → Supprimer un projet
 */

router.route('/').get(getTousProjets).post(ajouterProjet);
router.route('/:id').get(getProjetById).put(modifierProjet).delete(supprimerProjet);

module.exports = router;
