import * as THREE from 'three';

export const RADIUS = 27;
export const DURATION = 12;
export const PALETTE = {
  sky: 0x071419,
  deepWater: new THREE.Color('#063c50'),
  shallowWater: new THREE.Color('#1a9b96'),
  foam: 0xd8f3e8,
  survey: 0xe8b86d,
  mint: 0x74f7cf,
};

export function mulberry32(seed) {
  return function () {
    let a = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const smoothstep = (a, b, v) => {
  const t = clamp((v - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};
const mix = (a, b, t) => a + (b - a) * t;
const hash = (x, z) => {
  const s = Math.sin(x * 127.1 + z * 311.7) * 43758.5453123;
  return s - Math.floor(s);
};
function noise(x, z) {
  const ix = Math.floor(x), iz = Math.floor(z);
  const fx = x - ix, fz = z - iz;
  const ux = fx * fx * (3 - 2 * fx), uz = fz * fz * (3 - 2 * fz);
  return mix(mix(hash(ix, iz), hash(ix + 1, iz), ux), mix(hash(ix, iz + 1), hash(ix + 1, iz + 1), ux), uz);
}
function fbm(x, z) {
  return noise(x, z) * 0.58 + noise(x * 2.03 + 9.2, z * 2.03 - 4.7) * 0.28 + noise(x * 4.09, z * 4.09) * 0.14;
}

export function coastX(z) {
  return 3.8 + 2.8 * Math.sin(z * 0.095) + 0.08 * z;
}

const riverCurve = new THREE.CatmullRomCurve3([
  new THREE.Vector3(-19, 0, -20),
  new THREE.Vector3(-16, 0, -14),
  new THREE.Vector3(-14.5, 0, -7),
  new THREE.Vector3(-11.5, 0, -2),
  new THREE.Vector3(-6, 0, 1.2),
  new THREE.Vector3(-1.5, 0, 3.4),
  new THREE.Vector3(coastX(5) + 0.5, 0, 5),
], false, 'catmullrom', 0.35);
const riverSamples = Array.from({ length: 97 }, (_, i) => {
  const t = i / 96;
  const p = riverCurve.getPoint(t);
  return { x: p.x, z: p.z, t, y: mix(1.55, 0.12, Math.pow(t, 0.72)), width: mix(0.28, 0.86, Math.pow(t, 2.4)) };
});

function nearestRiver(x, z) {
  let best = Infinity, sample = riverSamples[0];
  for (let i = 0; i < riverSamples.length; i++) {
    const s = riverSamples[i];
    const d = (x - s.x) ** 2 + (z - s.z) ** 2;
    if (d < best) { best = d; sample = s; }
  }
  return { distance: Math.sqrt(best), ...sample };
}

export const ANCHOR_Z = -7;
export const ANCHOR_X = coastX(ANCHOR_Z) - 0.85;
export const SURF = new THREE.Vector3(coastX(-7) + 5.1, 0.2, -7);
export const MOUTH = new THREE.Vector3(coastX(5) + 0.35, 0.35, 5);
export const TOWN = new THREE.Vector3(-6.5, 1.2, 4.5);

export function terrainInfo(x, z) {
  const landDistance = coastX(z) - x;
  const inland = Math.max(0, landDistance);
  const offshore = Math.max(0, -landDistance);
  let height;
  if (landDistance >= 0) {
    const foothills = (fbm(x * 0.095, z * 0.095) * 1.65 + fbm(x * 0.23 + 4, z * 0.23) * 0.38) * smoothstep(0, 5, landDistance);
    const westernRange = 4.3 * Math.exp(-((x + 20) ** 2 + (z + 12) ** 2) / 82);
    const southernRange = 3.1 * Math.exp(-((x + 18) ** 2 + (z - 16) ** 2) / 72);
    const headland = 1.35 * Math.exp(-((x - ANCHOR_X) ** 2 + (z - ANCHOR_Z) ** 2) / 8.5);
    height = 0.18 + Math.min(inland, 16) * 0.043 + foothills + westernRange + southernRange + headland;
    const river = nearestRiver(x, z);
    if (river.distance < river.width * 1.65) {
      const bank = Math.max(0, river.distance - river.width) * 0.22;
      height = Math.min(height, river.y - 0.1 + bank);
    }
  } else {
    const reef = 0.32 * Math.exp(-((x - SURF.x) ** 2 / 11 + (z - SURF.z) ** 2 / 45));
    height = -0.22 - offshore * 0.042 + reef + (fbm(x * 0.17, z * 0.17) - 0.5) * 0.12;
  }
  return { height, landDistance, river: nearestRiver(x, z) };
}

function terrainColor(info, x, z) {
  const variation = (hash(x * 3.1, z * 3.1) - 0.5) * 0.09;
  const c = new THREE.Color();
  if (info.landDistance < 0) {
    c.set(info.height > -0.35 ? '#699d8c' : '#285f66');
  } else if (info.height < 0.36 || info.landDistance < 0.75) {
    c.set('#c4b47f');
  } else if (info.river.distance < info.river.width * 1.8) {
    c.set('#81976a');
  } else if (info.height < 1.05) {
    c.set('#6f9461');
  } else if (info.height < 2.6) {
    c.set('#466f50');
  } else {
    c.set('#314f45');
  }
  c.offsetHSL(variation * 0.15, variation * 0.25, variation);
  return c;
}

function createTerrain() {
  const rings = 128, segments = 256;
  const positions = [], colors = [], indices = [];
  for (let ir = 0; ir <= rings; ir++) {
    const radius = RADIUS * ir / rings;
    for (let ia = 0; ia <= segments; ia++) {
      const angle = ia / segments * Math.PI * 2;
      const x = Math.cos(angle) * radius, z = Math.sin(angle) * radius;
      const info = terrainInfo(x, z);
      positions.push(x, info.height, z);
      const color = terrainColor(info, x, z);
      colors.push(color.r, color.g, color.b);
    }
  }
  for (let ir = 0; ir < rings; ir++) {
    for (let ia = 0; ia < segments; ia++) {
      const a = ir * (segments + 1) + ia;
      const b = a + 1, c = a + segments + 1, d = c + 1;
      indices.push(a, d, c, a, b, d);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  const material = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.96, metalness: 0.02, flatShading: true });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.receiveShadow = true;
  mesh.castShadow = true;
  return mesh;
}

function createWater() {
  const uniforms = { uTime: { value: 0 }, uDeep: { value: PALETTE.deepWater }, uShallow: { value: PALETTE.shallowWater } };
  const material = new THREE.ShaderMaterial({
    uniforms,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    vertexShader: `
      uniform float uTime;
      varying vec3 vWorld;
      varying float vRipple;
      void main() {
        vec3 p = position;
        vec4 w = modelMatrix * vec4(p, 1.0);
        float phase = 6.28318530718 * uTime / 12.0;
        float ripple = sin(w.x * 0.72 + w.z * 0.43 + phase * 2.0) * 0.018 + sin(w.z * 1.13 - phase * 3.0) * 0.012;
        w.y += ripple;
        vWorld = w.xyz;
        vRipple = ripple;
        gl_Position = projectionMatrix * viewMatrix * w;
      }
    `,
    fragmentShader: `
      uniform vec3 uDeep;
      uniform vec3 uShallow;
      uniform float uTime;
      varying vec3 vWorld;
      varying float vRipple;
      float coast(float z) { return 3.8 + 2.8 * sin(z * 0.095) + 0.08 * z; }
      void main() {
        float offshore = max(0.0, vWorld.x - coast(vWorld.z));
        float shallow = 1.0 - smoothstep(0.0, 10.0, offshore);
        vec3 color = mix(uDeep, uShallow, shallow * 0.86);
        float phase = 6.28318530718 * uTime / 12.0;
        float shimmer = sin(vWorld.x * 1.7 + vWorld.z * 1.15 + phase * 4.0) * 0.5 + 0.5;
        float contour = pow(0.5 + 0.5 * cos(offshore * 2.25), 22.0) * 0.055;
        color += vec3(0.06, 0.14, 0.13) * shimmer * 0.12 + contour;
        color += vRipple * 0.8;
        gl_FragColor = vec4(color, 0.9);
      }
    `,
  });
  const mesh = new THREE.Mesh(new THREE.CircleGeometry(RADIUS - 0.05, 192).rotateX(-Math.PI / 2), material);
  mesh.position.y = 0.09;
  mesh.renderOrder = 3;
  return { mesh, uniforms };
}

function createRiver() {
  const positions = [], colors = [], indices = [];
  const colorA = new THREE.Color('#2a8d88'), colorB = new THREE.Color('#56b6a4');
  riverSamples.forEach((s, i) => {
    const p = riverCurve.getPoint(s.t);
    const tangent = riverCurve.getTangent(s.t);
    const side = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();
    for (const sign of [-1, 1]) {
      positions.push(p.x + side.x * s.width * sign, s.y + 0.025, p.z + side.z * s.width * sign);
      const c = colorA.clone().lerp(colorB, s.t * 0.7 + (i % 3) * 0.03);
      colors.push(c.r, c.g, c.b);
    }
    if (i < riverSamples.length - 1) {
      const a = i * 2;
      indices.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
    }
  });
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.28, metalness: 0.08, side: THREE.DoubleSide }));
  mesh.renderOrder = 4;
  return mesh;
}

function surfaceLine(points, color, opacity = 1) {
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  return new THREE.Line(geometry, new THREE.LineBasicMaterial({ color, transparent: opacity < 1, opacity, depthWrite: false }));
}

function createSurvey() {
  const group = new THREE.Group();
  for (const radius of [9, 18, 27]) {
    const points = [];
    for (let i = 0; i <= 360; i++) {
      const a = i / 360 * Math.PI * 2;
      const x = Math.cos(a) * radius, z = Math.sin(a) * radius;
      const y = Math.max(0.13, terrainInfo(x, z).height) + 0.09;
      points.push(new THREE.Vector3(x, y, z));
    }
    group.add(surfaceLine(points, radius === 27 ? PALETTE.survey : 0x80aca0, radius === 27 ? 0.95 : 0.3));
  }
  for (let i = 0; i < 36; i++) {
    const a = i / 36 * Math.PI * 2;
    const inner = i % 3 === 0 ? 26.25 : 26.65;
    const points = [inner, 27].map((r) => {
      const x = Math.cos(a) * r, z = Math.sin(a) * r;
      return new THREE.Vector3(x, Math.max(0.14, terrainInfo(x, z).height) + 0.11, z);
    });
    group.add(surfaceLine(points, PALETTE.survey, i % 3 === 0 ? 0.85 : 0.42));
  }
  return group;
}

function ribbonFromCurve(curve, width, material, segments = 72, lift = 0.055) {
  const positions = [], indices = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const p = curve.getPoint(t), tangent = curve.getTangent(t);
    const side = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();
    for (const sign of [-1, 1]) {
      const x = p.x + side.x * width * sign, z = p.z + side.z * width * sign;
      positions.push(x, terrainInfo(x, z).height + lift, z);
    }
    if (i < segments) {
      const a = i * 2;
      indices.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  const mesh = new THREE.Mesh(geometry, material);
  mesh.receiveShadow = true;
  return mesh;
}

function gableGeometry() {
  const p = [
    -0.5, 0, -0.5, 0.5, 0, -0.5, 0, 1, -0.5,
    -0.5, 0, 0.5, 0, 1, 0.5, 0.5, 0, 0.5,
    -0.5, 0, -0.5, 0, 1, -0.5, -0.5, 0, 0.5,
    -0.5, 0, 0.5, 0, 1, -0.5, 0, 1, 0.5,
    0.5, 0, -0.5, 0.5, 0, 0.5, 0, 1, -0.5,
    0.5, 0, 0.5, 0, 1, 0.5, 0, 1, -0.5,
    -0.5, 0, -0.5, -0.5, 0, 0.5, 0.5, 0, -0.5,
    0.5, 0, -0.5, -0.5, 0, 0.5, 0.5, 0, 0.5,
  ];
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(p, 3));
  geometry.computeVertexNormals();
  return geometry;
}

function createTown(rand) {
  const group = new THREE.Group();
  const roadMaterial = new THREE.MeshStandardMaterial({ color: 0x6d7566, roughness: 1, side: THREE.DoubleSide });
  const mainRoad = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-19, 0, 7), new THREE.Vector3(-12, 0, 6), new THREE.Vector3(-7, 0, 5),
    new THREE.Vector3(-2, 0, 4), new THREE.Vector3(coastX(5) - 0.3, 0, 5),
  ]);
  group.add(ribbonFromCurve(mainRoad, 0.22, roadMaterial));
  const anchorRoad = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-8, 0, 4), new THREE.Vector3(-6, 0, -1), new THREE.Vector3(-3, 0, -4),
    new THREE.Vector3(ANCHOR_X - 0.4, 0, ANCHOR_Z),
  ]);
  group.add(ribbonFromCurve(anchorRoad, 0.16, roadMaterial));
  for (let i = 0; i < 5; i++) {
    const x = -10.5 + i * 1.65;
    const street = new THREE.CatmullRomCurve3([new THREE.Vector3(x, 0, 0.5), new THREE.Vector3(x + 0.25, 0, 5), new THREE.Vector3(x + 0.5, 0, 9)]);
    group.add(ribbonFromCurve(street, 0.085, roadMaterial, 28, 0.065));
  }

  const placements = [];
  for (let row = 0; row < 7; row++) {
    for (let col = 0; col < 8; col++) {
      if (rand() < 0.19) continue;
      const x = -11.2 + col * 1.35 + (rand() - 0.5) * 0.28;
      const z = 0.3 + row * 1.35 + (rand() - 0.5) * 0.28;
      const info = terrainInfo(x, z);
      if (info.river.distance < info.river.width + 0.55 || info.landDistance < 1.1) continue;
      placements.push({ x, z, y: info.height, w: 0.46 + rand() * 0.38, d: 0.45 + rand() * 0.45, h: 0.35 + rand() * 0.62, yaw: (rand() - 0.5) * 0.16, tone: rand() });
    }
  }
  const body = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.88 }), placements.length);
  const roofs = new THREE.InstancedMesh(gableGeometry(), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.82 }), placements.length);
  const matrix = new THREE.Matrix4(), quaternion = new THREE.Quaternion(), scale = new THREE.Vector3(), position = new THREE.Vector3();
  const wallA = new THREE.Color('#d9d2b4'), wallB = new THREE.Color('#9eb4a1');
  const roofA = new THREE.Color('#9c4f3d'), roofB = new THREE.Color('#425c58');
  placements.forEach((p, i) => {
    quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), p.yaw);
    position.set(p.x, p.y + p.h / 2, p.z); scale.set(p.w, p.h, p.d);
    matrix.compose(position, quaternion, scale); body.setMatrixAt(i, matrix);
    body.setColorAt(i, wallA.clone().lerp(wallB, p.tone));
    position.set(p.x, p.y + p.h, p.z); scale.set(p.w * 1.12, 0.25 + p.h * 0.18, p.d * 1.1);
    matrix.compose(position, quaternion, scale); roofs.setMatrixAt(i, matrix);
    roofs.setColorAt(i, roofA.clone().lerp(roofB, p.tone > 0.76 ? 0.85 : 0.08));
  });
  body.castShadow = true; body.receiveShadow = true; roofs.castShadow = true; roofs.receiveShadow = true;
  group.add(body, roofs);

  const hall = new THREE.Group();
  const hallInfo = terrainInfo(-6.4, 4.3);
  hall.position.set(-6.4, hallInfo.height, 4.3);
  const stone = new THREE.MeshStandardMaterial({ color: 0xd5cda9, roughness: 0.8 });
  const copper = new THREE.MeshStandardMaterial({ color: 0x46776b, roughness: 0.55, metalness: 0.35 });
  const base = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.65, 0.85), stone); base.position.y = 0.325;
  const tower = new THREE.Mesh(new THREE.BoxGeometry(0.38, 1.35, 0.38), stone); tower.position.set(0, 1.0, 0);
  const cap = new THREE.Mesh(new THREE.ConeGeometry(0.34, 0.55, 4), copper); cap.position.y = 1.95; cap.rotation.y = Math.PI / 4;
  const clock = new THREE.Mesh(new THREE.CircleGeometry(0.12, 20), new THREE.MeshBasicMaterial({ color: 0xe8b86d })); clock.position.set(0, 1.25, 0.196);
  hall.add(base, tower, cap, clock);
  hall.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  group.add(hall);
  return { group, count: placements.length + 1 };
}

function createVegetation(rand) {
  const placements = [];
  for (let attempts = 0; attempts < 1600 && placements.length < 230; attempts++) {
    const a = rand() * Math.PI * 2, r = Math.sqrt(rand()) * 25.5;
    const x = Math.cos(a) * r, z = Math.sin(a) * r;
    const info = terrainInfo(x, z);
    const inTown = x > -13 && x < 1 && z > -1 && z < 11;
    if (info.landDistance < 1.5 || info.height < 0.42 || info.river.distance < 1 || inTown || rand() > 0.42 + info.height * 0.12) continue;
    placements.push({ x, z, y: info.height, s: 0.22 + rand() * 0.33, h: 0.5 + rand() * 0.65, tone: rand() });
  }
  const trunks = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.09, 0.12, 1, 5), new THREE.MeshStandardMaterial({ color: 0x574b37, roughness: 1 }), placements.length);
  const crowns = new THREE.InstancedMesh(new THREE.ConeGeometry(1, 1, 7), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.95 }), placements.length);
  const matrix = new THREE.Matrix4(), q = new THREE.Quaternion(), pos = new THREE.Vector3(), scl = new THREE.Vector3();
  const greenA = new THREE.Color('#234d3c'), greenB = new THREE.Color('#64865a');
  placements.forEach((p, i) => {
    q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), p.tone * Math.PI * 2);
    pos.set(p.x, p.y + p.h * 0.28, p.z); scl.set(p.s, p.h * 0.56, p.s); matrix.compose(pos, q, scl); trunks.setMatrixAt(i, matrix);
    pos.set(p.x, p.y + p.h * 0.72, p.z); scl.set(p.s, p.h, p.s); matrix.compose(pos, q, scl); crowns.setMatrixAt(i, matrix);
    crowns.setColorAt(i, greenA.clone().lerp(greenB, p.tone));
  });
  trunks.castShadow = true; crowns.castShadow = true; crowns.receiveShadow = true;
  const group = new THREE.Group(); group.add(trunks, crowns);
  return { group, count: placements.length };
}

function createHeadland(rand) {
  const group = new THREE.Group();
  const count = 74;
  const rocks = new THREE.InstancedMesh(new THREE.DodecahedronGeometry(1, 0), new THREE.MeshStandardMaterial({ color: 0x62746b, roughness: 0.95 }), count);
  const matrix = new THREE.Matrix4(), q = new THREE.Quaternion(), pos = new THREE.Vector3(), scl = new THREE.Vector3();
  for (let i = 0; i < count; i++) {
    const z = -16 + rand() * 29;
    const x = coastX(z) + (rand() - 0.6) * 1.8;
    const info = terrainInfo(x, z);
    const s = 0.12 + rand() * 0.36;
    pos.set(x, Math.max(0.02, info.height) + s * 0.3, z);
    q.setFromEuler(new THREE.Euler(rand(), rand() * Math.PI, rand()));
    scl.set(s * 1.4, s * 0.75, s);
    matrix.compose(pos, q, scl); rocks.setMatrixAt(i, matrix);
  }
  rocks.castShadow = true; rocks.receiveShadow = true; group.add(rocks);

  const sandMaterial = new THREE.MeshStandardMaterial({ color: 0xc9ba82, roughness: 0.92, side: THREE.DoubleSide });
  for (let i = 0; i < 3; i++) {
    const bar = new THREE.Mesh(new THREE.CircleGeometry(1, 40), sandMaterial);
    bar.rotation.x = -Math.PI / 2;
    bar.scale.set(0.65 + i * 0.18, 1.65 - i * 0.3, 1);
    bar.rotation.z = -0.3 + i * 0.38;
    bar.position.set(MOUTH.x + (i - 1) * 0.8, 0.115 + i * 0.008, MOUTH.z + 0.65 + i * 0.55);
    bar.receiveShadow = true;
    group.add(bar);
  }

  const timber = new THREE.MeshStandardMaterial({ color: 0x655743, roughness: 0.9 });
  const pier = new THREE.Group();
  pier.position.set(MOUTH.x - 1.25, 0.24, MOUTH.z - 0.3);
  const deck = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.12, 0.32), timber);
  deck.rotation.y = -0.25; deck.castShadow = true; pier.add(deck);
  for (let i = 0; i < 6; i++) {
    const pile = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.055, 0.7, 6), timber);
    pile.position.set(-0.9 + i * 0.36, -0.25, (i % 2 ? 0.12 : -0.12)); pier.add(pile);
  }
  group.add(pier);
  return group;
}

function createAnchor() {
  const group = new THREE.Group();
  const groundY = terrainInfo(ANCHOR_X, ANCHOR_Z).height;
  group.position.set(ANCHOR_X, groundY + 0.03, ANCHOR_Z);
  const dark = new THREE.MeshStandardMaterial({ color: 0x193037, roughness: 0.44, metalness: 0.72 });
  const brass = new THREE.MeshStandardMaterial({ color: 0xba8b4f, roughness: 0.35, metalness: 0.75, emissive: 0x6b451a, emissiveIntensity: 0.22 });
  const glow = new THREE.MeshStandardMaterial({ color: 0x8fffe0, emissive: 0x4fffd0, emissiveIntensity: 2.2, roughness: 0.2, metalness: 0.2 });
  const base = new THREE.Mesh(new THREE.CylinderGeometry(1.9, 2.1, 0.34, 72), dark); base.position.y = 0.17;
  const inset = new THREE.Mesh(new THREE.CylinderGeometry(1.52, 1.52, 0.08, 72), brass); inset.position.y = 0.38;
  base.castShadow = true; base.receiveShadow = true; inset.castShadow = true; group.add(base, inset);
  for (let i = 0; i < 9; i++) {
    const a = i / 9 * Math.PI * 2;
    const pylon = new THREE.Group();
    pylon.position.set(Math.cos(a) * 1.55, 0.42, Math.sin(a) * 1.55);
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.16, 1.2, 6), dark); stem.position.y = 0.6;
    const cap = new THREE.Mesh(new THREE.OctahedronGeometry(0.13, 0), glow); cap.position.y = 1.28;
    stem.castShadow = true; pylon.add(stem, cap); group.add(pylon);
  }
  const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(0.48, 0), glow);
  crystal.scale.y = 1.9; crystal.position.y = 1.85; crystal.castShadow = true; group.add(crystal);
  const field = new THREE.Group(); group.add(field);
  const ringAssembly = new THREE.Group(); ringAssembly.position.y = 1.85; field.add(ringAssembly);
  const ringGeometry = new THREE.TorusGeometry(0.96, 0.035, 8, 72);
  const ringA = new THREE.Mesh(ringGeometry, brass);
  const ringB = new THREE.Mesh(ringGeometry, glow); ringB.rotation.y = Math.PI / 2;
  const ringC = new THREE.Mesh(ringGeometry, brass); ringC.rotation.x = Math.PI / 2; ringC.scale.setScalar(1.25);
  ringAssembly.add(ringA, ringB, ringC);
  const orbit = new THREE.Group(); orbit.position.y = 1.85; field.add(orbit);
  for (let i = 0; i < 9; i++) {
    const a = i / 9 * Math.PI * 2;
    const mote = new THREE.Mesh(new THREE.SphereGeometry(0.055, 8, 6), glow);
    mote.position.set(Math.cos(a) * 1.25, Math.sin(a * 2) * 0.25, Math.sin(a) * 1.25); orbit.add(mote);
  }
  const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.34, 7, 20, 1, true), new THREE.MeshBasicMaterial({ color: PALETTE.mint, transparent: true, opacity: 0.13, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false }));
  beam.position.y = 4.6; field.add(beam);
  const pulseRings = [];
  for (let i = 0; i < 3; i++) {
    const pulse = new THREE.Mesh(new THREE.TorusGeometry(2.15, 0.018, 5, 80), new THREE.MeshBasicMaterial({ color: PALETTE.mint, transparent: true, opacity: 0.34 - i * 0.07, depthWrite: false }));
    pulse.rotation.x = Math.PI / 2; pulse.position.y = 0.44; pulse.scale.setScalar(1 + i * 0.28); field.add(pulse); pulseRings.push(pulse);
  }
  const light = new THREE.PointLight(PALETTE.mint, 5, 10, 2); light.position.y = 2.2; group.add(light);
  const labelPosition = new THREE.Vector3(ANCHOR_X, groundY + 5.2, ANCHOR_Z);
  function sample(t) {
    const p = t / DURATION * Math.PI * 2;
    crystal.rotation.y = p;
    ringAssembly.rotation.set(Math.sin(p) * 0.35, p, Math.cos(p) * 0.22);
    orbit.rotation.y = -p;
    beam.material.opacity = 0.12 + 0.035 * (1 - Math.cos(p * 2));
    pulseRings.forEach((ring, i) => {
      const wave = (1 - Math.cos(p * 3 + i * Math.PI * 2 / 3)) * 0.5;
      ring.scale.setScalar(0.88 + i * 0.25 + wave * 0.28);
      ring.material.opacity = 0.3 * (1 - wave * 0.65);
    });
  }
  return { group, field, sample, labelPosition, groundY };
}

function createSurf() {
  const group = new THREE.Group();
  const reef = new THREE.Mesh(new THREE.CircleGeometry(1, 48), new THREE.MeshStandardMaterial({ color: 0x285b54, roughness: 0.9, transparent: true, opacity: 0.75 }));
  reef.rotation.x = -Math.PI / 2; reef.scale.set(2.6, 6.5, 1); reef.position.set(SURF.x, -0.16, SURF.z); group.add(reef);
  const waves = [];
  for (let i = 0; i < 6; i++) {
    const points = [];
    for (let j = 0; j <= 24; j++) {
      const z = -12.5 + j / 24 * 11;
      const arc = Math.sin(j / 24 * Math.PI);
      const x = SURF.x - 2.1 + i * 0.72 + arc * 1.35 + Math.sin((z + 12) * 0.32 + i * 0.35) * 0.32;
      points.push(new THREE.Vector3(x, 0.16, z));
    }
    const curve = new THREE.CatmullRomCurve3(points);
    const material = new THREE.MeshBasicMaterial({ color: PALETTE.foam, transparent: true, opacity: 0.68, depthWrite: false });
    const foam = new THREE.Mesh(new THREE.TubeGeometry(curve, 72, 0.048 + (i % 2) * 0.018, 5, false), material);
    foam.renderOrder = 5; group.add(foam); waves.push(foam);
  }
  function sample(t) {
    const p = t / DURATION * Math.PI * 2;
    waves.forEach((wave, i) => {
      wave.position.x = Math.sin(p * 2 + i * 0.7) * 0.16;
      wave.position.y = Math.sin(p * 3 + i) * 0.018;
      wave.material.opacity = 0.5 + 0.22 * (0.5 + 0.5 * Math.sin(p * 2 + i));
    });
  }
  return { group, sample };
}

export function createWorld(scene) {
  const rand = mulberry32(9027);
  const base = new THREE.Mesh(new THREE.CylinderGeometry(RADIUS, RADIUS * 0.985, 1.3, 192), new THREE.MeshStandardMaterial({ color: 0x142b2d, roughness: 0.83, metalness: 0.18 }));
  base.position.y = -2.13; base.receiveShadow = true; base.castShadow = true; scene.add(base);
  const baseBand = new THREE.Mesh(new THREE.TorusGeometry(RADIUS * 0.993, 0.055, 6, 192), new THREE.MeshBasicMaterial({ color: 0x315653 }));
  baseBand.rotation.x = Math.PI / 2; baseBand.position.y = -2.35; scene.add(baseBand);
  const terrain = createTerrain(); scene.add(terrain);
  const water = createWater(); scene.add(water.mesh);
  const river = createRiver(); scene.add(river);
  const survey = createSurvey(); scene.add(survey);
  const town = createTown(rand); scene.add(town.group);
  const vegetation = createVegetation(rand); scene.add(vegetation.group);
  const headland = createHeadland(rand); scene.add(headland);
  const anchor = createAnchor(); scene.add(anchor.group);
  const surf = createSurf(); scene.add(surf.group);

  const ground = new THREE.Mesh(new THREE.CircleGeometry(220, 96).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ color: PALETTE.sky, roughness: 1 }));
  ground.position.y = -2.8; ground.receiveShadow = true; scene.add(ground);
  const grid = new THREE.GridHelper(180, 40, 0x173b3d, 0x10292d); grid.position.y = -2.77; grid.material.transparent = true; grid.material.opacity = 0.36; scene.add(grid);

  function sample(t) {
    water.uniforms.uTime.value = t;
    anchor.sample(t);
    surf.sample(t);
  }
  return {
    survey, anchor, surf, water, town, vegetation,
    sample,
    stats: { buildings: town.count, trees: vegetation.count, radius: RADIUS },
    labels: {
      anchor: anchor.labelPosition,
      surf: new THREE.Vector3(SURF.x + 0.8, 1.0, SURF.z - 1),
      mouth: new THREE.Vector3(MOUTH.x + 0.3, 1.15, MOUTH.z + 0.5),
      town: new THREE.Vector3(TOWN.x, terrainInfo(TOWN.x, TOWN.z).height + 2.5, TOWN.z),
    },
  };
}
