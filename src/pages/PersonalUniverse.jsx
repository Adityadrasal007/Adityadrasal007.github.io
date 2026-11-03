import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Maximize2, Minimize2 } from 'lucide-react';

export function PersonalUniverse() {
  const [isFullscreen, setIsFullscreen] = useState(false);
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

      {/* Folio-2025 WebGPU / Rapier 3D Native Engine Frame */}
      <iframe
        ref={iframeRef}
        src="./folio-engine/index.html"
        title="Aditya Rasal 3D Interactive Universe"
        className="w-full h-full border-0 outline-none"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        onLoad={() => {
          iframeRef.current?.focus();
          iframeRef.current?.contentWindow?.focus();
        }}
      />
    </div>
  );
}

export default PersonalUniverse;
