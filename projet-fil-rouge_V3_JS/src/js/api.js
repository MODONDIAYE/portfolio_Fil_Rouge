/**
 * api.js — Simulation d'une API REST (localStorage)
 * Gère la persistance des projets côté client.
 */

const API_KEY = 'portfolio_projets';

// ─── Données initiales ────────────────────────────────────────────────────────
const PROJETS_DEFAUT = [
  {
    id: 1,
    nom: 'Portfolio Développeur',
    categorie: 'Web',
    date: '2023-10-05',
    description:
      'Conception et développement d\'un portfolio moderne permettant de présenter mes projets, compétences et expériences en développement web et mobile. L\'application offre une interface élégante, responsive et optimisée pour tous les appareils.',
    description2:
      'Le site intègre des animations interactives, une navigation fluide et des pages dédiées pour chaque projet. Il permet également aux visiteurs de me contacter facilement grâce à un formulaire intégré.',
    technologies: ['HTML5', 'Tailwind CSS', 'JavaScript', 'React.js', 'Node.js', 'MongoDB'],
    image: 'src/assets/portfolio.jpg',
    lien: 'https://github.com/modoundiaye',
  },
  {
    id: 2,
    nom: 'Gestion de tâches',
    categorie: 'App',
    date: '2024-09-15',
    description:
      'Application web de gestion de tâches avec système de priorités, étiquettes et suivi d\'avancement. Permet aux équipes de collaborer en temps réel sur leurs projets.',
    description2:
      'Interface drag-and-drop intuitive, notifications en temps réel via WebSocket, et tableau de bord analytique pour visualiser la productivité.',
    technologies: ['React.js', 'Node.js', 'Express', 'MongoDB', 'Socket.io', 'Tailwind CSS'],
    image: 'src/assets/concept-application-gestion-taches_23-2148625232.avif',
    lien: 'https://github.com/modoundiaye',
  },
  {
    id: 3,
    nom: 'UI Fitness',
    categorie: 'UI/UX',
    date: '2025-11-10',
    description:
      'Design et prototypage d\'une application mobile de fitness avec suivi des entraînements, nutrition et objectifs personnalisés. Interface épurée et motivante.',
    description2:
      'Maquettes Figma haute-fidélité, système de design tokens, animations micro-interactions et tests utilisateurs réalisés avec 15 participants.',
    technologies: ['Figma', 'Adobe XD', 'Prototyping', 'Design System', 'React Native'],
    image: 'src/assets/gradient-fitness-app-template_23-2151095461.avif',
    lien: 'https://github.com/modoundiaye',
  },
  {
    id: 4,
    nom: 'CashPay',
    categorie: 'Mobile',
    date: '2023-10-05',
    description:
      'Application mobile de paiement et transfert d\'argent sécurisée. Permet aux utilisateurs d\'envoyer de l\'argent, de payer des factures et de consulter leur historique de transactions.',
    description2:
      'Sécurisation par biométrie, chiffrement des données, conformité PCI-DSS et intégration avec les principales banques de la sous-région.',
    technologies: ['React Native', 'Node.js', 'PostgreSQL', 'JWT', 'Stripe API'],
    image: 'src/assets/application-mobile-cashpay.jpg',
    lien: 'https://github.com/modoundiaye',
  },
  {
    id: 5,
    nom: 'Site e-commerce sport',
    categorie: 'E-commerce',
    date: '2026-01-01',
    description:
      'Boutique en ligne dédiée aux équipements et maillots de sport. Catalogue produit dynamique, panier persistant, paiement en ligne sécurisé et tableau de bord administrateur.',
    description2:
      'Optimisation SEO, score Lighthouse 95+, intégration CinetPay et Wave pour les paiements africains, système de promotions et codes réduction.',
    technologies: ['Next.js', 'Laravel', 'MySQL', 'CinetPay', 'Redis', 'Docker'],
    image: 'src/assets/FCB 2026.jpeg',
    lien: 'https://github.com/modoundiaye',
  },
  {
    id: 6,
    nom: 'App santé mentale',
    categorie: 'Santé',
    date: '2026-02-14',
    description:
      'Application de suivi du bien-être mental : journal d\'humeur, exercices de pleine conscience, suivi du sommeil et accès à des ressources professionnelles.',
    description2:
      'Algorithme de recommandation personnalisé, respect RGPD, chiffrement end-to-end des données sensibles et partenariat avec des psychologues certifiés.',
    technologies: ['Flutter', 'Firebase', 'TensorFlow Lite', 'Node.js', 'PostgreSQL'],
    image: 'src/assets/mentalHealt.jpg',
    lien: 'https://github.com/modoundiaye',
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Retourne tous les projets depuis le localStorage.
 * Initialise avec les données par défaut si vide.
 * @returns {Array}
 */
export function getAllProjets() {
  const raw = localStorage.getItem(API_KEY);
  if (!raw) {
    localStorage.setItem(API_KEY, JSON.stringify(PROJETS_DEFAUT));
    return [...PROJETS_DEFAUT];
  }
  return JSON.parse(raw);
}

/**
 * Retourne un projet par son id.
 * @param {number} id
 * @returns {Object|null}
 */
export function getProjetById(id) {
  return getAllProjets().find((p) => p.id === Number(id)) || null;
}

/**
 * Sauvegarde un nouveau projet.
 * @param {Object} projet
 * @returns {Object} Le projet créé avec son id
 */
export function createProjet(projet) {
  const projets = getAllProjets();
  const newId = projets.length > 0 ? Math.max(...projets.map((p) => p.id)) + 1 : 1;
  const newProjet = { ...projet, id: newId };
  projets.push(newProjet);
  localStorage.setItem(API_KEY, JSON.stringify(projets));
  return newProjet;
}

/**
 * Supprime un projet par son id.
 * @param {number} id
 * @returns {boolean}
 */
export function deleteProjet(id) {
  const projets = getAllProjets();
  const index = projets.findIndex((p) => p.id === Number(id));
  if (index === -1) return false;
  projets.splice(index, 1);
  localStorage.setItem(API_KEY, JSON.stringify(projets));
  return true;
}

/**
 * Met à jour un projet existant.
 * @param {number} id
 * @param {Object} data
 * @returns {Object|null}
 */
export function updateProjet(id, data) {
  const projets = getAllProjets();
  const index = projets.findIndex((p) => p.id === Number(id));
  if (index === -1) return null;
  projets[index] = { ...projets[index], ...data };
  localStorage.setItem(API_KEY, JSON.stringify(projets));
  return projets[index];
}

/**
 * Réinitialise les données (utile pour les tests).
 */
export function resetProjets() {
  localStorage.setItem(API_KEY, JSON.stringify(PROJETS_DEFAUT));
}
