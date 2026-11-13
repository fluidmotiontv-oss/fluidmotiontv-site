/**
 * Geometry generators for AetherGL Studio
 * Returns positions, normals, texcoords (UVs), and indices.
 */

export interface MeshData {
  positions: Float32Array;
  normals: Float32Array;
  texcoords: Float32Array;
  indices: Uint16Array;
}

export function createPlane(width = 2, height = 2): MeshData {
  const w = width / 2;
  const h = height / 2;
  
  const positions = new Float32Array([
    -w, -h,  0,
     w, -h,  0,
     w,  h,  0,
    -w,  h,  0,
  ]);
  
  const normals = new Float32Array([
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
  ]);
  
  const texcoords = new Float32Array([
    0, 0,
    1, 0,
    1, 1,
    0, 1,
  ]);
  
  const indices = new Uint16Array([
    0, 1, 2,
    0, 2, 3,
  ]);

  return { positions, normals, texcoords, indices };
}

export function createCube(size = 1.5): MeshData {
  const s = size / 2;
  
  // 24 vertices (4 per face for distinct normals)
  const positions = new Float32Array([
    // Front face
    -s, -s,  s,   s, -s,  s,   s,  s,  s,  -s,  s,  s,
    // Back face
    -s, -s, -s,  -s,  s, -s,   s,  s, -s,   s, -s, -s,
    // Top face
    -s,  s, -s,  -s,  s,  s,   s,  s,  s,   s,  s, -s,
    // Bottom face
    -s, -s, -s,   s, -s, -s,   s, -s,  s,  -s, -s,  s,
    // Right face
     s, -s, -s,   s,  s, -s,   s,  s,  s,   s, -s,  s,
    // Left face
    -s, -s, -s,  -s, -s,  s,  -s,  s,  s,  -s,  s, -s,
  ]);

  const normals = new Float32Array([
    // Front
    0, 0, 1,  0, 0, 1,  0, 0, 1,  0, 0, 1,
    // Back
    0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,
    // Top
    0, 1, 0,  0, 1, 0,  0, 1, 0,  0, 1, 0,
    // Bottom
    0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
    // Right
    1, 0, 0,  1, 0, 0,  1, 0, 0,  1, 0, 0,
    // Left
    -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,
  ]);

  const texcoords = new Float32Array([
    // Front
    0, 0,  1, 0,  1, 1,  0, 1,
    // Back
    1, 0,  1, 1,  0, 1,  0, 0,
    // Top
    0, 1,  0, 0,  1, 0,  1, 1,
    // Bottom
    1, 1,  0, 1,  0, 0,  1, 0,
    // Right
    1, 0,  1, 1,  0, 1,  0, 0,
    // Left
    0, 0,  1, 0,  1, 1,  0, 1,
  ]);

  const indices = new Uint16Array([
    0,  1,  2,      0,  2,  3,    // front
    4,  5,  6,      4,  6,  7,    // back
    8,  9,  10,     8,  10, 11,   // top
    12, 13, 14,     12, 14, 15,   // bottom
    16, 17, 18,     16, 18, 19,   // right
    20, 21, 22,     20, 22, 23,   // left
  ]);

  return { positions, normals, texcoords, indices };
}

export function createSphere(radius = 0.9, segments = 32, rings = 16): MeshData {
  const positions: number[] = [];
  const normals: number[] = [];
  const texcoords: number[] = [];
  const indices: number[] = [];

  for (let r = 0; r <= rings; r++) {
    const theta = (r * Math.PI) / rings;
    const sinTheta = Math.sin(theta);
    const cosTheta = Math.cos(theta);

    for (let s = 0; s <= segments; s++) {
      const phi = (s * 2 * Math.PI) / segments;
      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);

      const x = cosPhi * sinTheta;
      const y = cosTheta;
      const z = sinPhi * sinTheta;
      
      const u = s / segments;
      const v = r / rings;

      positions.push(x * radius, y * radius, z * radius);
      normals.push(x, y, z);
      texcoords.push(u, v);
    }
  }

  for (let r = 0; r < rings; r++) {
    for (let s = 0; s < segments; s++) {
      const first = r * (segments + 1) + s;
      const second = first + segments + 1;

      indices.push(first, second, first + 1);
      indices.push(second, second + 1, first + 1);
    }
  }

  return {
    positions: new Float32Array(positions),
    normals: new Float32Array(normals),
    texcoords: new Float32Array(texcoords),
    indices: new Uint16Array(indices),
  };
}

export function createTorus(
  radialSegments = 32,
  tubularSegments = 16,
  radius = 0.8,
  tube = 0.25
): MeshData {
  const positions: number[] = [];
  const normals: number[] = [];
  const texcoords: number[] = [];
  const indices: number[] = [];

  for (let j = 0; j <= radialSegments; j++) {
    const u = (j / radialSegments) * 2 * Math.PI;
    const cosU = Math.cos(u);
    const sinU = Math.sin(u);

    for (let i = 0; i <= tubularSegments; i++) {
      const v = (i / tubularSegments) * 2 * Math.PI;
      const cosV = Math.cos(v);
      const sinV = Math.sin(v);

      const x = (radius + tube * cosV) * cosU;
      const y = (radius + tube * cosV) * sinU;
      const z = tube * sinV;

      positions.push(x, y, z);

      const nx = cosV * cosU;
      const ny = cosV * sinU;
      const nz = sinV;
      normals.push(nx, ny, nz);

      texcoords.push(j / radialSegments, i / tubularSegments);
    }
  }

  for (let j = 0; j < radialSegments; j++) {
    for (let i = 0; i < tubularSegments; i++) {
      const first = j * (tubularSegments + 1) + i;
      const second = first + tubularSegments + 1;

      indices.push(first, first + 1, second);
      indices.push(second, first + 1, second + 1);
    }
  }

  return {
    positions: new Float32Array(positions),
    normals: new Float32Array(normals),
    texcoords: new Float32Array(texcoords),
    indices: new Uint16Array(indices),
  };
}

export function createCylinder(
  radialSegments = 32,
  radius = 0.6,
  height = 1.5
): MeshData {
  const positions: number[] = [];
  const normals: number[] = [];
  const texcoords: number[] = [];
  const indices: number[] = [];

  const halfHeight = height / 2;

  // Cylinder Side
  for (let r = 0; r <= radialSegments; r++) {
    const phi = (r * 2 * Math.PI) / radialSegments;
    const sinPhi = Math.sin(phi);
    const cosPhi = Math.cos(phi);

    // Bottom vertex
    positions.push(cosPhi * radius, -halfHeight, sinPhi * radius);
    normals.push(cosPhi, 0, sinPhi);
    texcoords.push(r / radialSegments, 0);

    // Top vertex
    positions.push(cosPhi * radius, halfHeight, sinPhi * radius);
    normals.push(cosPhi, 0, sinPhi);
    texcoords.push(r / radialSegments, 1);
  }

  // Side indices
  for (let r = 0; r < radialSegments; r++) {
    const first = r * 2;
    const second = first + 1;
    const nextFirst = first + 2;
    const nextSecond = first + 3;

    indices.push(first, nextFirst, second);
    indices.push(second, nextFirst, nextSecond);
  }

  // Cap top and bottom offsets for rendering caps
  const capCenterBottomIndex = positions.length / 3;
  positions.push(0, -halfHeight, 0);
  normals.push(0, -1, 0);
  texcoords.push(0.5, 0.5);

  const capCenterTopIndex = positions.length / 3;
  positions.push(0, halfHeight, 0);
  normals.push(0, 1, 0);
  texcoords.push(0.5, 0.5);

  // Add top & bottom vertices for caps (so normal is pure +/- Y)
  const capStartBottomIndex = positions.length / 3;
  for (let r = 0; r <= radialSegments; r++) {
    const phi = (r * 2 * Math.PI) / radialSegments;
    const sinPhi = Math.sin(phi);
    const cosPhi = Math.cos(phi);

    positions.push(cosPhi * radius, -halfHeight, sinPhi * radius);
    normals.push(0, -1, 0);
    texcoords.push(0.5 + cosPhi * 0.5, 0.5 + sinPhi * 0.5);
  }

  const capStartTopIndex = positions.length / 3;
  for (let r = 0; r <= radialSegments; r++) {
    const phi = (r * 2 * Math.PI) / radialSegments;
    const sinPhi = Math.sin(phi);
    const cosPhi = Math.cos(phi);

    positions.push(cosPhi * radius, halfHeight, sinPhi * radius);
    normals.push(0, 1, 0);
    texcoords.push(0.5 + cosPhi * 0.5, 0.5 + sinPhi * 0.5);
  }

  // Bottom cap indices
  for (let r = 0; r < radialSegments; r++) {
    const idx = capStartBottomIndex + r;
    indices.push(capCenterBottomIndex, idx + 1, idx);
  }

  // Top cap indices
  for (let r = 0; r < radialSegments; r++) {
    const idx = capStartTopIndex + r;
    indices.push(capCenterTopIndex, idx, idx + 1);
  }

  return {
    positions: new Float32Array(positions),
    normals: new Float32Array(normals),
    texcoords: new Float32Array(texcoords),
    indices: new Uint16Array(indices),
  };
}
