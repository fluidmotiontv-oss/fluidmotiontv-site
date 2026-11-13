/**
 * HoloCraft 3D - 3D Exporters & Hologram Layout Generator
 * Generates OBJ, PLY, STL, and 4-View Holographic Pyramid projections
 */

import { ProcessedDepthData } from './depthEstimator';
import { HologramParameters, CameraSnapshot, ExportManifest } from '../types/hologram';

/**
 * Generate Wavefront OBJ text content
 */
export function exportToWavefrontObj(
  depthData: ProcessedDepthData,
  objectName: string = 'HologramAsset'
): string {
  const { positions, normals, colors, indices } = depthData;
  const numVertices = positions.length / 3;

  let objStr = `# HoloCraft 3D - Hologram Asset Exporter\n`;
  objStr += `# Object: ${objectName}\n`;
  objStr += `# Vertices: ${numVertices}\n`;
  objStr += `# Faces: ${indices.length / 3}\n\n`;

  // Write Vertices with RGB colors
  for (let i = 0; i < numVertices; i++) {
    const px = positions[i * 3].toFixed(4);
    const py = positions[i * 3 + 1].toFixed(4);
    const pz = positions[i * 3 + 2].toFixed(4);
    const r = colors[i * 3].toFixed(3);
    const g = colors[i * 3 + 1].toFixed(3);
    const b = colors[i * 3 + 2].toFixed(3);

    objStr += `v ${px} ${py} ${pz} ${r} ${g} ${b}\n`;
  }

  // Write Normals
  for (let i = 0; i < numVertices; i++) {
    const nx = normals[i * 3].toFixed(4);
    const ny = normals[i * 3 + 1].toFixed(4);
    const nz = normals[i * 3 + 2].toFixed(4);
    objStr += `vn ${nx} ${ny} ${nz}\n`;
  }

  // Write Faces (1-indexed)
  for (let i = 0; i < indices.length; i += 3) {
    const i1 = indices[i] + 1;
    const i2 = indices[i + 1] + 1;
    const i3 = indices[i + 2] + 1;
    objStr += `f ${i1}//${i1} ${i2}//${i2} ${i3}//${i3}\n`;
  }

  return objStr;
}

/**
 * Generate Stanford PLY Point Cloud file
 */
export function exportToPlyPointCloud(
  depthData: ProcessedDepthData,
  objectName: string = 'HologramPointCloud'
): string {
  const { positions, colors, normals } = depthData;
  const numVertices = positions.length / 3;

  let plyStr = `ply\n`;
  plyStr += `format ascii 1.0\n`;
  plyStr += `comment HoloCraft 3D Point Cloud Asset - ${objectName}\n`;
  plyStr += `element vertex ${numVertices}\n`;
  plyStr += `property float x\n`;
  plyStr += `property float y\n`;
  plyStr += `property float z\n`;
  plyStr += `property float nx\n`;
  plyStr += `property float ny\n`;
  plyStr += `property float nz\n`;
  plyStr += `property uchar red\n`;
  plyStr += `property uchar green\n`;
  plyStr += `property uchar blue\n`;
  plyStr += `end_header\n`;

  for (let i = 0; i < numVertices; i++) {
    const px = positions[i * 3].toFixed(4);
    const py = positions[i * 3 + 1].toFixed(4);
    const pz = positions[i * 3 + 2].toFixed(4);

    const nx = normals[i * 3].toFixed(4);
    const ny = normals[i * 3 + 1].toFixed(4);
    const nz = normals[i * 3 + 2].toFixed(4);

    const r = Math.round(colors[i * 3] * 255);
    const g = Math.round(colors[i * 3 + 1] * 255);
    const b = Math.round(colors[i * 3 + 2] * 255);

    plyStr += `${px} ${py} ${pz} ${nx} ${ny} ${nz} ${r} ${g} ${b}\n`;
  }

  return plyStr;
}

/**
 * Generate 3D Printable STL format
 */
export function exportToStlMesh(
  depthData: ProcessedDepthData,
  solidName: string = 'HoloCraft3D_Model'
): string {
  const { positions, indices } = depthData;

  let stlStr = `solid ${solidName}\n`;

  for (let i = 0; i < indices.length; i += 3) {
    const i1 = indices[i] * 3;
    const i2 = indices[i + 1] * 3;
    const i3 = indices[i + 2] * 3;

    const p1x = positions[i1], p1y = positions[i1 + 1], p1z = positions[i1 + 2];
    const p2x = positions[i2], p2y = positions[i2 + 1], p2z = positions[i2 + 2];
    const p3x = positions[i3], p3y = positions[i3 + 1], p3z = positions[i3 + 2];

    // Calculate face normal
    const ax = p2x - p1x, ay = p2y - p1y, az = p2z - p1z;
    const bx = p3x - p1x, by = p3y - p1y, bz = p3z - p1z;

    const nx = ay * bz - az * by;
    const ny = az * bx - ax * bz;
    const nz = ax * by - ay * bx;
    const len = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1.0;

    stlStr += `  facet normal ${(nx / len).toFixed(4)} ${(ny / len).toFixed(4)} ${(nz / len).toFixed(4)}\n`;
    stlStr += `    outer loop\n`;
    stlStr += `      vertex ${p1x.toFixed(4)} ${p1y.toFixed(4)} ${p1z.toFixed(4)}\n`;
    stlStr += `      vertex ${p2x.toFixed(4)} ${p2y.toFixed(4)} ${p2z.toFixed(4)}\n`;
    stlStr += `      vertex ${p3x.toFixed(4)} ${p3y.toFixed(4)} ${p3z.toFixed(4)}\n`;
    stlStr += `    endloop\n`;
    stlStr += `  endfacet\n`;
  }

  stlStr += `endsolid ${solidName}\n`;
  return stlStr;
}

/**
 * Render 4-Way Pyramid Hologram Image Canvas
 * Arranges 4 directional views (North, South, East, West) facing inward for glass pyramid projection
 */
export function generatePyramidHologramCanvas(
  sourceCanvas: HTMLCanvasElement,
  size: number = 1080
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Deep black background (essential for Pepper's ghost holographic reflection)
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, size, size);

  const viewWidth = size * 0.36;
  const viewHeight = size * 0.36;
  const center = size / 2;
  const offset = size * 0.28;

  // 1. Top View (0 degrees - pointing downwards towards center)
  ctx.save();
  ctx.translate(center, center - offset);
  ctx.rotate(0); // Upright
  ctx.drawImage(sourceCanvas, -viewWidth / 2, -viewHeight / 2, viewWidth, viewHeight);
  ctx.restore();

  // 2. Bottom View (180 degrees - upside down facing upward towards center)
  ctx.save();
  ctx.translate(center, center + offset);
  ctx.rotate(Math.PI); // Flipped 180
  ctx.drawImage(sourceCanvas, -viewWidth / 2, -viewHeight / 2, viewWidth, viewHeight);
  ctx.restore();

  // 3. Left View (90 degrees clockwise facing right towards center)
  ctx.save();
  ctx.translate(center - offset, center);
  ctx.rotate(-Math.PI / 2); // Flipped -90
  ctx.drawImage(sourceCanvas, -viewWidth / 2, -viewHeight / 2, viewWidth, viewHeight);
  ctx.restore();

  // 4. Right View (-90 degrees counter-clockwise facing left towards center)
  ctx.save();
  ctx.translate(center + offset, center);
  ctx.rotate(Math.PI / 2); // Flipped +90
  ctx.drawImage(sourceCanvas, -viewWidth / 2, -viewHeight / 2, viewWidth, viewHeight);
  ctx.restore();

  // Draw central alignment crosshair guide
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(center - 15, center);
  ctx.lineTo(center + 15, center);
  ctx.moveTo(center, center - 15);
  ctx.lineTo(center, center + 15);
  ctx.stroke();

  return canvas;
}

/**
 * Generate Standalone GLSL Hologram Shader string
 */
export function generateStandaloneHologramGLSL(
  themeName: string,
  params: HologramParameters
): string {
  return `/**
 * HoloCraft 3D - Standalone Volumetric Hologram Fragment Shader
 * Generated for 3D Camera Capture Asset
 * Calibrated with 432 Hz Harmonic Carrier Wave
 */
#version 300 es
precision highp float;

in vec2 v_uv;
out vec4 fragColor;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform sampler2D u_cameraTexture;
uniform sampler2D u_depthMap;

// Hologram Uniform Parameters
uniform float u_scanlineSpeed;    // ${params.scanlineSpeed.toFixed(2)}
uniform float u_scanlineDensity;  // ${params.scanlineDensity.toFixed(2)}
uniform float u_flickerIntensity; // ${params.flickerIntensity.toFixed(2)}
uniform float u_bloomGlow;        // ${params.bloomGlow.toFixed(2)}
uniform vec3  u_hologramColor;    // ${themeName}

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  vec2 uv = v_uv;
  
  // 1. Chromatic Holographic Laser Aberration
  float chromAb = 0.005 * (1.0 + sin(u_time * 4.0) * 0.3);
  vec4 colR = texture(u_cameraTexture, uv + vec2(chromAb, 0.0));
  vec4 colG = texture(u_cameraTexture, uv);
  vec4 colB = texture(u_cameraTexture, uv - vec2(chromAb, 0.0));
  vec4 baseColor = vec4(colR.r, colG.g, colB.b, 1.0);

  // 2. Depth Map Sample
  float depth = texture(u_depthMap, uv).r;

  // 3. Scanline Raster Modulation
  float scanline = sin(uv.y * u_scanlineDensity * 40.0 - u_time * u_scanlineSpeed * 8.0);
  scanline = (scanline * 0.5 + 0.5);

  // 4. Holographic Glitch & Flicker
  float flicker = 1.0 - hash(vec2(u_time * 0.1, uv.y)) * u_flickerIntensity * 0.25;

  // 5. Fresnel / Radial Holographic Glow
  vec2 centerVec = (uv - 0.5) * 2.0;
  float radialDist = length(centerVec);
  float edgeGlow = pow(radialDist, 2.5) * 0.5;

  // Combine into luminous hologram
  vec3 holoColor = baseColor.rgb * 0.4 + u_hologramColor * (baseColor.r * 0.7 + depth * 0.5);
  holoColor *= scanline;
  holoColor *= flicker;
  holoColor += u_hologramColor * edgeGlow * u_bloomGlow;

  // Output alpha transparency based on luminosity
  float alpha = clamp(length(holoColor) * 1.2, 0.0, 1.0);
  fragColor = vec4(holoColor * u_bloomGlow, alpha);
}
`;
}

/**
 * Trigger file download helper
 */
export function downloadBlob(content: string | Blob, filename: string, mimeType: string = 'text/plain') {
  const blob = typeof content === 'string' ? new Blob([content], { type: mimeType }) : content;
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
