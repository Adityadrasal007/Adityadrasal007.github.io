import { Briefcase } from 'lucide-react';
import { GhostNumber } from '../ui/GhostNumber';
import { socialLinks, contactSection, profile } from '../../data/techData';
import { cn } from '../../lib/utils';

/*
 * Contact / Footer — tech_component/contact.txt (ContactFooter):
 * centered contact block, social row, nav pills, giant gradient
 * background name, floating brand tile and bottom fade.
 */

export function ContactFooter({ className }) {
  const { title, backgroundText, description, navLinks, copyright } = contactSection;

  return (
    <section id="contact" className={cn('relative mt-0 w-full overflow-hidden', className)}>
      <footer className="relative mt-20 border-t border-gray-800">
        <GhostNumber depth={0.3} className="left-4 top-10">
          07
        </GhostNumber>
        <div className="relative mx-auto flex min-h-[30rem] max-w-7xl flex-col justify-between p-4 py-10 sm:min-h-[35rem] md:min-h-[40rem]">
          <div className="z-20 mb-12 flex w-full flex-col sm:mb-20 md:mb-0">
            <div className="flex w-full flex-col items-center">
              <div className="mb-8 flex flex-1 flex-col items-center space-y-4">
                <div className="flex items-center gap-2">
                  <h2 className="font-geist text-4xl font-bold tracking-tight text-white md:text-5xl">
                    {title}
                  </h2>
                </div>
                <p className="w-full max-w-lg px-4 text-center font-medium leading-relaxed text-gray-400 sm:px-0">
                  {description}
                </p>
              </div>

              {/* Social links row */}
              <div className="mb-10 flex gap-6">
                {socialLinks.map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    className="text-gray-400 transition-all duration-300 hover:scale-110 hover:text-white"
                    target="_blank"
                    rel="noopener noreferrer"
                    title={label}
                  >
                    <span className="flex h-7 w-7 items-center justify-center">
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <span className="sr-only">{label}</span>
                  </a>
                ))}
              </div>

              {/* Navigation & resume links */}
              <div className="flex max-w-full flex-wrap items-center justify-center gap-6 px-4 text-sm font-medium text-gray-400">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    className={cn(
                      'transition-all duration-300',
                      link.isHighlight
                        ? 'rounded-full bg-white px-6 py-2.5 font-bold text-black shadow-lg hover:bg-gray-200 hover:shadow-white/20'
                        : 'hover:font-semibold hover:text-white',
                    )}
                    href={link.href}
                    target={link.isHighlight ? '_blank' : '_self'}
                    rel={link.isHighlight ? 'noopener noreferrer' : undefined}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="z-20 mt-20 flex flex-col items-center justify-center px-4 md:mt-24 md:px-0">
            <p className="text-center text-sm text-gray-500">{copyright}</p>
          </div>
        </div>

        {/* Large background text */}
        <div
          className="pointer-events-none absolute bottom-32 left-1/2 z-0 w-full -translate-x-1/2 select-none whitespace-nowrap bg-gradient-to-b from-gray-800/30 via-gray-900/10 to-transparent bg-clip-text px-4 text-center font-geist font-extrabold leading-none tracking-tighter text-transparent md:bottom-24"
          style={{ fontSize: 'clamp(4rem, 16vw, 14rem)' }}
          aria-hidden="true"
        >
          {backgroundText}
        </div>

        {/* Bottom floating resume button — opens the Drive resume */}
        <a
          href={profile.resume}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open resume on Google Drive"
          title="Resume"
          className="duration-400 group absolute bottom-24 left-1/2 z-30 flex -translate-x-1/2 items-center justify-center rounded-3xl border border-gray-800 bg-black/60 p-3 backdrop-blur-md transition-all drop-shadow-[0_0px_20px_rgba(255,255,255,0.1)] hover:border-signal/60 hover:drop-shadow-[0_0px_24px_rgba(255,178,36,0.15)] md:bottom-20"
        >
          <span className="flex h-12 w-12 flex-col items-center justify-center gap-1 rounded-2xl border border-gray-700 bg-gradient-to-br from-gray-800 to-black shadow-inner sm:h-16 sm:w-16 md:h-20 md:w-20">
            <Briefcase
              className="h-6 w-6 text-gray-300 drop-shadow-md transition-colors group-hover:text-signal sm:h-7 sm:w-7 md:h-8 md:w-8"
              aria-hidden="true"
            />
            <span className="hidden font-mono text-[8px] tracking-[0.25em] text-gray-500 transition-colors group-hover:text-signal md:block">
              RESUME
            </span>
          </span>
        </a>

        {/* Bottom line */}
        <div className="absolute bottom-32 left-1/2 z-10 h-[1px] w-full -translate-x-1/2 bg-gradient-to-r from-transparent via-gray-700 to-transparent backdrop-blur-sm sm:bottom-30"></div>

        {/* Bottom shadow fade */}
        <div className="pointer-events-none absolute bottom-0 z-10 h-32 w-full bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent blur-[1em]"></div>
      </footer>
    </section>
  );
}

export default ContactFooter;
