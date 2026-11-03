import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Maximize2, Minimize2, Car, Compass } from 'lucide-react';

export function PersonalUniverse() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);
  const iframeRef = useRef(null);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const focusIframe = () => {
      iframeRef.current?.focus();
      iframeRef.current?.contentWindow?.focus();
    };

    window.addEventListener('click', focusIframe);
    return () => window.removeEventListener('click', focusIframe);
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0c0d14] select-none font-geist">
      {/* Top Floating Navigation Bar */}
      <div className="absolute top-4 left-4 z-50 flex items-center gap-2.5 pointer-events-auto">
        <Link
          to="/tech"
          className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/80 px-4 py-2 font-mono text-xs uppercase tracking-wider text-white shadow-2xl backdrop-blur-2xl transition-all hover:border-amber-400 hover:text-amber-300 cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Tech Universe</span>
        </Link>
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/80 px-3.5 py-2 font-mono text-xs uppercase tracking-wider text-white/80 shadow-2xl backdrop-blur-2xl transition-all hover:border-cyan-400 hover:text-cyan-300 cursor-pointer"
        >
          <span>Home</span>
        </Link>
        <button
          type="button"
          onClick={toggleFullscreen}
          title="Toggle Fullscreen"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-black/80 text-white/80 shadow-2xl backdrop-blur-2xl transition-all hover:border-white hover:text-white cursor-pointer"
        >
          {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
        </button>
      </div>

      {/* Loading Overlay while assets download */}
      {!isIframeLoaded && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-[#130f17] text-white transition-opacity duration-700 pointer-events-none">
          <div className="relative flex flex-col items-center max-w-md px-6 text-center">
            {/* Animated Ring */}
            <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-fuchsia-500/20 animate-ping"></div>
              <div className="absolute inset-0 rounded-full border-2 border-t-fuchsia-400 border-r-transparent border-b-cyan-400 border-l-transparent animate-spin"></div>
              <Car className="w-8 h-8 text-fuchsia-400 animate-pulse" />
            </div>

            <div className="text-xs font-mono uppercase tracking-[0.3em] text-fuchsia-400/90 mb-2">
              ADITYA RASAL // 3D FOLIO
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white mb-2">
              Loading 3D Universe...
            </h2>
            <p className="text-xs text-white/60 mb-6">
              Spinning up Mercedes-AMG G 63, Rapier 3D physics, and high-fidelity shaders.
            </p>

            {/* Quick Controls Cheat Sheet */}
            <div className="grid grid-cols-2 gap-2 w-full max-w-xs text-left bg-white/5 border border-white/10 rounded-xl p-3 text-[11px] font-mono text-white/70">
              <div className="flex items-center gap-1.5">
                <span className="px-1.5 py-0.5 rounded bg-white/10 text-white font-bold">WASD</span>
                <span>Drive</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="px-1.5 py-0.5 rounded bg-white/10 text-white font-bold">SPACE</span>
                <span>Brake</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="px-1.5 py-0.5 rounded bg-white/10 text-fuchsia-300 font-bold">[G]</span>
                <span>Garage</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="px-1.5 py-0.5 rounded bg-white/10 text-cyan-300 font-bold">[R]</span>
                <span>Respawn</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Folio-2025 WebGPU / Rapier 3D Native Engine Frame */}
      <iframe
        ref={iframeRef}
        src="./folio-engine/index.html"
        title="Aditya Rasal 3D Interactive Universe"
        className="w-full h-full border-0 outline-none"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        onLoad={() => {
          setTimeout(() => {
            setIsIframeLoaded(true);
            iframeRef.current?.focus();
            iframeRef.current?.contentWindow?.focus();
          }, 1200);
        }}
      />
    </div>
  );
}

export default PersonalUniverse;
