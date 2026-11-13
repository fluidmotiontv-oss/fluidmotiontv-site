/**
 * Procedural noise and texture generators for AetherGL Studio
 * Generates canvases that can be loaded into WebGL as textures.
 */

export function generateWhiteNoise(width = 256, height = 256): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  const imgData = ctx.createImageData(width, height);
  const data = imgData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    const val = Math.floor(Math.random() * 256);
    data[i] = val;     // R
    data[i+1] = val;   // G
    data[i+2] = val;   // B
    data[i+3] = 255;   // A
  }
  
  ctx.putImageData(imgData, 0, 0);
  return canvas;
}

// Simple fractal/value noise generator
export function generatePerlinNoise(width = 256, height = 256): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  const imgData = ctx.createImageData(width, height);
  const data = imgData.data;

  // Simple cosine gradient noise approximation
  const numOctaves = 4;
  const persistence = 0.5;

  const noise = (x: number, y: number) => {
    // Standard pseudo-random hashing
    const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453123;
    return n - Math.floor(n);
  };

  const interpolate = (a: number, b: number, t: number) => {
    const ft = t * Math.PI;
    const f = (1 - Math.cos(ft)) * 0.5;
    return a * (1 - f) + b * f;
  };

  const smoothNoise = (x: number, y: number) => {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const xf = x - xi;
    const yf = y - yi;

    const v1 = noise(xi, yi);
    const v2 = noise(xi + 1, yi);
    const v3 = noise(xi, yi + 1);
    const v4 = noise(xi + 1, yi + 1);

    const i1 = interpolate(v1, v2, xf);
    const i2 = interpolate(v3, v4, xf);

    return interpolate(i1, i2, yf);
  };

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let total = 0;
      let frequency = 0.02;
      let amplitude = 1.0;
      let maxValue = 0;

      for (let o = 0; o < numOctaves; o++) {
        total += smoothNoise(x * frequency, y * frequency) * amplitude;
        maxValue += amplitude;
        amplitude *= persistence;
        frequency *= 2;
      }

      const val = Math.floor((total / maxValue) * 255);
      const idx = (y * width + x) * 4;
      data[idx] = val;
      data[idx+1] = val;
      data[idx+2] = val;
      data[idx+3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);
  return canvas;
}

export function generateCellularNoise(width = 256, height = 256, numPoints = 25): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  const points: { x: number; y: number }[] = [];
  for (let i = 0; i < numPoints; i++) {
    points.push({
      x: Math.random() * width,
      y: Math.random() * height,
    });
  }

  const imgData = ctx.createImageData(width, height);
  const data = imgData.data;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Find distance to closest and second-closest point
      let d1 = Infinity;
      let d2 = Infinity;

      for (const p of points) {
        // Toroidal repeat approximation for seamlessness (wrap edges)
        for (let dx = -1; dx <= 1; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            const px = p.x + dx * width;
            const py = p.y + dy * height;
            const d = Math.hypot(x - px, y - py);
            if (d < d1) {
              d2 = d1;
              d1 = d;
            } else if (d < d2) {
              d2 = d;
            }
          }
        }
      }

      // F2 - F1 style Voronoi border pattern
      const val = Math.max(0, Math.min(255, Math.floor((d2 - d1) * 3)));
      const idx = (y * width + x) * 4;
      data[idx] = val;
      data[idx+1] = val;
      data[idx+2] = val;
      data[idx+3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);
  return canvas;
}

export function generateGradientMap(
  color1 = '#ff0055',
  color2 = '#00ffcc',
  width = 256,
  height = 256
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, color1);
  grad.addColorStop(0.5, '#7a00ff');
  grad.addColorStop(1, color2);

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);
  return canvas;
}
