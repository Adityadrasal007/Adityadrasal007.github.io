import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SectionHeading } from '../ui/SectionHeading';
import { GhostNumber } from '../ui/GhostNumber';
import { recommendations } from '../../data/techData';
import { cn } from '../../lib/utils';

/*
 * Recommendations — tech_component/recommendation.txt
 * (StaggerTestimonials): an arc of folded-corner cards, light card in
 * the center, click or arrows to rotate through all twenty quotes.
 */

const SQRT_5000 = Math.sqrt(5000);

function TestimonialCard({ position, testimonial, handleMove, cardSize }) {
  const isCenter = position === 0;

  return (
    <div
      onClick={() => handleMove(position)}
      className={cn(
        'absolute left-1/2 top-1/2 cursor-pointer p-8 transition-all duration-500 ease-in-out',
        isCenter
          ? 'z-10 border-none bg-[#EFEFEF] text-black'
          : 'z-0 border border-gray-800 bg-[#111111] text-white hover:border-gray-600',
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
        boxShadow: isCenter ? '0px 20px 40px -10px rgba(0,0,0,0.5)' : '0px 0px 0px 0px transparent',
      }}
    >
      {/* Folded corner element */}
      <span
        className={cn(
          'absolute block origin-top-right rotate-45',
          isCenter ? 'bg-gray-300' : 'bg-gray-800',
        )}
        style={{ right: -2, top: 48, width: SQRT_5000, height: 2 }}
      />

      <img
        src={testimonial.imgSrc}
        alt={testimonial.by.split(',')[0]}
        loading="lazy"
        className="mb-6 h-14 w-14 rounded-sm object-cover object-center grayscale transition-all duration-300 hover:grayscale-0"
        style={{
          boxShadow: isCenter ? '3px 3px 0px rgba(0,0,0,0.1)' : '3px 3px 0px rgba(255,255,255,0.05)',
        }}
      />

      <h3
        className={cn(
          'text-base font-medium leading-relaxed tracking-tight sm:text-xl',
          isCenter ? 'text-gray-900' : 'text-gray-200',
        )}
      >
        &ldquo;{testimonial.testimonial}&rdquo;
      </h3>

      <p
        className={cn(
          'absolute bottom-8 left-8 right-8 mt-4 text-sm font-medium',
          isCenter ? 'text-gray-600' : 'text-gray-400',
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

  const handleMove = (steps) => {
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
    <section id="recommendations" className="relative overflow-x-clip py-28 md:py-32">
      <GhostNumber depth={0.35} className="-top-4 right-2">
        06
      </GhostNumber>
      <SectionHeading
        index={6}
        label="Signals"
        title="What People Say"
        className="mb-4 px-6"
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

        {/* Navigation buttons */}
        <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-3">
          <button
            type="button"
            onClick={() => handleMove(-1)}
            className={cn(
              'flex h-12 w-12 cursor-pointer items-center justify-center rounded-full text-white transition-all',
              'border border-gray-800 bg-[#111111] hover:scale-105 hover:bg-white hover:text-black',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500',
            )}
            aria-label="Previous recommendation"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={() => handleMove(1)}
            className={cn(
              'flex h-12 w-12 cursor-pointer items-center justify-center rounded-full text-white transition-all',
              'border border-gray-800 bg-[#111111] hover:scale-105 hover:bg-white hover:text-black',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500',
            )}
            aria-label="Next recommendation"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}

export default Recommendations;
