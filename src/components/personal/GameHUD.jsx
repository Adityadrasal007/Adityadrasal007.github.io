import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Volume2,
  VolumeX,
  Compass,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Maximize2,
} from 'lucide-react';
import { ZONES } from './ParallaxWorld';
import { WORLD_CONFIG } from './useGameController';

export function GameHUD({
  characterX,
  hasMoved,
  onTeleport,
  onTouchMove,
  onJump,
}) {
  const [muted, setMuted] = useState(true);
  const progressPercent = Math.min(100, Math.max(0, (characterX / (WORLD_CONFIG.width - 120)) * 100));

  // Determine current active zone
  const currentZone = ZONES.slice().reverse().find((z) => characterX >= z.range[0]) || ZONES[0];

  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex flex-col justify-between p-4 md:p-6 select-none font-geist">
      {/* Top HUD Bar */}
      <div className="flex w-full items-center justify-between gap-4">
        {/* Switch back to Tech Universe */}
        <Link
          to="/tech"
          className="pointer-events-auto group inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-4 py-2 font-mono text-xs uppercase tracking-wider text-ash shadow-2xl backdrop-blur-xl transition-all hover:border-amber-400/50 hover:bg-black/70 hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1 text-amber-400" />
          <span>Tech Universe</span>
        </Link>

        {/* Interactive Waypoint Mini-Map & Progress HUD */}
        <div className="pointer-events-auto hidden md:flex items-center gap-3 rounded-full border border-white/10 bg-black/60 px-5 py-2 shadow-2xl backdrop-blur-2xl">
          <Compass className="h-4 w-4 text-amber-400 animate-spin" style={{ animationDuration: '12s' }} />
          <span className="font-mono text-xs text-white font-semibold tracking-wide">
            {currentZone.name}
          </span>

          <div className="relative mx-3 h-1.5 w-44 rounded-full bg-white/15 overflow-hidden">
            {/* Real-time Walked Progress Fill */}
            <div
              className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-amber-400 via-rose-400 to-purple-400 rounded-full transition-all duration-100"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Quick-jump clickable waypoint dots */}
          <div className="flex items-center gap-1.5">
            {ZONES.map((zone, i) => {
              const isPastOrActive = characterX >= zone.x - 100;

              return (
                <button
                  key={zone.id}
                  type="button"
                  onClick={() => onTeleport(zone.x)}
                  title={`Fast travel to ${zone.name}`}
                  className={`h-2.5 w-2.5 rounded-full transition-all cursor-pointer ${
                    isPastOrActive
                      ? 'bg-amber-400 scale-110 shadow-[0_0_8px_#f59e0b]'
                      : 'bg-white/25 hover:bg-white/50'
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* Audio Atmosphere & Fullscreen Controls */}
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMuted(!muted)}
            aria-label={muted ? 'Unmute Ambient Sound' : 'Mute Ambient Sound'}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/50 text-ash shadow-2xl backdrop-blur-xl transition-all hover:border-amber-400/50 hover:text-white cursor-pointer"
          >
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4 text-amber-400" />}
          </button>
        </div>
      </div>

      {/* Center Dynamic Controls Helper (Fades after moving) */}
      <div
        className={`flex justify-center transition-opacity duration-1000 ${
          hasMoved ? 'opacity-30 hover:opacity-100' : 'opacity-100'
        }`}
      >
        <div className="inline-flex items-center gap-3 rounded-full border border-amber-400/30 bg-black/70 px-5 py-2.5 font-mono text-xs uppercase tracking-widest text-amber-300 shadow-[0_0_30px_rgba(251,191,36,0.2)] backdrop-blur-2xl">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          <span>Hold [A] [D] or Scroll to Walk</span>
          <span className="text-white/30">•</span>
          <span>[Space] Hop</span>
          <span className="text-white/30">•</span>
          <span>[Shift] Sprint</span>
        </div>
      </div>

      {/* Mobile Touch On-Screen Controls */}
      <div className="pointer-events-auto flex w-full items-end justify-between md:hidden pb-4">
        {/* Virtual Directional D-Pad */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onTouchStart={() => onTouchMove(-1)}
            onTouchEnd={() => onTouchMove(0)}
            onMouseDown={() => onTouchMove(-1)}
            onMouseUp={() => onTouchMove(0)}
            className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-black/70 active:bg-amber-400 active:text-black text-white shadow-2xl backdrop-blur-xl select-none"
          >
            <ChevronLeft className="h-7 w-7" />
          </button>
          <button
            type="button"
            onTouchStart={() => onTouchMove(1)}
            onTouchEnd={() => onTouchMove(0)}
            onMouseDown={() => onTouchMove(1)}
            onMouseUp={() => onTouchMove(0)}
            className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-black/70 active:bg-amber-400 active:text-black text-white shadow-2xl backdrop-blur-xl select-none"
          >
            <ChevronRight className="h-7 w-7" />
          </button>
        </div>

        {/* Virtual Jump Action Button */}
        <button
          type="button"
          onTouchStart={onJump}
          onClick={onJump}
          className="flex h-14 w-14 items-center justify-center rounded-full border border-amber-400/50 bg-amber-400/20 active:bg-amber-400 active:text-black text-amber-300 font-mono text-xs font-bold uppercase shadow-[0_0_20px_rgba(251,191,36,0.3)] backdrop-blur-xl select-none"
        >
          HOP
        </button>
      </div>
    </div>
  );
}

export default GameHUD;

