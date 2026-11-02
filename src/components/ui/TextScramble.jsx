import { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

const GLYPHS = '!<>-_\\/[]{}—=+*^?#ABCDEFGHIKLMNOPQRSTUVWXYZ0123456789';

/**
 * Decodes text through a burst of random glyphs, one character locking
 * in at a time. Re-runs on hover when `rescrambleOnHover` is set.
 */
export function TextScramble({
  text,
  as: Tag = 'span',
  className,
  tickMs = 42,
  rescrambleOnHover = false,
  ...props
}) {
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(text);
  const timer = useRef(null);

  const run = useCallback(() => {
    if (reduced) {
      setDisplay(text);
      return;
    }
    clearInterval(timer.current);
    let revealed = -3; // a few frames of pure noise before locking in
    timer.current = setInterval(() => {
      revealed += 1;
      setDisplay(
        text
          .split('')
          .map((ch, i) => {
            if (ch === ' ') return ' ';
            if (i < revealed) return ch;
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join(''),
      );
      if (revealed >= text.length) clearInterval(timer.current);
    }, tickMs);
  }, [text, reduced, tickMs]);

  useEffect(() => {
    run();
    return () => clearInterval(timer.current);
  }, [run]);

  return (
    <Tag
      className={className}
      aria-label={text}
      onMouseEnter={rescrambleOnHover ? run : undefined}
      {...props}
    >
      {display}
    </Tag>
  );
}

export default TextScramble;
