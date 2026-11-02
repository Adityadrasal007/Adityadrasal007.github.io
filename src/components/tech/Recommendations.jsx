import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { SectionHeading } from '../ui/SectionHeading';
import { GhostNumber } from '../ui/GhostNumber';
import { recommendations } from '../../data/techData';
import { cn } from '../../lib/utils';

/*
 * Recommendations — Apple Fluid Testimonial Carousel:
 * - Fluid arc positioning with physical depth.
 * - Apple tactile feedback on navigation controls.
 * - Keyboard navigation (Left / Right arrows).
 */

const SQRT_5000 = Math.sqrt(5000);

function TestimonialCard({ position, testimonial, handleMove, cardSize }) {
  const isCenter = position === 0;

  return (
    <div
      onClick={() => handleMove(position)}
      className={cn(
        'absolute left-1/2 top-1/2 cursor-pointer p-8 transition-all duration-500 ease-out select-none',
        isCenter
          ? 'z-10 border border-white/20 bg-[#F4F4F6] text-black shadow-[0_24px_50px_-10px_rgba(0,0,0,0.65)]'
          : 'z-0 border border-white/[0.08] bg-[#121214]/90 text-white backdrop-blur-xl hover:border-white/20 shadow-[0_12px_30px_rgba(0,0,0,0.5)]',
      )}
      style={{
        width: cardSize,
        height: cardSize,
        clipPath:
          'polygon(50px 0%, calc(100% - 50px) 0%, 100% 50px, 100% 100%, calc(100% - 50px) 100%, 50px 100%, 0 100%, 0 0)',
        transform: `
          translate(-50%, -50%)
          translateX(${(cardSize / 1.5) * position}px)
          translateY(${isCenter ? -30 : position % 2 ? 15 : -15}px)
          rotate(${isCenter ? 0 : position % 2 ? 3 : -3}deg)
        `,
      }}
    >
      {/* Folded corner element */}
      <span
        className={cn(
          'absolute block origin-top-right rotate-45',
          isCenter ? 'bg-gray-300' : 'bg-white/10',
        )}
        style={{ right: -2, top: 48, width: SQRT_5000, height: 2 }}
      />

      <div className="flex items-center justify-between mb-6">
        <img
          src={testimonial.imgSrc}
          alt={testimonial.by.split(',')[0]}
          loading="lazy"
          className="h-14 w-14 rounded-xl object-cover object-center grayscale transition-all duration-300 hover:grayscale-0 shadow-md"
        />
        <Quote className={cn('h-6 w-6 opacity-30', isCenter ? 'text-black' : 'text-signal')} />
      </div>

      <h3
        className={cn(
          'text-xs sm:text-sm leading-relaxed tracking-[-0.005em] font-medium line-clamp-6',
          isCenter ? 'text-gray-900 font-semibold' : 'text-gray-200',
        )}
      >
        &ldquo;{testimonial.testimonial}&rdquo;
      </h3>

      <p
        className={cn(
          'absolute bottom-6 left-8 right-8 text-xs font-mono uppercase tracking-wider',
          isCenter ? 'text-gray-700 font-bold' : 'text-signal/90 font-medium',
        )}
      >
        — {testimonial.by}
      </p>
    </div>
  );
}

export function Recommendations() {
  const [cardSize, setCardSize] = useState(365);
  const [testimonialsList, setTestimonialsList] = useState(recommendations);

  const handleMove = useCallback((steps) => {
    const newList = [...testimonialsList];
    if (steps > 0) {
      for (let i = steps; i > 0; i--) {
        const item = newList.shift();
        if (!item) return;
        newList.push({ ...item, tempId: Math.random() });
      }
    } else {
      for (let i = steps; i < 0; i++) {
        const item = newList.pop();
        if (!item) return;
        newList.unshift({ ...item, tempId: Math.random() });
      }
    }
    setTestimonialsList(newList);
  }, [testimonialsList]);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handleMove(-1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleMove(1);
    }
  };

  useEffect(() => {
    const updateSize = () => {
      const { matches } = window.matchMedia('(min-width: 640px)');
      setCardSize(matches ? 380 : 300);
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return (
    <section
      id="recommendations"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="relative overflow-x-clip py-28 md:py-32 outline-none"
    >
      <GhostNumber depth={0.35} className="-top-4 right-2">
        06
      </GhostNumber>
      <SectionHeading
        label="Peer Endorsements"
        title="What Leaders & Peers Say"
        subtitle="Unfiltered feedback from cross-functional engineering teams, mentors, and executives"
        className="mb-6 px-6"
      />

      <div className="relative w-full overflow-hidden" style={{ height: 600 }}>
        {testimonialsList.map((testimonial, index) => {
          const position =
            testimonialsList.length % 2
              ? index - (testimonialsList.length + 1) / 2
              : index - testimonialsList.length / 2;
          return (
            <TestimonialCard
              key={testimonial.tempId}
              testimonial={testimonial}
              handleMove={handleMove}
              position={position}
              cardSize={cardSize}
            />
          );
        })}

        {/* Apple-style Translucent Control Pill */}
        <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3 rounded-full border border-white/[0.08] bg-black/60 p-1.5 backdrop-blur-2xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12),0_12px_32px_rgba(0,0,0,0.6)]">
          <motion.button
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={() => handleMove(-1)}
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-white transition-colors hover:bg-white/15 active:bg-white/20"
            aria-label="Previous recommendation"
          >
            <ChevronLeft size={18} />
          </motion.button>
          <span className="px-3 font-mono text-xs uppercase tracking-wider text-dim">
            Scroll or Use Keys
          </span>
          <motion.button
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={() => handleMove(1)}
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-white transition-colors hover:bg-white/15 active:bg-white/20"
            aria-label="Next recommendation"
          >
            <ChevronRight size={18} />
          </motion.button>
        </div>
      </div>
    </section>
  );
}

export default Recommendations;
