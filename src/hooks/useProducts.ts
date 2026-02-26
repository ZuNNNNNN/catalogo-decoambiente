/**
 * Hook para operaciones CRUD de productos en Firestore
 * Con soporte para fallback a datos locales cuando Firebase no está configurado
 */

import { useState, useEffect, useCallback } from "react";
import { featuredProductsData } from "@/data/productsData";
import type { Product, ProductFormData, BulkImportResult } from "@/types";
import * as productsService from "@/services/products.service";

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingLocalData, setUsingLocalData] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productsService.getAllProducts();
      if (data.length === 0) {
        setProducts(featuredProductsData);
        setUsingLocalData(true);
      } else {
        setProducts(data);
        setUsingLocalData(false);
      }
    } catch (err) {
      console.warn("Firebase no disponible, usando datos locales:", err);
      setProducts(featuredProductsData);
      setUsingLocalData(true);
      setError(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addProduct = async (product: ProductFormData) => {
    try {
      const id = await productsService.createProduct(product);
      await fetchProducts();
      return id;
    } catch (err) {
      throw new Error("Error al crear producto");
    }
  };

  const updateProduct = async (id: string, data: Partial<ProductFormData>) => {
    try {
      await productsService.updateProduct(id, data);
      await fetchProducts();
    } catch (err) {
      throw new Error("Error al actualizar producto");
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await productsService.deleteProduct(id);
      await fetchProducts();
    } catch (err) {
      throw new Error("Error al eliminar producto");
    }
  };

  const bulkCreateProducts = async (
    productsToCreate: ProductFormData[],
  ): Promise<BulkImportResult> => {
    try {
      const result = await productsService.bulkCreateProducts(productsToCreate);
      await fetchProducts();
      return result;
    } catch (err) {
      throw new Error("Error al importar productos");
    }
  };

  return {
    products,
    loading,
    error,
    usingLocalData,
    addProduct,
    updateProduct,
    deleteProduct,
    bulkCreateProducts,
    refetch: fetchProducts,
  };
};
