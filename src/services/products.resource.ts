/**
 * Resource para productos con Suspense
 * Patrón 6: Suspense + use() para carga de datos
 */
import type { Product, ProductFormData, BulkImportResult } from "@/types";
import * as productsService from "@/services/products.service";

// Cache global de productos
let productsCache: Promise<Product[]> | null = null;
let cachedData: Product[] | null = null;

/**
 * Obtiene el recurso de productos (Promise)
 * Se utiliza con React.use() para Suspense
 */
export function getProductsResource(): Promise<Product[]> {
  if (!productsCache) {
    console.log("🔄 Creando nuevo resource de productos...");
    productsCache = fetchProducts();
  }
  return productsCache;
}

/**
 * Invalida el cache de productos
 * Debe llamarse después de mutaciones (crear/editar/eliminar)
 */
export function invalidateProducts() {
  console.log("♻️ Invalidando cache de productos...");
  productsCache = null;
  cachedData = null;
}

/**
 * Obtiene los datos cacheados de productos (sync)
 * Útil para operaciones optimistas
 */
export function getCachedProducts(): Product[] | null {
  return cachedData;
}

/**
 * Actualiza el cache con nuevos datos (optimista)
 */
export function updateCachedProducts(
  updater: (products: Product[]) => Product[],
) {
  if (cachedData) {
    cachedData = updater(cachedData);
    console.log("⚡ Cache actualizado optimísticamente");
  }
}

/**
 * Fetch de productos desde Firestore
 */
async function fetchProducts(): Promise<Product[]> {
  try {
    const data = await productsService.getAllProducts();
    console.log(`✅ ${data.length} productos cargados desde Firestore`);
    cachedData = data;
    return data;
  } catch (err) {
    console.error("❌ Error al cargar productos desde Firestore:", err);
    throw err;
  }
}

/**
 * Mutaciones con invalidación automática
 */
export const productsMutations = {
  async add(product: ProductFormData): Promise<string> {
    const id = await productsService.createProduct(product);
    invalidateProducts();
    return id;
  },

  async update(id: string, data: Partial<ProductFormData>): Promise<void> {
    await productsService.updateProduct(id, data);
    invalidateProducts();
  },

  async delete(id: string): Promise<void> {
    await productsService.deleteProduct(id);
    invalidateProducts();
  },

  async bulkCreate(products: ProductFormData[]): Promise<BulkImportResult> {
    const result = await productsService.bulkCreateProducts(products);
    invalidateProducts();
    return result;
  },
};
