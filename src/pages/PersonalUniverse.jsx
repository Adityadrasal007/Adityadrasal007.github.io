import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Maximize2, Minimize2, Car, RefreshCw, Wrench, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

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

  const sendKey = (key, code, isDown = true) => {
    try {
      iframeRef.current?.contentWindow?.dispatchEvent(
        new KeyboardEvent(isDown ? 'keydown' : 'keyup', {
          key,
          code,
          bubbles: true,
          cancelable: true,
        })
      );
    } catch (err) {}
  };

  // Listen for engine ready
  useEffect(() => {
    const handleMessage = (e) => {
      if (e.data?.type === 'FOLIO_READY') {
        setIsIframeLoaded(true);
      }
    };
    window.addEventListener('message', handleMessage);
    const safetyTimeout = setTimeout(() => setIsIframeLoaded(true), 4500);

    return () => {
      window.removeEventListener('message', handleMessage);
      clearTimeout(safetyTimeout);
    };
  }, []);

  // Keyboard Event Forwarding to Iframe
  useEffect(() => {
    const focusIframe = () => {
      iframeRef.current?.focus();
      iframeRef.current?.contentWindow?.focus();
    };

    const handleKeyDown = (e) => {
      // Avoid forwarding if user is focused inside an input
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;
      sendKey(e.key, e.code, true);
    };

    const handleKeyUp = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;
      sendKey(e.key, e.code, false);
    };

    window.addEventListener('click', focusIframe);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('click', focusIframe);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
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

      {/* Floating Garage & Respawn Quick Bar */}
      <div className="absolute top-4 right-4 z-50 flex items-center gap-2 pointer-events-auto">
        <button
          type="button"
          onClick={() => {
            sendKey('g', 'KeyG', true);
            setTimeout(() => sendKey('g', 'KeyG', false), 100);
          }}
          className="inline-flex items-center gap-1.5 rounded-full border border-fuchsia-500/40 bg-black/80 px-3.5 py-1.5 font-mono text-xs font-bold text-fuchsia-300 shadow-2xl backdrop-blur-2xl transition-all hover:border-fuchsia-400 hover:bg-fuchsia-500/20 cursor-pointer"
        >
          <Wrench className="h-3.5 w-3.5 text-fuchsia-400" />
          <span>Garage [G]</span>
        </button>
        <button
          type="button"
          onClick={() => {
            sendKey('r', 'KeyR', true);
            setTimeout(() => sendKey('r', 'KeyR', false), 100);
          }}
          className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/40 bg-black/80 px-3.5 py-1.5 font-mono text-xs font-bold text-cyan-300 shadow-2xl backdrop-blur-2xl transition-all hover:border-cyan-400 hover:bg-cyan-500/20 cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5 text-cyan-400" />
          <span>Reset [R]</span>
        </button>
      </div>

      {/* On-Screen Touch / Mouse Driving Controls (Bottom Left & Right) */}
      <div className="absolute bottom-5 left-5 z-40 hidden md:flex items-center gap-2 pointer-events-auto bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-2 text-white/80 text-xs font-mono shadow-2xl">
        <div className="flex flex-col items-center gap-1">
          <button
            onPointerDown={() => sendKey('w', 'KeyW', true)}
            onPointerUp={() => sendKey('w', 'KeyW', false)}
            onPointerLeave={() => sendKey('w', 'KeyW', false)}
            className="w-9 h-9 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center hover:bg-white/20 active:bg-fuchsia-500 transition-colors"
            title="Accelerate (W)"
          >
            <ChevronUp className="w-5 h-5 text-white" />
          </button>
          <div className="flex items-center gap-1">
            <button
              onPointerDown={() => sendKey('a', 'KeyA', true)}
              onPointerUp={() => sendKey('a', 'KeyA', false)}
              onPointerLeave={() => sendKey('a', 'KeyA', false)}
              className="w-9 h-9 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center hover:bg-white/20 active:bg-fuchsia-500 transition-colors"
              title="Steer Left (A)"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <button
              onPointerDown={() => sendKey('s', 'KeyS', true)}
              onPointerUp={() => sendKey('s', 'KeyS', false)}
              onPointerLeave={() => sendKey('s', 'KeyS', false)}
              className="w-9 h-9 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center hover:bg-white/20 active:bg-fuchsia-500 transition-colors"
              title="Reverse (S)"
            >
              <ChevronDown className="w-5 h-5 text-white" />
            </button>
            <button
              onPointerDown={() => sendKey('d', 'KeyD', true)}
              onPointerUp={() => sendKey('d', 'KeyD', false)}
              onPointerLeave={() => sendKey('d', 'KeyD', false)}
              className="w-9 h-9 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center hover:bg-white/20 active:bg-fuchsia-500 transition-colors"
              title="Steer Right (D)"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
        <div className="ml-2 pl-3 border-l border-white/10 flex flex-col gap-1 text-[11px] text-white/60">
          <div><span className="text-white font-bold">WASD</span> or <span className="text-white font-bold">ARROWS</span> to Drive</div>
          <div><span className="text-cyan-400 font-bold">SPACE</span> for Handbrake Drift</div>
          <div><span className="text-fuchsia-400 font-bold">[G]</span> Garage // <span className="text-amber-400 font-bold">[V]</span> Free Camera</div>
        </div>
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
              Loading Aditya's World...
            </h2>
            <p className="text-xs text-white/60 mb-6">
              Mercedes-AMG G 63, Racing Superbike, ANANTAM Concert Stage, and 3D Memory Wheel spinning up.
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
          }, 1000);
        }}
      />
    </div>
  );
}

export default PersonalUniverse;
