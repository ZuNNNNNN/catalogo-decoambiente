import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import styles from "./Categories.module.css";
import { fadeInUp, staggerContainer, scaleIn } from "@/lib/animations";
import { useCategories } from "@/hooks/useCategories";
import { useProducts } from "@/hooks/useProducts";
import { getIconForEmoji, getGradientForCategory } from "@/lib/categoryHelpers";
import { COPY } from "@/config/site";
import type { CategoryUI } from "@/types";
import { useMemo } from "react";

export const Categories = () => {
  const { categories, loading: loadingCategories } = useCategories();
  const { products } = useProducts();

  // Transformar CategoryDocument a CategoryUI con count dinámico
  const categoriesUI = useMemo<CategoryUI[]>(() => {
    console.log("📊 Categories:", categories.length, categories);
    console.log("📦 Products:", products.length, products);
    const result = categories.map((cat) => ({
      slug: cat.slug,
      name: cat.name,
      description: cat.description,
      emoji: cat.emoji,
      Icon: getIconForEmoji(cat.emoji),
      count: products.filter((p) => p.category === cat.slug).length,
      gradient: getGradientForCategory(cat.slug),
      featured: cat.featured,
    }));
    console.log("✅ CategoriesUI transformed:", result.length, result);
    return result;
  }, [categories, products]);

  if (
    loadingCategories ||
    (categories.length === 0 && categoriesUI.length === 0)
  ) {
    console.log("⏳ Categories LOADING state");
    return (
      <section id="categorias" className={styles.categories}>
        <div className={styles.container}>
          <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
            <Loader2
              size={32}
              style={{ animation: "spin 1s linear infinite" }}
            />
            <p style={{ marginTop: "1rem", color: "#888" }}>
              Cargando categorías...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (categoriesUI.length === 0) {
    console.log("⚠️ Categories EMPTY state");
    return (
      <section id="categorias" className={styles.categories}>
        <div className={styles.container}>
          <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
            <p style={{ color: "#888" }}>No hay categorías disponibles</p>
          </div>
        </div>
      </section>
    );
  }

  console.log("✅ Categories RENDERING with", categoriesUI.length, "items");

  return (
    <section id="categorias" className={styles.categories}>
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
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
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
        >
          {categoriesUI.map((cat) => (
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
