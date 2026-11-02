import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Mail,
  FileDown,
  Navigation,
  Volume2,
  VolumeX,
  Camera,
} from 'lucide-react';
import { FaLinkedinIn, FaGithub } from 'react-icons/fa6';
import resumePdf from '../../../assets/Resume-Aditya.pdf';
import sound from '../audio/SoundEngine';

export function DrivingHUD({
  speed = 0,
  activeZone = null,
  cameraMode = 'isometric',
  onToggleCamera,
  onResetCar,
  onHonk,
  onKeyTouch,
}) {
  const [muted, setMuted] = useState(true);

  const handleToggleSound = () => {
    const next = !muted;
    setMuted(next);
    sound.setMuted(next);
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex flex-col justify-between p-4 md:p-6 select-none font-geist">
      {/* Top HUD Bar */}
      <div className="flex w-full items-center justify-between gap-4">
        {/* Switch back to Tech Universe */}
        <Link
          to="/tech"
          className="pointer-events-auto group inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/60 px-4 py-2 font-mono text-xs uppercase tracking-wider text-ash shadow-2xl backdrop-blur-2xl transition-all hover:border-amber-400/60 hover:text-white cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1 text-amber-400" />
          <span>Tech Universe</span>
        </Link>

        {/* Current Zone Tag Indicator */}
        {activeZone && (
          <div className="hidden sm:flex items-center gap-2.5 rounded-full border border-white/15 bg-black/70 px-5 py-2 shadow-2xl backdrop-blur-2xl">
            <span
              className="h-2 w-2 rounded-full animate-pulse"
              style={{ backgroundColor: activeZone.color }}
            />
            <span className="font-mono text-xs font-semibold text-white uppercase tracking-wider">
              {activeZone.name}
            </span>
          </div>
        )}

        {/* Utility Controls */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            type="button"
            onClick={handleToggleSound}
            title={muted ? 'Unmute Sound' : 'Mute Sound'}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/60 text-xs font-mono uppercase text-ash shadow-2xl backdrop-blur-2xl transition-all hover:border-amber-400/50 hover:text-white cursor-pointer"
          >
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4 text-amber-400" />}
          </button>

          {/* Camera View Mode */}
          <button
            type="button"
            onClick={onToggleCamera}
            title="Toggle Camera View [C]"
            className="flex h-9 items-center gap-1.5 rounded-full border border-white/15 bg-black/60 px-3 text-xs font-mono uppercase text-ash shadow-2xl backdrop-blur-2xl transition-all hover:border-amber-400/50 hover:text-white cursor-pointer"
          >
            <Camera className="h-3.5 w-3.5 text-amber-400" />
            <span className="hidden sm:inline">Cam [C]</span>
          </button>

          {/* Horn */}
          <button
            type="button"
            onClick={onHonk}
            title="Honk Horn [H]"
            className="flex h-9 items-center gap-1.5 rounded-full border border-white/15 bg-black/60 px-3 text-xs font-mono uppercase text-ash shadow-2xl backdrop-blur-2xl transition-all hover:border-amber-400/50 hover:text-white cursor-pointer"
          >
            <span className="text-amber-400 font-bold">📢</span>
            <span className="hidden sm:inline">Horn [H]</span>
          </button>

          {/* Reset Car */}
          <button
            type="button"
            onClick={onResetCar}
            title="Reset / Flip Car [R]"
            className="flex h-9 items-center gap-1.5 rounded-full border border-white/15 bg-black/60 px-3 text-xs font-mono uppercase text-ash shadow-2xl backdrop-blur-2xl transition-all hover:border-amber-400/50 hover:text-white cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5 text-amber-400" />
            <span className="hidden sm:inline">Reset [R]</span>
          </button>
        </div>
      </div>

      {/* Center Zone Information Card (Pops up when parked inside a zone) */}
      {activeZone && (
        <div className="pointer-events-auto mx-auto max-w-lg w-full rounded-2xl border border-white/15 bg-[#10121a]/95 p-5 md:p-6 shadow-[0_25px_60px_rgba(0,0,0,0.85),inset_0_1px_0_0_rgba(255,255,255,0.18)] backdrop-blur-2xl transition-all animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: activeZone.color }}
              />
              <span className="font-mono text-[11px] uppercase tracking-widest text-ash font-medium">
                {activeZone.name}
              </span>
            </div>
            <span className="font-mono text-[10px] text-amber-400 uppercase font-semibold">Active Zone</span>
          </div>

          <h3 className="mt-3 font-geist text-xl font-bold tracking-tight text-white md:text-2xl">
            {activeZone.title}
          </h3>
          <p className="mt-0.5 font-mono text-xs uppercase tracking-wider text-amber-400 font-medium">
            {activeZone.subtitle}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-dim md:text-sm">
            {activeZone.description}
          </p>

          {/* Quick Context Actions */}
          <div className="mt-4 flex flex-wrap items-center gap-2 pt-2 border-t border-white/10">
            {activeZone.id === 'contact' ? (
              <>
                <a
                  href="https://www.linkedin.com/in/adityarasal007"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-amber-400/40 bg-amber-400/15 px-3 py-1.5 font-mono text-xs text-amber-300 hover:bg-amber-400 hover:text-black transition-colors"
                >
                  <FaLinkedinIn className="h-3.5 w-3.5" />
                  LinkedIn
                </a>
                <a
                  href="https://github.com/Adityadrasal007"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 font-mono text-xs text-ash hover:text-white transition-colors"
                >
                  <FaGithub className="h-3.5 w-3.5" />
                  GitHub
                </a>
                <a
                  href={resumePdf}
                  download="Aditya-Rasal-Resume.pdf"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 font-mono text-xs text-ash hover:text-white transition-colors"
                >
                  <FileDown className="h-3.5 w-3.5" />
                  Resume
                </a>
              </>
            ) : (
              <Link
                to="/tech"
                className="inline-flex items-center gap-1.5 rounded-xl border border-amber-400/40 bg-amber-400/15 px-3 py-1.5 font-mono text-xs text-amber-300 hover:bg-amber-400 hover:text-black transition-colors"
              >
                Inspect Tech Specs
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Bottom Controls Row: Speedometer & Mobile Touch Controls */}
      <div className="flex w-full items-end justify-between">
        {/* Driving Instructions Hint (Desktop) */}
        <div className="hidden md:flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-ash backdrop-blur-xl">
          <Navigation className="h-3.5 w-3.5 text-amber-400" />
          <span>[W][A][S][D] / Arrows to Drive</span>
          <span className="text-white/30">•</span>
          <span>[Space] Drift</span>
          <span className="text-white/30">•</span>
          <span>[C] Cam</span>
          <span className="text-white/30">•</span>
          <span>[H] Horn</span>
        </div>

        {/* Mobile Touch Controls (Rendered on mobile viewports) */}
        <div className="pointer-events-auto flex w-full items-end justify-between md:hidden pb-2">
          {/* Steering Arrows */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onTouchStart={() => onKeyTouch('left', true)}
              onTouchEnd={() => onKeyTouch('left', false)}
              className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-black/75 active:bg-amber-400 active:text-black text-white text-xl font-bold shadow-2xl backdrop-blur-xl select-none"
            >
              ◀
            </button>
            <button
              type="button"
              onTouchStart={() => onKeyTouch('right', true)}
              onTouchEnd={() => onKeyTouch('right', false)}
              className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-black/75 active:bg-amber-400 active:text-black text-white text-xl font-bold shadow-2xl backdrop-blur-xl select-none"
            >
              ▶
            </button>
          </div>

          {/* Pedals: Gas & Reverse */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onTouchStart={() => onKeyTouch('backward', true)}
              onTouchEnd={() => onKeyTouch('backward', false)}
              className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-black/75 active:bg-rose-500 active:text-white text-rose-400 text-xs font-mono font-bold uppercase shadow-2xl backdrop-blur-xl select-none"
            >
              BRAKE
            </button>
            <button
              type="button"
              onTouchStart={() => onKeyTouch('forward', true)}
              onTouchEnd={() => onKeyTouch('forward', false)}
              className="flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-400/50 bg-amber-400/20 active:bg-amber-400 active:text-black text-amber-300 text-xs font-mono font-bold uppercase shadow-[0_0_20px_rgba(251,191,36,0.3)] backdrop-blur-xl select-none"
            >
              GAS
            </button>
          </div>
        </div>

        {/* Digital Speedometer Gauge */}
        <div className="hidden sm:flex items-baseline gap-1.5 rounded-2xl border border-white/15 bg-black/70 px-4 py-2.5 shadow-2xl backdrop-blur-2xl">
          <span className="font-geist text-2xl font-black tracking-tight text-white">
            {Math.round(speed)}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-wider text-amber-400">
            KM/H
          </span>
        </div>
      </div>
    </div>
  );
}

export default DrivingHUD;
