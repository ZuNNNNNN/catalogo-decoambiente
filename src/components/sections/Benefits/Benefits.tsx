import { motion } from "framer-motion";
import styles from "./Benefits.module.css";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { fadeInUp, staggerContainer, scaleIn } from "@/lib/animations";
import { benefitsData } from "@/data/benefitsData";
import { COPY } from "@/config/site";

export const Benefits = () => {
  const { ref, controls } = useScrollAnimation({ amount: 0.15 });

  return (
    <section className={styles.section} ref={ref}>
      <div className={styles.container}>
        {/* Left: text */}
        <motion.div
          className={styles.textSide}
          initial="hidden"
          animate={controls}
          variants={fadeInUp}
        >
          <span className={styles.eyebrow}>{COPY.benefits.eyebrow}</span>
          <h2 className={styles.title}>
            {COPY.benefits.title}
            <br />
            <em>{COPY.benefits.titleEm}</em>
          </h2>
          <p className={styles.subtitle}>{COPY.benefits.subtitle}</p>
          <div className={styles.accent} />
        </motion.div>

        {/* Right: grid */}
        <motion.div
          className={styles.grid}
          initial="hidden"
          animate={controls}
          variants={staggerContainer}
        >
          {benefitsData.map((b) => (
            <motion.div
              key={b.title}
              className={styles.card}
              variants={scaleIn}
            >
              <div className={styles.cardIcon}>
                <b.icon size={28} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className={styles.cardTitle}>{b.title}</h3>
                <p className={styles.cardDesc}>{b.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
