import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { createVehiclePhysics } from '../components/personal/vehicle/VehiclePhysics';
import { createVehicleRenderer } from '../components/personal/vehicle/VehicleRenderer';
import { createWorldPlayground, PLAYGROUND_ZONES } from '../components/personal/world/WorldPlayground';
import { createWorldProps } from '../components/personal/world/WorldProps';
import { createSkidMarks } from '../components/personal/vehicle/SkidMarks';
import sound from '../components/personal/audio/SoundEngine';
import DrivingHUD from '../components/personal/vehicle/DrivingHUD';

export function PersonalUniverse() {
  const mountRef = useRef(null);
  const [speed, setSpeed] = useState(0);
  const [activeZone, setActiveZone] = useState(null);
  const [cameraMode, setCameraMode] = useState('isometric'); // 'isometric' | 'chase'

  const controlsRef = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    brake: false,
  });

  const resetCarRef = useRef(null);
  const cameraModeRef = useRef('isometric');

  useEffect(() => {
    cameraModeRef.current = cameraMode;
  }, [cameraMode]);

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
    const worldProps = createWorldProps(scene);
    const skidMarks = createSkidMarks(scene);

    resetCarRef.current = physics.resetCar;

    // Collision sound trigger
    physics.chassisBody.addEventListener('collide', (e) => {
      const relVel = e.contact.getImpactVelocityAlongNormal();
      if (Math.abs(relVel) > 2.5) {
        sound.playImpact(Math.min(3, Math.abs(relVel) / 3));
      }
    });

    // 3. Keyboard Listeners
    const onKeyDown = (e) => {
      const k = e.key.toLowerCase();
      if (['w', 'arrowup'].includes(k)) controlsRef.current.forward = true;
      if (['s', 'arrowdown'].includes(k)) controlsRef.current.backward = true;
      if (['a', 'arrowleft'].includes(k)) controlsRef.current.left = true;
      if (['d', 'arrowright'].includes(k)) controlsRef.current.right = true;
      if (e.key === ' ') controlsRef.current.brake = true;
      if (k === 'r') physics.resetCar();
      if (k === 'h') sound.playHorn();
      if (k === 'c') {
        setCameraMode((m) => (m === 'isometric' ? 'chase' : 'isometric'));
      }
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

    const maxEngineForce = 520;
    const maxBrakeForce = 65;
    const maxSteerAngle = 0.52;

    const isoOffset = new THREE.Vector3(-14, 18, 14);
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
        vehicle.applyEngineForce(maxEngineForce * 0.7, 2);
        vehicle.applyEngineForce(maxEngineForce * 0.7, 3);
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

      // Speed Calculation
      const speedKmH = vehicle.currentVehicleSpeedKmHour
        ? Math.abs(vehicle.currentVehicleSpeedKmHour)
        : Math.sqrt(
            physics.chassisBody.velocity.x ** 2 +
            physics.chassisBody.velocity.z ** 2
          ) * 3.6;
      setSpeed(speedKmH);

      // Drift Detection
      const isDrifting =
        ctrl.brake ||
        (speedKmH > 18 && Math.abs(physics.chassisBody.angularVelocity.y) > 0.95);

      // Update Audio Synthesizer
      sound.updateEngine(speedKmH, ctrl.forward || ctrl.backward);
      sound.updateSkid(isDrifting);

      // Sync Visuals
      vehicleVisuals.update(vehicle, dt);
      playground.update();
      worldProps.update(dt);
      skidMarks.update(vehicle, isDrifting);

      // Camera Tracking
      const carPos = physics.chassisBody.position;
      const isChase = cameraModeRef.current === 'chase';

      if (isChase) {
        // Dynamic Behind-Car Chase Cam
        const forwardVector = new THREE.Vector3(0, 0, -1).applyQuaternion(
          vehicleVisuals.chassisMesh.quaternion
        );
        targetPos
          .copy(carPos)
          .sub(forwardVector.clone().multiplyScalar(9.5))
          .add(new THREE.Vector3(0, 4.5, 0));
        camera.position.lerp(targetPos, 0.08);

        currentCamLook.lerp(
          new THREE.Vector3(carPos.x, carPos.y + 1.2, carPos.z).add(
            forwardVector.multiplyScalar(4)
          ),
          0.1
        );
      } else {
        // Classic Bruno Simon Top-Down Isometric Chase Cam
        targetPos.set(carPos.x + isoOffset.x, carPos.y + isoOffset.y, carPos.z + isoOffset.z);
        camera.position.lerp(targetPos, 0.08);
        currentCamLook.lerp(new THREE.Vector3(carPos.x, carPos.y + 0.5, carPos.z), 0.1);
      }
      camera.lookAt(currentCamLook);

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
      sound.setMuted(true);
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
    sound.playHorn();
  }, []);

  const handleToggleCamera = useCallback(() => {
    setCameraMode((m) => (m === 'isometric' ? 'chase' : 'isometric'));
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0c0d14] select-none">
      {/* Three.js 3D Driving Viewport */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Gaming HUD Overlay */}
      <DrivingHUD
        speed={speed}
        activeZone={activeZone}
        cameraMode={cameraMode}
        onToggleCamera={handleToggleCamera}
        onResetCar={handleResetCar}
        onHonk={handleHonk}
        onKeyTouch={handleKeyTouch}
      />
    </div>
  );
}

export default PersonalUniverse;
