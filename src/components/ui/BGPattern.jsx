import { cn } from '../../lib/utils';

const maskClasses = {
  'fade-edges': '[mask-image:radial-gradient(ellipse_at_center,black,transparent)]',
  'fade-center': '[mask-image:radial-gradient(ellipse_at_center,transparent,black)]',
  'fade-top': '[mask-image:linear-gradient(to_bottom,transparent,black)]',
  'fade-bottom': '[mask-image:linear-gradient(to_bottom,black,transparent)]',
  'fade-left': '[mask-image:linear-gradient(to_right,transparent,black)]',
  'fade-right': '[mask-image:linear-gradient(to_right,black,transparent)]',
  'fade-x': '[mask-image:linear-gradient(to_right,transparent,black,transparent)]',
  'fade-y': '[mask-image:linear-gradient(to_bottom,transparent,black,transparent)]',
  none: '',
};

function getBgImage(variant, fill, size) {
  switch (variant) {
    case 'dots':
      return `radial-gradient(${fill} 1px, transparent 1px)`;
    case 'grid':
      return `linear-gradient(to right, ${fill} 1px, transparent 1px), linear-gradient(to bottom, ${fill} 1px, transparent 1px)`;
    case 'diagonal-stripes':
      return `repeating-linear-gradient(45deg, ${fill}, ${fill} 1px, transparent 1px, transparent ${size}px)`;
    case 'horizontal-lines':
      return `linear-gradient(to bottom, ${fill} 1px, transparent 1px)`;
    case 'vertical-lines':
      return `linear-gradient(to right, ${fill} 1px, transparent 1px)`;
    case 'checkerboard':
      return `linear-gradient(45deg, ${fill} 25%, transparent 25%), linear-gradient(-45deg, ${fill} 25%, transparent 25%), linear-gradient(45deg, transparent 75%, ${fill} 75%), linear-gradient(-45deg, transparent 75%, ${fill} 75%)`;
    default:
      return undefined;
  }
}

export function BGPattern({
  variant = 'grid',
  mask = 'none',
  size = 24,
  fill = '#1c1c20',
  className,
  style,
  ...props
}) {
  return (
    <div
      aria-hidden="true"
      className={cn('absolute inset-0 -z-10 size-full', maskClasses[mask], className)}
      style={{
        backgroundImage: getBgImage(variant, fill, size),
        backgroundSize: `${size}px ${size}px`,
        ...style,
      }}
      {...props}
    />
  );
}

export default BGPattern;
