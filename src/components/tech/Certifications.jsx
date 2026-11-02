import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';
import { SectionHeading } from '../ui/SectionHeading';
import { GhostNumber } from '../ui/GhostNumber';
import { BracketCorners } from '../ui/BracketCorners';
import { certifications as certData } from '../../data/techData';
import { cn } from '../../lib/utils';

/*
 * Certifications — tech_component/certificate.txt
 * (ScrollReelCertifications): a three-column film reel of blurred
 * cells with the featured certificate floating in the middle column,
 * plus character-by-character text reveals. Certificates are the nine
 * real Coursera credentials from tech.txt.
 */

const DEFAULT_CELL_W = 490;
const DEFAULT_CELL_H = 345;

const EXIT_MS = 240;
const SLIDE_MS = 800;
const EASE_INOUT = 'cubic-bezier(0.65,0,0.35,1)';

const TITLE_CLASSES =
  'm-0 text-lg font-medium leading-[1.3] tracking-[-0.02em] text-white sm:text-[22px]';
const ISSUER_CLASSES =
  'm-0 text-sm font-medium leading-[1.3] text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center gap-1 cursor-pointer';

const FEATURED_SHADOW =
  '0 12px 36px -10px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.12)';

/* Background placeholder cells */
function Cell({ cellW = DEFAULT_CELL_W, cellH = DEFAULT_CELL_H }) {
  return (
    <div
      aria-hidden="true"
      className="shrink-0 rounded-xl border border-gray-800/50 bg-gradient-to-b from-gray-900/40 to-black blur-[3px]"
      style={{ width: cellW, height: cellH }}
    />
  );
}

/* Featured certificate — fully visible, floating, with a light sheen */
function Featured({ src, alt, onOpen, cellW = DEFAULT_CELL_W, cellH = DEFAULT_CELL_H }) {
  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      onClick={onOpen}
      className="group relative shrink-0 cursor-zoom-in overflow-hidden rounded-xl bg-[#050505] ring-1 ring-gray-700/50 shadow-2xl transition-all"
      style={{ width: cellW, height: cellH, boxShadow: FEATURED_SHADOW }}
    >
      <img
        src={src}
        alt={alt ?? 'Certification'}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-contain p-2"
      />
      {/* Animated light sheen over the certificate */}
      <motion.div
        aria-hidden="true"
        animate={{ x: ['-100%', '200%'] }}
        transition={{ duration: 3, repeat: Infinity, repeatDelay: 5, ease: 'linear' }}
        className="pointer-events-none absolute inset-0 z-10 w-1/2 -skew-x-12 opacity-20"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
        }}
      />
    </motion.div>
  );
}

function Chars({ text, startIndex, staggerMs }) {
  let idx = startIndex;
  const words = text.split(' ');
  return (
    <>
      {words.map((word, wi) => {
        const wordSpan = (
          <span className="inline-block whitespace-nowrap">
            {Array.from(word).map((ch, ci) => {
              const delay = idx * staggerMs;
              idx++;
              return (
                <span
                  key={ci}
                  className="inline-block will-change-transform"
                  style={{
                    animationDelay: `${delay}ms`,
                    animation: 'slideUpFade 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                    opacity: 0,
                    transform: 'translateY(10px)',
                  }}
                >
                  {ch}
                </span>
              );
            })}
          </span>
        );
        if (wi < words.length - 1) idx++;
        return (
          <React.Fragment key={wi}>
            {wordSpan}
            {wi < words.length - 1 ? ' ' : null}
          </React.Fragment>
        );
      })}
    </>
  );
}

export function ScrollReelCertifications({ certifications = certData, charStaggerMs = 8, className }) {
  const [index, setIndex] = React.useState(0);
  const [displayIndex, setDisplayIndex] = React.useState(0);
  const [exiting, setExiting] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [lightboxOpen, setLightboxOpen] = React.useState(false);
  const animating = React.useRef(false);
  const timeouts = React.useRef([]);

  const count = certifications.length;

  // Escape closes the lightbox; page scroll locks while it is open
  React.useEffect(() => {
    if (!lightboxOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setLightboxOpen(false);
    };
    window.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [lightboxOpen]);

  React.useEffect(() => {
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setMounted(true)));
    return () => {
      cancelAnimationFrame(raf);
      timeouts.current.forEach(clearTimeout);
    };
  }, []);

  const paginate = React.useCallback(
    (dir) => {
      if (animating.current) return;
      const next = index + dir;
      if (next < 0 || next >= count) return;
      animating.current = true;

      setIndex(next);
      setExiting(true);

      timeouts.current.push(
        setTimeout(() => {
          setDisplayIndex(next);
          setExiting(false);
        }, EXIT_MS),
      );
      timeouts.current.push(
        setTimeout(() => {
          animating.current = false;
        }, SLIDE_MS),
      );
    },
    [index, count],
  );

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      paginate(1);
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      paginate(-1);
    }
  };

  const middleItems = React.useMemo(() => {
    const items = [];
    for (let i = 0; i < 3; i++) items.push({ type: 'cell' });
    certifications.forEach((_, i) => {
      items.push({ type: 'featured', i });
      if (i < count - 1) {
        items.push({ type: 'cell' }, { type: 'cell' });
      }
    });
    for (let i = 0; i < 3; i++) items.push({ type: 'cell' });
    return items;
  }, [certifications, count]);

  const [windowWidth, setWindowWidth] = React.useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200,
  );

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;

  const cellW = isMobile
    ? Math.max(280, Math.min(windowWidth - 48, 380))
    : isTablet
      ? 430
      : DEFAULT_CELL_W;
  const cellH = isMobile ? Math.round(cellW * 0.7) : isTablet ? 300 : DEFAULT_CELL_H;
  const step = 3 * (cellH + 12);

  const sideCellCount = 4 + 2 * count;
  const centerIdx = (count - 1) / 2;
  const middleY = (centerIdx - index) * step;
  const sideY = -middleY;

  const colStyle = (y) => ({
    transform: `translateY(${y}px)`,
    transition: mounted ? `transform ${SLIDE_MS}ms ${EASE_INOUT}` : 'none',
  });

  const current = certifications[displayIndex];

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Certifications"
      tabIndex={0}
      onKeyDown={onKeyDown}
      className={cn(
        'relative flex w-full max-w-[1280px] flex-col items-stretch gap-4 overflow-hidden rounded-2xl border border-line bg-[#0A0A0A] outline-none focus-visible:ring-2 focus-visible:ring-gray-600 md:min-h-[480px] lg:min-h-[520px] md:flex-row',
        className,
      )}
    >
      {/* Reel section */}
      <div
        aria-hidden="true"
        className="relative h-[360px] w-full shrink-0 self-stretch overflow-hidden md:h-auto md:w-[620px] lg:w-[720px]"
        style={{
          WebkitMaskImage:
            'linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
          maskImage:
            'linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
          WebkitMaskComposite: 'source-in',
          maskComposite: 'intersect',
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center gap-3">
          {/* Left column */}
          <div
            className="flex shrink-0 flex-col gap-3 will-change-transform motion-reduce:[transition:none!important]"
            style={colStyle(sideY)}
          >
            {Array.from({ length: sideCellCount }).map((_, i) => (
              <Cell key={`l-${i}`} cellW={cellW} cellH={cellH} />
            ))}
          </div>

          {/* Middle column */}
          <div
            className="flex shrink-0 flex-col gap-3 will-change-transform motion-reduce:[transition:none!important]"
            style={colStyle(middleY)}
          >
            {middleItems.map((item, i) =>
              item.type === 'featured' ? (
                <Featured
                  key={`m-${i}`}
                  src={certifications[item.i].image}
                  alt={certifications[item.i].title}
                  onOpen={() => setLightboxOpen(true)}
                  cellW={cellW}
                  cellH={cellH}
                />
              ) : (
                <Cell key={`mc-${i}`} cellW={cellW} cellH={cellH} />
              ),
            )}
          </div>

          {/* Right column */}
          <div
            className="flex shrink-0 flex-col gap-3 will-change-transform motion-reduce:[transition:none!important]"
            style={colStyle(sideY)}
          >
            {Array.from({ length: sideCellCount }).map((_, i) => (
              <Cell key={`r-${i}`} cellW={cellW} cellH={cellH} />
            ))}
          </div>
        </div>
      </div>

      {/* Content section */}
      <div className="flex min-w-0 flex-1 flex-col justify-between self-stretch bg-[#111113] px-6 py-8 md:py-12">
        <div className="flex flex-col gap-[12px]">
          {/* Certificate icon */}
          <svg
            className="mb-4 block h-10 w-10 text-gray-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 15V3m0 12l-4-4m4 4l4-4M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17"></path>
          </svg>

          {/* Text stage */}
          <div className="relative w-full max-w-[450px] overflow-hidden" aria-live="polite">
            <div aria-hidden="true" className="invisible flex min-h-[120px] flex-col gap-[16px]">
              <p className={TITLE_CLASSES}>{current.title}</p>
              <p className={ISSUER_CLASSES}>{current.issuer}</p>
            </div>

            <div
              key={displayIndex}
              className={cn(
                'absolute inset-x-0 top-0 flex flex-col gap-[16px] transition-opacity duration-200 will-change-[transform,opacity]',
                exiting ? 'opacity-0' : 'opacity-100',
              )}
            >
              <p className={TITLE_CLASSES}>
                <Chars text={current.title} startIndex={0} staggerMs={charStaggerMs} />
              </p>

              <a
                href={current.url}
                target="_blank"
                rel="noreferrer"
                className={ISSUER_CLASSES}
                style={{ animationDelay: `${current.title.length * charStaggerMs}ms` }}
              >
                <Chars
                  text={current.issuer}
                  startIndex={current.title.length + 5}
                  staggerMs={charStaggerMs}
                />
                <svg
                  className="ml-1 mt-0.5 h-3.5 w-3.5 opacity-70"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-8 flex items-center gap-3 md:mt-0">
          <button
            type="button"
            onClick={() => paginate(-1)}
            disabled={index === 0}
            aria-label="Previous certification"
            className="grid h-10 w-10 cursor-pointer place-items-center rounded-full border border-gray-700 bg-transparent p-0 text-white transition-all hover:enabled:scale-[1.05] hover:enabled:bg-gray-800 active:enabled:scale-[0.95] disabled:cursor-default disabled:opacity-30"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M7.5 2.5 3.5 6l4 3.5" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => paginate(1)}
            disabled={index === count - 1}
            aria-label="Next certification"
            className="grid h-10 w-10 cursor-pointer place-items-center rounded-full border border-gray-700 bg-transparent p-0 text-white transition-all hover:enabled:scale-[1.05] hover:enabled:bg-gray-800 active:enabled:scale-[0.95] disabled:cursor-default disabled:opacity-30"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m4.5 2.5 4 3.5-4 3.5" />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            aria-label="View certificate full screen"
            className="group relative ml-1 inline-flex h-10 cursor-pointer items-center gap-2 px-4 font-mono text-[11px] uppercase tracking-[0.2em] text-signal transition-transform hover:scale-[1.03] active:scale-[0.97]"
          >
            <BracketCorners cornerClassName="h-2 w-2 border-signal/60 transition-colors group-hover:border-signal" />
            View
          </button>

          <span className="ml-2 font-mono text-xs tracking-widest text-gray-500">
            {String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Fullscreen lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setLightboxOpen(false)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm md:p-10"
            role="dialog"
            aria-modal="true"
            aria-label={`${current.title} certificate`}
          >
            <motion.div
              initial={{ scale: 0.92, y: 16, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 24 }}
              onClick={(e) => e.stopPropagation()}
              className="relative flex max-h-full max-w-5xl flex-col items-center"
            >
              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                aria-label="Close"
                autoFocus
                className="absolute -top-3 right-0 z-10 grid h-10 w-10 -translate-y-full cursor-pointer place-items-center rounded-full border border-gray-700 bg-black/70 text-white transition-all hover:scale-105 hover:bg-gray-800"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>

              <div className="relative overflow-hidden rounded-xl ring-1 ring-gray-600/60">
                <img
                  src={current.image}
                  alt={`${current.title} — ${current.issuer} certificate`}
                  className="max-h-[76vh] w-auto max-w-full object-contain"
                />
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-center">
                <p className="text-base font-medium text-white md:text-lg">{current.title}</p>
                <a
                  href={current.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.2em] text-signal transition-colors hover:text-white"
                >
                  Verify on {current.issuer}
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Certifications() {
  return (
    <section id="certifications" className="relative mx-auto max-w-7xl px-6 py-28 md:py-32">
      <GhostNumber depth={0.35} className="-top-6 right-0">
        05
      </GhostNumber>
      <SectionHeading
        index={5}
        label="Proof of Work"
        title="Proof of Work"
        subtitle="Verified credentials across machine learning, software engineering and project management."
        className="mb-12"
      />
      <div className="flex justify-center">
        <ScrollReelCertifications />
      </div>
    </section>
  );
}

export default Certifications;
