import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createWorld, terrainInfo, coastX, PALETTE, DURATION, ANCHOR_X, ANCHOR_Z, SURF, MOUTH, TOWN, mulberry32 } from './world.js';

const container = document.getElementById('scene');
const labelLayer = document.getElementById('labels');
const loading = document.getElementById('loading');
const statsElement = document.getElementById('render-stats');
const params = new URLSearchParams(location.search);
const captureMode = params.has('t');
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.08;
container.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(PALETTE.sky);
scene.fog = new THREE.Fog(PALETTE.sky, 96, 205);
const camera = new THREE.PerspectiveCamera(innerWidth / innerHeight < 0.8 ? 66 : 38, innerWidth / innerHeight, 0.1, 520);
const overviewPosition = new THREE.Vector3(44, 49, 57);
const overviewTarget = new THREE.Vector3(0, 0.7, 0);
camera.position.copy(overviewPosition);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.copy(overviewTarget);
controls.enableDamping = true;
controls.dampingFactor = 0.075;
controls.minDistance = 8;
controls.maxDistance = 145;
controls.minPolarAngle = 0.02;
controls.maxPolarAngle = Math.PI * 0.46;
controls.enablePan = true;
controls.screenSpacePanning = false;

scene.add(new THREE.HemisphereLight(0xbfe7df, 0x263c32, 1.65));
const sun = new THREE.DirectionalLight(0xffe6bc, 3.1);
sun.position.set(-32, 48, 24);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.left = -36; sun.shadow.camera.right = 36;
sun.shadow.camera.top = 36; sun.shadow.camera.bottom = -36;
sun.shadow.camera.near = 1; sun.shadow.camera.far = 120;
sun.shadow.normalBias = 0.035;
scene.add(sun);
const fill = new THREE.DirectionalLight(0x6daac2, 0.72);
fill.position.set(28, 20, -35); scene.add(fill);
const bounce = new THREE.DirectionalLight(0x5f8b70, 0.24);
bounce.position.set(0, -12, 0); scene.add(bounce);

const world = createWorld(scene);
const sites = {
  anchor: {
    code: 'SITE 09 / HEADLAND', title: 'Synchronize Time Anchor', chip: 'ANCHORED',
    copy: 'Nine radial pylons lock a suspended crystal above the headland. Orbiting rings trace the anchor’s synchronized field.',
    position: `E ${ANCHOR_X.toFixed(1)} / S ${Math.abs(ANCHOR_Z).toFixed(1)} KM`,
    target: new THREE.Vector3(ANCHOR_X, world.anchor.groundY + 1.25, ANCHOR_Z),
    camera: new THREE.Vector3(ANCHOR_X + 8.5, world.anchor.groundY + 6.8, ANCHOR_Z + 10.5),
  },
  surf: {
    code: 'SITE 02 / OUTER REEF', title: 'Headland Surf Break', chip: 'SWELL ACTIVE',
    copy: 'Six staggered swell lines wrap across the shallow reef. Foam traces reveal the break’s relationship to the point.',
    position: `E ${SURF.x.toFixed(1)} / S ${Math.abs(SURF.z).toFixed(1)} KM`,
    target: new THREE.Vector3(SURF.x, 0.1, SURF.z), camera: new THREE.Vector3(SURF.x + 9, 8.5, SURF.z + 12),
  },
  mouth: {
    code: 'SITE 03 / ESTUARY', title: 'River Mouth', chip: 'TIDAL CHANNEL',
    copy: 'The western river widens into a tidal channel, passing a timber landing and three low sandbars before meeting the coast.',
    position: `E ${MOUTH.x.toFixed(1)} / S ${MOUTH.z.toFixed(1)} KM`,
    target: new THREE.Vector3(MOUTH.x - 0.5, 0.3, MOUTH.z), camera: new THREE.Vector3(MOUTH.x + 8, 9, MOUTH.z + 11),
  },
  town: {
    code: 'SITE 04 / RIVER WARD', title: 'Coastal Town', chip: 'SETTLEMENT',
    copy: 'Terracotta roofs cluster around a clock hall and river road, with forested hills rising beyond the western edge.',
    position: `W ${Math.abs(TOWN.x).toFixed(1)} / S ${TOWN.z.toFixed(1)} KM`,
    target: new THREE.Vector3(TOWN.x, 0.8, TOWN.z), camera: new THREE.Vector3(TOWN.x + 10, 11, TOWN.z + 13),
  },
};

const labelElements = new Map();
for (const [id, position] of Object.entries(world.labels)) {
  const button = document.createElement('button');
  button.className = `world-label${id === 'anchor' ? ' active' : ''}`;
  button.dataset.site = id;
  button.setAttribute('aria-label', `Focus ${sites[id].title}`);
  button.innerHTML = `<span class="label-box"><small>${id === 'anchor' ? '09' : id === 'surf' ? '02' : id === 'mouth' ? '03' : '04'}</small><strong>${id === 'anchor' ? 'TIME ANCHOR' : id === 'surf' ? 'SURF BREAK' : id === 'mouth' ? 'RIVER MOUTH' : 'COASTAL TOWN'}</strong></span><span class="label-stem"></span><span class="label-dot"></span>`;
  labelLayer.appendChild(button);
  labelElements.set(id, { button, position });
}

let selectedSite = 'anchor';
let flight = null;
let topDown = false;
let labelsVisible = true;
let narrating = false;
let beatPlaying = false;
let paused = reduceMotion;
let simT = 0;
let acc = 0;
let frameCount = 0;
let fps = 60;
let loopRunning = false;
const clock = new THREE.Clock();
const STEP = 1 / 60;
const projection = new THREE.Vector3();

function selectSite(id, moveCamera = true) {
  const site = sites[id];
  if (!site) return;
  selectedSite = id;
  document.getElementById('detail-code').textContent = site.code;
  document.getElementById('detail-title').textContent = site.title;
  document.getElementById('detail-copy').textContent = site.copy;
  document.getElementById('detail-position').textContent = site.position;
  document.querySelector('.live-chip').textContent = site.chip;
  document.querySelectorAll('[data-site]').forEach((el) => {
    const active = el.dataset.site === id;
    el.classList.toggle('active', active);
    if (el.classList.contains('site-button')) el.setAttribute('aria-pressed', String(active));
  });
  topDown = false;
  document.getElementById('top-button').setAttribute('aria-pressed', 'false');
  if (moveCamera && !captureMode) flyTo(site.camera, site.target);
}

function flyTo(position, target) {
  flight = {
    fromPosition: camera.position.clone(), fromTarget: controls.target.clone(),
    toPosition: position.clone(), toTarget: target.clone(), progress: 0,
  };
}

function updateFlight(dt) {
  if (!flight) return;
  flight.progress = Math.min(1, flight.progress + dt * 1.45);
  const t = 1 - Math.pow(1 - flight.progress, 3);
  camera.position.lerpVectors(flight.fromPosition, flight.toPosition, t);
  controls.target.lerpVectors(flight.fromTarget, flight.toTarget, t);
  if (flight.progress >= 1) flight = null;
}

function setPaused(value) {
  paused = value;
  const button = document.getElementById('play-button');
  button.setAttribute('aria-pressed', String(paused));
  document.getElementById('play-icon').textContent = paused ? '▷' : 'Ⅱ';
  document.getElementById('play-label').textContent = paused ? 'Resume field' : 'Pause field';
  statsElement.style.display = paused ? 'none' : '';
}

function updateLabels() {
  for (const { button, position } of labelElements.values()) {
    projection.copy(position).project(camera);
    const visible = labelsVisible && projection.z < 1 && projection.z > -1 && Math.abs(projection.x) < 1.08 && Math.abs(projection.y) < 1.08;
    button.style.display = visible ? '' : 'none';
    if (!visible) continue;
    const x = (projection.x * 0.5 + 0.5) * innerWidth;
    const y = (-projection.y * 0.5 + 0.5) * innerHeight;
    button.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translate(-50%, -100%)`;
  }
}

function draw() {
  controls.update();
  renderer.render(scene, camera);
  updateLabels();
  statsElement.style.display = paused ? 'none' : '';
}

function animate() {
  const dt = Math.min(clock.getDelta(), 0.08);
  if (dt > 0) fps = fps * 0.93 + (1 / dt) * 0.07;
  updateFlight(dt);
  if (!paused) {
    acc += dt;
    while (acc >= STEP) { acc -= STEP; simT = (simT + STEP) % DURATION; }
    world.sample(simT);
  }
  draw();
  frameCount++;
  if (frameCount % 30 === 0 && !paused) {
    statsElement.textContent = `${Math.round(fps)} FPS · ${renderer.info.render.calls} CALLS · ${Math.round(renderer.info.render.triangles / 1000)}K TRIS`;
  }
}

function startLoop() {
  if (loopRunning) return;
  loopRunning = true;
  clock.getDelta();
  renderer.setAnimationLoop(animate);
}

document.querySelectorAll('[data-site]').forEach((button) => {
  button.addEventListener('click', () => selectSite(button.dataset.site));
});
document.querySelectorAll('[data-layer]').forEach((button) => {
  button.addEventListener('click', () => {
    const visible = button.getAttribute('aria-pressed') !== 'true';
    button.setAttribute('aria-pressed', String(visible));
    const layer = button.dataset.layer;
    if (layer === 'labels') { labelsVisible = visible; updateLabels(); }
    if (layer === 'survey') world.survey.visible = visible;
    if (layer === 'field') world.anchor.field.visible = visible;
  });
});
document.getElementById('play-button').addEventListener('click', () => setPaused(!paused));
const narrationText = 'I\'m Kimitimi. I\'m Westside all hours. I believe in the fifty-four. And this is my picture.';
function setNarration(active) {
  narrating = active;
  if (beatPlaying) powerAudio.volume = active ? 0.18 : 0.72;
  document.getElementById('narration-caption').hidden = !active;
  document.getElementById('narration-button').setAttribute('aria-pressed', String(active));
  document.getElementById('narration-icon').textContent = active ? '■' : '▷';
  document.getElementById('narration-label').textContent = active ? 'Stop narration' : 'Play narration';
}
function stopNarration() {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  setNarration(false);
}
function toggleNarration() {
  if (narrating) { stopNarration(); return; }
  setNarration(true);
  document.querySelector('.statement-foot').textContent = 'DRAGON9 · 54 KM DIAMETER';
  if (!('speechSynthesis' in window)) {
    document.getElementById('narration-label').textContent = 'Close statement';
    document.querySelector('.statement-foot').textContent = 'VOICE UNAVAILABLE · READ STATEMENT';
    return;
  }
  window.speechSynthesis.cancel();
  const statement = new SpeechSynthesisUtterance(narrationText);
  const voices = window.speechSynthesis.getVoices();
  statement.voice = voices.find((voice) => /^en/.test(voice.lang) && /alex|daniel|fred|google us english/i.test(voice.name)) || voices.find((voice) => /^en/.test(voice.lang)) || null;
  statement.rate = 0.82;
  statement.pitch = 0.82;
  statement.volume = 0.92;
  statement.onend = () => setNarration(false);
  statement.onerror = () => {
    document.getElementById('narration-label').textContent = 'Close statement';
    document.querySelector('.statement-foot').textContent = 'VOICE UNAVAILABLE · READ STATEMENT';
  };
  window.speechSynthesis.speak(statement);
}
document.getElementById('narration-button').addEventListener('click', toggleNarration);
document.getElementById('narration-close').addEventListener('click', stopNarration);
addEventListener('pagehide', stopNarration);

// Original pre-rendered instrumental with broadly compatible MP3 playback and an Ogg fallback.
const powerAudio = document.getElementById('power-audio');
powerAudio.volume = 0.72;
async function startBeat() {
  try {
    powerAudio.currentTime = 0;
    powerAudio.volume = narrating ? 0.18 : 0.72;
    await powerAudio.play();
    beatPlaying = true;
    document.getElementById('beat-button').setAttribute('aria-pressed', 'true');
    document.getElementById('beat-label').textContent = 'Stop power beat';
    document.getElementById('beat-icon').textContent = '■';
    document.getElementById('beat-status').hidden = false;
  } catch {
    document.getElementById('beat-label').textContent = 'Audio unavailable';
  }
}
function stopBeat() {
  beatPlaying = false;
  powerAudio.pause();
  powerAudio.currentTime = 0;
  document.getElementById('beat-button').setAttribute('aria-pressed', 'false');
  document.getElementById('beat-label').textContent = 'Play power beat';
  document.getElementById('beat-icon').textContent = '♪';
  document.getElementById('beat-status').hidden = true;
}
function toggleBeat() { if (beatPlaying) stopBeat(); else startBeat(); }
document.getElementById('beat-button').addEventListener('click', toggleBeat);
addEventListener('pagehide', stopBeat);

document.getElementById('mobile-layers').addEventListener('click', () => {
  const panel = document.getElementById('layer-panel');
  const open = panel.classList.toggle('open');
  document.getElementById('mobile-layers').setAttribute('aria-expanded', String(open));
  document.querySelector('#mobile-layers span').textContent = open ? '−' : '＋';
});
document.getElementById('reset-button').addEventListener('click', () => {
  topDown = false;
  document.getElementById('top-button').setAttribute('aria-pressed', 'false');
  flyTo(overviewPosition, overviewTarget);
});
document.getElementById('top-button').addEventListener('click', () => {
  topDown = !topDown;
  document.getElementById('top-button').setAttribute('aria-pressed', String(topDown));
  flyTo(topDown ? new THREE.Vector3(0.01, 92, 0.01) : overviewPosition, overviewTarget);
});
controls.addEventListener('start', () => { flight = null; });
addEventListener('keydown', (event) => {
  if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
  const keys = { '1': 'anchor', '2': 'surf', '3': 'mouth', '4': 'town' };
  if (keys[event.key]) selectSite(keys[event.key]);
  if (event.key === '0') flyTo(overviewPosition, overviewTarget);
  if (event.key.toLowerCase() === 'n') toggleNarration();
  if (event.key.toLowerCase() === 'b') toggleBeat();
  if (event.code === 'Space') { event.preventDefault(); setPaused(!paused); }
});

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.fov = camera.aspect < 0.8 ? 66 : 38;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  draw();
});

async function placeLighthouse() {
  const placement = new THREE.Group();
  try {
    const assetModulePath = '/assets/lighthouse/asset.mjs';
    const module = await import(/* @vite-ignore */ assetModulePath);
    const root = await module.createAsset(THREE);
    const bounds = new THREE.Box3().setFromObject(root);
    const size = bounds.getSize(new THREE.Vector3());
    const scale = 2.35 / Math.max(size.y, 0.001);
    placement.scale.setScalar(scale);
    placement.add(root);
    const z = 11.5, x = coastX(z) - 0.55;
    placement.position.set(x, terrainInfo(x, z).height - bounds.min.y * scale + 0.02, z);
  } catch {
    const z = 11.5, x = coastX(z) - 0.55;
    const tower = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.42, 2.1, 12), new THREE.MeshStandardMaterial({ color: 0xe1d9bd, roughness: 0.75 }));
    tower.position.y = 1.05;
    const cap = new THREE.Mesh(new THREE.ConeGeometry(0.4, 0.45, 12), new THREE.MeshStandardMaterial({ color: 0xa44d3e, roughness: 0.7 }));
    cap.position.y = 2.3;
    placement.add(tower, cap);
    placement.position.set(x, terrainInfo(x, z).height, z);
  }
  placement.traverse((object) => {
    if (object.isMesh) { object.castShadow = true; object.receiveShadow = true; }
  });
  scene.add(placement);
}

window.__seek = (time) => {
  const value = Number(time);
  setPaused(true);
  acc = 0;
  simT = Number.isFinite(value) && value > 0 ? ((value % DURATION) + DURATION) % DURATION : 0;
  world.sample(simT);
  draw();
};
window.__play = () => { setPaused(false); startLoop(); };
window.__getStats = () => ({
  fps: Math.round(fps), drawCalls: renderer.info.render.calls, triangles: renderer.info.render.triangles,
  buildings: world.stats.buildings, trees: world.stats.trees, radiusKm: world.stats.radius,
  selectedSite, topDown, paused, labelsVisible, narrating, beatPlaying, audioState: powerAudio.paused ? 'paused' : 'playing', audioTime: powerAudio.currentTime || 0, audioDuration: powerAudio.duration || 0,
});

await placeLighthouse();
world.sample(0);
setPaused(reduceMotion || captureMode);
draw();
loading.classList.add('ready');
if (captureMode) window.__seek(params.get('t'));
else startLoop();
window.__SCENE_READY__ = true;
