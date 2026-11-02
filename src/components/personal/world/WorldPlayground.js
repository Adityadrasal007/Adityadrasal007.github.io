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
    id: 'hero',
    name: 'Spawn Point',
    title: 'Aditya Rasal',
    subtitle: 'Full-Stack & Edge-AI Engineer',
    description: 'Welcome to the 3D playground. Drive around to explore my journey, hackathons, and projects!',
    center: [0, 0],
    radius: 7,
    color: '#f59e0b',
  },
  {
    id: 'milestones',
    name: 'Career Runway',
    title: 'Engineering Milestones',
    subtitle: 'Core Technical Evolution',
    description: 'Years of building production-grade computer vision, edge AI pipelines, and distributed backends.',
    center: [0, -24],
    radius: 9,
    color: '#06b6d4',
  },
  {
    id: 'hackathons',
    name: 'Hackathons & Outposts',
    title: 'Competitive Engineering',
    subtitle: 'NASA Space Apps · Vibenity · GDG',
    description: 'Championship-grade hackathon builds, real-time computer vision systems, and community leadership.',
    center: [-24, 12],
    radius: 9,
    color: '#8b5cf6',
  },
  {
    id: 'hobbies',
    name: 'Hobbies Grove',
    title: 'Life, Konkan & Hobbies',
    subtitle: 'Turtle Pond · Monsoon Rain · Campfire',
    description: 'Beyond code: spending rainy days in Konkan, caring for turtles, DIY tinkering, and warm hot chocolate.',
    center: [24, 12],
    radius: 9,
    color: '#10b981',
  },
  {
    id: 'contact',
    name: 'The Finish Line',
    title: 'Get In Touch',
    subtitle: 'Open for High-Impact Roles',
    description: 'Park in the social bays or download my updated resume below.',
    center: [0, 32],
    radius: 8,
    color: '#ef4444',
  },
];

export function createWorldPlayground(scene, dynamicObstacles) {
  // 1. Lighting Setup (Soft Studio Sunlight)
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
  scene.add(ambientLight);

  const sunLight = new THREE.DirectionalLight(0xfff5eb, 2.8);
  sunLight.position.set(30, 45, 25);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 2048;
  sunLight.shadow.mapSize.height = 2048;
  sunLight.shadow.camera.near = 5;
  sunLight.shadow.camera.far = 130;
  const d = 50;
  sunLight.shadow.camera.left = -d;
  sunLight.shadow.camera.right = d;
  sunLight.shadow.camera.top = d;
  sunLight.shadow.camera.bottom = -d;
  sunLight.shadow.bias = -0.0004;
  scene.add(sunLight);

  const hemiLight = new THREE.HemisphereLight(0xdbeafe, 0x1e1b4b, 0.8);
  scene.add(hemiLight);

  // 2. Playground Floor (Warm Slate Tabletop)
  const floorGeo = new THREE.PlaneGeometry(90, 90);
  const floorMat = new THREE.MeshStandardMaterial({
    color: 0x13141c, // Sleek dark slate floor
    roughness: 0.65,
    metalness: 0.1,
  });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  // Floor Grid & Track Markings
  const gridHelper = new THREE.GridHelper(90, 45, 0x3b82f6, 0x1e293b);
  gridHelper.position.y = 0.01;
  scene.add(gridHelper);

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
  createVisualRamp(20, 10, -Math.PI / 4);
  createVisualRamp(-20, 15, Math.PI / 4);

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

