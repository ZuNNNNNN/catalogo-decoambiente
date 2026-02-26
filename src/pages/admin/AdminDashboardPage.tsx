/**
 * Admin Dashboard - Refactorizado con React 19 Best Practices
 * - Patrón 6: Suspense + use() para carga de datos
 * - Patrón 7: ErrorBoundary para errores
 * - Patrón 8: Composición (ProductModal) y hooks reutilizables (useToast)
 */
import { useState, useDeferredValue, useMemo, Suspense } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut,
  Plus,
  Upload,
  Pencil,
  Trash2,
  Package,
  Search,
  CheckCircle2,
  Loader2,
  FileSpreadsheet,
  X,
  Tag,
  Grid3x3,
} from "lucide-react";
import styles from "./AdminDashboardPage.module.css";
import { ProductModal } from "@/components/admin/ProductModal";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { useToast } from "@/hooks/useToast";
import { useProductsSuspense } from "@/hooks/useProductsSuspense";
import { productsMutations } from "@/services/products.resource";
import { useExcelImport } from "@/hooks/useExcelImport";
import { formatPrice } from "@/lib/utils";
import { staggerContainer, scaleIn } from "@/lib/animations";
import type { Product, ProductFormData } from "@/types";
import { useAuth } from "@/hooks/useAuth";

// --------------------------------------------------------
// Excel Modal (sin cambios)
// --------------------------------------------------------
interface ExcelModalProps {
  onClose: () => void;
  onImport: (products: ProductFormData[]) => Promise<void>;
}

const ExcelModal = ({ onClose, onImport }: ExcelModalProps) => {
  const { parseExcel, preview, error } = useExcelImport();
  const [importing, setImporting] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await parseExcel(file);
    } catch {
      // El error ya está manejado por el hook
    }
  };

  const handleImport = async () => {
    if (!preview) return;
    setImporting(true);
    try {
      await onImport(preview);
      onClose();
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <motion.div
        className={`${styles.modal} ${styles.modalLarge}`}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            <FileSpreadsheet size={20} />
            Importar desde Excel
          </h2>
          <button className={styles.modalClose} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.excelBody}>
          <div className={styles.excelInstructions}>
            <h4>Instrucciones</h4>
            <p style={{ fontSize: "0.85rem", color: "#666" }}>
              Subí un archivo Excel (.xlsx o .xls) con las siguientes columnas:
            </p>
            <div
              className={styles.tableSample}
              style={{ marginTop: "0.75rem" }}
            >
              <table style={{ fontSize: "0.8rem", width: "100%" }}>
                <thead>
                  <tr>
                    <th>emoji</th>
                    <th>name</th>
                    <th>category</th>
                    <th>price</th>
                    <th>description</th>
                    <th>featured</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>🛋️</td>
                    <td>Sofá Colonial</td>
                    <td>living</td>
                    <td>850000</td>
                    <td>...</td>
                    <td>true</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <input type="file" accept=".xlsx,.xls" onChange={handleFileChange} />

          {error && (
            <div
              style={{
                color: "#ef4444",
                fontSize: "0.85rem",
                padding: "0.5rem",
              }}
            >
              {error}
            </div>
          )}

          {preview && preview.length > 0 && (
            <div>
              <h4
                style={{
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: "#999",
                  marginBottom: "0.6rem",
                }}
              >
                Vista previa ({preview.length} productos)
              </h4>
              <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                <table style={{ width: "100%", fontSize: "0.85rem" }}>
                  <thead>
                    <tr>
                      <th>Emoji</th>
                      <th>Nombre</th>
                      <th>Categoría</th>
                      <th>Precio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.map((p, i) => (
                      <tr key={i}>
                        <td>{p.emoji}</td>
                        <td>{p.name}</td>
                        <td>{p.category}</td>
                        <td>
                          {p.price?.toLocaleString("es-CL", {
                            style: "currency",
                            currency: "CLP",
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className={styles.modalActions}>
          <button type="button" onClick={onClose} className={styles.btnCancel}>
            Cancelar
          </button>
          <button
            className={styles.btnSave}
            onClick={handleImport}
            disabled={!preview || preview.length === 0 || importing}
          >
            {importing ? (
              <>
                <Loader2 size={16} className={styles.spinIcon} />
                Importando...
              </>
            ) : (
              <>
                <Upload size={16} />
                Importar {preview?.length || 0} productos
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// --------------------------------------------------------
// Products List - Separado para Suspense
// --------------------------------------------------------
function ProductsList() {
  const { products } = useProductsSuspense();
  const { showToast } = useToast();
  const [search, setSearch] = useState("");
  const [productModal, setProductModal] = useState<{
    open: boolean;
    product: Product | null;
  }>({ open: false, product: null });
  const [excelModal, setExcelModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Patrón 2: Búsqueda diferida con useDeferredValue
  const deferredSearch = useDeferredValue(search);

  const filteredProducts = useMemo(
    () =>
      products.filter(
        (p) =>
          p.name.toLowerCase().includes(deferredSearch.toLowerCase()) ||
          p.category.toLowerCase().includes(deferredSearch.toLowerCase()),
      ),
    [products, deferredSearch],
  );

  const isSearching = search !== deferredSearch;

  const handleSaveProduct = async (data: ProductFormData) => {
    try {
      if (productModal.product) {
        await productsMutations.update(productModal.product.id, data);
        showToast("✅ Producto actualizado correctamente");
      } else {
        await productsMutations.add(data);
        showToast("✅ Producto creado correctamente");
      }
    } catch (error) {
      showToast("❌ Error al guardar el producto", "error");
      console.error("Error guardando producto:", error);
      throw error;
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await productsMutations.delete(id);
      setDeleteConfirm(null);
      showToast("✅ Producto eliminado");
    } catch (error) {
      showToast("❌ Error al eliminar el producto", "error");
      console.error("Error eliminando producto:", error);
    }
  };

  const handleExcelImport = async (productsToImport: ProductFormData[]) => {
    try {
      showToast(
        `Importando ${productsToImport.length} productos...`,
        "info",
        2000,
      );

      const result = await productsMutations.bulkCreate(productsToImport);

      if (result.failed === 0) {
        showToast(
          `✅ ${result.created} producto${result.created !== 1 ? "s" : ""} importado${result.created !== 1 ? "s" : ""} correctamente`,
          "success",
          4000,
        );
      } else {
        showToast(
          `⚠️ ${result.created} importados, ${result.failed} fallaron`,
          "warning",
          5000,
        );
        console.error("Errores en importación:", result.errors);
      }
    } catch (error) {
      showToast("❌ Error al importar productos", "error");
      console.error("Error en importación:", error);
      throw error;
    }
  };

  const stats = {
    total: products.length,
    featured: products.filter((p) => p.featured === true).length,
    categories: new Set(products.map((p) => p.category)).size,
  };

  return (
    <>
      {/* Stats */}
      <motion.div
        className={styles.statsRow}
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        {[
          { label: "Total productos", value: stats.total, icon: Package },
          { label: "Destacados", value: stats.featured, icon: CheckCircle2 },
          { label: "Categorías", value: stats.categories, icon: Package },
        ].map((s) => (
          <motion.div
            key={s.label}
            className={styles.statCard}
            variants={scaleIn}
          >
            <div className={styles.statIcon}>
              <s.icon size={22} />
            </div>
            <div>
              <p className={styles.statValue}>{s.value}</p>
              <p className={styles.statLabel}>{s.label}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Products section */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionHeaderLeft}>
            <h2 className={styles.sectionTitle}>Productos</h2>
            <span className={styles.sectionCount}>
              {filteredProducts.length} de {products.length}
            </span>
          </div>
          <div className={styles.sectionActions}>
            <div className={styles.searchWrapper}>
              <Search size={16} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Buscar..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={styles.searchInput}
              />
              {isSearching && (
                <Loader2 size={14} className={styles.searchSpinner} />
              )}
            </div>
            <button
              className={styles.btnExcel}
              onClick={() => setExcelModal(true)}
            >
              <Upload size={16} />
              Importar Excel
            </button>
            <button
              className={styles.btnNew}
              onClick={() => setProductModal({ open: true, product: null })}
            >
              <Plus size={16} />
              Nuevo producto
            </button>
          </div>
        </div>

        <div
          className={styles.tableWrapper}
          style={{ opacity: isSearching ? 0.6 : 1 }}
        >
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Emoji</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Destacado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredProducts.map((p) => (
                  <motion.tr
                    key={p.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className={styles.tableRow}
                  >
                    <td className={styles.tdEmoji}>{p.emoji || "📦"}</td>
                    <td className={styles.tdName}>
                      <span>{p.name}</span>
                      {p.sku && <span className={styles.tdSku}>{p.sku}</span>}
                    </td>
                    <td>
                      <span className={styles.categoryBadge}>{p.category}</span>
                    </td>
                    <td className={styles.tdPrice}>{formatPrice(p.price)}</td>
                    <td>{p.stock ?? "—"}</td>
                    <td>
                      {p.featured === true ? (
                        <span className={styles.featuredYes}>✓ Sí</span>
                      ) : (
                        <span className={styles.featuredNo}>No</span>
                      )}
                    </td>
                    <td>
                      <div className={styles.rowActions}>
                        <button
                          className={styles.btnEdit}
                          onClick={() =>
                            setProductModal({ open: true, product: p })
                          }
                          title="Editar"
                        >
                          <Pencil size={14} />
                        </button>
                        {deleteConfirm === p.id ? (
                          <div className={styles.deleteConfirmRow}>
                            <button
                              className={styles.btnDeleteConfirm}
                              onClick={() => handleDelete(p.id)}
                            >
                              Confirmar
                            </button>
                            <button
                              className={styles.btnDeleteCancel}
                              onClick={() => setDeleteConfirm(null)}
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ) : (
                          <button
                            className={styles.btnDelete}
                            onClick={() => setDeleteConfirm(p.id)}
                            title="Eliminar"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {productModal.open && (
          <ProductModal
            product={productModal.product}
            onClose={() => setProductModal({ open: false, product: null })}
            onSave={handleSaveProduct}
          />
        )}
        {excelModal && (
          <ExcelModal
            onClose={() => setExcelModal(false)}
            onImport={handleExcelImport}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// --------------------------------------------------------
// Loading Skeleton
// --------------------------------------------------------
function ProductsTableSkeleton() {
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionHeaderLeft}>
          <div
            style={{
              width: "120px",
              height: "24px",
              background: "#e5e5e5",
              borderRadius: "4px",
            }}
          />
        </div>
      </div>
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <Loader2 size={32} className={styles.spinIcon} />
        <p style={{ marginTop: "1rem", color: "#999" }}>
          Cargando productos...
        </p>
      </div>
    </div>
  );
}

// --------------------------------------------------------
// Admin Dashboard Principal con ErrorBoundary y Suspense
// --------------------------------------------------------
export const AdminDashboardPage = () => {
  const { user, logout } = useAuth();
  const { ToastContainer } = useToast();

  return (
    <ErrorBoundary>
      <div className={styles.dashboard}>
        {/* Topbar */}
        <header className={styles.topbar}>
          <div className={styles.topbarLeft}>
            <span className={styles.topbarLogo}>
              <em>Deco</em>&amp;<em>Hogar</em>
            </span>
            <span className={styles.topbarSeparator}>/</span>
            <span className={styles.topbarTitle}>Admin</span>
          </div>
          <div className={styles.topbarRight}>
            <nav className={styles.adminNav}>
              <Link
                to="/admin/dashboard"
                className={`${styles.navLink} ${styles.navLinkActive}`}
              >
                <Package size={16} />
                Productos
              </Link>
              <Link to="/admin/categories" className={styles.navLink}>
                <Tag size={16} />
                Categorías
              </Link>
              <Link to="/admin/collections" className={styles.navLink}>
                <Grid3x3 size={16} />
                Colecciones
              </Link>
            </nav>
            <div className={styles.userInfo}>
              {user!.photoURL && (
                <img
                  src={user!.photoURL}
                  alt=""
                  className={styles.userAvatar}
                />
              )}
              <span className={styles.userName}>{user!.displayName}</span>
            </div>
            <button className={styles.btnLogoutSmall} onClick={logout}>
              <LogOut size={16} />
              Salir
            </button>
          </div>
        </header>

        <div className={styles.content}>
          <Suspense fallback={<ProductsTableSkeleton />}>
            <ProductsList />
          </Suspense>
        </div>

        {/* Toast global */}
        {ToastContainer}
      </div>
    </ErrorBoundary>
  );
};
