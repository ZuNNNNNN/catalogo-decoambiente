import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import styles from "./Navbar.module.css";
import { Menu, X, ShoppingBag } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle/ThemeToggle";
import { COPY } from "@/config/site";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = COPY.navbar.links;

  return (
    <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ""}`}>
      <div className={styles.container}>
        {/* Logo */}
        <Link to="/" className={styles.logo}>
          <span className={styles.logoText}>Deco</span>
          <span className={styles.logoAccent}>&</span>
          <span className={styles.logoText}>Hogar</span>
        </Link>

        {/* Desktop Navigation */}
        <div className={styles.navLinks}>
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.active : ""}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className={styles.actions}>
          <ThemeToggle />
          <Link to="/catalogo" className={styles.ctaButton}>
            <ShoppingBag size={18} />
            {COPY.navbar.cta}
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className={styles.mobileMenuButton}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.open : ""}`}
      >
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/"}
            className={({ isActive }) =>
              `${styles.mobileNavLink} ${isActive ? styles.active : ""}`
            }
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {link.label}
          </NavLink>
        ))}
        <Link
          to="/catalogo"
          className={styles.mobileCta}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          {COPY.navbar.cta}
        </Link>
        <div className={styles.mobileThemeToggle}>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};
