import { motion } from "framer-motion";
import { Star } from "lucide-react";
import styles from "./Testimonials.module.css";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { fadeInUp, staggerContainer, scaleIn } from "@/lib/animations";
import { testimonialsData } from "@/data/testimonialsData";
import { COPY } from "@/config/site";

export const Testimonials = () => {
  const { ref, controls } = useScrollAnimation({ amount: 0.1 });

  return (
    <section className={styles.section} ref={ref}>
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial="hidden"
          animate={controls}
          variants={fadeInUp}
        >
          <span className={styles.eyebrow}>{COPY.testimonials.eyebrow}</span>
          <h2 className={styles.title}>{COPY.testimonials.title}</h2>
        </motion.div>

        <motion.div
          className={styles.grid}
          initial="hidden"
          animate={controls}
          variants={staggerContainer}
        >
          {testimonialsData.map((t) => (
            <motion.div key={t.id} className={styles.card} variants={scaleIn}>
              {/* Stars */}
              <div className={styles.stars}>
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>

              <p className={styles.comment}>"{t.comment}"</p>

              <div className={styles.author}>
                <div className={styles.avatar}>{t.avatar}</div>
                <div>
                  <p className={styles.name}>{t.name}</p>
                  <p className={styles.role}>{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
