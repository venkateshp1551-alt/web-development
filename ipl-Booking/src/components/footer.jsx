function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="footer-content">
        <p>&copy; {currentYear} IPL Booking. All rights reserved.</p>

        <nav aria-label="Footer navigation">
          <a href="/terms">Terms</a>
          <a href="/privacy">Privacy</a>
          <a href="/contact">Contact</a>
        </nav>
      </div>
    </footer>
  )
}

export default Footer