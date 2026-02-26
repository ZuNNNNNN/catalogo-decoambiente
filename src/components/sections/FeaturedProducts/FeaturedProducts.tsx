import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, ShoppingBag, Loader2 } from "lucide-react";
import styles from "./FeaturedProducts.module.css";
import { fadeInUp, staggerContainer, scaleIn } from "@/lib/animations";
import { useProducts } from "@/hooks/useProducts";
import { formatPrice } from "@/lib/utils";
import { COPY } from "@/config/site";
import { useMemo } from "react";

export const FeaturedProducts = () => {
  const { products, loading } = useProducts();

  // Filtrar productos destacados
  const featuredProducts = useMemo(() => {
    console.log("🎯 Products for featured:", products.length, products);
    const featured = products.filter((p) => p.featured);
    console.log("⭐ Featured products found:", featured.length, featured);
    return featured.slice(0, 6);
  }, [products]);

  if (loading || (products.length === 0 && featuredProducts.length === 0)) {
    return (
      <section className={styles.section}>
        <div className={styles.container}>
          <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
            <Loader2
              size={32}
              style={{ animation: "spin 1s linear infinite" }}
            />
            <p style={{ marginTop: "1rem", color: "#888" }}>
              Cargando productos destacados...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (featuredProducts.length === 0) {
    return (
      <section className={styles.section}>
        <div className={styles.container}>
          <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
            <p style={{ color: "#888" }}>
              No hay productos destacados disponibles
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
        >
          <span className={styles.eyebrow}>{COPY.featured.eyebrow}</span>
          <h2 className={styles.title}>{COPY.featured.title}</h2>
          <p className={styles.subtitle}>{COPY.featured.subtitle}</p>
        </motion.div>

        <motion.div
          className={styles.grid}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
        >
          {featuredProducts.map((product) => (
            <motion.div
              key={product.id}
              className={styles.card}
              variants={scaleIn}
            >
              <div className={styles.cardImage}>
                <div className={styles.cardEmoji}>{product.emoji || "📦"}</div>
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
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
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
