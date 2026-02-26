import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, Package, Loader2, AlertCircle } from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Product } from "@/types";
import styles from "./AdminDashboardPage.module.css";

export function AdminDashboardSimple() {
  const { user, logout } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("📦 Cargando productos desde Firestore...");
      const querySnapshot = await getDocs(collection(db, "products"));
      const productsData: Product[] = [];

      querySnapshot.forEach((doc) => {
        productsData.push({
          id: doc.id,
          ...doc.data(),
        } as Product);
      });

      console.log(`✅ Cargados ${productsData.length} productos`);
      setProducts(productsData);
    } catch (err) {
      console.error("❌ Error al cargar productos:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    }
  };

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <Package size={28} />
          <div>
            <h1 className={styles.headerTitle}>Panel de Administración</h1>
            <p className={styles.headerSubtitle}>
              Bienvenido {user?.displayName || user?.email}
            </p>
          </div>
        </div>
        <button onClick={handleLogout} className={styles.logoutBtn}>
          <LogOut size={18} />
          Cerrar sesión
        </button>
      </header>

      {/* Content */}
      <main className={styles.main}>
        <div className={styles.toolbar}>
          <div className={styles.stats}>
            <Package size={20} />
            <span>Total de productos: {products.length}</span>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className={styles.loadingState}>
            <Loader2 size={48} className={styles.spinner} />
            <p>Cargando productos desde Firestore...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className={styles.errorState}>
            <AlertCircle size={48} />
            <h3>Error al cargar productos</h3>
            <p>{error}</p>
            <button onClick={loadProducts} className={styles.retryBtn}>
              Reintentar
            </button>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && products.length === 0 && (
          <div className={styles.emptyState}>
            <Package size={64} />
            <h3>No hay productos</h3>
            <p>La base de datos está vacía. Agrega productos para comenzar.</p>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className={styles.productsGrid}>
            {products.map((product) => (
              <div key={product.id} className={styles.productCard}>
                <div className={styles.productEmoji}>{product.emoji}</div>
                <h3 className={styles.productName}>{product.name}</h3>
                <p className={styles.productCategory}>{product.category}</p>
                <p className={styles.productPrice}>
                  ${product.price.toLocaleString()}
                </p>
                {product.description && (
                  <p className={styles.productDescription}>
                    {product.description}
                  </p>
                )}
                {product.tags && product.tags.length > 0 && (
                  <div className={styles.productTags}>
                    {product.tags.map((tag, idx) => (
                      <span key={idx} className={styles.tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <div className={styles.productMeta}>
                  <span>Stock: {product.stock || 0}</span>
                  {product.sku && <span>SKU: {product.sku}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
