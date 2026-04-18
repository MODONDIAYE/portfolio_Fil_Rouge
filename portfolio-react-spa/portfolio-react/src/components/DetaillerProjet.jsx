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