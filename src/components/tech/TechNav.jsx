import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Menu, X } from 'lucide-react';
import { cn } from '../../lib/utils';

const NAV_LINKS = [
  { id: 'about', label: 'About', href: '#about', num: '01' },
  { id: 'projects', label: 'Projects', href: '#projects', num: '02' },
  { id: 'experience', label: 'Experience', href: '#experience', num: '03' },
  { id: 'skills', label: 'Arsenal', href: '#skills', num: '04' },
  { id: 'tools', label: 'Stack', href: '#tools', num: '05' },
  { id: 'certifications', label: 'Proof', href: '#certifications', num: '06' },
  { id: 'contact', label: 'Contact', href: '#contact', num: '07' },
];

/**
 * Apple-grade Nav Bar:
 * - Real-time scrollspy wayfinding with sliding spring capsule.
 * - Translucent frosted glass with specular top-edge lighting.
 * - Fluid mobile drawer with spring dynamics.
 * - Instant touch response (WWDC §1 & §4).
 */
export function TechNav() {
  const [activeSection, setActiveSection] = useState('top');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const sectionIds = ['top', ...NAV_LINKS.map((l) => l.id)];
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((e) => e.isIntersecting);
        if (visibleEntries.length > 0) {
          // Sort by distance to top or highest intersection ratio
          const best = visibleEntries.reduce((prev, curr) =>
            curr.intersectionRatio > prev.intersectionRatio ? curr : prev,
          );
          setActiveSection(best.target.id);
        }
      },
      {
        rootMargin: '-20% 0px -55% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[80] border-b border-white/[0.08] bg-[#0a0a0a]/75 backdrop-blur-2xl shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        {/* Subtle specular edge */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent" />

        <nav className="mx-auto flex h-14 max-w-7xl items-center justify-between px-5 md:px-8">
          {/* Back to Universe Pill */}
          <Link
            to="/"
            className="group inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.22em] text-dim transition-all duration-200 hover:border-signal/40 hover:bg-white/[0.06] hover:text-signal active:scale-95"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-1" aria-hidden="true" />
            <span>Universe</span>
          </Link>

          {/* Desktop Nav with Sliding Active Capsule */}
          <div className="hidden items-center gap-1.5 rounded-full border border-white/[0.06] bg-white/[0.02] p-1 md:flex">
            {NAV_LINKS.map(({ id, label, href }) => {
              const isActive = activeSection === id;
              return (
                <a
                  key={id}
                  href={href}
                  className={cn(
                    'relative px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors duration-200 select-none active:scale-95',
                    isActive ? 'text-white font-semibold' : 'text-dim hover:text-ash',
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavPill"
                      className="absolute inset-0 rounded-full bg-white/[0.1] border border-white/15 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]"
                      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                    />
                  )}
                  <span className="relative z-10">{label}</span>
                </a>
              );
            })}
          </div>

          {/* Quick CTA button */}
          <div className="hidden md:flex items-center">
            <a
              href="#contact"
              className="inline-flex items-center justify-center rounded-full bg-signal/10 border border-signal/30 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-signal transition-all duration-200 hover:bg-signal/20 hover:border-signal/60 active:scale-95"
            >
              Get in Touch
            </a>
          </div>

          {/* Mobile Hamburger / X Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-ash transition-all active:scale-90 md:hidden"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </nav>
      </header>

      {/* Mobile Frosted Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            className="fixed inset-x-0 top-14 z-[75] border-b border-white/10 bg-[#0c0c0e]/95 p-5 shadow-2xl backdrop-blur-2xl md:hidden"
          >
            <div className="flex flex-col gap-2">
              {NAV_LINKS.map(({ id, label, href, num }) => {
                const isActive = activeSection === id;
                return (
                  <a
                    key={id}
                    href={href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center justify-between rounded-xl px-4 py-3 font-mono text-xs uppercase tracking-wider transition-all active:scale-98',
                      isActive
                        ? 'bg-signal/15 text-signal font-semibold border border-signal/30'
                        : 'text-ash hover:bg-white/[0.05] border border-transparent',
                    )}
                  >
                    <span>{label}</span>
                    <span className="text-[10px] text-dim font-mono">{num}</span>
                  </a>
                );
              })}

              <div className="mt-2 pt-3 border-t border-line/60">
                <a
                  href="#contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex w-full items-center justify-center rounded-xl bg-signal py-3 font-mono text-xs font-bold uppercase tracking-wider text-[#0a0a0a] active:scale-98"
                >
                  Connect Directly
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default TechNav;
