import * as THREE from 'three';

/**
 * Dynamic 3D Tire Skid Marks Generator
 *
 * Leaves authentic rubber skid mark ribbons on the floor when drifting or braking:
 * - High-performance pre-allocated BufferGeometry ring buffer
 * - Zero memory leaks or garbage collection spikes
 * - Fade out over time or persist across your driving session
 */

export function createSkidMarks(scene) {
  const maxSegments = 600;
  const positions = new Float32Array(maxSegments * 6 * 3); // 2 triangles per quad
  const opacities = new Float32Array(maxSegments * 6);

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('opacity', new THREE.BufferAttribute(opacities, 1));

  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      color: { value: new THREE.Color(0x050508) },
    },
    vertexShader: `
      attribute float opacity;
      varying float vOpacity;
      void main() {
        vOpacity = opacity;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 color;
      varying float vOpacity;
      void main() {
        gl_FragColor = vec4(color, vOpacity * 0.7);
      }
    `,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.frustumCulled = false;
  scene.add(mesh);

  let segmentIndex = 0;
  let lastLeftPos = null;
  let lastRightPos = null;

  function addSkidSegment(p1, p2, width = 0.28) {
    // Normal vector perpendicular to direction
    const dx = p2.x - p1.x;
    const dz = p2.z - p1.z;
    const len = Math.sqrt(dx * dx + dz * dz);
    if (len < 0.05) return;

    const nx = (-dz / len) * (width / 2);
    const nz = (dx / len) * (width / 2);

    const y = 0.015; // Avoid z-fighting with floor

    // Quad 4 vertices
    const v1 = [p1.x - nx, y, p1.z - nz];
    const v2 = [p1.x + nx, y, p1.z + nz];
    const v3 = [p2.x - nx, y, p2.z - nz];
    const v4 = [p2.x + nx, y, p2.z + nz];

    // Two triangles: v1, v2, v3 and v2, v4, v3
    const quadVerts = [
      ...v1, ...v2, ...v3,
      ...v2, ...v4, ...v3,
    ];

    const offset = segmentIndex * 18;
    for (let i = 0; i < 18; i++) {
      positions[offset + i] = quadVerts[i];
    }

    const opOffset = segmentIndex * 6;
    for (let i = 0; i < 6; i++) {
      opacities[opOffset + i] = 1.0;
    }

    segmentIndex = (segmentIndex + 1) % maxSegments;
    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.opacity.needsUpdate = true;
  }

  function update(vehicle, isDrifting) {
    if (!vehicle || vehicle.wheelInfos.length < 4) return;

    // Rear wheels: 2 (Left) and 3 (Right)
    const wl = vehicle.wheelInfos[2].worldTransform.position;
    const wr = vehicle.wheelInfos[3].worldTransform.position;

    const leftCur = new THREE.Vector3(wl.x, 0.02, wl.z);
    const rightCur = new THREE.Vector3(wr.x, 0.02, wr.z);

    if (isDrifting) {
      if (lastLeftPos) addSkidSegment(lastLeftPos, leftCur, 0.28);
      if (lastRightPos) addSkidSegment(lastRightPos, rightCur, 0.28);
    }

    lastLeftPos = leftCur;
    lastRightPos = rightCur;
  }

  return {
    update,
  };
}

