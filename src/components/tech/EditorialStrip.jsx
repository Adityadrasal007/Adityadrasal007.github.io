import { useRef } from 'react';
import { gsap } from '../../lib/gsap';
import { useGsapScene } from '../../hooks/useGsapScene';

/*
 * Editorial type strip — two oversized lines of the site's own
 * vocabulary sliding in opposite directions, scrubbed 1:1 with the
 * scrollbar. Sits between sections and intentionally overlaps their
 * whitespace for the large-type editorial feel.
 */

export function EditorialStrip({
  primary = 'ENGINEER × LEADER × BUILDER — ',
  secondary = 'VISION MODELS · EVENTS · AUTOMATION · ',
}) {
  const ref = useRef(null);

  useGsapScene(ref, () => {
    const scrub = {
      trigger: ref.current,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    };
    gsap.fromTo('[data-strip="a"]', { xPercent: 4 }, { xPercent: -14, ease: 'none', scrollTrigger: scrub });
    gsap.fromTo('[data-strip="b"]', { xPercent: -16 }, { xPercent: 2, ease: 'none', scrollTrigger: scrub });
  });

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none relative -my-14 select-none overflow-hidden py-10 md:-my-20"
    >
      <div
        data-strip="a"
        className="whitespace-nowrap font-geist text-[clamp(4.5rem,11vw,10rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.04em] text-ash/[0.06] will-change-transform"
      >
        {primary.repeat(3)}
      </div>
      <div
        data-strip="b"
        className="-mt-4 whitespace-nowrap font-geist text-[clamp(4.5rem,11vw,10rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.04em] text-transparent will-change-transform md:-mt-8"
        style={{ WebkitTextStroke: '1px rgba(255, 178, 36, 0.13)' }}
      >
        {secondary.repeat(3)}
      </div>
    </div>
  );
}

export default EditorialStrip;
