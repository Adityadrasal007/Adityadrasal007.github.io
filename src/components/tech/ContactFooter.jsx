import { motion } from 'framer-motion';
import { Briefcase, ArrowUp } from 'lucide-react';
import { GhostNumber } from '../ui/GhostNumber';
import { socialLinks, contactSection, profile } from '../../data/techData';
import { cn } from '../../lib/utils';

/*
 * Contact / Footer — Apple Industrial Craft:
 * - Tactile spring interactions on social and nav pills.
 * - Specular frosted glass resume tile.
 * - Dynamic back-to-top fluid shortcut.
 */

export function ContactFooter({ className }) {
  const { title, backgroundText, description, navLinks, copyright } = contactSection;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section id="contact" className={cn('relative mt-0 w-full overflow-hidden', className)}>
      <footer className="relative mt-20 border-t border-white/[0.08]">
        <GhostNumber depth={0.3} className="left-4 top-10">
          07
        </GhostNumber>
        <div className="relative mx-auto flex min-h-[30rem] max-w-7xl flex-col justify-between p-4 py-12 sm:min-h-[35rem] md:min-h-[40rem]">
          <div className="z-20 mb-12 flex w-full flex-col sm:mb-20 md:mb-0">
            <div className="flex w-full flex-col items-center">
              <div className="mb-8 flex flex-1 flex-col items-center space-y-4">
                <div className="flex items-center gap-2">
                  <h2 className="font-geist text-4xl font-extrabold tracking-[-0.03em] text-white md:text-5xl lg:text-6xl">
                    {title}
                  </h2>
                </div>
                <p className="w-full max-w-lg px-4 text-center text-sm leading-relaxed tracking-[-0.005em] text-dim sm:px-0 sm:text-base">
                  {description}
                </p>
              </div>

              {/* Social links row with Apple tactile springs */}
              <div className="mb-10 flex gap-4">
                {socialLinks.map(({ label, href, Icon }) => (
                  <motion.a
                    key={label}
                    href={href}
                    whileHover={{ y: -2, scale: 1.08 }}
                    whileTap={{ scale: 0.94 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] text-dim backdrop-blur-md shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] transition-colors hover:border-signal/50 hover:bg-white/[0.08] hover:text-white"
                    target="_blank"
                    rel="noopener noreferrer"
                    title={label}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                    <span className="sr-only">{label}</span>
                  </motion.a>
                ))}
              </div>

              {/* Navigation & resume links */}
              <div className="flex max-w-full flex-wrap items-center justify-center gap-4 px-4 text-xs font-mono uppercase tracking-wider text-dim">
                {navLinks.map((link) => (
                  <motion.a
                    key={link.label}
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    className={cn(
                      'transition-colors duration-200 cursor-pointer',
                      link.isHighlight
                        ? 'rounded-full bg-white px-5 py-2 font-bold text-black shadow-lg hover:bg-gray-200 hover:shadow-white/20'
                        : 'hover:text-ash',
                    )}
                    href={link.href}
                    target={link.isHighlight ? '_blank' : '_self'}
                    rel={link.isHighlight ? 'noopener noreferrer' : undefined}
                  >
                    {link.label}
                  </motion.a>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Bar: Copyright + Back to Top */}
          <div className="z-20 mt-20 flex w-full flex-col sm:flex-row items-center justify-between gap-4 px-4 md:mt-24 md:px-8 border-t border-white/[0.06] pt-6">
            <p className="text-center font-mono text-xs text-dim/70">{copyright}</p>
            <motion.button
              type="button"
              onClick={scrollToTop}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider text-dim hover:text-signal hover:border-signal/30 transition-colors"
            >
              <span>Back to Top</span>
              <ArrowUp className="h-3 w-3" />
            </motion.button>
          </div>
        </div>

        {/* Large background typography */}
        <div
          className="pointer-events-none absolute bottom-32 left-1/2 z-0 w-full -translate-x-1/2 select-none whitespace-nowrap bg-gradient-to-b from-white/[0.06] via-white/[0.02] to-transparent bg-clip-text px-4 text-center font-geist font-extrabold leading-none tracking-[-0.04em] text-transparent md:bottom-24"
          style={{ fontSize: 'clamp(4rem, 16vw, 14rem)' }}
          aria-hidden="true"
        >
          {backgroundText}
        </div>

        {/* Bottom floating resume button — Apple frosted glass tile */}
        <motion.a
          href={profile.resume}
          download="Resume-Aditya-Rasal.pdf"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Download or view Aditya Rasal's Resume"
          title="Download Resume"
          whileHover={{ y: -3, scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="group absolute bottom-24 left-1/2 z-30 flex -translate-x-1/2 items-center justify-center rounded-3xl border border-white/10 bg-black/70 p-3 backdrop-blur-2xl transition-all shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15),0_16px_40px_rgba(0,0,0,0.8)] hover:border-signal/60 hover:shadow-[0_0_30px_rgba(255,178,36,0.2)] md:bottom-20"
        >
          <span className="flex h-12 w-12 flex-col items-center justify-center gap-1 rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-transparent shadow-inner sm:h-16 sm:w-16 md:h-20 md:w-20">
            <Briefcase
              className="h-6 w-6 text-gray-300 drop-shadow-md transition-colors group-hover:text-signal sm:h-7 sm:w-7 md:h-8 md:w-8"
              aria-hidden="true"
            />
            <span className="hidden font-mono text-[8px] tracking-[0.25em] text-dim transition-colors group-hover:text-signal md:block">
              RESUME
            </span>
          </span>
        </motion.a>

        {/* Bottom hairline */}
        <div className="absolute bottom-32 left-1/2 z-10 h-[1px] w-full -translate-x-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent backdrop-blur-sm sm:bottom-30" />

        {/* Bottom shadow fade */}
        <div className="pointer-events-none absolute bottom-0 z-10 h-32 w-full bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent blur-[1em]" />
      </footer>
    </section>
  );
}

export default ContactFooter;
