/**
 * HoloCraft 3D - Computer Vision Depth & Geometry Estimator
 * Extracts depth, surface normals, and 3D point cloud topology from camera frames
 */

export interface ProcessedDepthData {
  depthMapDataUrl: string;
  normalMapDataUrl: string;
  depthArray: Float32Array; // 0.0 (near/front) to 1.0 (far/back) or normalized depth
  width: number;
  height: number;
  positions: Float32Array; // X, Y, Z for every sampled point
  colors: Float32Array; // R, G, B for every sampled point
  normals: Float32Array; // Nx, Ny, Nz
  indices: Uint32Array; // Triangulated index buffer for solid/wireframe mesh
  pointCount: number;
}

export function generateDepthAndGeometryFromImage(
  image: HTMLImageElement | HTMLCanvasElement,
  density: number = 100, // sample resolution along largest axis
  displacementScale: number = 1.0,
  depthInvert: boolean = false,
  depthThreshold: number = 0.05
): ProcessedDepthData {
  // Create offscreen canvas to process raw pixel buffer
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) {
    throw new Error('Could not create 2D canvas context for depth processing');
  }

  // Calculate sampling aspect ratio
  const imgWidth = image.width || 640;
  const imgHeight = image.height || 480;
  const aspect = imgWidth / imgHeight;

  let gridW = density;
  let gridH = Math.round(density / aspect);
  if (aspect < 1) {
    gridH = density;
    gridW = Math.round(density * aspect);
  }
  gridW = Math.max(16, Math.min(240, gridW));
  gridH = Math.max(16, Math.min(240, gridH));

  canvas.width = gridW;
  canvas.height = gridH;

  // Draw scaled image to sample grid
  ctx.drawImage(image, 0, 0, gridW, gridH);
  const imgData = ctx.getImageData(0, 0, gridW, gridH);
  const pixels = imgData.data;

  const totalPoints = gridW * gridH;
  const depthArray = new Float32Array(totalPoints);
  const luminanceArray = new Float32Array(totalPoints);

  // 1. Calculate luminance and local contrast
  for (let y = 0; y < gridH; y++) {
    for (let x = 0; x < gridW; x++) {
      const idx = (y * gridW + x) * 4;
      const r = pixels[idx] / 255.0;
      const g = pixels[idx + 1] / 255.0;
      const b = pixels[idx + 2] / 255.0;

      // Perceptual relative luminance (ITU-R BT.709)
      const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      luminanceArray[y * gridW + x] = lum;
    }
  }

  // 2. Multi-pass depth estimation with Sobel edge curvature and center focus weight
  const depthCanvas = document.createElement('canvas');
  depthCanvas.width = gridW;
  depthCanvas.height = gridH;
  const depthCtx = depthCanvas.getContext('2d')!;
  const depthImgData = depthCtx.createImageData(gridW, gridH);

  const normalCanvas = document.createElement('canvas');
  normalCanvas.width = gridW;
  normalCanvas.height = gridH;
  const normalCtx = normalCanvas.getContext('2d')!;
  const normalImgData = normalCtx.createImageData(gridW, gridH);

  for (let y = 0; y < gridH; y++) {
    for (let x = 0; x < gridW; x++) {
      const pIdx = y * gridW + x;

      // Sobel gradient
      const left = x > 0 ? luminanceArray[y * gridW + (x - 1)] : luminanceArray[pIdx];
      const right = x < gridW - 1 ? luminanceArray[y * gridW + (x + 1)] : luminanceArray[pIdx];
      const top = y > 0 ? luminanceArray[(y - 1) * gridW + x] : luminanceArray[pIdx];
      const bottom = y < gridH - 1 ? luminanceArray[(y + 1) * gridW + x] : luminanceArray[pIdx];

      const dx = (right - left) * 0.5;
      const dy = (bottom - top) * 0.5;
      const edgeMagnitude = Math.sqrt(dx * dx + dy * dy);

      // Center-weighted focal depth bias (subjects in camera center usually pop forward in 3D/holograms)
      const nx = (x / gridW - 0.5) * 2;
      const ny = (y / gridH - 0.5) * 2;
      const distFromCenter = Math.sqrt(nx * nx + ny * ny);
      const focalBias = Math.max(0, 1.0 - distFromCenter * 0.45);

      // Raw depth formula combining luminance + focal bias + edge smoothing
      let depthVal = luminanceArray[pIdx] * 0.65 + focalBias * 0.25 + edgeMagnitude * 0.1;
      
      if (depthInvert) {
        depthVal = 1.0 - depthVal;
      }
      depthVal = Math.max(0, Math.min(1.0, depthVal));
      depthArray[pIdx] = depthVal;

      // Write to visual depth map canvas
      const dPixelIdx = pIdx * 4;
      const dByte = Math.round(depthVal * 255);
      depthImgData.data[dPixelIdx] = dByte;
      depthImgData.data[dPixelIdx + 1] = dByte;
      depthImgData.data[dPixelIdx + 2] = dByte;
      depthImgData.data[dPixelIdx + 3] = 255;

      // Normal vector calculation
      const normZ = 1.0 / Math.max(0.001, displacementScale * 2.0);
      const length = Math.sqrt(dx * dx + dy * dy + normZ * normZ);
      const normX = -dx / length;
      const normY = -dy / length;
      const normalZVal = normZ / length;

      normalImgData.data[dPixelIdx] = Math.round((normX * 0.5 + 0.5) * 255);
      normalImgData.data[dPixelIdx + 1] = Math.round((normY * 0.5 + 0.5) * 255);
      normalImgData.data[dPixelIdx + 2] = Math.round((normalZVal * 0.5 + 0.5) * 255);
      normalImgData.data[dPixelIdx + 3] = 255;
    }
  }

  depthCtx.putImageData(depthImgData, 0, 0);
  normalCtx.putImageData(normalImgData, 0, 0);

  // 3. Build 3D Point Cloud Buffers and Triangulated Mesh Indices
  const positions = new Float32Array(totalPoints * 3);
  const colors = new Float32Array(totalPoints * 3);
  const normals = new Float32Array(totalPoints * 3);

  // Triangles: (gridW - 1) * (gridH - 1) * 2 triangles * 3 indices
  const indexCount = (gridW - 1) * (gridH - 1) * 6;
  const indices = new Uint32Array(indexCount);

  let pointCounter = 0;
  for (let y = 0; y < gridH; y++) {
    for (let x = 0; x < gridW; x++) {
      const idx = y * gridW + x;
      const depth = depthArray[idx];

      // Normalized coordinates centered at origin: [-1..1]
      const px = ((x / (gridW - 1)) - 0.5) * 2.4 * aspect;
      const py = (0.5 - (y / (gridH - 1))) * 2.4;
      const pz = (depth - 0.5) * 1.5 * displacementScale;

      const posIdx = pointCounter * 3;
      positions[posIdx] = px;
      positions[posIdx + 1] = py;
      positions[posIdx + 2] = pz;

      // Color from camera pixel
      const colorPixIdx = idx * 4;
      colors[posIdx] = pixels[colorPixIdx] / 255.0;
      colors[posIdx + 1] = pixels[colorPixIdx + 1] / 255.0;
      colors[posIdx + 2] = pixels[colorPixIdx + 2] / 255.0;

      // Approximate surface normal for lighting
      const left = x > 0 ? depthArray[y * gridW + (x - 1)] : depth;
      const right = x < gridW - 1 ? depthArray[y * gridW + (x + 1)] : depth;
      const top = y > 0 ? depthArray[(y - 1) * gridW + x] : depth;
      const bottom = y < gridH - 1 ? depthArray[(y + 1) * gridW + x] : depth;

      const dX = (right - left) * displacementScale;
      const dY = (bottom - top) * displacementScale;
      const dZ = 0.1;
      const len = Math.sqrt(dX * dX + dY * dY + dZ * dZ) || 1.0;

      normals[posIdx] = -dX / len;
      normals[posIdx + 1] = -dY / len;
      normals[posIdx + 2] = dZ / len;

      pointCounter++;
    }
  }

  // Generate Triangulation index buffer
  let indIdx = 0;
  for (let y = 0; y < gridH - 1; y++) {
    for (let x = 0; x < gridW - 1; x++) {
      const a = y * gridW + x;
      const b = y * gridW + (x + 1);
      const c = (y + 1) * gridW + x;
      const d = (y + 1) * gridW + (x + 1);

      // Check depth threshold to optionally clip deep backgrounds
      const depthA = depthArray[a];
      const depthB = depthArray[b];
      const depthC = depthArray[c];
      const depthD = depthArray[d];

      const minD = Math.min(depthA, depthB, depthC, depthD);
      if (minD >= depthThreshold) {
        // Triangle 1: a -> c -> b
        indices[indIdx++] = a;
        indices[indIdx++] = c;
        indices[indIdx++] = b;

        // Triangle 2: b -> c -> d
        indices[indIdx++] = b;
        indices[indIdx++] = c;
        indices[indIdx++] = d;
      }
    }
  }

  return {
    depthMapDataUrl: depthCanvas.toDataURL('image/png'),
    normalMapDataUrl: normalCanvas.toDataURL('image/png'),
    depthArray,
    width: gridW,
    height: gridH,
    positions,
    colors,
    normals,
    indices: indices.subarray(0, indIdx),
    pointCount: pointCounter,
  };
}
