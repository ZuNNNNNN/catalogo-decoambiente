import { Link } from "react-router-dom";
import styles from "./Footer.module.css";
import { Instagram, Facebook } from "lucide-react";
import { MessageCircle, Phone, MapPin, Mail } from "lucide-react";
import { CONTACT, COPY, SITE, WHATSAPP_URL } from "@/config/site";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Top section */}
        <div className={styles.top}>
          {/* Brand */}
          <div className={styles.brand}>
            <Link to="/" className={styles.logo}>
              <span>Deco</span>
              <span className={styles.logoAccent}>&</span>
              <span>Hogar</span>
            </Link>
            <p className={styles.tagline}>{COPY.footer.tagline}</p>
            <div className={styles.social}>
              <a
                href={CONTACT.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href={CONTACT.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href={WHATSAPP_URL()}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="WhatsApp"
              >
                <MessageCircle size={20} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>{COPY.footer.navTitle}</h4>
            <nav className={styles.links}>
              {COPY.navbar.links.map((link) => (
                <Link key={link.to} to={link.to} className={styles.link}>
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Categories */}
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>
              {COPY.footer.categoriesTitle}
            </h4>
            <nav className={styles.links}>
              {COPY.footer.categoriesLinks.map((link) => (
                <Link key={link.to} to={link.to} className={styles.link}>
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>{COPY.footer.contactTitle}</h4>
            <div className={styles.contactList}>
              <div className={styles.contactItem}>
                <Phone size={16} />
                <span>{CONTACT.phone}</span>
              </div>
              <div className={styles.contactItem}>
                <Mail size={16} />
                <span>{CONTACT.email}</span>
              </div>
              <div className={styles.contactItem}>
                <MapPin size={16} />
                <span>{CONTACT.address}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © {currentYear} {SITE.fullName}. {COPY.footer.copyright}
          </p>
          <a
            href={WHATSAPP_URL()}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.whatsappBtn}
          >
            <MessageCircle size={18} />
            Consultar por WhatsApp
          </a>
        </div>
      </div>
    </footer>
  );
};
