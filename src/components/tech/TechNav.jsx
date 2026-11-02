import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Skills', href: '#skills' },
  { label: 'Tools', href: '#tools' },
  { label: 'Proof', href: '#certifications' },
  { label: 'Contact', href: '#contact' },
];

/** Minimal fixed bar: route back to the landing universe + section anchors. */
export function TechNav() {
  return (
    <header className="fixed inset-x-0 top-0 z-[80] border-b border-line/60 bg-void/70 backdrop-blur-md">
      <nav className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        <Link
          to="/"
          className="group flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-dim transition-colors hover:text-signal"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" aria-hidden="true" />
          Universe
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="font-mono text-[11px] uppercase tracking-[0.2em] text-dim transition-colors hover:text-ash"
            >
              {label}
            </a>
          ))}
        </div>

        <a
          href="#contact"
          className="font-mono text-[11px] uppercase tracking-[0.2em] text-signal transition-opacity hover:opacity-80 md:hidden"
        >
          Contact
        </a>
      </nav>
    </header>
  );
}

export default TechNav;
