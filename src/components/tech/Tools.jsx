import { motion, useReducedMotion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { GhostNumber } from '../ui/GhostNumber';
import { toolsSection, toolsRow1, toolsRow2 } from '../../data/techData';

/*
 * Tools — Apple Refined Counter-Scrolling Marquee:
 * - Frosted glass orb tiles with specular top-edge lighting.
 * - Smooth hover scale and instant touch feedback.
 * - Gentle linear loop with reduced-motion support.
 */

function MarqueeRow({ tools, direction = 'left', duration = 32 }) {
  const reduced = useReducedMotion();
  const from = direction === 'left' ? '0%' : '-50%';
  const to = direction === 'left' ? '-50%' : '0%';

  return (
    <div className="flex w-full overflow-x-clip pb-10">
      <motion.div
        className="flex min-w-full gap-6 whitespace-nowrap"
        animate={reduced ? undefined : { x: [from, to] }}
        transition={{ repeat: Infinity, ease: 'linear', duration }}
      >
        {/* Doubled array creates the seamless infinite loop */}
        {[...tools, ...tools].map((tool, index) => (
          <div
            key={`${tool.name}-${index}`}
            className="group relative flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-white/[0.08] bg-[#121214]/80 backdrop-blur-md shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_8px_24px_-6px_rgba(0,0,0,0.6)] transition-all duration-300 hover:border-signal/50 hover:bg-[#18181c] hover:shadow-[0_12px_32px_rgba(255,178,36,0.15)] active:scale-95 cursor-pointer md:h-24 md:w-24"
          >
            <tool.Icon
              size={38}
              aria-label={tool.name}
              className="transition-transform duration-300 group-hover:scale-110"
              style={{ color: tool.color }}
            />
            {/* Apple-style floating badge tooltip */}
            <span className="pointer-events-none absolute -bottom-9 rounded-full border border-white/10 bg-black/85 px-2.5 py-1 font-mono text-[11px] text-ash opacity-0 shadow-lg backdrop-blur-md transition-all duration-200 group-hover:-translate-y-1 group-hover:opacity-100">
              {tool.name}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export function Tools() {
  return (
    <section
      id="tools"
      className="relative flex min-h-[75vh] flex-col items-center justify-center overflow-hidden py-24 font-sans"
    >
      <GhostNumber depth={0.35} className="left-2 top-6">
        05
      </GhostNumber>

      {/* Header with Apple Frosted Glass Pill */}
      <div className="z-10 mb-16 flex flex-col items-center px-4 text-center">
        <motion.div
          whileHover={{ y: -1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="mb-6 flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-1.5 backdrop-blur-md shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]"
        >
          <Zap size={13} className="text-signal" aria-hidden="true" />
          <span className="font-mono text-xs uppercase tracking-wider text-dim">
            {toolsSection.badge}
          </span>
        </motion.div>

        <h2 className="mb-4 font-geist text-3xl font-extrabold tracking-[-0.03em] text-ash sm:text-4xl md:text-5xl lg:text-6xl leading-[1.08]">
          {toolsSection.title}
        </h2>

        <p className="max-w-2xl text-sm leading-relaxed tracking-[-0.005em] text-dim sm:text-base md:text-lg">
          {toolsSection.description}
        </p>
      </div>

      {/* Marquee rows with soft gradient edge mask */}
      <div
        className="relative flex w-full max-w-[1400px] flex-col"
        style={{
          maskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
        }}
      >
        <MarqueeRow tools={toolsRow1} direction="left" duration={32} />
        <MarqueeRow tools={toolsRow2} direction="right" duration={36} />
      </div>
    </section>
  );
}

export default Tools;
