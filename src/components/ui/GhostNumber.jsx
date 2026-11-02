import { cn } from '../../lib/utils';

/**
 * Oversized outlined section numeral that sits behind content and
 * overlaps the heading — editorial depth layer. Pair with a
 * `data-depth` attribute so useParallaxDepth drifts it on scroll.
 */
export function GhostNumber({ children, className, depth = 0.35 }) {
  return (
    <span
      aria-hidden="true"
      data-depth={depth}
      className={cn(
        'pointer-events-none absolute -z-10 select-none font-geist font-extrabold leading-none text-transparent',
        className,
      )}
      style={{
        WebkitTextStroke: '1.5px rgba(229, 226, 225, 0.07)',
        fontSize: 'clamp(9rem, 24vw, 22rem)',
      }}
    >
      {children}
    </span>
  );
}

export default GhostNumber;
