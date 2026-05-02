 const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Le titre est obligatoire'],
    trim: true,
    maxlength: [100, 'Le titre ne peut pas dépasser 100 caractères']
  },
  short: {
    type: String,
    required: [true, 'Le résumé est obligatoire'],
    trim: true,
    maxlength: [200, 'Le résumé ne peut pas dépasser 200 caractères']
  },
  description: {
    type: String,
    required: [true, 'La description est obligatoire'],
    trim: true
  },
  image: {
    type: String, // base64 ou URL
    default: null
  },
  tags: [{
    type: String,
    trim: true
  }],
  type: {
    type: String,
    enum: ['Web', 'Mobile', 'Desktop', 'API', 'Cloud', 'DevOps', 'IA', 'Autre'],
    required: [true, 'Le type est obligatoire']
  },
  status: {
    type: String,
    enum: ['En cours', 'Terminé', 'Archivé'],
    default: 'En cours'
  },
  github: {
    type: String,
    trim: true,
    default: ''
  },
  demo: {
    type: String,
    trim: true,
    default: ''
  },
  features: [{
    type: String,
    trim: true
  }],
  members: [{
    type: String,
    trim: true
  }],
  awsServices: [{
    type: String,
    trim: true
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);