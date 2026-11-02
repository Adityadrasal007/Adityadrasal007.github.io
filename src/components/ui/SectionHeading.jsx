import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

/**
 * Section header — title and optional subtitle with a scroll reveal.
 * Section numbering lives in the oversized GhostNumber layers, so the
 * heading itself stays quiet.
 */
export function SectionHeading({ title, subtitle, align = 'center', className }) {
  const centered = align === 'center';

  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={cn(
        'relative z-10 flex flex-col',
        centered ? 'items-center text-center' : 'items-start text-left',
        className,
      )}
    >
      <h2 className="font-geist text-4xl font-bold tracking-tight text-ash md:text-5xl">
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            'mt-4 max-w-2xl text-base leading-relaxed text-dim md:text-lg',
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
