/**
 * Hook personalizado para animaciones al hacer scroll
 */

import { useEffect, useRef } from "react";
import { useInView, useAnimation } from "framer-motion";

interface UseScrollAnimationOptions {
  once?: boolean;
  amount?: number;
  delay?: number;
}

interface UseScrollAnimationReturn {
  ref: React.RefObject<HTMLDivElement | null>;
  controls: ReturnType<typeof useAnimation>;
  isInView: boolean;
}

export const useScrollAnimation = (
  options: UseScrollAnimationOptions = {},
): UseScrollAnimationReturn => {
  const { once = true, amount = 0.2, delay = 0 } = options;

  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        controls.start("visible");
      }, delay * 1000);

      return () => clearTimeout(timer);
    } else if (!once) {
      controls.start("hidden");
    }
  }, [isInView, controls, delay, once]);

  return { ref, controls, isInView };
};
