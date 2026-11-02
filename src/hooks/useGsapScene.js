import { useLayoutEffect } from 'react';
import { gsap, prefersReducedMotion } from '../lib/gsap';

/**
 * Runs a GSAP scene scoped to `scopeRef` and reverts it on unmount.
 * The scene is skipped entirely under reduced motion, so elements
 * stay at their resting CSS positions.
 */
export function useGsapScene(scopeRef, sceneFn, deps = []) {
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const ctx = gsap.context(sceneFn, scopeRef);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export default useGsapScene;
