import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { createVehiclePhysics } from '../components/personal/vehicle/VehiclePhysics';
import { createVehicleRenderer } from '../components/personal/vehicle/VehicleRenderer';
import { createWorldPlayground, PLAYGROUND_ZONES } from '../components/personal/world/WorldPlayground';
import DrivingHUD from '../components/personal/vehicle/DrivingHUD';

export function PersonalUniverse() {
  const mountRef = useRef(null);
  const [speed, setSpeed] = useState(0);
  const [activeZone, setActiveZone] = useState(null);

  // References for controls & cleanup
  const controlsRef = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    brake: false,
  });

  const resetCarRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Three.js Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c0d14);
    scene.fog = new THREE.FogExp2(0x0c0d14, 0.012);

    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.5,
      300
    );
    camera.position.set(-18, 22, 18);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // 2. Physics & Visual Layers
    const physics = createVehiclePhysics();
    const vehicleVisuals = createVehicleRenderer(scene);
    const playground = createWorldPlayground(scene, physics.dynamicObstacles);

    resetCarRef.current = physics.resetCar;

    // 3. Keyboard Listeners
    const onKeyDown = (e) => {
      const k = e.key.toLowerCase();
      if (['w', 'arrowup'].includes(k)) controlsRef.current.forward = true;
      if (['s', 'arrowdown'].includes(k)) controlsRef.current.backward = true;
      if (['a', 'arrowleft'].includes(k)) controlsRef.current.left = true;
      if (['d', 'arrowright'].includes(k)) controlsRef.current.right = true;
      if (e.key === ' ') controlsRef.current.brake = true;
      if (k === 'r') physics.resetCar();
    };

    const onKeyUp = (e) => {
      const k = e.key.toLowerCase();
      if (['w', 'arrowup'].includes(k)) controlsRef.current.forward = false;
      if (['s', 'arrowdown'].includes(k)) controlsRef.current.backward = false;
      if (['a', 'arrowleft'].includes(k)) controlsRef.current.left = false;
      if (['d', 'arrowright'].includes(k)) controlsRef.current.right = false;
      if (e.key === ' ') controlsRef.current.brake = false;
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    // 4. Resize Handler
    const onResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', onResize);

    // 5. 120 FPS Decoupled Game Loop
    let lastTime = performance.now();
    let animId = null;

    const maxEngineForce = 480;
    const maxBrakeForce = 60;
    const maxSteerAngle = 0.52;

    const cameraOffset = new THREE.Vector3(-14, 18, 14);
    const targetPos = new THREE.Vector3();
    const currentCamLook = new THREE.Vector3();

    const loop = (now) => {
      const dt = Math.min(0.06, (now - lastTime) / 1000);
      lastTime = now;

      // Physics Engine Inputs
      const ctrl = controlsRef.current;
      const vehicle = physics.vehicle;

      // Engine Drive Force (Rear Wheels: 2 and 3)
      if (ctrl.forward) {
        vehicle.applyEngineForce(-maxEngineForce, 2);
        vehicle.applyEngineForce(-maxEngineForce, 3);
      } else if (ctrl.backward) {
        vehicle.applyEngineForce(maxEngineForce * 0.65, 2);
        vehicle.applyEngineForce(maxEngineForce * 0.65, 3);
      } else {
        vehicle.applyEngineForce(0, 2);
        vehicle.applyEngineForce(0, 3);
      }

      // Steering (Front Wheels: 0 and 1)
      if (ctrl.left) {
        vehicle.setSteeringValue(maxSteerAngle, 0);
        vehicle.setSteeringValue(maxSteerAngle, 1);
      } else if (ctrl.right) {
        vehicle.setSteeringValue(-maxSteerAngle, 0);
        vehicle.setSteeringValue(-maxSteerAngle, 1);
      } else {
        vehicle.setSteeringValue(0, 0);
        vehicle.setSteeringValue(0, 1);
      }

      // Handbrake
      if (ctrl.brake) {
        vehicle.setBrake(maxBrakeForce, 0);
        vehicle.setBrake(maxBrakeForce, 1);
        vehicle.setBrake(maxBrakeForce, 2);
        vehicle.setBrake(maxBrakeForce, 3);
      } else {
        vehicle.setBrake(0, 0);
        vehicle.setBrake(0, 1);
        vehicle.setBrake(0, 2);
        vehicle.setBrake(0, 3);
      }

      // Step Physics World
      physics.world.step(1 / 60, dt, 3);

      // Sync Visuals
      vehicleVisuals.update(vehicle, dt);
      playground.update();

      // Camera Isometric Tracking
      const carPos = physics.chassisBody.position;
      targetPos.set(carPos.x + cameraOffset.x, carPos.y + cameraOffset.y, carPos.z + cameraOffset.z);
      camera.position.lerp(targetPos, 0.08);

      currentCamLook.lerp(new THREE.Vector3(carPos.x, carPos.y + 0.5, carPos.z), 0.1);
      camera.lookAt(currentCamLook);

      // Speed Calculation
      const speedKmH = vehicle.currentVehicleSpeedKmHour
        ? Math.abs(vehicle.currentVehicleSpeedKmHour)
        : Math.sqrt(
            physics.chassisBody.velocity.x ** 2 +
            physics.chassisBody.velocity.z ** 2
          ) * 3.6;
      setSpeed(speedKmH);

      // Check Active Zone Proximity
      let foundZone = null;
      for (const zone of PLAYGROUND_ZONES) {
        const [zx, zz] = zone.center;
        const dist = Math.sqrt((carPos.x - zx) ** 2 + (carPos.z - zz) ** 2);
        if (dist <= zone.radius) {
          foundZone = zone;
          break;
        }
      }
      setActiveZone(foundZone);

      // Render Scene
      renderer.render(scene, camera);
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('resize', onResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  const handleKeyTouch = useCallback((key, isPressed) => {
    if (controlsRef.current[key] !== undefined) {
      controlsRef.current[key] = isPressed;
    }
  }, []);

  const handleResetCar = useCallback(() => {
    resetCarRef.current?.();
  }, []);

  const handleHonk = useCallback(() => {
    // Audio horn chirp can be played here
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0c0d14] select-none">
      {/* Three.js 3D Driving Viewport */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Gaming HUD Overlay */}
      <DrivingHUD
        speed={speed}
        activeZone={activeZone}
        onResetCar={handleResetCar}
        onHonk={handleHonk}
        onKeyTouch={handleKeyTouch}
      />
    </div>
  );
}

export default PersonalUniverse;
