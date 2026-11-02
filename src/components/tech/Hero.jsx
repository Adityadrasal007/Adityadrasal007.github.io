import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { TextScramble } from '../ui/TextScramble';
import { TextRotate } from '../ui/TextRotate';
import { useMouseDrift } from '../../hooks/useMouseDrift';
import { profile, heroRoles } from '../../data/techData';

/*
 * Hero — structure copied 1:1 from tech_component/hero.txt
 * (HeroSection04, dark variant). Content swaps per tech.txt:
 *   "1,996"             -> "AI BUILDER"
 *   "CREATIVE DESIGNER" -> "ADITYA RASAL" (scramble animation)
 *   "ALI IMAM"          -> "COMPUTER SCIENCE ENGINEER"
 * Portrait: src/assets/tech.jpg. Stacked work cards: real certificates.
 */

// Dashed grid field from hero.txt (dark variant)
const dashedGridStyle = {
  backgroundImage: `
        linear-gradient(to right, #404040 1px, transparent 1px),
        linear-gradient(to bottom, #404040 1px, transparent 1px)
      `,
  backgroundSize: '20px 20px',
  backgroundPosition: '0 0, 0 0',
  maskImage: `
        repeating-linear-gradient(
              to right,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            repeating-linear-gradient(
              to bottom,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)
      `,
  WebkitMaskImage: `
        repeating-linear-gradient(
              to right,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            repeating-linear-gradient(
              to bottom,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)
      `,
  maskComposite: 'intersect',
  WebkitMaskComposite: 'source-in',
};

export function Hero() {
  const sectionRef = useRef(null);
  const portraitRef = useRef(null);
  const reduced = useReducedMotion();

  // Camera-drift: the portrait leans a few px toward the cursor
  useMouseDrift(portraitRef, { strength: 8, rotate: 4 });
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const headlineY = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const headlineOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.15]);
  const gridY = useTransform(scrollYProgress, [0, 1], [0, -60]);


  return (
    <section ref={sectionRef} id="top" className="relative min-h-screen overflow-hidden py-20">
      <div className="relative z-20 mx-auto max-w-7xl px-6">
        {/* Headline block — scroll parallax, layout identical at rest */}
        <motion.div
          className="relative"
          style={reduced ? undefined : { y: headlineY, opacity: headlineOpacity }}
        >
          <p className="absolute -top-4 left-20 font-mono text-sm font-medium tracking-wider text-signal">
            AI BUILDER
          </p>
          <h1 className="relative z-20 text-center font-geist text-7xl font-bold tracking-[-7px] text-ash md:text-9xl md:tracking-[-14px] xl:text-[10rem] xl:tracking-[-1rem]">
            <TextScramble text="ADITYA RASAL" rescrambleOnHover />
          </h1>
          <p className="mt-5 pr-1 text-right text-lg font-thin uppercase tracking-[4px] text-dim sm:text-2xl sm:tracking-[6px] md:text-3xl">
            Computer Science Engineer
          </p>
        </motion.div>

        {/* Role list + portrait — photo reserves real flex space so it
            can never cover the roles, while still poking above the panel */}
        <div className="relative grid">
          <div className="flex justify-center pt-14">
            <div className="flex h-fit w-full max-w-xl items-end justify-between gap-6 bg-panel p-8 md:max-w-2xl md:p-10 lg:max-w-3xl">
              <div className="whitespace-nowrap text-[clamp(0.875rem,4.2vw,1.125rem)] font-semibold leading-relaxed text-ash">
                <div>/ COMPUTER SCIENCE ENGINEER</div>
                <div>/ AI PROJECT MANAGER</div>
                <div>/ AI ENGINEER</div>
              </div>
              <div
                ref={portraitRef}
                className="-mt-20 hidden shrink-0 self-start overflow-hidden bg-panel will-change-transform md:flex"
              >
                <img
                  src={profile.photo}
                  alt="Aditya Rasal portrait"
                  className="h-72 w-auto object-contain grayscale transition-all duration-500 hover:grayscale-0 lg:h-100"
                />
                <div className="rotate-180 p-2 text-left font-mono text-xs font-medium tracking-widest text-dim [writing-mode:vertical-rl]">
                  TECH UNIVERSE
                </div>
              </div>
            </div>
          </div>
          <div className="-top-10 left-1/2 flex w-full overflow-hidden bg-panel md:hidden md:w-fit">
            <img
              src={profile.photo}
              alt="Aditya Rasal portrait"
              className="h-100 w-full object-contain grayscale"
            />
            <div className="rotate-180 p-2 text-left font-mono text-xs font-medium tracking-widest text-dim [writing-mode:vertical-rl]">
              TECH UNIVERSE
            </div>
          </div>
        </div>

        {/* Recruiter HUD & Availability Pill Row */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 font-mono text-[11px] uppercase tracking-wider text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Open for 2026/2027 AI Co-Ops & Roles
          </span>
          <span className="rounded-full border border-line bg-graphite/70 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-dim">
            Focus: <span className="text-ash">Edge Computer Vision</span>
          </span>
          <span className="rounded-full border border-line bg-graphite/70 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-dim">
            Scale: <span className="text-ash">150+ Workforce</span>
          </span>
          <span className="rounded-full border border-line bg-graphite/70 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-dim">
            Location: <span className="text-ash">Pune · Relocation Ready</span>
          </span>
        </div>

        {/* Center mono statement — tagline */}
        <div className="mt-10 flex flex-col items-center justify-center text-center font-mono text-sm font-medium uppercase tracking-wider text-dim md:mt-20 md:text-base">
          <motion.div
            layout
            transition={{ layout: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } }}
            className="inline-flex h-8 items-center justify-center gap-2 whitespace-nowrap"
          >
            <span className="text-dim">I AM A</span>
            <TextRotate
              words={heroRoles.map((role) => role.toUpperCase())}
              className="font-bold text-signal"
            />
          </motion.div>
          <p className="mt-2 tracking-wider text-dim">
            ARCHITECTING SCALABLE VISION MODELS
          </p>
          <p className="mt-1 tracking-wider text-dim">
            AND ENGINEERING UNFORGETTABLE EVENTS
          </p>
        </div>

        <div className="flex justify-center pt-8">
          <a
            href="#contact"
            className="inline-flex h-11 items-center justify-center whitespace-nowrap rounded-md bg-ash px-8 text-sm font-medium text-[#0a0a0a] transition-colors hover:bg-white"
          >
            Let&apos;s Connect
          </a>
        </div>
      </div>

      {/* Dashed grid background — hero.txt dark variant, gentle scroll drift */}
      <motion.div
        className="absolute inset-0 z-0"
        style={reduced ? dashedGridStyle : { ...dashedGridStyle, y: gridY }}
      />
    </section>
  );
}

export default Hero;
