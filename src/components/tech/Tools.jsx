import { motion, useReducedMotion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { GhostNumber } from '../ui/GhostNumber';
import { toolsSection, toolsRow1, toolsRow2 } from '../../data/techData';

/*
 * Tools — tech_component/tools.txt (ToolsIntegrationHero): badge header
 * plus two counter-scrolling marquee rows of tool tiles with an edge
 * fade mask. Title and tool list come from tech.txt.
 */

function MarqueeRow({ tools, direction = 'left', duration = 30 }) {
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
            className="group relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-gray-800 bg-[#111111] transition-colors hover:bg-gray-800 md:h-24 md:w-24"
          >
            <tool.Icon
              size={40}
              aria-label={tool.name}
              className="transition-all duration-300 group-hover:scale-110"
              style={{ color: tool.color }}
            />
            <span className="absolute -bottom-8 text-xs text-gray-300 opacity-0 transition-opacity group-hover:opacity-100">
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
      className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden py-20 font-sans"
    >
      <GhostNumber depth={0.35} className="left-2 top-6">
        04
      </GhostNumber>

      {/* Header */}
      <div className="z-10 mb-16 flex flex-col items-center px-4 text-center">
        <div className="mb-8 flex items-center gap-2 rounded-full border border-gray-800 bg-gray-900/50 px-4 py-1.5">
          <Zap size={14} className="text-yellow-500" aria-hidden="true" />
          <span className="text-sm font-medium text-gray-300">{toolsSection.badge}</span>
        </div>

        <h2 className="mb-6 font-geist text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
          {toolsSection.title}
        </h2>

        <p className="max-w-2xl text-lg text-gray-400">{toolsSection.description}</p>
      </div>

      {/* Marquee rows with edge fade mask */}
      <div
        className="relative flex w-full max-w-[1400px] flex-col"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
          WebkitMaskImage:
            'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
        }}
      >
        <MarqueeRow tools={toolsRow1} direction="left" duration={30} />
        <MarqueeRow tools={toolsRow2} direction="right" duration={35} />
      </div>

      {/* Live GitHub Telemetry & Commit Velocity from Profile */}
      <div className="z-10 mt-12 w-full max-w-5xl px-6">
        <div className="rounded-2xl border border-line bg-graphite/80 p-6 md:p-8 backdrop-blur-md">
          <div className="flex flex-col gap-2 border-b border-line/60 pb-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-signal">
                Continuous Development Telemetry
              </p>
              <h3 className="mt-1 font-geist text-xl font-bold tracking-tight text-ash md:text-2xl">
                Live Repository Pulse & Commit Velocity
              </h3>
            </div>
            <a
              href="https://github.com/Adityadrasal007"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-line bg-void px-3.5 py-1.5 font-mono text-xs text-dim transition-colors hover:border-signal/50 hover:text-signal"
            >
              <span>github.com/Adityadrasal007</span>
            </a>
          </div>

          {/* GitHub Commit Heatmap */}
          <div className="mt-6 overflow-x-auto pb-2">
            <a
              href="https://github.com/Adityadrasal007"
              target="_blank"
              rel="noopener noreferrer"
              className="block min-w-[650px] transition-opacity hover:opacity-90"
            >
              <img
                src="https://ghchart.rshah.org/FF5722/Adityadrasal007"
                alt="Aditya Rasal GitHub Contribution Calendar"
                className="w-full rounded-md"
                loading="lazy"
              />
            </a>
          </div>

          {/* Streak Counter & Live Metrics */}
          <div className="mt-6 flex flex-col items-center justify-between gap-6 border-t border-line/60 pt-6 sm:flex-row">
            <div className="font-mono text-xs text-dim">
              <span className="text-emerald-400">● Live Sync</span> with GitHub Public API · Daily Active Commits
            </div>
            <a
              href="https://github.com/Adityadrasal007"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-transform hover:scale-105"
            >
              <img
                src="https://streak-stats.demolab.com?user=Adityadrasal007&theme=transparent&hide_border=true&ring=FF5722&fire=FF5722&currStreakLabel=FF5722&sideLabels=9CA3AF&sideNums=E5E7EB&currStreakNum=FF5722&dates=6B7280"
                alt="Aditya Rasal GitHub Streak"
                className="max-h-20"
                loading="lazy"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Tools;
