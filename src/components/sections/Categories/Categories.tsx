import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import styles from "./Categories.module.css";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { fadeInUp, staggerContainer, scaleIn } from "@/lib/animations";
import { categoriesData } from "@/data/categoriesData";
import { COPY } from "@/config/site";

export const Categories = () => {
  const { ref, controls } = useScrollAnimation({ amount: 0.15 });

  return (
    <section id="categorias" className={styles.categories} ref={ref}>
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial="hidden"
          animate={controls}
          variants={fadeInUp}
        >
          <span className={styles.eyebrow}>{COPY.categories.eyebrow}</span>
          <h2 className={styles.title}>
            {COPY.categories.title}
            <br />
            <em>{COPY.categories.titleEm}</em>
          </h2>
          <p className={styles.subtitle}>{COPY.categories.subtitle}</p>
        </motion.div>

        <motion.div
          className={styles.grid}
          initial="hidden"
          animate={controls}
          variants={staggerContainer}
        >
          {categoriesData.map((cat) => (
            <motion.div key={cat.slug} variants={scaleIn}>
              <Link
                to={`/catalogo?categoria=${cat.slug}`}
                className={styles.card}
              >
                <div className={styles.cardIcon}>
                  <cat.Icon size={28} strokeWidth={1.5} />
                </div>
                <div
                  className={styles.cardGradient}
                  style={{ background: cat.gradient }}
                />
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{cat.name}</h3>
                  <span className={styles.cardCount}>
                    {cat.count} {COPY.categories.countSuffix}
                  </span>
                </div>
                <div className={styles.cardArrow}>
                  <ArrowRight size={18} />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
