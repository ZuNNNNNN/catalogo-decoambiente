/**
 * Hook personalizado para integrar Lenis smooth scroll con React
 * Extraído y adaptado de barber-royce
 */

import { useEffect } from "react";
import Lenis from "lenis";

declare global {
  interface Window {
    lenis?: Lenis;
  }
}

export const useLenis = (options?: ConstructorParameters<typeof Lenis>[0]) => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
      ...options,
    });

    window.lenis = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      window.lenis = undefined;
    };
  }, [options]);
};
