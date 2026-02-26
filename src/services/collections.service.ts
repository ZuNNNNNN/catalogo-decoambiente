/**
 * Servicio de colecciones con Firestore
 * CRUD operations para la entidad Collection
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
import type { CollectionDocument, CollectionFormData } from "@/types";

const COLLECTION_NAME = "collections";

/**
 * Convierte un documento de Firestore a CollectionDocument
 */
function docToCollection(id: string, data: DocumentData): CollectionDocument {
  // Soportar campos en español e inglés
  const name = data.name || data.nombre || "";
  const featured = Boolean(data.featured || data.destacado);

  // Manejar productIds como array
  let productIds: string[] = [];
  if (Array.isArray(data.productIds)) {
    productIds = data.productIds;
  } else if (typeof data.productIds === "string") {
    productIds = data.productIds
      .split(",")
      .map((id: string) => id.trim())
      .filter(Boolean);
  }

  return {
    id,
    slug: data.slug || "",
    name,
    description: data.description || data.descripcion || "",
    imageUrl: data.imageUrl || data.imagen || "",
    featured,
    productIds,
    order: data.order !== undefined ? Number(data.order) : 0,
    startDate: data.startDate || data.fechaInicio,
    endDate: data.endDate || data.fechaFin,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}

/**
 * Obtiene todas las colecciones
 */
export async function getAllCollections(): Promise<CollectionDocument[]> {
  try {
    const snapshot = await getDocs(collection(db, COLLECTION_NAME));
    const collections = snapshot.docs.map((doc) =>
      docToCollection(doc.id, doc.data()),
    );
    // Ordenar por order (si existe) y luego por nombre
    return collections.sort((a, b) => {
      if (a.order !== undefined && b.order !== undefined) {
        return a.order - b.order;
      }
      return a.name.localeCompare(b.name);
    });
  } catch (error) {
    console.error("Error fetching collections:", error);
    throw new Error("No se pudieron cargar las colecciones");
  }
}

/**
 * Obtiene una colección por slug
 */
export async function getCollectionBySlug(
  slug: string,
): Promise<CollectionDocument | null> {
  try {
    const collections = await getAllCollections();
    return collections.find((col) => col.slug === slug) || null;
  } catch (error) {
    console.error("Error fetching collection by slug:", error);
    return null;
  }
}

/**
 * Obtiene colecciones destacadas
 */
export async function getFeaturedCollections(): Promise<CollectionDocument[]> {
  try {
    const collections = await getAllCollections();
    return collections.filter((col) => col.featured === true);
  } catch (error) {
    console.error("Error fetching featured collections:", error);
    return [];
  }
}

/**
 * Crea una nueva colección
 */
export async function createCollection(
  collectionData: CollectionFormData,
): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...collectionData,
      createdAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating collection:", error);
    throw new Error("No se pudo crear la colección");
  }
}

/**
 * Actualiza una colección existente
 */
export async function updateCollection(
  id: string,
  collectionData: Partial<CollectionFormData>,
): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...collectionData,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error updating collection:", error);
    throw new Error("No se pudo actualizar la colección");
  }
}

/**
 * Elimina una colección
 */
export async function deleteCollection(id: string): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting collection:", error);
    throw new Error("No se pudo eliminar la colección");
  }
}

/**
 * Agrega productos a una colección
 */
export async function addProductsToCollection(
  collectionId: string,
  productIds: string[],
): Promise<void> {
  try {
    const collectionDoc = await getCollectionById(collectionId);
    if (!collectionDoc) {
      throw new Error("Colección no encontrada");
    }

    const existingIds = collectionDoc.productIds || [];
    const updatedIds = Array.from(new Set([...existingIds, ...productIds]));

    await updateCollection(collectionId, { productIds: updatedIds });
  } catch (error) {
    console.error("Error adding products to collection:", error);
    throw new Error("No se pudieron agregar productos a la colección");
  }
}

/**
 * Remueve productos de una colección
 */
export async function removeProductsFromCollection(
  collectionId: string,
  productIds: string[],
): Promise<void> {
  try {
    const collectionDoc = await getCollectionById(collectionId);
    if (!collectionDoc) {
      throw new Error("Colección no encontrada");
    }

    const existingIds = collectionDoc.productIds || [];
    const updatedIds = existingIds.filter((id) => !productIds.includes(id));

    await updateCollection(collectionId, { productIds: updatedIds });
  } catch (error) {
    console.error("Error removing products from collection:", error);
    throw new Error("No se pudieron remover productos de la colección");
  }
}

/**
 * Helper: Obtiene una colección por ID
 */
async function getCollectionById(
  id: string,
): Promise<CollectionDocument | null> {
  try {
    const collections = await getAllCollections();
    return collections.find((col) => col.id === id) || null;
  } catch (error) {
    return null;
  }
}
