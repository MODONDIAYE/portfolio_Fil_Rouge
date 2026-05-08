export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>
          <h3><span className="logo-accent">Modou</span> NDIAYE</h3>
          <p>Développeur Fullstack — Portfolio connecté à Express.js &amp; MongoDB Atlas.</p>
        </div>
        <div>
          <h4>Contact</h4>
          <ul>
            <li><i className="fa-solid fa-envelope" /> modou2243@gmail.com</li>
            <li><i className="fa-solid fa-location-dot" /> Dakar, Sénégal</li>
            <li><i className="fa-brands fa-github" /> github.com/MODONDIAYE</li>
          </ul>
        </div>
      </div>
      <p className="copy">© {new Date().getFullYear()} Modou NDIAYE — Portfolio Express.js + MongoDB V6</p>
    </footer>
  );
}
