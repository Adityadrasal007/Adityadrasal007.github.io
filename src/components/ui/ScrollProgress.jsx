import { motion, useScroll, useSpring } from 'framer-motion';

/** Thin amber progress bar pinned to the top of the viewport. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 150, damping: 28, mass: 0.4 });

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[90] h-[2px] origin-left bg-gradient-to-r from-signal/50 via-signal to-signal/50"
      style={{ scaleX }}
    />
  );
}

export default ScrollProgress;
