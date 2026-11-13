export interface UniformPreset {
  name: string;
  type: 'float' | 'vec2' | 'vec3' | 'vec4' | 'color';
  defaultValue: number[];
  min?: number;
  max?: number;
  description: string;
}

export interface ShaderPreset {
  id: string;
  title: string;
  description: string;
  category: 'Procedural' | 'Raymarching' | 'Deformation' | 'Post-Process';
  vertexShader: string;
  fragmentShader: string;
  uniforms: UniformPreset[];
  explanation: string;
}

export const SHADER_PRESETS: ShaderPreset[] = [
  {
    id: 'audio-sonic-ripple',
    title: 'Sonic Ripple Pulsar (Audio Reactive)',
    description: 'An immersive raymarched core that spikes, warps, and flashes in absolute sync with incoming sub-band audio frequencies (Bass, Mids, Treble).',
    category: 'Raymarching',
    vertexShader: `attribute vec3 a_position;
attribute vec3 a_normal;
attribute vec2 a_texcoord;

varying vec3 v_position;
varying vec3 v_normal;
varying vec2 v_texcoord;

void main() {
  v_position = a_position;
  v_normal = a_normal;
  v_texcoord = a_texcoord;
  gl_Position = vec4(a_position, 1.0);
}`,
    fragmentShader: `precision mediump float;

varying vec3 v_position;
varying vec3 v_normal;
varying vec2 v_texcoord;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

// Native Audio reactive sub-band scalar inputs
uniform float u_audioVolume;
uniform float u_bass;
uniform float u_mids;
uniform float u_treble;

// Custom Uniforms
uniform float u_warpIntensity;
uniform float u_coreSize;
uniform vec3 u_bassColor;
uniform vec3 u_trebleColor;

// 3D Rotation helper
mat3 rotateY(float rad) {
  float c = cos(rad);
  float s = sin(rad);
  return mat3(
    c, 0.0, -s,
    0.0, 1.0, 0.0,
    s, 0.0, c
  );
}

// Distance estimator
float map(vec3 p) {
  // Rotate core based on elapsed time + treble speed
  float rotSpeed = u_time * 0.4 + u_treble * 0.2;
  vec3 rp = rotateY(rotSpeed) * p;

  // Base sphere size + pulsing modulated by volume & mids
  float sphereSize = u_coreSize + u_audioVolume * 0.25;
  float d_sphere = length(rp) - sphereSize;
  
  // High-frequency spikes modulated by Bass energy
  float spikes = sin(rp.x * 6.0) * cos(rp.y * 6.0) * sin(rp.z * 6.0);
  float spikesFreq = 6.0 + u_bass * 4.0;
  float noise = sin(rp.x * spikesFreq) * cos(rp.y * spikesFreq) * sin(rp.z * spikesFreq);
  
  // Combine shape and audio-driven displacements
  return d_sphere + (noise * u_warpIntensity * (0.04 + u_bass * 0.15));
}

// Compute normal with central differences
vec3 getNormal(vec3 p) {
  vec2 eps = vec2(0.001, 0.0);
  return normalize(vec3(
    map(p + eps.xyy) - map(p - eps.xyy),
    map(p + eps.yxy) - map(p - eps.yxy),
    map(p + eps.yyx) - map(p - eps.yyx)
  ));
}

void main() {
  vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
  
  // Ray origin & Ray direction
  vec3 ro = vec3(0.0, 0.0, 2.5);
  vec3 rd = normalize(vec3(uv, -1.5));

  // Raymarching
  float t = 0.0;
  int hit = 0;
  for (int i = 0; i < 60; i++) {
    vec3 p = ro + rd * t;
    float d = map(p);
    if (d < 0.001) {
      hit = 1;
      break;
    }
    t += d;
    if (t > 8.0) break;
  }
  
  // Dark cyber-ambient background grid
  vec3 color = vec3(0.01, 0.015, 0.02) * (1.0 - length(uv) * 0.4);
  
  // Background starry pulse
  float stars = sin(uv.x * 40.0) * cos(uv.y * 40.0);
  color += vec3(0.02, 0.05, 0.08) * max(0.0, stars) * (0.1 + u_audioVolume * 1.5);

  if (hit == 1) {
    vec3 p = ro + rd * t;
    vec3 n = getNormal(p);
    vec3 v = normalize(ro - p);
    vec3 lightDir = normalize(vec3(3.0, 4.0, 2.5));
    
    // Specular Blinn-Phong highlights
    vec3 halfDir = normalize(lightDir + v);
    float diff = max(0.1, dot(n, lightDir));
    float spec = pow(max(0.0, dot(n, halfDir)), 64.0);
    
    // Dynamic color transition between bass/treble bands depending on normal inclination
    vec3 baseColor = mix(u_bassColor, u_trebleColor, n.y * 0.5 + 0.5);
    
    // Flash intensity governed by raw volume
    baseColor += vec3(1.0) * u_audioVolume * 0.4;

    color = baseColor * diff + vec3(1.0) * spec * (0.3 + u_bass * 0.8);
    
    // Cyber glowing outline (rim lighting/Fresnel effect)
    float fresnel = pow(1.0 - max(0.0, dot(n, v)), 3.0);
    color += u_trebleColor * fresnel * (0.5 + u_treble * 1.5);
  } else {
    // Halo glow wrapping the central pulsar
    float d_to_pulsar = length(uv);
    vec3 glowColor = mix(u_bassColor, u_trebleColor, sin(u_time * 0.5) * 0.5 + 0.5);
    color += glowColor * (0.05 / (d_to_pulsar - 0.4 + 0.001)) * (0.4 + u_bass * 1.2);
  }
  
  gl_FragColor = vec4(color, 1.0);
}`,
    uniforms: [
      { name: 'u_warpIntensity', type: 'float', defaultValue: [0.8], min: 0.0, max: 2.0, description: 'Scale multiplier of spikes displacement' },
      { name: 'u_coreSize', type: 'float', defaultValue: [0.65], min: 0.2, max: 1.2, description: 'Base radius of central sphere core' },
      { name: 'u_bassColor', type: 'color', defaultValue: [0.0, 0.6, 1.0], description: 'Low frequency spectrum hue (cyan)' },
      { name: 'u_trebleColor', type: 'color', defaultValue: [1.0, 0.0, 0.8], description: 'High frequency spectrum hue (pink)' },
    ],
    explanation: `### Sonic Ripple Pulsar Explained

This shader demonstrates complete **GPU-driven Audio Reactivity** using numeric sub-band scalar inputs.

1. **Procedural Pumping Size**: The central sphere's base coordinate system expands and shrinks in sync with the overall volume:
   $$\\text{size} = R_{\\text{base}} + (V_{\\text{volume}} \\cdot 0.25)$$
2. **Frequency Spike Warping**: We map 3D sine/cosine grids onto the raymarched surface. The density and displacement height of these waves are multiplied by the realtime \`u_bass\` uniform:
   $$\\text{displacement} = \\sin(x \\cdot f) \\cdot \\cos(y \\cdot f) \\cdot I_{\\text{warp}} \\cdot (0.04 + B_{\\text{bass}} \\cdot 0.15)$$
   This translates high-bass transients (like kick drums) into aggressive, organic protrusions on the mesh surface.
3. **Band-Splitting Interpolation**: Colors morph between a deep cyan and neon magenta depending on surface direction. Fresnel halo glows are mapped around borders, intensifying in direct proportion to the \`u_treble\` high-frequency bands.`
  },
  {
    id: 'raymarched-metaballs',
    title: 'Aether Metaballs (SDF Raymarching)',
    description: 'A pure screen-space fragment shader that raymarches three blending metaballs with specular phong lighting and ambient occlusion.',
    category: 'Raymarching',
    vertexShader: `attribute vec3 a_position;
attribute vec3 a_normal;
attribute vec2 a_texcoord;

varying vec3 v_position;
varying vec3 v_normal;
varying vec2 v_texcoord;

void main() {
  v_position = a_position;
  v_normal = a_normal;
  v_texcoord = a_texcoord;
  gl_Position = vec4(a_position, 1.0);
}`,
    fragmentShader: `precision mediump float;

varying vec3 v_position;
varying vec3 v_normal;
varying vec2 v_texcoord;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform vec3 u_cameraPosition;

// Custom Uniforms
uniform float u_speed;
uniform float u_glow;
uniform float u_blend;
uniform vec3 u_baseColor;
uniform vec3 u_accentColor;

// Polynomial smooth min for blending shapes
float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

// Distance estimator
float map(vec3 p) {
  float t = u_time * u_speed;
  
  // Create 3 orbiting spheres
  vec3 s1 = vec3(1.2 * sin(t), 0.8 * cos(t * 1.3), 0.5 * sin(t * 0.7));
  vec3 s2 = vec3(1.0 * cos(t * 0.9), 1.0 * sin(t * 1.5), 0.6 * cos(t));
  vec3 s3 = vec3(0.0, 0.5 * sin(t * 1.8), 1.2 * cos(t * 0.5));
  
  float d1 = length(p - s1) - 0.45;
  float d2 = length(p - s2) - 0.5;
  float d3 = length(p - s3) - 0.55;
  
  // Smoothly merge them together
  return smin(smin(d1, d2, u_blend), d3, u_blend);
}

// Estimate normal at position p using central differences
vec3 getNormal(vec3 p) {
  vec2 eps = vec2(0.001, 0.0);
  return normalize(vec3(
    map(p + eps.xyy) - map(p - eps.xyy),
    map(p + eps.yxy) - map(p - eps.yxy),
    map(p + eps.yyx) - map(p - eps.yyx)
  ));
}

void main() {
  // Normalize coordinates (-1 to 1)
  vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
  
  // Set ray origin and ray direction
  vec3 ro = vec3(0.0, 0.0, 3.5);
  vec3 rd = normalize(vec3(uv, -1.5));
  
  // Mouse interaction
  vec2 m = u_mouse * 2.0 - 1.0;
  ro.xz += m * 1.5;
  rd.xz += m * 0.5;
  rd = normalize(rd);

  // Raymarching loop
  float d = 0.0;
  float t = 0.0;
  float max_t = 10.0;
  int hit = 0;
  
  for (int i = 0; i < 80; i++) {
    vec3 p = ro + rd * t;
    d = map(p);
    if (d < 0.001) {
      hit = 1;
      break;
    }
    t += d;
    if (t > max_t) break;
  }
  
  vec3 color = vec3(0.03, 0.04, 0.08); // Background dark blue
  
  if (hit == 1) {
    vec3 p = ro + rd * t;
    vec3 n = getNormal(p);
    
    // Ambient occlusion estimate
    float ao = 1.0;
    
    // Lighting
    vec3 lightPos = vec3(4.0, 5.0, 3.0);
    vec3 l = normalize(lightPos - p);
    vec3 v = normalize(ro - p);
    vec3 r = reflect(-l, n);
    
    float diff = max(0.1, dot(n, l));
    float spec = pow(max(0.0, dot(v, r)), 32.0);
    
    // Procedural color mix based on height & normals
    vec3 base = mix(u_baseColor, u_accentColor, n.y * 0.5 + 0.5);
    
    // Add specular phong highlights
    color = base * diff + vec3(1.0) * spec * 0.6;
    
    // Simple fresnel effect
    float fresnel = pow(1.0 - max(0.0, dot(n, v)), 4.0);
    color += u_accentColor * fresnel * u_glow;
  } else {
    // Background generative nebula/glow
    float d_to_center = length(uv);
    color += u_baseColor * (0.15 / (d_to_center + 0.5)) * 0.5;
  }
  
  gl_FragColor = vec4(color, 1.0);
}`,
    uniforms: [
      { name: 'u_speed', type: 'float', defaultValue: [1.2], min: 0.1, max: 4.0, description: 'Speed of metaball orbits' },
      { name: 'u_glow', type: 'float', defaultValue: [0.8], min: 0.0, max: 2.0, description: 'Edge glow intensity' },
      { name: 'u_blend', type: 'float', defaultValue: [0.35], min: 0.1, max: 1.0, description: 'Smoothness of blend' },
      { name: 'u_baseColor', type: 'color', defaultValue: [0.0, 0.8, 1.0], description: 'Primary blob color' },
      { name: 'u_accentColor', type: 'color', defaultValue: [0.8, 0.0, 1.0], description: 'Glow/edge accent color' },
    ],
    explanation: `### Raymarched Metaballs Explained

This shader utilizes **SDF (Signed Distance Fields)** and **Raymarching** to render smoothly blending 3D shapes on a 2D screen coordinate.

1. **Signed Distance Estimation**: The \`map\` function evaluates the distance from any 3D coordinate \`p\` to three distinct orbiting spheres.
2. **Smooth Minimum blending**: Rather than a standard union (\`min(a, b)\`), it uses a polynomial smooth minimum (\`smin\`) formula:
   $$\\text{smin}(a, b, k) = \\text{mix}(b, a, h) - k \\cdot h \\cdot (1 - h)$$
   This creates an organic "organic cell blending" or "metaball" effect where spheres merge seamlessly as they get closer.
3. **Lighting & Normals**: Since we do not have static meshes, vertex normals are computed dynamically on the fly using a numerical gradient approach (central differences) on the SDF values.
4. **Phong Shading Model**: Classic specular highlights, diffuse reflection, and a gorgeous customized Fresnel rim lighting are added using the camera viewpoint and normal vectors.`
  },
  {
    id: 'retro-grid-vaporwave',
    title: 'Neon Horizon Grid (Vaporwave Synth)',
    description: 'An interactive 3D grid bending toward a digital horizon, animated by sine waves, neon glow, and high-contrast lines.',
    category: 'Procedural',
    vertexShader: `attribute vec3 a_position;
attribute vec3 a_normal;
attribute vec2 a_texcoord;

varying vec3 v_position;
varying vec3 v_normal;
varying vec2 v_texcoord;

uniform mat4 u_modelMatrix;
uniform mat4 u_viewMatrix;
uniform mat4 u_projectionMatrix;

void main() {
  v_position = a_position;
  v_normal = a_normal;
  v_texcoord = a_texcoord;
  gl_Position = u_projectionMatrix * u_viewMatrix * u_modelMatrix * vec4(a_position, 1.0);
}`,
    fragmentShader: `precision mediump float;

varying vec3 v_position;
varying vec3 v_normal;
varying vec2 v_texcoord;

uniform float u_time;
uniform vec2 u_resolution;

// Custom Uniforms
uniform float u_gridDensity;
uniform float u_scrollSpeed;
uniform float u_lineWidth;
uniform vec3 u_gridColor;
uniform vec3 u_horizonColor;

void main() {
  // Translate grid coordinates by time to create endless motion
  vec2 uv = v_texcoord;
  uv.y -= u_time * u_scrollSpeed;
  
  // Calculate grid lines using sine function for smooth, anti-aliased appearance
  vec2 gridUV = fract(uv * u_gridDensity);
  
  // Center values
  vec2 distToLine = abs(gridUV - 0.5);
  
  // Width threshold
  float w = u_lineWidth * 0.1;
  float lineX = smoothstep(0.5 - w, 0.5, distToLine.x);
  float lineY = smoothstep(0.5 - w, 0.5, distToLine.y);
  
  // Combine grid dimensions
  float grid = max(lineX, lineY);
  
  // Background gradient representing a neon sunset
  vec3 bg = mix(u_horizonColor * 0.1, vec3(0.02, 0.0, 0.05), v_texcoord.y);
  
  // Glow along the horizon (V-coordinate is 0 to 1)
  float horizonGlow = pow(v_texcoord.y, 4.0);
  bg += u_horizonColor * horizonGlow * 0.6;
  
  // Neon grid color with fading grid density on distant edges
  vec3 neonGrid = u_gridColor * grid * (1.0 - v_texcoord.y * 0.7);
  
  // Final composite
  vec3 color = bg + neonGrid;
  
  gl_FragColor = vec4(color, 1.0);
}`,
    uniforms: [
      { name: 'u_gridDensity', type: 'float', defaultValue: [20.0], min: 5.0, max: 60.0, description: 'Density of the grid lines' },
      { name: 'u_scrollSpeed', type: 'float', defaultValue: [0.15], min: 0.01, max: 1.0, description: 'Speed of horizontal scrolling' },
      { name: 'u_lineWidth', type: 'float', defaultValue: [0.12], min: 0.02, max: 0.5, description: 'Width of neon line boundaries' },
      { name: 'u_gridColor', type: 'color', defaultValue: [0.0, 1.0, 0.8], description: 'Color of neon grid' },
      { name: 'u_horizonColor', type: 'color', defaultValue: [1.0, 0.0, 0.6], description: 'Horizon sunset hue' },
    ],
    explanation: `### Neon Horizon Grid Explained

This shader builds a classic retro-synthwave neon grid scrolling infinitely into the distance.

1. **Texture Coordinates Distortion**: The scrolling effect is achieved by translating the Y coordinate of the mesh's UV coordinates (\`v_texcoord.y\`) over elapsed time:
   $$v_y = v_{\\text{original}} - (t \\cdot \\text{scrollSpeed})$$
2. **Procedural Grid Formula**: Using the \`fract\` function, we create repeating segments. To render sharp, beautiful grid lines without aliasing, we employ the \`smoothstep\` function over the absolute distance to the grid tile edges.
3. **Horizon Atmospheric Glow**: We mix two deep colors and fade out the grid lines as they approach the horizon using a power function of the V-texture coordinate, giving a stunning pseudo-3D perspective atmospheric haze.`
  },
  {
    id: 'ocean-wave-displacement',
    title: 'Procedural Ocean (Vertex Displacement)',
    description: 'An outstanding 3D water mesh with dynamic vertex displacement waves, specular light sparkles, and real-time wave controls.',
    category: 'Deformation',
    vertexShader: `attribute vec3 a_position;
attribute vec3 a_normal;
attribute vec2 a_texcoord;

varying vec3 v_position;
varying vec3 v_normal;
varying vec2 v_texcoord;

uniform mat4 u_modelMatrix;
uniform mat4 u_viewMatrix;
uniform mat4 u_projectionMatrix;
uniform float u_time;

// Custom wave uniforms
uniform float u_waveHeight;
uniform float u_waveFreq;
uniform float u_waveSpeed;

void main() {
  v_texcoord = a_texcoord;
  
  // Calculate dynamic wave displacement using multiple sin/cos octaves
  vec3 pos = a_position;
  float t = u_time * u_waveSpeed;
  
  float wave1 = sin(pos.x * u_waveFreq + t) * cos(pos.y * u_waveFreq * 0.8 + t * 1.2);
  float wave2 = cos(pos.x * u_waveFreq * 2.1 - t * 0.8) * sin(pos.y * u_waveFreq * 1.5 + t * 0.9) * 0.4;
  
  // Apply displacement on Z (height) axis
  pos.z += (wave1 + wave2) * u_waveHeight;
  
  // Approximate normal displacement
  vec3 displacedNormal = a_normal;
  displacedNormal.x -= cos(pos.x * u_waveFreq + t) * u_waveHeight * u_waveFreq;
  displacedNormal.y -= sin(pos.y * u_waveFreq * 0.8 + t * 1.2) * u_waveHeight * u_waveFreq * 0.8;
  v_normal = normalize(displacedNormal);
  
  v_position = pos;
  gl_Position = u_projectionMatrix * u_viewMatrix * u_modelMatrix * vec4(pos, 1.0);
}`,
    fragmentShader: `precision mediump float;

varying vec3 v_position;
varying vec3 v_normal;
varying vec2 v_texcoord;

uniform float u_time;
uniform vec3 u_cameraPosition;

// Custom Uniforms
uniform vec3 u_waterColor;
uniform vec3 u_foamColor;
uniform float u_specularGlints;

void main() {
  vec3 n = normalize(v_normal);
  vec3 cameraDir = normalize(u_cameraPosition - v_position);
  
  // Direct overhead solar light
  vec3 sunDir = normalize(vec3(0.5, 0.5, 1.0));
  
  // Specular Reflection (Specular highlights)
  vec3 halfDir = normalize(sunDir + cameraDir);
  float spec = pow(max(0.0, dot(n, halfDir)), 128.0);
  
  // Diffuse coloring based on normal inclination (waves highlights)
  float angle = max(0.2, dot(n, sunDir));
  
  // Deep water vs shallow water colors based on height (v_position.z)
  vec3 baseWater = mix(u_waterColor * 0.3, u_waterColor, angle);
  
  // Add dynamic foam at the crest of the waves (high Z value)
  float waveCrest = smoothstep(0.1, 0.4, v_position.z);
  vec3 finalColor = mix(baseWater, u_foamColor, waveCrest * 0.3);
  
  // Add direct sun glitter reflection
  finalColor += vec3(1.0) * spec * u_specularGlints;
  
  // Subtle fresnel reflection (reflect more at extreme angles)
  float fresnel = pow(1.0 - max(0.0, dot(n, cameraDir)), 5.0);
  finalColor += vec3(0.7, 0.9, 1.0) * fresnel * 0.4;
  
  gl_FragColor = vec4(finalColor, 1.0);
}`,
    uniforms: [
      { name: 'u_waveHeight', type: 'float', defaultValue: [0.18], min: 0.02, max: 0.8, description: 'Peak amplitude of ocean waves' },
      { name: 'u_waveFreq', type: 'float', defaultValue: [4.0], min: 1.0, max: 12.0, description: 'Spatial frequency of waves' },
      { name: 'u_waveSpeed', type: 'float', defaultValue: [1.8], min: 0.1, max: 5.0, description: 'Temporal wave simulation speed' },
      { name: 'u_waterColor', type: 'color', defaultValue: [0.0, 0.3, 0.65], description: 'Water body base hue' },
      { name: 'u_foamColor', type: 'color', defaultValue: [0.85, 0.98, 1.0], description: 'Crest foam highlight' },
      { name: 'u_specularGlints', type: 'float', defaultValue: [1.5], min: 0.0, max: 5.0, description: 'Sun glint reflection intensity' },
    ],
    explanation: `### Procedural Ocean Wave Displacement Explained

This preset showcases **Vertex Displacement Shading**, where math calculations alter the actual physical mesh geometry in the vertex stage rather than just painting pixels.

1. **Vertex Displacement Math**: We sample nested sine/cos wave equations inside the vertex shader:
   $$z_{\\text{disp}} = A \\cdot \\sin(x \\cdot f + t \\cdot s) \\cdot \\cos(y \\cdot f \\cdot 0.8 + t \\cdot 1.2 \\cdot s)$$
   By adding these wave octaves, we create complex, realistic fluid movements.
2. **Dynamic Normal Distortion**: Since the vertices move, the flat normals must be recalculated dynamically. We compute derivatives of the wave equation to update normal slopes, keeping the lighting synchronized with crests and troughs.
3. **High Specular Glints**: We use the Blinn-Phong lighting algorithm to simulate the blinding specular reflection of sunlight on water. A very high exponent (\`128.0\`) keeps highlights razor-sharp.`
  },
  {
    id: 'crt-glitch-effects',
    title: 'Cyberpunk CRT Scanline (Post-Process)',
    description: 'A classic CRT screen filter with scrolling scanlines, chromatic aberration (RGB color split), grid curvature, and glitching noise.',
    category: 'Post-Process',
    vertexShader: `attribute vec3 a_position;
attribute vec3 a_normal;
attribute vec2 a_texcoord;

varying vec2 v_texcoord;

void main() {
  v_texcoord = a_texcoord;
  gl_Position = vec4(a_position, 1.0);
}`,
    fragmentShader: `precision mediump float;

varying vec2 v_texcoord;

uniform float u_time;
uniform vec2 u_resolution;

// Custom Uniforms
uniform float u_distortion;
uniform float u_scanlineIntensity;
uniform float u_rgbSplit;
uniform float u_noiseIntensity;

// Simple pseudo-random generator
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

// Spherical lens distortion
vec2 curve(vec2 uv) {
  uv = (uv - 0.5) * 2.0;
  uv *= 1.1; // zoom out slightly to fit screen
  uv.x *= 1.0 + pow((abs(uv.y) * u_distortion), 2.0);
  uv.y *= 1.0 + pow((abs(uv.x) * u_distortion), 2.0);
  uv  = (uv / 2.0) + 0.5;
  return uv;
}

void main() {
  // Apply curvature
  vec2 uv = curve(v_texcoord);
  
  // Clamp boundaries for classic black screen frame
  if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    return;
  }
  
  // Chromatic Aberration: sample R, G, B channels at slight spatial offsets
  float split = u_rgbSplit * 0.015;
  float rVal = fract(sin(u_time * 2.0) * 10.0) > 0.98 ? sin(u_time * 100.0)*split : split; // Random jitter glitch
  
  float r = sin(uv.y * 3.0 + u_time) * 0.5 + 0.5; // Base color grid generator
  float g = cos(uv.x * 2.5 - u_time * 1.5) * 0.5 + 0.5;
  float b = sin((uv.x + uv.y) * 4.0) * 0.5 + 0.5;
  
  // Apply RGB offset
  vec3 finalColor;
  finalColor.r = sin((uv.y + rVal) * 3.0 + u_time) * 0.5 + 0.5;
  finalColor.g = cos(uv.x * 2.5 - u_time * 1.5) * 0.5 + 0.5;
  finalColor.b = sin((uv.x - rVal + uv.y) * 4.0) * 0.5 + 0.5;
  
  // Apply scrolling horizontal scanlines
  float scanline = sin(uv.y * u_resolution.y * 1.5 + u_time * 8.0);
  scanline = mix(1.0, (scanline * 0.5 + 0.5), u_scanlineIntensity * 0.4);
  finalColor *= scanline;
  
  // Add fine-grain TV static noise
  float grain = hash(uv + u_time) * u_noiseIntensity;
  finalColor += vec3(grain * 0.15);
  
  // Vignette effect (shadows at edges)
  float vignette = uv.x * uv.y * (1.0 - uv.x) * (1.0 - uv.y);
  vignette = clamp(pow(16.0 * vignette, 0.4), 0.0, 1.0);
  finalColor *= vignette;
  
  gl_FragColor = vec4(finalColor, 1.0);
}`,
    uniforms: [
      { name: 'u_distortion', type: 'float', defaultValue: [0.15], min: 0.0, max: 0.5, description: 'Cathode barrel curvature' },
      { name: 'u_scanlineIntensity', type: 'float', defaultValue: [0.7], min: 0.0, max: 1.0, description: 'Darkness of scanlines' },
      { name: 'u_rgbSplit', type: 'float', defaultValue: [0.5], min: 0.0, max: 2.0, description: 'RGB color channel displacement' },
      { name: 'u_noiseIntensity', type: 'float', defaultValue: [0.3], min: 0.0, max: 1.0, description: 'TV static grain level' },
    ],
    explanation: `### Cyberpunk CRT Scanline Explained

This post-processing shader morphs standard screen textures and coordinates to replicate a vintage analog cathode-ray tube screen.

1. **Cathode Barrel Curvature**: The \`curve\` function bends the screen-space UV coordinates toward a sphere. By scaling coords proportionally to their perpendicular distance squared, we get a retro "fish-eye lens" monitor look.
2. **Chromatic Aberration (RGB Color Split)**: Samples the color channels with offsets on the X-axis (\`uv.x + split\` for red, \`uv.x - split\` for blue). We simulate physical alignment errors in legacy phosphor beam grids.
3. **Scrolling Scanlines**: Uses a sine wave matching screen vertical frequency (\`u_resolution.y\`) and shifts it over time to generate rolling analog lines.
4. **Vignette & Grain**: A mathematical vignette multiplies the colors by distance to borders, dimming the edges. Random hash static simulates electrical thermal noise.`
  }
];
