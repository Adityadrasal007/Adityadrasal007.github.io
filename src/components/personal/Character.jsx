import React, { useMemo } from 'react';

/**
 * The Cosmic Wanderer — Custom Procedural Chibi Adventurer Sprite
 *
 * Inspired by Aditya's stylized portrait:
 * - Spiky dark hair, trim beard, and warm expression
 * - Cosmic Explorer coat with trailing tail physics
 * - Glowing shoulder lantern casting dynamic ground light
 * - Distance-synchronized leg & arm kinematics
 * - Real-time dust particle emitters on run and jump
 */

export function Character({ state }) {
  const { x, y, facing, mode, distanceTraveled, isGrounded } = state;

  // Sync run cycle to actual distance traveled (prevents foot slip)
  const stepLength = 36; // px per step
  const walkPhase = (distanceTraveled / stepLength) % (Math.PI * 2);

  // Kinematic calculations for limbs and body bob
  const isMoving = mode === 'walk' || mode === 'skid';
  const isJumping = !isGrounded;

  // Leg angles in radians
  const leftLegAngle = isJumping
    ? -0.4
    : isMoving
    ? Math.sin(walkPhase) * 0.65
    : 0;

  const rightLegAngle = isJumping
    ? 0.3
    : isMoving
    ? Math.sin(walkPhase + Math.PI) * 0.65
    : 0;

  // Arm swing angles
  const leftArmAngle = isJumping
    ? -0.6
    : isMoving
    ? Math.sin(walkPhase + Math.PI) * 0.55
    : 0.1;

  const rightArmAngle = isJumping
    ? 0.5
    : isMoving
    ? Math.sin(walkPhase) * 0.55
    : -0.1;

  // Body vertical bobbing
  const bodyBobY = isJumping
    ? 0
    : isMoving
    ? -Math.abs(Math.sin(walkPhase)) * 6
    : Math.sin(Date.now() * 0.003) * 1.5;

  // Coat trailing flutter
  const coatFlutter = isMoving
    ? Math.sin(walkPhase * 1.5) * 8 - 12
    : Math.sin(Date.now() * 0.002) * 2;

  // Forward running lean
  const bodyLean = isJumping
    ? 4
    : mode === 'skid'
    ? -10
    : isMoving
    ? 8
    : 0;

  // Dust particles trail behind when running
  const dustPuffs = useMemo(() => {
    if (!isMoving || isJumping) return [];
    return [0, 1, 2].map((i) => {
      const delay = (i * 0.15) % 0.45;
      return {
        id: i,
        scale: 0.6 + i * 0.25,
        xOffset: -facing * (14 + i * 12),
        yOffset: 4 + (i % 2) * 3,
        opacity: 0.7 - i * 0.2,
      };
    });
  }, [isMoving, isJumping, facing, Math.floor(walkPhase * 2)]);

  return (
    <div
      className="absolute bottom-[130px] z-20 pointer-events-none select-none"
      style={{
        transform: `translate3d(${x}px, ${-y}px, 0)`,
        willChange: 'transform',
      }}
    >
      {/* Dynamic Lantern Ground Light Cast */}
      <div
        className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-48 h-14 rounded-full blur-xl pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(255, 180, 50, 0.35) 0%, rgba(255, 120, 0, 0.08) 60%, transparent 100%)',
          transform: `scale(${isJumping ? 0.6 : 1})`,
          opacity: isJumping ? 0.4 : 0.85,
        }}
      />

      {/* Ground Contact Shadow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-black/50 rounded-full blur-[3px]"
        style={{
          transform: `scale(${isJumping ? Math.max(0.3, 1 - y / 300) : 1})`,
          opacity: isJumping ? Math.max(0.15, 0.5 - y / 400) : 0.6,
        }}
      />

      {/* Footstep Dust Puffs */}
      {dustPuffs.map((puff) => (
        <div
          key={puff.id}
          className="absolute bottom-1 w-3.5 h-3.5 rounded-full bg-amber-200/40 blur-[1px] animate-ping"
          style={{
            left: `calc(50% + ${puff.xOffset}px)`,
            transform: `scale(${puff.scale})`,
            opacity: puff.opacity,
          }}
        />
      ))}

      {/* Character Sprite Container with Horizontal Direction Flip */}
      <div
        className="relative -left-12 -top-28 w-24 h-32 origin-bottom"
        style={{
          transform: `scaleX(${facing}) rotate(${bodyLean}deg) translateY(${bodyBobY}px)`,
          transition: 'transform 0.08s ease-out',
        }}
      >
        <svg
          viewBox="0 0 100 130"
          className="w-full h-full drop-shadow-[0_12px_16px_rgba(0,0,0,0.6)]"
        >
          <defs>
            {/* Skin Tone Gradient */}
            <linearGradient id="skinGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f3b584" />
              <stop offset="100%" stopColor="#d98c56" />
            </linearGradient>

            {/* Hair Gradient */}
            <linearGradient id="hairGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#25242b" />
              <stop offset="100%" stopColor="#141318" />
            </linearGradient>

            {/* Explorer Coat Gradient */}
            <linearGradient id="coatGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fde047" />
              <stop offset="50%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#ca8a04" />
            </linearGradient>

            {/* Trousers Gradient */}
            <linearGradient id="pantsGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#374151" />
              <stop offset="100%" stopColor="#1f2937" />
            </linearGradient>

            {/* Lantern Glow Filter */}
            <filter id="lanternGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* 1. Trailing Coat Tail (Flows in wind) */}
          <path
            d={`M 38 78 Q ${22 + coatFlutter} ${88 + coatFlutter * 0.5} ${20 + coatFlutter * 1.2} 102 L 44 94 Z`}
            fill="url(#coatGrad)"
            opacity="0.9"
          />

          {/* 2. Left Leg (Back Leg) */}
          <g
            style={{
              transformOrigin: '44px 84px',
              transform: `rotate(${leftLegAngle}rad)`,
            }}
          >
            <rect x="40" y="84" width="8" height="24" rx="4" fill="url(#pantsGrad)" />
            {/* Sneaker */}
            <rect x="38" y="104" width="13" height="7" rx="3.5" fill="#e5e7eb" />
            <path d="M 38 108 L 51 108" stroke="#f97316" strokeWidth="1.5" />
          </g>

          {/* 3. Left Arm (Back Arm) */}
          <g
            style={{
              transformOrigin: '48px 60px',
              transform: `rotate(${leftArmAngle}rad)`,
            }}
          >
            <rect x="44" y="58" width="7" height="20" rx="3.5" fill="#ca8a04" />
            {/* Hand */}
            <circle cx="47.5" cy="80" r="4" fill="url(#skinGrad)" />
          </g>

          {/* 4. Torso & Explorer Jacket */}
          <g>
            {/* Inner Dark Shirt */}
            <rect x="42" y="56" width="18" height="26" rx="5" fill="#18181b" />
            {/* Golden Explorer Coat */}
            <path
              d="M 38 56 C 38 52 46 50 51 50 C 56 50 64 52 64 56 L 66 84 C 66 86 62 88 51 88 C 40 88 36 86 36 84 Z"
              fill="url(#coatGrad)"
            />
            {/* Collar V-Neck */}
            <path d="M 46 54 L 51 64 L 56 54" fill="none" stroke="#fef08a" strokeWidth="2" />
            {/* Utility Belt */}
            <rect x="37" y="78" width="28" height="5" rx="1.5" fill="#451a03" />
            <rect x="49" y="77" width="5" height="7" rx="1" fill="#f59e0b" />
          </g>

          {/* 5. Cosmic Shoulder Lantern (Adventure Artifact) */}
          <g
            className="animate-pulse"
            style={{ transformOrigin: '34px 64px' }}
          >
            {/* Strap */}
            <path d="M 50 54 L 33 66" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />
            {/* Lantern Body */}
            <rect x="29" y="66" width="9" height="13" rx="2" fill="#1e1b4b" stroke="#fbbf24" strokeWidth="1" />
            {/* Glowing Core */}
            <circle cx="33.5" cy="72.5" r="3.5" fill="#67e8f9" filter="url(#lanternGlow)" />
            {/* Warm Lantern Light Ray */}
            <polygon points="33,76 10,105 50,105" fill="rgba(103, 232, 249, 0.12)" />
          </g>

          {/* 6. Right Leg (Front Leg) */}
          <g
            style={{
              transformOrigin: '54px 84px',
              transform: `rotate(${rightLegAngle}rad)`,
            }}
          >
            <rect x="50" y="84" width="8" height="24" rx="4" fill="url(#pantsGrad)" />
            {/* Sneaker */}
            <rect x="48" y="104" width="14" height="7" rx="3.5" fill="#ffffff" />
            <path d="M 48 108 L 62 108" stroke="#f97316" strokeWidth="1.5" />
          </g>

          {/* 7. Head & Facial Features (Modeled after Aditya's portrait) */}
          <g>
            {/* Neck */}
            <rect x="48" y="46" width="7" height="8" rx="2" fill="#d98c56" />

            {/* Face Oval */}
            <path
              d="M 40 32 C 40 22 62 22 62 32 C 62 44 40 44 40 32 Z"
              fill="url(#skinGrad)"
            />

            {/* Stylized Short Beard */}
            <path
              d="M 41 34 C 41 43 46 47 51 47 C 56 47 61 43 61 34 C 59 38 55 41 51 41 C 47 41 43 38 41 34 Z"
              fill="#27272a"
              opacity="0.88"
            />
            {/* Neat Mustache */}
            <path d="M 46 36 Q 51 38 56 36" fill="none" stroke="#27272a" strokeWidth="1.5" strokeLinecap="round" />

            {/* Warm Friendly Smile */}
            <path d="M 47 38 Q 51 42 55 38" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />

            {/* Expressive Eyes looking forward in movement direction */}
            <g>
              {/* Left Eye */}
              <ellipse cx="47" cy="30" rx="2.5" ry="3" fill="#18181b" />
              <circle cx="47.8" cy="29.2" r="1" fill="#ffffff" />
              {/* Eyebrow */}
              <path d="M 44.5 25.5 Q 47 24.5 49.5 25.5" stroke="#18181b" strokeWidth="1.5" strokeLinecap="round" />

              {/* Right Eye */}
              <ellipse cx="56" cy="30" rx="2.5" ry="3" fill="#18181b" />
              <circle cx="56.8" cy="29.2" r="1" fill="#ffffff" />
              {/* Eyebrow */}
              <path d="M 53.5 25.5 Q 56 24.5 58.5 25.5" stroke="#18181b" strokeWidth="1.5" strokeLinecap="round" />
            </g>

            {/* Textured Voluminous Spiky Dark Hair (Matching personal.png) */}
            <path
              d="M 38 28 C 36 20 42 12 51 11 C 58 11 65 18 64 27 C 62 19 56 16 51 17 C 46 17 41 21 38 28 Z"
              fill="url(#hairGrad)"
            />
            <path d="M 44 14 L 47 9 L 51 14 L 55 8 L 59 15" stroke="url(#hairGrad)" strokeWidth="3" strokeLinejoin="round" />
          </g>

          {/* 8. Right Arm (Front Arm) */}
          <g
            style={{
              transformOrigin: '56px 60px',
              transform: `rotate(${rightArmAngle}rad)`,
            }}
          >
            <rect x="53" y="58" width="7.5" height="20" rx="3.5" fill="#eab308" />
            {/* Hand */}
            <circle cx="57" cy="80" r="4" fill="url(#skinGrad)" />
          </g>
        </svg>
      </div>
    </div>
  );
}

export default Character;
