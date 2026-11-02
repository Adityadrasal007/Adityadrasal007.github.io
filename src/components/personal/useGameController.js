import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * 120 FPS High-Precision Game Controller Hook
 *
 * Implements decoupled delta-time physics:
 * - Acceleration, max run speed, ground friction deceleration
 * - Turn-slide direction detection
 * - Frame-independent camera lerp with look-ahead damping
 * - Unified inputs: Keyboard (A/D/Arrows/Space), Mouse Wheel / Trackpad, and Mobile Touch
 */

export const WORLD_CONFIG = {
  width: 9600, // Total path length in pixels
  groundY: 140, // Height from bottom of screen
  maxSpeed: 420, // Pixels per second
  sprintSpeed: 640, // Pixels per second when sprinting
  acceleration: 2400, // Acceleration rate
  friction: 1800, // Deceleration friction rate
  jumpForce: 520, // Initial jump vertical velocity
  gravity: 1600, // Gravity pull
  cameraLerp: 6.5, // Exponential damping factor
  cameraLookAhead: 120, // Pixels camera leads ahead in facing direction
};

export function useGameController() {
  const [characterState, setCharacterState] = useState({
    x: 200,
    y: 0,
    vx: 0,
    vy: 0,
    facing: 1, // 1 = right, -1 = left
    mode: 'idle', // 'idle' | 'walk' | 'jump' | 'skid'
    distanceTraveled: 0,
    isGrounded: true,
  });

  const [cameraX, setCameraX] = useState(0);
  const [activeZoneIndex, setActiveZoneIndex] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);

  // Internal mutable physics state
  const stateRef = useRef({
    x: 200,
    y: 0,
    vx: 0,
    vy: 0,
    facing: 1,
    mode: 'idle',
    distanceTraveled: 0,
    isGrounded: true,
    camX: 0,
  });

  const inputRef = useRef({
    left: false,
    right: false,
    jump: false,
    sprint: false,
    wheelDelta: 0,
    touchAxis: 0, // -1 to 1
  });

  const lastTimeRef = useRef(performance.now());
  const rafIdRef = useRef(null);

  // Keyboard handlers
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't capture inputs if user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

      const key = e.key.toLowerCase();
      if (key === 'a' || key === 'arrowleft') {
        inputRef.current.left = true;
        setHasMoved(true);
      } else if (key === 'd' || key === 'arrowright') {
        inputRef.current.right = true;
        setHasMoved(true);
      } else if (key === ' ' || key === 'w' || key === 'arrowup') {
        if (stateRef.current.isGrounded) {
          inputRef.current.jump = true;
          setHasMoved(true);
        }
      } else if (e.shiftKey) {
        inputRef.current.sprint = true;
      }
    };

    const handleKeyUp = (e) => {
      const key = e.key.toLowerCase();
      if (key === 'a' || key === 'arrowleft') {
        inputRef.current.left = false;
      } else if (key === 'd' || key === 'arrowright') {
        inputRef.current.right = false;
      } else if (!e.shiftKey) {
        inputRef.current.sprint = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Natural Wheel / Trackpad horizontal mapping
  useEffect(() => {
    let wheelTimer = null;
    const handleWheel = (e) => {
      // Absorb horizontal or vertical wheel
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(delta) > 2) {
        setHasMoved(true);
        inputRef.current.wheelDelta += delta * 1.8;
        // Clamp wheel accumulator
        inputRef.current.wheelDelta = Math.max(-1200, Math.min(1200, inputRef.current.wheelDelta));

        clearTimeout(wheelTimer);
        wheelTimer = setTimeout(() => {
          inputRef.current.wheelDelta = 0;
        }, 120);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => {
      window.removeEventListener('wheel', handleWheel);
      clearTimeout(wheelTimer);
    };
  }, []);

  // Main 120 FPS decoupled Physics Loop
  useEffect(() => {
    lastTimeRef.current = performance.now();

    const loop = (now) => {
      const rawDt = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;
      // Clamp dt to avoid spiral of death on tab unfocus
      const dt = Math.min(0.064, Math.max(0.001, rawDt));

      const s = stateRef.current;
      const inp = inputRef.current;

      // 1. Determine Intent from all input modes
      let moveDir = 0;
      if (inp.right) moveDir += 1;
      if (inp.left) moveDir -= 1;
      if (inp.touchAxis !== 0) moveDir += inp.touchAxis;

      // Wheel influence
      if (Math.abs(inp.wheelDelta) > 5) {
        moveDir += Math.sign(inp.wheelDelta);
        // decay wheel delta
        inp.wheelDelta *= 0.88;
      }

      moveDir = Math.max(-1, Math.min(1, moveDir));

      const targetMaxSpeed = inp.sprint ? WORLD_CONFIG.sprintSpeed : WORLD_CONFIG.maxSpeed;

      // 2. Horizontal Kinematics
      if (moveDir !== 0) {
        // Accelerate
        s.vx += moveDir * WORLD_CONFIG.acceleration * dt;
        if (Math.abs(s.vx) > targetMaxSpeed) {
          s.vx = Math.sign(s.vx) * targetMaxSpeed;
        }

        // Detect direction reversal / skid
        if (Math.sign(s.vx) !== s.facing && Math.abs(s.vx) > 80) {
          s.mode = 'skid';
        } else {
          s.mode = s.isGrounded ? 'walk' : 'jump';
        }

        s.facing = Math.sign(s.vx) || s.facing;
      } else {
        // Apply ground friction deceleration
        if (Math.abs(s.vx) > 10) {
          const decel = WORLD_CONFIG.friction * dt;
          if (Math.abs(s.vx) <= decel) {
            s.vx = 0;
          } else {
            s.vx -= Math.sign(s.vx) * decel;
          }
          s.mode = s.isGrounded ? (Math.abs(s.vx) > 60 ? 'walk' : 'idle') : 'jump';
        } else {
          s.vx = 0;
          if (s.isGrounded) s.mode = 'idle';
        }
      }

      // 3. Jump & Vertical Gravity Physics
      if (inp.jump && s.isGrounded) {
        s.vy = WORLD_CONFIG.jumpForce;
        s.isGrounded = false;
        s.mode = 'jump';
        inp.jump = false;
      }

      if (!s.isGrounded) {
        s.vy -= WORLD_CONFIG.gravity * dt;
        s.y += s.vy * dt;

        if (s.y <= 0) {
          s.y = 0;
          s.vy = 0;
          s.isGrounded = true;
          s.mode = Math.abs(s.vx) > 20 ? 'walk' : 'idle';
        }
      }

      // 4. Update Position & Path Distance
      const prevX = s.x;
      s.x += s.vx * dt;

      // Bounded world collision
      if (s.x < 60) {
        s.x = 60;
        s.vx = 0;
      } else if (s.x > WORLD_CONFIG.width - 120) {
        s.x = WORLD_CONFIG.width - 120;
        s.vx = 0;
      }

      // Accumulate ground distance traveled for precise non-slipping walk cycle
      s.distanceTraveled += Math.abs(s.x - prevX);

      // 5. Smooth Camera Tracking with Look-Ahead
      const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
      const targetLookAhead = s.facing * WORLD_CONFIG.cameraLookAhead;
      // Position character at ~32% from the left when walking right, allowing generous forward visibility
      const desiredCamX = s.x - viewportWidth * 0.35 + targetLookAhead;
      const clampedCamX = Math.max(0, Math.min(WORLD_CONFIG.width - viewportWidth, desiredCamX));

      // Exponential smooth damp (frame-rate independent lerp)
      s.camX += (clampedCamX - s.camX) * (1 - Math.exp(-WORLD_CONFIG.cameraLerp * dt));

      // 6. Push state to React components
      setCharacterState({
        x: s.x,
        y: s.y,
        vx: s.vx,
        vy: s.vy,
        facing: s.facing,
        mode: s.mode,
        distanceTraveled: s.distanceTraveled,
        isGrounded: s.isGrounded,
      });

      setCameraX(s.camX);

      rafIdRef.current = requestAnimationFrame(loop);
    };

    rafIdRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  // Teleport / Fast Travel method for mini-map
  const teleportTo = useCallback((targetX) => {
    stateRef.current.x = Math.max(60, Math.min(WORLD_CONFIG.width - 120, targetX));
    stateRef.current.vx = 0;
    stateRef.current.vy = 0;
    stateRef.current.isGrounded = true;
    stateRef.current.mode = 'idle';
    setHasMoved(true);
  }, []);

  // Mobile Touch Interface Handlers
  const setTouchMove = useCallback((axis) => {
    inputRef.current.touchAxis = Math.max(-1, Math.min(1, axis));
    if (axis !== 0) setHasMoved(true);
  }, []);

  const triggerJump = useCallback(() => {
    if (stateRef.current.isGrounded) {
      inputRef.current.jump = true;
      setHasMoved(true);
    }
  }, []);

  return {
    character: characterState,
    cameraX,
    hasMoved,
    teleportTo,
    setTouchMove,
    triggerJump,
  };
}

export default useGameController;

