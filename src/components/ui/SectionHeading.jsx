import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

/**
 * Apple-grade Section Heading:
 * - Optical typography: size-specific negative tracking (-0.03em) on display title,
 *   inverse leading, positive tracking (+0.2em) on eyebrow labels.
 * - Smooth spring entry physics (critically damped, no awkward jump).
 */
export function SectionHeading({ label, title, subtitle, align = 'center', className }) {
  const centered = align === 'center';

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ type: 'spring', stiffness: 140, damping: 20 }}
      className={cn(
        'relative z-10 flex flex-col',
        centered ? 'items-center text-center' : 'items-start text-left',
        className,
      )}
    >
      {label && (
        <span className="mb-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-signal">
          {label}
        </span>
      )}

      <h2 className="font-geist text-3xl font-extrabold tracking-[-0.03em] text-ash sm:text-4xl md:text-5xl leading-[1.1]">
        {title}
      </h2>

      {subtitle && (
        <p
          className={cn(
            'mt-3.5 max-w-2xl text-sm leading-relaxed tracking-[-0.005em] text-dim sm:text-base md:text-lg',
            centered && 'mx-auto',
          )}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

export default SectionHeading;
