import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** True when the user asked the OS to reduce motion. */
export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** True for mouse/trackpad devices — gates hover-driven effects. */
export const hasFinePointer = () => window.matchMedia('(pointer: fine)').matches;

export { gsap, ScrollTrigger };
