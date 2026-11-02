import * as THREE from 'three';

/**
 * Rich 3D World Props & Custom Interactive Biomes (Three.js)
 *
 * Implements the user's signature Personal Universe sections:
 * 1. ANANTAM Live Concert Stage:
 *    - Massive 15m concert stage deck & ramp
 *    - Heavy aluminum truss rigging with overhead canopy
 *    - Giant animated LED screen backdrop flashing "ANANTAM"
 *    - Hanging line-array concert speaker clusters & subwoofers
 *    - Sweeping moving-head volumetric spotlights (dynamic pan & tilt)
 *    - Cheering concert crowd jumping with glowing neon wristbands
 *    - Front-Of-House (FOH) audio-lighting console station
 *
 * 2. TEDx University Amphitheater:
 *    - Sleek presentation stage platform
 *    - The iconic circular Red Carpet speaker dot
 *    - Giant freestanding 3D red "TEDx" block letters
 *    - Stepped semicircular stone amphitheater tiers
 *    - Focused overhead stage spotlight and speaker lectern
 *    - TEDx ideas banner celebrating Aditya's role as Event Mentor & Curator
 *
 * 3. Mountain Climbing & Offroad Trail:
 *    - Stepped rocky mountain ascent matching Cannon physics ramps
 *    - Summit plateau (elev. 4,200m) with alpine cairn & signboard
 *    - Fluttering strings of colorful Himalayan prayer flags (animated wind)
 *    - Low-poly evergreen alpine pine trees and rugged cliff faces
 *    - Trailhead log archway and diamond warning signs
 *
 * 4. Hero Spawn & Finish Line:
 *    - Welcome billboard & road cones
 *    - Checkered finish arch & social parking stalls
 */

export function createWorldProps(scene) {
  const updateables = [];

  // Common Materials
  const darkMetalMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.5, metalness: 0.8 });
  const aluminumTrussMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.35, metalness: 0.7 });
  const stageDeckMat = new THREE.MeshStandardMaterial({ color: 0x090a0f, roughness: 0.4, metalness: 0.2 });
  const woodMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.8 });
  const stoneMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.9, flatShading: true });
  const rockCliffMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.95, flatShading: true });

  // Canvas texture generator for high-contrast neon stage screens
  function createScreenTexture(title, subtitle, badge, accentHex = '#ec4899', bgHex = '#090a15') {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Dark sleek background
    ctx.fillStyle = bgHex;
    ctx.fillRect(0, 0, 1024, 512);

    // Neon Cyber Grid & Scanlines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.lineWidth = 2;
    for (let y = 0; y < 512; y += 18) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1024, y);
      ctx.stroke();
    }
    for (let x = 0; x < 1024; x += 36) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 512);
      ctx.stroke();
    }

    // Outer Neon Border
    ctx.strokeStyle = accentHex;
    ctx.lineWidth = 14;
    ctx.strokeRect(12, 12, 1000, 488);

    // Badge Pill
    if (badge) {
      ctx.fillStyle = accentHex;
      ctx.fillRect(360, 50, 304, 42);
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 20px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(badge, 512, 71);
    }

    // Main Title Typography
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 88px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = accentHex;
    ctx.shadowBlur = 32;
    ctx.fillText(title, 512, 230);

    // Subtitle Typography
    ctx.shadowBlur = 0;
    ctx.fillStyle = accentHex;
    ctx.font = 'bold 28px monospace';
    ctx.fillText(subtitle, 512, 340);

    // Bottom Decorative Graphic Bar
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.fillRect(100, 420, 824, 6);

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }

  // Helper: Low-poly Evergreen Pine Tree
  function createPineTree(x, y, z, scale = 1) {
    const treeGroup = new THREE.Group();
    treeGroup.position.set(x, y, z);
    treeGroup.scale.setScalar(scale);

    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.25, 1.8, 8),
      woodMat
    );
    trunk.position.y = 0.9;
    trunk.castShadow = true;
    treeGroup.add(trunk);

    const foliageMat = new THREE.MeshStandardMaterial({
      color: 0x166534,
      roughness: 0.8,
      flatShading: true,
    });

    const tierHeights = [1.8, 2.7, 3.5];
    const tierRadii = [1.4, 1.05, 0.7];

    tierHeights.forEach((th, i) => {
      const cone = new THREE.Mesh(
        new THREE.ConeGeometry(tierRadii[i], 1.4, 7),
        foliageMat
      );
      cone.position.y = th;
      cone.castShadow = true;
      treeGroup.add(cone);
    });

    scene.add(treeGroup);
    return treeGroup;
  }

  // =========================================================================
  // 1. HERO SPAWN BILLBOARD & CONES ([0, 0])
  // =========================================================================
  const spawnGroup = new THREE.Group();
  spawnGroup.position.set(0, 0, -10);

  const post1 = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 5, 12), darkMetalMat);
  post1.position.set(-6, 2.5, 0);
  post1.castShadow = true;
  spawnGroup.add(post1);

  const post2 = post1.clone();
  post2.position.x = 6;
  spawnGroup.add(post2);

  const spawnBoard = new THREE.Mesh(
    new THREE.BoxGeometry(13.5, 2.4, 0.35),
    new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3 })
  );
  spawnBoard.position.set(0, 4.2, 0);
  spawnBoard.castShadow = true;
  spawnGroup.add(spawnBoard);

  const spawnNeon = new THREE.Mesh(
    new THREE.BoxGeometry(13.2, 0.1, 0.38),
    new THREE.MeshBasicMaterial({ color: 0xf59e0b })
  );
  spawnNeon.position.set(0, 5.3, 0);
  spawnGroup.add(spawnNeon);
  scene.add(spawnGroup);

  function createTrafficCone(x, z) {
    const cg = new THREE.Group();
    cg.position.set(x, 0, z);
    const base = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.08, 0.65), new THREE.MeshStandardMaterial({ color: 0xf97316 }));
    base.castShadow = true;
    cg.add(base);
    const cone = new THREE.Mesh(new THREE.ConeGeometry(0.26, 0.82, 16), new THREE.MeshStandardMaterial({ color: 0xf97316 }));
    cone.position.y = 0.45;
    cone.castShadow = true;
    cg.add(cone);
    const whiteStripe = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.21, 0.2, 16), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    whiteStripe.position.y = 0.45;
    cg.add(whiteStripe);
    scene.add(cg);
  }
  createTrafficCone(-5, 4);
  createTrafficCone(5, 4);
  createTrafficCone(-5, -4);
  createTrafficCone(5, -4);

  // Jump ring over the central ramp
  const jumpRing = new THREE.Mesh(
    new THREE.TorusGeometry(3.2, 0.22, 16, 32),
    new THREE.MeshBasicMaterial({ color: 0xfbbf24 })
  );
  jumpRing.position.set(0, 4.2, -22);
  scene.add(jumpRing);

  // =========================================================================
  // 2. SECTION 1: ANANTAM LIVE CONCERT STAGE ([-24, -20])
  // =========================================================================
  const anantamGroup = new THREE.Group();
  anantamGroup.position.set(-24, 0, -20);

  // Main Stage Deck (15m wide x 1.5m high x 9m deep) - matches Cannon anantamStage
  const concertStageDeck = new THREE.Mesh(
    new THREE.BoxGeometry(15.0, 1.5, 9.0),
    stageDeckMat
  );
  concertStageDeck.position.set(0, 0.75, 0);
  concertStageDeck.receiveShadow = true;
  concertStageDeck.castShadow = true;
  anantamGroup.add(concertStageDeck);

  // Stage Glow Neon Trim (Front Edge)
  const stageFrontGlow = new THREE.Mesh(
    new THREE.BoxGeometry(15.2, 0.12, 0.15),
    new THREE.MeshBasicMaterial({ color: 0xec4899 })
  );
  stageFrontGlow.position.set(0, 1.48, 4.5);
  anantamGroup.add(stageFrontGlow);

  // Stage Access Ramp (4m wide x 0.3m high x 5m deep) - matches Cannon ramp at [-24, 0.4, -14.5]
  const concertRamp = new THREE.Mesh(
    new THREE.BoxGeometry(4.0, 0.3, 5.0),
    new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.5 })
  );
  concertRamp.position.set(0, 0.4, 5.5); // Local z: 5.5 => world z: -14.5
  concertRamp.rotation.x = 0.16;
  concertRamp.receiveShadow = true;
  concertRamp.castShadow = true;
  anantamGroup.add(concertRamp);

  // Ramp Hazard Edge Lines
  [-1.9, 1.9].forEach((rx) => {
    const hazard = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.32, 5.0),
      new THREE.MeshBasicMaterial({ color: 0xf59e0b })
    );
    hazard.position.set(rx, 0.4, 5.5);
    hazard.rotation.x = 0.16;
    anantamGroup.add(hazard);
  });

  // Aluminum Truss Towers (4 Pillars)
  const trussPillars = [
    [-7.2, 0, -4.2],
    [7.2, 0, -4.2],
    [-7.2, 0, 4.2],
    [7.2, 0, 4.2],
  ];

  trussPillars.forEach(([tx, ty, tz]) => {
    const pillarGroup = new THREE.Group();
    pillarGroup.position.set(tx, 0, tz);

    const cornerOffsets = [
      [-0.25, -0.25],
      [0.25, -0.25],
      [-0.25, 0.25],
      [0.25, 0.25],
    ];

    cornerOffsets.forEach(([cx, cz]) => {
      const leg = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.06, 8.5, 8),
        aluminumTrussMat
      );
      leg.position.set(cx, 4.25, cz);
      leg.castShadow = true;
      pillarGroup.add(leg);
    });

    for (let h = 1.0; h <= 8.0; h += 1.4) {
      const brace = new THREE.Mesh(
        new THREE.BoxGeometry(0.55, 0.05, 0.55),
        aluminumTrussMat
      );
      brace.position.y = h;
      pillarGroup.add(brace);
    }

    anantamGroup.add(pillarGroup);
  });

  // Overhead Roof Truss Canopy
  const roofBeamMat = aluminumTrussMat;
  const frontTopBeam = new THREE.Mesh(new THREE.BoxGeometry(15.2, 0.6, 0.6), roofBeamMat);
  frontTopBeam.position.set(0, 8.5, 4.2);
  frontTopBeam.castShadow = true;
  anantamGroup.add(frontTopBeam);

  const backTopBeam = frontTopBeam.clone();
  backTopBeam.position.z = -4.2;
  anantamGroup.add(backTopBeam);

  const leftTopBeam = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.6, 9.0), roofBeamMat);
  leftTopBeam.position.set(-7.2, 8.5, 0);
  anantamGroup.add(leftTopBeam);

  const rightTopBeam = leftTopBeam.clone();
  rightTopBeam.position.x = 7.2;
  anantamGroup.add(rightTopBeam);

  // Giant LED Screen Backdrop
  const ledTex = createScreenTexture(
    'ANANTAM',
    'CULTURAL MEGA-FEST • EVENT LEAD: ADITYA RASAL',
    'MAIN STAGE HEADLINER',
    '#ec4899',
    '#0b0c16'
  );

  const ledScreen = new THREE.Mesh(
    new THREE.PlaneGeometry(13.0, 5.5),
    new THREE.MeshBasicMaterial({ map: ledTex })
  );
  ledScreen.position.set(0, 5.0, -4.1);
  anantamGroup.add(ledScreen);

  // 16 Realtime 3D Audio Visualizer Spectrum Bars
  const visualizerBars = [];
  const barMat = new THREE.MeshBasicMaterial({ color: 0xec4899 });
  const barCount = 16;
  const barWidth = 0.55;
  const barSpacing = 0.72;
  const startX = -((barCount - 1) * barSpacing) / 2;

  for (let i = 0; i < barCount; i++) {
    const bar = new THREE.Mesh(new THREE.BoxGeometry(barWidth, 1.0, 0.12), barMat);
    bar.position.set(startX + i * barSpacing, 2.5, -4.0);
    anantamGroup.add(bar);
    visualizerBars.push(bar);
  }

  updateables.push(() => {
    const time = Date.now() * 0.007;
    visualizerBars.forEach((bar, idx) => {
      const h = 0.3 + Math.abs(Math.sin(time + idx * 0.45) * 1.5) + Math.abs(Math.cos(time * 0.8 + idx * 0.3) * 0.9);
      bar.scale.y = Math.max(0.2, h);
      bar.position.y = 2.0 + (bar.scale.y * 0.5);
    });
  });

  // Hanging Line-Array Concert Speakers
  function createLineArray(xPos) {
    const speakerGroup = new THREE.Group();
    speakerGroup.position.set(xPos, 7.8, 3.8);

    for (let i = 0; i < 5; i++) {
      const box = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 0.45, 0.75),
        darkMetalMat
      );
      box.position.set(0, -i * 0.55, i * 0.12);
      box.rotation.x = -0.08 * i;
      box.castShadow = true;
      speakerGroup.add(box);

      const grille = new THREE.Mesh(
        new THREE.PlaneGeometry(1.1, 0.38),
        new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.9 })
      );
      grille.position.set(0, -i * 0.55, i * 0.12 + 0.38);
      grille.rotation.x = -0.08 * i;
      speakerGroup.add(grille);
    }
    anantamGroup.add(speakerGroup);
  }
  createLineArray(-8.2);
  createLineArray(8.2);

  // Subwoofer Stacks on Ground
  [-7.5, 7.5].forEach((sx) => {
    for (let dx = -0.6; dx <= 0.6; dx += 1.2) {
      for (let dy = 0.45; dy <= 1.35; dy += 0.9) {
        const sub = new THREE.Mesh(
          new THREE.BoxGeometry(1.0, 0.8, 1.2),
          darkMetalMat
        );
        sub.position.set(sx + dx, dy, 4.8);
        sub.castShadow = true;
        anantamGroup.add(sub);
      }
    }
  });

  // Sweeping Moving-Head Concert Spotlights & Volumetric Beams
  const concertSpotlights = [];
  const beamMat = new THREE.MeshBasicMaterial({
    color: 0xec4899,
    transparent: true,
    opacity: 0.28,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const beamColors = [0xec4899, 0x06b6d4, 0xfbbf24, 0xa855f7, 0xec4899, 0x06b6d4];
  const spotXPositions = [-5.5, -3.3, -1.1, 1.1, 3.3, 5.5];

  spotXPositions.forEach((sx, i) => {
    const headGroup = new THREE.Group();
    headGroup.position.set(sx, 8.2, 4.2);

    const housing = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.28, 0.45, 12),
      darkMetalMat
    );
    housing.rotation.x = Math.PI / 2;
    headGroup.add(housing);

    const lens = new THREE.Mesh(
      new THREE.CircleGeometry(0.26, 16),
      new THREE.MeshBasicMaterial({ color: beamColors[i] })
    );
    lens.position.z = 0.23;
    headGroup.add(lens);

    const beamGeo = new THREE.ConeGeometry(2.4, 12, 16, 1, true);
    const thisBeamMat = beamMat.clone();
    thisBeamMat.color.setHex(beamColors[i]);
    const beam = new THREE.Mesh(beamGeo, thisBeamMat);
    beam.position.z = 6.0;
    beam.rotation.x = -Math.PI / 2;
    headGroup.add(beam);

    headGroup.rotation.x = 0.55;
    anantamGroup.add(headGroup);
    concertSpotlights.push({ group: headGroup, offset: i * 0.8, speed: 1.2 + (i % 2) * 0.4 });
  });

  updateables.push(() => {
    const time = Date.now() * 0.0015;
    concertSpotlights.forEach((spot) => {
      spot.group.rotation.y = Math.sin(time * spot.speed + spot.offset) * 0.55;
      spot.group.rotation.x = 0.55 + Math.cos(time * 0.9 + spot.offset) * 0.25;
    });
  });

  // Cheering Concert Crowd (45+ stylized attendees jumping in front of stage)
  const crowdGroup = new THREE.Group();
  crowdGroup.position.set(0, 0, 10.5); // In front of stage ramp
  const crowdMembers = [];

  const wristbandColors = [0x22c55e, 0x06b6d4, 0xec4899, 0xfbbf24, 0xa855f7];
  const attendeeMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });

  for (let row = 0; row < 5; row++) {
    for (let col = -5; col <= 5; col++) {
      const person = new THREE.Group();
      const px = col * 1.35 + (Math.random() - 0.5) * 0.4;
      const pz = row * 1.2 + (Math.random() - 0.5) * 0.4;
      person.position.set(px, 0, pz);

      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.26, 1.2, 8), attendeeMat);
      body.position.y = 0.6;
      body.castShadow = true;
      person.add(body);

      const head = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), attendeeMat);
      head.position.y = 1.35;
      person.add(head);

      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.7, 6), attendeeMat);
      arm.position.set(0.22, 1.3, 0.1);
      arm.rotation.z = -0.45;
      arm.rotation.x = 0.6;
      person.add(arm);

      const wristColor = wristbandColors[Math.floor(Math.random() * wristbandColors.length)];
      const wristband = new THREE.Mesh(
        new THREE.SphereGeometry(0.09, 8, 8),
        new THREE.MeshBasicMaterial({ color: wristColor })
      );
      wristband.position.set(0.42, 1.6, 0.35);
      person.add(wristband);

      crowdGroup.add(person);
      crowdMembers.push({
        mesh: person,
        baseY: 0,
        jumpOffset: Math.random() * Math.PI * 2,
        jumpSpeed: 6.5 + Math.random() * 2.5,
      });
    }
  }
  anantamGroup.add(crowdGroup);

  updateables.push(() => {
    const time = Date.now() * 0.001;
    crowdMembers.forEach((m) => {
      m.mesh.position.y = m.baseY + Math.max(0, Math.sin(time * m.jumpSpeed + m.jumpOffset) * 0.28);
    });
  });

  // FOH (Front-Of-House) Audio/Lighting Console Desk
  const fohDesk = new THREE.Mesh(
    new THREE.BoxGeometry(3.2, 0.9, 1.2),
    darkMetalMat
  );
  fohDesk.position.set(0, 0.45, 17.5);
  fohDesk.castShadow = true;
  anantamGroup.add(fohDesk);

  [-0.8, 0.8].forEach((fx) => {
    const screen = new THREE.Mesh(
      new THREE.PlaneGeometry(0.9, 0.5),
      new THREE.MeshBasicMaterial({ color: 0x06b6d4 })
    );
    screen.position.set(fx, 0.95, 17.4);
    screen.rotation.x = -0.35;
    anantamGroup.add(screen);
  });

  scene.add(anantamGroup);

  // =========================================================================
  // 3. SECTION 2: TEDx UNIVERSITY AMPHITHEATER ([24, -20])
  // =========================================================================
  const tedxGroup = new THREE.Group();
  tedxGroup.position.set(24, 0, -20);

  // Main Stage Deck (13m wide x 1.0m high x 8m deep) - matches Cannon tedxStage
  const tedxStageMesh = new THREE.Mesh(
    new THREE.BoxGeometry(13.0, 1.0, 8.0),
    new THREE.MeshStandardMaterial({ color: 0x11131a, roughness: 0.6 })
  );
  tedxStageMesh.position.set(0, 0.5, 0);
  tedxStageMesh.receiveShadow = true;
  tedxStageMesh.castShadow = true;
  tedxGroup.add(tedxStageMesh);

  // The Iconic Circular Red Carpet Dot (3.4m diameter)
  const redDot = new THREE.Mesh(
    new THREE.CylinderGeometry(1.7, 1.7, 0.03, 36),
    new THREE.MeshStandardMaterial({ color: 0xeb0028, roughness: 0.8, metalness: 0.05 })
  );
  redDot.position.set(0, 1.02, 1.0);
  redDot.receiveShadow = true;
  tedxGroup.add(redDot);

  // Stage Spotlight Beaming Down on the Red Dot
  const tedxSpotLight = new THREE.SpotLight(0xffffff, 5.0, 22, Math.PI / 6, 0.4, 1.5);
  tedxSpotLight.position.set(0, 8.0, 1.0);
  tedxSpotLight.target = redDot;
  tedxSpotLight.castShadow = true;
  tedxGroup.add(tedxSpotLight);

  const tedxBeamGeo = new THREE.ConeGeometry(2.2, 7.5, 24, 1, true);
  const tedxBeamMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.12,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const tedxBeam = new THREE.Mesh(tedxBeamGeo, tedxBeamMat);
  tedxBeam.position.set(0, 4.5, 1.0);
  tedxBeam.rotation.x = Math.PI;
  tedxGroup.add(tedxBeam);

  // Giant 3D Red "TEDx" Letters Standing on Stage
  const tedLetterMat = new THREE.MeshStandardMaterial({
    color: 0xeb0028,
    roughness: 0.25,
    metalness: 0.15,
  });

  const letterGroup = new THREE.Group();
  letterGroup.position.set(0, 1.0, -2.4);

  // Letter T
  const tGroup = new THREE.Group();
  tGroup.position.x = -3.8;
  const tStem = new THREE.Mesh(new THREE.BoxGeometry(0.5, 2.2, 0.4), tedLetterMat);
  tStem.position.y = 1.1;
  tStem.castShadow = true;
  tGroup.add(tStem);
  const tTop = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.5, 0.4), tedLetterMat);
  tTop.position.y = 2.0;
  tTop.castShadow = true;
  tGroup.add(tTop);
  letterGroup.add(tGroup);

  // Letter E
  const eGroup = new THREE.Group();
  eGroup.position.x = -1.6;
  const eSpine = new THREE.Mesh(new THREE.BoxGeometry(0.5, 2.2, 0.4), tedLetterMat);
  eSpine.position.y = 1.1;
  eSpine.castShadow = true;
  eGroup.add(eSpine);
  [0.25, 1.1, 2.0].forEach((yPos) => {
    const bar = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.42, 0.4), tedLetterMat);
    bar.position.set(0.4, yPos, 0);
    bar.castShadow = true;
    eGroup.add(bar);
  });
  letterGroup.add(eGroup);

  // Letter D
  const dGroup = new THREE.Group();
  dGroup.position.x = 0.8;
  const dSpine = new THREE.Mesh(new THREE.BoxGeometry(0.5, 2.2, 0.4), tedLetterMat);
  dSpine.position.y = 1.1;
  dSpine.castShadow = true;
  dGroup.add(dSpine);
  const dCurve = new THREE.Mesh(
    new THREE.TorusGeometry(0.85, 0.26, 12, 16, Math.PI),
    tedLetterMat
  );
  dCurve.position.set(0.4, 1.1, 0);
  dCurve.rotation.z = -Math.PI / 2;
  dCurve.castShadow = true;
  dGroup.add(dCurve);
  letterGroup.add(dGroup);

  // Letter x
  const xGroup = new THREE.Group();
  xGroup.position.set(2.8, 0, 0);
  const xBar1 = new THREE.Mesh(new THREE.BoxGeometry(0.38, 1.6, 0.38), tedLetterMat);
  xBar1.position.y = 0.85;
  xBar1.rotation.z = 0.65;
  xBar1.castShadow = true;
  xGroup.add(xBar1);
  const xBar2 = new THREE.Mesh(new THREE.BoxGeometry(0.38, 1.6, 0.38), tedLetterMat);
  xBar2.position.y = 0.85;
  xBar2.rotation.z = -0.65;
  xBar2.castShadow = true;
  xGroup.add(xBar2);
  letterGroup.add(xGroup);

  tedxGroup.add(letterGroup);

  // Backdrop Banner: "TEDx • IDEAS WORTH SPREADING • MENTOR & CURATOR"
  const tedxBannerTex = createScreenTexture(
    'IDEAS WORTH SPREADING',
    'EVENT MENTOR & STAGE CURATOR • ADITYA RASAL',
    'TEDx UNIVERSITY',
    '#eb0028',
    '#0d0e14'
  );
  const tedxBanner = new THREE.Mesh(
    new THREE.PlaneGeometry(12.0, 4.2),
    new THREE.MeshBasicMaterial({ map: tedxBannerTex })
  );
  tedxBanner.position.set(0, 4.8, -3.95);
  tedxGroup.add(tedxBanner);

  // Speaker Lectern Podium
  const podiumMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.1,
    metalness: 0.1,
    transparent: true,
    opacity: 0.7,
  });
  const podium = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.2, 0.5), podiumMat);
  podium.position.set(1.4, 1.6, 1.0);
  podium.castShadow = true;
  tedxGroup.add(podium);

  const mic = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.4, 8), darkMetalMat);
  mic.position.set(1.4, 2.3, 1.0);
  mic.rotation.z = -0.3;
  tedxGroup.add(mic);

  // Stepped Amphitheater Semicircular Tiers (Audience Seating)
  const tierRadii = [8.5, 10.5, 12.5];
  const tierHeights = [0.4, 0.8, 1.2];

  tierRadii.forEach((r, idx) => {
    const tierGeo = new THREE.RingGeometry(r, r + 1.4, 32, 1, Math.PI * 0.15, Math.PI * 0.7);
    const tierMesh = new THREE.Mesh(
      tierGeo,
      new THREE.MeshStandardMaterial({ color: 0x1f2430, roughness: 0.85 })
    );
    tierMesh.rotation.x = -Math.PI / 2;
    tierMesh.position.set(0, tierHeights[idx], 1.0);
    tierMesh.receiveShadow = true;
    tedxGroup.add(tierMesh);

    const woodRim = new THREE.Mesh(
      new THREE.RingGeometry(r + 0.2, r + 1.2, 32, 1, Math.PI * 0.18, Math.PI * 0.64),
      new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.7 })
    );
    woodRim.rotation.x = -Math.PI / 2;
    woodRim.position.set(0, tierHeights[idx] + 0.02, 1.0);
    tedxGroup.add(woodRim);
  });

  scene.add(tedxGroup);

  // =========================================================================
  // 4. SECTION 3: MOUNTAIN CLIMBING & OFFROAD TRAIL ([24, 20])
  // =========================================================================
  const mountainGroup = new THREE.Group();
  mountainGroup.position.set(24, 0, 20);

  // 1. Trailhead Wooden Log Arch ([24, 0, 10.5] => local z: -9.5)
  const archGroup = new THREE.Group();
  archGroup.position.set(0, 0, -9.5);

  const log1 = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.28, 4.2, 8), woodMat);
  log1.position.set(-3.2, 2.1, 0);
  log1.castShadow = true;
  archGroup.add(log1);

  const log2 = log1.clone();
  log2.position.x = 3.2;
  archGroup.add(log2);

  const crossLog = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 7.2, 8), woodMat);
  crossLog.position.set(0, 4.1, 0);
  crossLog.rotation.z = Math.PI / 2;
  crossLog.castShadow = true;
  archGroup.add(crossLog);

  const trailSignTex = createScreenTexture(
    'OFFROAD TRAIL',
    'HIGH-ALTITUDE TREKS • ADITYA RASAL',
    'SAHYADRI & HIMALAYAN SUMMITS',
    '#10b981',
    '#062817'
  );
  const trailSign = new THREE.Mesh(
    new THREE.BoxGeometry(5.8, 1.4, 0.15),
    new THREE.MeshBasicMaterial({ map: trailSignTex })
  );
  trailSign.position.set(0, 4.8, 0);
  archGroup.add(trailSign);

  mountainGroup.add(archGroup);

  // 2. Visual Terrain Ramps (Exact 1:1 match with Cannon physics ramps)
  // Cannon Ramp 1: [24, 0.6, 14] => local [0, 0.6, -6.0], size: 5.5 x 0.4 x 6.0, rotX: -0.22
  const ramp1Mesh = new THREE.Mesh(
    new THREE.BoxGeometry(5.5, 0.4, 6.0),
    stoneMat
  );
  ramp1Mesh.position.set(0, 0.6, -6.0);
  ramp1Mesh.rotation.x = -0.22;
  ramp1Mesh.receiveShadow = true;
  ramp1Mesh.castShadow = true;
  mountainGroup.add(ramp1Mesh);

  // Cannon Ramp 2: [24, 1.6, 18] => local [0, 1.6, -2.0], size: 5.0 x 0.4 x 6.0, rotX: -0.25
  const ramp2Mesh = new THREE.Mesh(
    new THREE.BoxGeometry(5.0, 0.4, 6.0),
    stoneMat
  );
  ramp2Mesh.position.set(0, 1.6, -2.0);
  ramp2Mesh.rotation.x = -0.25;
  ramp2Mesh.receiveShadow = true;
  ramp2Mesh.castShadow = true;
  mountainGroup.add(ramp2Mesh);

  // Cannon Summit Flat Peak: [24, 2.5, 23] => local [0, 2.5, 3.0], size: 6.0 x 0.5 x 6.0
  const summitMesh = new THREE.Mesh(
    new THREE.BoxGeometry(6.0, 0.5, 6.0),
    stoneMat
  );
  summitMesh.position.set(0, 2.5, 3.0);
  summitMesh.receiveShadow = true;
  summitMesh.castShadow = true;
  mountainGroup.add(summitMesh);

  // Rugged Cliff Rocks flanking the climb on both sides
  const cliffPositions = [
    [-3.8, 0.8, -6.0, 1.8],
    [3.8, 0.9, -6.0, 2.0],
    [-3.6, 1.8, -2.0, 2.2],
    [3.6, 1.9, -2.0, 2.1],
    [-4.0, 2.6, 3.0, 2.6],
    [4.0, 2.6, 3.0, 2.8],
    [0, 2.8, 6.5, 3.0],
  ];

  cliffPositions.forEach(([cx, cy, cz, scale]) => {
    const rock = new THREE.Mesh(
      new THREE.DodecahedronGeometry(scale, 1),
      rockCliffMat
    );
    rock.position.set(cx, cy, cz);
    rock.rotation.set(Math.random(), Math.random(), Math.random());
    rock.castShadow = true;
    rock.receiveShadow = true;
    mountainGroup.add(rock);
  });

  // Alpine Pine Trees planted on rock ledges
  createPineTree(24 - 4.5, 0, 20 - 7.0, 1.2);
  createPineTree(24 + 4.5, 0, 20 - 7.0, 1.1);
  createPineTree(24 - 4.6, 1.2, 20 - 2.0, 1.3);
  createPineTree(24 + 4.6, 1.4, 20 - 1.5, 1.0);
  createPineTree(24 - 4.2, 2.5, 20 + 3.0, 1.4);
  createPineTree(24 + 4.2, 2.5, 20 + 3.2, 1.2);

  // Summit Milestone Signboard & Rock Cairn on Peak (local z: 4.2, y: 2.75)
  const cairnGroup = new THREE.Group();
  cairnGroup.position.set(0, 2.75, 4.2);

  const cairnRadii = [0.8, 0.6, 0.45, 0.3];
  cairnRadii.forEach((cr, idx) => {
    const s = new THREE.Mesh(new THREE.DodecahedronGeometry(cr, 1), stoneMat);
    s.position.y = idx * 0.42;
    s.castShadow = true;
    cairnGroup.add(s);
  });

  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 4.2, 8), woodMat);
  mast.position.y = 2.1;
  mast.castShadow = true;
  cairnGroup.add(mast);

  const summitSign = new THREE.Mesh(
    new THREE.BoxGeometry(2.4, 0.8, 0.12),
    new THREE.MeshStandardMaterial({ color: 0x064e3b, roughness: 0.6 })
  );
  summitSign.position.set(0, 3.4, 0);
  cairnGroup.add(summitSign);

  const signStripe = new THREE.Mesh(
    new THREE.BoxGeometry(2.3, 0.08, 0.14),
    new THREE.MeshBasicMaterial({ color: 0x10b981 })
  );
  signStripe.position.set(0, 3.75, 0);
  cairnGroup.add(signStripe);

  mountainGroup.add(cairnGroup);

  // Fluttering Himalayan Prayer Flags (Blue, White, Red, Green, Yellow)
  const flagColors = [0x2563eb, 0xffffff, 0xef4444, 0x22c55e, 0xfacc15];
  const flagStrands = [];

  function createPrayerFlagString(startX, startY, startZ, endX, endY, endZ) {
    const stringGroup = new THREE.Group();
    const count = 12;
    const flags = [];

    for (let i = 0; i < count; i++) {
      const alpha = (i + 0.5) / count;
      const fx = startX + (endX - startX) * alpha;
      const sag = Math.sin(alpha * Math.PI) * 0.35;
      const fy = startY + (endY - startY) * alpha - sag;
      const fz = startZ + (endZ - startZ) * alpha;

      const flagMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(0.32, 0.42),
        new THREE.MeshBasicMaterial({
          color: flagColors[i % flagColors.length],
          side: THREE.DoubleSide,
        })
      );
      flagMesh.position.set(fx, fy, fz);
      flagMesh.rotation.y = Math.atan2(endX - startX, endZ - startZ);
      stringGroup.add(flagMesh);
      flags.push({ mesh: flagMesh, offset: i * 0.4 });
    }

    mountainGroup.add(stringGroup);
    flagStrands.push(flags);
  }

  createPrayerFlagString(0, 4.8, 4.2, -4.0, 3.0, 1.0);
  createPrayerFlagString(0, 4.8, 4.2, 4.0, 3.0, 1.0);

  updateables.push(() => {
    const time = Date.now() * 0.005;
    flagStrands.forEach((flags) => {
      flags.forEach((f) => {
        f.mesh.rotation.x = Math.sin(time + f.offset) * 0.35;
      });
    });
  });

  function createCautionSign(x, y, z) {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.8, 8), darkMetalMat);
    post.position.set(x, y + 0.9, z);
    mountainGroup.add(post);

    const diamond = new THREE.Mesh(
      new THREE.BoxGeometry(0.7, 0.7, 0.06),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3 })
    );
    diamond.position.set(x, y + 1.8, z);
    diamond.rotation.z = Math.PI / 4;
    mountainGroup.add(diamond);
  }
  createCautionSign(-3.2, 0, -8.0);
  createCautionSign(3.2, 0, -8.0);

  scene.add(mountainGroup);

  // =========================================================================
  // 5. CONTACT FINISH LINE & SOCIAL PARKING BAYS ([0, 32])
  // =========================================================================
  const finishArch = new THREE.Group();
  finishArch.position.set(0, 0, 32);

  const leftPillar = new THREE.Mesh(new THREE.BoxGeometry(0.8, 5.0, 0.8), darkMetalMat);
  leftPillar.position.set(-6, 2.5, 0);
  leftPillar.castShadow = true;
  finishArch.add(leftPillar);

  const rightPillar = leftPillar.clone();
  rightPillar.position.x = 6;
  finishArch.add(rightPillar);

  const crossbar = new THREE.Mesh(new THREE.BoxGeometry(13.2, 1.2, 0.8), darkMetalMat);
  crossbar.position.set(0, 5.2, 0);
  crossbar.castShadow = true;
  finishArch.add(crossbar);

  const banner = new THREE.Mesh(
    new THREE.PlaneGeometry(12, 0.9),
    new THREE.MeshBasicMaterial({ color: 0xffffff })
  );
  banner.position.set(0, 5.2, 0.42);
  finishArch.add(banner);

  scene.add(finishArch);

  // Parking Bays
  const stalls = [
    { label: 'LINKEDIN', x: -6, z: 36, color: 0x0a66c2 },
    { label: 'GITHUB', x: -2, z: 36, color: 0x8b5cf6 },
    { label: 'RESUME', x: 2, z: 36, color: 0x10b981 },
    { label: 'CONTACT', x: 6, z: 36, color: 0xf59e0b },
  ];

  stalls.forEach((stall) => {
    const stallGroup = new THREE.Group();
    stallGroup.position.set(stall.x, 0.02, stall.z);

    const stallBox = new THREE.Mesh(
      new THREE.PlaneGeometry(3.2, 5.2),
      new THREE.MeshBasicMaterial({ color: 0x1e293b, side: THREE.DoubleSide })
    );
    stallBox.rotation.x = -Math.PI / 2;
    stallGroup.add(stallBox);

    const border = new THREE.Mesh(
      new THREE.RingGeometry(1.6, 1.7, 4),
      new THREE.MeshBasicMaterial({ color: stall.color, side: THREE.DoubleSide })
    );
    border.rotation.x = -Math.PI / 2;
    border.rotation.z = Math.PI / 4;
    stallGroup.add(border);

    scene.add(stallGroup);
  });

  function update(dt) {
    updateables.forEach((fn) => fn(dt));
  }

  return {
    update,
  };
}
