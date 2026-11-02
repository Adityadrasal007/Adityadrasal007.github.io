import { useState } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { Grid3X3, Layers, LayoutList } from 'lucide-react';
import { SectionHeading } from '../ui/SectionHeading';
import { GhostNumber } from '../ui/GhostNumber';
import { experiences } from '../../data/techData';
import { cn } from '../../lib/utils';

/*
 * Experience — tech_component/experience.txt (morphing-card-stack):
 * three layout modes (stack / grid / list) morphing via shared
 * layoutIds, swipeable top card, pagination dots.
 */

const layoutIcons = {
  stack: Layers,
  grid: Grid3X3,
  list: LayoutList,
};

const SWIPE_THRESHOLD = 50;

export function Experience() {
  const cards = experiences;
  const [layout, setLayout] = useState('stack');
  const [expandedCard, setExpandedCard] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnd = (event, info) => {
    const { offset, velocity } = info;
    const swipe = Math.abs(offset.x) * velocity.x;

    if (offset.x < -SWIPE_THRESHOLD || swipe < -1000) {
      setActiveIndex((prev) => (prev + 1) % cards.length);
    } else if (offset.x > SWIPE_THRESHOLD || swipe > 1000) {
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
    return reordered.reverse(); // top card renders last (on top)
  };

  const getLayoutStyles = (stackPosition) => {
    switch (layout) {
      case 'stack':
        return {
          top: stackPosition * 8,
          left: stackPosition * 8,
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
        02
      </GhostNumber>
      <SectionHeading
        index={2}
        label="Impact"
        title="Where I've Made an Impact"
        className="mb-12"
      />

      <div className="space-y-6">
        {/* Layout toggle */}
        <div className="mx-auto flex w-fit items-center justify-center gap-1 rounded-lg bg-panel/60 p-1">
          {Object.keys(layoutIcons).map((mode) => {
            const Icon = layoutIcons[mode];
            return (
              <button
                key={mode}
                type="button"
                onClick={() => setLayout(mode)}
                className={cn(
                  'cursor-pointer rounded-md p-2 transition-all',
                  layout === mode
                    ? 'bg-ash text-[#0a0a0a]'
                    : 'text-dim hover:bg-panel hover:text-ash',
                )}
                aria-label={`Switch to ${mode} layout`}
                aria-pressed={layout === mode}
              >
                <Icon className="h-4 w-4" />
              </button>
            );
          })}
        </div>

        {/* Cards */}
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
                      scale: isExpanded ? 1.05 : 1,
                      x: 0,
                      ...styles,
                    }}
                    exit={{ opacity: 0, scale: 0.8, x: -200 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    drag={isTopCard ? 'x' : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.7}
                    onDragStart={() => setIsDragging(true)}
                    onDragEnd={handleDragEnd}
                    whileDrag={{ scale: 1.02, cursor: 'grabbing' }}
                    onClick={() => {
                      if (isDragging) return;
                      setExpandedCard(isExpanded ? null : card.id);
                    }}
                    className={cn(
                      'cursor-pointer rounded-xl border border-line bg-graphite p-5',
                      'transition-colors hover:border-signal/50',
                      layout === 'stack' && 'absolute h-80 w-full',
                      layout === 'stack' && isTopCard && 'cursor-grab active:cursor-grabbing',
                      layout === 'grid' && 'w-full',
                      layout === 'list' && 'w-full',
                      isExpanded && 'ring-2 ring-signal',
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-panel text-signal">
                        <CardIcon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-lg font-semibold text-ash">{card.title}</h3>
                        <p className="truncate font-mono text-xs uppercase tracking-widest text-signal/80">
                          {card.organization}
                        </p>
                        <p
                          className={cn(
                            'mt-2 text-sm leading-relaxed text-dim',
                            layout === 'stack' && 'line-clamp-6 md:line-clamp-none',
                            layout === 'grid' && 'line-clamp-4',
                            layout === 'list' && 'line-clamp-2',
                          )}
                        >
                          {card.description}
                        </p>
                        <span className="mt-3 inline-flex items-center rounded-full border border-line bg-void px-2.5 py-0.5 text-[11px] font-medium text-dim">
                          {card.tag}
                        </span>
                      </div>
                    </div>

                    {isTopCard && (
                      <div className="absolute inset-x-0 bottom-2 text-center">
                        <span className="text-xs text-dim/60">Swipe to navigate</span>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </LayoutGroup>

        {/* Dots */}
        {layout === 'stack' && cards.length > 1 && (
          <div className="flex justify-center gap-1.5">
            {cards.map((card, index) => (
              <button
                key={card.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={cn(
                  'h-1.5 cursor-pointer rounded-full transition-all',
                  index === activeIndex
                    ? 'w-4 bg-signal'
                    : 'w-1.5 bg-dim/30 hover:bg-dim/50',
                )}
                aria-label={`Go to card ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Experience;
