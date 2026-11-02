import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { cn } from '../../lib/utils';

/**
 * Cycles through a list of phrases with a smooth vertical ticker entrance.
 * Uses mode="popLayout" to prevent layout collapse and ensure zero baseline jitter.
 */
export function TextRotate({ words, interval = 2800, className, onIndexChange }) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduced) return undefined;
    const id = setInterval(() => {
      setIndex((i) => {
        const next = (i + 1) % words.length;
        onIndexChange?.(next);
        return next;
      });
    }, interval);
    return () => clearInterval(id);
  }, [words.length, interval, reduced, onIndexChange]);

  const word = words[index];

  return (
    <span className={cn('relative inline-flex items-center overflow-hidden leading-none', className)}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={word}
          className="inline-flex items-center whitespace-nowrap leading-none"
          aria-label={word}
          initial={{ y: '110%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={{ y: '-110%', opacity: 0 }}
          transition={{
            type: 'spring',
            stiffness: 340,
            damping: 30,
          }}
        >
          {word}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default TextRotate;
