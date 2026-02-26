/**
 * Hook para operaciones CRUD de colecciones en Firestore
 * Con soporte para fallback a datos vacíos cuando Firebase no está disponible
 */

import { useState, useEffect, useCallback } from "react";
import type { CollectionDocument, CollectionFormData } from "@/types";
import * as collectionsService from "@/services/collections.service";

export const useCollections = () => {
  const [collections, setCollections] = useState<CollectionDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCollections = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await collectionsService.getAllCollections();
      setCollections(data);
    } catch (err) {
      console.error("Error al cargar colecciones:", err);
      setError(
        err instanceof Error
          ? err.message
          : "No se pudieron cargar las colecciones",
      );
      setCollections([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  const addCollection = async (collection: CollectionFormData) => {
    try {
      const id = await collectionsService.createCollection(collection);
      await fetchCollections();
      return id;
    } catch {
      throw new Error("Error al crear colección");
    }
  };

  const updateCollection = async (
    id: string,
    data: Partial<CollectionFormData>,
  ) => {
    try {
      await collectionsService.updateCollection(id, data);
      await fetchCollections();
    } catch {
      throw new Error("Error al actualizar colección");
    }
  };

  const deleteCollection = async (id: string) => {
    try {
      await collectionsService.deleteCollection(id);
      await fetchCollections();
    } catch {
      throw new Error("Error al eliminar colección");
    }
  };

  const addProductsToCollection = async (
    collectionId: string,
    productIds: string[],
  ) => {
    try {
      await collectionsService.addProductsToCollection(
        collectionId,
        productIds,
      );
      await fetchCollections();
    } catch {
      throw new Error("Error al agregar productos a la colección");
    }
  };

  const removeProductsFromCollection = async (
    collectionId: string,
    productIds: string[],
  ) => {
    try {
      await collectionsService.removeProductsFromCollection(
        collectionId,
        productIds,
      );
      await fetchCollections();
    } catch {
      throw new Error("Error al remover productos de la colección");
    }
  };

  const getFeaturedCollections = useCallback(() => {
    return collections.filter((col) => col.featured === true);
  }, [collections]);

  const getCollectionBySlug = useCallback(
    (slug: string) => {
      return collections.find((col) => col.slug === slug) || null;
    },
    [collections],
  );

  return {
    collections,
    loading,
    error,
    addCollection,
    updateCollection,
    deleteCollection,
    addProductsToCollection,
    removeProductsFromCollection,
    getFeaturedCollections,
    getCollectionBySlug,
    refetch: fetchCollections,
  };
};
