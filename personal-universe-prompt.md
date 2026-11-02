# Personal Universe — Build Prompt (for later use with Claude Code)

## Concept
A side-scrolling interactive portfolio world. A unique character (custom design, not copied from any reference site) walks left/right using A/D keys through a horizontal path. Each stretch of the path is a "section" — as the character approaches, that section's content and 3D elements activate. Hybrid style: 2D character layer + 3D background/prop layer using react-three-fiber.

## Character Movement Spec
- Controls: `A` = move left, `D` = move right (hold to keep moving, not single-tap)
- Character has 3 states: idle (breathing/blinking animation), walking (loop animation), and interact (plays when entering a section trigger zone)
- Camera smoothly follows character on x-axis (lerp/ease, never a hard snap)
- Movement is bounded — character can't walk past the first or last section
- Mobile fallback: on-screen left/right tap buttons or swipe-to-move, since A/D won't work on touch devices
- Optional: subtle parallax on background layers as character moves, for depth

## Section Trigger Logic
- Each section has an x-range on the path
- When character's x position enters that range → section content fades/slides in
- When character leaves the range → content fades out (don't destroy, just hide, for performance)
- Milestone/photo/event elements only fully load in when character is in proximity (lazy load for performance)

## Section Order & Design Brief

1. **Hero**
   - Character spawns here. Big name/title. Controls hint ("Press A/D to walk") fades out after first movement.
   - One or two ambient 3D floating elements to set tone, nothing heavy.

2. **Short Summary**
   - One punchy line about who you are + 2-3 tag pills (e.g. "builder", "frontend dev", "storyteller")
   - Reads like a checkpoint sign, not a paragraph.

3. **Journey**
   - Horizontal timeline along the path. Milestone pins glow as character nears them.
   - Interact (keypress/click) to expand each milestone's detail. Text hidden by default.

4. **Events & Activities**
   - Rendered as scattered location markers near the path, not a card grid.
   - Hover/interact to expand info per event (Vibenity, IM3, NASA Space Apps, GDG, etc.)

5. **Hobbies**
   - Split into mini sub-scenes along this stretch, each with its own small 3D prop:
     - Turtle corner
     - Konkan monsoon corner
     - Hot chocolate corner
     - Creative/DIY corner
   - Most playful, most personality-driven zone visually.

6. **Photos**
   - Floating frame wall or polaroid cluster.
   - Frames lazy-load in as character approaches (proximity trigger), not all at once.

7. **Videos**
   - Interact opens a modal/popup player rather than autoplaying embeds inside the 3D scene.
   - Keeps performance and control in check.

8. **Contact**
   - Tone shifts calmer here — final checkpoint.
   - Clean clickable icons/socials, resume download visible, short sign-off line.

## Global Addons
- Progress indicator (dots or mini path map showing how far character has walked)
- Skip-to-section nav for users who don't want to manually walk the whole path
- Brief loading/intro animation before character spawns
- Subtle lighting/theme shift as character moves through zones
- Optional ambient sound toggle (not required, polish only)

## Tech Notes
- react-three-fiber + drei for 3D layer
- Character controller: keydown/keyup listeners for A/D → update x position state → apply easing for smooth motion
- Character design: unique, custom — evolve from existing mascot style (chibi mascot / Pip-style) into a walking sprite, not a copy of any reference site's character
- Performance: lazy-load section content/media on proximity trigger, not all at once on page load
