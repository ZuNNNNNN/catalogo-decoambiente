/**
 * Hook para operaciones CRUD de categorías en Firestore
 * Con soporte para fallback a datos vacíos cuando Firebase no está disponible
 */

import { useState, useEffect, useCallback } from "react";
import type { CategoryDocument, CategoryFormData } from "@/types";
import * as categoriesService from "@/services/categories.service";

export const useCategories = () => {
  const [categories, setCategories] = useState<CategoryDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await categoriesService.getAllCategories();
      setCategories(data);
    } catch (err) {
      console.error("Error al cargar categorías:", err);
      setError(
        err instanceof Error
          ? err.message
          : "No se pudieron cargar las categorías",
      );
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const addCategory = async (category: CategoryFormData) => {
    try {
      const id = await categoriesService.createCategory(category);
      await fetchCategories();
      return id;
    } catch {
      throw new Error("Error al crear categoría");
    }
  };

  const updateCategory = async (
    id: string,
    data: Partial<CategoryFormData>,
  ) => {
    try {
      await categoriesService.updateCategory(id, data);
      await fetchCategories();
    } catch {
      throw new Error("Error al actualizar categoría");
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await categoriesService.deleteCategory(id);
      await fetchCategories();
    } catch {
      throw new Error("Error al eliminar categoría");
    }
  };

  const getCategoryBySlug = useCallback(
    (slug: string) => {
      return categories.find((cat) => cat.slug === slug) || null;
    },
    [categories],
  );

  return {
    categories,
    loading,
    error,
    addCategory,
    updateCategory,
    deleteCategory,
    getCategoryBySlug,
    refetch: fetchCategories,
  };
};
