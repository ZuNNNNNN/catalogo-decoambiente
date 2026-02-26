import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, ShoppingBag } from "lucide-react";
import styles from "./FeaturedProducts.module.css";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { fadeInUp, staggerContainer, scaleIn } from "@/lib/animations";
import { featuredProductsData } from "@/data/productsData";
import { formatPrice } from "@/lib/utils";
import { COPY } from "@/config/site";

export const FeaturedProducts = () => {
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
          <span className={styles.eyebrow}>{COPY.featured.eyebrow}</span>
          <h2 className={styles.title}>{COPY.featured.title}</h2>
          <p className={styles.subtitle}>{COPY.featured.subtitle}</p>
        </motion.div>

        <motion.div
          className={styles.grid}
          initial="hidden"
          animate={controls}
          variants={staggerContainer}
        >
          {featuredProductsData.map((product) => (
            <motion.div
              key={product.id}
              className={styles.card}
              variants={scaleIn}
            >
              <div className={styles.cardImage}>
                <div className={styles.cardEmoji}>
                  {product.Icon && <product.Icon size={36} strokeWidth={1.2} />}
                </div>
                <div className={styles.cardCategory}>{product.category}</div>
              </div>
              <div className={styles.cardBody}>
                <h3 className={styles.cardName}>{product.name}</h3>
                <p className={styles.cardDesc}>{product.description}</p>
                <div className={styles.cardFooter}>
                  <span className={styles.cardPrice}>
                    {formatPrice(product.price)}
                  </span>
                  <Link
                    to={`/catalogo`}
                    className={styles.cardBtn}
                    aria-label={`Ver ${product.name}`}
                  >
                    <ShoppingBag size={16} />
                    {COPY.featured.cta}
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className={styles.seeAll}
          initial="hidden"
          animate={controls}
          variants={fadeInUp}
        >
          <Link to="/catalogo" className={styles.seeAllBtn}>
            {COPY.featured.seeAll}
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
