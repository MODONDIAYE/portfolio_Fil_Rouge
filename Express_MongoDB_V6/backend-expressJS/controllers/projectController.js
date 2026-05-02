const Project = require('../models/Project');

// GET /api/projects — tous les projets (avec filtres optionnels)
exports.getAllProjects = async (req, res) => {
  try {
    const { type, status, search } = req.query;
    const filter = {};
    if (type && type !== 'Tous') filter.type = type;
    if (status && status !== 'Tous') filter.status = status;
    if (search) filter.title = { $regex: search, $options: 'i' };

    const projects = await Project.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: projects.length, data: projects });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/projects/stats/summary — statistiques
exports.getProjectStats = async (req, res) => {
  try {
    const total = await Project.countDocuments();
    const enCours = await Project.countDocuments({ status: 'En cours' });
    const termines = await Project.countDocuments({ status: 'Terminé' });
    const archives = await Project.countDocuments({ status: 'Archivé' });
    const byType = await Project.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);
    res.json({ success: true, data: { total, enCours, termines, archives, byType } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/projects/:id — un projet
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Projet non trouvé' });
    res.json({ success: true, data: project });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/projects — créer un projet
exports.createProject = async (req, res) => {
  try {
    const project = new Project(req.body);
    const saved = await project.save();
    res.status(201).json({ success: true, data: saved });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// PUT /api/projects/:id — modifier un projet
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    if (!project) return res.status(404).json({ success: false, message: 'Projet non trouvé' });
    res.json({ success: true, data: project });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE /api/projects/:id — supprimer un projet
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Projet non trouvé' });
    res.json({ success: true, message: 'Projet supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};