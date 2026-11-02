import * as THREE from 'three';

/**
 * 3D Toy RC Vehicle Mesh & Visual Effects (Three.js)
 *
 * Modeled in Bruno Simon's iconic vibrant aesthetic:
 * - Chunky toy pickup/buggy with glossy paint & stylized details
 * - 4 independently spinning & turning wheels
 * - Working dual LED headlights casting light on the floor
 * - Dynamic tire skid marks & drift smoke particles
 */

export function createVehicleRenderer(scene) {
  const carGroup = new THREE.Group();

  // Materials
  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: 0xef4444, // Vibrant Bruno-style Red
    roughness: 0.25,
    metalness: 0.1,
  });

  const secondaryMaterial = new THREE.MeshStandardMaterial({
    color: 0x18181b, // Matte Black Cab & Trim
    roughness: 0.5,
  });

  const glassMaterial = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    roughness: 0.1,
    metalness: 0.8,
    transparent: true,
    opacity: 0.75,
  });

  const chromeMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0.9,
    roughness: 0.1,
  });

  const wheelTireMaterial = new THREE.MeshStandardMaterial({
    color: 0x222225,
    roughness: 0.8,
  });

  const wheelRimMaterial = new THREE.MeshStandardMaterial({
    color: 0xfbbf24, // Gold Rims
    metalness: 0.8,
    roughness: 0.2,
  });

  // 1. Chassis Body
  const chassisMesh = new THREE.Group();

  // Main lower tub
  const lowerBody = new THREE.Mesh(
    new THREE.BoxGeometry(2.1, 0.45, 3.8),
    bodyMaterial
  );
  lowerBody.castShadow = true;
  lowerBody.receiveShadow = true;
  lowerBody.position.y = 0.25;
  chassisMesh.add(lowerBody);

  // Cabin
  const cabin = new THREE.Mesh(
    new THREE.BoxGeometry(1.7, 0.65, 1.8),
    secondaryMaterial
  );
  cabin.castShadow = true;
  cabin.position.set(0, 0.75, -0.2);
  chassisMesh.add(cabin);

  // Windshield
  const windshield = new THREE.Mesh(
    new THREE.BoxGeometry(1.6, 0.45, 0.1),
    glassMaterial
  );
  windshield.position.set(0, 0.75, 0.71);
  windshield.rotation.x = -0.3;
  chassisMesh.add(windshield);

  // Rear roll bar / spoiler
  const spoiler = new THREE.Mesh(
    new THREE.BoxGeometry(1.9, 0.1, 0.4),
    bodyMaterial
  );
  spoiler.position.set(0, 1.05, -1.6);
  spoiler.castShadow = true;
  chassisMesh.add(spoiler);

  const spoilerPost1 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.4), chromeMaterial);
  spoilerPost1.position.set(0.7, 0.85, -1.6);
  chassisMesh.add(spoilerPost1);

  const spoilerPost2 = spoilerPost1.clone();
  spoilerPost2.position.set(-0.7, 0.85, -1.6);
  chassisMesh.add(spoilerPost2);

  // Front Grill & Bumpers
  const frontBumper = new THREE.Mesh(
    new THREE.BoxGeometry(2.2, 0.25, 0.35),
    chromeMaterial
  );
  frontBumper.position.set(0, 0.15, 2.0);
  chassisMesh.add(frontBumper);

  // Dual Headlights
  const headlightGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.1, 16);
  const headlightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

  const hlLeft = new THREE.Mesh(headlightGeo, headlightMat);
  hlLeft.rotation.x = Math.PI / 2;
  hlLeft.position.set(0.7, 0.35, 1.95);
  chassisMesh.add(hlLeft);

  const hlRight = hlLeft.clone();
  hlRight.position.set(-0.7, 0.35, 1.95);
  chassisMesh.add(hlRight);

  // Functional Spotlights casting onto the floor
  const spotLightLeft = new THREE.SpotLight(0xfffaed, 8, 25, Math.PI / 6, 0.35, 1.2);
  spotLightLeft.position.set(0.7, 0.35, 2.0);
  spotLightLeft.target.position.set(0.7, 0, 15);
  chassisMesh.add(spotLightLeft);
  chassisMesh.add(spotLightLeft.target);

  const spotLightRight = new THREE.SpotLight(0xfffaed, 8, 25, Math.PI / 6, 0.35, 1.2);
  spotLightRight.position.set(-0.7, 0.35, 2.0);
  spotLightRight.target.position.set(-0.7, 0, 15);
  chassisMesh.add(spotLightRight);
  chassisMesh.add(spotLightRight.target);

  // RC Antenna with orange flag
  const antenna = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.02, 1.4),
    chromeMaterial
  );
  antenna.position.set(-0.75, 1.4, -1.3);
  chassisMesh.add(antenna);

  const flag = new THREE.Mesh(
    new THREE.BoxGeometry(0.01, 0.25, 0.35),
    new THREE.MeshBasicMaterial({ color: 0xf59e0b })
  );
  flag.position.set(-0.75, 2.0, -1.45);
  chassisMesh.add(flag);

  scene.add(chassisMesh);

  // 2. Chunky 3D Wheels
  const wheelMeshes = [];
  for (let i = 0; i < 4; i++) {
    const wheelGroup = new THREE.Group();

    // Rubber Tire
    const tire = new THREE.Mesh(
      new THREE.CylinderGeometry(0.42, 0.42, 0.34, 24),
      wheelTireMaterial
    );
    tire.rotation.z = Math.PI / 2;
    tire.castShadow = true;
    wheelGroup.add(tire);

    // Gold Rim
    const rim = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.24, 0.35, 16),
      wheelRimMaterial
    );
    rim.rotation.z = Math.PI / 2;
    wheelGroup.add(rim);

    // Center Lug Nut
    const nut = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 0.38, 6),
      chromeMaterial
    );
    nut.rotation.z = Math.PI / 2;
    wheelGroup.add(nut);

    scene.add(wheelGroup);
    wheelMeshes.push(wheelGroup);
  }

  // 3. Dynamic Tire Smoke Particles
  const particles = [];
  const particleGeo = new THREE.SphereGeometry(0.18, 8, 8);
  const particleMat = new THREE.MeshBasicMaterial({
    color: 0xd4d4d8,
    transparent: true,
    opacity: 0.6,
  });

  function emitDriftSmoke(x, y, z) {
    if (particles.length > 45) {
      const old = particles.shift();
      scene.remove(old.mesh);
    }
    const mesh = new THREE.Mesh(particleGeo, particleMat.clone());
    mesh.position.set(x + (Math.random() - 0.5) * 0.2, y + 0.1, z + (Math.random() - 0.5) * 0.2);
    mesh.scale.set(0.5, 0.5, 0.5);
    scene.add(mesh);
    particles.push({ mesh, life: 1.0 });
  }

  function updateParticles(dt) {
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.life -= dt * 1.8;
      p.mesh.position.y += dt * 0.8;
      p.mesh.scale.addScalar(dt * 1.5);
      p.mesh.material.opacity = Math.max(0, p.life * 0.5);

      if (p.life <= 0) {
        scene.remove(p.mesh);
        particles.splice(i, 1);
      }
    }
  }

  // 4. Update Function: syncs Three.js meshes with Cannon physics
  function update(vehicle, dt) {
    // Sync Chassis
    chassisMesh.position.copy(vehicle.chassisBody.position);
    chassisMesh.quaternion.copy(vehicle.chassisBody.quaternion);

    // Sync Wheels
    for (let i = 0; i < vehicle.wheelInfos.length; i++) {
      vehicle.updateWheelTransform(i);
      const t = vehicle.wheelInfos[i].worldTransform;
      wheelMeshes[i].position.copy(t.position);
      wheelMeshes[i].quaternion.copy(t.quaternion);

      // Check for wheel slide / drift smoke
      const isSkidding = vehicle.wheelInfos[i].skidInfo > 0.4 || (i >= 2 && Math.abs(vehicle.chassisBody.angularVelocity.y) > 1.2);
      if (isSkidding && Math.random() < 0.4) {
        emitDriftSmoke(t.position.x, t.position.y, t.position.z);
      }
    }

    updateParticles(dt);
  }

  return {
    chassisMesh,
    wheelMeshes,
    update,
  };
}
