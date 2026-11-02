import { useState } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { Grid3X3, Layers, LayoutList } from 'lucide-react';
import { SectionHeading } from '../ui/SectionHeading';
import { GhostNumber } from '../ui/GhostNumber';
import { experiences } from '../../data/techData';
import { cn } from '../../lib/utils';

/*
 * Experience — Apple Fluid Interface & Morphing Stack:
 * - Segmented layout control with spring sliding indicator (macOS style).
 * - Momentum-aware card swipe with rubber-band boundaries.
 * - Glass depth and specular highlights.
 */

const layoutIcons = {
  stack: { icon: Layers, label: 'Stack View' },
  grid: { icon: Grid3X3, label: 'Grid View' },
  list: { icon: LayoutList, label: 'List View' },
};

export function Experience() {
  const cards = experiences;
  const [layout, setLayout] = useState('stack');
  const [expandedCard, setExpandedCard] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Apple momentum projection (WWDC §6): animate to where the gesture is going
  const handleDragEnd = (event, info) => {
    const { offset, velocity } = info;
    // Deceleration projection
    const projectedEndpoint = offset.x + (velocity.x * 0.2);

    if (projectedEndpoint < -60) {
      setActiveIndex((prev) => (prev + 1) % cards.length);
    } else if (projectedEndpoint > 60) {
      setActiveIndex((prev) => (prev - 1 + cards.length) % cards.length);
    }
    setIsDragging(false);
  };

  const getStackOrder = () => {
    const reordered = [];
    for (let i = 0; i < cards.length; i++) {
      const index = (activeIndex + i) % cards.length;
      reordered.push({ ...cards[index], stackPosition: i });
    }
    return reordered.reverse(); // top card renders last
  };

  const getLayoutStyles = (stackPosition) => {
    switch (layout) {
      case 'stack':
        return {
          top: stackPosition * 9,
          left: stackPosition * 9,
          zIndex: cards.length - stackPosition,
          rotate: (stackPosition - 1) * 2,
        };
      default:
        return { top: 0, left: 0, zIndex: 1, rotate: 0 };
    }
  };

  const containerStyles = {
    stack: 'relative h-88 w-80 sm:w-104 md:w-136',
    grid: 'grid grid-cols-1 gap-5 sm:grid-cols-2 max-w-5xl',
    list: 'flex flex-col gap-4 max-w-4xl',
  };

  const displayCards =
    layout === 'stack' ? getStackOrder() : cards.map((c, i) => ({ ...c, stackPosition: i }));

  return (
    <section id="experience" className="relative mx-auto max-w-7xl px-6 py-28 md:py-32">
      <GhostNumber depth={0.35} className="-top-8 left-0">
        03
      </GhostNumber>
      <SectionHeading
        label="Engineering Journey"
        title="Where I've Made an Impact"
        subtitle="Leading teams, scaling models, and building high-performance systems"
        className="mb-12"
      />

      <div className="space-y-8">
        {/* Apple Segmented Control for Layout Mode */}
        <div className="mx-auto flex w-fit items-center justify-center gap-1 rounded-full border border-white/[0.08] bg-black/40 p-1 backdrop-blur-xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]">
          {Object.entries(layoutIcons).map(([mode, { icon: Icon, label }]) => {
            const isActive = layout === mode;
            return (
              <button
                key={mode}
                type="button"
                onClick={() => setLayout(mode)}
                className={cn(
                  'relative flex items-center gap-2 rounded-full px-4 py-2 font-mono text-xs uppercase tracking-wider transition-colors duration-200 cursor-pointer select-none active:scale-95',
                  isActive ? 'text-white font-semibold' : 'text-dim hover:text-ash',
                )}
                aria-label={label}
                aria-pressed={isActive}
              >
                {isActive && (
                  <motion.div
                    layoutId="experienceLayoutPill"
                    className="absolute inset-0 rounded-full bg-white/[0.12] border border-white/20 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]"
                    transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                  />
                )}
                <Icon className="relative z-10 h-3.5 w-3.5" />
                <span className="relative z-10 hidden sm:inline">{mode}</span>
              </button>
            );
          })}
        </div>

        {/* Morphing Cards Stack */}
        <LayoutGroup>
          <motion.div layout className={cn(containerStyles[layout], 'mx-auto')}>
            <AnimatePresence mode="popLayout">
              {displayCards.map((card) => {
                const styles = getLayoutStyles(card.stackPosition);
                const isExpanded = expandedCard === card.id;
                const isTopCard = layout === 'stack' && card.stackPosition === 0;
                const CardIcon = card.Icon;

                return (
                  <motion.div
                    key={card.id}
                    layoutId={card.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                      opacity: 1,
                      scale: isExpanded ? 1.03 : 1,
                      x: 0,
                      ...styles,
                    }}
                    exit={{ opacity: 0, scale: 0.8, x: -160 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                    drag={isTopCard ? 'x' : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.65}
                    onDragStart={() => setIsDragging(true)}
                    onDragEnd={handleDragEnd}
                    whileDrag={{ scale: 1.02, cursor: 'grabbing' }}
                    onClick={() => {
                      if (isDragging) return;
                      setExpandedCard(isExpanded ? null : card.id);
                    }}
                    className={cn(
                      'cursor-pointer rounded-2xl border border-white/[0.08] bg-[#121214]/90 p-6 backdrop-blur-xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_12px_36px_-12px_rgba(0,0,0,0.6)] transition-all hover:border-signal/50',
                      layout === 'stack' && 'absolute h-84 w-full select-none',
                      layout === 'stack' && isTopCard && 'cursor-grab active:cursor-grabbing hover:shadow-[0_16px_48px_-8px_rgba(0,0,0,0.8)]',
                      layout === 'grid' && 'w-full',
                      layout === 'list' && 'w-full',
                      isExpanded && 'ring-2 ring-signal shadow-[0_0_30px_rgba(255,178,36,0.15)]',
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-signal/10 border border-signal/20 text-signal shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]">
                        <CardIcon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate font-geist text-lg font-bold text-ash">{card.title}</h3>
                        <p className="truncate font-mono text-xs uppercase tracking-widest text-signal/90">
                          {card.organization}
                        </p>
                        <p
                          className={cn(
                            'mt-2.5 text-xs leading-relaxed text-dim sm:text-sm',
                            layout === 'stack' && 'line-clamp-5 md:line-clamp-none',
                            layout === 'grid' && 'line-clamp-4',
                            layout === 'list' && 'line-clamp-2',
                          )}
                        >
                          {card.description}
                        </p>
                        <div className="mt-4 flex items-center justify-between">
                          <span className="inline-flex items-center rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-ash">
                            {card.tag}
                          </span>
                          {layout === 'stack' && isTopCard && (
                            <span className="font-mono text-[10px] uppercase tracking-wider text-dim/60">
                              Swipe or tap to expand
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </LayoutGroup>

        {/* Apple Dynamic Capsule Dots */}
        {layout === 'stack' && cards.length > 1 && (
          <div className="flex justify-center items-center gap-2 pt-2">
            {cards.map((card, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={cn(
                    'h-1.5 rounded-full transition-all duration-300 cursor-pointer active:scale-90',
                    isActive ? 'w-7 bg-signal shadow-[0_0_8px_rgba(255,178,36,0.6)]' : 'w-2 bg-gray-700 hover:bg-gray-500',
                  )}
                  aria-label={`Go to card ${index + 1}`}
                  aria-current={isActive}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default Experience;
