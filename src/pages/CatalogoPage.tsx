import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  X,
  LayoutGrid,
  List,
  ChevronDown,
} from "lucide-react";
import styles from "./CatalogoPage.module.css";
import { featuredProductsData } from "@/data/productsData";
import { categoriesData } from "@/data/categoriesData";
import { formatPrice } from "@/lib/utils";
import { scaleIn, staggerContainer } from "@/lib/animations";
import type { SortOption, FilterState } from "@/types";

export const CatalogoPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [filters, setFilters] = useState<FilterState>({
    categoria: searchParams.get("categoria") || "",
    precioMin: 0,
    precioMax: 1000000,
    busqueda: searchParams.get("q") || "",
    sort: "destacados",
  });

  // Update URL when filters change
  useEffect(() => {
    const params: Record<string, string> = {};
    if (filters.categoria) params.categoria = filters.categoria;
    if (filters.busqueda) params.q = filters.busqueda;
    setSearchParams(params, { replace: true });
  }, [filters.categoria, filters.busqueda, setSearchParams]);

  const filteredProducts = useMemo(() => {
    let result = [...featuredProductsData];

    if (filters.categoria) {
      result = result.filter((p) => p.category === filters.categoria);
    }

    if (filters.busqueda) {
      const q = filters.busqueda.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }

    result = result.filter(
      (p) => p.price >= filters.precioMin && p.price <= filters.precioMax,
    );

    switch (filters.sort) {
      case "nombre-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "nombre-desc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "precio-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "precio-desc":
        result.sort((a, b) => b.price - a.price);
        break;
    }

    return result;
  }, [filters]);

  const clearFilters = () => {
    setFilters({
      categoria: "",
      precioMin: 0,
      precioMax: 1000000,
      busqueda: "",
      sort: "destacados",
    });
  };

  const hasActiveFilters =
    filters.categoria ||
    filters.busqueda ||
    filters.precioMin > 0 ||
    filters.precioMax < 1000000;

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderContainer}>
          <div>
            <h1 className={styles.pageTitle}>Catálogo</h1>
            <p className={styles.pageSubtitle}>
              {filteredProducts.length} productos encontrados
            </p>
          </div>

          {/* Search */}
          <div className={styles.searchBar}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Buscar producto..."
              value={filters.busqueda}
              onChange={(e) =>
                setFilters((f) => ({ ...f, busqueda: e.target.value }))
              }
              className={styles.searchInput}
            />
            {filters.busqueda && (
              <button
                onClick={() => setFilters((f) => ({ ...f, busqueda: "" }))}
                className={styles.searchClear}
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className={styles.body}>
        {/* Sidebar Filters */}
        <aside
          className={`${styles.sidebar} ${filtersOpen ? styles.sidebarOpen : ""}`}
        >
          <div className={styles.sidebarHeader}>
            <h3 className={styles.sidebarTitle}>Filtros</h3>
            {hasActiveFilters && (
              <button onClick={clearFilters} className={styles.clearBtn}>
                Limpiar todo
              </button>
            )}
          </div>

          {/* Categories filter */}
          <div className={styles.filterGroup}>
            <h4 className={styles.filterTitle}>Categoría</h4>
            <button
              className={`${styles.filterOption} ${filters.categoria === "" ? styles.active : ""}`}
              onClick={() => setFilters((f) => ({ ...f, categoria: "" }))}
            >
              Todas las categorías
            </button>
            {categoriesData.map((cat) => (
              <button
                key={cat.slug}
                className={`${styles.filterOption} ${filters.categoria === cat.slug ? styles.active : ""}`}
                onClick={() =>
                  setFilters((f) => ({ ...f, categoria: cat.slug }))
                }
              >
                <span>{cat.emoji}</span>
                <span>{cat.name}</span>
                <span className={styles.filterCount}>{cat.count}</span>
              </button>
            ))}
          </div>

          {/* Price filter */}
          <div className={styles.filterGroup}>
            <h4 className={styles.filterTitle}>Precio máximo</h4>
            <input
              type="range"
              min="0"
              max="500000"
              step="5000"
              value={filters.precioMax}
              onChange={(e) =>
                setFilters((f) => ({ ...f, precioMax: Number(e.target.value) }))
              }
              className={styles.rangeInput}
            />
            <div className={styles.priceLabels}>
              <span>{formatPrice(0)}</span>
              <span>{formatPrice(filters.precioMax)}</span>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className={styles.main}>
          {/* Toolbar */}
          <div className={styles.toolbar}>
            <button
              className={styles.filterToggle}
              onClick={() => setFiltersOpen(!filtersOpen)}
            >
              <SlidersHorizontal size={16} />
              Filtros
              {hasActiveFilters && <span className={styles.filterBadge} />}
            </button>

            {/* Active filter chips */}
            {filters.categoria && (
              <span className={styles.chip}>
                {categoriesData.find((c) => c.slug === filters.categoria)?.name}
                <button
                  onClick={() => setFilters((f) => ({ ...f, categoria: "" }))}
                >
                  <X size={12} />
                </button>
              </span>
            )}

            <div className={styles.toolbarRight}>
              {/* Sort */}
              <div className={styles.sortWrapper}>
                <select
                  value={filters.sort}
                  onChange={(e) =>
                    setFilters((f) => ({
                      ...f,
                      sort: e.target.value as SortOption,
                    }))
                  }
                  className={styles.sortSelect}
                >
                  <option value="destacados">Destacados</option>
                  <option value="precio-asc">Menor precio</option>
                  <option value="precio-desc">Mayor precio</option>
                  <option value="nombre-asc">A-Z</option>
                  <option value="nombre-desc">Z-A</option>
                </select>
                <ChevronDown size={14} className={styles.sortArrow} />
              </div>

              {/* View mode */}
              <div className={styles.viewToggle}>
                <button
                  className={viewMode === "grid" ? styles.viewActive : ""}
                  onClick={() => setViewMode("grid")}
                  aria-label="Vista grilla"
                >
                  <LayoutGrid size={18} />
                </button>
                <button
                  className={viewMode === "list" ? styles.viewActive : ""}
                  onClick={() => setViewMode("list")}
                  aria-label="Vista lista"
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Products grid */}
          {filteredProducts.length === 0 ? (
            <div className={styles.empty}>
              <span className={styles.emptyIcon}>🔍</span>
              <h3>No encontramos productos</h3>
              <p>Intentá con otros filtros o búsqueda.</p>
              <button onClick={clearFilters} className={styles.emptyBtn}>
                Limpiar filtros
              </button>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={`${filters.categoria}-${filters.busqueda}-${viewMode}`}
                className={`${styles.grid} ${viewMode === "list" ? styles.listView : ""}`}
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
              >
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    className={styles.card}
                    variants={scaleIn}
                    layout
                  >
                    <div className={styles.cardImage}>
                      <span className={styles.cardEmoji}>{product.emoji}</span>
                      <div className={styles.cardCategory}>
                        {product.category}
                      </div>
                    </div>
                    <div className={styles.cardBody}>
                      <h3 className={styles.cardName}>{product.name}</h3>
                      {viewMode === "list" && (
                        <p className={styles.cardDesc}>{product.description}</p>
                      )}
                      <div className={styles.cardTags}>
                        {product.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className={styles.tag}>
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className={styles.cardFooter}>
                        <span className={styles.cardPrice}>
                          {formatPrice(product.price)}
                        </span>
                        <a
                          href={`https://wa.me/5491100000000?text=Hola! Me interesa el producto: ${product.name} (${formatPrice(product.price)})`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.cardBtn}
                        >
                          Consultar
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </main>
      </div>
    </div>
  );
};
