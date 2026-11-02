import React, { useState, useRef } from 'react';
import { cn } from '../../lib/utils';

/**
 * Bulletproof Glass Folder Component:
 * Rebuilt from the ground up for 120 FPS rock-solid performance.
 * Eliminates all Chromium 3D perspective culling, pointer chatter,
 * and vanishing glitches by using hardware-accelerated 2D transforms.
 */

// Beautiful, zero-CPU instant gradient presets
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

// SVG Path generators for pixel-perfect folder tabs
const W = 340;
const H = 270;
const FRONT_H = 195;

// Back plate with tab on the top-right
const BACK_PATH =
  'M0 48A20 20 0 0 1 20 28L140 28C162 28 165 0 190 0L320 0A20 20 0 0 1 340 20L340 250A20 20 0 0 1 320 270L20 270A20 20 0 0 1 0 250Z';

// Front pocket with tab on the top-left
const FRONT_PATH =
  'M0 20A20 20 0 0 1 20 0L125 0C150 0 152 30 178 30L320 30A20 20 0 0 1 340 50L340 ' +
  (FRONT_H - 20) +
  'A20 20 0 0 1 320 ' +
  FRONT_H +
  'L20 ' +
  FRONT_H +
  'A20 20 0 0 1 0 ' +
  (FRONT_H - 20) +
  'Z';

export function fanSlot(index, count) {
  return count <= 1 ? 0 : (index / (count - 1)) * 2 - 1;
}

export function GlassFolder({
  label = 'Folder',
  meta,
  accentColor = '#ff5722',
  files = [],
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  onFileSelect,
  width = 340,
  className = '',
}) {
  const uid = React.useId().replace(/:/g, '');
  const rootRef = useRef(null);

  const [openState, setOpenState] = useState(defaultOpen);
  const [hover, setHover] = useState(false);
  const [hoveredFileIndex, setHoveredFileIndex] = useState(null);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = (next) => {
    if (openProp === undefined) setOpenState(next);
    onOpenChange?.(next);
  };

  const isExpanded = open || hover;
  const count = files.length;
  const metaLine = meta ?? `${count} ${count === 1 ? 'dossier' : 'dossiers'}`;

  const scale = width / W;
  const ease = 'cubic-bezier(0.16, 1, 0.3, 1)';

  return (
    <div
      ref={rootRef}
      role="button"
      tabIndex={0}
      aria-expanded={open}
      aria-label={`${label}: ${metaLine}`}
      onClick={() => setOpen(!open)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setOpen(!open);
        }
      }}
      onPointerEnter={(e) => {
        if (e.pointerType === 'mouse') setHover(true);
      }}
      onPointerLeave={() => {
        setHover(false);
        setHoveredFileIndex(null);
      }}
      className={cn(
        'group relative isolate select-none outline-none cursor-pointer',
        className,
      )}
      style={{
        width,
        height: (H + 40) * scale,
        transform: isExpanded ? 'translateY(-6px)' : 'none',
        transition: `transform 0.4s ${ease}`,
      }}
    >
      {/* Dynamic Ambient Domain Glow */}
      <div
        className="pointer-events-none absolute left-[12%] right-[12%] top-12 -z-10 h-[190px] rounded-full blur-[32px] transition-opacity duration-500"
        style={{
          background: `radial-gradient(closest-side, ${accentColor}30, transparent)`,
          opacity: isExpanded ? 0.9 : 0.35,
        }}
      />

      <div
        className="relative origin-top-left"
        style={{
          width: W,
          height: H,
          transform: `scale(${scale})`,
        }}
      >
        {/* Back Plate Container */}
        <div className="absolute inset-0 overflow-hidden rounded-[22px]">
          <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full">
            <defs>
              <linearGradient id={`bg-grad-${uid}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#1a1c24" />
                <stop offset="100%" stopColor="#0d0e12" />
              </linearGradient>
              <linearGradient id={`bg-rim-${uid}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(255,255,255,0.2)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.04)" />
              </linearGradient>
            </defs>
            <path d={BACK_PATH} fill={`url(#bg-grad-${uid})`} />
            <path d={BACK_PATH} fill="none" stroke={`url(#bg-rim-${uid})`} strokeWidth="1.5" />
          </svg>
        </div>

        {/* Fanned Out Interior Architecture Dossier Files */}
        <div className="pointer-events-none absolute inset-0">
          {files.map((file, i) => {
            const slot = fanSlot(i, files.length);
            const isHovered = hoveredFileIndex === i;
            const artGradient = file.art ? ART_PRESETS[file.art] || ART_PRESETS.aurora : ART_PRESETS.ember;

            // Smooth parabolic fan physics
            const spreadX = isExpanded ? slot * 56 : slot * 12;
            const translateY = isExpanded ? -78 - (files.length - 1 - i) * 6 : -18 - (files.length - 1 - i) * 4;
            const rotation = isExpanded ? slot * 9 : slot * 2;

            return (
              <div
                key={file.name || i}
                className="absolute left-[34px] bottom-[26px] h-[178px] w-[272px] [backface-visibility:hidden]"
                style={{
                  zIndex: isHovered ? 25 : i + 2,
                  transform: `translate3d(${spreadX}px, ${translateY}px, 0) rotate(${rotation}deg)`,
                  transition: `transform 0.45s ${ease}`,
                }}
              >
                <div
                  role="button"
                  tabIndex={0}
                  className="pointer-events-auto relative flex h-full w-full flex-col justify-between overflow-hidden rounded-2xl border border-white/15 p-3.5 text-left shadow-2xl transition-all cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onFileSelect?.(file, i);
                  }}
                  onPointerEnter={(e) => {
                    if (e.pointerType === 'mouse') setHoveredFileIndex(i);
                  }}
                  onPointerLeave={() => setHoveredFileIndex(null)}
                  style={{
                    background: artGradient,
                    transform: isHovered ? 'translateY(-18px) scale(1.05)' : 'none',
                    borderColor: isHovered ? accentColor : 'rgba(255, 255, 255, 0.18)',
                    boxShadow: isHovered
                      ? `0 20px 40px -10px ${accentColor}40, 0 0 0 1px ${accentColor}`
                      : '0 12px 30px rgba(0, 0, 0, 0.55)',
                    transition: `transform 0.3s ${ease}, box-shadow 0.3s ease, border-color 0.3s ease`,
                  }}
                >
                  {/* Subtle glass reflection sheen */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/15 via-transparent to-black/60" />

                  {/* Header metadata */}
                  <div className="relative z-10 flex flex-col gap-1 rounded-xl bg-black/60 p-2.5 backdrop-blur-md border border-white/10">
                    <span className="font-geist text-xs font-bold leading-tight text-white drop-shadow-md line-clamp-1">
                      {file.name}
                    </span>
                    {file.meta && (
                      <span className="font-mono text-[10px] font-medium tracking-wide text-signal">
                        {file.meta}
                      </span>
                    )}
                  </div>

                  {/* Bottom inspection hint */}
                  <div className="relative z-10 flex items-center justify-between pt-2">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-white/70">
                      Tap to inspect
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-signal animate-pulse" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Frosted Front Pocket — Uses SVG Path (100% Reliable, Never Vanishes) */}
        <div
          className="absolute inset-x-0 bottom-0 overflow-hidden"
          style={{
            height: FRONT_H,
            transform: isExpanded ? 'translateY(10px)' : 'none',
            transition: `transform 0.45s ${ease}`,
            filter: 'drop-shadow(0 -6px 16px rgba(0,0,0,0.5))',
          }}
        >
          {/* Base SVG Layer with Specular Rim */}
          <svg viewBox={`0 0 ${W} ${FRONT_H}`} className="absolute inset-0 h-full w-full pointer-events-none">
            <defs>
              <linearGradient id={`front-bg-${uid}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22242e" stopOpacity="0.94" />
                <stop offset="40%" stopColor="#15161d" stopOpacity="0.96" />
                <stop offset="100%" stopColor="#0c0d10" stopOpacity="0.98" />
              </linearGradient>
              <linearGradient id={`front-rim-${uid}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.75" />
                <stop offset="30%" stopColor="#ffffff" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.08" />
              </linearGradient>
            </defs>
            <path d={FRONT_PATH} fill={`url(#front-bg-${uid})`} />
            <path d={FRONT_PATH} fill="none" stroke={`url(#front-rim-${uid})`} strokeWidth="1.5" />
          </svg>

          {/* Front Pocket Content */}
          <div className="relative flex h-full flex-col justify-between p-5 pt-10">
            <div>
              <h4 className="font-geist text-base font-extrabold tracking-tight text-white drop-shadow-md">
                {label}
              </h4>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-signal font-semibold">
                {metaLine}
              </p>
            </div>

            <div className="flex items-center justify-between border-t border-white/[0.08] pt-3">
              <span className="font-mono text-[10px] uppercase tracking-widest text-dim group-hover:text-ash transition-colors">
                {open ? 'Folder Active' : 'Click to Inspect'}
              </span>
              <span
                className="h-2 w-2 rounded-full transition-transform group-hover:scale-125"
                style={{ backgroundColor: accentColor }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GlassFolder;
