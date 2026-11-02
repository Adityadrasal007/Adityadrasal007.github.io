# Platformer Scrollytelling Engine — Architecture Notes

## 1. Math: syncing sprite walk cycle to scroll velocity

Two things need to stay independent but coordinated: **which frame plays** and **how fast frames play**.

**Key idea:** don't drive the walk cycle off raw time (setInterval-style), drive it off *distance traveled on the path*. If you tie frame-switching to time, a paused scroll still animates. If you tie it to scroll-driven progress, frames only advance when the character actually moves — which is what makes it feel connected to the scroll, not just decorative.

```
frameIndex = Math.floor((pathDistanceTraveled / distancePerStep) % totalWalkFrames)
```

- `pathDistanceTraveled` = cumulative pixels the character has "walked" along the path, derived from timeline progress × total path length
- `distancePerStep` = how many px of travel = one sprite frame advance (tune this, smaller = faster-looking cycle)
- `totalWalkFrames` = number of frames in your walk sprite sheet

**Direction & idle detection** — use ScrollTrigger's built-in velocity:

```js
ScrollTrigger.create({
  trigger: container,
  start: "top top",
  end: "bottom bottom",
  scrub: 1,
  onUpdate: (self) => {
    const velocity = self.getVelocity(); // px/sec, signed
    const direction = self.direction; // 1 = down/forward, -1 = up/backward

    if (Math.abs(velocity) < 5) {
      setCharState("idle");
    } else {
      setCharState(direction === 1 ? "walk-forward" : "walk-backward");
    }
  }
});
```

Debounce the idle switch slightly (150-200ms of near-zero velocity) so it doesn't flicker to idle between scroll ticks — raw scroll events are choppy, not continuous.

For backward walking: flip with `scaleX: -1` on the sprite container rather than swapping to a mirrored sprite sheet, and just play the same frame sequence — cheaper and looks correct.

---

## 2. GSAP ScrollTrigger config for the X/Y path (jumps + drops)

Core approach: **one master timeline**, driven by a single ScrollTrigger with `scrub`. All X movement, Y elevation changes, and camera pan live as tweens positioned on that same timeline using absolute time (percent-based), so everything stays perfectly in sync with scroll progress — no separate scroll listeners fighting each other.

```js
const master = gsap.timeline({
  scrollTrigger: {
    trigger: "#scroll-track",
    start: "top top",
    end: "bottom bottom",
    scrub: 1, // smoothing — higher = laggier but smoother
    // pin: true  -> if using a tall dummy scroll track + pinned viewport
  }
});

// Timeline uses 0-100 as "percent of scroll" for readability.
// X translation across the whole journey (world moves left = forward illusion)
master.to(worldRef.current, { x: "-3000px", ease: "none", duration: 100 }, 0);

// Ground segment: 0% - 20%, character Y stays flat
master.to(charRef.current, { y: 0, duration: 20 }, 0);

// Jump segment: 20% - 22%, quick elevation change with an arc-like ease
master.to(charRef.current, {
  y: -150,
  duration: 2,
  ease: "power2.out" // fast up, settle — reads as a jump, not a slide
}, 20);

// Elevated platform: 22% - 40%, holds at -150
master.to(charRef.current, { y: -150, duration: 18 }, 22);

// Drop segment: 40% - 42%
master.to(charRef.current, {
  y: 200,
  duration: 2,
  ease: "power2.in" // slow start, accelerates down — reads as a fall
}, 40);

// Camera compensation — pans opposite to character Y so char stays in frame
master.to(cameraRef.current, { y: 150 * 0.6, duration: 2, ease: "power2.out" }, 20);
master.to(cameraRef.current, { y: -200 * 0.6, duration: 2, ease: "power2.in" }, 40);
```

Notes:
- All `.to()` calls use the 4th argument (position parameter) to place them at an absolute point on the 0-100 timeline — this is what keeps X, Y, and camera perfectly synced regardless of scrub smoothing.
- The camera doesn't need to fully match character Y (that would just recentre and cancel the visual jump) — compensate partially (e.g. 60%) so the jump is still *felt* but the character doesn't leave frame.
- Swap character sprite state to `jump` / `fall` right when these segments start — you already have exact % breakpoints, so just check current progress against them in `onUpdate`.

**Keyboard support (A/D as scroll simulation):**

```js
window.addEventListener("keydown", (e) => {
  const scrollAmount = 80; // px per keypress, tune to taste
  if (e.key === "d" || e.key === "ArrowRight") {
    window.scrollBy({ top: scrollAmount, behavior: "smooth" });
  }
  if (e.key === "a" || e.key === "ArrowLeft") {
    window.scrollBy({ top: -scrollAmount, behavior: "smooth" });
  }
});
```

This just drives the real scroll position — since your ScrollTrigger is already scrubbing off scroll, keyboard "just works" without a separate animation path.

---

## 3. Skeleton: Camera / World / Character separation

```jsx
// Camera.jsx — fixed viewport, everything else lives inside and moves relative to it
function Camera({ children }) {
  return (
    <div className="camera-viewport">
      {children}
    </div>
  );
}
```

```jsx
// World.jsx — the actual environment: parallax layers + waypoint content
// This is what translates on X (and compensates on Y) via the master timeline
const World = forwardRef(({ children }, ref) => {
  const bgFarRef = useRef(null);
  const bgMidRef = useRef(null);
  const bgNearRef = useRef(null);

  // parallax: far layer moves slowest, near layer moves fastest,
  // each gets its own scale factor relative to the master X tween
  useLayoutEffect(() => {
    gsap.to(bgFarRef.current, { x: "-800px", ease: "none",
      scrollTrigger: { trigger: "#scroll-track", scrub: 1, start: "top top", end: "bottom bottom" }
    });
    gsap.to(bgMidRef.current, { x: "-1800px", ease: "none",
      scrollTrigger: { trigger: "#scroll-track", scrub: 1, start: "top top", end: "bottom bottom" }
    });
    // near layer matches (or exceeds) the main world speed
  }, []);

  return (
    <div ref={ref} className="world">
      <div ref={bgFarRef} className="layer layer-far" />
      <div ref={bgMidRef} className="layer layer-mid" />
      {children /* waypoint content, section markers, ground/platform geometry */}
    </div>
  );
});
```

```jsx
// Character.jsx — sprite, state-driven, position controlled by master timeline via ref
const Character = forwardRef(({ state, facing }, ref) => {
  // state: "idle" | "walk-forward" | "walk-backward" | "jump" | "fall"
  return (
    <div
      ref={ref}
      className={`character char-${state}`}
      style={{ transform: `scaleX(${facing === "backward" ? -1 : 1})` }}
    />
  );
});
```

```jsx
// ScrollWorld.jsx — ties it all together
function ScrollWorld() {
  const worldRef = useRef(null);
  const charRef = useRef(null);
  const cameraRef = useRef(null);
  const [charState, setCharState] = useState("idle");
  const [facing, setFacing] = useState("forward");

  useLayoutEffect(() => {
    // master timeline from section 2 goes here, targeting worldRef / charRef / cameraRef
  }, []);

  return (
    <div id="scroll-track" style={{ height: "600vh" }}> {/* dummy scroll height */}
      <Camera>
        <div ref={cameraRef} className="camera-inner">
          <World ref={worldRef}>
            {/* waypoint sections rendered here at fixed x positions inside world */}
          </World>
          <Character ref={charRef} state={charState} facing={facing} />
        </div>
      </Camera>
    </div>
  );
}
```

Separation logic:
- **Camera** — dumb wrapper, just clips the viewport (`overflow: hidden`, fixed height)
- **World** — owns parallax background layers + waypoint content, moves on X (and receives Y compensation)
- **Character** — owns sprite state only, positioned via the same master timeline, doesn't know about scroll directly (state is passed down from the parent that reads ScrollTrigger)

This keeps ScrollTrigger logic in one place (`ScrollWorld`), so Camera/World/Character stay presentational and easy to swap out visually later.
