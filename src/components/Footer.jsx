export default function Footer() {
  return (<footer id="footer" className="footer-section">
    <div className="footer-content">
        <div className="social-links-footer">
            <a href="https://linkedin.com/in/paulalarba" target="_blank" rel="noopener noreferrer" className="social-link-footer" aria-label="LinkedIn"><i className="fa-brands fa-linkedin"></i></a>
            <a href="https://github.com/Paulalarba" target="_blank" rel="noopener noreferrer" className="social-link-footer" aria-label="GitHub"><i className="fa-brands fa-github"></i></a>
            <a href="mailto:paulnicoralarba@gmail.com" className="social-link-footer" aria-label="Email"><i className="fa-solid fa-envelope"></i></a>
            <a href="https://x.com/paulalarba" target="_blank" rel="noopener noreferrer" className="social-link-footer" aria-label="X (Twitter)"><i className="fa-brands fa-x-twitter"></i></a>
        </div>
        <p className="footer-text">&copy; {new Date().getFullYear()} Paul Alarba. All rights reserved.</p>
    </div>
</footer>);
}
