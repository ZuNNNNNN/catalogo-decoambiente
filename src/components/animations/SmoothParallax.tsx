/**
 * Componente de parallax suave con física de spring
 * Adaptado de barber-royce para Deco Ambiente & Hogar
 */

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import type { ReactNode, CSSProperties } from "react";

interface SmoothParallaxProps {
  children: ReactNode;
  speed?: number;
  stiffness?: number;
  damping?: number;
  scale?: [number, number];
  opacity?: [number, number];
  className?: string;
  style?: CSSProperties;
}

export const SmoothParallax = ({
  children,
  speed = -20,
  stiffness = 100,
  damping = 30,
  scale,
  opacity,
  className,
  style,
}: SmoothParallaxProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const yRaw = useTransform(scrollYProgress, [0, 1], [0, speed]);
  const scaleRaw = useTransform(scrollYProgress, [0, 1], scale || [1, 1]);
  const opacityRaw = useTransform(scrollYProgress, [0, 1], opacity || [1, 1]);

  const y = useSpring(yRaw, { stiffness, damping, restDelta: 0.001 });
  const scaleSpring = useSpring(scaleRaw, { stiffness, damping });
  const opacitySpring = useSpring(opacityRaw, { stiffness, damping });

  return (
    <motion.div
      ref={ref}
      style={{
        y,
        scale: scale ? scaleSpring : 1,
        opacity: opacity ? opacitySpring : 1,
        willChange: "transform",
        ...style,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
