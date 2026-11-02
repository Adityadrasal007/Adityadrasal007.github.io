import { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ScanEye,
  Cpu,
  Workflow,
  Sparkles,
  Layers,
  Video,
  Users,
  Code2,
} from 'lucide-react';
import {
  SiPytorch,
  SiOpencv,
  SiFastapi,
  SiDjango,
  SiPostgresql,
  SiDocker,
  SiReact,
  SiTailwindcss,
  SiJavascript,
  SiVuedotjs,
  SiHtml5,
  SiPython,
  SiNumpy,
  SiPandas,
  SiScikitlearn,
  SiJira,
  SiNvidia,
  SiGithub,
  SiLinux,
  SiHuggingface,
  SiNotion,
  SiGit,
} from 'react-icons/si';
import { RiOpenaiFill } from 'react-icons/ri';
import { IconFolder } from '../ui/IconFolder';
import { SectionHeading } from '../ui/SectionHeading';
import { GhostNumber } from '../ui/GhostNumber';
import { cn } from '../../lib/utils';

/* ------------------------------------------------------------------ */
/*  Technical Arsenal — Completely redesigned with Interactive        */
/*  Glass Icon Folders fanning out tool decks on hover/tap.            */
/* ------------------------------------------------------------------ */

export function Skills() {
  const sectionRef = useRef(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [fanAll, setFanAll] = useState(false);

  // Domains & Technology Decks
  const FOLDER_DECKS = useMemo(
    () => [
      {
        id: 'ai-cv',
        title: 'AI & Computer Vision',
        subtitle: 'Real-Time Edge Inference & Vision Agents',
        badgeText: 'Primary Domain',
        accentColor: '#ff5722',
        tags: ['PyTorch', 'YOLOv11', 'OpenCV', 'LangChain', 'Hugging Face'],
        icons: [
          {
            label: 'PyTorch (CUDA)',
            background: 'linear-gradient(135deg, #EE4C2C, #901B05)',
            node: <SiPytorch className="text-white" />,
          },
          {
            label: 'YOLOv11 (Ultralytics)',
            background: 'linear-gradient(135deg, #1C1917, #44403C)',
            node: <ScanEye className="text-[#ff5722]" />,
          },
          {
            label: 'OpenCV Analytics',
            background: 'linear-gradient(135deg, #5C3EE8, #180088)',
            node: <SiOpencv className="text-white" />,
          },
          {
            label: 'LangChain & Agents',
            background: 'linear-gradient(135deg, #1C3C3C, #064E3B)',
            node: <Workflow className="text-emerald-400" />,
          },
          {
            label: 'Hugging Face Hub',
            background: 'linear-gradient(135deg, #FFD21E, #D97706)',
            node: <SiHuggingface className="text-black" />,
          },
        ],
      },
      {
        id: 'backend',
        title: 'Backend & Edge Systems',
        subtitle: 'High-Throughput Microservices & IPC',
        badgeText: 'Low Latency',
        accentColor: '#10b981',
        tags: ['FastAPI', 'Django', 'PostgreSQL', 'Docker', 'REST APIs'],
        icons: [
          {
            label: 'FastAPI (Async)',
            background: 'linear-gradient(135deg, #009688, #004D40)',
            node: <SiFastapi className="text-white" />,
          },
          {
            label: 'Django Enterprise',
            background: 'linear-gradient(135deg, #092E20, #041810)',
            node: <SiDjango className="text-white" />,
          },
          {
            label: 'PostgreSQL Database',
            background: 'linear-gradient(135deg, #336791, #1A3852)',
            node: <SiPostgresql className="text-white" />,
          },
          {
            label: 'Docker Containers',
            background: 'linear-gradient(135deg, #2496ED, #0D5C99)',
            node: <SiDocker className="text-white" />,
          },
          {
            label: 'Linux Kernel / Bash',
            background: 'linear-gradient(135deg, #374151, #111827)',
            node: <SiLinux className="text-yellow-400" />,
          },
        ],
      },
      {
        id: 'frontend',
        title: 'Frontend Engineering',
        subtitle: 'Modern React UI, Shaders & PyWebView',
        badgeText: 'Fluid UX',
        accentColor: '#06b6d4',
        tags: ['React 19', 'Tailwind v4', 'JavaScript', 'Vue.js', 'PyWebView'],
        icons: [
          {
            label: 'React 19 Ecosystem',
            background: 'linear-gradient(135deg, #20232A, #083344)',
            node: <SiReact className="text-[#00D8FF]" />,
          },
          {
            label: 'Tailwind CSS v4',
            background: 'linear-gradient(135deg, #06B6D4, #0E7490)',
            node: <SiTailwindcss className="text-white" />,
          },
          {
            label: 'JavaScript (ESNext)',
            background: 'linear-gradient(135deg, #F7DF1E, #CA8A04)',
            node: <SiJavascript className="text-black" />,
          },
          {
            label: 'Vue.js Framework',
            background: 'linear-gradient(135deg, #4FC08D, #065F46)',
            node: <SiVuedotjs className="text-white" />,
          },
          {
            label: 'HTML5 & Canvas 2D',
            background: 'linear-gradient(135deg, #E34F26, #9A3412)',
            node: <SiHtml5 className="text-white" />,
          },
        ],
      },
      {
        id: 'pm',
        title: 'AI Project Management',
        subtitle: 'Agile Cadence, 150+ Workforce & Sprints',
        badgeText: 'Scrum Master',
        accentColor: '#f59e0b',
        tags: ['Agile & Scrum', 'Jira', 'Stakeholders', 'Risk Mitigation', 'Council Leadership'],
        icons: [
          {
            label: 'Atlassian Jira',
            background: 'linear-gradient(135deg, #0052CC, #1E3A8A)',
            node: <SiJira className="text-white" />,
          },
          {
            label: 'Scrum Sprint Planning',
            background: 'linear-gradient(135deg, #F59E0B, #B45309)',
            node: <Workflow className="text-black" />,
          },
          {
            label: 'Notion PRDs & Specs',
            background: 'linear-gradient(135deg, #2F3437, #18181B)',
            node: <SiNotion className="text-white" />,
          },
          {
            label: '150+ Team Leadership',
            background: 'linear-gradient(135deg, #7C3AED, #4C1D95)',
            node: <Users className="text-white" />,
          },
          {
            label: 'GitHub Project Flow',
            background: 'linear-gradient(135deg, #24292E, #090D16)',
            node: <SiGithub className="text-white" />,
          },
        ],
      },
      {
        id: 'languages',
        title: 'Languages & Data Science',
        subtitle: 'Algorithmic Modeling & Statistical R&D',
        badgeText: 'Scientific',
        accentColor: '#8b5cf6',
        tags: ['Python', 'NumPy', 'Pandas', 'scikit-learn', 'SQL'],
        icons: [
          {
            label: 'Python 3 (Core)',
            background: 'linear-gradient(135deg, #3776AB, #1E3A8A)',
            node: <SiPython className="text-yellow-300" />,
          },
          {
            label: 'NumPy Vectorization',
            background: 'linear-gradient(135deg, #013243, #1E40AF)',
            node: <SiNumpy className="text-[#4D77CF]" />,
          },
          {
            label: 'Pandas DataFrames',
            background: 'linear-gradient(135deg, #150458, #9D174D)',
            node: <SiPandas className="text-white" />,
          },
          {
            label: 'scikit-learn ML',
            background: 'linear-gradient(135deg, #F7931E, #C2410C)',
            node: <SiScikitlearn className="text-white" />,
          },
          {
            label: 'Git Version Control',
            background: 'linear-gradient(135deg, #F05032, #991B1B)',
            node: <SiGit className="text-white" />,
          },
        ],
      },
      {
        id: 'hardware',
        title: 'Edge Hardware & Ops',
        subtitle: 'NVIDIA Jetson, TensorRT & Multi-Cam RTSP',
        badgeText: 'Embedded',
        accentColor: '#ec4899',
        tags: ['NVIDIA Orin', 'CUDA / TensorRT', 'RTSP Decoders', 'TorchScript', 'Zero-Copy Ring'],
        icons: [
          {
            label: 'NVIDIA Jetson Orin',
            background: 'linear-gradient(135deg, #76B900, #365314)',
            node: <SiNvidia className="text-white" />,
          },
          {
            label: 'TensorRT INT8 Accelerators',
            background: 'linear-gradient(135deg, #1F2937, #111827)',
            node: <Cpu className="text-emerald-400" />,
          },
          {
            label: 'RTSP Multi-Camera Feeds',
            background: 'linear-gradient(135deg, #DB2777, #831843)',
            node: <Video className="text-white" />,
          },
          {
            label: 'OpenAI Multimodal API',
            background: 'linear-gradient(135deg, #10A37F, #064E3B)',
            node: <RiOpenaiFill className="text-white" />,
          },
          {
            label: 'Linux IPC Shared Ring',
            background: 'linear-gradient(135deg, #374151, #030712)',
            node: <Code2 className="text-cyan-400" />,
          },
        ],
      },
    ],
    [],
  );

  const filteredDecks = useMemo(() => {
    if (activeFilter === 'all') return FOLDER_DECKS;
    return FOLDER_DECKS.filter((d) => d.id === activeFilter);
  }, [activeFilter, FOLDER_DECKS]);

  const totalTools = useMemo(
    () => FOLDER_DECKS.reduce((acc, deck) => acc + deck.icons.length, 0),
    [FOLDER_DECKS],
  );

  return (
    <section id="skills" ref={sectionRef} className="relative mx-auto max-w-7xl px-6 py-28 md:py-32">
      <GhostNumber depth={0.4} className="-top-10 right-0">
        03
      </GhostNumber>

      {/* Header Block */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <SectionHeading
            index={3}
            label="Arsenal"
            title="Technical Arsenal"
            subtitle="Interactive Domain Decks"
            align="left"
            className="mb-0"
          />
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-dim">
            Hover over any glass folder to fan open its tools and platforms. Hover over individual icons to inspect specific proficiencies.
          </p>
        </div>

        {/* Master Controls & Telemetry */}
        <div className="flex flex-wrap items-center gap-3">
          <motion.button
            type="button"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            onClick={() => setFanAll((prev) => !prev)}
            className={cn(
              'inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 font-mono text-xs uppercase tracking-wider transition-colors duration-200 cursor-pointer select-none',
              fanAll
                ? 'border-signal bg-signal/15 text-signal font-semibold shadow-[0_0_20px_rgba(255,178,36,0.2)]'
                : 'border-white/[0.08] bg-white/[0.03] text-dim hover:border-white/20 hover:text-ash',
            )}
          >
            <Layers size={14} />
            <span>{fanAll ? 'Collapse Decks' : 'Fan All Decks'}</span>
          </motion.button>

          <span className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-3 py-2 font-mono text-xs text-dim shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
            <strong className="text-signal font-semibold">{totalTools}</strong> Frameworks ·{' '}
            <strong className="text-ash font-semibold">{FOLDER_DECKS.length}</strong> Decks
          </span>
        </div>
      </div>

      {/* Domain Category Filter Tabs — Apple Segmented Control */}
      <div className="mt-10 flex flex-wrap items-center gap-1.5 border-b border-line/60 pb-5">
        <button
          type="button"
          onClick={() => setActiveFilter('all')}
          className={cn(
            'relative rounded-full px-4 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors duration-200 cursor-pointer select-none active:scale-95',
            activeFilter === 'all'
              ? 'text-white font-bold'
              : 'text-dim hover:text-ash',
          )}
        >
          {activeFilter === 'all' && (
            <motion.div
              layoutId="activeSkillTab"
              className="absolute inset-0 rounded-full bg-white/[0.12] border border-white/20 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]"
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            />
          )}
          <span className="relative z-10">All Domains ({FOLDER_DECKS.length})</span>
        </button>
        {FOLDER_DECKS.map((d) => {
          const isActive = activeFilter === d.id;
          return (
            <button
              key={d.id}
              type="button"
              onClick={() => setActiveFilter(d.id)}
              className={cn(
                'relative rounded-full px-4 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors duration-200 cursor-pointer select-none active:scale-95',
                isActive
                  ? 'text-white font-semibold'
                  : 'text-dim hover:text-ash',
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeSkillTab"
                  className="absolute inset-0 rounded-full bg-white/[0.12] border border-white/20 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]"
                  transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                />
              )}
              <span className="relative z-10">{d.title}</span>
            </button>
          );
        })}
      </div>

      {/* Interactive Folder Grid */}
      <motion.div
        layout
        className="mt-12 grid grid-cols-1 items-center justify-items-center gap-10 md:grid-cols-2 lg:grid-cols-3 lg:gap-10"
      >
        <AnimatePresence mode="popLayout">
          {filteredDecks.map((deck) => (
            <motion.div
              layout
              key={deck.id}
              initial={{ opacity: 0, y: 25, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="w-full flex justify-center"
            >
              <IconFolder
                title={deck.title}
                subtitle={deck.subtitle}
                tags={deck.tags}
                icons={deck.icons}
                badgeText={deck.badgeText}
                accentColor={deck.accentColor}
                defaultOpen={fanAll}
                spread={54}
                className="w-full"
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Production Telemetry Strip at Bottom of Arsenal */}
      <div className="mt-16 rounded-2xl border border-line bg-graphite/40 p-6 md:p-8 backdrop-blur-md">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-signal/10 border border-signal/20 text-signal">
              <Sparkles size={20} />
            </div>
            <div>
              <h4 className="font-geist text-base font-bold text-ash">
                Production-Validated Stack
              </h4>
              <p className="font-mono text-xs text-dim">
                Deployed in manufacturing press shops, enterprise student platforms & offline edge devices.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-dim">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span>NVIDIA TensorRT INT8</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-cyan-400" />
              <span>Zero-Copy RTSP Ring</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-yellow-400" />
              <span>Certified Scrum Master</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-purple-400" />
              <span>React 19 + Shaders</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Skills;
