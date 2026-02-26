import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, MessageCircle } from "lucide-react";
import styles from "./CTA.module.css";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { COPY, WHATSAPP_URL } from "@/config/site";

export const CTA = () => {
  const { ref, controls } = useScrollAnimation({ amount: 0.2 });

  return (
    <section className={styles.section} ref={ref}>
      {/* Decorativa */}
      <div className={styles.shapeTL} />
      <div className={styles.shapeBR} />

      <motion.div
        className={styles.content}
        initial="hidden"
        animate={controls}
        variants={staggerContainer}
        ref={ref}
      >
        <motion.span className={styles.eyebrow} variants={fadeInUp}>
          {COPY.cta.eyebrow}
        </motion.span>

        <motion.h2 className={styles.title} variants={fadeInUp}>
          {COPY.cta.title}
          <br />
          <em>{COPY.cta.titleEm}</em>
        </motion.h2>

        <motion.p className={styles.subtitle} variants={fadeInUp}>
          {COPY.cta.subtitle}
        </motion.p>

        <motion.div className={styles.actions} variants={fadeInUp}>
          <Link to="/catalogo" className={styles.btnPrimary}>
            {COPY.cta.ctaPrimary}
            <ArrowRight size={18} />
          </Link>
          <a
            href={WHATSAPP_URL(COPY.cta.ctaWhatsapp)}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.btnWhatsapp}
          >
            <MessageCircle size={18} />
            {COPY.cta.ctaWhatsapp}
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
};
