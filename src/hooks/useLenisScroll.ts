/**
 * Hook para trackear el progreso y dirección del scroll con Lenis
 */

import { useState, useEffect } from "react";

interface LenisScrollState {
  progress: number;
  direction: number;
  velocity: number;
  isScrolling: boolean;
}

export const useLenisScroll = (): LenisScrollState => {
  const [state, setState] = useState<LenisScrollState>({
    progress: 0,
    direction: 0,
    velocity: 0,
    isScrolling: false,
  });

  useEffect(() => {
    const lenis = window.lenis;
    if (!lenis) return;

    const onScroll = ({
      progress,
      direction,
      velocity,
    }: {
      progress: number;
      direction: number;
      velocity: number;
    }) => {
      setState({
        progress,
        direction,
        velocity,
        isScrolling: Math.abs(velocity) > 0.01,
      });
    };

    lenis.on("scroll", onScroll);

    return () => {
      lenis.off("scroll", onScroll);
    };
  }, []);

  return state;
};
