import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Hace scroll al inicio de la página en cada cambio de ruta.
 * Renderizar dentro de <BrowserRouter>.
 */
export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Usar lenis si está disponible, sino fallback nativo
    if (window.lenis) {
      window.lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [pathname]);

  return null;
};
