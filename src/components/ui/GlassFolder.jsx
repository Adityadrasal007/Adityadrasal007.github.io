import React from 'react';

/**
 * Glass Folder Cards — High-Performance 3D Frosted-Glass Folder.
 * Optimized for rock-solid stability, 120 FPS buttery smooth motion,
 * and zero Chromium compositor vanishing bugs.
 */

export const ART_PRESETS = {
  aurora:
    'linear-gradient(135deg, #1b2838 0%, #2a1e2a 35%, #c2433f 70%, #6f97c2 100%)',
  ember:
    'linear-gradient(135deg, #0d1117 0%, #1c1012 30%, #a3201a 65%, #ef4a2b 85%, #ff8a5c 100%)',
  dusk:
    'linear-gradient(135deg, #120c18 0%, #2a1b35 30%, #8f6c9c 65%, #b3502f 85%, #fbe7d2 100%)',
  glacier:
    'linear-gradient(135deg, #0f172a 0%, #1e293b 35%, #334155 65%, #9fb4c7 85%, #e2e8f0 100%)',
  verdant:
    'linear-gradient(135deg, #070b08 0%, #173024 35%, #2d5a3f 65%, #a7843a 85%, #fbf3d6 100%)',
};

export function hexToRgb(hex) {
  let h = hex.trim().replace(/^#/, '');
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  const n = /^[0-9a-f]{6}$/i.test(h) ? parseInt(h, 16) : 0x808080;
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashString(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

export function fanSlot(index, count) {
  return count <= 1 ? 0 : (index / (count - 1)) * 2 - 1;
}

const W = 340;
const H = 272;
const HEADROOM = 54;
const FRONT_TOP = 74;
const FRONT_H = H - FRONT_TOP; // 198
const SHEET_W = 272;
const SHEET_H = 184;

const BACK_PATH =
  'M0 56A22 22 0 0 1 22 34L146 34C170 34 172 0 198 0L318 0A22 22 0 0 1 340 22L340 250A22 22 0 0 1 318 272L22 272A22 22 0 0 1 0 250Z';

const FRONT_PATH =
  'M0 22A22 22 0 0 1 22 0L118 0C144 0 146 32 172 32L318 32A22 22 0 0 1 340 54L340 ' +
  (FRONT_H - 22) +
  'A22 22 0 0 1 318 ' +
  FRONT_H +
  'L22 ' +
  FRONT_H +
  'A22 22 0 0 1 0 ' +
  (FRONT_H - 22) +
  'Z';

const MAX_VISIBLE = 4;

export default function GlassFolder({
  label = 'My Files',
  meta,
  tone = 'dark',
  art = 'aurora',
  image,
  files: initialFiles = [],
  action = 'more',
  onAdd,
  onFilesChange,
  menu = [],
  labelPlacement = 'bottom-left',
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  onFileSelect,
  width = 340,
  className,
  style,
}) {
  const uid = React.useId().replace(/:/g, '');
  const rootRef = React.useRef(null);
  const rectRef = React.useRef(null);
  const filesRef = React.useRef(null);
  const hitRef = React.useRef(null);
  const keyRef = React.useRef(null);
  const menuRef = React.useRef(null);

  const [files, setFiles] = React.useState(initialFiles);
  const ids = React.useRef(initialFiles.map((_, i) => i));
  const nextId = React.useRef(initialFiles.length);
  const [dropped, setDropped] = React.useState(null);
  const [bump, setBump] = React.useState(0);

  const [openState, setOpenState] = React.useState(defaultOpen);
  const open = openProp ?? openState;
  const setOpen = React.useCallback(
    (next) => {
      if (openProp === undefined) setOpenState(next);
      onOpenChange?.(next);
    },
    [openProp, onOpenChange],
  );
  const [menuOpen, setMenuOpen] = React.useState(false);

  const k = width / W;

  // Cached Rect Pointer Move — zero layout thrashing
  React.useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    let raf = 0;
    let px = 0;
    let py = 0;

    const write = () => {
      raf = 0;
      el.style.setProperty('--gf-px', px.toFixed(3));
      el.style.setProperty('--gf-py', py.toFixed(3));
    };

    const enter = () => {
      rectRef.current = el.getBoundingClientRect();
    };

    const move = (e) => {
      if (e.pointerType === 'touch') return;
      if (!rectRef.current) rectRef.current = el.getBoundingClientRect();
      const r = rectRef.current;
      px = ((e.clientX - r.left) / r.width) * 2 - 1;
      py = ((e.clientY - r.top) / r.height) * 2 - 1;
      if (!raf) raf = requestAnimationFrame(write);
    };

    const leave = () => {
      rectRef.current = null;
      px = 0;
      py = 0;
      if (!raf) raf = requestAnimationFrame(write);
    };

    el.addEventListener('pointerenter', enter);
    el.addEventListener('pointermove', move, { passive: true });
    el.addEventListener('pointerleave', leave);
    return () => {
      el.removeEventListener('pointerenter', enter);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  React.useEffect(() => {
    filesRef.current?.toggleAttribute('inert', !open);
  }, [open]);

  React.useEffect(() => {
    if (!open && !menuOpen) return;
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      if (menuOpen) {
        setMenuOpen(false);
        keyRef.current?.focus();
      } else {
        setOpen(false);
        hitRef.current?.focus();
      }
    };
    const onDown = (e) => {
      const t = e.target;
      if (menuOpen && !menuRef.current?.contains(t) && !keyRef.current?.contains(t)) setMenuOpen(false);
      if (open && !menuOpen && !rootRef.current?.contains(t)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onDown);
    };
  }, [open, menuOpen, setOpen]);

  const addFile = () => {
    const made = onAdd?.(files);
    const file = made || { name: 'Untitled ' + (files.length + 1), meta: 'Just now' };
    const next = [...files, file];
    const id = nextId.current++;
    ids.current = [...ids.current, id];
    setFiles(next);
    setDropped(id);
    setBump((b) => b + 1);
    onFilesChange?.(next);
  };

  const onMenuKey = (e) => {
    const items = Array.from(menuRef.current?.querySelectorAll('[role=menuitem]') ?? []);
    const at = items.indexOf(document.activeElement);
    const go = (i) => {
      e.preventDefault();
      items[(i + items.length) % items.length]?.focus();
    };
    if (e.key === 'ArrowDown') go(at + 1);
    else if (e.key === 'ArrowUp') go(at - 1);
    else if (e.key === 'Home') go(0);
    else if (e.key === 'End') go(items.length - 1);
    else if (e.key === 'Tab') setMenuOpen(false);
  };

  const start = Math.max(0, files.length - MAX_VISIBLE);
  const visible = files.slice(start);
  const count = files.length;
  const metaLine = meta ?? count + (count === 1 ? ' item' : ' items');

  return (
    <div
      ref={rootRef}
      className={'gf-root' + (className ? ' ' + className : '')}
      data-tone={tone}
      data-open={open || undefined}
      data-place={labelPlacement}
      style={{ width, height: (H + HEADROOM) * k, ...style }}
    >
      <style>{GF_CSS}</style>
      <div className="gf-stage" style={{ transform: 'translateY(' + HEADROOM * k + 'px) scale(' + k + ')' }}>
        <div className="gf-tilt">
          <div className="gf-shadow" aria-hidden="true" />

          {/* Back Plate — SVG Solid Geometry to prevent GPU clip-path vanishing */}
          <div className="gf-back" aria-hidden="true">
            <svg viewBox={`0 0 ${W} ${H}`} className="gf-svg-layer">
              <defs>
                <linearGradient id={'gf-back-grad-' + uid} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#1a1c23" />
                  <stop offset="100%" stopColor="#0c0d11" />
                </linearGradient>
              </defs>
              <path d={BACK_PATH} fill={`url(#gf-back-grad-${uid})`} />
            </svg>
            {image ? (
              <img className="gf-art" src={image} alt="" width={W + 24} height={H + 24} draggable={false} />
            ) : null}
            <div className="gf-back-sheen" />
            <svg className="gf-rim gf-back-rim" viewBox={'0 0 ' + W + ' ' + H} aria-hidden="true">
              <path d={BACK_PATH} />
            </svg>
          </div>

          {/* The Content Sheets — Fanned Interior Files */}
          <div ref={filesRef} className="gf-files" role="list" aria-label={label + ' contents'}>
            {visible.map((file, v) => {
              const id = ids.current[start + v] ?? v;
              const slot = fanSlot(v, visible.length);
              const jitter = rng(hashString(file.name) + id);
              const artPreset = file.art ? ART_PRESETS[file.art] || ART_PRESETS.aurora : null;

              const inner = (
                <>
                  {file.image ? (
                    <img className="gf-sheet-art" src={file.image} alt="" width={SHEET_W} height={SHEET_H} draggable={false} />
                  ) : artPreset ? (
                    <div
                      className="gf-sheet-art"
                      style={{
                        background: artPreset,
                        opacity: 0.9,
                      }}
                    />
                  ) : (
                    <span className="gf-lines" aria-hidden="true">
                      <i style={{ width: '86%' }} />
                      <i style={{ width: '92%' }} />
                      <i style={{ width: '64%' }} />
                      <i style={{ width: '88%' }} />
                      <i style={{ width: '42%' }} />
                    </span>
                  )}
                  <span className="gf-sheet-head">
                    <span className="gf-sheet-name">{file.name}</span>
                    {file.meta ? <span className="gf-sheet-meta">{file.meta}</span> : null}
                  </span>
                </>
              );

              const common = {
                className: 'gf-sheet' + (id === dropped ? ' gf-sheet--drop' : ''),
                style: {
                  '--gf-slot': slot,
                  '--gf-depth': visible.length - 1 - v,
                  '--gf-jx': ((jitter() - 0.5) * 8).toFixed(2) + 'px',
                  '--gf-jr': ((jitter() - 0.5) * 2.8).toFixed(2) + 'deg',
                  zIndex: v + 1,
                },
                onAnimationEnd: id === dropped ? () => setDropped(null) : undefined,
              };

              return (
                <div key={id} role="listitem" className="gf-sheet-slot">
                  {file.href ? (
                    <a {...common} href={file.href} onClick={() => onFileSelect?.(file, start + v)}>
                      {inner}
                    </a>
                  ) : (
                    <button {...common} type="button" onClick={() => onFileSelect?.(file, start + v)}>
                      {inner}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Frosted Front Pocket — Uses SVG Path Layering (Eliminates Vanishing Glitch) */}
          <div
            key={bump}
            className={'gf-front' + (bump ? ' gf-front--bump' : '')}
          >
            {/* SVG Base Plate with Frosted Gradient */}
            <svg viewBox={`0 0 ${W} ${FRONT_H}`} className="gf-svg-layer">
              <defs>
                <linearGradient id={'gf-front-grad-' + uid} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1e2029" stopOpacity="0.94" />
                  <stop offset="100%" stopColor="#101116" stopOpacity="0.96" />
                </linearGradient>
                <linearGradient id={'gf-rim-' + uid} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fff" stopOpacity="0.65" />
                  <stop offset="30%" stopColor="#fff" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#fff" stopOpacity="0.08" />
                </linearGradient>
              </defs>
              <path d={FRONT_PATH} fill={`url(#gf-front-grad-${uid})`} />
              <path d={FRONT_PATH} fill="none" stroke={`url(#gf-rim-${uid})`} strokeWidth="1.5" />
            </svg>

            <div className="gf-tint" aria-hidden="true" />
            <div className="gf-spec" aria-hidden="true" />

            <button
              ref={hitRef}
              type="button"
              className="gf-hit"
              aria-expanded={open}
              aria-label={(open ? 'Close ' : 'Open ') + label + ', ' + count + (count === 1 ? ' item' : ' items')}
              onClick={() => {
                setMenuOpen(false);
                setOpen(!open);
              }}
            />

            <div className="gf-label">
              <span className="gf-title">{label}</span>
              <span className="gf-meta" key={metaLine}>
                {metaLine}
              </span>
            </div>
          </div>

          {action !== 'none' ? (
            <button
              ref={keyRef}
              type="button"
              className={'gf-key gf-key--' + action}
              aria-label={action === 'add' ? 'Add a file to ' + label : 'More options for ' + label}
              aria-haspopup={action === 'more' ? 'menu' : undefined}
              aria-expanded={action === 'more' ? menuOpen : undefined}
              aria-controls={action === 'more' ? 'gf-menu-' + uid : undefined}
              onClick={() => (action === 'add' ? addFile() : setMenuOpen((m) => !m))}
            >
              {action === 'add' ? (
                <svg key={bump} className="gf-glyph gf-glyph--plus" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 4.5v15M4.5 12h15" />
                </svg>
              ) : (
                <svg className="gf-glyph gf-glyph--more" viewBox="0 0 30 12" aria-hidden="true">
                  <rect x="1" y="1.5" width="8" height="9" rx="3.4" />
                  <rect x="11" y="1.5" width="8" height="9" rx="3.4" />
                  <rect x="21" y="1.5" width="8" height="9" rx="3.4" />
                </svg>
              )}
            </button>
          ) : null}

          {action === 'more' ? (
            <div
              ref={menuRef}
              id={'gf-menu-' + uid}
              role="menu"
              aria-label={label + ' options'}
              className="gf-menu"
              data-open={menuOpen || undefined}
              onKeyDown={onMenuKey}
            >
              {menu.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  role="menuitem"
                  className="gf-menu-item"
                  onClick={() => {
                    setMenuOpen(false);
                    item.onSelect?.();
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

const GF_CSS = `
.gf-root {
  --gf-ease: cubic-bezier(.16, 1, .3, 1);
  --gf-spring: cubic-bezier(.16, 1.25, .3, 1);
  --gf-bounce: cubic-bezier(.34, 1.56, .64, 1);
  position: relative;
  display: inline-block;
  box-sizing: border-box;
  user-select: none;
  -webkit-user-select: none;
  perspective: 1200px;
}
.gf-root *, .gf-root *::before, .gf-root *::after { box-sizing: border-box; }
.gf-stage { position: relative; width: 340px; height: 272px; transform-origin: 0 0; }

.gf-tilt {
  position: absolute;
  inset: 0;
  transform-style: preserve-3d;
  transform: rotateX(calc(var(--gf-py, 0) * -3.5deg)) rotateY(calc(var(--gf-px, 0) * 4.5deg));
  transition: transform .22s cubic-bezier(0.2, 0.8, 0.2, 1);
  will-change: transform;
}

.gf-shadow {
  position: absolute;
  left: 14px;
  right: 14px;
  bottom: -18px;
  height: 48px;
  border-radius: 50%;
  background: radial-gradient(ellipse at center, rgba(0, 0, 0, .5) 0%, rgba(0, 0, 0, .18) 48%, transparent 72%);
  filter: blur(12px);
  pointer-events: none;
}

.gf-svg-layer {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.gf-back {
  position: absolute;
  inset: 0;
  overflow: hidden;
  border-radius: 22px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.4);
}

.gf-art {
  position: absolute;
  inset: -12px;
  width: calc(100% + 24px);
  height: calc(100% + 24px);
  object-fit: cover;
  pointer-events: none;
  opacity: 0.95;
}

.gf-back-sheen {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, .12) 0%, transparent 45%);
  pointer-events: none;
}

.gf-rim {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  fill: none;
  pointer-events: none;
}
.gf-back-rim { stroke: rgba(255, 255, 255, .12); stroke-width: 1.5; }

.gf-front {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 198px;
  z-index: 10;
  transform-origin: 50% 100%;
  transform-style: preserve-3d;
  transition: transform .5s var(--gf-spring);
  will-change: transform;
  filter: drop-shadow(0 -4px 12px rgba(0,0,0,0.45));
}

.gf-root:hover .gf-front { transform: rotateX(-10deg); }
.gf-root[data-open] .gf-front { transform: rotateX(-30deg); }

.gf-front--bump { animation: gf-bump .45s var(--gf-bounce); }
@keyframes gf-bump {
  0% { transform: rotateX(0deg); }
  35% { transform: rotateX(-15deg); }
  100% { transform: rotateX(0deg); }
}

.gf-tint {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at calc(50% + var(--gf-px, 0) * 35%) calc(40% + var(--gf-py, 0) * 35%), rgba(255, 255, 255, .06), transparent 70%);
  pointer-events: none;
}
.gf-spec {
  position: absolute;
  inset: 0;
  background: linear-gradient(105deg, transparent 40%, rgba(255, 255, 255, .05) 50%, transparent 60%);
  pointer-events: none;
}

.gf-hit {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
  z-index: 5;
  -webkit-tap-highlight-color: transparent;
}

.gf-label {
  position: absolute;
  left: 20px;
  bottom: 18px;
  z-index: 6;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.gf-title {
  font-family: inherit;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: #fff;
  text-shadow: 0 1px 4px rgba(0, 0, 0, .6);
}
.gf-meta {
  font-family: monospace;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #ffb224;
}

.gf-files {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.gf-sheet-slot {
  position: absolute;
  left: 34px;
  bottom: 24px;
  width: 272px;
  height: 184px;
}
.gf-sheet {
  position: absolute;
  inset: 0;
  padding: 12px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, .15);
  background: #1c1d22;
  box-shadow: 0 8px 24px rgba(0, 0, 0, .5);
  transform-origin: 50% 100%;
  transform: translateY(calc(var(--gf-depth) * -6px + var(--gf-jx, 0px))) rotate(var(--gf-jr, 0deg));
  transition: transform .5s var(--gf-spring), filter .2s, border-color .2s;
  text-align: left;
  cursor: pointer;
  pointer-events: auto;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  will-change: transform;
}

.gf-root:hover .gf-sheet {
  transform: translateY(calc(var(--gf-depth) * -14px + var(--gf-jx, 0px))) rotate(var(--gf-jr, 0deg));
}
.gf-root[data-open] .gf-sheet {
  transform: translateY(calc(-75px - var(--gf-depth) * 8px)) translateX(calc(var(--gf-slot) * 48px)) rotate(calc(var(--gf-slot) * 8deg));
}
.gf-sheet:hover {
  filter: brightness(1.12);
  border-color: rgba(255, 178, 36, .7) !important;
  box-shadow: 0 12px 32px rgba(255, 178, 36, .18);
}

.gf-sheet-art {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity .25s ease;
}

.gf-lines {
  display: flex;
  flex-direction: column;
  gap: 7px;
  margin-top: 36px;
  opacity: 0.25;
}
.gf-lines i {
  display: block;
  height: 4px;
  border-radius: 2px;
  background: currentColor;
}

.gf-sheet-head {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 3px;
  background: linear-gradient(180deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.45) 70%, transparent 100%);
  padding: 8px 10px;
  margin: -12px -12px auto -12px;
  border-radius: 14px 14px 0 0;
}
.gf-sheet-name {
  font-family: inherit;
  font-size: 13px;
  font-weight: 700;
  color: #fff;
  line-height: 1.3;
}
.gf-sheet-meta {
  font-family: monospace;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #ffb224;
}

.gf-key {
  position: absolute;
  right: 18px;
  bottom: 18px;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, .15);
  background: rgba(30, 31, 38, .88);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  color: #e5e5e8;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 12;
  transition: transform .25s var(--gf-spring), background .2s, border-color .2s;
}
.gf-key:hover {
  transform: scale(1.08);
  border-color: rgba(255, 178, 36, .6);
  color: #ffb224;
}
.gf-glyph { stroke: currentColor; fill: currentColor; }

.gf-menu {
  position: absolute;
  right: 18px;
  bottom: 70px;
  min-width: 190px;
  padding: 6px;
  border-radius: 12px;
  background: rgba(22, 23, 28, .96);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, .14);
  box-shadow: 0 16px 36px rgba(0, 0, 0, .6);
  z-index: 25;
  display: flex;
  flex-direction: column;
  gap: 2px;
  opacity: 0;
  pointer-events: none;
  transform: translateY(8px) scale(0.95);
  transition: opacity .2s ease, transform .25s var(--gf-spring);
}
.gf-menu[data-open] {
  opacity: 1;
  pointer-events: auto;
  transform: translateY(0) scale(1);
}
.gf-menu-item {
  padding: 8px 12px;
  border-radius: 8px;
  border: 0;
  background: transparent;
  color: #e5e5e8;
  font-family: inherit;
  font-size: 12.5px;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  transition: background .15s, color .15s;
}
.gf-menu-item:hover, .gf-menu-item:focus-visible {
  background: rgba(255, 255, 255, .08);
  color: #ffb224;
}

@media (prefers-reduced-motion: reduce) {
  .gf-root *, .gf-root *::before, .gf-root *::after {
    transition-duration: 0s !important;
    animation: none !important;
  }
}
`;
