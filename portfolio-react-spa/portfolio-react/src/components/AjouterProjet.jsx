import React, { useState } from 'react';

/**
 * AjouterProjet — Formulaire de création d'un projet.
 * À la soumission, appelle onAjouter(projet) fourni par le parent (Dossier).
 */
const CATEGORIES = ['Web', 'App', 'UI/UX', 'Mobile', 'E-commerce', 'Santé'];

const initialState = {
  nom: '',
  categorie: 'Web',
  date: new Date().toISOString().slice(0, 10),
  description: '',
  description2: '',
  technologies: '',
  image: '',
  lien: '',
};

export default function AjouterProjet({ onAjouter, onAnnuler }) {
  const [form, setForm] = useState(initialState);
  const [erreurs, setErreurs] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (erreurs[name]) setErreurs((er) => ({ ...er, [name]: null }));
  };

  const valider = () => {
    const er = {};
    if (!form.nom.trim()) er.nom = 'Le nom est requis';
    if (!form.description.trim()) er.description = 'La description est requise';
    if (!form.technologies.trim()) er.technologies = 'Au moins une technologie';
    return er;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const er = valider();
    if (Object.keys(er).length > 0) {
      setErreurs(er);
      return;
    }
    setSubmitting(true);
    try {
      await onAjouter({
        ...form,
        technologies: form.technologies.split(',').map((t) => t.trim()).filter(Boolean),
        image: form.image.trim() || null,
      });
      setForm(initialState);
    } finally {
      setSubmitting(false);
    }
  };

  
}
