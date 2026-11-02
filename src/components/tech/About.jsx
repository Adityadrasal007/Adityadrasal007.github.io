import { motion, useReducedMotion } from 'framer-motion';
import { RiOpenaiFill } from 'react-icons/ri';
import { SiAnthropic, SiGooglegemini } from 'react-icons/si';
import { BrainCircuit, Rocket, Zap, Boxes } from 'lucide-react';
import { SectionHeading } from '../ui/SectionHeading';
import { TiltCard } from '../ui/TiltCard';
import { CountUp } from '../ui/CountUp';
import { BracketCorners } from '../ui/BracketCorners';
import { GhostNumber } from '../ui/GhostNumber';
import { aboutSection, aboutCards, experiences } from '../../data/techData';
import { cn } from '../../lib/utils';

/*
 * About — layout and motion from tech_component/about.txt
 * (BentoGridShowcase): 6 slots on a 3x3 grid, staggered spring
 * entrance. Cards carry tech.txt's five "Who am I?" pillars plus a
 * stat tile, each on a pointer-tracking 3D tilt surface.
 */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 10,
    },
  },
};

function Card({ className, children }) {
  return (
    <TiltCard
      maxTilt={4}
      className={cn(
        'h-full rounded-2xl border border-white/[0.08] bg-[#121214]/85 backdrop-blur-xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_12px_36px_-12px_rgba(0,0,0,0.6)] transition-all duration-300 hover:border-signal/40 hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.16),0_18px_48px_-12px_rgba(0,0,0,0.8)]',
        className,
      )}
    >
      {children}
    </TiltCard>
  );
}

/* Slot 1 — tall card: Scalable Applications */
function ScalableCard() {
  const { Icon, title, description } = aboutCards.scalable;
  return (
    <Card className="flex flex-col justify-between p-6">
      <div>
        {/* Header with status badge */}
        <div className="flex items-center justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-signal/10 border border-signal/20">
            <Icon className="h-5 w-5 text-signal" aria-hidden="true" />
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Nodes Online: 4/4
          </span>
        </div>

        <h3 className="mt-4 font-geist text-2xl font-bold tracking-tight text-ash">{title}</h3>
        <p className="mt-1.5 text-xs leading-relaxed text-dim">{description}</p>

        {/* Live Distributed Node Topology Map */}
        <div className="mt-5 rounded-xl border border-line bg-void/80 p-3.5 font-mono text-[11px]">
          <div className="flex items-center justify-between pb-2 border-b border-line/50 text-[10px] text-dim/70 uppercase tracking-widest">
            <span>Distributed Edge Topology</span>
            <span className="text-signal">Low-Latency Ring</span>
          </div>

          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between rounded-lg bg-graphite/60 px-3 py-2 border border-line/40">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-cyan-400" />
                <span className="text-ash font-medium">Camera Streams</span>
              </div>
              <span className="text-[10px] text-cyan-400">4x RTSP · 1080p @ 60 FPS</span>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-graphite/60 px-3 py-2 border border-line/40">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-signal" />
                <span className="text-ash font-medium">Inference Accelerator</span>
              </div>
              <span className="text-[10px] text-signal">Jetson Orin · INT8 TensorRT</span>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-graphite/60 px-3 py-2 border border-line/40">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-purple-400" />
                <span className="text-ash font-medium">Zero-Copy IPC Buffer</span>
              </div>
              <span className="text-[10px] text-purple-400">1.4 GB/s Shared Memory</span>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-graphite/60 px-3 py-2 border border-line/40">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span className="text-ash font-medium">Telemetry Broadcast</span>
              </div>
              <span className="text-[10px] text-emerald-400">FastAPI + WebSockets</span>
            </div>
          </div>
        </div>

        {/* Live System Health Gauges */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="rounded-lg border border-line bg-void/50 p-2.5 text-center">
            <span className="block font-geist text-base font-bold text-ash">14.2ms</span>
            <span className="font-mono text-[9px] uppercase tracking-wider text-dim">Latency</span>
          </div>
          <div className="rounded-lg border border-line bg-void/50 p-2.5 text-center">
            <span className="block font-geist text-base font-bold text-emerald-400">99.98%</span>
            <span className="font-mono text-[9px] uppercase tracking-wider text-dim">Uptime</span>
          </div>
          <div className="rounded-lg border border-line bg-void/50 p-2.5 text-center">
            <span className="block font-geist text-base font-bold text-cyan-400">0 Drops</span>
            <span className="font-mono text-[9px] uppercase tracking-wider text-dim">Buffer Sync</span>
          </div>
        </div>
      </div>

      {/* Production Architecture Pillars */}
      <div className="mt-5 border-t border-line/60 pt-4">
        <p className="font-mono text-[10px] uppercase tracking-widest text-dim/70 mb-2">Architectural Standard</p>
        <div className="flex flex-wrap gap-1.5">
          {['Microservices', 'Zero-Copy Ring', 'Dockerized', 'Fault Tolerant', 'Clean Code'].map((pill) => (
            <span
              key={pill}
              className="rounded-md border border-line bg-void/70 px-2 py-0.5 font-mono text-[10px] text-dim hover:text-signal hover:border-signal/40 transition-colors"
            >
              #{pill}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
}

/* Slot 2 — Working with AI */
function AICard() {
  const { title, description } = aboutCards.ai;
  const models = [
    { Icon: RiOpenaiFill, color: '#10a37f', label: 'OpenAI GPT-4o' },
    { Icon: SiAnthropic, color: '#d97757', label: 'Anthropic Claude' },
    { Icon: SiGooglegemini, color: '#4285f4', label: 'Google Gemini' },
  ];
  return (
    <Card className="flex flex-col justify-between p-6">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <BrainCircuit size={18} />
            </div>
            <h3 className="font-geist text-base font-bold text-ash">{title}</h3>
          </div>
          <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Neural Engine Active
          </span>
        </div>
        <p className="mt-2 text-xs text-dim leading-relaxed">{description}</p>

        {/* Real-Time Neural Vision Target HUD */}
        <div className="mt-3.5 rounded-lg border border-line bg-void/90 p-3 font-mono text-[11px]">
          <div className="flex items-center justify-between text-[10px] text-dim border-b border-line/40 pb-1.5">
            <span className="text-signal flex items-center gap-1">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-signal animate-ping" />
              EDGE CV INFERENCE
            </span>
            <span className="text-emerald-400 font-semibold">CONF: 98.7%</span>
          </div>

          <div className="mt-2.5 flex items-center justify-between">
            <div className="space-y-1 text-[11px]">
              <div className="text-ash flex items-center gap-1.5">
                <span className="text-signal">▸</span>
                <span className="font-semibold">YOLOv8 / v11 (TensorRT)</span>
              </div>
              <div className="text-dim text-[10px]">
                Multi-Object Tracking (ByteTrack)
              </div>
            </div>
            <div className="text-right">
              <span className="font-geist text-base font-bold text-signal">60+ FPS</span>
              <p className="text-[9px] text-dim uppercase tracking-wider">Sub-15ms Edge</p>
            </div>
          </div>
        </div>
      </div>

      {/* Model Foundry Grid */}
      <div className="mt-4 flex items-center justify-between border-t border-line/50 pt-3">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-1.5">
            {models.map(({ Icon, color, label }) => (
              <span
                key={label}
                title={label}
                className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-void border border-line hover:scale-110 transition-transform shadow-sm"
              >
                <Icon size={14} color={color} aria-label={label} />
              </span>
            ))}
          </div>
          <span className="font-mono text-[10px] text-dim">Multi-LLM Swarm</span>
        </div>
        <span className="rounded-full bg-signal/10 border border-signal/30 px-2 py-0.5 font-mono text-[10px] text-signal font-medium">
          LangChain · PyTorch
        </span>
      </div>
    </Card>
  );
}

/* Slot 3 — statistic tile: 200+ team members led */
function StatCard() {
  return (
    <Card className="relative w-full overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(#e5e2e1 1px, transparent 1px)',
          backgroundSize: '16px 16px',
        }}
      />
      <div className="relative z-10 flex h-full flex-col items-center justify-center gap-2 p-6">
        <CountUp to={200} suffix="+" className="font-geist text-7xl font-bold text-ash/90 md:text-8xl" />
        <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-dim">
          People led across teams
        </span>
      </div>
    </Card>
  );
}

/* Slot 4 — Automation */
function AutomationCard() {
  const { title, description } = aboutCards.automation;
  const reduced = useReducedMotion();
  return (
    <Card>
      <div className="flex h-full flex-col justify-between p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-medium text-ash">{title}</h3>
            <p className="mt-1 text-sm text-dim">{description}</p>
          </div>
          <span className="inline-flex shrink-0 items-center rounded-full border border-signal/40 px-2.5 py-0.5 text-xs font-semibold text-signal">
            Always on
          </span>
        </div>
        <div className="mt-4">
          <span className="font-geist text-6xl font-bold text-ash">24/7</span>
        </div>
        {/* Packets moving down the pipeline */}
        <div className="relative mt-4 h-px w-full bg-line" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="absolute -top-[3px] h-[7px] w-[7px] rounded-full bg-signal"
              animate={reduced ? undefined : { left: ['0%', '97%'], opacity: [0, 1, 0] }}
              transition={{ duration: 2.6, repeat: Infinity, delay: i * 0.85, ease: 'linear' }}
            />
          ))}
        </div>
        <div className="mt-3 flex justify-between text-xs text-dim">
          <span>Pipelines &amp; workflows</span>
          <span>Intelligent agents</span>
        </div>
      </div>
    </Card>
  );
}

/* Slot 5 — Managing Large Teams */
function TeamsCard() {
  const { title, description } = aboutCards.teams;
  return (
    <Card>
      <div className="flex h-full flex-col justify-end p-6">
        <h3 className="text-base font-medium text-ash">{title}</h3>
        <p className="mt-1 text-sm text-dim">{description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {experiences.map(({ id, organization }) => (
            <span
              key={id}
              className="rounded-full border border-line bg-void px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-dim"
            >
              {organization}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
}

/* Slot 6 — wide card: Project Execution */
function ExecutionCard() {
  const { title, description } = aboutCards.execution;
  return (
    <Card className="flex flex-col justify-between p-6 md:p-7">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-md">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-signal/10 border border-signal/20 text-signal">
              <Rocket size={18} />
            </div>
            <h3 className="font-geist text-xl font-bold text-ash">{title}</h3>
          </div>
          <p className="mt-1.5 text-xs leading-relaxed text-dim">{description}</p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-signal bg-signal/10 border border-signal/20 px-2.5 py-1 rounded-md">
              <Zap size={11} /> 0 → 1 Ship Velocity
            </span>
            <span className="font-mono text-[10px] text-dim">
              Scrum Master · Jira Power User
            </span>
          </div>
        </div>

        {/* Executive KPI Delivery Scoreboard */}
        <div className="grid grid-cols-3 gap-3 border-y border-line/60 py-3 lg:border-y-0 lg:border-l lg:pl-6 lg:py-0">
          <div className="text-center lg:text-left">
            <p className="font-geist text-2xl font-bold text-ash">99.4%</p>
            <p className="font-mono text-[10px] uppercase tracking-wider text-dim">Sprint Delivery</p>
          </div>
          <div className="text-center lg:text-left">
            <p className="font-geist text-2xl font-bold text-emerald-400">4.2d</p>
            <p className="font-mono text-[10px] uppercase tracking-wider text-dim">Cycle Time</p>
          </div>
          <div className="text-center lg:text-left">
            <p className="font-geist text-2xl font-bold text-signal">Zero</p>
            <p className="font-mono text-[10px] uppercase tracking-wider text-dim">Blocker Tolerance</p>
          </div>
        </div>
      </div>

      {/* Interactive 4-Phase Delivery Pipeline */}
      <div className="mt-6 pt-5 border-t border-line/60">
        <div className="mb-2.5 flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-widest text-dim/70">
            Lifecycle Delivery Pipeline
          </span>
          <span className="font-mono text-[10px] text-emerald-400 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Sprint 14 Active
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg border border-line bg-void/60 p-3 hover:border-signal/40 transition-colors">
            <div className="flex items-center justify-between text-[10px] font-mono text-dim">
              <span>01. SCOPING</span>
              <span className="text-emerald-400">✓ Done</span>
            </div>
            <p className="mt-1 font-geist text-xs font-semibold text-ash">PRD & User Stories</p>
            <p className="text-[10px] text-dim mt-0.5">Jira Epics · Stakeholder Sync</p>
          </div>

          <div className="rounded-lg border border-line bg-void/60 p-3 hover:border-signal/40 transition-colors">
            <div className="flex items-center justify-between text-[10px] font-mono text-dim">
              <span>02. BUILD</span>
              <span className="text-emerald-400">✓ Done</span>
            </div>
            <p className="mt-1 font-geist text-xs font-semibold text-ash">Architecture & AI</p>
            <p className="text-[10px] text-dim mt-0.5">YOLO · TensorRT · APIs</p>
          </div>

          <div className="rounded-lg border border-signal/40 bg-signal/5 p-3 relative overflow-hidden">
            <div className="flex items-center justify-between text-[10px] font-mono text-signal">
              <span>03. HARDEN</span>
              <span className="animate-pulse">● In Sprint</span>
            </div>
            <p className="mt-1 font-geist text-xs font-semibold text-ash">Benchmarking & QA</p>
            <p className="text-[10px] text-dim mt-0.5">Edge Latency · Stress Tests</p>
          </div>

          <div className="rounded-lg border border-line bg-void/60 p-3 hover:border-signal/40 transition-colors">
            <div className="flex items-center justify-between text-[10px] font-mono text-dim">
              <span>04. SHIP</span>
              <span className="text-cyan-400">Ready</span>
            </div>
            <p className="mt-1 font-geist text-xs font-semibold text-ash">Production Deploy</p>
            <p className="text-[10px] text-dim mt-0.5">Mahindra Press Shop & PCU</p>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function About() {
  return (
    <section id="about" className="relative mx-auto max-w-7xl px-6 py-28 md:py-32">
      <GhostNumber depth={0.35} className="-top-10 right-0">
        01
      </GhostNumber>
      <SectionHeading
        index={1}
        label="Who am I"
        title={aboutSection.title}
        subtitle={aboutSection.subtitle}
        className="mb-8"
      />

      {/* Executive KPI Scorecard from GitHub Dossier */}
      <div className="mb-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-line bg-graphite/70 p-5 border-t-2 border-t-cyan-400">
          <p className="font-geist text-3xl font-bold text-cyan-400">0 → 1</p>
          <p className="mt-1 font-geist text-sm font-semibold text-ash">AI Product Builder</p>
          <p className="mt-0.5 font-mono text-[11px] text-dim">Datasets · Models · Edge Silicon</p>
        </div>
        <div className="rounded-xl border border-line bg-graphite/70 p-5 border-t-2 border-t-signal">
          <p className="font-geist text-3xl font-bold text-signal">150+</p>
          <p className="mt-1 font-geist text-sm font-semibold text-ash">Workforce Directed</p>
          <p className="mt-0.5 font-mono text-[11px] text-dim">Student Council Cultural President</p>
        </div>
        <div className="rounded-xl border border-line bg-graphite/70 p-5 border-t-2 border-t-purple-400">
          <p className="font-geist text-3xl font-bold text-purple-400">9.1 / 10</p>
          <p className="mt-1 font-geist text-sm font-semibold text-ash">University CGPA</p>
          <p className="mt-0.5 font-mono text-[11px] text-dim">B.Tech CSE&amp;T · PCU Graduating '27</p>
        </div>
        <div className="rounded-xl border border-line bg-graphite/70 p-5 border-t-2 border-t-emerald-400">
          <p className="font-geist text-3xl font-bold text-emerald-400">10,000+</p>
          <p className="mt-1 font-geist text-sm font-semibold text-ash">Festival Scale Managed</p>
          <p className="mt-0.5 font-mono text-[11px] text-dim">Anantam Festival · 3 Annual Editions</p>
        </div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="grid w-full auto-rows-[minmax(180px,auto)] grid-cols-1 gap-6 md:grid-cols-3 md:grid-rows-3"
      >
        <motion.div variants={itemVariants} className="md:col-span-1 md:row-span-3">
          <ScalableCard />
        </motion.div>
        <motion.div variants={itemVariants} className="md:col-span-1 md:row-span-1">
          <AICard />
        </motion.div>
        <motion.div variants={itemVariants} className="md:col-span-1 md:row-span-1">
          <StatCard />
        </motion.div>
        <motion.div variants={itemVariants} className="md:col-span-1 md:row-span-1">
          <AutomationCard />
        </motion.div>
        <motion.div variants={itemVariants} className="md:col-span-1 md:row-span-1">
          <TeamsCard />
        </motion.div>
        <motion.div variants={itemVariants} className="md:col-span-2 md:row-span-1">
          <ExecutionCard />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mx-auto mt-14 w-fit max-w-2xl"
      >
        <p className="relative px-8 py-4 text-center text-lg italic leading-relaxed text-dim">
          <BracketCorners cornerClassName="h-3 w-3 border-signal/50" />
          &ldquo;{aboutSection.quote}&rdquo;
        </p>
      </motion.div>
    </section>
  );
}

export default About;
