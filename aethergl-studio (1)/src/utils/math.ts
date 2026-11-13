/**
 * Lightweight 3D matrix math library for WebGL Forge
 */

export type Mat4 = Float32Array;

export function createIdentity(): Mat4 {
  const out = new Float32Array(16);
  out[0] = 1;
  out[5] = 1;
  out[10] = 1;
  out[15] = 1;
  return out;
}

export function multiply(a: Mat4, b: Mat4): Mat4 {
  const out = new Float32Array(16);
  const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
  const a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
  const a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
  const a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

  let b0  = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
  out[0] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
  out[1] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
  out[2] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
  out[3] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

  b0 = b[4]; b1 = b[5]; b2 = b[6]; b3 = b[7];
  out[4] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
  out[5] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
  out[6] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
  out[7] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

  b0 = b[8]; b1 = b[9]; b2 = b[10]; b3 = b[11];
  out[8] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
  out[9] = b0*a01 + b1*a11 + b2*a22 + b3*a32;
  out[10] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
  out[11] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

  b0 = b[12]; b1 = b[13]; b2 = b[14]; b3 = b[15];
  out[12] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
  out[13] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
  out[14] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
  out[15] = b0*a03 + b1*a13 + b2*a23 + b3*a33;
  return out;
}

export function translate(m: Mat4, x: number, y: number, z: number): Mat4 {
  const out = new Float32Array(m);
  out[12] = m[0] * x + m[4] * y + m[8] * z + m[12];
  out[13] = m[1] * x + m[5] * y + m[9] * z + m[13];
  out[14] = m[2] * x + m[6] * y + m[10] * z + m[14];
  out[15] = m[3] * x + m[7] * y + m[11] * z + m[15];
  return out;
}

export function rotateX(m: Mat4, rad: number): Mat4 {
  const out = new Float32Array(m);
  const s = Math.sin(rad);
  const c = Math.cos(rad);
  const m10 = m[4], m11 = m[5], m12 = m[6], m13 = m[7];
  const m20 = m[8], m21 = m[9], m22 = m[10], m23 = m[11];

  out[4] = m10 * c + m20 * s;
  out[5] = m11 * c + m21 * s;
  out[6] = m12 * c + m22 * s;
  out[7] = m13 * c + m23 * s;
  out[8] = m20 * c - m10 * s;
  out[9] = m21 * c - m11 * s;
  out[10] = m22 * c - m12 * s;
  out[11] = m23 * c - m13 * s;
  return out;
}

export function rotateY(m: Mat4, rad: number): Mat4 {
  const out = new Float32Array(m);
  const s = Math.sin(rad);
  const c = Math.cos(rad);
  const m00 = m[0], m01 = m[1], m02 = m[2], m03 = m[3];
  const m20 = m[8], m21 = m[9], m22 = m[10], m23 = m[11];

  out[0] = m00 * c - m20 * s;
  out[1] = m01 * c - m21 * s;
  out[2] = m02 * c - m22 * s;
  out[3] = m03 * c - m23 * s;
  out[8] = m00 * s + m20 * c;
  out[9] = m01 * s + m21 * c;
  out[10] = m02 * s + m22 * c;
  out[11] = m03 * s + m23 * c;
  return out;
}

export function rotateZ(m: Mat4, rad: number): Mat4 {
  const out = new Float32Array(m);
  const s = Math.sin(rad);
  const c = Math.cos(rad);
  const m00 = m[0], m01 = m[1], m02 = m[2], m03 = m[3];
  const m10 = m[4], m11 = m[5], m12 = m[6], m13 = m[7];

  out[0] = m00 * c + m10 * s;
  out[1] = m01 * c + m11 * s;
  out[2] = m02 * c + m12 * s;
  out[3] = m03 * c + m13 * s;
  out[4] = m10 * c - m00 * s;
  out[5] = m11 * c - m01 * s;
  out[6] = m12 * c - m02 * s;
  out[7] = m13 * c - m03 * s;
  return out;
}

export function scale(m: Mat4, x: number, y: number, z: number): Mat4 {
  const out = new Float32Array(m);
  out[0] = m[0] * x;
  out[1] = m[1] * x;
  out[2] = m[2] * x;
  out[3] = m[3] * x;
  out[4] = m[4] * y;
  out[5] = m[5] * y;
  out[6] = m[6] * y;
  out[7] = m[7] * y;
  out[8] = m[8] * z;
  out[9] = m[9] * z;
  out[10] = m[10] * z;
  out[11] = m[11] * z;
  return out;
}

export function perspective(fovy: number, aspect: number, near: number, far: number): Mat4 {
  const out = new Float32Array(16);
  const f = 1.0 / Math.tan(fovy / 2);
  const nf = 1.0 / (near - far);
  out[0] = f / aspect;
  out[5] = f;
  out[10] = (far + near) * nf;
  out[11] = -1;
  out[14] = 2 * far * near * nf;
  return out;
}

export function lookAt(eye: number[], target: number[], up: number[]): Mat4 {
  const out = new Float32Array(16);
  const eyex = eye[0], eyey = eye[1], eyez = eye[2];
  const upx = up[0], upy = up[1], upz = up[2];
  const targetx = target[0], targety = target[1], targetz = target[2];

  let z0 = eyex - targetx;
  let z1 = eyey - targety;
  let z2 = eyez - targetz;

  let len = Math.hypot(z0, z1, z2);
  if (len === 0) {
    z2 = 1;
  } else {
    len = 1 / len;
    z0 *= len;
    z1 *= len;
    z2 *= len;
  }

  let x0 = upy * z2 - upz * z1;
  let x1 = upz * z0 - upx * z2;
  let x2 = upx * z1 - upy * z0;
  len = Math.hypot(x0, x1, x2);
  if (len === 0) {
    x0 = 0;
    x1 = 0;
    x2 = 0;
  } else {
    len = 1 / len;
    x0 *= len;
    x1 *= len;
    x2 *= len;
  }

  let y0 = z1 * x2 - z2 * x1;
  let y1 = z2 * x0 - z0 * x2;
  let y2 = z0 * x1 - z1 * x0;
  len = Math.hypot(y0, y1, y2);
  if (len === 0) {
    y0 = 0;
    y1 = 0;
    y2 = 0;
  } else {
    len = 1 / len;
    y0 *= len;
    y1 *= len;
    y2 *= len;
  }

  out[0] = x0;
  out[1] = y0;
  out[2] = z0;
  out[3] = 0;
  out[4] = x1;
  out[5] = y1;
  out[6] = z1;
  out[7] = 0;
  out[8] = x2;
  out[9] = y2;
  out[10] = z2;
  out[11] = 0;
  out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
  out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
  out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
  out[15] = 1;

  return out;
}
