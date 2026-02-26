# 🚀 Mejores Prácticas de React 19 para el Admin Panel

Patrones modernos para mejorar el código del panel de administración.

---

## 1. 🎯 Actualización Optimista con `useOptimistic`

### ❌ Patrón Actual (Pesimista)
```typescript
const handleDelete = async (id: string) => {
  try {
    await deleteProduct(id); // Esperar respuesta
    setDeleteConfirm(null);
    showToast("Producto eliminado");
  } catch {
    showToast("Error al eliminar", "error");
  }
};
```

**Problema:** El usuario espera mientras se elimina en el servidor.

### ✅ Patrón React 19 (Optimista)
```typescript
import { useOptimistic } from "react";

const [optimisticProducts, addOptimisticProduct] = useOptimistic(
  products,
  (state, deletedId: string) => state.filter(p => p.id !== deletedId)
);

const handleDelete = async (id: string) => {
  // UI se actualiza inmediatamente
  addOptimisticProduct(id);
  
  try {
    await deleteProduct(id);
    showToast("Producto eliminado");
  } catch {
    showToast("Error - revertido", "error");
    // React revierte automáticamente si falla
  }
};
```

**Beneficio:** UI instantánea, revierte automáticamente si hay error.

---

## 2. 🔍 Búsqueda Diferida con `useDeferredValue`

### ❌ Patrón Actual (Bloquea el Render)
```typescript
const [search, setSearch] = useState("");

const filteredProducts = products.filter(p =>
  p.name.toLowerCase().includes(search.toLowerCase())
);
// El filtrado se ejecuta en cada tecla presionada
// Bloquea el UI si hay muchos productos
```

### ✅ Patrón React 19 (No Bloquea)
```typescript
import { useDeferredValue, useMemo } from "react";

const [search, setSearch] = useState("");
const deferredSearch = useDeferredValue(search);

const filteredProducts = useMemo(() => 
  products.filter(p =>
    p.name.toLowerCase().includes(deferredSearch.toLowerCase())
  ),
  [products, deferredSearch]
);

// En el input
<input 
  value={search} 
  onChange={(e) => setSearch(e.target.value)}
  // El input es responsive
/>

// En la tabla
<table>
  {filteredProducts.map(p => (
    <tr key={p.id} style={{ 
      opacity: search !== deferredSearch ? 0.6 : 1 
    }}>
      {/* Indicador visual mientras se filtra */}
    </tr>
  ))}
</table>
```

**Beneficio:** El input permanece responsive mientras se filtran grandes listas.

---

## 3. 📝 Formularios con `useActionState`

### ❌ Patrón Actual (Estado Manual)
```typescript
const [form, setForm] = useState(EMPTY_PRODUCT);
const [saving, setSaving] = useState(false);
const [error, setError] = useState(null);

const handleSubmit = async (e) => {
  e.preventDefault();
  setSaving(true);
  setError(null);
  try {
    await onSave(form);
    onClose();
  } catch (err) {
    setError(err.message);
  } finally {
    setSaving(false);
  }
};
```

### ✅ Patrón React 19 (Acciones)
```typescript
import { useActionState } from "react";

async function saveProductAction(prevState, formData) {
  try {
    const product = {
      name: formData.get('name'),
      price: Number(formData.get('price')),
      category: formData.get('category'),
    };
    await onSave(product);
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

const [state, submitAction, isPending] = useActionState(
  saveProductAction, 
  { success: false, error: null }
);

// En el JSX
<form action={submitAction}>
  <input name="name" required />
  <input name="price" type="number" required />
  
  <button type="submit" disabled={isPending}>
    {isPending ? "Guardando..." : "Guardar"}
  </button>
  
  {state.error && <div className="error">{state.error}</div>}
</form>
```

**Beneficio:** Menos código boilerplate, mejor accesibilidad, funciona sin JS.

---

## 4. ⚡ Loading States con `useTransition`

### ❌ Patrón Actual (Bloquea Todo)
```typescript
const handleExcelImport = async (products) => {
  setImporting(true); // Bloquea toda la UI
  try {
    await bulkCreateProducts(products);
    showToast("Importados");
  } finally {
    setImporting(false);
  }
};
```

### ✅ Patrón React 19 (No Bloquea)
```typescript
import { useTransition } from "react";

const [isPending, startTransition] = useTransition();

const handleExcelImport = (products) => {
  startTransition(async () => {
    // Esta actualización es de baja prioridad
    await bulkCreateProducts(products);
    showToast("Importados");
  });
  // El usuario puede seguir usando la UI
};

// UI indica progreso sin bloquear
<button onClick={() => handleExcelImport(products)} disabled={isPending}>
  {isPending ? (
    <>
      <Spinner /> Importando...
    </>
  ) : (
    "Importar"
  )}
</button>
```

**Beneficio:** UI responsive durante operaciones largas.

---

## 5. 🎨 Suspense para Carga de Datos

### ❌ Patrón Actual (useState + useEffect)
```typescript
const [products, setProducts] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetchProducts().then(data => {
    setProducts(data);
    setLoading(false);
  });
}, []);

if (loading) return <Spinner />;
return <ProductList products={products} />;
```

### ✅ Patrón React 19 (Suspense + use())
```typescript
import { use } from "react";

// Hook que retorna una promesa
function useProductsData() {
  const promise = useMemo(() => fetchProducts(), []);
  const products = use(promise);
  return products;
}

// Componente
function ProductList() {
  const products = useProductsData();
  // No necesitas manejar loading aquí
  return <table>...</table>;
}

// En el parent
<Suspense fallback={<ProductsTableSkeleton />}>
  <ProductList />
</Suspense>
```

**Beneficio:** Separación clara de loading UI y declarativo.

---

## 6. 🔄 Refetch Automático con `use()`

### ❌ Patrón Actual
```typescript
const { products, refetch } = useProducts();

const handleSave = async (data) => {
  await addProduct(data);
  await refetch(); // Manual
};
```

### ✅ Patrón React 19
```typescript
// products.service.ts
let productsCache: Promise<Product[]> | null = null;

export function getProductsResource() {
  if (!productsCache) {
    productsCache = fetchProducts();
  }
  return productsCache;
}

export function invalidateProducts() {
  productsCache = null; // Invalida el caché
}

// Component
import { use } from "react";

function ProductList() {
  const products = use(getProductsResource());
  return <table>...</table>;
}

const handleSave = async (data) => {
  await addProduct(data);
  invalidateProducts(); // Automatic refetch
  startTransition(() => {
    // React re-renders con Suspense
  });
};
```

**Beneficio:** Caché automático y invalidación explícita.

---

## 7. 🛡️ Error Boundaries para Errores de UI

### ❌ Patrón Actual
```typescript
try {
  await deleteProduct(id);
} catch (error) {
  showToast("Error", "error");
}
// El error se maneja localmente
```

### ✅ Patrón React 19
```typescript
// ErrorBoundary.tsx
class AdminErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-page">
          <h2>Algo salió mal</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false })}>
            Reintentar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// App.tsx
<ErrorBoundary>
  <Suspense fallback={<Loading />}>
    <AdminDashboardPage />
  </Suspense>
</ErrorBoundary>
```

**Beneficio:** Manejo centralizado de errores fatales.

---

## 8. 🎭 Composición sobre Props Drilling

### ❌ Patrón Actual
```typescript
<ProductModal 
  product={product}
  onClose={onClose}
  onSave={handleSave}
  categories={categories}
  isLoading={loading}
  showFeatured={true}
  // ... 10 props más
/>
```

### ✅ Patrón React 19 (Context + Composition)
```typescript
// ProductModalContext
const ProductModalContext = createContext(null);

function ProductModal({ children }) {
  const [form, setForm] = useState(EMPTY_PRODUCT);
  const [saving, setSaving] = useState(false);
  
  return (
    <ProductModalContext.Provider value={{ form, setForm, saving }}>
      {children}
    </ProductModalContext.Provider>
  );
}

// Componentes pequeños y especializados
function ProductModal.Name() {
  const { form, setForm } = useContext(ProductModalContext);
  return <input value={form.name} onChange={...} />;
}

function ProductModal.Price() {
  const { form, setForm } = useContext(ProductModalContext);
  return <input value={form.price} onChange={...} />;
}

// Uso
<ProductModal>
  <ProductModal.Name />
  <ProductModal.Price />
  <ProductModal.Category />
  <ProductModal.Actions />
</ProductModal>
```

**Beneficio:** Componentes desacoplados, fácil de mantener.

---

## 9. 🔄 Custom Hooks Reutilizables

### ❌ Patrón Actual (Lógica en componente)
```typescript
const AdminDashboard = () => {
  const [toast, setToast] = useState(null);
  
  const showToast = (msg, type) => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };
  
  // 50 líneas más...
};
```

### ✅ Patrón React 19 (Hook reutilizable)
```typescript
// useToast.ts
function useToast() {
  const [toast, setToast] = useState(null);
  
  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }, []);
  
  const ToastContainer = useMemo(() => (
    <AnimatePresence>
      {toast && <Toast {...toast} />}
    </AnimatePresence>
  ), [toast]);
  
  return { showToast, ToastContainer };
}

// Uso
const AdminDashboard = () => {
  const { showToast, ToastContainer } = useToast();
  
  return (
    <>
      {/* ... */}
      {ToastContainer}
    </>
  );
};
```

**Beneficio:** Lógica reutilizable en toda la app.

---

## 10. 🎯 Eliminación Inteligente de Re-renders

### ❌ Patrón Actual
```typescript
const ProductRow = ({ product, onEdit, onDelete }) => {
  // Se re-renderiza cuando cualquier producto cambia
  return (
    <tr>
      <td>{product.name}</td>
      <td>
        <button onClick={() => onEdit(product)}>Editar</button>
        <button onClick={() => onDelete(product.id)}>Eliminar</button>
      </td>
    </tr>
  );
};
```

### ✅ Patrón React 19 (memo + useCallback)
```typescript
import { memo } from "react";

const ProductRow = memo(({ product, onEdit, onDelete }) => {
  return (
    <tr>
      <td>{product.name}</td>
      <td>
        <button onClick={() => onEdit(product)}>Editar</button>
        <button onClick={() => onDelete(product.id)}>Eliminar</button>
      </td>
    </tr>
  );
}, (prevProps, nextProps) => {
  // Solo re-renderizar si este producto cambió
  return prevProps.product.id === nextProps.product.id &&
         prevProps.product.name === nextProps.product.name;
});

// En el parent
const Dashboard = () => {
  const handleEdit = useCallback((product) => {
    setProductModal({ open: true, product });
  }, []);
  
  const handleDelete = useCallback((id) => {
    deleteProduct(id);
  }, []);
  
  return products.map(p => (
    <ProductRow 
      key={p.id}
      product={p}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  ));
};
```

**Beneficio:** Solo los productos modificados se re-renderizan.

---

## 📊 Comparación de Patrones

| Patrón | Antiguo | React 19 | Beneficio |
|--------|---------|----------|-----------|
| **Actualizaciones** | Pesimista | `useOptimistic` | UI instantánea |
| **Búsqueda** | Bloquea | `useDeferredValue` | No bloquea |
| **Formularios** | Manual | `useActionState` | Menos código |
| **Loading** | Bloquea todo | `useTransition` | UI responsive |
| **Datos async** | useState/useEffect | Suspense + `use()` | Declarativo |
| **Errores** | try/catch local | Error Boundaries | Centralizado |

---

## 🎯 Prioridades de Implementación

### Alta prioridad (Máximo impacto)
1. ✅ **`useDeferredValue` para búsqueda** - Mejora percepción de rendimiento
2. ✅ **`useOptimistic` para CRUD** - UX instantánea
3. ✅ **Error Boundaries** - Evita crashes

### Media prioridad
4. ⚡ **`useTransition` para importación** - UI no bloqueante
5. 📝 **`useActionState` para formularios** - Menos código

### Baja prioridad (Refactoring)
6. 🔄 **Suspense + `use()`** - Requiere cambios estructurales
7. 🎭 **Composición** - Mejora mantenibilidad

---

## 🚀 Ejemplo Completo: Búsqueda Optimizada

```typescript
import { useState, useDeferredValue, useMemo } from "react";

export const AdminDashboardPage = () => {
  const { products } = useProducts();
  const [search, setSearch] = useState("");
  
  // React 19: Búsqueda diferida
  const deferredSearch = useDeferredValue(search);
  
  const filteredProducts = useMemo(() => {
    if (!deferredSearch) return products;
    
    const query = deferredSearch.toLowerCase();
    return products.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query)
    );
  }, [products, deferredSearch]);
  
  const isSearching = search !== deferredSearch;
  
  return (
    <div>
      {/* Input siempre responsive */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar productos..."
      />
      
      {/* Indicador visual */}
      {isSearching && <Spinner size="small" />}
      
      {/* Tabla con transición suave */}
      <table style={{ opacity: isSearching ? 0.6 : 1 }}>
        {filteredProducts.map(p => (
          <ProductRow key={p.id} product={p} />
        ))}
      </table>
    </div>
  );
};
```

---

## 📚 Recursos

- [React 19 Docs](https://react.dev/)
- [useOptimistic](https://react.dev/reference/react/useOptimistic)
- [useDeferredValue](https://react.dev/reference/react/useDeferredValue)
- [useActionState](https://react.dev/reference/react/useActionState)
- [Suspense](https://react.dev/reference/react/Suspense)

---

**Próximo paso:** Empezar con `useDeferredValue` para la búsqueda - es el cambio más simple con mayor impacto visual. 🎯
