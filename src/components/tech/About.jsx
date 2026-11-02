import { motion, useReducedMotion } from 'framer-motion';
import { RiOpenaiFill } from 'react-icons/ri';
import { SiAnthropic, SiGooglegemini } from 'react-icons/si';
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
      maxTilt={5}
      className={cn(
        'h-full rounded-lg border border-line bg-graphite shadow-sm transition-colors duration-300 hover:border-signal/40',
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
    <Card className="flex flex-col">
      <div className="flex flex-col space-y-1.5 p-6">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-signal/10">
          <Icon className="h-6 w-6 text-signal" aria-hidden="true" />
        </div>
        <h3 className="text-2xl font-semibold leading-none tracking-tight text-ash">{title}</h3>
        <p className="pt-2 text-sm leading-relaxed text-dim">{description}</p>
      </div>

      {/* How every build starts */}
      <div className="mx-6 rounded-md border border-line bg-void/70 p-4 font-mono text-[11px] leading-relaxed text-dim">
        <div>
          <span className="text-signal">const</span> product = <span className="text-signal">build</span>
          {'({'}
        </div>
        <div className="pl-4">
          architecture: <span className="text-ash">&apos;clean&apos;</span>,
        </div>
        <div className="pl-4">
          scale: <span className="text-ash">&apos;production&apos;</span>,
        </div>
        <div className="pl-4">
          tech_debt: <span className="text-ash">0</span>,
        </div>
        <div>
          {'});'} <span className="text-dim/50">// then ship it</span>
        </div>
        <div className="mt-2 text-signal">
          &gt; deployed <span className="hud-blink">▌</span>
        </div>
      </div>

      {/* Release checks */}
      <div className="mx-6 mt-4 rounded-md border border-line bg-void/40 p-4 font-mono text-[11px]">
        <p className="mb-2.5 text-[9px] uppercase tracking-[0.3em] text-dim/70">Release checks</p>
        <div className="space-y-1.5">
          {[
            { label: 'lint', value: 'passed' },
            { label: 'tests', value: '142 / 142' },
            { label: 'build', value: '4.8s' },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between text-dim">
              <span>
                <span className="mr-2 text-emerald-400">✓</span>
                {label}
              </span>
              <span className="text-dim/60">{value}</span>
            </div>
          ))}
          <div className="flex items-center justify-between text-ash">
            <span>
              <span className="mr-2 text-signal">▲</span>deploy
            </span>
            <span className="text-signal">production</span>
          </div>
        </div>
      </div>

      {/* Working principles */}
      <ul className="mx-6 mb-6 mt-5 space-y-2.5 pb-1">
        {[
          'Clean architecture over clever hacks',
          'Maintainable code, measured twice',
          'Production-ready from day one',
        ].map((principle) => (
          <li key={principle} className="flex items-start gap-2.5 text-sm leading-snug text-dim">
            <span className="mt-0.5 font-mono text-signal" aria-hidden="true">
              /
            </span>
            {principle}
          </li>
        ))}
      </ul>
    </Card>
  );
}

/* Slot 2 — Working with AI */
function AICard() {
  const { title, description } = aboutCards.ai;
  const models = [
    { Icon: RiOpenaiFill, color: '#10a37f', label: 'OpenAI' },
    { Icon: SiAnthropic, color: '#d97757', label: 'Anthropic' },
    { Icon: SiGooglegemini, color: '#4285f4', label: 'Gemini' },
  ];
  return (
    <Card>
      <div className="flex h-full flex-col justify-between p-6">
        <div>
          <h3 className="text-base font-medium text-ash">{title}</h3>
          <p className="mt-1 text-sm text-dim">{description}</p>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex -space-x-2">
            {models.map(({ Icon, color, label }) => (
              <span
                key={label}
                title={label}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-panel ring-2 ring-graphite"
              >
                <Icon size={16} color={color} aria-label={label} />
              </span>
            ))}
          </div>
          <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-dim">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal/60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
            </span>
            Models online
          </span>
        </div>
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
    <Card>
      <div className="flex h-full flex-wrap items-center justify-between gap-4 p-6">
        <div className="min-w-0 max-w-xl">
          <h3 className="text-base font-medium text-ash">{title}</h3>
          <p className="mt-1 text-sm text-dim">{description}</p>
          <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.25em] text-dim">
            Plan <span className="text-signal">→</span> Build <span className="text-signal">→</span>{' '}
            <span className="text-signal">Ship</span>
          </p>
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
        className="mb-12"
      />

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
