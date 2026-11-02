import { useRef } from 'react';
import { ScanEye } from 'lucide-react';
import { SectionHeading } from '../ui/SectionHeading';
import { TiltCard } from '../ui/TiltCard';
import { GhostNumber } from '../ui/GhostNumber';
import { BracketCorners } from '../ui/BracketCorners';
import { gsap } from '../../lib/gsap';
import { useGsapScene } from '../../hooks/useGsapScene';
import { skillCategories } from '../../data/techData';
import { cn } from '../../lib/utils';

/*
 * Skills — "Technical Arsenal" as an asymmetric bento grid.
 * Card size follows content density: AI & Computer Vision is the
 * flagship (7/12 wide, two rows), Frontend and Backend stack beside
 * it, the remaining domains share the bottom row. Cards rise with a
 * scroll-scrubbed 3D reveal and tilt toward the pointer.
 */

const totalSkills = skillCategories.reduce((sum, category) => sum + category.skills.length, 0);

// lg spans keyed by category id — asymmetric by content density
const SPANS = {
  'ai-cv': 'md:col-span-2 lg:col-span-7 lg:row-span-2',
  frontend: 'lg:col-span-5',
  backend: 'lg:col-span-5',
  languages: 'lg:col-span-4',
  database: 'lg:col-span-4',
  devops: 'lg:col-span-4',
};

function SkillChip({ label, hue, large = false }) {
  return (
    <span
      className={cn(
        'rounded-full border px-3 py-1 font-medium text-gray-200 transition-colors duration-300',
        large ? 'text-sm md:px-3.5 md:py-1.5' : 'text-xs',
      )}
      style={{ borderColor: `${hue}30`, backgroundColor: `${hue}0d` }}
    >
      {label}
    </span>
  );
}

function CategoryCard({ category, featured = false }) {
  const { Icon, name, hue, skills } = category;

  return (
    <TiltCard
      maxTilt={featured ? 4 : 6}
      data-skill-card
      className="h-full rounded-xl border border-line bg-graphite transition-colors duration-300 hover:border-signal/40"
    >
      <div
        className="flex h-full flex-col p-6 md:p-7"
        style={{
          background: `linear-gradient(135deg, ${hue}1f 0%, transparent 50%), radial-gradient(110% 80% at 100% 100%, ${hue}10, transparent 60%)`,
        }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span
              className={cn(
                'flex items-center justify-center rounded-lg',
                featured ? 'h-12 w-12' : 'h-10 w-10',
              )}
              style={{ backgroundColor: `${hue}22`, color: hue }}
            >
              <Icon className={featured ? 'h-6 w-6' : 'h-5 w-5'} aria-hidden="true" />
            </span>
            <div>
              <h3
                className={cn(
                  'font-geist font-bold leading-tight text-ash',
                  featured ? 'text-2xl md:text-3xl' : 'text-lg',
                )}
              >
                {name}
              </h3>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-dim">
                {String(skills.length).padStart(2, '0')} technologies
              </p>
            </div>
          </div>
          {featured && (
            <span className="relative hidden shrink-0 items-center gap-2 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-signal sm:inline-flex">
              <BracketCorners cornerClassName="h-2 w-2 border-signal/60" />
              Primary domain
            </span>
          )}
        </div>

        {featured && (
          <p className="mt-5 max-w-md text-sm leading-relaxed text-dim">
            Where I spend most of my time — detection models, image pipelines and LLM-powered
            systems tuned for the real world, not the demo.
          </p>
        )}

        <div className={cn('flex flex-wrap gap-2', featured ? 'mt-6' : 'mt-5')}>
          {skills.map((skill) => (
            <SkillChip key={skill} label={skill} hue={hue} large={featured} />
          ))}
        </div>

        {featured && (
          <div className="mt-auto hidden items-center justify-between pt-6 lg:flex">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-dim/70">
              YOLO · OpenCV · LLM pipelines
            </span>
            <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-dim">
              <ScanEye className="h-3.5 w-3.5 text-signal" aria-hidden="true" />
              conf 0.99
            </span>
          </div>
        )}
      </div>
    </TiltCard>
  );
}

export function Skills() {
  const sectionRef = useRef(null);

  // Scroll-scrubbed rise: each card tracks the scrollbar 1:1 while entering
  useGsapScene(sectionRef, () => {
    gsap.utils.toArray('[data-skill-card]').forEach((card) => {
      gsap.fromTo(
        card,
        { y: 90, opacity: 0, rotateX: 9, transformPerspective: 900 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            start: 'top 96%',
            end: 'top 58%',
            scrub: true,
          },
        },
      );
    });
  });

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative mx-auto max-w-7xl px-6 py-28 md:py-32"
    >
      <GhostNumber depth={0.4} className="-top-10 right-0">
        03
      </GhostNumber>

      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <SectionHeading
          index={3}
          label="Arsenal"
          title="Technical Arsenal"
          subtitle="Tools & Technologies"
          align="left"
          className="mb-0"
        />
        <p className="shrink-0 font-mono text-[11px] uppercase tracking-[0.3em] text-dim md:mb-2">
          {totalSkills} technologies <span className="text-signal">/</span>{' '}
          {skillCategories.length} domains
        </p>
      </div>

      <div
        className="mt-12 grid auto-rows-[minmax(150px,auto)] grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-12"
        style={{ perspective: '1200px' }}
      >
        {skillCategories.map((category) => (
          <div key={category.id} className={cn('min-w-0', SPANS[category.id])}>
            <CategoryCard category={category} featured={category.id === 'ai-cv'} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default Skills;
