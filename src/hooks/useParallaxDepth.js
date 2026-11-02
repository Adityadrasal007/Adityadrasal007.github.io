import { useLayoutEffect } from 'react';
import { gsap, prefersReducedMotion } from '../lib/gsap';

/**
 * Scroll-scrubbed depth parallax. Any element inside `scopeRef` carrying
 * `data-depth="0.3"` translates vertically at a rate proportional to its
 * depth while its parent passes through the viewport — background layers
 * drift slower than foreground content, tracked 1:1 with the scrollbar.
 */
export function useParallaxDepth(scopeRef) {
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-depth]').forEach((el) => {
        const depth = parseFloat(el.dataset.depth || '0.2');
        gsap.fromTo(
          el,
          { y: depth * 160 },
          {
            y: -depth * 160,
            ease: 'none',
            scrollTrigger: {
              trigger: el.parentElement,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        );
      });
    }, scopeRef);
    return () => ctx.revert();
  }, [scopeRef]);
}

export default useParallaxDepth;
