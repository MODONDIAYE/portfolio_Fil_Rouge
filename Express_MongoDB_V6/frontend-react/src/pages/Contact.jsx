import { useState } from 'react';
import { contactApi } from '../api/api';

export default function Contact() {
  const [form, setForm]     = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [erreur, setErreur] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async e => {
    e.preventDefault();
    setSending(true); setErreur(''); setSuccessMsg('');
    try {
      await contactApi.send(form);
      setSuccessMsg('✅ Message envoyé avec succès ! Nous vous répondrons bientôt.');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setErreur(err.response?.data?.message || '❌ Erreur lors de l\'envoi.');
    }
    setSending(false);
  };

  return (
    <section className="dossier-section">
      <div className="container">
        <div className="section-header">
          <span className="section-label">Me Contacter</span>
          <h2 className="section-title">Contact</h2>
          <div className="section-divider" />
          <p className="section-subtitle">Envoyez-moi un message, je vous répondrai rapidement.</p>
        </div>

        <div className="contact-grid">
          {/* Formulaire */}
          <form className="form-card" onSubmit={handleSubmit}>
            <h3><i className="fa-solid fa-paper-plane" /> Formulaire de contact</h3>
            {successMsg && <p className="success-msg">{successMsg}</p>}
            {erreur     && <p className="error">{erreur}</p>}
            <div className="form-grid">
              <div className="field">
                <label>Nom complet *</label>
                <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Votre nom" required />
              </div>
              <div className="field">
                <label>Email *</label>
                <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="votre@email.com" required />
              </div>
              <div className="field full">
                <label>Sujet *</label>
                <input value={form.subject} onChange={e => set('subject', e.target.value)} placeholder="Objet de votre message" required />
              </div>
              <div className="field full">
                <label>Message *</label>
                <textarea rows="5" value={form.message} onChange={e => set('message', e.target.value)} placeholder="Votre message…" required />
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={sending}>
                <i className="fa-solid fa-paper-plane" />
                {sending ? 'Envoi en cours…' : 'Envoyer le message'}
              </button>
            </div>
          </form>

          {/* Infos */}
          <div>
            <div className="contact-info-card">
              <h3><i className="fa-solid fa-user" style={{ color: '#f59e0b', marginRight: '.5rem' }} /> Modou NDIAYE</h3>
              <p>Développeur Fullstack passionné par le web, le cloud AWS et les architectures modernes.</p>
            </div>
            <div className="contact-info-card">
              <h3><i className="fa-solid fa-location-dot" style={{ color: '#f59e0b', marginRight: '.5rem' }} /> Localisation</h3>
              <p>Dakar, Sénégal 🇸🇳</p>
            </div>
            <div className="contact-info-card">
              <h3><i className="fa-solid fa-code" style={{ color: '#f59e0b', marginRight: '.5rem' }} /> Stack technique</h3>
              <div className="card-techs" style={{ marginTop: '.5rem' }}>
                {['React', 'Express.js', 'MongoDB', 'Node.js', 'AWS', 'Docker'].map(t => (
                  <span key={t} className="tech">{t}</span>
                ))}
              </div>
            </div>
            <div className="contact-info-card">
              <h3><i className="fa-brands fa-github" style={{ color: '#f59e0b', marginRight: '.5rem' }} /> GitHub</h3>
              <a href="https://github.com/MODONDIAYE" target="_blank" rel="noreferrer" style={{ color: '#f59e0b' }}>
                github.com/MODONDIAYE
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
