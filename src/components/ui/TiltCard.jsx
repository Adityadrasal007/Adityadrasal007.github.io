import { useRef } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useMotionTemplate,
  useReducedMotion,
} from 'framer-motion';
import { cn } from '../../lib/utils';
import { BracketCorners } from './BracketCorners';

/**
 * Pointer-tracking 3D tilt surface with an optional glare highlight and
 * detection-bracket hover state. The tilt is springy and fully inert
 * under reduced motion.
 */
export function TiltCard({
  children,
  className,
  maxTilt = 8,
  glare = true,
  brackets = true,
  ...props
}) {
  const reduced = useReducedMotion();
  const ref = useRef(null);
  const rectRef = useRef(null);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);

  const springX = useSpring(rotateX, { stiffness: 260, damping: 25, mass: 0.5 });
  const springY = useSpring(rotateY, { stiffness: 260, damping: 25, mass: 0.5 });
  const glareImage = useMotionTemplate`radial-gradient(320px circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.07), transparent 62%)`;

  const handleEnter = () => {
    if (ref.current) rectRef.current = ref.current.getBoundingClientRect();
  };

  const handleMove = (event) => {
    if (reduced || !ref.current) return;
    if (!rectRef.current) rectRef.current = ref.current.getBoundingClientRect();
    const rect = rectRef.current;
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(px * maxTilt * 2);
    rotateX.set(-py * maxTilt * 2);
    glareX.set((px + 0.5) * 100);
    glareY.set((py + 0.5) * 100);
  };

  const handleLeave = () => {
    rectRef.current = null;
    rotateX.set(0);
    rotateY.set(0);
    glareX.set(50);
    glareY.set(50);
  };

  return (
    <motion.div
      ref={ref}
      onPointerEnter={handleEnter}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      style={{
        rotateX: springX,
        rotateY: springY,
        transformPerspective: 1000,
        transformStyle: 'preserve-3d',
      }}
      className={cn('group relative will-change-transform', className)}
      {...props}
    >
      {children}
      {glare && (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{ backgroundImage: glareImage }}
        />
      )}
      {brackets && (
        <BracketCorners className="opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      )}
    </motion.div>
  );
}

export default TiltCard;
