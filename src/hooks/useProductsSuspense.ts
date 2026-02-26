/**
 * Hook para productos con Suspense
 * Patrón 6: Usa React.use() para suspender hasta que los datos estén listos
 */
import { use, startTransition, useCallback } from "react";
import {
  getProductsResource,
  invalidateProducts,
} from "@/services/products.resource";

export function useProductsSuspense() {
  // React.use() suspende automáticamente hasta que la Promise se resuelva
  const products = use(getProductsResource());

  // Función para refetch manual (invalida cache y causa re-render)
  const refetch = useCallback(() => {
    startTransition(() => {
      invalidateProducts();
      // El componente se re-renderiza y vuelve a suspender
    });
  }, []);

  return {
    products,
    refetch,
  };
}
