import React, { useState, useEffect } from 'react';

// ==========================================
// 1. CONSTANTES & CONFIGURATION
// ==========================================
const CATEGORIES = ['Web', 'App', 'UI/UX', 'Mobile', 'E-commerce', 'Santé'];

export default function DetaillerProjet({
  projet,
  modeEdition,
  onAnnuler,
  onEditer,
  onAnnulerEdition,
  onEnregistrer,
}) {
  // ==========================================
  // 2. ÉTATS & EFFETS (HOOKS)
  // ==========================================
  const [form, setForm] = useState(projet);

  // Synchronisation du formulaire avec le projet (notamment pour les technos)
  useEffect(() => {
    setForm({
      ...projet,
      technologies: Array.isArray(projet.technologies)
        ? projet.technologies.join(', ')
        : projet.technologies || '',
    });
  }, [projet, modeEdition]);

  // ==========================================
  // 3. GESTIONNAIRES D'ÉVÉNEMENTS (HANDLERS)
  // ==========================================
  
  // Mise à jour des champs du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  // Soumission et formatage des données
  const handleSave = (e) => {
    e.preventDefault();
    const techs =
      typeof form.technologies === 'string'
        ? form.technologies.split(',').map((t) => t.trim()).filter(Boolean)
        : form.technologies;
    onEnregistrer({ ...form, technologies: techs });
  };