import { useEffect } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from 'framer-motion';

/**
 * High-performance GPU-composited spotlight that trails the cursor.
 * Uses hardware layer translation (transform) instead of repainting
 * the entire viewport background on every mouse frame.
 */
export function CursorSpotlight() {
  const reduced = useReducedMotion();
  const x = useMotionValue(-1000);
  const y = useMotionValue(-1000);
  const springX = useSpring(x, { stiffness: 120, damping: 22, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 120, damping: 22, mass: 0.5 });

  useEffect(() => {
    if (reduced) return undefined;
    if (!window.matchMedia('(pointer: fine)').matches) return undefined;
    const handleMove = (event) => {
      x.set(event.clientX - 280);
      y.set(event.clientY - 280);
    };
    window.addEventListener('pointermove', handleMove, { passive: true });
    return () => window.removeEventListener('pointermove', handleMove);
  }, [reduced, x, y]);

  if (reduced) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[5] h-[560px] w-[560px] rounded-full will-change-transform"
      style={{
        x: springX,
        y: springY,
        background: 'radial-gradient(circle, rgba(255, 178, 36, 0.045) 0%, transparent 68%)',
      }}
    />
  );
}

export default CursorSpotlight;
