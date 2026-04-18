import React, { useEffect, useState, useMemo } from 'react';
import { api } from '../services/api.js';
import Projet from './Projet.jsx';
import AjouterProjet from './AjouterProjet.jsx';
import DetaillerProjet from './DetaillerProjet.jsx';

/**
 * Dossier — Composant chargé de gérer la liste des projets.
 * Responsabilités : stocker, charger, ajouter, rechercher, supprimer, éditer.
 */
export default function Dossier() {
  
  // ==========================================
  // 1. ÉTATS (STATES)
  // ==========================================
  const [projets, setProjets] = useState([]);
  const [recherche, setRecherche] = useState('');
  const [categorie, setCategorie] = useState('Toutes');
  const [projetDetail, setProjetDetail] = useState(null); // projet sélectionné
  const [modeEdition, setModeEdition] = useState(false);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // ==========================================
  // 2. LOGIQUE D'API (CRUD)
  // ==========================================
  
  // Chargement initial
  const charger = async () => {
    try {
      setLoading(true);
      const data = await api.getAll();
      setProjets(data);
      setErreur(null);
    } catch (e) {
      setErreur("Impossible de joindre json-server (http://localhost:3001). Lancez : npm run server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    charger();
  }, []);

  // Création
  const ajouterProjet = async (projet) => {
    const created = await api.create(projet);
    setProjets((prev) => [...prev, created]);
    setShowForm(false);
  };

  // Suppression
  const supprimerProjet = async (id) => {
    if (!window.confirm('Confirmer la suppression de ce projet ?')) return;
    await api.remove(id);
    setProjets((prev) => prev.filter((p) => p.id !== id));
    if (projetDetail?.id === id) setProjetDetail(null);
  };

  // Mise à jour (Update)
  const mettreAJourProjet = async (id, data) => {
    const updated = await api.update(id, { ...data, id });
    setProjets((prev) => prev.map((p) => (p.id === id ? updated : p)));
    setProjetDetail(updated);
    setModeEdition(false);
  };