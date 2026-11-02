import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { createVehiclePhysics } from '../components/personal/vehicle/VehiclePhysics';
import { createVehicleRenderer } from '../components/personal/vehicle/VehicleRenderer';
import { createWorldPlayground, PLAYGROUND_ZONES } from '../components/personal/world/WorldPlayground';
import { createWorldProps } from '../components/personal/world/WorldProps';
import { createEnvironmentLighting } from '../components/personal/world/EnvironmentLighting';
import { createSkidMarks } from '../components/personal/vehicle/SkidMarks';
import sound from '../components/personal/audio/SoundEngine';
import DrivingHUD from '../components/personal/vehicle/DrivingHUD';

export function PersonalUniverse() {
  const mountRef = useRef(null);
  const [speed, setSpeed] = useState(0);
  const [activeZone, setActiveZone] = useState(null);
  const [cameraMode, setCameraMode] = useState('isometric'); // 'isometric' | 'chase'
  const [climate, setClimate] = useState('sunset'); // 'sunset' | 'night' | 'dawn' | 'noon'

  const controlsRef = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    brake: false,
  });

  const resetCarRef = useRef(null);
  const climateEngineRef = useRef(null);
  const cameraModeRef = useRef('isometric');
  const flippedTimerRef = useRef(0);

  useEffect(() => {
    cameraModeRef.current = cameraMode;
  }, [cameraMode]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Three.js Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x22121e);
    scene.fog = new THREE.FogExp2(0x22121e, 0.012);

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
    const environmentLighting = createEnvironmentLighting(scene);
    const skidMarks = createSkidMarks(scene);

    resetCarRef.current = physics.resetCar;
    climateEngineRef.current = environmentLighting;

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
      if (['w', 'arrowup'].includes(k)) {
        e.preventDefault();
        controlsRef.current.forward = true;
      }
      if (['s', 'arrowdown'].includes(k)) {
        e.preventDefault();
        controlsRef.current.backward = true;
      }
      if (['a', 'arrowleft'].includes(k)) {
        e.preventDefault();
        controlsRef.current.left = true;
      }
      if (['d', 'arrowright'].includes(k)) {
        e.preventDefault();
        controlsRef.current.right = true;
      }
      if (e.key === ' ') {
        e.preventDefault();
        controlsRef.current.brake = true;
      }
      if (k === 'r') {
        physics.resetCar();
        flippedTimerRef.current = 0;
      }
      if (k === 'h') sound.playHorn();
      if (k === 'c') {
        setCameraMode((m) => (m === 'isometric' ? 'chase' : 'isometric'));
      }
      if (k === 'n') {
        const next = environmentLighting.cycleClimate();
        setClimate(next);
      }
    };

    const onKeyUp = (e) => {
      const k = e.key.toLowerCase();
      if (['w', 'arrowup'].includes(k)) {
        e.preventDefault();
        controlsRef.current.forward = false;
      }
      if (['s', 'arrowdown'].includes(k)) {
        e.preventDefault();
        controlsRef.current.backward = false;
      }
      if (['a', 'arrowleft'].includes(k)) {
        e.preventDefault();
        controlsRef.current.left = false;
      }
      if (['d', 'arrowright'].includes(k)) {
        e.preventDefault();
        controlsRef.current.right = false;
      }
      if (e.key === ' ') {
        e.preventDefault();
        controlsRef.current.brake = false;
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.focus();

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

    const maxEngineForce = 1200;
    const maxBrakeForce = 60;
    const maxSteerAngle = 0.45;

    const isoOffset = new THREE.Vector3(-14, 18, 14);
    const targetPos = new THREE.Vector3();
    const currentCamLook = new THREE.Vector3();

    const loop = (now) => {
      const dt = Math.min(0.06, (now - lastTime) / 1000);
      lastTime = now;

      // Physics Engine Inputs
      const ctrl = controlsRef.current;
      const vehicle = physics.vehicle;

      // Ensure chassis body never falls asleep when control inputs are active
      if (ctrl.forward || ctrl.backward || ctrl.left || ctrl.right || ctrl.brake) {
        physics.chassisBody.wakeUp();
      }

      // AWD Engine Drive Force on all 4 wheels for instantaneous, punchy RC acceleration
      if (ctrl.forward) {
        for (let i = 0; i < 4; i++) vehicle.applyEngineForce(-maxEngineForce, i);
      } else if (ctrl.backward) {
        for (let i = 0; i < 4; i++) vehicle.applyEngineForce(maxEngineForce * 0.75, i);
      } else {
        for (let i = 0; i < 4; i++) vehicle.applyEngineForce(0, i);
      }

      // Steering (Front Wheels: 0 and 1)
      if (ctrl.left) {
        vehicle.setSteeringValue(-maxSteerAngle, 0);
        vehicle.setSteeringValue(-maxSteerAngle, 1);
      } else if (ctrl.right) {
        vehicle.setSteeringValue(maxSteerAngle, 0);
        vehicle.setSteeringValue(maxSteerAngle, 1);
      } else {
        vehicle.setSteeringValue(0, 0);
        vehicle.setSteeringValue(0, 1);
      }

      // Handbrake (All 4 wheels)
      if (ctrl.brake) {
        for (let i = 0; i < 4; i++) vehicle.setBrake(maxBrakeForce, i);
      } else {
        for (let i = 0; i < 4; i++) vehicle.setBrake(0, i);
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
      const isBraking = ctrl.brake || ctrl.backward;
      vehicleVisuals.update(vehicle, dt, isBraking);
      playground.update();
      worldProps.update(dt);
      environmentLighting.update(dt, renderer);
      skidMarks.update(vehicle, isDrifting);

      // Automatic Rollover Recovery (If upside down or severely overturned for > 1.2s)
      const upVector = new THREE.Vector3(0, 1, 0).applyQuaternion(
        vehicleVisuals.chassisMesh.quaternion
      );
      if (upVector.y < 0.25) {
        flippedTimerRef.current += dt;
        if (flippedTimerRef.current > 1.2) {
          flippedTimerRef.current = 0;
          physics.chassisBody.position.y += 1.6;
          physics.chassisBody.quaternion.set(0, 0, 0, 1);
          physics.chassisBody.velocity.set(0, 2.5, 0);
          physics.chassisBody.angularVelocity.set(0, 0, 0);
          physics.chassisBody.wakeUp();
          sound.playImpact(1.0);
        }
      } else {
        flippedTimerRef.current = 0;
      }

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

  const handleCycleClimate = useCallback(() => {
    if (climateEngineRef.current) {
      const next = climateEngineRef.current.cycleClimate();
      setClimate(next);
    }
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
        climate={climate}
        onCycleClimate={handleCycleClimate}
        onToggleCamera={handleToggleCamera}
        onResetCar={handleResetCar}
        onHonk={handleHonk}
        onKeyTouch={handleKeyTouch}
      />
    </div>
  );
}

export default PersonalUniverse;
