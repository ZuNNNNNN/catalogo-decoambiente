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
  query,
  orderBy,
  type DocumentData,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Product } from "@/types";

const COLLECTION_NAME = "products";

/**
 * Convierte un documento de Firestore a Product
 */
function docToProduct(id: string, data: DocumentData): Product {
  return {
    id,
    name: data.name || "",
    category: data.category || "",
    price: Number(data.price) || 0,
    description: data.description || "",
    emoji: data.emoji || "🏺",
    featured: Boolean(data.featured),
    tags: Array.isArray(data.tags) ? data.tags : [],
    stock: data.stock !== undefined ? Number(data.stock) : undefined,
    sku: data.sku || "",
  };
}

/**
 * Obtiene todos los productos
 */
export async function getAllProducts(): Promise<Product[]> {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy("name"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => docToProduct(doc.id, doc.data()));
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("No se pudieron cargar los productos");
  }
}

/**
 * Crea un nuevo producto
 */
export async function createProduct(
  productData: Omit<Product, "id">,
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
  productData: Partial<Omit<Product, "id">>,
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
  products: Omit<Product, "id">[],
): Promise<number> {
  let created = 0;
  const errors: string[] = [];

  for (const product of products) {
    try {
      await createProduct(product);
      created++;
    } catch (error) {
      errors.push(product.name || "Sin nombre");
    }
  }

  if (errors.length > 0) {
    console.warn(`Algunos productos no se importaron: ${errors.join(", ")}`);
  }

  return created;
}
