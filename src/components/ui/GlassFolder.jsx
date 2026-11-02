import React from 'react';

/**
 * Glass Folder Cards — interactive 3D frosted-glass folder.
 * Adapted from src/project-section.txt for clean React 18+ JSX.
 */

export const ART_PRESETS = {
  aurora: {
    style: 'streak',
    colors: ['#f4efe9', '#e9c2b8', '#c2433f', '#2a1e2a', '#22395e', '#6f97c2', '#e5edf4'],
    scale: 0.7,
    warp: 1.4,
    angle: -0.62,
    gloss: 0.18,
    veins: 0,
  },
  ember: {
    style: 'marble',
    colors: ['#07090c', '#16252c', '#3d5f68', '#1a1416', '#a3201a', '#ef4a2b', '#ff8a5c'],
    scale: 0.62,
    warp: 3.2,
    angle: -0.5,
    gloss: 0.55,
    veins: 0.6,
  },
  dusk: {
    style: 'marble',
    colors: ['#120c18', '#3e2850', '#8f6c9c', '#2b1a24', '#b3502f', '#eab08a', '#fbe7d2'],
    scale: 0.75,
    warp: 3.6,
    angle: 0.8,
    gloss: 0.5,
    veins: 0.5,
  },
  glacier: {
    style: 'streak',
    colors: ['#f7f8fa', '#d9e2ea', '#9fb4c7', '#e8edf2', '#bccbd8', '#ffffff'],
    scale: 0.7,
    warp: 1.6,
    angle: 0.35,
    gloss: 0.25,
    veins: 0,
  },
  verdant: {
    style: 'marble',
    colors: ['#070b08', '#173024', '#4f7a5a', '#141812', '#a7843a', '#e9cf87', '#fbf3d6'],
    scale: 0.7,
    warp: 3.4,
    angle: 2.1,
    gloss: 0.5,
    veins: 0.5,
  },
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

function makeFbm(seed) {
  const r = rng(seed);
  const perm = new Uint8Array(512);
  const grad = new Float32Array(512);
  const p = [];
  for (let i = 0; i < 256; i++) p.push(i);
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    const t = p[i];
    p[i] = p[j];
    p[j] = t;
  }
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
  for (let i = 0; i < 256; i++) {
    const a = r() * Math.PI * 2;
    grad[i * 2] = Math.cos(a);
    grad[i * 2 + 1] = Math.sin(a);
  }
  const noise = (x, y) => {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const xf = x - xi;
    const yf = y - yi;
    const X = xi & 255;
    const Y = yi & 255;
    const h00 = perm[X + perm[Y]] * 2;
    const h10 = perm[X + 1 + perm[Y]] * 2;
    const h01 = perm[X + perm[Y + 1]] * 2;
    const h11 = perm[X + 1 + perm[Y + 1]] * 2;
    const d00 = grad[h00] * xf + grad[h00 + 1] * yf;
    const d10 = grad[h10] * (xf - 1) + grad[h10 + 1] * yf;
    const d01 = grad[h01] * xf + grad[h01 + 1] * (yf - 1);
    const d11 = grad[h11] * (xf - 1) + grad[h11 + 1] * (yf - 1);
    const u = xf * xf * xf * (xf * (xf * 6 - 15) + 10);
    const v = yf * yf * yf * (yf * (yf * 6 - 15) + 10);
    return d00 + u * (d10 - d00) + v * (d01 - d00 + u * (d11 - d01 - d10 + d00));
  };
  return (x, y, octaves) => {
    let sum = 0;
    let amp = 0.5;
    for (let i = 0; i < octaves; i++) {
      sum += amp * noise(x, y);
      const nx = 1.6 * x + 1.2 * y + 7.1;
      y = -1.2 * x + 1.6 * y + 3.3;
      x = nx;
      amp *= 0.5;
    }
    return sum;
  };
}

export function createArtJob(width, height, recipe, seed) {
  const w = Math.max(1, Math.round(width));
  const h = Math.max(1, Math.round(height));
  const colors = recipe.colors && recipe.colors.length >= 2 ? recipe.colors : ['#111111', '#eeeeee'];
  const stops = colors.map((c, i) => ({ t: i / (colors.length - 1), c: hexToRgb(c) }));
  const scale = recipe.scale ?? 0.7;
  const warp = recipe.warp ?? 3;
  const gloss = recipe.gloss ?? 0.4;
  const veins = recipe.veins ?? 0;
  const streak = recipe.style === 'streak';
  const fbm = makeFbm(seed * 977 + 13);
  const r = rng(seed + 1);
  const ox = r() * 50;
  const oy = r() * 50;
  const angle = (recipe.angle ?? 0) + (r() - 0.5) * 0.5;
  const ca = Math.cos(angle);
  const sa = Math.sin(angle);
  const m = Math.min(w, h);

  const gw = Math.ceil(w / 2) + 3;
  const gh = Math.ceil(h / 2) + 3;
  const G = new Float32Array(gw * gh);
  const GQ = new Float32Array(gw * gh);
  const F = new Float32Array(w * h);
  const Q = new Float32Array(w * h);
  const pixels = new Uint8ClampedArray(w * h * 4);
  let row = 0;

  const field = (gy) => {
    for (let gx = 0; gx < gw; gx++) {
      const u = ((gx - 1) * 2 - w / 2) / m;
      const v = ((gy - 1) * 2 - h / 2) / m;
      let px = (u * ca - v * sa) * scale;
      let py = (u * sa + v * ca) * scale;
      if (streak) {
        px *= 0.14;
        py *= 2.2;
      }
      px += ox;
      py += oy;
      const qx = fbm(px, py, 3);
      const qy = fbm(px + 5.2, py + 1.3, 3);
      const rx = fbm(px + warp * qx + 1.7, py + warp * qy + 9.2, 3);
      const ry = fbm(px + warp * qx + 8.3, py + warp * qy + 2.8, 3);
      G[gy * gw + gx] = fbm(px + warp * rx, py + warp * ry, 4);
      GQ[gy * gw + gx] = Math.sqrt(qx * qx + qy * qy);
    }
  };

  const upsample = () => {
    const cr = (a, b, c, d) => (-a + 9 * b + 9 * c - d) / 16;
    const T = new Float32Array(w * gh);
    for (let gy = 0; gy < gh; gy++) {
      const r = gy * gw;
      for (let x = 0; x < w; x++) {
        const c = (x >> 1) + 1;
        T[gy * w + x] = x & 1 ? cr(G[r + c - 1], G[r + c], G[r + c + 1], G[r + c + 2]) : G[r + c];
      }
    }
    for (let y = 0; y < h; y++) {
      const c = (y >> 1) + 1;
      for (let x = 0; x < w; x++) {
        F[y * w + x] =
          y & 1 ? cr(T[(c - 1) * w + x], T[c * w + x], T[(c + 1) * w + x], T[(c + 2) * w + x]) : T[c * w + x];
        const gx = (x >> 1) + 1;
        const q0 = GQ[c * gw + gx];
        const qx = x & 1 ? (q0 + GQ[c * gw + gx + 1]) / 2 : q0;
        const q1 = y & 1 ? (x & 1 ? (GQ[(c + 1) * gw + gx] + GQ[(c + 1) * gw + gx + 1]) / 2 : GQ[(c + 1) * gw + gx]) : qx;
        Q[y * w + x] = (qx + q1) / 2;
      }
    }
  };

  const colorize = () => {
    const sample = [];
    const stride = Math.max(1, Math.floor(F.length / 4096));
    for (let i = 0; i < F.length; i += stride) sample.push(F[i]);
    sample.sort((a, b) => a - b);
    const lo = sample[Math.floor(sample.length * 0.02)] ?? 0;
    const hi = sample[Math.floor(sample.length * 0.98)] ?? 1;
    const k = 1 / (hi - lo || 1);
    const lx = -0.55;
    const ly = -0.65;
    const lz = 0.52;
    const slope = k * m * 0.012;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = y * w + x;
        let t = (F[i] - lo) * k;
        t = t < 0 ? 0 : t > 1 ? 1 : t;
        let j = 1;
        while (j < stops.length - 1 && stops[j].t < t) j++;
        const a = stops[j - 1];
        const b = stops[j];
        let f = (t - a.t) / (b.t - a.t || 1);
        f = f < 0 ? 0 : f > 1 ? 1 : f;
        f = f * f * (3 - 2 * f);
        const gx = (F[x < w - 1 ? i + 1 : i] - F[x > 0 ? i - 1 : i]) * slope;
        const gy = (F[y < h - 1 ? i + w : i] - F[y > 0 ? i - w : i]) * slope;
        const nd = (-gx * lx - gy * ly + lz) / Math.sqrt(gx * gx + gy * gy + 1);
        const spec = Math.pow(nd > 0 ? nd : 0, 24) * gloss * 255;
        const silk = 1 + 0.035 * Math.sin(t * 150 + Q[i] * 24);
        const vein = veins * Math.max(0, 1 - Math.abs(Q[i] - 0.42) * 14) * 0.6;
        const lit = (0.82 + 0.28 * nd) * silk * (1 - vein);
        pixels[i * 4] = (a.c[0] + (b.c[0] - a.c[0]) * f) * lit + spec;
        pixels[i * 4 + 1] = (a.c[1] + (b.c[1] - a.c[1]) * f) * lit + spec;
        pixels[i * 4 + 2] = (a.c[2] + (b.c[2] - a.c[2]) * f) * lit + spec;
        pixels[i * 4 + 3] = 255;
      }
    }
  };

  const step = (rows) => {
    if (row >= gh) return true;
    const end = Math.min(gh, row + Math.max(1, rows));
    while (row < end) field(row++);
    if (row < gh) return false;
    upsample();
    colorize();
    return true;
  };

  return { width: w, height: h, pixels, step };
}

export function fanSlot(index, count) {
  return count <= 1 ? 0 : (index / (count - 1)) * 2 - 1;
}

const recipeOf = (art) => (typeof art === 'string' ? ART_PRESETS[art] || ART_PRESETS.aurora : art);

const artCache = new Map();
const queue = [];
let pumping = false;

function pump() {
  if (pumping) return;
  pumping = true;
  const tick = () => {
    const until = performance.now() + 7;
    while (queue.length && performance.now() < until) {
      const head = queue[0];
      if (head.job.step(4)) {
        queue.shift();
        const c = document.createElement('canvas');
        c.width = head.job.width;
        c.height = head.job.height;
        c.getContext('2d')?.putImageData(new ImageData(head.job.pixels, c.width, c.height), 0, 0);
        head.done(c);
      }
    }
    if (queue.length) requestAnimationFrame(tick);
    else pumping = false;
  };
  requestAnimationFrame(tick);
}

function paint(recipe, seed, w, h, priority) {
  const key = JSON.stringify([recipe, seed, w, h]);
  let p = artCache.get(key);
  if (!p) {
    p = new Promise((done) => {
      let at = queue.length;
      while (at > 1 && queue[at - 1].priority > priority) at--;
      queue.splice(at, 0, { job: createArtJob(w, h, recipe, seed), priority, done });
      pump();
    });
    artCache.set(key, p);
  }
  return p;
}

function ArtCanvas({ art, seed, w, h, density, priority, className }) {
  const ref = React.useRef(null);
  const [ready, setReady] = React.useState(false);
  const recipe = recipeOf(art);
  const key = JSON.stringify(recipe);
  const pw = Math.max(1, Math.round(w * density));
  const ph = Math.max(1, Math.round(h * density));

  React.useEffect(() => {
    let live = true;
    setReady(false);
    paint(JSON.parse(key), seed, pw, ph, priority).then((src) => {
      const c = ref.current;
      if (!live || !c) return;
      c.width = src.width;
      c.height = src.height;
      c.getContext('2d')?.drawImage(src, 0, 0);
      setReady(true);
    });
    return () => {
      live = false;
    };
  }, [key, seed, pw, ph, priority]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={className}
      data-ready={ready || undefined}
      style={{ width: w, height: h, maxWidth: 'none' }}
    />
  );
}

const W = 340;
const H = 272;
const HEADROOM = 54;
const FRONT_TOP = 74;
const FRONT_H = H - FRONT_TOP;
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
  seed = 3,
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
  appear = true,
  appearDelay = 0,
  className,
  style,
}) {
  const uid = React.useId().replace(/:/g, '');
  const rootRef = React.useRef(null);
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
  const [entered, setEntered] = React.useState(!appear);

  const k = width / W;
  const density = Math.min(1.5, Math.max(1, typeof window === 'undefined' ? 1 : window.devicePixelRatio || 1)) * k;

  React.useEffect(() => {
    if (!appear) return;
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setEntered(true);
      return;
    }
    let t = 0;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        t = window.setTimeout(() => setEntered(true), appearDelay);
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(t);
    };
  }, [appear, appearDelay]);

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
    const move = (e) => {
      if (e.pointerType === 'touch') return;
      const r = el.getBoundingClientRect();
      px = ((e.clientX - r.left) / r.width) * 2 - 1;
      py = ((e.clientY - r.top) / r.height) * 2 - 1;
      if (!raf) raf = requestAnimationFrame(write);
    };
    const leave = () => {
      px = 0;
      py = 0;
      if (!raf) raf = requestAnimationFrame(write);
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
      cancelAnimationFrame(raf);
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

  React.useEffect(() => {
    if (menuOpen) menuRef.current?.querySelector('[role=menuitem]')?.focus();
  }, [menuOpen]);

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

  const menuItems = [
    { label: open ? 'Close folder' : 'Open folder', onSelect: () => setOpen(!open) },
    ...menu,
  ];

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
      data-entered={entered || undefined}
      data-place={labelPlacement}
      style={{ width, height: (H + HEADROOM) * k, ...style }}
    >
      <style>{GF_CSS}</style>
      <div className="gf-stage" style={{ transform: 'translateY(' + HEADROOM * k + 'px) scale(' + k + ')' }}>
        <div className="gf-tilt">
          <div className="gf-shadow" aria-hidden="true" />

          {/* back panel and its artwork */}
          <div className="gf-back" style={{ clipPath: "path('" + BACK_PATH + "')" }} aria-hidden="true">
            {image ? (
              <img className="gf-art" src={image} alt="" width={W + 24} height={H + 24} draggable={false} />
            ) : art !== 'none' ? (
              <ArtCanvas className="gf-art" art={art} seed={seed} w={W + 24} h={H + 24} density={density} priority={0} />
            ) : null}
            <div className="gf-back-sheen" />
          </div>
          <svg className="gf-rim gf-back-rim" viewBox={'0 0 ' + W + ' ' + H} aria-hidden="true">
            <path d={BACK_PATH} />
          </svg>

          {/* the frosted front panel, hinged on its bottom edge */}
          <div
            key={bump}
            className={'gf-front' + (bump ? ' gf-front--bump' : '')}
            style={{ clipPath: "path('" + FRONT_PATH + "')" }}
          >
            <div className="gf-tint" aria-hidden="true" />
            <div className="gf-spec" aria-hidden="true" />
            <svg className="gf-rim gf-front-rim" viewBox={'0 0 ' + W + ' ' + FRONT_H} aria-hidden="true">
              <defs>
                <linearGradient id={'gf-rim-' + uid} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#fff" stopOpacity="0.95" />
                  <stop offset="0.35" stopColor="#fff" stopOpacity="0.35" />
                  <stop offset="1" stopColor="#fff" stopOpacity="0.12" />
                </linearGradient>
              </defs>
              <path d={FRONT_PATH} stroke={'url(#gf-rim-' + uid + ')'} />
            </svg>
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

          {/* the contents */}
          <div ref={filesRef} className="gf-files" role="list" aria-label={label + ' contents'}>
            {visible.map((file, v) => {
              const id = ids.current[start + v] ?? v;
              const slot = fanSlot(v, visible.length);
              const jitter = rng(hashString(file.name) + id);
              const picture = !!(file.art || file.image);
              const inner = (
                <>
                  {picture ? (
                    file.image ? (
                      <img className="gf-sheet-art" src={file.image} alt="" width={SHEET_W} height={SHEET_H} draggable={false} />
                    ) : (
                      <ArtCanvas
                        className="gf-sheet-art"
                        art={file.art}
                        seed={hashString(file.name) % 997}
                        w={SHEET_W}
                        h={SHEET_H}
                        density={Math.min(density, 1.25)}
                        priority={1}
                      />
                    )
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
                className: 'gf-sheet' + (picture ? ' gf-sheet--art' : '') + (id === dropped ? ' gf-sheet--drop' : ''),
                style: {
                  '--gf-slot': slot,
                  '--gf-depth': visible.length - 1 - v,
                  '--gf-jx': ((jitter() - 0.5) * 10).toFixed(2) + 'px',
                  '--gf-jr': ((jitter() - 0.5) * 3.2).toFixed(2) + 'deg',
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
              {menuItems.map((item, i) => (
                <button
                  key={item.label + i}
                  type="button"
                  role="menuitem"
                  tabIndex={menuOpen ? -1 : undefined}
                  disabled={!menuOpen}
                  className={'gf-menu-item' + (item.danger ? ' gf-menu-item--danger' : '')}
                  onClick={() => {
                    setMenuOpen(false);
                    keyRef.current?.focus();
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
  --gf-ease: cubic-bezier(.22, 1, .36, 1);
  --gf-spring: cubic-bezier(.16, 1.3, .3, 1);
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
  transform: rotateX(calc(var(--gf-py, 0) * -4.5deg)) rotateY(calc(var(--gf-px, 0) * 5.5deg));
  transition: transform .25s ease-out;
}
.gf-shadow {
  position: absolute;
  left: 14px;
  right: 14px;
  bottom: -18px;
  height: 48px;
  border-radius: 50%;
  background: radial-gradient(ellipse at center, rgba(0, 0, 0, .42) 0%, rgba(0, 0, 0, .14) 48%, transparent 72%);
  filter: blur(10px);
  pointer-events: none;
}
.gf-back {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background: #15161b;
}
.gf-root[data-tone="light"] .gf-back { background: #e8e8ed; }
.gf-art {
  position: absolute;
  inset: -12px;
  width: calc(100% + 24px);
  height: calc(100% + 24px);
  object-fit: cover;
  pointer-events: none;
  opacity: 0;
  transition: opacity .5s ease;
}
.gf-art[data-ready] { opacity: 1; }
.gf-back-sheen {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, .14) 0%, transparent 40%);
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
.gf-root[data-tone="light"] .gf-back-rim { stroke: rgba(0, 0, 0, .08); }

.gf-front {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 198px;
  z-index: 10;
  overflow: hidden;
  transform-origin: 50% 100%;
  transform-style: preserve-3d;
  background: rgba(18, 19, 23, 0.72);
  -webkit-backdrop-filter: blur(20px) saturate(1.4);
  backdrop-filter: blur(20px) saturate(1.4);
  transition: transform .6s var(--gf-spring);
}
.gf-root[data-tone="light"] .gf-front {
  background: rgba(245, 245, 248, 0.75);
}
.gf-root:hover .gf-front { transform: rotateX(-12deg); }
.gf-root[data-open] .gf-front { transform: rotateX(-32deg); }

.gf-front--bump { animation: gf-bump .45s var(--gf-bounce); }
@keyframes gf-bump {
  0% { transform: rotateX(0deg); }
  35% { transform: rotateX(-16deg); }
  100% { transform: rotateX(0deg); }
}

.gf-tint {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at calc(50% + var(--gf-px, 0) * 35%) calc(40% + var(--gf-py, 0) * 35%), rgba(255, 255, 255, .08), transparent 70%);
  pointer-events: none;
}
.gf-spec {
  position: absolute;
  inset: 0;
  background: linear-gradient(105deg, transparent 40%, rgba(255, 255, 255, .05) 50%, transparent 60%);
  pointer-events: none;
}
.gf-front-rim {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  stroke-width: 1.5;
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
  z-index: 2;
}

.gf-label {
  position: absolute;
  left: 20px;
  bottom: 18px;
  z-index: 3;
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
  text-shadow: 0 1px 4px rgba(0, 0, 0, .4);
}
.gf-root[data-tone="light"] .gf-title { color: #111; text-shadow: none; }
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
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, .15);
  background: #1c1d22;
  box-shadow: 0 8px 24px rgba(0, 0, 0, .45);
  transform-origin: 50% 100%;
  transform: translateY(calc(var(--gf-depth) * -6px + var(--gf-jx, 0px))) rotate(var(--gf-jr, 0deg));
  transition: transform .55s var(--gf-spring);
  text-align: left;
  cursor: pointer;
  pointer-events: auto;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
}
.gf-root[data-tone="light"] .gf-sheet { background: #fdfdfd; border-color: rgba(0, 0, 0, .1); }
.gf-root:hover .gf-sheet {
  transform: translateY(calc(var(--gf-depth) * -14px + var(--gf-jx, 0px))) rotate(var(--gf-jr, 0deg));
}
.gf-root[data-open] .gf-sheet {
  transform: translateY(calc(-75px - var(--gf-depth) * 8px)) translateX(calc(var(--gf-slot) * 48px)) rotate(calc(var(--gf-slot) * 8deg));
}
.gf-sheet:hover {
  filter: brightness(1.1);
  border-color: rgba(255, 178, 36, .6) !important;
}

.gf-sheet--art { background: #000; }
.gf-sheet-art {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.82;
  transition: opacity .3s ease;
}
.gf-sheet-art[data-ready] { opacity: 0.82; }
.gf-sheet:hover .gf-sheet-art { opacity: 0.95; }

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
  background: linear-gradient(180deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 70%, transparent 100%);
  padding: 8px 10px;
  margin: -12px -12px auto -12px;
  border-radius: 12px 12px 0 0;
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
  background: rgba(30, 31, 38, .85);
  -webkit-backdrop-filter: blur(16px);
  backdrop-filter: blur(16px);
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
  background: rgba(22, 23, 28, .94);
  -webkit-backdrop-filter: blur(20px);
  backdrop-filter: blur(20px);
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

.gf-root:not([data-entered]) .gf-back { translate: 0 20px; opacity: 0; }
.gf-root:not([data-entered]) .gf-front { translate: 0 35px; opacity: 0; }
.gf-back, .gf-front { transition: translate .8s var(--gf-ease), opacity .7s var(--gf-ease), transform .6s var(--gf-spring); }

@media (prefers-reduced-motion: reduce) {
  .gf-root *, .gf-root *::before, .gf-root *::after {
    transition-duration: 0s !important;
    animation: none !important;
  }
}
`;
