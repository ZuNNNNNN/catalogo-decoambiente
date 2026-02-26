/**
 * Barra de progreso de scroll - adapatada de barber-royce
 * Paleta cálida de Deco Ambiente
 */

import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { useLenisScroll } from "@/hooks/useLenisScroll";

export const ScrollProgressBar = () => {
  const { progress } = useLenisScroll();
  const location = useLocation();

  // Mostrar en landing y catálogo
  const showOn = ["/", "/catalogo"];
  if (!showOn.includes(location.pathname)) return null;

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: "rgba(92, 61, 46, 0.1)",
          zIndex: 9998,
        }}
      />
      <motion.div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          background:
            "linear-gradient(90deg, #5C3D2E 0%, #C9956B 50%, #E8C09A 100%)",
          transformOrigin: "0%",
          scaleX: progress,
          zIndex: 9999,
          boxShadow: "0 0 10px rgba(201, 149, 107, 0.5)",
        }}
      />
    </>
  );
};
