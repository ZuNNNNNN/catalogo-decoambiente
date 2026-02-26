/**
 * Servicio de productos con Firestore
 * Separation of Concerns: toda la lógica de persistencia aquí
 */

import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  type DocumentData,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Product, ProductFormData, BulkImportResult } from "@/types";

const COLLECTION_NAME = "products";

/**
 * Convierte un documento de Firestore a Product
 * Soporta campos en español e inglés
 */
function docToProduct(id: string, data: DocumentData): Product {
  // Soportar campos en español e inglés
  const name = data.name || data.nombre || "";
  const price = Number(data.price || data.precio) || 0;
  const featured =
    Boolean(data.featured) ||
    data.destacado === "sí" ||
    data.destacado === "si" ||
    data.destacado === true;

  // Manejar tags como string o array
  let tags: string[] = [];
  if (Array.isArray(data.tags)) {
    tags = data.tags;
  } else if (typeof data.tags === "string") {
    tags = data.tags
      .split(",")
      .map((t: string) => t.trim())
      .filter(Boolean);
  }

  return {
    id,
    name,
    category: data.category || "",
    price,
    description: data.description || "",
    emoji: data.emoji || "🏺",
    featured,
    tags,
    stock: data.stock !== undefined ? Number(data.stock) : undefined,
    sku: data.sku || "",
  };
}

/**
 * Obtiene todos los productos
 */
export async function getAllProducts(): Promise<Product[]> {
  try {
    const snapshot = await getDocs(collection(db, COLLECTION_NAME));
    const products = snapshot.docs.map((doc) =>
      docToProduct(doc.id, doc.data()),
    );
    // Ordenar por nombre en el cliente
    return products.sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("No se pudieron cargar los productos");
  }
}

/**
 * Crea un nuevo producto
 */
export async function createProduct(
  productData: ProductFormData,
): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...productData,
      createdAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating product:", error);
    throw new Error("No se pudo crear el producto");
  }
}

/**
 * Actualiza un producto existente
 */
export async function updateProduct(
  id: string,
  productData: Partial<ProductFormData>,
): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...productData,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error updating product:", error);
    throw new Error("No se pudo actualizar el producto");
  }
}

/**
 * Elimina un producto
 */
export async function deleteProduct(id: string): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting product:", error);
    throw new Error("No se pudo eliminar el producto");
  }
}

/**
 * Crea múltiples productos en lote (para importación Excel)
 */
export async function bulkCreateProducts(
  products: ProductFormData[],
): Promise<BulkImportResult> {
  let created = 0;
  const errors: string[] = [];

  console.log(`📦 Iniciando importación de ${products.length} productos...`);

  for (const product of products) {
    try {
      await createProduct(product);
      created++;
      console.log(`✅ Producto creado: ${product.name}`);
    } catch (error) {
      const errorMsg = `${product.name || "Sin nombre"}: ${error instanceof Error ? error.message : "Error desconocido"}`;
      errors.push(errorMsg);
      console.error(`❌ Error creando ${product.name}:`, error);
    }
  }

  const result = { created, failed: errors.length, errors };
  console.log(`📊 Importación completada:`, result);

  return result;
}
