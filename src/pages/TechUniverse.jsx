import { useRef } from 'react';
import { ScrollProgress } from '../components/ui/ScrollProgress';
import { BGPattern } from '../components/ui/BGPattern';
import { CursorSpotlight } from '../components/ui/CursorSpotlight';
import { TechNav } from '../components/tech/TechNav';
import { Hero } from '../components/tech/Hero';
import { About } from '../components/tech/About';
import { Projects } from '../components/tech/Projects';
import { EditorialStrip } from '../components/tech/EditorialStrip';
import { Experience } from '../components/tech/Experience';
import { Skills } from '../components/tech/Skills';
import { Tools } from '../components/tech/Tools';
import { Certifications } from '../components/tech/Certifications';
import { Recommendations } from '../components/tech/Recommendations';
import { ContactFooter } from '../components/tech/ContactFooter';
import { useParallaxDepth } from '../hooks/useParallaxDepth';

/*
 * Tech Universe — section order per tech.txt:
 * Hero -> About -> Experience -> Skills -> Tools -> Certifications ->
 * Recommendations -> Contact/Footer.
 *
 * One consistent background runs beneath every section: the animated
 * grid field + vignette, a cursor spotlight above it, and GSAP
 * ScrollTrigger scrubbing the [data-depth] parallax layers.
 */
export function TechUniverse() {
  const pageRef = useRef(null);
  useParallaxDepth(pageRef);

  return (
    <div ref={pageRef} className="relative min-h-screen bg-void font-inter text-ash">
      {/* Global animated grid field + vignette overlay */}
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
        <BGPattern variant="grid" size={48} fill="#141417" className="grid-drift" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,transparent_35%,rgba(0,0,0,0.55)_100%)]" />
      </div>

      <CursorSpotlight />
      <ScrollProgress />
      <TechNav />

      <main className="relative z-10 overflow-x-clip">
        <Hero />
        <About />
        <Projects />
        <EditorialStrip />
        <Experience />
        <Skills />
        <Tools />
        <EditorialStrip
          primary="PROOF OF WORK — SHIPPED, NOT SHELVED — "
          secondary="MACHINE LEARNING · AGILE · DJANGO · PYTHON · "
        />
        <Certifications />
        <Recommendations />
        <EditorialStrip
          primary="LET'S BUILD SOMETHING EXTRAORDINARY — "
          secondary="EMAIL · WHATSAPP · LINKEDIN · GITHUB · "
        />
      </main>

      <div className="relative z-10">
        <ContactFooter />
      </div>
    </div>
  );
}

export default TechUniverse;
