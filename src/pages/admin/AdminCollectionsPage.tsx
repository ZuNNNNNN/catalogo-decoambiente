/**
 * Admin Collections - Gestión de colecciones
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
  Star,
  Calendar,
} from "lucide-react";
import styles from "./AdminDashboardPage.module.css";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { useToast } from "@/hooks/useToast";
import { useCollections } from "@/hooks/useCollections";
import type { CollectionDocument, CollectionFormData } from "@/types";
import { useAuth } from "@/hooks/useAuth";

// --------------------------------------------------------
// Collection Modal
// --------------------------------------------------------
interface CollectionModalProps {
  collection: CollectionDocument | null;
  onClose: () => void;
  onSave: (data: CollectionFormData) => Promise<void>;
}

const CollectionModal = ({
  collection,
  onClose,
  onSave,
}: CollectionModalProps) => {
  const [formData, setFormData] = useState<CollectionFormData>({
    slug: collection?.slug || "",
    name: collection?.name || "",
    description: collection?.description || "",
    imageUrl: collection?.imageUrl || "",
    featured: collection?.featured || false,
    order: collection?.order || 0,
    startDate: collection?.startDate || "",
    endDate: collection?.endDate || "",
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Error saving collection:", error);
    } finally {
      setSaving(false);
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
            <Grid3x3 size={20} />
            {collection ? "Editar Colección" : "Nueva Colección"}
          </h2>
          <button className={styles.modalClose} onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.formGrid}>
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
                placeholder="Ej: Colección Primavera 2026"
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
                placeholder="primavera-2026"
                required
                pattern="[a-z0-9-]+"
              />
              <small style={{ color: "#888", fontSize: "0.8rem" }}>
                Solo minúsculas, números y guiones
              </small>
            </div>

            <div className={styles.formGroup} style={{ gridColumn: "1 / -1" }}>
              <label className={styles.label}>Descripción</label>
              <textarea
                className={styles.textarea}
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Descripción breve de la colección"
                rows={3}
              />
            </div>

            <div className={styles.formGroup} style={{ gridColumn: "1 / -1" }}>
              <label className={styles.label}>URL de Imagen</label>
              <input
                type="url"
                className={styles.input}
                value={formData.imageUrl || ""}
                onChange={(e) =>
                  setFormData({ ...formData, imageUrl: e.target.value })
                }
                placeholder="https://ejemplo.com/imagen.jpg"
              />
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

            <div className={styles.formGroup}>
              <label
                className={styles.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={formData.featured || false}
                  onChange={(e) =>
                    setFormData({ ...formData, featured: e.target.checked })
                  }
                  style={{ width: "auto", cursor: "pointer" }}
                />
                <Star size={16} />
                Destacada
              </label>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                <Calendar size={16} style={{ marginRight: "0.25rem" }} />
                Fecha Inicio
              </label>
              <input
                type="date"
                className={styles.input}
                value={formData.startDate || ""}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
              />
              <small style={{ color: "#888", fontSize: "0.8rem" }}>
                Opcional - Para colecciones temporales
              </small>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                <Calendar size={16} style={{ marginRight: "0.25rem" }} />
                Fecha Fin
              </label>
              <input
                type="date"
                className={styles.input}
                value={formData.endDate || ""}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
              />
              <small style={{ color: "#888", fontSize: "0.8rem" }}>
                Opcional - Para colecciones temporales
              </small>
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
  collection: CollectionDocument;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

const DeleteModal = ({ collection, onClose, onConfirm }: DeleteModalProps) => {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error("Error deleting collection:", error);
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
            Eliminar Colección
          </h2>
          <button className={styles.modalClose} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.deleteContent}>
          <p>
            ¿Estás seguro de eliminar la colección{" "}
            <strong>{collection.name}</strong>?
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
// Collections List
// --------------------------------------------------------
function CollectionsList() {
  const {
    collections,
    addCollection,
    updateCollection,
    deleteCollection,
    getFeaturedCollections,
  } = useCollections();
  const { showToast } = useToast();
  const [collectionModal, setCollectionModal] = useState<{
    open: boolean;
    collection: CollectionDocument | null;
  }>({ open: false, collection: null });
  const [deleteModal, setDeleteModal] = useState<CollectionDocument | null>(
    null,
  );

  const handleSaveCollection = async (data: CollectionFormData) => {
    try {
      if (collectionModal.collection) {
        await updateCollection(collectionModal.collection.id, data);
        showToast("✅ Colección actualizada");
      } else {
        await addCollection(data);
        showToast("✅ Colección creada");
      }
    } catch (error) {
      showToast("❌ Error al guardar colección", "error");
      console.error("Error saving collection:", error);
      throw error;
    }
  };

  const handleDeleteCollection = async () => {
    if (!deleteModal) return;
    try {
      await deleteCollection(deleteModal.id);
      showToast("✅ Colección eliminada");
    } catch (error) {
      showToast("❌ Error al eliminar colección", "error");
      console.error("Error deleting collection:", error);
      throw error;
    }
  };

  const featuredCount = getFeaturedCollections().length;

  return (
    <>
      <div className={styles.tableHeader}>
        <div className={styles.tableHeaderLeft}>
          <h1 className={styles.pageTitle}>
            <Grid3x3 size={24} />
            Colecciones
          </h1>
          <span className={styles.badge}>{collections.length}</span>
          {featuredCount > 0 && (
            <span
              className={styles.badge}
              style={{
                background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
              }}
            >
              <Star size={12} />
              {featuredCount} destacadas
            </span>
          )}
        </div>
        <button
          className={styles.btnPrimary}
          onClick={() => setCollectionModal({ open: true, collection: null })}
        >
          <Plus size={16} />
          Nueva Colección
        </button>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Slug</th>
              <th style={{ width: "100px", textAlign: "center" }}>Orden</th>
              <th style={{ width: "100px", textAlign: "center" }}>Estado</th>
              <th style={{ width: "120px" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {collections.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  style={{ textAlign: "center", padding: "2rem" }}
                >
                  <div className={styles.emptyState}>
                    <span className={styles.emptyStateText}>
                      No hay colecciones. Creá la primera.
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              collections.map((collection) => (
                <motion.tr
                  key={collection.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <td className={styles.tdName}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      {collection.featured && (
                        <Star size={16} color="#f59e0b" fill="#f59e0b" />
                      )}
                      <div>
                        <strong>{collection.name}</strong>
                        {collection.description && (
                          <div className={styles.tdDescription}>
                            {collection.description}
                          </div>
                        )}
                        {(collection.startDate || collection.endDate) && (
                          <div
                            className={styles.tdDescription}
                            style={{ marginTop: "0.35rem" }}
                          >
                            <Calendar
                              size={12}
                              style={{
                                marginRight: "0.25rem",
                                verticalAlign: "middle",
                              }}
                            />
                            {collection.startDate && (
                              <span>{collection.startDate}</span>
                            )}
                            {collection.startDate && collection.endDate && (
                              <span> → </span>
                            )}
                            {collection.endDate && (
                              <span>{collection.endDate}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    <code className={styles.tdCode}>{collection.slug}</code>
                  </td>
                  <td style={{ textAlign: "center" }}>{collection.order}</td>
                  <td style={{ textAlign: "center" }}>
                    {collection.featured ? (
                      <span
                        className={`${styles.statusBadge} ${styles.statusBadgeFeatured}`}
                      >
                        Destacada
                      </span>
                    ) : (
                      <span
                        className={`${styles.statusBadge} ${styles.statusBadgeNormal}`}
                      >
                        Normal
                      </span>
                    )}
                  </td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button
                        className={styles.btnIconEdit}
                        onClick={() =>
                          setCollectionModal({ open: true, collection })
                        }
                        title="Editar"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        className={styles.btnIconDelete}
                        onClick={() => setDeleteModal(collection)}
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
        {collectionModal.open && (
          <CollectionModal
            collection={collectionModal.collection}
            onClose={() =>
              setCollectionModal({ open: false, collection: null })
            }
            onSave={handleSaveCollection}
          />
        )}
        {deleteModal && (
          <DeleteModal
            collection={deleteModal}
            onClose={() => setDeleteModal(null)}
            onConfirm={handleDeleteCollection}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// --------------------------------------------------------
// Skeleton
// --------------------------------------------------------
function CollectionsSkeleton() {
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
          Cargando colecciones...
        </span>
      </div>
    </div>
  );
}

// --------------------------------------------------------
// Admin Collections Page
// --------------------------------------------------------
export const AdminCollectionsPage = () => {
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
              <Link to="/admin/categories" className={styles.navLink}>
                <Tag size={16} />
                Categorías
              </Link>
              <Link
                to="/admin/collections"
                className={`${styles.navLink} ${styles.navLinkActive}`}
              >
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
          <Suspense fallback={<CollectionsSkeleton />}>
            <CollectionsList />
          </Suspense>
        </div>

        {/* Toast global */}
        {ToastContainer}
      </div>
    </ErrorBoundary>
  );
};
