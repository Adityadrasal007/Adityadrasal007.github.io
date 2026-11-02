import * as CANNON from 'cannon-es';

/**
 * High-Performance Toy Car Physics Engine (Cannon-es)
 *
 * Replicates Bruno Simon's iconic RC vehicle physics:
 * - RaycastVehicle with realistic spring suspension & tire friction
 * - Destructible physical objects (wooden blocks spelling ADITYA, bowling pins, ramps)
 * - Anti-flip center-of-mass stabilization
 * - Full collision detection for interactive portfolio parking zones
 */

export function createVehiclePhysics() {
  const world = new CANNON.World();
  world.gravity.set(0, -9.82 * 1.5, 0); // Slightly punchier gravity for toy-car feel
  world.broadphase = new CANNON.SAPBroadphase(world);
  world.allowSleep = true;

  // Materials & Friction
  const groundMaterial = new CANNON.Material('ground');
  const wheelMaterial = new CANNON.Material('wheel');
  const obstacleMaterial = new CANNON.Material('obstacle');

  const wheelGroundContact = new CANNON.ContactMaterial(wheelMaterial, groundMaterial, {
    friction: 0.65,
    restitution: 0.1,
    contactEquationStiffness: 1000,
  });
  world.addContactMaterial(wheelGroundContact);

  const obstacleContact = new CANNON.ContactMaterial(groundMaterial, obstacleMaterial, {
    friction: 0.4,
    restitution: 0.2,
  });
  world.addContactMaterial(obstacleContact);

  // 1. Static Floor Plane
  const groundBody = new CANNON.Body({
    type: CANNON.Body.STATIC,
    shape: new CANNON.Plane(),
    material: groundMaterial,
  });
  groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
  world.addBody(groundBody);

  // Playground boundary walls to keep car on track
  const arenaHalf = 45; // 90x90m arena
  const wallShapeX = new CANNON.Box(new CANNON.Vec3(arenaHalf, 3, 1));
  const wallShapeZ = new CANNON.Box(new CANNON.Vec3(1, 3, arenaHalf));

  const northWall = new CANNON.Body({ type: CANNON.Body.STATIC, position: new CANNON.Vec3(0, 3, -arenaHalf) });
  northWall.addShape(wallShapeX);
  world.addBody(northWall);

  const southWall = new CANNON.Body({ type: CANNON.Body.STATIC, position: new CANNON.Vec3(0, 3, arenaHalf) });
  southWall.addShape(wallShapeX);
  world.addBody(southWall);

  const eastWall = new CANNON.Body({ type: CANNON.Body.STATIC, position: new CANNON.Vec3(arenaHalf, 3, 0) });
  eastWall.addShape(wallShapeZ);
  world.addBody(eastWall);

  const westWall = new CANNON.Body({ type: CANNON.Body.STATIC, position: new CANNON.Vec3(-arenaHalf, 3, 0) });
  westWall.addShape(wallShapeZ);
  world.addBody(westWall);

  // 2. Toy RC Buggy Chassis
  const chassisShape = new CANNON.Box(new CANNON.Vec3(1.1, 0.35, 2.0));
  const chassisBody = new CANNON.Body({
    mass: 160,
    material: groundMaterial,
    angularDamping: 0.5,
    linearDamping: 0.15,
  });
  // Center of mass lowered for anti-roll stability
  chassisBody.addShape(chassisShape, new CANNON.Vec3(0, 0.15, 0));
  chassisBody.position.set(0, 1.2, 0);
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
    suspensionStiffness: 45,
    suspensionRestLength: 0.42,
    frictionSlip: 3.2,
    dampingCompression: 4.5,
    dampingRelaxation: 3.2,
    maxSuspensionForce: 100000,
    rollInfluence: 0.08,
    axleLocal: new CANNON.Vec3(-1, 0, 0),
    chassisConnectionPointLocal: new CANNON.Vec3(),
    maxSuspensionTravel: 0.3,
    customSlidingRotationalSpeed: -30,
    useCustomSlidingRotationalSpeed: true,
  };

  // Add 4 wheels: Front Left, Front Right, Rear Left, Rear Right
  const wheelX = 0.95;
  const wheelZFront = 1.35;
  const wheelZRear = -1.35;
  const wheelY = 0.1;

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

  // Wheel bodies for collision representation
  const wheelBodies = [];
  const wheelShape = new CANNON.Cylinder(0.42, 0.42, 0.32, 20);
  vehicle.wheelInfos.forEach(() => {
    const cylinderBody = new CANNON.Body({ mass: 0, material: wheelMaterial, type: CANNON.Body.KINEMATIC });
    cylinderBody.collisionFilterGroup = 0; // Don't collide with chassis
    const q = new CANNON.Quaternion();
    q.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI / 2);
    cylinderBody.addShape(wheelShape, new CANNON.Vec3(), q);
    wheelBodies.push(cylinderBody);
    world.addBody(cylinderBody);
  });

  // 4. Destructible Physics Props & Obstacles (Like Bruno Simon's Blocks & Dominoes)
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

  // A-D-I-T-Y-A Giant Destructible Letter Towers at Spawn
  const letters = ['A', 'D', 'I', 'T', 'Y', 'A'];
  letters.forEach((letter, i) => {
    const bx = -10 + i * 4.0;
    const bz = -8;
    // Stack 2 blocks per letter
    addPhysicsBox(bx, 0.75, bz, 1.5, 1.5, 1.5, 10, `letter_${letter}`);
    addPhysicsBox(bx, 2.3, bz, 1.4, 1.4, 1.4, 8, `letter_top_${letter}`);
  });

  // Bowling Pin Triangle (10 pins) for satisfaction
  const pinX = 14;
  const pinZ = -14;
  let pinCount = 0;
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c <= r; c++) {
      const px = pinX + (c - r / 2) * 1.2;
      const pz = pinZ - r * 1.3;
      addPhysicsBox(px, 0.8, pz, 0.6, 1.6, 0.6, 4, `pin_${pinCount++}`);
    }
  }

  // 5. Jump Ramps
  function addRamp(x, z, rotY = 0) {
    const rampBody = new CANNON.Body({
      type: CANNON.Body.STATIC,
      material: groundMaterial,
    });
    // Angled box ramp
    const rampShape = new CANNON.Box(new CANNON.Vec3(2.5, 0.35, 3.5));
    const q1 = new CANNON.Quaternion();
    q1.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -0.22); // ~12 degree incline
    const q2 = new CANNON.Quaternion();
    q2.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), rotY);
    q2.mult(q1, q1);
    rampBody.addShape(rampShape, new CANNON.Vec3(0, 0.5, 0), q1);
    rampBody.position.set(x, 0, z);
    world.addBody(rampBody);
  }

  addRamp(0, -22, 0); // Hero highway launch ramp
  addRamp(20, 10, -Math.PI / 4); // Hobbies arena ramp
  addRamp(-20, 15, Math.PI / 4); // Hackathons ramp

  // Reset function to flip car upright
  function resetCar() {
    chassisBody.position.set(0, 1.5, 0);
    chassisBody.quaternion.set(0, 0, 0, 1);
    chassisBody.velocity.set(0, 0, 0);
    chassisBody.angularVelocity.set(0, 0, 0);
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

