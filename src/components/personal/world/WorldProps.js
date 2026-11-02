import * as THREE from 'three';

/**
 * Rich 3D World Props & Biome Sculptures (Three.js)
 *
 * Modeled in Bruno Simon's iconic playful tabletop style:
 * - 3D Neon Arches you drive through on the highway
 * - The Turtle Pond with low-poly turtle sculpture
 * - The Konkan Monsoon Shelter with localized rain drops
 * - Hot Chocolate Campfire with flickering light
 * - NASA Space Apps Satellite & Hackathon pavilions
 * - Checkered Finish Line with dedicated Social Parking Stalls
 */

export function createWorldProps(scene) {
  const updateables = [];

  // Common Materials
  const darkMetalMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.6 });
  const woodMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.8 });
  const waterMat = new THREE.MeshStandardMaterial({
    color: 0x06b6d4,
    roughness: 0.1,
    metalness: 0.3,
    transparent: true,
    opacity: 0.85,
  });

  // ==========================================
  // 1. HERO SPAWN BILLBOARD & ROAD CONES
  // ==========================================
  const billboardGroup = new THREE.Group();
  billboardGroup.position.set(0, 0, -10);

  // Posts
  const post1 = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 5, 12), darkMetalMat);
  post1.position.set(-6, 2.5, 0);
  post1.castShadow = true;
  billboardGroup.add(post1);

  const post2 = post1.clone();
  post2.position.x = 6;
  billboardGroup.add(post2);

  // Signboard Plate
  const board = new THREE.Mesh(
    new THREE.BoxGeometry(13.5, 2.4, 0.35),
    new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3 })
  );
  board.position.set(0, 4.2, 0);
  board.castShadow = true;
  billboardGroup.add(board);

  // Neon Title Strip
  const neonStrip = new THREE.Mesh(
    new THREE.BoxGeometry(13.2, 0.1, 0.38),
    new THREE.MeshBasicMaterial({ color: 0xf59e0b })
  );
  neonStrip.position.set(0, 5.3, 0);
  billboardGroup.add(neonStrip);

  scene.add(billboardGroup);

  // Traffic Cones
  function createTrafficCone(x, z) {
    const coneGroup = new THREE.Group();
    coneGroup.position.set(x, 0, z);

    const base = new THREE.Mesh(
      new THREE.BoxGeometry(0.7, 0.08, 0.7),
      new THREE.MeshStandardMaterial({ color: 0xf97316 })
    );
    base.castShadow = true;
    coneGroup.add(base);

    const cone = new THREE.Mesh(
      new THREE.ConeGeometry(0.28, 0.85, 16),
      new THREE.MeshStandardMaterial({ color: 0xf97316 })
    );
    cone.position.y = 0.45;
    cone.castShadow = true;
    coneGroup.add(cone);

    const stripe = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.22, 0.2, 16),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    stripe.position.y = 0.45;
    coneGroup.add(stripe);

    scene.add(coneGroup);
  }

  createTrafficCone(-5, 4);
  createTrafficCone(5, 4);
  createTrafficCone(-5, -4);
  createTrafficCone(5, -4);

  // ==========================================
  // 2. CAREER RUNWAY NEON HIGHWAY ARCHES
  // ==========================================
  function createHighwayArch(z, labelColor = 0x06b6d4) {
    const archGroup = new THREE.Group();
    archGroup.position.set(0, 0, z);

    const leg1 = new THREE.Mesh(new THREE.BoxGeometry(0.6, 5.5, 0.6), darkMetalMat);
    leg1.position.set(-6, 2.75, 0);
    leg1.castShadow = true;
    archGroup.add(leg1);

    const leg2 = leg1.clone();
    leg2.position.x = 6;
    archGroup.add(leg2);

    const topBeam = new THREE.Mesh(new THREE.BoxGeometry(13.2, 0.8, 0.6), darkMetalMat);
    topBeam.position.set(0, 5.4, 0);
    topBeam.castShadow = true;
    archGroup.add(topBeam);

    // Glowing Neon Underlight
    const neon = new THREE.Mesh(
      new THREE.BoxGeometry(12.6, 0.15, 0.7),
      new THREE.MeshBasicMaterial({ color: labelColor })
    );
    neon.position.set(0, 4.95, 0);
    archGroup.add(neon);

    scene.add(archGroup);
  }

  createHighwayArch(-18, 0x38bdf8);
  createHighwayArch(-28, 0xa855f7);
  createHighwayArch(-38, 0x10b981);

  // Ring of Light to Jump Through over the Ramp
  const jumpRingGeo = new THREE.TorusGeometry(3.2, 0.22, 16, 32);
  const jumpRingMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24 });
  const jumpRing = new THREE.Mesh(jumpRingGeo, jumpRingMat);
  jumpRing.position.set(0, 4.2, -22);
  scene.add(jumpRing);

  // ==========================================
  // 3. HACKATHONS ARENA: NASA SATELLITE & KIOSKS
  // ==========================================
  const satelliteGroup = new THREE.Group();
  satelliteGroup.position.set(-24, 3.8, 12);

  // Satellite Body (Gold Foil Box)
  const satBody = new THREE.Mesh(
    new THREE.BoxGeometry(1.4, 1.4, 1.4),
    new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.2 })
  );
  satBody.castShadow = true;
  satelliteGroup.add(satBody);

  // Solar Panels (Blue Grid Wings)
  const solarMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, metalness: 0.7, roughness: 0.3 });
  const wingLeft = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.8, 0.05), solarMat);
  wingLeft.position.set(-2.0, 0, 0);
  wingLeft.castShadow = true;
  satelliteGroup.add(wingLeft);

  const wingRight = wingLeft.clone();
  wingRight.position.x = 2.0;
  satelliteGroup.add(wingRight);

  // Dish Antenna
  const dish = new THREE.Mesh(
    new THREE.SphereGeometry(0.7, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2),
    darkMetalMat
  );
  dish.rotation.x = -Math.PI / 2;
  dish.position.set(0, 1.0, 0);
  satelliteGroup.add(dish);

  scene.add(satelliteGroup);

  // Slow orbit rotation for satellite
  updateables.push((dt) => {
    satelliteGroup.rotation.y += dt * 0.4;
    satelliteGroup.position.y = 3.8 + Math.sin(Date.now() * 0.002) * 0.25;
  });

  // ==========================================
  // 4. HOBBIES GROVE: TURTLE POND, KONKAN RAIN & CAMPFIRE
  // ==========================================

  // A. The Turtle Pond (x: 24, z: 12)
  const pondGroup = new THREE.Group();
  pondGroup.position.set(24, 0, 12);

  // Pond Basin Rim
  const rimGeo = new THREE.CylinderGeometry(4.2, 4.5, 0.4, 32);
  const rimMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.9 });
  const pondRim = new THREE.Mesh(rimGeo, rimMat);
  pondRim.position.y = 0.2;
  pondRim.castShadow = true;
  pondRim.receiveShadow = true;
  pondGroup.add(pondRim);

  // Pond Water Surface
  const waterGeo = new THREE.CircleGeometry(4.0, 32);
  const water = new THREE.Mesh(waterGeo, waterMat);
  water.rotation.x = -Math.PI / 2;
  water.position.y = 0.32;
  pondGroup.add(water);

  // Sunbathing Rock
  const rock = new THREE.Mesh(
    new THREE.DodecahedronGeometry(1.2, 1),
    new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.9 })
  );
  rock.scale.set(1.4, 0.6, 1.2);
  rock.position.set(0, 0.45, 0);
  rock.castShadow = true;
  pondGroup.add(rock);

  // Stylized Low-Poly Turtle resting on the rock
  const turtle = new THREE.Group();
  turtle.position.set(0, 0.8, 0);

  // Shell (Carapace)
  const shell = new THREE.Mesh(
    new THREE.SphereGeometry(0.65, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.6 })
  );
  shell.scale.set(1.2, 0.7, 1.5);
  shell.castShadow = true;
  turtle.add(shell);

  // Head
  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.22, 8, 8),
    new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.5 })
  );
  head.position.set(0, 0.15, 1.0);
  turtle.add(head);

  // 4 Flippers
  const flipperGeo = new THREE.BoxGeometry(0.4, 0.08, 0.25);
  const flipperMat = new THREE.MeshStandardMaterial({ color: 0x22c55e });
  [-0.65, 0.65].forEach((fx) => {
    const fFront = new THREE.Mesh(flipperGeo, flipperMat);
    fFront.position.set(fx, 0.05, 0.5);
    turtle.add(fFront);

    const fBack = new THREE.Mesh(flipperGeo, flipperMat);
    fBack.position.set(fx, 0.05, -0.5);
    turtle.add(fBack);
  });

  pondGroup.add(turtle);
  scene.add(pondGroup);

  // B. Konkan Monsoon Rain Shower (x: 24, z: 22)
  const rainCount = 180;
  const rainGeo = new THREE.BufferGeometry();
  const rainPos = new Float32Array(rainCount * 3);

  for (let i = 0; i < rainCount; i++) {
    rainPos[i * 3] = 24 + (Math.random() - 0.5) * 12;
    rainPos[i * 3 + 1] = Math.random() * 10;
    rainPos[i * 3 + 2] = 22 + (Math.random() - 0.5) * 12;
  }
  rainGeo.setAttribute('position', new THREE.BufferAttribute(rainPos, 3));

  const rainMat = new THREE.PointsMaterial({
    color: 0x67e8f9,
    size: 0.12,
    transparent: true,
    opacity: 0.7,
  });
  const rainParticles = new THREE.Points(rainGeo, rainMat);
  scene.add(rainParticles);

  updateables.push((dt) => {
    const pos = rainGeo.attributes.position.array;
    for (let i = 0; i < rainCount; i++) {
      pos[i * 3 + 1] -= dt * 18;
      if (pos[i * 3 + 1] < 0) {
        pos[i * 3 + 1] = 10;
      }
    }
    rainGeo.attributes.position.needsUpdate = true;
  });

  // C. Hot Chocolate Campfire (x: 18, z: 12)
  const campGroup = new THREE.Group();
  campGroup.position.set(18, 0, 12);

  // Firepit Stones
  for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
    const s = new THREE.Mesh(new THREE.DodecahedronGeometry(0.25, 0), darkMetalMat);
    s.position.set(Math.cos(a) * 0.9, 0.15, Math.sin(a) * 0.9);
    s.castShadow = true;
    campGroup.add(s);
  }

  // Campfire Flickering PointLight
  const fireLight = new THREE.PointLight(0xf97316, 3.5, 12, 1.8);
  fireLight.position.set(0, 0.7, 0);
  campGroup.add(fireLight);

  scene.add(campGroup);

  updateables.push(() => {
    // Random flicker
    fireLight.intensity = 3.2 + Math.sin(Date.now() * 0.012) * 0.6 + (Math.random() - 0.5) * 0.4;
  });

  // ==========================================
  // 5. CONTACT FINISH LINE & SOCIAL PARKING BAYS
  // ==========================================
  const stalls = [
    { label: 'LINKEDIN', x: -6, z: 36, color: 0x0a66c2 },
    { label: 'GITHUB', x: -2, z: 36, color: 0x8b5cf6 },
    { label: 'EMAIL', x: 2, z: 36, color: 0xf59e0b },
    { label: 'RESUME', x: 6, z: 36, color: 0x10b981 },
  ];

  stalls.forEach((stall) => {
    const stallGroup = new THREE.Group();
    stallGroup.position.set(stall.x, 0.02, stall.z);

    // Parking Stall Outline
    const stallBox = new THREE.Mesh(
      new THREE.PlaneGeometry(3.2, 5.2),
      new THREE.MeshBasicMaterial({ color: 0x1e293b, side: THREE.DoubleSide })
    );
    stallBox.rotation.x = -Math.PI / 2;
    stallGroup.add(stallBox);

    // Glowing Border Line
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
