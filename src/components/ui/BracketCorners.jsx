import { cn } from '../../lib/utils';

/**
 * Detection-frame corner brackets — the visual signature of the Tech
 * Universe, borrowed from object-detection bounding boxes.
 */
export function BracketCorners({ className, cornerClassName = 'h-3.5 w-3.5 border-signal' }) {
  return (
    <span aria-hidden="true" className={cn('pointer-events-none absolute inset-0', className)}>
      <span className={cn('absolute left-0 top-0 border-l-2 border-t-2', cornerClassName)} />
      <span className={cn('absolute right-0 top-0 border-r-2 border-t-2', cornerClassName)} />
      <span className={cn('absolute bottom-0 left-0 border-b-2 border-l-2', cornerClassName)} />
      <span className={cn('absolute bottom-0 right-0 border-b-2 border-r-2', cornerClassName)} />
    </span>
  );
}

export default BracketCorners;
