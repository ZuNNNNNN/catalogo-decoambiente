import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut,
  Plus,
  Upload,
  Pencil,
  Trash2,
  Package,
  Search,
  AlertCircle,
  CheckCircle2,
  Loader2,
  FileSpreadsheet,
  X,
  ChevronDown,
} from "lucide-react";
import styles from "./AdminDashboardPage.module.css";
import { useProducts } from "@/hooks/useProducts";
import { useExcelImport } from "@/hooks/useExcelImport";
import { formatPrice } from "@/lib/utils";
import { staggerContainer, scaleIn } from "@/lib/animations";
import type { Product } from "@/types";
import { useAuth } from "@/hooks/useAuth";

// Modal de producto (crear/editar)
interface ProductModalProps {
  product?: Product | null;
  onClose: () => void;
  onSave: (data: Omit<Product, "id">) => Promise<void>;
}

const EMPTY_PRODUCT: Omit<Product, "id"> = {
  name: "",
  category: "",
  price: 0,
  description: "",
  emoji: "🏺",
  featured: false,
  tags: [],
  stock: 0,
  sku: "",
};

const ProductModal = ({ product, onClose, onSave }: ProductModalProps) => {
  const [form, setForm] = useState<Omit<Product, "id">>(
    product ? { ...product } : EMPTY_PRODUCT,
  );
  const [saving, setSaving] = useState(false);
  const [tagsInput, setTagsInput] = useState(
    product ? product.tags.join(", ") : "",
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({
        ...form,
        tags: tagsInput
          .split(",")
          .map((t) => t.trim().toLowerCase())
          .filter(Boolean),
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <motion.div
        className={styles.modal}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {product ? "Editar Producto" : "Nuevo Producto"}
          </h2>
          <button className={styles.modalClose} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Emoji</label>
              <input
                className={`${styles.input} ${styles.inputEmoji}`}
                value={form.emoji}
                onChange={(e) =>
                  setForm((f) => ({ ...f, emoji: e.target.value }))
                }
                placeholder="🏺"
                maxLength={4}
              />
            </div>
            <div className={`${styles.formGroup} ${styles.flex1}`}>
              <label className={styles.label}>Nombre *</label>
              <input
                className={styles.input}
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="Sofá Colonial"
                required
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Categoría *</label>
              <div className={styles.selectWrapper}>
                <select
                  className={styles.select}
                  value={form.category}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, category: e.target.value }))
                  }
                  required
                >
                  <option value="">Seleccionar...</option>
                  <option value="living">Living</option>
                  <option value="dormitorio">Dormitorio</option>
                  <option value="cocina">Cocina</option>
                  <option value="jardin">Jardín</option>
                  <option value="iluminacion">Iluminación</option>
                  <option value="textiles">Textiles</option>
                  <option value="arte">Arte & Cuadros</option>
                  <option value="accesorios">Accesorios</option>
                </select>
                <ChevronDown size={14} className={styles.selectArrow} />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Precio *</label>
              <input
                className={styles.input}
                type="number"
                min="0"
                value={form.price}
                onChange={(e) =>
                  setForm((f) => ({ ...f, price: Number(e.target.value) }))
                }
                placeholder="0"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Stock</label>
              <input
                className={styles.input}
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) =>
                  setForm((f) => ({ ...f, stock: Number(e.target.value) }))
                }
                placeholder="0"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Descripción</label>
            <textarea
              className={styles.textarea}
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              placeholder="Descripción del producto..."
              rows={3}
            />
          </div>

          <div className={styles.formRow}>
            <div className={`${styles.formGroup} ${styles.flex1}`}>
              <label className={styles.label}>Tags (separados por coma)</label>
              <input
                className={styles.input}
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="madera, artesanal, natural"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>SKU</label>
              <input
                className={styles.input}
                value={form.sku}
                onChange={(e) =>
                  setForm((f) => ({ ...f, sku: e.target.value }))
                }
                placeholder="SKU-001"
              />
            </div>
          </div>

          <div className={styles.formCheck}>
            <input
              type="checkbox"
              id="featured"
              checked={form.featured}
              onChange={(e) =>
                setForm((f) => ({ ...f, featured: e.target.checked }))
              }
              className={styles.checkbox}
            />
            <label htmlFor="featured" className={styles.checkLabel}>
              Producto destacado (aparece en la landing page)
            </label>
          </div>

          <div className={styles.modalActions}>
            <button
              type="button"
              onClick={onClose}
              className={styles.btnCancel}
            >
              Cancelar
            </button>
            <button type="submit" className={styles.btnSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 size={16} className={styles.spinIcon} />
                  Guardando...
                </>
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  {product ? "Guardar cambios" : "Crear producto"}
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// Modal de importación Excel
interface ExcelModalProps {
  onClose: () => void;
  onImport: (products: Omit<Product, "id">[]) => Promise<void>;
}

const ExcelModal = ({ onClose, onImport }: ExcelModalProps) => {
  const { parseExcel, loading, error, preview } = useExcelImport();
  const [importing, setImporting] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await parseExcel(file).catch(() => {});
  };

  const handleImport = async () => {
    if (!preview || preview.length === 0) return;
    setImporting(true);
    try {
      await onImport(preview);
      onClose();
    } catch (err) {
      console.error("Error importing:", err);
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
            <FileSpreadsheet size={22} />
            Importar desde Excel
          </h2>
          <button className={styles.modalClose} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.excelBody}>
          {/* Instructions */}
          <div className={styles.excelInstructions}>
            <h4>Formato esperado del Excel:</h4>
            <div className={styles.tableSample}>
              <table>
                <thead>
                  <tr>
                    <th>nombre</th>
                    <th>categoria</th>
                    <th>precio</th>
                    <th>descripcion</th>
                    <th>emoji</th>
                    <th>tags</th>
                    <th>destacado</th>
                    <th>stock</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Sofá Riviera</td>
                    <td>living</td>
                    <td>1890000</td>
                    <td>Sofá de diseño...</td>
                    <td>🛋️</td>
                    <td>moderno, lino</td>
                    <td>si</td>
                    <td>3</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* File Input */}
          <div className={styles.fileInputBox}>
            <label htmlFor="excel-file" className={styles.fileInputLabel}>
              <FileSpreadsheet size={28} />
              <span>Seleccionar archivo Excel</span>
              <p className={styles.fileInputNote}>
                Formatos: .xlsx, .xls, .csv
              </p>
            </label>
            <input
              id="excel-file"
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileSelect}
              className={styles.fileInput}
            />
          </div>

          {loading && (
            <div className={styles.loadingBox}>
              <Loader2 size={24} className={styles.spinIcon} />
              <p>Procesando archivo...</p>
            </div>
          )}

          {error && (
            <div className={styles.errorBox}>
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {/* Preview */}
          {preview && preview.length > 0 && (
            <div className={styles.preview}>
              <h4 className={styles.previewTitle}>
                Vista previa — {preview.length} productos a importar
              </h4>
              <div className={styles.previewTable}>
                <table>
                  <thead>
                    <tr>
                      <th>Emoji</th>
                      <th>Nombre</th>
                      <th>Categoría</th>
                      <th>Precio</th>
                      <th>Tags</th>
                      <th>Destacado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.slice(0, 10).map((p, i) => (
                      <tr key={i}>
                        <td>{p.emoji}</td>
                        <td>{p.name}</td>
                        <td>{p.category}</td>
                        <td>{formatPrice(p.price)}</td>
                        <td>{p.tags.slice(0, 3).join(", ")}</td>
                        <td>{p.featured ? "✓" : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {preview.length > 10 && (
                  <p className={styles.previewMore}>
                    ... y {preview.length - 10} más
                  </p>
                )}
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
// Admin Dashboard Principal
// --------------------------------------------------------
export const AdminDashboardPage = () => {
  const { user, logout } = useAuth();
  const {
    products,
    loading,
    usingLocalData,
    addProduct,
    updateProduct,
    deleteProduct,
    bulkCreateProducts,
  } = useProducts();

  const [search, setSearch] = useState("");
  const [productModal, setProductModal] = useState<{
    open: boolean;
    product: Product | null;
  }>({ open: false, product: null });
  const [excelModal, setExcelModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  // ProtectedRoute ya validó user y isAdmin - no hay checks redundantes

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSaveProduct = async (data: Omit<Product, "id">) => {
    try {
      if (productModal.product) {
        await updateProduct(productModal.product.id, data);
        showToast("Producto actualizado correctamente");
      } else {
        await addProduct(data);
        showToast("Producto creado correctamente");
      }
    } catch {
      showToast("Error al guardar el producto", "error");
      throw new Error("Save failed");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
      setDeleteConfirm(null);
      showToast("Producto eliminado");
    } catch {
      showToast("Error al eliminar", "error");
    }
  };

  const handleExcelImport = async (productsToImport: Omit<Product, "id">[]) => {
    try {
      await bulkCreateProducts(productsToImport);
      showToast(
        `${productsToImport.length} productos importados correctamente`,
      );
    } catch {
      showToast("Error al importar productos", "error");
      throw new Error("Import failed");
    }
  };

  const stats = {
    total: products.length,
    featured: products.filter((p) => p.featured).length,
    categories: new Set(products.map((p) => p.category)).size,
  };

  return (
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
          <div className={styles.userInfo}>
            {user!.photoURL && (
              <img src={user!.photoURL} alt="" className={styles.userAvatar} />
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

        {usingLocalData && (
          <div className={styles.warningBanner}>
            <AlertCircle size={16} />
            Usando datos locales. Configurá Firebase en el archivo .env para
            persistir cambios.
          </div>
        )}

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
              </div>
              <button
                className={styles.btnExcel}
                onClick={() => setExcelModal(true)}
              >
                <FileSpreadsheet size={16} />
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

          {loading ? (
            <div className={styles.tableLoading}>
              <Loader2 size={32} className={styles.spinIcon} />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className={styles.tableEmpty}>
              <Package size={48} />
              <p>No hay productos</p>
            </div>
          ) : (
            <div className={styles.tableWrapper}>
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
                        <td className={styles.tdEmoji}>{p.emoji}</td>
                        <td className={styles.tdName}>
                          <span>{p.name}</span>
                          {p.sku && (
                            <span className={styles.tdSku}>{p.sku}</span>
                          )}
                        </td>
                        <td>
                          <span className={styles.categoryBadge}>
                            {p.category}
                          </span>
                        </td>
                        <td className={styles.tdPrice}>
                          {formatPrice(p.price)}
                        </td>
                        <td>{p.stock ?? "—"}</td>
                        <td>
                          {p.featured ? (
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
          )}
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

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className={`${styles.toast} ${toast.type === "error" ? styles.toastError : ""}`}
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 50, x: "-50%" }}
          >
            {toast.type === "error" ? (
              <AlertCircle size={16} />
            ) : (
              <CheckCircle2 size={16} />
            )}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
