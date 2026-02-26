/**
 * Servicio de categorías con Firestore
 * CRUD operations para la entidad Category
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
import type { CategoryDocument, CategoryFormData } from "@/types";

const COLLECTION_NAME = "categories";

/**
 * Convierte un documento de Firestore a CategoryDocument
 */
//TODO: Remove emoji field
function docToCategory(id: string, data: DocumentData): CategoryDocument {
  return {
    id,
    slug: data.slug || "",
    name: data.name || data.nombre || "",
    description: data.description || data.descripcion || "",
    emoji: data.emoji || "📦",
    order: data.order !== undefined ? Number(data.order) : 0,
    featured: Boolean(data.featured || data.destacado),
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}

/**
 * Obtiene todas las categorías
 */
export async function getAllCategories(): Promise<CategoryDocument[]> {
  try {
    const snapshot = await getDocs(collection(db, COLLECTION_NAME));
    const categories = snapshot.docs.map((doc) =>
      docToCategory(doc.id, doc.data()),
    );
    // Ordenar por order (si existe) y luego por nombre
    return categories.sort((a, b) => {
      if (a.order !== undefined && b.order !== undefined) {
        return a.order - b.order;
      }
      return a.name.localeCompare(b.name);
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error("No se pudieron cargar las categorías");
  }
}

/**
 * Obtiene una categoría por slug
 */
export async function getCategoryBySlug(
  slug: string,
): Promise<CategoryDocument | null> {
  try {
    const categories = await getAllCategories();
    return categories.find((cat) => cat.slug === slug) || null;
  } catch (error) {
    console.error("Error fetching category by slug:", error);
    return null;
  }
}

/**
 * Crea una nueva categoría
 */
export async function createCategory(
  categoryData: CategoryFormData,
): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...categoryData,
      createdAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating category:", error);
    throw new Error("No se pudo crear la categoría");
  }
}

/**
 * Actualiza una categoría existente
 */
export async function updateCategory(
  id: string,
  categoryData: Partial<CategoryFormData>,
): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...categoryData,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error updating category:", error);
    throw new Error("No se pudo actualizar la categoría");
  }
}

/**
 * Elimina una categoría
 */
export async function deleteCategory(id: string): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting category:", error);
    throw new Error("No se pudo eliminar la categoría");
  }
}
