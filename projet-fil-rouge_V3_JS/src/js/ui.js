/**
 * ui.js — Utilitaires Interface Utilisateur
 * Gestion de la navbar, des toasts, du modal, du loader, etc.
 */

// ─── Navbar ───────────────────────────────────────────────────────────────────

/**
 * Initialise la navbar : scroll effect + lien actif + burger menu.
 */
export function initNavbar() {
  const navbar = document.getElementById('navbar');
  const currentPage = window.location.hash || '#home';

  // Scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar?.classList.add('shadow-xl', 'bg-opacity-98');
    } else {
      navbar?.classList.remove('shadow-xl', 'bg-opacity-98');
    }
  });

  // Liens actifs
  document.querySelectorAll('.navbar-link').forEach((link) => {
    link.classList.remove('active');
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
    link.addEventListener('click', () => {
      document.querySelectorAll('.navbar-link').forEach((l) => l.classList.remove('active'));
      link.classList.add('active');
      closeMobileMenu();
    });
  });


// Burger menu
  const burger = document.getElementById('burger-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  burger?.addEventListener('click', () => toggleMobileMenu());
}

export function toggleMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  menu?.classList.toggle('hidden');
}

export function closeMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  menu?.classList.add('hidden');
}

// ─── Toast Notifications ──────────────────────────────────────────────────────

/**
 * Affiche un toast de notification.
 * @param {string} message
 * @param {'success'|'error'|'info'} type
 * @param {number} duration ms
 */
export function showToast(message, type = 'success', duration = 3000) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    document.body.appendChild(toast);
  }

  const colors = {
    success: 'bg-emerald-500',
    error: 'bg-red-500',
    info: 'bg-blue-600',
  };

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
  };

  toast.className = `fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-xl text-white font-semibold text-sm flex items-center gap-2 ${colors[type]}`;
  toast.innerHTML = `<span class="text-lg">${icons[type]}</span> ${message}`;
  toast.style.opacity = '1';
  toast.style.transform = 'translateY(0)';

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
  }, duration);
}

// ─── Modal ────────────────────────────────────────────────────────────────────

/**
 * Ouvre un modal de confirmation.
 * @param {string} message
 * @param {Function} onConfirm
 */
export function showConfirmModal(message, onConfirm) {
  let overlay = document.getElementById('modal-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'modal-overlay';
    overlay.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center';
    document.body.appendChild(overlay);
  }

  overlay.innerHTML = `
    <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 animate-scale-in">
      <div class="text-center mb-6">
        <div class="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="fas fa-exclamation-triangle text-red-500 w-7 h-7"></i>
          </svg>
        </div>
        <h3 class="text-xl font-bold text-slate-800">Confirmation</h3>
        <p class="text-slate-500 mt-2 text-sm">${message}</p>
      </div>
      <div class="flex gap-3">
        <button id="modal-cancel"
          class="flex-1 border-2 border-slate-200 text-slate-600 font-semibold py-2.5 rounded-xl hover:border-slate-300 transition">
          Annuler
        </button>
        <button id="modal-confirm"
          class="flex-1 bg-red-500 text-white font-bold py-2.5 rounded-xl hover:bg-red-600 transition">
          Supprimer
        </button>
      </div>
    </div>
  `;

  overlay.classList.remove('hidden');

  document.getElementById('modal-cancel').addEventListener('click', () => closeModal());
  document.getElementById('modal-confirm').addEventListener('click', () => {
    onConfirm();
    closeModal();
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });
}

export function closeModal() {
  const overlay = document.getElementById('modal-overlay');
  overlay?.classList.add('hidden');
}

// ─── Loader ───────────────────────────────────────────────────────────────────

export function showLoader(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = `
    <div class="flex justify-center items-center py-20">
      <div class="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
    </div>`;
}

// ─── Animation d'entrée au scroll ────────────────────────────────────────────

export function initScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-up');
          entry.target.style.opacity = '1';
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll('[data-animate]').forEach((el) => {
    el.style.opacity = '0';
    observer.observe(el);
  });
}

// ─── Barre de progression des compétences ────────────────────────────────────

export function animateSkillBars() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const bar = entry.target.querySelector('.skill-bar-fill');
          if (bar) {
            const width = bar.dataset.width;
            setTimeout(() => { bar.style.width = width; }, 100);
          }
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  document.querySelectorAll('.skill-item').forEach((el) => observer.observe(el));
}

// ─── Smooth scroll pour les ancres ───────────────────────────────────────────

export function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}
