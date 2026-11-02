import { useEffect } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useMotionTemplate,
  useReducedMotion,
} from 'framer-motion';

/**
 * A faint amber spotlight that trails the cursor across the page —
 * desktop pointers only, disabled under reduced motion.
 */
export function CursorSpotlight() {
  const reduced = useReducedMotion();
  const x = useMotionValue(-600);
  const y = useMotionValue(-600);
  const springX = useSpring(x, { stiffness: 90, damping: 20, mass: 0.8 });
  const springY = useSpring(y, { stiffness: 90, damping: 20, mass: 0.8 });
  const glow = useMotionTemplate`radial-gradient(560px circle at ${springX}px ${springY}px, rgba(255,178,36,0.05), transparent 65%)`;

  useEffect(() => {
    if (reduced) return undefined;
    if (!window.matchMedia('(pointer: fine)').matches) return undefined;
    const handleMove = (event) => {
      x.set(event.clientX);
      y.set(event.clientY);
    };
    window.addEventListener('pointermove', handleMove, { passive: true });
    return () => window.removeEventListener('pointermove', handleMove);
  }, [reduced, x, y]);

  if (reduced) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[5]"
      style={{ backgroundImage: glow }}
    />
  );
}

export default CursorSpotlight;
