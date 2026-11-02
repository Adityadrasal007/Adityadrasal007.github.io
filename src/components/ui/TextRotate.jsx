import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { cn } from '../../lib/utils';

/**
 * Cycles through a list of phrases with a staggered per-letter
 * spring entrance. Pauses entirely under reduced motion.
 */
export function TextRotate({ words, interval = 2800, className }) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduced) return undefined;
    const id = setInterval(() => setIndex((i) => (i + 1) % words.length), interval);
    return () => clearInterval(id);
  }, [words.length, interval, reduced]);

  const word = words[index];

  return (
    <span className={cn('relative inline-flex overflow-hidden py-1 align-bottom', className)}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span key={word} className="inline-block whitespace-nowrap" aria-label={word}>
          {word.split('').map((ch, i) => (
            <motion.span
              key={`${ch}-${i}`}
              className="inline-block"
              initial={{ y: '115%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '-115%', opacity: 0 }}
              transition={{
                type: 'spring',
                stiffness: 320,
                damping: 30,
                delay: i * 0.018,
              }}
            >
              {ch === ' ' ? ' ' : ch}
            </motion.span>
          ))}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default TextRotate;
