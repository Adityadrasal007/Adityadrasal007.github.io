import * as CANNON from 'cannon-es';

/**
 * High-Performance Toy Car Physics Engine (Cannon-es)
 *
 * Configured for the Personal Universe:
 * - ANANTAM Live Concert Stage & Crowd Arena
 * - TEDx Amphitheater & Red Dot Stage Platform
 * - Mountain Climbing Rocky Peak & Offroad Ramps with Tumble Boulders
 * - RaycastVehicle with realistic spring suspension & tire friction
 */

export function createVehiclePhysics() {
  const world = new CANNON.World();
  world.gravity.set(0, -9.82 * 2.0, 0); // Punchy, responsive toy-car gravity
  world.broadphase = new CANNON.SAPBroadphase(world);
  world.allowSleep = false; // Never let the car fall asleep when waiting for input

  // Materials & Friction
  const groundMaterial = new CANNON.Material('ground');
  const wheelMaterial = new CANNON.Material('wheel');
  const obstacleMaterial = new CANNON.Material('obstacle');

  const wheelGroundContact = new CANNON.ContactMaterial(wheelMaterial, groundMaterial, {
    friction: 0.8,
    restitution: 0.1,
    contactEquationStiffness: 1000,
  });
  world.addContactMaterial(wheelGroundContact);

  const obstacleContact = new CANNON.ContactMaterial(groundMaterial, obstacleMaterial, {
    friction: 0.45,
    restitution: 0.2,
  });
  world.addContactMaterial(obstacleContact);

  // 1. Static Floor Box (100x100m solid ground, top surface at y=0)
  // Replaces infinite Plane to guarantee 100% raycast collision across all Z coordinates
  const floorShape = new CANNON.Box(new CANNON.Vec3(50, 0.5, 50));
  const groundBody = new CANNON.Body({
    type: CANNON.Body.STATIC,
    shape: floorShape,
    material: groundMaterial,
    position: new CANNON.Vec3(0, -0.5, 0),
  });
  world.addBody(groundBody);

  // Playground boundary walls (90x90m arena)
  const arenaHalf = 45;
  const wallShapeX = new CANNON.Box(new CANNON.Vec3(arenaHalf, 4, 1));
  const wallShapeZ = new CANNON.Box(new CANNON.Vec3(1, 4, arenaHalf));

  const northWall = new CANNON.Body({ type: CANNON.Body.STATIC, position: new CANNON.Vec3(0, 4, -arenaHalf) });
  northWall.addShape(wallShapeX);
  world.addBody(northWall);

  const southWall = new CANNON.Body({ type: CANNON.Body.STATIC, position: new CANNON.Vec3(0, 4, arenaHalf) });
  southWall.addShape(wallShapeX);
  world.addBody(southWall);

  const eastWall = new CANNON.Body({ type: CANNON.Body.STATIC, position: new CANNON.Vec3(arenaHalf, 4, 0) });
  eastWall.addShape(wallShapeZ);
  world.addBody(eastWall);

  const westWall = new CANNON.Body({ type: CANNON.Body.STATIC, position: new CANNON.Vec3(-arenaHalf, 4, 0) });
  westWall.addShape(wallShapeZ);
  world.addBody(westWall);

  // 2. Toy RC Buggy Chassis
  // Chassis collision shape is tucked safely inside wheels so it never drags on the floor
  const chassisShape = new CANNON.Box(new CANNON.Vec3(0.85, 0.22, 1.4));
  const chassisBody = new CANNON.Body({
    mass: 120,
    material: groundMaterial,
    angularDamping: 0.35,
    linearDamping: 0.08,
    allowSleep: false,
  });
  chassisBody.addShape(chassisShape, new CANNON.Vec3(0, 0.25, 0));
  chassisBody.position.set(0, 0.9, 0);
  world.addBody(chassisBody);

  // 3. RaycastVehicle Setup
  const vehicle = new CANNON.RaycastVehicle({
    chassisBody,
    indexRightAxis: 0,
    indexUpAxis: 1,
    indexForwardAxis: 2,
  });

  const wheelOptions = {
    radius: 0.42,
    directionLocal: new CANNON.Vec3(0, -1, 0),
    suspensionStiffness: 35,
    suspensionRestLength: 0.4,
    frictionSlip: 4.2,
    dampingCompression: 3.5,
    dampingRelaxation: 2.2,
    maxSuspensionForce: 100000,
    rollInfluence: 0.03,
    axleLocal: new CANNON.Vec3(-1, 0, 0),
    chassisConnectionPointLocal: new CANNON.Vec3(),
    maxSuspensionTravel: 0.3,
    customSlidingRotationalSpeed: -30,
    useCustomSlidingRotationalSpeed: true,
  };

  const wheelX = 0.95;
  const wheelZFront = 1.25;
  const wheelZRear = -1.25;
  const wheelY = 0.05;

  // Front Left (0)
  wheelOptions.chassisConnectionPointLocal.set(wheelX, wheelY, wheelZFront);
  vehicle.addWheel(wheelOptions);

  // Front Right (1)
  wheelOptions.chassisConnectionPointLocal.set(-wheelX, wheelY, wheelZFront);
  vehicle.addWheel(wheelOptions);

  // Rear Left (2)
  wheelOptions.chassisConnectionPointLocal.set(wheelX, wheelY, wheelZRear);
  vehicle.addWheel(wheelOptions);

  // Rear Right (3)
  wheelOptions.chassisConnectionPointLocal.set(-wheelX, wheelY, wheelZRear);
  vehicle.addWheel(wheelOptions);

  vehicle.addToWorld(world);

  const wheelBodies = [];

  // 4. Destructible Physics Props & Obstacles
  const dynamicObstacles = [];

  function addPhysicsBox(x, y, z, w, h, d, mass = 12, label = 'box') {
    const half = new CANNON.Vec3(w / 2, h / 2, d / 2);
    const body = new CANNON.Body({
      mass,
      shape: new CANNON.Box(half),
      material: obstacleMaterial,
      linearDamping: 0.2,
      angularDamping: 0.3,
    });
    body.position.set(x, y, z);
    body.label = label;
    world.addBody(body);
    dynamicObstacles.push({ body, size: [w, h, d], label });
    return body;
  }

  // A-D-I-T-Y-A Giant Letter Towers at Spawn
  const letters = ['A', 'D', 'I', 'T', 'Y', 'A'];
  letters.forEach((letter, i) => {
    const bx = -10 + i * 4.0;
    const bz = -8;
    addPhysicsBox(bx, 0.75, bz, 1.5, 1.5, 1.5, 10, `letter_${letter}`);
    addPhysicsBox(bx, 2.3, bz, 1.4, 1.4, 1.4, 8, `letter_top_${letter}`);
  });

  // Mountain Climbing Tumble Boulders (Pushable rocks on the offroad trail!)
  const mountainBoulders = [
    { x: 21, y: 1.0, z: 16, r: 0.9, m: 25 },
    { x: 23, y: 1.4, z: 19, r: 0.75, m: 18 },
    { x: 26, y: 2.1, z: 22, r: 0.85, m: 22 },
    { x: 20, y: 0.8, z: 24, r: 0.65, m: 14 },
    { x: 27, y: 2.6, z: 18, r: 1.1, m: 35 },
  ];

  mountainBoulders.forEach((b, i) => {
    const sphereBody = new CANNON.Body({
      mass: b.m,
      shape: new CANNON.Sphere(b.r),
      material: obstacleMaterial,
      linearDamping: 0.3,
      angularDamping: 0.4,
    });
    sphereBody.position.set(b.x, b.y, b.z);
    sphereBody.label = `boulder_${i}`;
    world.addBody(sphereBody);
    dynamicObstacles.push({ body: sphereBody, size: [b.r * 2, b.r * 2, b.r * 2], label: `boulder_${i}` });
  });

  // 5. Section Stage Platforms & Ramps

  // A. ANANTAM Concert Stage Static Platform (-24, 0.75, -20)
  const anantamStage = new CANNON.Body({ type: CANNON.Body.STATIC, material: groundMaterial });
  anantamStage.addShape(new CANNON.Box(new CANNON.Vec3(7.5, 0.75, 4.5)));
  anantamStage.position.set(-24, 0.75, -20);
  world.addBody(anantamStage);

  // ANANTAM Stage Access Ramp (so the car can drive onto the concert stage!)
  function addRamp(x, y, z, w, h, d, rotX = 0, rotY = 0, rotZ = 0) {
    const rampBody = new CANNON.Body({ type: CANNON.Body.STATIC, material: groundMaterial });
    const rampShape = new CANNON.Box(new CANNON.Vec3(w / 2, h / 2, d / 2));
    const q = new CANNON.Quaternion();
    const qx = new CANNON.Quaternion();
    const qy = new CANNON.Quaternion();
    qx.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), rotX);
    qy.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), rotY);
    qy.mult(qx, q);
    rampBody.addShape(rampShape, new CANNON.Vec3(), q);
    rampBody.position.set(x, y, z);
    world.addBody(rampBody);
  }

  // Ramp onto Anantam stage
  addRamp(-24, 0.4, -14.5, 4.0, 0.3, 5.0, 0.16, 0);

  // B. TEDx Amphitheater Stage Platform (24, 0.5, -20)
  const tedxStage = new CANNON.Body({ type: CANNON.Body.STATIC, material: groundMaterial });
  tedxStage.addShape(new CANNON.Box(new CANNON.Vec3(6.5, 0.5, 4.0)));
  tedxStage.position.set(24, 0.5, -20);
  world.addBody(tedxStage);

  // C. Mountain Climbing Offroad Terrain Ascent (24, y, 20)
  // Stepped rocky terrain ramps leading to summit
  addRamp(24, 0.6, 14, 5.5, 0.4, 6.0, -0.22, 0); // Climb segment 1
  addRamp(24, 1.6, 18, 5.0, 0.4, 6.0, -0.25, 0); // Climb segment 2
  addRamp(24, 2.5, 23, 6.0, 0.5, 6.0, 0, 0);     // Summit Flat Peak

  // Reset Car function
  function resetCar() {
    chassisBody.position.set(0, 0.9, 0);
    chassisBody.quaternion.set(0, 0, 0, 1);
    chassisBody.velocity.set(0, 0, 0);
    chassisBody.angularVelocity.set(0, 0, 0);
    chassisBody.wakeUp();
  }

  return {
    world,
    vehicle,
    chassisBody,
    wheelBodies,
    dynamicObstacles,
    resetCar,
  };
}
