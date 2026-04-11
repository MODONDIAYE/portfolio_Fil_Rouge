/**
 * main.js — Point d'entrée et orchestration des modules
 *
 * Gère le routage SPA basé sur les hash (#home, #projets, #ajouter, #contact, #detail-{id})
 * et initialise les modules selon la vue active.
 */

import { getAllProjets } from './js/api.js';
import { renderProjetsGrid, updateStats } from './js/projet.js';
import {
  initSuppressionListeners,
  initRecherche,
  initFiltresCategorie,
  initVoirListeners,
  initFormulaireAjout,
} from './js/gestionProjets.js';
import { renderDetailProjet } from './js/detailProjet.js';
import {
  initNavbar,
  initScrollAnimations,
  animateSkillBars,
  initSmoothScroll,
} from './js/ui.js';

// ─── Vues HTML ────────────────────────────────────────────────────────────────

const VIEWS = {
  home: () => renderHome(),
  projets: () => renderProjets(),
  ajouter: () => renderAjouter(),
  contact: () => renderContact(),
};

// ─── Routeur SPA ──────────────────────────────────────────────────────────────

function router() {
  const hash = window.location.hash.replace('#', '') || 'home';

  // Route vers le détail d'un projet
  if (hash.startsWith('detail-')) {
    const id = Number(hash.replace('detail-', ''));
    renderDetail(id);
    return;
  }

  const view = VIEWS[hash];
  if (view) {
    view();
  } else {
    VIEWS.home();
  }
}

// ─── Rendu des vues ───────────────────────────────────────────────────────────

function renderHome() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <!-- HERO -->
    <section class="bg-gradient-to-br from-[#0f1e3c] via-[#1a2f5a] to-[#243b6e] text-white overflow-hidden">
      <div class="max-w-6xl mx-auto px-6 py-24 md:py-32 flex flex-col md:flex-row items-center gap-12">

        <!-- TEXT -->
        <div class="flex-1 animate-fade-in-left">
          <span class="inline-block bg-amber-400/20 text-amber-400 text-xs font-bold px-4 py-1.5 rounded-full mb-6 tracking-widest uppercase">
            Développeur Fullstack
          </span>
          <h1 class="text-5xl md:text-6xl font-extrabold leading-tight mb-5">
            Modou<br><span class="text-amber-400">NDIAYE</span>
          </h1>
          <p class="text-slate-300 text-lg leading-relaxed mb-8 max-w-lg">
            Je conçois des interfaces modernes et développe des solutions web performantes.
            Passionné par le code, le design et les nouvelles technologies.
          </p>
          <div class="flex flex-wrap gap-4">
            <a href="#projets" class="btn-primary">
              <i class="fas fa-arrow-right text-sm"></i>
              </svg>
              Voir mes projets
            </a>
            <a href="#contact" class="inline-flex items-center gap-2 border-2 border-white/30 text-white font-semibold px-6 py-3 rounded-xl hover:border-amber-400 hover:text-amber-400 transition">
              Me contacter
            </a>
          </div>
        </div>

        <!-- AVATAR -->
        <div class="flex-shrink-0 animate-scale-in animate-delay-200">
          <div class="relative">
            <div class="w-56 h-56 md:w-72 md:h-72 rounded-full overflow-hidden border-4 border-amber-400 shadow-2xl pulse-avatar">
              <img src="src/assets/profil.jpg" alt="Modou NDIAYE"
                class="w-full h-full object-cover"
                onerror="this.src='https://placehold.co/300x300/1a2f5a/f59e0b?text=MN'"/>
            </div>
            <!-- Badge flottant -->
            <div class="absolute -bottom-3 -right-3 bg-amber-400 text-slate-900 font-bold text-sm px-4 py-2 rounded-2xl shadow-lg">
              3 ans d'exp.
            </div>
          </div>
        </div>
      </div>

      <!-- Wave -->
      <svg class="w-full -mb-px" viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0,40 C360,80 1080,0 1440,40 L1440,60 L0,60 Z" fill="#f8fafc"/>
      </svg>
    </section>

    <!-- SERVICES -->
    <section class="py-20 bg-slate-50" id="services">
      <div class="max-w-6xl mx-auto px-6">
        <div class="text-center mb-14" data-animate>
          <span class="section-label">Ce que je fais</span>
          <h2 class="section-title">Mes services</h2>
          <div class="section-divider mx-auto"></div>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          ${[
            { icon: '🌐', title: 'Développement Web', desc: 'Création de sites et applications web responsive, performants et accessibles.' },
            { icon: '⚙️', title: 'API & Backend',     desc: 'Conception d\'APIs RESTful sécurisées avec Node.js, Express et Laravel.' },
            { icon: '🗄️', title: 'Base de données',   desc: 'Gestion SQL (MySQL, PostgreSQL) et NoSQL (MongoDB) avec optimisation.' },
            { icon: '📱', title: 'Mobile',             desc: 'Applications cross-platform avec React Native et Flutter.' },
            { icon: '🎨', title: 'UX/UI Design',       desc: 'Interfaces centrées utilisateur, maquettes Figma et design systems.' },
            { icon: '☁️', title: 'DevOps & Cloud',     desc: 'Docker, CI/CD, déploiement AWS et architecture cloud scalable.' },
          ].map((s, i) => `
            <div class="bg-white rounded-2xl p-7 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-slate-100 group" data-animate>
        <i class="${s.iconClass} text-3xl mb-4"></i>
              <h3 class="text-lg font-bold text-slate-800 mb-2 group-hover:text-amber-500 transition">${s.title}</h3>
              <p class="text-slate-500 text-sm leading-relaxed">${s.desc}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- À PROPOS -->
    <section class="py-20 bg-white">
      <div class="max-w-6xl mx-auto px-6">
        <div class="grid md:grid-cols-2 gap-16 items-center">

          <!-- LEFT -->
          <div data-animate>
            <span class="section-label">Qui suis-je ?</span>
            <h2 class="section-title">À propos de moi</h2>
            <div class="section-divider"></div>
            <p class="text-slate-600 mb-4 leading-relaxed">
              Développeur Full Stack avec 3 ans d'expérience, passionné par la création d'applications
              web modernes, scalables et centrées sur l'expérience utilisateur.
            </p>
            <p class="text-slate-600 mb-6 leading-relaxed">
              Formé en Réseaux & Systèmes, j'allie compétences backend, frontend et infrastructure
              pour livrer des projets complets et performants.
            </p>
            <div class="flex flex-wrap gap-2">
              ${['React', 'Node.js', 'Docker', 'AWS', 'Réseaux & Systèmes'].map(t =>
                `<span class="bg-[#0f1e3c] text-amber-400 text-sm font-semibold px-4 py-1.5 rounded-full">${t}</span>`
              ).join('')}
            </div>
          </div>

          <!-- RIGHT — Skill bars -->
          <div class="space-y-5" data-animate>
            ${[
              { label: 'HTML & CSS',          pct: 92 },
              { label: 'JavaScript',           pct: 82 },
              { label: 'React.js',             pct: 89 },
              { label: 'MongoDB',              pct: 85 },
              { label: 'Laravel',              pct: 85 },
              { label: 'DevOps',               pct: 78 },
              { label: 'Architecture AWS',     pct: 85 },
            ].map(s => `
              <div class="skill-item">
                <div class="flex justify-between text-sm font-semibold text-slate-700 mb-1.5">
                  <span>${s.label}</span><span class="text-amber-500">${s.pct}%</span>
                </div>
                <div class="w-full bg-slate-100 rounded-full h-1.5">
                  <div class="skill-bar-fill w-0" data-width="${s.pct}%" style="width:0"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </section>

    <!-- EXPÉRIENCES -->
    <section class="py-20 bg-slate-50">
      <div class="max-w-3xl mx-auto px-6">
        <div class="text-center mb-14" data-animate>
          <span class="section-label">Mon parcours</span>
          <h2 class="section-title">Expériences</h2>
          <div class="section-divider mx-auto"></div>
        </div>

        <div class="space-y-6">
          ${[
            { annee: '2025 — Aujourd\'hui', titre: 'Développeur Fullstack Freelance', detail: 'Réalisation de projets web et mobile pour des clients variés.' },
            { annee: '2023 — 2025',         titre: 'Formation Réseaux & Systèmes',   detail: 'Spécialisation en infrastructure, sécurité réseau et administration système.' },
          ].map((exp, i) => `
            <div class="flex gap-5 group" data-animate>
              <div class="flex flex-col items-center">
                <div class="w-4 h-4 rounded-full bg-amber-400 border-4 border-white shadow mt-1 group-hover:scale-125 transition"></div>
                ${i < 1 ? '<div class="w-0.5 h-full bg-slate-200 mt-1"></div>' : ''}
              </div>
              <div class="pb-6">
                <span class="text-xs font-bold text-amber-500 uppercase tracking-widest">${exp.annee}</span>
                <h3 class="text-lg font-bold text-slate-800 mt-1">${exp.titre}</h3>
                <p class="text-slate-500 text-sm mt-1">${exp.detail}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;

  initScrollAnimations();
  animateSkillBars();
  initSmoothScroll();
}

// ─── Vue Projets ──────────────────────────────────────────────────────────────

function renderProjets() {
  const app = document.getElementById('app');
  const projets = getAllProjets();
  const categories = ['tous', ...new Set(projets.map((p) => p.categorie))];

  app.innerHTML = `
    <section class="min-h-screen bg-slate-50 py-14">
      <div class="max-w-6xl mx-auto px-6">

        <!-- Titre -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10" data-animate>
          <div>
            <span class="section-label">Mon travail</span>
            <h2 class="section-title">Mes Projets</h2>
            <div class="section-divider"></div>
          </div>
          <a href="#ajouter" class="btn-primary self-start md:self-center">
            <i class="fas fa-plus text-sm"></i>
            </svg>
            Ajouter
          </a>
        </div>

        <!-- STATS -->
        <div class="grid grid-cols-3 gap-4 mb-10">
          <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 text-center">
            <p class="text-3xl font-extrabold text-[#0f1e3c]" id="stat-count">0</p>
            <p class="text-slate-400 text-sm mt-1">Projets</p>
          </div>
          <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 text-center">
            <p class="text-3xl font-extrabold text-[#0f1e3c]" id="stat-techs">0</p>
            <p class="text-slate-400 text-sm mt-1">Technologies</p>
          </div>
          <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 text-center">
            <p class="text-3xl font-extrabold text-[#0f1e3c]" id="stat-date">—</p>
            <p class="text-slate-400 text-sm mt-1">Dernier ajout</p>
          </div>
        </div>

        <!-- FILTRES + RECHERCHE -->
        <div class="flex flex-col md:flex-row gap-4 mb-8">
          <!-- Catégories -->
          <div id="filtres-categorie" class="flex flex-wrap gap-2">
            ${categories.map((c, i) => `
              <button data-categorie="${c}"
                class="text-sm font-semibold px-4 py-1.5 rounded-full border border-slate-200 transition cursor-pointer
                  ${i === 0 ? 'bg-navy text-white border-navy' : 'bg-white text-slate-600 hover:border-amber-400'}">
                ${c === 'tous' ? 'Tous' : c}
              </button>
            `).join('')}
          </div>

          <!-- Recherche -->
          <div class="relative md:ml-auto">
            <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"></i>
            </svg>
            <input id="input-recherche" type="text" placeholder="Rechercher..."
              class="pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 w-full md:w-56"/>
          </div>
        </div>

        <!-- GRILLE -->
        <div id="grille-projets" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6"></div>
      </div>
    </section>`;

  renderProjetsGrid('grille-projets', projets);
  updateStats(projets);
  initSuppressionListeners('grille-projets');
  initVoirListeners('grille-projets');
  initRecherche('input-recherche', 'grille-projets');
  initFiltresCategorie('filtres-categorie', 'grille-projets');
  initScrollAnimations();
}
