/**
 * Product Modal con composición
 * Patrón 8: Composición sobre Props Drilling
 */
import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  type FormEvent,
} from "react";
import { motion } from "framer-motion";
import { X, CheckCircle2, Loader2, ChevronDown, Package } from "lucide-react";
import styles from "./ProductModal.module.css";
import type { Product, ProductFormData } from "@/types";

interface ProductModalContextType {
  form: ProductFormData;
  setForm: React.Dispatch<React.SetStateAction<ProductFormData>>;
  tagsInput: string;
  setTagsInput: (value: string) => void;
  saving: boolean;
}

const ProductModalContext = createContext<ProductModalContextType | null>(null);

const useProductModal = () => {
  const context = useContext(ProductModalContext);
  if (!context) {
    throw new Error("useProductModal must be used within ProductModal");
  }
  return context;
};

const EMPTY_PRODUCT: ProductFormData = {
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

interface ProductModalProps {
  product?: Product | null;
  onClose: () => void;
  onSave: (data: ProductFormData) => Promise<void>;
  children?: ReactNode;
}

// Componente principal
export function ProductModal({
  product,
  onClose,
  onSave,
  children,
}: ProductModalProps) {
  const [form, setForm] = useState<ProductFormData>(
    product ? { ...product } : EMPTY_PRODUCT,
  );
  const [saving, setSaving] = useState(false);
  const [tagsInput, setTagsInput] = useState(
    product ? (product.tags || []).join(", ") : "",
  );

  const handleSubmit = async (e: FormEvent) => {
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
    <ProductModalContext.Provider
      value={{ form, setForm, tagsInput, setTagsInput, saving }}
    >
      <div className={styles.modalOverlay} onClick={onClose}>
        <motion.div
          className={styles.modal}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <ProductModal.Header product={product} onClose={onClose} />
          <form onSubmit={handleSubmit} className={styles.modalForm}>
            {children || (
              <>
                <ProductModal.BasicInfo />
                <ProductModal.PricingStock />
                <ProductModal.Description />
                <ProductModal.TagsSku />
                <ProductModal.Featured />
              </>
            )}
            <ProductModal.Actions
              onClose={onClose}
              isEdit={!!product}
              saving={saving}
            />
          </form>
        </motion.div>
      </div>
    </ProductModalContext.Provider>
  );
}

// Subcomponentes especializados
ProductModal.Header = function ProductModalHeader({
  product,
  onClose,
}: {
  product?: Product | null;
  onClose: () => void;
}) {
  return (
    <div className={styles.modalHeader}>
      <h2 className={styles.modalTitle}>
        <Package size={20} />
        {product ? "Editar Producto" : "Nuevo Producto"}
      </h2>
      <button className={styles.modalClose} onClick={onClose} type="button">
        <X size={20} />
      </button>
    </div>
  );
};

ProductModal.BasicInfo = function ProductModalBasicInfo() {
  const { form, setForm } = useProductModal();

  return (
    <div className={styles.formRow}>
      <div className={styles.formGroup}>
        <label className={styles.label}>Emoji</label>
        <input
          className={`${styles.input} ${styles.inputEmoji}`}
          value={form.emoji}
          onChange={(e) => setForm((f) => ({ ...f, emoji: e.target.value }))}
          placeholder="🏺"
          maxLength={4}
        />
      </div>
      <div className={`${styles.formGroup} ${styles.flex1}`}>
        <label className={styles.label}>Nombre *</label>
        <input
          className={styles.input}
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          placeholder="Sofá Colonial"
          required
        />
      </div>
    </div>
  );
};

ProductModal.PricingStock = function ProductModalPricingStock() {
  const { form, setForm } = useProductModal();

  return (
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
  );
};

ProductModal.Description = function ProductModalDescription() {
  const { form, setForm } = useProductModal();

  return (
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
  );
};

ProductModal.TagsSku = function ProductModalTagsSku() {
  const { form, setForm, tagsInput, setTagsInput } = useProductModal();

  return (
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
          onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))}
          placeholder="SKU-001"
        />
      </div>
    </div>
  );
};

ProductModal.Featured = function ProductModalFeatured() {
  const { form, setForm } = useProductModal();

  return (
    <div className={styles.formCheck}>
      <input
        type="checkbox"
        id="featured"
        checked={form.featured}
        onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
        className={styles.checkbox}
      />
      <label htmlFor="featured" className={styles.checkLabel}>
        Producto destacado (aparece en la landing page)
      </label>
    </div>
  );
};

ProductModal.Actions = function ProductModalActions({
  onClose,
  isEdit,
  saving,
}: {
  onClose: () => void;
  isEdit: boolean;
  saving: boolean;
}) {
  return (
    <div className={styles.modalActions}>
      <button type="button" onClick={onClose} className={styles.btnCancel}>
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
            {isEdit ? "Guardar cambios" : "Crear producto"}
          </>
        )}
      </button>
    </div>
  );
};
