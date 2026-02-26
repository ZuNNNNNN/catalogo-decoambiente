import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Home } from "lucide-react";
import styles from "./Hero.module.css";
import {
  fadeInUp,
  fadeInLeft,
  staggerContainer,
  parallaxLayers,
} from "@/lib/animations";
import { COPY } from "@/config/site";

export const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Parallax layers
  const bgY = useTransform(
    scrollYProgress,
    [0, 1],
    parallaxLayers.background.y,
  );
  const bgScale = useTransform(
    scrollYProgress,
    [0, 1],
    parallaxLayers.background.scale,
  );
  const midY = useTransform(scrollYProgress, [0, 1], parallaxLayers.middle.y);
  const fgY = useTransform(
    scrollYProgress,
    [0, 1],
    parallaxLayers.foreground.y,
  );
  const fgScale = useTransform(
    scrollYProgress,
    [0, 1],
    parallaxLayers.foreground.scale,
  );
  const fastY = useTransform(scrollYProgress, [0, 1], parallaxLayers.fast.y);

  return (
    <motion.section
      id="hero"
      ref={sectionRef}
      className={styles.hero}
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      {/* Decorative shapes - Background layer */}
      <motion.div
        className={styles.shapeCircleBg}
        style={{ y: bgY, scale: bgScale }}
      />
      <motion.div
        className={styles.shapeRectBg}
        style={{ y: bgY, scale: bgScale }}
      />

      {/* Middle layer - arch / oval shapes */}
      <motion.div className={styles.shapeArchLeft} style={{ y: midY }} />
      <motion.div className={styles.shapeArchRight} style={{ y: midY }} />

      {/* Foreground - dots pattern */}
      <motion.div
        className={styles.dotsPattern}
        style={{ y: fgY, scale: fgScale }}
      />

      {/* Fast layer - small accent dots */}
      <motion.div className={styles.accentDot1} style={{ y: fastY }} />
      <motion.div className={styles.accentDot2} style={{ y: fastY }} />

      <div className={styles.container}>
        <div className={styles.content}>
          {/* Badge */}
          <motion.div className={styles.badge} variants={fadeInUp}>
            <Sparkles size={14} />
            <span>{COPY.hero.badge}</span>
          </motion.div>

          <motion.h1 className={styles.title} variants={fadeInLeft}>
            {COPY.hero.title}
            <br />
            <em>{COPY.hero.titleEm}</em>
          </motion.h1>

          <motion.p className={styles.subtitle} variants={fadeInUp}>
            {COPY.hero.subtitle}
          </motion.p>

          <motion.div className={styles.actions} variants={fadeInUp}>
            <Link to="/catalogo" className={styles.btnPrimary}>
              {COPY.hero.ctaPrimary}
              <ArrowRight size={18} />
            </Link>
            <Link to="#categorias" className={styles.btnSecondary}>
              {COPY.hero.ctaSecondary}
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div className={styles.stats} variants={staggerContainer}>
            {COPY.hero.stats.map((stat) => (
              <motion.div
                key={stat.label}
                className={styles.stat}
                variants={fadeInUp}
              >
                <span className={styles.statValue}>{stat.value}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Image area */}
        <motion.div className={styles.imageArea} variants={fadeInLeft}>
          <div className={styles.imagePlaceholder}>
            <div className={styles.imageInner}>
              <div className={styles.imageBadge}>
                <span>✦</span>
                <span>{COPY.hero.floatingCard.label}</span>
              </div>
            </div>
          </div>
          {/* Floating accent card */}
          <motion.div
            className={styles.floatingCard}
            animate={{ y: [-8, 8, -8] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Home
              size={22}
              strokeWidth={1.5}
              className={styles.floatingCardEmoji}
            />
            <div>
              <p className={styles.floatingCardTitle}>
                {COPY.hero.floatingCard.name}
              </p>
              <p className={styles.floatingCardSub}>
                {COPY.hero.floatingCard.sub}
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className={styles.scrollIndicator}
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className={styles.scrollLine} />
        <span>Scroll</span>
      </motion.div>
    </motion.section>
  );
};
