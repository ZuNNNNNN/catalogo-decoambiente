/**
 * Admin Categories - Gestión de categorías
 */
import { useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  LogOut,
  Plus,
  Pencil,
  Trash2,
  Tag,
  Package,
  Grid3x3,
  ArrowLeft,
  Loader2,
  X,
  Database,
} from "lucide-react";
import styles from "./AdminDashboardPage.module.css";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { useToast } from "@/hooks/useToast";
import { useCategories } from "@/hooks/useCategories";
import { seedDatabase } from "@/services/seed.service";
import type { CategoryDocument, CategoryFormData } from "@/types";
import { useAuth } from "@/hooks/useAuth";

// --------------------------------------------------------
// Category Modal
// --------------------------------------------------------
interface CategoryModalProps {
  category: CategoryDocument | null;
  onClose: () => void;
  onSave: (data: CategoryFormData) => Promise<void>;
}

const CategoryModal = ({ category, onClose, onSave }: CategoryModalProps) => {
  const [formData, setFormData] = useState<CategoryFormData>({
    slug: category?.slug || "",
    name: category?.name || "",
    description: category?.description || "",
    emoji: category?.emoji || "",
    order: category?.order || 0,
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Error saving category:", error);
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
            <Tag size={20} />
            {category ? "Editar Categoría" : "Nueva Categoría"}
          </h2>
          <button className={styles.modalClose} onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Emoji <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                className={styles.input}
                value={formData.emoji}
                onChange={(e) =>
                  setFormData({ ...formData, emoji: e.target.value })
                }
                placeholder="🛋️"
                required
                maxLength={4}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                Nombre <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                className={styles.input}
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Ej: Living"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                Slug <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                className={styles.input}
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                placeholder="living"
                required
                pattern="[a-z0-9-]+"
              />
              <small style={{ color: "#888", fontSize: "0.8rem" }}>
                Solo minúsculas, números y guiones
              </small>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Orden</label>
              <input
                type="number"
                className={styles.input}
                value={formData.order}
                onChange={(e) =>
                  setFormData({ ...formData, order: Number(e.target.value) })
                }
                placeholder="0"
                min={0}
              />
            </div>

            <div className={styles.formGroup} style={{ gridColumn: "1 / -1" }}>
              <label className={styles.label}>Descripción</label>
              <textarea
                className={styles.textarea}
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Descripción breve de la categoría"
                rows={3}
              />
            </div>
          </div>

          <div className={styles.modalActions}>
            <button
              type="button"
              className={styles.btnSecondary}
              onClick={onClose}
              disabled={saving}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={styles.btnPrimary}
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 size={16} className={styles.spinning} />
                  Guardando...
                </>
              ) : (
                "Guardar"
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// --------------------------------------------------------
// Delete Confirmation Modal
// --------------------------------------------------------
interface DeleteModalProps {
  category: CategoryDocument;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

const DeleteModal = ({ category, onClose, onConfirm }: DeleteModalProps) => {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error("Error deleting category:", error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <motion.div
        className={`${styles.modal} ${styles.modalSmall}`}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            <Trash2 size={20} />
            Eliminar Categoría
          </h2>
          <button className={styles.modalClose} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.deleteContent}>
          <p>
            ¿Estás seguro de eliminar la categoría{" "}
            <strong>
              {category.emoji} {category.name}
            </strong>
            ?
          </p>
          <p style={{ color: "#888", marginTop: "0.5rem" }}>
            Esta acción no se puede deshacer.
          </p>
        </div>

        <div className={styles.modalActions}>
          <button
            type="button"
            className={styles.btnSecondary}
            onClick={onClose}
            disabled={deleting}
          >
            Cancelar
          </button>
          <button
            type="button"
            className={styles.btnDanger}
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? (
              <>
                <Loader2 size={16} className={styles.spinning} />
                Eliminando...
              </>
            ) : (
              <>
                <Trash2 size={16} />
                Eliminar
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// --------------------------------------------------------
// Categories List
// --------------------------------------------------------
function CategoriesList() {
  const { categories, addCategory, updateCategory, deleteCategory, refetch } =
    useCategories();
  const { showToast } = useToast();
  const [categoryModal, setCategoryModal] = useState<{
    open: boolean;
    category: CategoryDocument | null;
  }>({ open: false, category: null });
  const [deleteModal, setDeleteModal] = useState<CategoryDocument | null>(null);
  const [seeding, setSeeding] = useState(false);

  const handleSeedDatabase = async () => {
    if (
      !confirm("¿Poblar base de datos con categorías y colecciones iniciales?")
    ) {
      return;
    }
    setSeeding(true);
    try {
      await seedDatabase();
      showToast("✅ Base de datos poblada correctamente", "success");
      await refetch();
    } catch (error) {
      showToast("❌ Error al poblar base de datos", "error");
      console.error("Error seeding database:", error);
    } finally {
      setSeeding(false);
    }
  };

  const handleSaveCategory = async (data: CategoryFormData) => {
    try {
      if (categoryModal.category) {
        await updateCategory(categoryModal.category.id, data);
        showToast("✅ Categoría actualizada");
      } else {
        await addCategory(data);
        showToast("✅ Categoría creada");
      }
    } catch (error) {
      showToast("❌ Error al guardar categoría", "error");
      console.error("Error saving category:", error);
      throw error;
    }
  };

  const handleDeleteCategory = async () => {
    if (!deleteModal) return;
    try {
      await deleteCategory(deleteModal.id);
      showToast("✅ Categoría eliminada");
    } catch (error) {
      showToast("❌ Error al eliminar categoría", "error");
      console.error("Error deleting category:", error);
      throw error;
    }
  };

  return (
    <>
      <div className={styles.tableHeader}>
        <div className={styles.tableHeaderLeft}>
          <h1 className={styles.pageTitle}>
            <Tag size={24} />
            Categorías
          </h1>
          <span className={styles.badge}>{categories.length}</span>
        </div>
        <button
          className={styles.btnPrimary}
          onClick={() => setCategoryModal({ open: true, category: null })}
        >
          <Plus size={16} />
          Nueva Categoría
        </button>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{ width: "60px" }}>Emoji</th>
              <th>Nombre</th>
              <th>Slug</th>
              <th style={{ width: "100px" }}>Orden</th>
              <th style={{ width: "120px" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  style={{ textAlign: "center", padding: "2rem" }}
                >
                  <div className={styles.emptyState}>
                    <span className={styles.emptyStateText}>
                      No hay categorías. Creá la primera o poblá la base de
                      datos.
                    </span>
                    <button
                      className={styles.btnSecondary}
                      onClick={handleSeedDatabase}
                      disabled={seeding}
                    >
                      {seeding ? (
                        <>
                          <Loader2 size={16} className={styles.spinning} />
                          Poblando...
                        </>
                      ) : (
                        <>
                          <Database size={16} />
                          Poblar Base de Datos
                        </>
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <motion.tr
                  key={category.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <td className={styles.tdEmoji}>{category.emoji}</td>
                  <td className={styles.tdName}>
                    <strong>{category.name}</strong>
                    {category.description && (
                      <div className={styles.tdDescription}>
                        {category.description}
                      </div>
                    )}
                  </td>
                  <td>
                    <code className={styles.tdCode}>{category.slug}</code>
                  </td>
                  <td style={{ textAlign: "center" }}>{category.order}</td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button
                        className={styles.btnIconEdit}
                        onClick={() =>
                          setCategoryModal({ open: true, category })
                        }
                        title="Editar"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        className={styles.btnIconDelete}
                        onClick={() => setDeleteModal(category)}
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {categoryModal.open && (
          <CategoryModal
            category={categoryModal.category}
            onClose={() => setCategoryModal({ open: false, category: null })}
            onSave={handleSaveCategory}
          />
        )}
        {deleteModal && (
          <DeleteModal
            category={deleteModal}
            onClose={() => setDeleteModal(null)}
            onConfirm={handleDeleteCategory}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// --------------------------------------------------------
// Skeleton
// --------------------------------------------------------
function CategoriesSkeleton() {
  return (
    <div className={styles.tableContainer}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "4rem",
        }}
      >
        <Loader2 size={32} className={styles.spinning} />
        <span style={{ marginLeft: "1rem", color: "#888" }}>
          Cargando categorías...
        </span>
      </div>
    </div>
  );
}

// --------------------------------------------------------
// Admin Categories Page
// --------------------------------------------------------
export const AdminCategoriesPage = () => {
  const { user, logout } = useAuth();
  const { ToastContainer } = useToast();
  const navigate = useNavigate();

  return (
    <ErrorBoundary>
      <div className={styles.dashboard}>
        {/* Topbar */}
        <header className={styles.topbar}>
          <div className={styles.topbarLeft}>
            <button
              className={styles.btnBack}
              onClick={() => navigate("/admin/dashboard")}
              title="Volver al Dashboard"
            >
              <ArrowLeft size={18} />
            </button>
            <span className={styles.topbarLogo}>
              <em>Deco</em>&amp;<em>Hogar</em>
            </span>
            <span className={styles.topbarSeparator}>/</span>
            <span className={styles.topbarTitle}>Admin</span>
          </div>
          <div className={styles.topbarRight}>
            <nav className={styles.adminNav}>
              <Link to="/admin/dashboard" className={styles.navLink}>
                <Package size={16} />
                Productos
              </Link>
              <Link
                to="/admin/categories"
                className={`${styles.navLink} ${styles.navLinkActive}`}
              >
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
          <Suspense fallback={<CategoriesSkeleton />}>
            <CategoriesList />
          </Suspense>
        </div>

        {/* Toast global */}
        {ToastContainer}
      </div>
    </ErrorBoundary>
  );
};
