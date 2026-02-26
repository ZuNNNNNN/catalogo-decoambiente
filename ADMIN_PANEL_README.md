# Panel de Administración — Deco Ambiente & Hogar

## Arquitectura (Separation of Concerns)

### 📁 Estructura de carpetas

```
src/
├── services/
│   └── products.service.ts    # API de Firestore (CRUD completo)
├── hooks/
│   ├── useProducts.ts          # Hook de estado para productos
│   ├── useExcelImport.ts       # Hook para parsear Excel
│   └── useAuth.ts              # Hook de autenticación
├── contexts/
│   └── AuthContext.tsx         # Contexto de Firebase Auth
└── pages/admin/
    ├── AdminLoginPage.tsx      # Login con Google
    └── AdminDashboardPage.tsx  # Dashboard CRUD completo
```

### 🔧 Servicios (services/)

**`products.service.ts`** — Capa de persistencia pura

- `getAllProducts()` — Obtiene todos los productos de Firestore
- `createProduct()` — Crea un nuevo producto
- `updateProduct()` — Actualiza un producto existente
- `deleteProduct()` — Elimina un producto
- `bulkCreateProducts()` — Importación masiva desde Excel

**Ventajas:**
✅ Lógica de Firestore centralizada  
✅ Fácil de testear (mock del servicio)  
✅ Reutilizable en cualquier componente  
✅ Separación clara: UI ↔ Datos

### 🎣 Hooks (hooks/)

**`useProducts.ts`** — Estado y operaciones de productos

- Usa internamente `products.service.ts`
- Maneja fallback a datos locales si Firebase falla
- Provee: `{ products, loading, addProduct, updateProduct, deleteProduct, bulkCreateProducts }`

**`useExcelImport.ts`** — Parseo de archivos Excel

- Acepta .xlsx, .xls, .csv
- Retorna preview de productos a importar
- Mapea columnas en español/inglés automáticamente

**`useAuth.ts`** — Wrapper del contexto de autenticación

### 📝 Importación desde Excel

#### Formato del archivo:

| nombre       | categoria | precio  | descripcion          | emoji | tags      | destacado | stock | sku     |
| ------------ | --------- | ------- | -------------------- | ----- | --------- | --------- | ----- | ------- |
| Sofá Riviera | living    | 1890000 | Sofá de 3 cuerpos... | 🛋️    | sofá,lino | si        | 3     | SOF-001 |

**Archivo de ejemplo:** `public/ejemplo-productos.csv`

#### Columnas soportadas:

- **nombre** / name → Requerido
- **categoria** / category → living, dormitorio, cocina, jardin, iluminacion, textiles, arte, accesorios
- **precio** / price → Número (CLP)
- **descripcion** / description → Texto libre
- **emoji** → Un emoji 🏺 (default si no se especifica)
- **tags** → Separados por coma: `moderno, minimalista, lino`
- **destacado** / featured → "si"/"yes" o "no"
- **stock** → Número entero
- **sku** → Código único del producto

### 🔒 Autenticación

**Variables de entorno** (`.env`):

```env
VITE_ADMIN_EMAILS=admin@decoambiente.cl,otro@dominio.com
```

Si `VITE_ADMIN_EMAILS` está vacío, **cualquier usuario de Google** puede acceder.

### 🔥 Configuración de Firebase

**Archivo:** `src/lib/firebase.ts`  
**Colección:** `products`

Si Firestore no está disponible, el panel usa datos locales de `src/data/productsData.ts`

### 🚀 Flujo de uso

1. Usuario accede a `/admin`
2. Click en "Iniciar sesión con Google"
3. Firebase Auth valida credenciales
4. Si `email` está en `VITE_ADMIN_EMAILS` → acceso permitido
5. Redirige a `/admin/dashboard`
6. Dashboard carga productos desde Firestore (o fallback local)
7. Usuario puede:
   - ✅ Ver todos los productos
   - ✅ Crear nuevo producto (modal form)
   - ✅ Editar producto existente
   - ✅ Eliminar producto (con confirmación)
   - ✅ Importar desde Excel (archivo → preview → confirmar)
   - ✅ Buscar/filtrar productos

### 📦 Scripts npm

```bash
npm run dev        # Servidor de desarrollo
npm run build      # Build de producción
npm run preview    # Preview del build
```

### 🐛 Debugging

**Loop infinito resuelto:**

- `useEffect` en `AuthContext` tiene dependencies vacías `[]`
- `useEffect` en `useProducts` tiene `// eslint-disable-next-line react-hooks/exhaustive-deps`
- `Navigate` en `AdminLoginPage` usa `replace` para evitar historial duplicado

**Verificar errores de TypeScript:**

```bash
npx tsc --noEmit
```

---

## Próximos pasos

- [ ] Agregar paginación en tabla de productos (>50 items)
- [ ] Filtro por categoría en el dashboard
- [ ] Exportar productos a Excel
- [ ] Subir imágenes a Firebase Storage
- [ ] Logs de actividad (audit trail)
