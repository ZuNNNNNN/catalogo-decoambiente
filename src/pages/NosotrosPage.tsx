import { motion } from "framer-motion";
import { Heart, Leaf, Award, Users } from "lucide-react";
import styles from "./NosotrosPage.module.css";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { COPY } from "@/config/site";

export const NosotrosPage = () => {
  return (
    <main className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <motion.div
          className={styles.heroContent}
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.p className={styles.eyebrow} variants={fadeInUp}>
            {COPY.nosotros.eyebrow}
          </motion.p>
          <motion.h1 className={styles.title} variants={fadeInUp}>
            {COPY.nosotros.title} <em>{COPY.nosotros.titleEm}</em>
          </motion.h1>
          <motion.p className={styles.subtitle} variants={fadeInUp}>
            {COPY.nosotros.subtitle}
          </motion.p>
        </motion.div>
      </section>

      {/* Values */}
      <section className={styles.values}>
        <div className={styles.container}>
          <motion.div
            className={styles.valuesGrid}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
          >
            {[
              {
                icon: Heart,
                ...COPY.nosotros.values[0],
              },
              {
                icon: Leaf,
                ...COPY.nosotros.values[1],
              },
              {
                icon: Award,
                ...COPY.nosotros.values[2],
              },
              {
                icon: Users,
                ...COPY.nosotros.values[3],
              },
            ].map((v) => (
              <motion.div
                key={v.title}
                className={styles.valueCard}
                variants={fadeInUp}
              >
                <div className={styles.valueIcon}>
                  <v.icon size={28} />
                </div>
                <h3 className={styles.valueTitle}>{v.title}</h3>
                <p className={styles.valueDesc}>{v.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className={styles.story}>
        <div className={styles.container}>
          <div className={styles.storyGrid}>
            <motion.div
              className={styles.storyText}
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h2 className={styles.storyTitle}>{COPY.nosotros.storyTitle}</h2>
              <p>{COPY.nosotros.storyP1}</p>
              <p>{COPY.nosotros.storyP2}</p>
              <div className={styles.stats}>
                {COPY.nosotros.stats.map((stat) => (
                  <div key={stat.label} className={styles.stat}>
                    <span className={styles.statNum}>{stat.num}</span>
                    <span className={styles.statLabel}>{stat.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div
              className={styles.storyVisual}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className={styles.visualCard}>
                <span className={styles.visualEmoji}>🏺</span>
                <p className={styles.visualText}>{COPY.nosotros.quote}</p>
                <span className={styles.visualAuthor}>
                  {COPY.nosotros.quoteAuthor}
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
};
