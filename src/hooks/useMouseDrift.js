import { useLayoutEffect } from 'react';
import { gsap, prefersReducedMotion, hasFinePointer } from '../lib/gsap';

/**
 * Drifts an element a few pixels toward the cursor (with optional
 * rotationY for a camera-pan feel). Desktop pointers only; inert under
 * reduced motion.
 */
export function useMouseDrift(ref, { strength = 16, rotate = 0 } = {}) {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (prefersReducedMotion() || !hasFinePointer()) return undefined;

    if (rotate) gsap.set(el, { transformPerspective: 800 });
    const xTo = gsap.quickTo(el, 'x', { duration: 0.7, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.7, ease: 'power3.out' });
    const rTo = rotate ? gsap.quickTo(el, 'rotationY', { duration: 0.9, ease: 'power3.out' }) : null;

    const onMove = (event) => {
      const nx = event.clientX / window.innerWidth - 0.5;
      const ny = event.clientY / window.innerHeight - 0.5;
      xTo(nx * strength);
      yTo(ny * strength);
      rTo?.(nx * rotate);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      gsap.set(el, { x: 0, y: 0, rotationY: 0 });
    };
  }, [ref, strength, rotate]);
}

export default useMouseDrift;
