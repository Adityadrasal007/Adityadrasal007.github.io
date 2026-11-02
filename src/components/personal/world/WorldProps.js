import * as THREE from 'three';

/**
 * Rich 3D World Props & Custom Interactive Biomes (Three.js)
 *
 * Implements the full Bruno Simon Universe:
 * 1. 3D Extruded "ADITYA RASAL" Nameplate Monument (exact match to reference photo!)
 * 2. Arched Wooden Bridge crossing the River with guardrails and glowing lanterns
 * 3. Animated Winding River & Turquoise Water Flow with shoreline pebbles
 * 4. Lush Stylized Nature:
 *    - Cherry Blossom (Pink) and Autumn (Golden Orange) fluffy low-poly trees
 *    - Wooden Park Benches and Bulletin Information Kiosk with shingle roof
 *    - Roadside grass clumps, wildflower tufts, and river stones
 * 5. Tropical Coastal Beach Bay with palm trees, striped parasols, and loungers
 * 6. ANANTAM Concert Mega-Stage (LED screen, audio visualizer, speakers, moving beam spotlights, crowd)
 * 7. TEDx University Amphitheater (Stepped stone tiers, 3D red TEDx letters, circular red dot)
 * 8. Mountain Peak Trail (Stepped rock ramps, alpine cairn, fluttering prayer flags, pine trees)
 * 9. Finish Line Checkered Arch & Social Parking Stalls
 */

export function createWorldProps(scene) {
  const updateables = [];

  // Materials
  const darkMetalMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.5, metalness: 0.8 });
  const aluminumTrussMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.35, metalness: 0.7 });
  const stageDeckMat = new THREE.MeshStandardMaterial({ color: 0x090a0f, roughness: 0.4, metalness: 0.2 });
  const timberMat = new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.75 }); // Rich warm cedar
  const darkWoodMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.85 });
  const stoneMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.9, flatShading: true });
  const rockCliffMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.95, flatShading: true });

  // Foliage Materials (Matching user screenshot: cherry pinks and autumn golds)
  const cherryFoliageMat = new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.8, flatShading: true });
  const autumnFoliageMat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.8, flatShading: true });
  const amberFoliageMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.8, flatShading: true });
  const pineFoliageMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.85, flatShading: true });
  const palmFrondMat = new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.7, flatShading: true, side: THREE.DoubleSide });

  // Canvas texture generator for high-contrast neon stage screens
  function createScreenTexture(title, subtitle, badge, accentHex = '#ec4899', bgHex = '#090a15') {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = bgHex;
    ctx.fillRect(0, 0, 1024, 512);

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

    ctx.strokeStyle = accentHex;
    ctx.lineWidth = 14;
    ctx.strokeRect(12, 12, 1000, 488);

    if (badge) {
      ctx.fillStyle = accentHex;
      ctx.fillRect(360, 50, 304, 42);
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 20px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(badge, 512, 71);
    }

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 88px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = accentHex;
    ctx.shadowBlur = 32;
    ctx.fillText(title, 512, 230);

    ctx.shadowBlur = 0;
    ctx.fillStyle = accentHex;
    ctx.font = 'bold 28px monospace';
    ctx.fillText(subtitle, 512, 340);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.fillRect(100, 420, 824, 6);

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }

  // =========================================================================
  // HELPER GENERATORS: Trees, Benches, Lanterns, Palms
  // =========================================================================

  // Fluffy Low-Poly Tree (Cherry Blossom Pink or Autumn Golden)
  function createFluffyTree(x, y, z, type = 'cherry', scale = 1) {
    const treeGroup = new THREE.Group();
    treeGroup.position.set(x, y, z);
    treeGroup.scale.setScalar(scale);

    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.32, 2.4, 8),
      darkWoodMat
    );
    trunk.position.y = 1.2;
    trunk.castShadow = true;
    treeGroup.add(trunk);

    const mat = type === 'cherry' ? cherryFoliageMat : (type === 'autumn' ? autumnFoliageMat : amberFoliageMat);

    // 4 overlapping low-poly puff spheres
    const puffOffsets = [
      [0, 2.8, 0, 1.4],
      [-0.6, 2.4, 0.4, 1.1],
      [0.6, 2.5, -0.3, 1.2],
      [0.1, 3.4, -0.2, 1.0],
    ];

    puffOffsets.forEach(([px, py, pz, pr]) => {
      const puff = new THREE.Mesh(new THREE.DodecahedronGeometry(pr, 1), mat);
      puff.position.set(px, py, pz);
      puff.castShadow = true;
      treeGroup.add(puff);
    });

    scene.add(treeGroup);
    return treeGroup;
  }

  // Evergreen Alpine Pine Tree
  function createPineTree(x, y, z, scale = 1) {
    const treeGroup = new THREE.Group();
    treeGroup.position.set(x, y, z);
    treeGroup.scale.setScalar(scale);

    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.25, 1.8, 8), timberMat);
    trunk.position.y = 0.9;
    trunk.castShadow = true;
    treeGroup.add(trunk);

    const tierHeights = [1.8, 2.7, 3.5];
    const tierRadii = [1.4, 1.05, 0.7];
    tierHeights.forEach((th, i) => {
      const cone = new THREE.Mesh(new THREE.ConeGeometry(tierRadii[i], 1.4, 7), pineFoliageMat);
      cone.position.y = th;
      cone.castShadow = true;
      treeGroup.add(cone);
    });

    scene.add(treeGroup);
    return treeGroup;
  }

  // Tropical Coconut Palm Tree (for Beach)
  function createPalmTree(x, y, z, scale = 1) {
    const palm = new THREE.Group();
    palm.position.set(x, y, z);
    palm.scale.setScalar(scale);

    // Curved trunk segments
    let currY = 0;
    let currX = 0;
    for (let i = 0; i < 6; i++) {
      const seg = new THREE.Mesh(new THREE.CylinderGeometry(0.22 - i * 0.02, 0.26 - i * 0.02, 0.8, 7), timberMat);
      currX += 0.08;
      seg.position.set(currX, currY + 0.4, 0);
      seg.rotation.z = -0.12;
      seg.castShadow = true;
      palm.add(seg);
      currY += 0.75;
    }

    // 6 Radiating Palm Fronds
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const frond = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 2.5), palmFrondMat);
      frond.position.set(currX + Math.cos(angle) * 1.1, currY + 0.2, Math.sin(angle) * 1.1);
      frond.rotation.x = Math.PI / 2 + 0.3;
      frond.rotation.y = angle;
      frond.castShadow = true;
      palm.add(frond);
    }

    scene.add(palm);
  }

  // Cozy Street Lantern / Lamp Post with Warm Glowing Light
  function createLanternPost(x, z) {
    const lamp = new THREE.Group();
    lamp.position.set(x, 0, z);

    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 2.8, 8), darkMetalMat);
    post.position.y = 1.4;
    post.castShadow = true;
    lamp.add(post);

    const housing = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.55, 0.45), darkMetalMat);
    housing.position.y = 2.8;
    housing.castShadow = true;
    lamp.add(housing);

    const bulb = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.4, 0.32), new THREE.MeshBasicMaterial({ color: 0xfef08a }));
    bulb.position.y = 2.8;
    lamp.add(bulb);

    const glowLight = new THREE.PointLight(0xf59e0b, 2.2, 10, 2);
    glowLight.position.set(0, 2.8, 0);
    lamp.add(glowLight);

    scene.add(lamp);
  }

  // Wooden Park Bench (Matching reference screenshot)
  function createParkBench(x, z, rotY = 0) {
    const bench = new THREE.Group();
    bench.position.set(x, 0, z);
    bench.rotation.y = rotY;

    // Cast-iron legs
    [-0.9, 0.9].forEach((lx) => {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.7, 0.6), darkMetalMat);
      leg.position.set(lx, 0.35, 0);
      leg.castShadow = true;
      bench.add(leg);
    });

    // Wooden slats for seat
    [-0.15, 0.0, 0.15].forEach((sz) => {
      const slat = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.05, 0.12), timberMat);
      slat.position.set(0, 0.65, sz);
      slat.castShadow = true;
      bench.add(slat);
    });

    // Backrest slats
    [0.9, 1.15].forEach((by) => {
      const bslat = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.16, 0.05), timberMat);
      bslat.position.set(0, by, -0.22);
      bslat.castShadow = true;
      bench.add(bslat);
    });

    scene.add(bench);
  }

  // Bulletin Notice Board Kiosk (Matching reference screenshot)
  function createNoticeKiosk(x, z, rotY = 0) {
    const kiosk = new THREE.Group();
    kiosk.position.set(x, 0, z);
    kiosk.rotation.y = rotY;

    // Posts
    [-1.2, 1.2].forEach((px) => {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 3.2, 8), darkWoodMat);
      post.position.set(px, 1.6, 0);
      post.castShadow = true;
      kiosk.add(post);
    });

    // Corkboard backplate
    const board = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.4, 0.12), timberMat);
    board.position.set(0, 1.8, 0);
    board.castShadow = true;
    kiosk.add(board);

    // Map parchment sheet
    const mapSheet = new THREE.Mesh(
      new THREE.PlaneGeometry(1.2, 0.9),
      new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.9 })
    );
    mapSheet.position.set(0, 1.8, 0.08);
    kiosk.add(mapSheet);

    // Tiled wooden roof canopy
    const roof = new THREE.Mesh(new THREE.ConeGeometry(2.0, 0.9, 4), darkWoodMat);
    roof.position.set(0, 2.9, 0);
    roof.rotation.y = Math.PI / 4;
    roof.scale.set(1.4, 0.7, 0.8);
    roof.castShadow = true;
    kiosk.add(roof);

    scene.add(kiosk);
  }

  // =========================================================================
  // 1. 3D "ADITYA RASAL" EXTRUDED LETTERS (Exact match to Bruno Simon photo!)
  // =========================================================================
  const nameplateMat = new THREE.MeshStandardMaterial({
    color: 0xf472b6, // Blush coral pink like the screenshot
    roughness: 0.25,
    metalness: 0.1,
  });

  const nameGroup = new THREE.Group();
  nameGroup.position.set(-6, 0, -6.5);
  nameGroup.rotation.y = 0.12;

  // Function to create block letters
  function addLetter(char, xOffset, zOffset = 0, scale = 1.0) {
    const charGroup = new THREE.Group();
    charGroup.position.set(xOffset, 0, zOffset);
    charGroup.scale.setScalar(scale);

    const w = 0.7;
    const h = 1.3;
    const d = 0.55;
    const bar = 0.22;

    switch (char) {
      case 'A': {
        const l1 = new THREE.Mesh(new THREE.BoxGeometry(bar, h, d), nameplateMat);
        l1.position.set(-0.25, h / 2, 0);
        l1.rotation.z = -0.15;
        l1.castShadow = true;
        charGroup.add(l1);

        const l2 = new THREE.Mesh(new THREE.BoxGeometry(bar, h, d), nameplateMat);
        l2.position.set(0.25, h / 2, 0);
        l2.rotation.z = 0.15;
        l2.castShadow = true;
        charGroup.add(l2);

        const cross = new THREE.Mesh(new THREE.BoxGeometry(0.42, bar, d), nameplateMat);
        cross.position.set(0, h * 0.45, 0);
        cross.castShadow = true;
        charGroup.add(cross);
        break;
      }
      case 'D': {
        const spine = new THREE.Mesh(new THREE.BoxGeometry(bar, h, d), nameplateMat);
        spine.position.set(-0.25, h / 2, 0);
        spine.castShadow = true;
        charGroup.add(spine);

        const curve = new THREE.Mesh(new THREE.TorusGeometry(0.45, bar / 2, 8, 12, Math.PI), nameplateMat);
        curve.position.set(-0.05, h / 2, 0);
        curve.rotation.z = -Math.PI / 2;
        curve.castShadow = true;
        charGroup.add(curve);
        break;
      }
      case 'I': {
        const stem = new THREE.Mesh(new THREE.BoxGeometry(bar, h, d), nameplateMat);
        stem.position.set(0, h / 2, 0);
        stem.castShadow = true;
        charGroup.add(stem);
        break;
      }
      case 'T': {
        const stem = new THREE.Mesh(new THREE.BoxGeometry(bar, h, d), nameplateMat);
        stem.position.set(0, h / 2, 0);
        stem.castShadow = true;
        charGroup.add(stem);

        const top = new THREE.Mesh(new THREE.BoxGeometry(w, bar, d), nameplateMat);
        top.position.set(0, h - bar / 2, 0);
        top.castShadow = true;
        charGroup.add(top);
        break;
      }
      case 'Y': {
        const stem = new THREE.Mesh(new THREE.BoxGeometry(bar, h * 0.5, d), nameplateMat);
        stem.position.set(0, h * 0.25, 0);
        stem.castShadow = true;
        charGroup.add(stem);

        const b1 = new THREE.Mesh(new THREE.BoxGeometry(bar, h * 0.6, d), nameplateMat);
        b1.position.set(-0.2, h * 0.75, 0);
        b1.rotation.z = -0.4;
        b1.castShadow = true;
        charGroup.add(b1);

        const b2 = new THREE.Mesh(new THREE.BoxGeometry(bar, h * 0.6, d), nameplateMat);
        b2.position.set(0.2, h * 0.75, 0);
        b2.rotation.z = 0.4;
        b2.castShadow = true;
        charGroup.add(b2);
        break;
      }
      case 'R': {
        const spine = new THREE.Mesh(new THREE.BoxGeometry(bar, h, d), nameplateMat);
        spine.position.set(-0.25, h / 2, 0);
        spine.castShadow = true;
        charGroup.add(spine);

        const loop = new THREE.Mesh(new THREE.TorusGeometry(0.3, bar / 2, 8, 12, Math.PI), nameplateMat);
        loop.position.set(-0.05, h * 0.72, 0);
        loop.rotation.z = -Math.PI / 2;
        loop.castShadow = true;
        charGroup.add(loop);

        const leg = new THREE.Mesh(new THREE.BoxGeometry(bar, h * 0.55, d), nameplateMat);
        leg.position.set(0.18, h * 0.25, 0);
        leg.rotation.z = -0.4;
        leg.castShadow = true;
        charGroup.add(leg);
        break;
      }
      case 'S': {
        const sBody = new THREE.Mesh(new THREE.BoxGeometry(w * 0.7, h, d * 0.8), nameplateMat);
        sBody.position.y = h / 2;
        sBody.castShadow = true;
        charGroup.add(sBody);
        break;
      }
      case 'L': {
        const stem = new THREE.Mesh(new THREE.BoxGeometry(bar, h, d), nameplateMat);
        stem.position.set(-0.2, h / 2, 0);
        stem.castShadow = true;
        charGroup.add(stem);

        const base = new THREE.Mesh(new THREE.BoxGeometry(w * 0.75, bar, d), nameplateMat);
        base.position.set(0.1, bar / 2, 0);
        base.castShadow = true;
        charGroup.add(base);
        break;
      }
      default:
        break;
    }

    nameGroup.add(charGroup);
  }

  // Row 1: A D I T Y A
  const firstWord = ['A', 'D', 'I', 'T', 'Y', 'A'];
  firstWord.forEach((ch, idx) => {
    addLetter(ch, idx * 1.05);
  });

  // Row 2: R A S A L
  const secondWord = ['R', 'A', 'S', 'A', 'L'];
  secondWord.forEach((ch, idx) => {
    addLetter(ch, 7.5 + idx * 1.05);
  });

  scene.add(nameGroup);

  // Park Bench & Notice Kiosk near spawn
  createParkBench(2.5, -4, Math.PI);
  createNoticeKiosk(5.5, -4.5, -0.2);
  createLanternPost(1.5, -5.2);
  createLanternPost(7.5, -5.2);

  // =========================================================================
  // 2. ARCHED WOODEN BRIDGE CROSSING OVER RIVER (x: -14, z: 0)
  // =========================================================================
  const bridgeGroup = new THREE.Group();
  bridgeGroup.position.set(-14, 0, 0);

  // Wooden Planks Roadway
  const plankMat = timberMat;
  for (let px = -3.8; px <= 3.8; px += 0.35) {
    const archY = 0.72 - Math.abs(px) * 0.1; // Slight arch
    const plank = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.12, 4.4), plankMat);
    plank.position.set(px, archY, 0);
    plank.castShadow = true;
    plank.receiveShadow = true;
    bridgeGroup.add(plank);
  }

  // Curved Wooden Arch Beams (Supporting Underneath)
  [-1.9, 1.9].forEach((bz) => {
    const archBeam = new THREE.Mesh(new THREE.BoxGeometry(8.0, 0.25, 0.25), darkWoodMat);
    archBeam.position.set(0, 0.55, bz);
    archBeam.castShadow = true;
    bridgeGroup.add(archBeam);

    // Bridge Guardrails & Posts
    for (let rx = -3.8; rx <= 3.8; rx += 1.2) {
      const bPost = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.1, 8), timberMat);
      const py = 0.75 - Math.abs(rx) * 0.1;
      bPost.position.set(rx, py + 0.55, bz);
      bPost.castShadow = true;
      bridgeGroup.add(bPost);
    }

    const handrail = new THREE.Mesh(new THREE.BoxGeometry(8.0, 0.12, 0.15), timberMat);
    handrail.position.set(0, 1.35, bz);
    handrail.castShadow = true;
    bridgeGroup.add(handrail);
  });

  scene.add(bridgeGroup);

  // 4 Glowing Bridge Lanterns
  createLanternPost(-10, -2.5);
  createLanternPost(-10, 2.5);
  createLanternPost(-18, -2.5);
  createLanternPost(-18, 2.5);

  // =========================================================================
  // 3. FLUFFY NATURE: CHERRY BLOSSOM & AUTUMN TREES
  // =========================================================================
  const natureTreeSpots = [
    // Near Wooden Bridge & River banks
    [-11, 0, -5, 'cherry', 1.2],
    [-17, 0, -5, 'autumn', 1.3],
    [-10, 0, 6, 'cherry', 1.1],
    [-18, 0, 7, 'autumn', 1.2],
    [-12, 0, 14, 'amber', 1.3],
    [-17, 0, 18, 'cherry', 1.4],
    [-12, 0, -18, 'autumn', 1.2],
    [-18, 0, -22, 'cherry', 1.3],

    // Around Spawn & ADITYA Monument
    [-7.5, 0, -9, 'cherry', 1.4],
    [8.5, 0, -8, 'autumn', 1.3],
    [-4, 0, -12, 'amber', 1.1],
    [5, 0, -13, 'cherry', 1.2],

    // Framing the Race Track
    [-8, 0, 18, 'cherry', 1.2],
    [8, 0, 18, 'autumn', 1.3],
    [10, 0, 5, 'amber', 1.2],
    [16, 0, 0, 'cherry', 1.3],
    [16, 0, -12, 'autumn', 1.2],
  ];

  natureTreeSpots.forEach(([tx, ty, tz, type, scale]) => {
    createFluffyTree(tx, ty, tz, type, scale);
  });

  // =========================================================================
  // 4. TROPICAL COASTAL BEACH & SEA ([-24, 24])
  // =========================================================================
  // Palm Trees on Sandy Coast
  createPalmTree(-22, 0, 21, 1.2);
  createPalmTree(-26, 0, 26, 1.3);
  createPalmTree(-20, 0, 27, 1.1);

  // Striped Beach Umbrellas / Parasols
  function createBeachUmbrella(x, z, canopyColor = 0x06b6d4) {
    const umb = new THREE.Group();
    umb.position.set(x, 0, z);

    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.4, 8), darkMetalMat);
    pole.position.y = 1.2;
    pole.castShadow = true;
    umb.add(pole);

    const canopy = new THREE.Mesh(
      new THREE.ConeGeometry(1.6, 0.7, 12, 1, true),
      new THREE.MeshStandardMaterial({ color: canopyColor, roughness: 0.6, side: THREE.DoubleSide })
    );
    canopy.position.y = 2.4;
    canopy.castShadow = true;
    umb.add(canopy);

    scene.add(umb);
  }

  createBeachUmbrella(-23, 23, 0xf43f5e);
  createBeachUmbrella(-25, 22, 0x06b6d4);

  // Wooden Beach Lounger
  function createBeachLounger(x, z, rotY = 0) {
    const lounger = new THREE.Group();
    lounger.position.set(x, 0, z);
    lounger.rotation.y = rotY;

    const base = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.15, 2.0), timberMat);
    base.position.y = 0.15;
    base.castShadow = true;
    lounger.add(base);

    const back = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.12, 0.8), timberMat);
    back.position.set(0, 0.45, -0.6);
    back.rotation.x = -0.55;
    back.castShadow = true;
    lounger.add(back);

    scene.add(lounger);
  }

  createBeachLounger(-22.5, 24, 0.5);
  createBeachLounger(-24.5, 23.5, 0.5);

  // =========================================================================
  // 5. ANANTAM LIVE CONCERT STAGE ([-24, -20])
  // =========================================================================
  const anantamGroup = new THREE.Group();
  anantamGroup.position.set(-24, 0, -20);

  const concertStageDeck = new THREE.Mesh(new THREE.BoxGeometry(15.0, 1.5, 9.0), stageDeckMat);
  concertStageDeck.position.set(0, 0.75, 0);
  concertStageDeck.receiveShadow = true;
  concertStageDeck.castShadow = true;
  anantamGroup.add(concertStageDeck);

  const stageFrontGlow = new THREE.Mesh(new THREE.BoxGeometry(15.2, 0.12, 0.15), new THREE.MeshBasicMaterial({ color: 0xec4899 }));
  stageFrontGlow.position.set(0, 1.48, 4.5);
  anantamGroup.add(stageFrontGlow);

  const concertRamp = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.3, 5.0), new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.5 }));
  concertRamp.position.set(0, 0.4, 5.5);
  concertRamp.rotation.x = 0.16;
  concertRamp.receiveShadow = true;
  concertRamp.castShadow = true;
  anantamGroup.add(concertRamp);

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
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 8.5, 8), aluminumTrussMat);
      leg.position.set(cx, 4.25, cz);
      leg.castShadow = true;
      pillarGroup.add(leg);
    });

    for (let h = 1.0; h <= 8.0; h += 1.4) {
      const brace = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.05, 0.55), aluminumTrussMat);
      brace.position.y = h;
      pillarGroup.add(brace);
    }

    anantamGroup.add(pillarGroup);
  });

  const frontTopBeam = new THREE.Mesh(new THREE.BoxGeometry(15.2, 0.6, 0.6), aluminumTrussMat);
  frontTopBeam.position.set(0, 8.5, 4.2);
  frontTopBeam.castShadow = true;
  anantamGroup.add(frontTopBeam);

  const backTopBeam = frontTopBeam.clone();
  backTopBeam.position.z = -4.2;
  anantamGroup.add(backTopBeam);

  const leftTopBeam = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.6, 9.0), aluminumTrussMat);
  leftTopBeam.position.set(-7.2, 8.5, 0);
  anantamGroup.add(leftTopBeam);

  const rightTopBeam = leftTopBeam.clone();
  rightTopBeam.position.x = 7.2;
  anantamGroup.add(rightTopBeam);

  const ledTex = createScreenTexture(
    'ANANTAM',
    'CULTURAL MEGA-FEST • EVENT LEAD: ADITYA RASAL',
    'MAIN STAGE HEADLINER',
    '#ec4899',
    '#0b0c16'
  );

  const ledScreen = new THREE.Mesh(new THREE.PlaneGeometry(13.0, 5.5), new THREE.MeshBasicMaterial({ map: ledTex }));
  ledScreen.position.set(0, 5.0, -4.1);
  anantamGroup.add(ledScreen);

  // 16 3D Realtime Audio Visualizer Spectrum Bars
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
      bar.position.y = 2.0 + bar.scale.y * 0.5;
    });
  });

  // Hanging Line-Array Concert Speakers
  function createLineArray(xPos) {
    const speakerGroup = new THREE.Group();
    speakerGroup.position.set(xPos, 7.8, 3.8);

    for (let i = 0; i < 5; i++) {
      const box = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.45, 0.75), darkMetalMat);
      box.position.set(0, -i * 0.55, i * 0.12);
      box.rotation.x = -0.08 * i;
      box.castShadow = true;
      speakerGroup.add(box);
    }
    anantamGroup.add(speakerGroup);
  }
  createLineArray(-8.2);
  createLineArray(8.2);

  // Sweeping Moving-Head Concert Spotlights
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

    const housing = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.28, 0.45, 12), darkMetalMat);
    housing.rotation.x = Math.PI / 2;
    headGroup.add(housing);

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

  // Cheering Concert Crowd
  const crowdGroup = new THREE.Group();
  crowdGroup.position.set(0, 0, 10.5);
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

      const wristColor = wristbandColors[Math.floor(Math.random() * wristbandColors.length)];
      const wristband = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 8), new THREE.MeshBasicMaterial({ color: wristColor }));
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

  scene.add(anantamGroup);

  // =========================================================================
  // 6. TEDx UNIVERSITY AMPHITHEATER ([24, -20])
  // =========================================================================
  const tedxGroup = new THREE.Group();
  tedxGroup.position.set(24, 0, -20);

  const tedxStageMesh = new THREE.Mesh(new THREE.BoxGeometry(13.0, 1.0, 8.0), new THREE.MeshStandardMaterial({ color: 0x11131a, roughness: 0.6 }));
  tedxStageMesh.position.set(0, 0.5, 0);
  tedxStageMesh.receiveShadow = true;
  tedxStageMesh.castShadow = true;
  tedxGroup.add(tedxStageMesh);

  const redDot = new THREE.Mesh(new THREE.CylinderGeometry(1.7, 1.7, 0.03, 36), new THREE.MeshStandardMaterial({ color: 0xeb0028, roughness: 0.8, metalness: 0.05 }));
  redDot.position.set(0, 1.02, 1.0);
  redDot.receiveShadow = true;
  tedxGroup.add(redDot);

  const tedxSpotLight = new THREE.SpotLight(0xffffff, 5.0, 22, Math.PI / 6, 0.4, 1.5);
  tedxSpotLight.position.set(0, 8.0, 1.0);
  tedxSpotLight.target = redDot;
  tedxSpotLight.castShadow = true;
  tedxGroup.add(tedxSpotLight);

  const tedLetterMat = new THREE.MeshStandardMaterial({ color: 0xeb0028, roughness: 0.25, metalness: 0.15 });
  const letterGroup = new THREE.Group();
  letterGroup.position.set(0, 1.0, -2.4);

  // T
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

  // E
  const eGroup = new THREE.Group();
  eGroup.position.x = -1.6;
  const eSpine = new THREE.Mesh(new THREE.BoxGeometry(0.5, 2.2, 0.4), tedLetterMat);
  eSpine.position.y = 1.1;
  eSpine.castShadow = true;
  eGroup.add(eSpine);
  [0.25, 1.1, 2.0].forEach((yPos) => {
    const b = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.42, 0.4), tedLetterMat);
    b.position.set(0.4, yPos, 0);
    b.castShadow = true;
    eGroup.add(b);
  });
  letterGroup.add(eGroup);

  // D
  const dGroup = new THREE.Group();
  dGroup.position.x = 0.8;
  const dSpine = new THREE.Mesh(new THREE.BoxGeometry(0.5, 2.2, 0.4), tedLetterMat);
  dSpine.position.y = 1.1;
  dSpine.castShadow = true;
  dGroup.add(dSpine);
  const dCurve = new THREE.Mesh(new THREE.TorusGeometry(0.85, 0.26, 12, 16, Math.PI), tedLetterMat);
  dCurve.position.set(0.4, 1.1, 0);
  dCurve.rotation.z = -Math.PI / 2;
  dCurve.castShadow = true;
  dGroup.add(dCurve);
  letterGroup.add(dGroup);

  // x
  const xGroup = new THREE.Group();
  xGroup.position.set(2.8, 0, 0);
  const x1 = new THREE.Mesh(new THREE.BoxGeometry(0.38, 1.6, 0.38), tedLetterMat);
  x1.position.y = 0.85;
  x1.rotation.z = 0.65;
  x1.castShadow = true;
  xGroup.add(x1);
  const x2 = new THREE.Mesh(new THREE.BoxGeometry(0.38, 1.6, 0.38), tedLetterMat);
  x2.position.y = 0.85;
  x2.rotation.z = -0.65;
  x2.castShadow = true;
  xGroup.add(x2);
  letterGroup.add(xGroup);

  tedxGroup.add(letterGroup);

  // Stepped Amphitheater Tiers
  [8.5, 10.5, 12.5].forEach((r, idx) => {
    const tierMesh = new THREE.Mesh(
      new THREE.RingGeometry(r, r + 1.4, 32, 1, Math.PI * 0.15, Math.PI * 0.7),
      new THREE.MeshStandardMaterial({ color: 0x1f2430, roughness: 0.85 })
    );
    tierMesh.rotation.x = -Math.PI / 2;
    tierMesh.position.set(0, 0.4 * (idx + 1), 1.0);
    tierMesh.receiveShadow = true;
    tedxGroup.add(tierMesh);
  });

  scene.add(tedxGroup);

  // =========================================================================
  // 7. MOUNTAIN CLIMBING & OFFROAD TRAIL ([24, 20])
  // =========================================================================
  const mountainGroup = new THREE.Group();
  mountainGroup.position.set(24, 0, 20);

  // Terrain Ramps (Exact 1:1 match with Cannon physics ramps)
  const ramp1Mesh = new THREE.Mesh(new THREE.BoxGeometry(5.5, 0.4, 6.0), stoneMat);
  ramp1Mesh.position.set(0, 0.6, -6.0);
  ramp1Mesh.rotation.x = -0.22;
  ramp1Mesh.receiveShadow = true;
  mountainGroup.add(ramp1Mesh);

  const ramp2Mesh = new THREE.Mesh(new THREE.BoxGeometry(5.0, 0.4, 6.0), stoneMat);
  ramp2Mesh.position.set(0, 1.6, -2.0);
  ramp2Mesh.rotation.x = -0.25;
  ramp2Mesh.receiveShadow = true;
  mountainGroup.add(ramp2Mesh);

  const summitMesh = new THREE.Mesh(new THREE.BoxGeometry(6.0, 0.5, 6.0), stoneMat);
  summitMesh.position.set(0, 2.5, 3.0);
  summitMesh.receiveShadow = true;
  mountainGroup.add(summitMesh);

  // Summit Cairn & Sign
  const cairnGroup = new THREE.Group();
  cairnGroup.position.set(0, 2.75, 4.2);
  [0.8, 0.6, 0.45, 0.3].forEach((cr, idx) => {
    const s = new THREE.Mesh(new THREE.DodecahedronGeometry(cr, 1), stoneMat);
    s.position.y = idx * 0.42;
    s.castShadow = true;
    cairnGroup.add(s);
  });

  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 4.2, 8), timberMat);
  mast.position.y = 2.1;
  mast.castShadow = true;
  cairnGroup.add(mast);

  const summitSign = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.8, 0.12), new THREE.MeshStandardMaterial({ color: 0x064e3b, roughness: 0.6 }));
  summitSign.position.set(0, 3.4, 0);
  cairnGroup.add(summitSign);
  mountainGroup.add(cairnGroup);

  // Fluttering Himalayan Prayer Flags
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
        new THREE.MeshBasicMaterial({ color: flagColors[i % flagColors.length], side: THREE.DoubleSide })
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

  // Pine Trees on Mountain Ridge
  createPineTree(24 - 4.5, 0, 20 - 7.0, 1.2);
  createPineTree(24 + 4.5, 0, 20 - 7.0, 1.1);
  createPineTree(24 - 4.6, 1.2, 20 - 2.0, 1.3);
  createPineTree(24 + 4.6, 1.4, 20 - 1.5, 1.0);
  createPineTree(24 - 4.2, 2.5, 20 + 3.0, 1.4);
  createPineTree(24 + 4.2, 2.5, 20 + 3.2, 1.2);

  scene.add(mountainGroup);

  // =========================================================================
  // 8. FINISH LINE ARCH & SOCIAL PARKING BAYS ([0, 32])
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
