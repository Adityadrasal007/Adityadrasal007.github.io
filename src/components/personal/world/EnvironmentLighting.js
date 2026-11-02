import * as THREE from 'three';

/**
 * Dynamic Atmospheric Environment & Day/Night Climate Controller (Three.js)
 *
 * Implements Bruno Simon's signature visual palette:
 * - 4 distinct atmospheric moods: Sunset (Warm Peach/Autumn), Night (Deep Starlit Indigo), Dawn (Lavender Mist), Noon (Crisp Studio Daylight)
 * - Smooth lerped transitions of sun light, shadows, ambient light, fog, and background
 * - 600+ twinkling celestial stars (shining at night)
 * - Floating magical crystal motes drifting across the meadows
 */

export const CLIMATE_PRESETS = {
  sunset: {
    id: 'sunset',
    name: 'Sunset Glow',
    icon: '🌅',
    fogColor: 0x22121e,
    fogDensity: 0.012,
    sunColor: 0xffb366,
    sunIntensity: 2.8,
    sunPos: [35, 28, 22],
    ambientColor: 0xffd1b3,
    ambientIntensity: 1.2,
    hemiSky: 0xfecdd3,
    hemiGround: 0x4c0519,
    starsOpacity: 0.1,
    exposure: 1.15,
    lanternIntensity: 2.2,
  },
  night: {
    id: 'night',
    name: 'Midnight Starlight',
    icon: '🌙',
    fogColor: 0x060814,
    fogDensity: 0.014,
    sunColor: 0x60a5fa,
    sunIntensity: 0.7,
    sunPos: [-25, 45, -25],
    ambientColor: 0x1e1b4b,
    ambientIntensity: 0.65,
    hemiSky: 0x1e293b,
    hemiGround: 0x020617,
    starsOpacity: 0.95,
    exposure: 1.0,
    lanternIntensity: 4.5,
  },
  dawn: {
    id: 'dawn',
    name: 'Cyber Dawn',
    icon: '🌄',
    fogColor: 0x18152e,
    fogDensity: 0.012,
    sunColor: 0xf472b6,
    sunIntensity: 2.2,
    sunPos: [-35, 25, 30],
    ambientColor: 0xe9d5ff,
    ambientIntensity: 1.1,
    hemiSky: 0xddd6fe,
    hemiGround: 0x2e1065,
    starsOpacity: 0.3,
    exposure: 1.1,
    lanternIntensity: 2.0,
  },
  noon: {
    id: 'noon',
    name: 'Studio Daylight',
    icon: '☀️',
    fogColor: 0x0f172a,
    fogDensity: 0.011,
    sunColor: 0xffffff,
    sunIntensity: 3.2,
    sunPos: [20, 55, 20],
    ambientColor: 0xffffff,
    ambientIntensity: 1.35,
    hemiSky: 0xbae6fd,
    hemiGround: 0x1e293b,
    starsOpacity: 0.0,
    exposure: 1.2,
    lanternIntensity: 0.8,
  },
};

export const CLIMATE_ORDER = ['sunset', 'night', 'dawn', 'noon'];

export function createEnvironmentLighting(scene) {
  let currentPresetId = 'sunset';
  let targetPresetId = 'sunset';
  let transitionAlpha = 1.0;

  // 1. Ambient & Directional Sun Lights
  const ambientLight = new THREE.AmbientLight(0xffd1b3, 1.2);
  scene.add(ambientLight);

  const hemiLight = new THREE.HemisphereLight(0xfecdd3, 0x4c0519, 0.8);
  scene.add(hemiLight);

  const sunLight = new THREE.DirectionalLight(0xffb366, 2.8);
  sunLight.position.set(35, 28, 22);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 2048;
  sunLight.shadow.mapSize.height = 2048;
  sunLight.shadow.camera.near = 5;
  sunLight.shadow.camera.far = 140;
  const d = 52;
  sunLight.shadow.camera.left = -d;
  sunLight.shadow.camera.right = d;
  sunLight.shadow.camera.top = d;
  sunLight.shadow.camera.bottom = -d;
  sunLight.shadow.bias = -0.0004;
  scene.add(sunLight);

  // 2. Starfield Dome (Visible during Night & Twilight)
  const starCount = 650;
  const starGeo = new THREE.BufferGeometry();
  const starPositions = new Float32Array(starCount * 3);
  const starColors = new Float32Array(starCount * 3);

  for (let i = 0; i < starCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 0.85); // Upper dome only
    const radius = 110 + Math.random() * 20;

    starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    starPositions[i * 3 + 1] = radius * Math.cos(phi) + 15;
    starPositions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);

    // Warm white / lavender / cyan star hues
    const starHue = Math.random();
    if (starHue > 0.6) {
      starColors[i * 3] = 0.85;
      starColors[i * 3 + 1] = 0.92;
      starColors[i * 3 + 2] = 1.0;
    } else if (starHue > 0.3) {
      starColors[i * 3] = 1.0;
      starColors[i * 3 + 1] = 0.85;
      starColors[i * 3 + 2] = 0.65;
    } else {
      starColors[i * 3] = 1.0;
      starColors[i * 3 + 1] = 0.75;
      starColors[i * 3 + 2] = 0.95;
    }
  }

  starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

  const starMat = new THREE.PointsMaterial({
    size: 1.4,
    vertexColors: true,
    transparent: true,
    opacity: 0.15,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const starPoints = new THREE.Points(starGeo, starMat);
  scene.add(starPoints);

  // 3. Floating Magical Crystal Motes (Signature Bruno Simon Feature)
  const crystalCount = 35;
  const crystals = [];
  const crystalGeo = new THREE.OctahedronGeometry(0.24, 0);

  const moteColors = [0xf472b6, 0xa855f7, 0xfbbf24, 0x38bdf8];

  for (let i = 0; i < crystalCount; i++) {
    const color = moteColors[i % moteColors.length];
    const mat = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.85,
    });
    const mesh = new THREE.Mesh(crystalGeo, mat);

    const x = (Math.random() - 0.5) * 75;
    const z = (Math.random() - 0.5) * 75;
    const baseY = 1.2 + Math.random() * 2.0;

    mesh.position.set(x, baseY, z);
    mesh.rotation.set(Math.random(), Math.random(), Math.random());
    scene.add(mesh);

    crystals.push({
      mesh,
      baseY,
      speed: 1.2 + Math.random() * 1.5,
      rotSpeed: 1.5 + Math.random() * 2.0,
      phase: Math.random() * Math.PI * 2,
    });
  }

  // 4. State Transition Colors
  const currSunColor = new THREE.Color();
  const targetSunColor = new THREE.Color();
  const currAmbientColor = new THREE.Color();
  const targetAmbientColor = new THREE.Color();
  const currHemiSky = new THREE.Color();
  const targetHemiSky = new THREE.Color();
  const currHemiGround = new THREE.Color();
  const targetHemiGround = new THREE.Color();
  const currFogColor = new THREE.Color();
  const targetFogColor = new THREE.Color();

  function setClimate(presetId) {
    if (!CLIMATE_PRESETS[presetId] || presetId === targetPresetId) return;
    currentPresetId = targetPresetId;
    targetPresetId = presetId;
    transitionAlpha = 0.0;
  }

  function cycleClimate() {
    const idx = CLIMATE_ORDER.indexOf(targetPresetId);
    const nextIdx = (idx + 1) % CLIMATE_ORDER.length;
    setClimate(CLIMATE_ORDER[nextIdx]);
    return CLIMATE_ORDER[nextIdx];
  }

  function update(dt, renderer) {
    // Animate transition between presets
    if (transitionAlpha < 1.0) {
      transitionAlpha = Math.min(1.0, transitionAlpha + dt * 1.4); // ~0.7s transition

      const fromP = CLIMATE_PRESETS[currentPresetId];
      const toP = CLIMATE_PRESETS[targetPresetId];

      // Lerp sun light
      currSunColor.setHex(fromP.sunColor);
      targetSunColor.setHex(toP.sunColor);
      sunLight.color.copy(currSunColor).lerp(targetSunColor, transitionAlpha);
      sunLight.intensity = THREE.MathUtils.lerp(fromP.sunIntensity, toP.sunIntensity, transitionAlpha);

      // Lerp sun position
      sunLight.position.x = THREE.MathUtils.lerp(fromP.sunPos[0], toP.sunPos[0], transitionAlpha);
      sunLight.position.y = THREE.MathUtils.lerp(fromP.sunPos[1], toP.sunPos[1], transitionAlpha);
      sunLight.position.z = THREE.MathUtils.lerp(fromP.sunPos[2], toP.sunPos[2], transitionAlpha);

      // Lerp ambient & hemisphere
      currAmbientColor.setHex(fromP.ambientColor);
      targetAmbientColor.setHex(toP.ambientColor);
      ambientLight.color.copy(currAmbientColor).lerp(targetAmbientColor, transitionAlpha);
      ambientLight.intensity = THREE.MathUtils.lerp(fromP.ambientIntensity, toP.ambientIntensity, transitionAlpha);

      currHemiSky.setHex(fromP.hemiSky);
      targetHemiSky.setHex(toP.hemiSky);
      hemiLight.color.copy(currHemiSky).lerp(targetHemiSky, transitionAlpha);

      currHemiGround.setHex(fromP.hemiGround);
      targetHemiGround.setHex(toP.hemiGround);
      hemiLight.groundColor.copy(currHemiGround).lerp(targetHemiGround, transitionAlpha);

      // Lerp fog and background
      currFogColor.setHex(fromP.fogColor);
      targetFogColor.setHex(toP.fogColor);
      const lerpedFog = currFogColor.clone().lerp(targetFogColor, transitionAlpha);
      scene.background.copy(lerpedFog);
      scene.fog.color.copy(lerpedFog);
      scene.fog.density = THREE.MathUtils.lerp(fromP.fogDensity, toP.fogDensity, transitionAlpha);

      // Stars opacity
      starMat.opacity = THREE.MathUtils.lerp(fromP.starsOpacity, toP.starsOpacity, transitionAlpha);

      // Exposure
      if (renderer) {
        renderer.toneMappingExposure = THREE.MathUtils.lerp(fromP.exposure, toP.exposure, transitionAlpha);
      }
    }

    // Animate floating crystal motes
    const time = Date.now() * 0.001;
    crystals.forEach((c) => {
      c.mesh.position.y = c.baseY + Math.sin(time * c.speed + c.phase) * 0.35;
      c.mesh.rotation.y += dt * c.rotSpeed;
      c.mesh.rotation.x += dt * (c.rotSpeed * 0.6);
    });

    // Slow celestial starfield rotation
    starPoints.rotation.y += dt * 0.008;
  }

  // Initialize with default sunset settings
  const def = CLIMATE_PRESETS.sunset;
  scene.background = new THREE.Color(def.fogColor);
  scene.fog = new THREE.FogExp2(def.fogColor, def.fogDensity);

  return {
    ambientLight,
    sunLight,
    hemiLight,
    starPoints,
    setClimate,
    cycleClimate,
    getCurrentPreset: () => CLIMATE_PRESETS[targetPresetId],
    update,
  };
}
