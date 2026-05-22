const request  = require('supertest');
const mongoose = require('mongoose');
const app      = require('../server');

// afterAll : s'exécute une fois après tous les tests du fichier.
// Ferme la connexion Mongoose pour éviter que Jest reste bloqué
// en attente de connexions ouvertes.
afterAll(async () => {
  await mongoose.connection.close();
});

describe('Health Check', () => {
  test('GET /api/health doit retourner 200', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('OK');
  });
});