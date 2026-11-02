import React, { useState, useRef, useEffect, useId } from 'react';
import { cn } from '../../lib/utils';

/* ------------------------------------------------------------------ */
/*  IconFolder — Glass folder with app icons that fan out on hover    */
/*  Adapted from technical-arsenal specification with responsive      */
/*  dimensions, domain accent glow, and touch accessibility.          */
/* ------------------------------------------------------------------ */

// Folder SVG tab outlines: front pocket has tab on left, back plate has tab on right
const pathL = (w, h, r, d, tw, s) =>
  `M0 ${r}A${r} ${r} 0 0 1 ${r} 0L${tw} 0C${tw + s * 0.55} 0 ${tw + s * 0.45} ${d} ${tw + s} ${d}L${w - r} ${d}A${r} ${r} 0 0 1 ${w} ${d + r}L${w} ${h - r}A${r} ${r} 0 0 1 ${w - r} ${h}L${r} ${h}A${r} ${r} 0 0 1 0 ${h - r}Z`;

const pathR = (w, h, r, d, tw, s) => {
  const x = w - tw;
  return `M0 ${d + r}A${r} ${r} 0 0 1 ${r} ${d}L${x - s} ${d}C${x - s * 0.45} ${d} ${x - s * 0.55} 0 ${x} 0L${w - r} 0A${r} ${r} 0 0 1 ${w} ${r}L${w} ${h - r}A${r} ${r} 0 0 1 ${w - r} ${h}L${r} ${h}A${r} ${r} 0 0 1 0 ${h - r}Z`;
};

function useShape(ref, make, defaultW = 380, defaultH = 180) {
  const [d, setD] = useState(() => make(defaultW, defaultH));
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      if (el.offsetWidth > 0 && el.offsetHeight > 0) {
        setD(make(el.offsetWidth, el.offsetHeight));
      }
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [make, ref]);
  return d;
}

function Tile({ icon, ring, shadow }) {
  return (
    <div
      className="grid h-full w-full place-items-center overflow-hidden rounded-[22px] transition-transform"
      style={{
        background: icon.background || '#18181b',
        boxShadow: `0 18px 36px ${shadow}, 0 0 0 1px ${ring}`,
      }}
    >
      {icon.src ? (
        <img src={icon.src} alt={icon.label || ''} draggable={false} className="h-full w-full object-cover" />
      ) : (
        <span className="flex h-full w-full items-center justify-center text-white [&_svg]:h-[56%] [&_svg]:w-[56%]">
          {icon.node}
        </span>
      )}
    </div>
  );
}

export function IconFolder({
  title = 'Design',
  subtitle,
  tags = [],
  icons = [],
  accentColor = '#ff5722',
  defaultOpen = false,
  spread = 58,
  showPill = true,
  badgeText,
  className = '',
  onTagClick,
}) {
  const gid = useId().replace(/:/g, '');
  const rootRef = useRef(null);
  const frontRef = useRef(null);
  const backRef = useRef(null);

  const [shown, setShown] = useState(false);
  const [open, setOpen] = useState(defaultOpen);
  const [hover, setHover] = useState(false);
  const [hi, setHi] = useState(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => setOpen(defaultOpen), [defaultOpen]);

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setShown(true), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const frontD = useShape(frontRef, (w, h) => pathL(w, h, 20, 22, Math.round(w * 0.44), 42));
  const backD = useShape(backRef, (w, h) => pathR(w, h, 20, 22, Math.round(w * 0.42), 42));

  const n = icons.length;
  const rs = n > 1 ? 26 / (n - 1) : 0; // tilt degrees per step
  const wide = open || hover;
  const lift = wide;
  const ease = 'cubic-bezier(.2,.8,.2,1)';
  const toggle = () => setOpen((o) => !o);

  return (
    <div
      ref={rootRef}
      role="button"
      tabIndex={0}
      aria-expanded={open}
      aria-label={`${title}: ${tags.join(', ')}`}
      onClick={toggle}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle();
        }
      }}
      onPointerEnter={(e) => e.pointerType === 'mouse' && setHover(true)}
      onPointerLeave={() => {
        setHover(false);
        setHi(null);
      }}
      className={cn(
        'group relative isolate h-[310px] w-full max-w-[420px] cursor-pointer select-none outline-none focus-visible:rounded-3xl focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4',
        className,
      )}
      style={{
        zIndex: lift ? 10 : 1,
        opacity: shown || reduced ? 1 : 0,
        transform: shown || reduced ? (lift ? 'translateY(-6px) scale(1.02)' : 'none') : 'translateY(30px) scale(.94)',
        transition: reduced ? 'none' : `transform .7s ${ease}, opacity .6s ease`,
      }}
    >
      {/* Dynamic ambient domain glow */}
      <div
        className="pointer-events-none absolute left-[10%] right-[10%] top-8 -z-10 h-[190px] rounded-full blur-[24px] transition-opacity duration-500"
        style={{
          background: `radial-gradient(closest-side, ${accentColor}25, transparent)`,
          opacity: lift ? 0.9 : 0.4,
        }}
      />

      {/* Back Plate */}
      <div
        ref={backRef}
        className="absolute inset-x-0 bottom-0 top-[14px]"
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01) 60%)',
          clipPath: backD ? `path('${backD}')` : undefined,
        }}
      >
        <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
          <path d={backD} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
        </svg>
      </div>

      {/* Fanned Out Icons */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {icons.map((icon, i) => {
          const k = i - (n - 1) / 2;
          const gap = wide ? spread * 1.15 : spread * 0.85;
          const y = k * k * 8.5 - (wide ? 6 : 0);
          const rot = k * rs * (wide ? 1.25 : 1);

          return (
            <div
              key={icon.label || i}
              className="absolute left-1/2 top-[38px] -ml-[45px] h-[90px] w-[90px] rounded-[22px] [backface-visibility:hidden]"
              style={{
                zIndex: hi === i ? 25 : i + 2,
                opacity: shown || reduced ? 1 : 0,
                transform: shown || reduced
                  ? `translate3d(${k * gap}px, ${y}px, 0) rotate(${rot}deg)`
                  : `translate3d(${k * spread * 0.5}px, 75px, 0)`,
                transition: reduced ? 'none' : `transform ${wide ? 0.55 : 0.8}s ${ease}, opacity .45s`,
                transitionDelay: reduced ? '0s' : wide ? `${i * 0.035}s` : `${0.2 + i * 0.06}s`,
              }}
            >
              <div
                className="pointer-events-auto relative h-full w-full rounded-[inherit]"
                onPointerEnter={(e) => e.pointerType === 'mouse' && setHi(i)}
                onPointerLeave={() => setHi((h) => (h === i ? null : h))}
                style={{
                  transform:
                    hi === i ? `translateY(-28px) rotate(${-rot}deg) scale(1.12)` : hi !== null ? 'scale(.94)' : 'none',
                  filter: hi !== null && hi !== i ? 'saturate(.6) brightness(.75)' : 'none',
                  transition: reduced ? 'none' : `transform .4s ${ease}, filter .25s ease`,
                }}
              >
                <Tile
                  icon={icon}
                  ring={hi === i ? accentColor : 'rgba(255,255,255,0.12)'}
                  shadow="rgba(0,0,0,0.6)"
                />

                {/* Floating Tooltip Pill */}
                {icon.label && (
                  <span
                    className="pointer-events-none absolute bottom-full left-1/2 mb-2 whitespace-nowrap rounded-full border border-line bg-void/95 px-2.5 py-1 font-mono text-[11px] font-semibold tracking-wide text-ash shadow-xl backdrop-blur-md"
                    style={{
                      opacity: hi === i ? 1 : 0,
                      transform: `translateX(-50%) translateY(${hi === i ? 0 : 6}px)`,
                      borderColor: accentColor,
                      transition: reduced ? 'none' : `opacity .2s ease, transform .3s ${ease}`,
                    }}
                  >
                    {icon.label}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Glass Front Pocket */}
      <div
        ref={frontRef}
        className="absolute inset-x-0 bottom-0 h-[190px] overflow-hidden backdrop-blur-xl backdrop-saturate-150"
        style={{
          background: 'linear-gradient(160deg, rgba(30,30,35,0.85), rgba(16,16,20,0.92) 55%), rgba(12,12,14,0.85)',
          clipPath: frontD ? `path('${frontD}')` : undefined,
          transform: lift ? 'translateY(6px)' : 'none',
          transition: reduced ? 'none' : `transform .55s ${ease}`,
        }}
      >
        <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
          <defs>
            <linearGradient id={`edge-${gid}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="rgba(255,255,255,0.35)" />
              <stop offset="0.4" stopColor="rgba(255,255,255,0.12)" />
              <stop offset="1" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
          </defs>
          <path d={frontD} fill="none" stroke={`url(#edge-${gid})`} strokeWidth="1.5" />
        </svg>

        <div className="relative flex h-full flex-col justify-between p-5 pt-8">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-geist text-lg font-bold tracking-tight text-ash md:text-xl">
                {title}
              </h3>
              {badgeText && (
                <span
                  className="rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider"
                  style={{
                    backgroundColor: `${accentColor}18`,
                    borderColor: `${accentColor}40`,
                    color: accentColor,
                  }}
                >
                  {badgeText}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="mt-1 font-mono text-[11px] text-dim line-clamp-1">
                {subtitle}
              </p>
            )}

            {/* Tag Chips */}
            <div className="mt-3.5 flex flex-wrap gap-1.5">
              {tags.map((tag) => {
                const isHovered = hi !== null && icons[hi]?.label === tag;
                return (
                  <span
                    key={tag}
                    onClick={(e) => {
                      e.stopPropagation();
                      onTagClick?.(tag);
                    }}
                    className={cn(
                      'rounded-full border px-2.5 py-0.5 font-mono text-[11px] leading-tight backdrop-blur-md transition-all',
                      isHovered
                        ? 'border-signal bg-signal/20 text-white font-semibold scale-105'
                        : 'border-line/70 bg-graphite/70 text-dim hover:border-line hover:text-ash',
                    )}
                    style={isHovered ? { borderColor: accentColor, color: '#fff' } : undefined}
                  >
                    {tag}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Bottom Row: Mini Avatar Pill + Hint */}
          <div className="flex items-center justify-between pt-2">
            <span className="font-mono text-[10px] text-dim/60 group-hover:text-signal transition-colors flex items-center gap-1">
              <span>{open ? 'Tap to close' : 'Hover or tap to fan open'}</span>
            </span>

            {showPill && (
              <div
                className="flex h-[30px] items-center gap-1 rounded-full border border-line bg-void/80 px-1.5 shadow-inner"
                aria-hidden="true"
              >
                {icons.slice(0, 5).map((icon, i) => (
                  <span
                    key={icon.label || i}
                    className="flex h-[20px] w-[20px] items-center justify-center overflow-hidden rounded-full text-white [&_svg]:h-[65%] [&_svg]:w-[65%]"
                    style={{ background: icon.background || '#27272a' }}
                    title={icon.label}
                  >
                    {icon.node}
                  </span>
                ))}
                {icons.length > 5 && (
                  <span className="px-1 font-mono text-[9px] text-dim">
                    +{icons.length - 5}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default IconFolder;
