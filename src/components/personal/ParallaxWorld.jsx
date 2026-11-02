import React, { useMemo } from 'react';
import { WORLD_CONFIG } from './useGameController';

/**
 * 4-Tier High-Depth Parallax World Engine
 *
 * Implements:
 * - Dynamic Day-to-Night Skybox (Sunrise -> Daylight -> Twilight -> Starlit Night)
 * - 4 Independent Camera Depth Planes (0.12x, 0.38x, 1.0x, 1.38x)
 * - Procedural Mountains, Waypoint Shrines, and Foliage
 * - Floating Fireflies & Atmospheric Light Motes
 */

export const ZONES = [
  { id: 'hero', name: '01 / Sunrise Overlook', x: 200, range: [0, 900], tag: 'AWAKENING' },
  { id: 'summary', name: '02 / Trail Checkpoint', x: 1400, range: [1000, 1900], tag: 'WHO I AM' },
  { id: 'journey', name: '03 / Ridge of Milestones', x: 2600, range: [2000, 3500], tag: 'CAREER PATH' },
  { id: 'events', name: '04 / The Outpost', x: 4200, range: [3600, 4900], tag: 'ACTIVITIES & WINS' },
  { id: 'hobbies', name: '05 / Twilight Grove', x: 5700, range: [5000, 6500], tag: 'HEART & HOBBIES' },
  { id: 'photos', name: '06 / Memory Glade', x: 7100, range: [6600, 7700], tag: 'GALLERY' },
  { id: 'videos', name: '07 / Starlit Cinema', x: 8100, range: [7800, 8700], tag: 'KEY MEDIA' },
  { id: 'contact', name: '08 / Horizon Campfire', x: 9100, range: [8800, 9600], tag: 'CONNECT' },
];

export function ParallaxWorld({ cameraX, characterX, children }) {
  const progress = Math.max(0, Math.min(1, cameraX / (WORLD_CONFIG.width - 1200)));

  // Dynamic skybox colors computed across the journey
  const skyBackground = useMemo(() => {
    // 0.0 - 0.28: Golden Dawn to Sunrise
    // 0.28 - 0.55: Crisp Daylight Summit
    // 0.55 - 0.82: Magical Purple Twilight
    // 0.82 - 1.0: Starlit Cosmic Night
    if (progress < 0.28) {
      const p = progress / 0.28;
      return `linear-gradient(180deg, #1e1b4b 0%, #4c1d95 35%, #b45309 ${65 + p * 15}%, #f59e0b 100%)`;
    } else if (progress < 0.55) {
      const p = (progress - 0.28) / 0.27;
      return `linear-gradient(180deg, #0f172a 0%, #1e293b 35%, #0284c7 ${55 + p * 15}%, #38bdf8 100%)`;
    } else if (progress < 0.82) {
      const p = (progress - 0.55) / 0.27;
      return `linear-gradient(180deg, #09090b 0%, #311042 35%, #701a75 ${60 + p * 10}%, #f43f5e 100%)`;
    } else {
      return `linear-gradient(180deg, #020617 0%, #090d16 45%, #0f172a 80%, #1e1b4b 100%)`;
    }
  }, [Math.floor(progress * 40)]);

  return (
    <div
      className="relative w-full h-screen overflow-hidden select-none transition-colors duration-1000"
      style={{ background: skyBackground }}
    >
      {/* Dynamic Sun & Moon Orb */}
      <div
        className="absolute w-36 h-36 rounded-full blur-[2px] transition-all duration-700 pointer-events-none"
        style={{
          top: '16%',
          left: `calc(15% + ${(1 - progress) * 60}%)`,
          background:
            progress < 0.55
              ? 'radial-gradient(circle, #fef08a 0%, #f59e0b 60%, transparent 100%)'
              : 'radial-gradient(circle, #e0e7ff 0%, #818cf8 50%, transparent 100%)',
          boxShadow:
            progress < 0.55
              ? '0 0 80px rgba(245, 158, 11, 0.6)'
              : '0 0 90px rgba(129, 140, 248, 0.5)',
          opacity: progress > 0.45 && progress < 0.65 ? 0.3 : 0.85,
        }}
      />

      {/* Layer 0: Distant Mountain Silhouettes (Parallax 0.12x) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          transform: `translate3d(${-cameraX * 0.12}px, 0, 0)`,
          willChange: 'transform',
        }}
      >
        <svg
          viewBox="0 0 4000 600"
          className="absolute bottom-[100px] w-[5000px] h-[480px] opacity-45"
          preserveAspectRatio="none"
        >
          <path
            d="M 0 600 L 0 320 Q 300 120 700 300 T 1400 240 T 2100 280 T 2800 180 T 3500 290 T 4000 220 L 4000 600 Z"
            fill="#090a10"
          />
        </svg>
      </div>

      {/* Layer 1: Midground Hills & Ancient Waypoint Monoliths (Parallax 0.38x) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          transform: `translate3d(${-cameraX * 0.38}px, 0, 0)`,
          willChange: 'transform',
        }}
      >
        <svg
          viewBox="0 0 6000 500"
          className="absolute bottom-[90px] w-[7500px] h-[360px] opacity-75"
          preserveAspectRatio="none"
        >
          <path
            d="M 0 500 L 0 240 Q 400 160 850 280 T 1700 210 T 2550 290 T 3400 200 T 4300 260 T 5200 190 T 6000 250 L 6000 500 Z"
            fill="#10121a"
          />
        </svg>

        {/* Scattered Midground Waypoint Lanterns */}
        {[600, 1500, 2800, 4100, 5600, 7000, 8400].map((lx, i) => (
          <div
            key={i}
            className="absolute bottom-[170px]"
            style={{ left: lx }}
          >
            <div className="w-2.5 h-12 bg-[#1c1f2e] rounded-t-sm" />
            <div className="relative -top-2 -left-2.5 w-7 h-7 rounded-full bg-amber-400/20 blur-[6px] animate-pulse" />
            <div className="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-amber-300 shadow-[0_0_12px_#fbbf24]" />
          </div>
        ))}
      </div>

      {/* Layer 2: Main Walkway Track & Interactive Game Elements (Parallax 1.0x) */}
      <div
        className="absolute inset-0"
        style={{
          transform: `translate3d(${-cameraX}px, 0, 0)`,
          width: WORLD_CONFIG.width,
          willChange: 'transform',
        }}
      >
        {/* Stone Cobblestone Walkway Surface */}
        <div className="absolute bottom-0 left-0 right-0 h-[140px] bg-gradient-to-t from-[#090a0f] via-[#12141c] to-[#1c1f29] border-t border-white/10 shadow-[0_-15px_40px_rgba(0,0,0,0.8)]">
          {/* Subtle Textured Ground Lines */}
          <div className="absolute inset-0 opacity-15 bg-[repeating-linear-gradient(90deg,transparent,transparent_40px,rgba(255,255,255,0.08)_40px,rgba(255,255,255,0.08)_41px)]" />

          {/* Glowing Trail Energy Guide Line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-400/40 via-cyan-400/40 to-purple-400/40 blur-[1px]" />

          {/* Grass Tufts along the Trail Edge */}
          {Array.from({ length: 64 }).map((_, idx) => (
            <div
              key={idx}
              className="absolute -top-3 w-1.5 h-4 bg-emerald-600/60 rounded-t-full origin-bottom"
              style={{
                left: idx * 150 + ((idx * 37) % 60),
                transform: `rotate(${((idx * 17) % 30) - 15}deg)`,
              }}
            />
          ))}
        </div>

        {/* Waypoint Shrines & Zone Markers along the path */}
        {ZONES.map((zone, idx) => {
          const isNear = Math.abs(characterX - zone.x) < 400;

          return (
            <div
              key={zone.id}
              className="absolute bottom-[140px] flex flex-col items-center transition-transform duration-500"
              style={{
                left: zone.x,
                transform: isNear ? 'scale(1.05)' : 'scale(1)',
              }}
            >
              {/* Floating Holographic Waypoint Tag */}
              <div
                className={`mb-4 px-3.5 py-1.5 rounded-full border backdrop-blur-xl font-mono text-[11px] uppercase tracking-widest transition-all duration-300 ${
                  isNear
                    ? 'border-amber-400/80 bg-amber-400/15 text-amber-300 shadow-[0_0_25px_rgba(251,191,36,0.4)]'
                    : 'border-white/10 bg-black/40 text-dim'
                }`}
              >
                {zone.tag}
              </div>

              {/* Waypoint Arch / Monolith Pillar */}
              <div className="relative flex flex-col items-center">
                <div
                  className={`w-12 h-36 rounded-2xl border transition-all duration-500 flex flex-col items-center justify-between p-2 ${
                    isNear
                      ? 'border-amber-400/60 bg-[#161924]/90 shadow-[0_0_30px_rgba(251,191,36,0.25)]'
                      : 'border-white/10 bg-[#0e1017]/80'
                  }`}
                >
                  <div
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      isNear ? 'bg-amber-300 shadow-[0_0_12px_#f59e0b] animate-ping' : 'bg-white/20'
                    }`}
                  />
                  <span className="font-mono text-[10px] text-white/50 [writing-mode:vertical-rl] tracking-widest">
                    ZONE {idx + 1}
                  </span>
                  <div className="w-2 h-2 rounded-sm bg-white/20" />
                </div>

                {/* Base Plinth */}
                <div className="w-20 h-3 bg-[#0a0c12] rounded-t-md border-t border-white/20 mt-1" />
              </div>
            </div>
          );
        })}

        {/* Character & Interactive Objects */}
        {children}
      </div>

      {/* Layer 3: Foreground Cinematic Occluders & Drift Particles (Parallax 1.38x) */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden z-30"
        style={{
          transform: `translate3d(${-cameraX * 1.38}px, 0, 0)`,
          willChange: 'transform',
        }}
      >
        {/* Floating Glowing Fireflies / Stardust */}
        {Array.from({ length: 28 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-pulse"
            style={{
              left: (i * 380) % 12000,
              top: `${20 + ((i * 31) % 65)}%`,
              width: `${3 + (i % 3) * 2}px`,
              height: `${3 + (i % 3) * 2}px`,
              backgroundColor: i % 2 === 0 ? '#fde047' : '#67e8f9',
              boxShadow: `0 0 10px ${i % 2 === 0 ? '#fde047' : '#67e8f9'}`,
              opacity: 0.65,
            }}
          />
        ))}

        {/* Silhouetted Foreground Hanging Vines & Leaves (Drifts fast for 3D depth) */}
        {[400, 1800, 3600, 5400, 7200, 9000].map((vx, vi) => (
          <div
            key={vi}
            className="absolute top-0 w-24 h-56 bg-gradient-to-b from-black via-black/80 to-transparent [clip-path:polygon(30%_0%,70%_0%,100%_100%,60%_85%,40%_95%,0%_75%)] opacity-80"
            style={{ left: vx }}
          />
        ))}
      </div>
    </div>
  );
}

export default ParallaxWorld;

