import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useSpring, useMotionValue } from 'framer-motion';

interface MouseParallaxContextType {
  mouseX: ReturnType<typeof useMotionValue>;
  mouseY: ReturnType<typeof useMotionValue>;
  smoothX: ReturnType<typeof useSpring>;
  smoothY: ReturnType<typeof useSpring>;
}

const MouseParallaxContext = createContext<MouseParallaxContextType | null>(null);

export const useMouseParallax = () => {
  const ctx = useContext(MouseParallaxContext);
  if (!ctx) throw new Error('useMouseParallax must be used inside MouseParallaxProvider');
  return ctx;
};

export const MouseParallaxProvider = ({ children }: { children: React.ReactNode }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, { damping: 30, stiffness: 80, mass: 0.8 });
  const smoothY = useSpring(mouseY, { damping: 30, stiffness: 80, mass: 0.8 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      // Normalize to -1 → 1
      mouseX.set((e.clientX / window.innerWidth - 0.5) * 2);
      mouseY.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [mouseX, mouseY]);

  return (
    <MouseParallaxContext.Provider value={{ mouseX, mouseY, smoothX, smoothY }}>
      {children}
    </MouseParallaxContext.Provider>
  );
};
