import * as THREE from 'three';

/**
 * 3D Bruno Simon Playground World (Three.js)
 *
 * Implements:
 * - Tabletop arena with floor grids, road markings, and curbs
 * - Synchronized destructible "A-D-I-T-Y-A" blocks and bowling pins
 * - 5 Interactive Portfolio Showcase Pavilions with trigger zones
 * - High-contrast lighting with realistic soft shadow projection
 */

export const PLAYGROUND_ZONES = [
  {
    id: 'anantam',
    name: 'Live Concert Stage',
    title: 'ANANTAM Cultural Festival',
    subtitle: 'Event Lead & Festival Director',
    description: 'Directed our university premier cultural mega-fest. Led 200+ organizing crew, multi-artist live concerts, high-wattage audio-visual rigging, and safe crowd operations for 8,000+ energized students.',
    center: [-24, -20],
    radius: 11,
    color: '#ec4899',
  },
  {
    id: 'tedx',
    name: 'University Amphitheater',
    title: 'TEDx Event',
    subtitle: 'Event Mentor & Stage Curator',
    description: 'Curated and mentored thought leaders on the iconic red dot. Coached 12+ national speakers on storytelling, managed stage acoustics & lighting direction, and fostered intellectual curiosity across campus.',
    center: [24, -20],
    radius: 11,
    color: '#ef4444',
  },
  {
    id: 'mountain',
    name: 'Mountain Peak & Trail',
    title: 'Trekking & Offroad Adventure',
    subtitle: 'High-Altitude Mountaineer & 4x4 Enthusiast',
    description: 'Scaling rugged Sahyadri cliffs and high-altitude Himalayan passes. Testing endurance, high-stakes decision making, and mental grit across treacherous weather and offroad terrains.',
    center: [24, 20],
    radius: 11,
    color: '#10b981',
  },
  {
    id: 'beach',
    name: 'Coastal Beach & Sea',
    title: 'Tropical Ocean & River Delta',
    subtitle: 'Warm Sand, Surf & Palm Groves',
    description: 'Where the river flows into the turquoise sea: golden beach sand, ocean waves, coconut palms, and wooden bridge crossings.',
    center: [-24, 24],
    radius: 10,
    color: '#06b6d4',
  },
  {
    id: 'contact',
    name: 'The Finish Line',
    title: 'Connect with Aditya',
    subtitle: 'Open for Bold Challenges & Leadership',
    description: 'Park in the social stalls to explore my LinkedIn, GitHub, or download my resume. Let’s build something extraordinary together!',
    center: [0, 32],
    radius: 8,
    color: '#3b82f6',
  },
];

export function createWorldPlayground(scene, dynamicObstacles) {
  // 1. Playground Base Floor (Terracotta / Warm Slate Tabletop)
  const floorGeo = new THREE.PlaneGeometry(94, 94);
  const floorMat = new THREE.MeshStandardMaterial({
    color: 0x161824,
    roughness: 0.7,
    metalness: 0.08,
  });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  // Subtle Floor Grid & Markings
  const gridHelper = new THREE.GridHelper(90, 45, 0x3b82f6, 0x1e293b);
  gridHelper.position.y = 0.005;
  scene.add(gridHelper);

  // 2. Continuous Racing Circuit Track (Paved asphalt ribbons & markings)
  const trackMat = new THREE.MeshStandardMaterial({
    color: 0x10121a,
    roughness: 0.85,
    metalness: 0.1,
  });

  function createRoadSegment(x, z, w, d, rotY = 0) {
    const road = new THREE.Mesh(new THREE.PlaneGeometry(w, d), trackMat);
    road.rotation.x = -Math.PI / 2;
    road.rotation.z = rotY;
    road.position.set(x, 0.012, z);
    road.receiveShadow = true;
    scene.add(road);
    return road;
  }

  // A. Main Starting Runway (x: 0, from z: -14 to +32)
  createRoadSegment(0, 9, 7.5, 46);

  // Starting Grid Boxes & Lines
  const whitePaintMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const yellowPaintMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });

  for (let z = 2; z <= 22; z += 6) {
    [-2.2, 2.2].forEach((gx) => {
      const gridBox = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 3.2), whitePaintMat);
      gridBox.rotation.x = -Math.PI / 2;
      gridBox.position.set(gx, 0.014, z);
      scene.add(gridBox);

      // Inner cutout
      const inner = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 2.8), trackMat);
      inner.rotation.x = -Math.PI / 2;
      inner.position.set(gx, 0.015, z);
      scene.add(inner);
    });
  }

  // Dashed Centerline along main runway
  for (let z = -12; z <= 28; z += 3.5) {
    const dash = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 1.8), whitePaintMat);
    dash.rotation.x = -Math.PI / 2;
    dash.position.set(0, 0.014, z);
    scene.add(dash);
  }

  // B. Cross Road (Connecting Bridge [-14, 0] to Main Runway [0, 0] to East Side [24, 0])
  createRoadSegment(5, 0, 18, 6.5, Math.PI / 2);
  createRoadSegment(-7, 0, 14, 6.5, Math.PI / 2);
  createRoadSegment(-21, 0, 10, 6.5, Math.PI / 2);

  // C. North-West Road to ANANTAM Concert Stage ([-24, -20])
  createRoadSegment(-24, -10, 7.0, 20);

  // D. North-East Road to TEDx Amphitheater ([24, -20])
  createRoadSegment(24, -10, 7.0, 20);

  // E. South-East Road to Mountain Ascent ([24, 15])
  createRoadSegment(24, 8, 6.5, 16);

  // F. South-West Road to Tropical Beach ([-24, 20])
  createRoadSegment(-24, 12, 6.5, 24);

  // Rumble Strips / Curbs (Alternating Red and White Blocks on Track Curves)
  const curbRedMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.4 });
  const curbWhiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });

  function createCurbLine(startX, startZ, length, isHorizontal = false) {
    const count = Math.floor(length / 0.8);
    for (let i = 0; i < count; i++) {
      const mat = i % 2 === 0 ? curbRedMat : curbWhiteMat;
      const curb = new THREE.Mesh(
        new THREE.BoxGeometry(isHorizontal ? 0.8 : 0.4, 0.08, isHorizontal ? 0.4 : 0.8),
        mat
      );
      curb.position.set(
        startX + (isHorizontal ? i * 0.8 : 0),
        0.04,
        startZ + (isHorizontal ? 0 : i * 0.8)
      );
      curb.castShadow = true;
      curb.receiveShadow = true;
      scene.add(curb);
    }
  }

  createCurbLine(-3.9, -12, 42); // Left curb along main runway
  createCurbLine(3.9, -12, 42);  // Right curb along main runway

  // 3. Winding River Surface (Running along x: -14 from z: -38 to +26)
  const riverMat = new THREE.MeshStandardMaterial({
    color: 0x06b6d4,
    roughness: 0.1,
    metalness: 0.4,
    transparent: true,
    opacity: 0.88,
  });

  const riverGeo = new THREE.PlaneGeometry(6.8, 66);
  const riverMesh = new THREE.Mesh(riverGeo, riverMat);
  riverMesh.rotation.x = -Math.PI / 2;
  riverMesh.position.set(-14, 0.018, -6);
  riverMesh.receiveShadow = true;
  scene.add(riverMesh);

  // River foam banks
  const foamMat = new THREE.MeshBasicMaterial({ color: 0xe0f2fe, transparent: true, opacity: 0.6 });
  [-17.3, -10.7].forEach((fx) => {
    const foam = new THREE.Mesh(new THREE.PlaneGeometry(0.35, 66), foamMat);
    foam.rotation.x = -Math.PI / 2;
    foam.position.set(fx, 0.02, -6);
    scene.add(foam);
  });

  // 4. Tropical Sandy Beach Bay (in South-West: [-24, 24])
  const sandGeo = new THREE.CircleGeometry(12, 32);
  const sandMat = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    roughness: 0.95,
  });
  const sandMesh = new THREE.Mesh(sandGeo, sandMat);
  sandMesh.rotation.x = -Math.PI / 2;
  sandMesh.position.set(-24, 0.016, 24);
  sandMesh.receiveShadow = true;
  scene.add(sandMesh);

  // 3. Create Meshes for Physics Obstacles (Blocks & Pins)
  const obstacleMeshes = [];

  const blockColors = [0xf59e0b, 0xef4444, 0x3b82f6, 0x10b981, 0x8b5cf6, 0xec4899];

  dynamicObstacles.forEach((item, idx) => {
    const [w, h, depth] = item.size;
    let mesh;

    if (item.label.startsWith('pin')) {
      // White bowling pin
      const pinGeo = new THREE.CylinderGeometry(w * 0.45, w * 0.65, h, 14);
      const pinMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
      mesh = new THREE.Mesh(pinGeo, pinMat);

      // Red stripe
      const ring = new THREE.Mesh(
        new THREE.CylinderGeometry(w * 0.47, w * 0.49, h * 0.15, 14),
        new THREE.MeshBasicMaterial({ color: 0xef4444 })
      );
      ring.position.y = h * 0.22;
      mesh.add(ring);
    } else if (item.label.startsWith('boulder')) {
      // Mountain Tumble Boulder (Dynamic rugged rock!)
      const rockRadius = w * 0.5;
      const rockGeo = new THREE.DodecahedronGeometry(rockRadius, 1);
      const pos = rockGeo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const vx = pos.getX(i);
        const vy = pos.getY(i);
        const vz = pos.getZ(i);
        const noise = 1 + Math.sin(vx * 7 + vz * 3 + i) * 0.18;
        pos.setXYZ(i, vx * noise, vy * noise, vz * noise);
      }
      rockGeo.computeVertexNormals();
      const rockMat = new THREE.MeshStandardMaterial({
        color: 0x64748b, // Mountain granite slate
        roughness: 0.9,
        metalness: 0.1,
        flatShading: true,
      });
      mesh = new THREE.Mesh(rockGeo, rockMat);
    } else if (item.label.startsWith('crate')) {
      // Bruno Simon Wooden Crate with Red Metal Reinforcement Bands
      const crateGroup = new THREE.Group();
      const woodBody = new THREE.Mesh(
        new THREE.BoxGeometry(w, h, depth),
        new THREE.MeshStandardMaterial({ color: 0x9a3412, roughness: 0.7 })
      );
      crateGroup.add(woodBody);

      // Red corner brackets & straps (like in user screenshot)
      const strapMat = new THREE.MeshStandardMaterial({ color: 0xef4444, metalness: 0.3, roughness: 0.4 });
      const strapX = new THREE.Mesh(new THREE.BoxGeometry(w * 1.02, h * 0.18, depth * 1.02), strapMat);
      crateGroup.add(strapX);

      mesh = crateGroup;
    } else {
      // Colorful wooden toy block
      const color = blockColors[idx % blockColors.length];
      const boxGeo = new THREE.BoxGeometry(w, h, depth);
      const boxMat = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.35,
        metalness: 0.05,
      });
      mesh = new THREE.Mesh(boxGeo, boxMat);
    }

    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
    obstacleMeshes.push({ mesh, body: item.body });
  });

  // 4. Ramps in Three.js (Matches Cannon physics ramps)
  function createVisualRamp(x, z, rotY = 0) {
    const rampGroup = new THREE.Group();
    const rampGeo = new THREE.BoxGeometry(5.0, 0.4, 7.0);
    const rampMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.3,
      roughness: 0.4,
    });
    const mesh = new THREE.Mesh(rampGeo, rampMat);
    mesh.rotation.x = -0.22;
    mesh.position.y = 0.5;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    rampGroup.add(mesh);

    // Hazard Stripes on ramp sides
    const stripeGeo = new THREE.BoxGeometry(0.1, 0.42, 7.0);
    const stripeMat = new THREE.MeshBasicMaterial({ color: 0x18181b });
    const s1 = new THREE.Mesh(stripeGeo, stripeMat);
    s1.position.set(2.5, 0.5, 0);
    s1.rotation.x = -0.22;
    rampGroup.add(s1);

    const s2 = s1.clone();
    s2.position.x = -2.5;
    rampGroup.add(s2);

    rampGroup.position.set(x, 0, z);
    rampGroup.rotation.y = rotY;
    scene.add(rampGroup);
  }

  createVisualRamp(0, -22, 0);

  // 5. Zone Pavilions & Floating Floor Holograms
  PLAYGROUND_ZONES.forEach((zone) => {
    const [zx, zz] = zone.center;

    // Glowing Circular Parking Pad
    const padGeo = new THREE.RingGeometry(zone.radius - 0.4, zone.radius, 48);
    const padMat = new THREE.MeshBasicMaterial({
      color: zone.color,
      side: THREE.DoubleSide,
    });
    const pad = new THREE.Mesh(padGeo, padMat);
    pad.rotation.x = -Math.PI / 2;
    pad.position.set(zx, 0.02, zz);
    scene.add(pad);

    // Floor Crosshatch Target
    const innerRing = new THREE.Mesh(
      new THREE.RingGeometry(zone.radius * 0.4, zone.radius * 0.45, 32),
      padMat
    );
    innerRing.rotation.x = -Math.PI / 2;
    innerRing.position.set(zx, 0.02, zz);
    scene.add(innerRing);

    // 4 Corner Neon Pylons
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 2) {
      const px = zx + Math.cos(angle) * (zone.radius - 0.5);
      const pz = zz + Math.sin(angle) * (zone.radius - 0.5);

      const pylon = new THREE.Mesh(
        new THREE.CylinderGeometry(0.15, 0.25, 2.4, 8),
        new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.5 })
      );
      pylon.position.set(px, 1.2, pz);
      pylon.castShadow = true;
      scene.add(pylon);

      // Glowing Pylon Beacon
      const beacon = new THREE.Mesh(
        new THREE.SphereGeometry(0.22, 12, 12),
        new THREE.MeshBasicMaterial({ color: zone.color })
      );
      beacon.position.set(px, 2.45, pz);
      scene.add(beacon);
    }
  });

  // 6. Finish Line Checkered Arch
  const finishArch = new THREE.Group();
  const pillarMat = new THREE.MeshStandardMaterial({ color: 0x18181b });

  const leftPillar = new THREE.Mesh(new THREE.BoxGeometry(0.8, 5.0, 0.8), pillarMat);
  leftPillar.position.set(-6, 2.5, 32);
  leftPillar.castShadow = true;
  finishArch.add(leftPillar);

  const rightPillar = leftPillar.clone();
  rightPillar.position.x = 6;
  finishArch.add(rightPillar);

  const crossbar = new THREE.Mesh(new THREE.BoxGeometry(13.2, 1.2, 0.8), pillarMat);
  crossbar.position.set(0, 5.2, 32);
  crossbar.castShadow = true;
  finishArch.add(crossbar);

  // Checkered banner
  const banner = new THREE.Mesh(
    new THREE.PlaneGeometry(12, 0.9),
    new THREE.MeshBasicMaterial({ color: 0xffffff })
  );
  banner.position.set(0, 5.2, 32.42);
  finishArch.add(banner);

  scene.add(finishArch);

  // 7. Update Function: syncs destructible meshes with Cannon bodies
  function update() {
    obstacleMeshes.forEach((item) => {
      item.mesh.position.copy(item.body.position);
      item.mesh.quaternion.copy(item.body.quaternion);
    });
  }

  return {
    update,
  };
}

