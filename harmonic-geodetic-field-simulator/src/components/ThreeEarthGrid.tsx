/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { GEODETIC_NODES } from '../math/cathiePhysics';
import { GeodeticNode } from '../types/harmonics';

interface ThreeEarthGridProps {
  selectedNode: GeodeticNode | null;
  onSelectNode: (node: GeodeticNode) => void;
  showCuboctahedron: boolean;
  showIcosahedron: boolean;
  showGreatCircles: boolean;
  showStandingWaves: boolean;
  activeLatticeColor: string;
}

// Pre-allocated math objects to avoid garbage collection inside render loop
const _tempVecA = new THREE.Vector3();
const _tempVecB = new THREE.Vector3();
const _mouseCoord = new THREE.Vector2();

export const ThreeEarthGrid: React.FC<ThreeEarthGridProps> = ({
  selectedNode,
  onSelectNode,
  showCuboctahedron,
  showIcosahedron,
  showGreatCircles,
  showStandingWaves,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hoveredNode, setHoveredNode] = useState<GeodeticNode | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL renderer safely
    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    // Scene & Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x05070d);
    scene.fog = new THREE.FogExp2(0x05070d, 0.05);

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 3.8);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // PMREM Environment map
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();

    // Studio Lighting Rig
    const ambientLight = new THREE.HemisphereLight(0x38bdf8, 0x0f172a, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
    keyLight.position.set(5, 8, 4);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x06b6d4, 1.8);
    rimLight.position.set(-6, -4, -4);
    scene.add(rimLight);

    // Main World Group (Holds Globe + Polyhedra + Nodes)
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // 1. Procedural High-Contrast Earth Texture
    const createEarthTexture = (): THREE.CanvasTexture => {
      const c = document.createElement('canvas');
      c.width = 1024;
      c.height = 512;
      const ctx = c.getContext('2d')!;

      // Deep space oceans
      ctx.fillStyle = '#0a101d';
      ctx.fillRect(0, 0, c.width, c.height);

      // Procedural continents & land masses
      ctx.fillStyle = '#1e293b';
      // Simplified continent shapes for geometric representation
      // North America
      ctx.beginPath();
      ctx.ellipse(280, 150, 90, 60, -0.3, 0, Math.PI * 2);
      ctx.fill();
      // South America
      ctx.beginPath();
      ctx.ellipse(360, 330, 50, 90, 0.2, 0, Math.PI * 2);
      ctx.fill();
      // Eurasia & Africa
      ctx.beginPath();
      ctx.ellipse(580, 160, 140, 70, 0.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(560, 290, 70, 100, 0, 0, Math.PI * 2);
      ctx.fill();
      // Australia & New Zealand (Bruce Cathie base)
      ctx.beginPath();
      ctx.ellipse(830, 340, 55, 45, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(910, 380, 20, 35, 0.3, 0, Math.PI * 2);
      ctx.fill();

      // Subtle Geodetic Grid Lat/Lon Lines (21,600 arc-minute division)
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)';
      ctx.lineWidth = 1;
      // Parallels every 15 degrees (900 arc-minutes)
      for (let lat = 0; lat <= 180; lat += 15) {
        const y = (lat / 180) * c.height;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(c.width, y);
        ctx.stroke();
      }
      // Meridians every 15 degrees
      for (let lon = 0; lon <= 360; lon += 15) {
        const x = (lon / 360) * c.width;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, c.height);
        ctx.stroke();
      }

      // Equator & Prime Meridian highlighted
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, c.height / 2);
      ctx.lineTo(c.width, c.height / 2);
      ctx.stroke();

      const tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
      return tex;
    };

    const earthTexture = createEarthTexture();

    // Central Earth Core Sphere
    const earthRadius = 1.0;
    const earthGeo = new THREE.SphereGeometry(earthRadius, 64, 64);
    const earthMat = new THREE.MeshStandardMaterial({
      map: earthTexture,
      roughness: 0.65,
      metalness: 0.25,
      bumpScale: 0.02,
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    globeGroup.add(earthMesh);

    // Glowing Atmosphere Scrim
    const atmosGeo = new THREE.SphereGeometry(earthRadius * 1.025, 48, 48);
    const atmosMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      transparent: true,
      opacity: 0.18,
      roughness: 0.9,
      metalness: 0.1,
      side: THREE.BackSide,
      depthWrite: false,
    });
    const atmosMesh = new THREE.Mesh(atmosGeo, atmosMat);
    globeGroup.add(atmosMesh);

    // 2. Geodetic Polyhedral Matrix 1: Cuboctahedron (Vector Equilibrium)
    // 12 vertices at combinations of (+-1, +-1, 0) normalized to sphere radius
    const cuboctaGroup = new THREE.Group();
    globeGroup.add(cuboctaGroup);

    const cuboctaRadius = earthRadius * 1.06;
    const cuboctaVerts: THREE.Vector3[] = [];
    const signs = [-1, 1];
    for (const s1 of signs) {
      for (const s2 of signs) {
        cuboctaVerts.push(new THREE.Vector3(s1, s2, 0).normalize().multiplyScalar(cuboctaRadius));
        cuboctaVerts.push(new THREE.Vector3(s1, 0, s2).normalize().multiplyScalar(cuboctaRadius));
        cuboctaVerts.push(new THREE.Vector3(0, s1, s2).normalize().multiplyScalar(cuboctaRadius));
      }
    }

    // Cuboctahedron wireframe edges: connect pairs with distance == cuboctaRadius * sqrt(2)
    const cuboctaEdgePositions: number[] = [];
    for (let i = 0; i < cuboctaVerts.length; i++) {
      for (let j = i + 1; j < cuboctaVerts.length; j++) {
        const dist = cuboctaVerts[i].distanceTo(cuboctaVerts[j]);
        if (Math.abs(dist - cuboctaRadius) < 0.25) {
          cuboctaEdgePositions.push(
            cuboctaVerts[i].x, cuboctaVerts[i].y, cuboctaVerts[i].z,
            cuboctaVerts[j].x, cuboctaVerts[j].y, cuboctaVerts[j].z
          );
        }
      }
    }
    const cuboctaLinesGeo = new THREE.BufferGeometry();
    cuboctaLinesGeo.setAttribute('position', new THREE.Float32BufferAttribute(cuboctaEdgePositions, 3));
    const cuboctaLinesMat = new THREE.LineBasicMaterial({
      color: 0x06b6d4, // Cyan
      transparent: true,
      opacity: 0.75,
      linewidth: 2,
    });
    const cuboctaLineMesh = new THREE.LineSegments(cuboctaLinesGeo, cuboctaLinesMat);
    cuboctaGroup.add(cuboctaLineMesh);

    // 3. Geodetic Polyhedral Matrix 2: Icosahedron / Geodesic Dual Matrix
    const icosaGroup = new THREE.Group();
    globeGroup.add(icosaGroup);

    const icosaRadius = earthRadius * 1.08;
    const icosaGeo = new THREE.IcosahedronGeometry(icosaRadius, 1);
    const icosaWireframe = new THREE.WireframeGeometry(icosaGeo);
    const icosaLinesMat = new THREE.LineBasicMaterial({
      color: 0xf59e0b, // Amber
      transparent: true,
      opacity: 0.45,
    });
    const icosaMesh = new THREE.LineSegments(icosaWireframe, icosaLinesMat);
    icosaGroup.add(icosaMesh);

    // 4. 21,600 Arc-Minute Great Circles
    const greatCirclesGroup = new THREE.Group();
    globeGroup.add(greatCirclesGroup);

    const createGreatCircle = (normal: THREE.Vector3, colorHex: number, radiusMultiplier: number) => {
      const circlePoints: THREE.Vector3[] = [];
      const segments = 128;
      const r = earthRadius * radiusMultiplier;
      const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal.normalize());
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        const pt = new THREE.Vector3(Math.cos(theta) * r, 0, Math.sin(theta) * r);
        pt.applyQuaternion(quaternion);
        circlePoints.push(pt);
      }
      const geo = new THREE.BufferGeometry().setFromPoints(circlePoints);
      const mat = new THREE.LineBasicMaterial({ color: colorHex, transparent: true, opacity: 0.65 });
      return new THREE.Line(geo, mat);
    };

    // Equatorial Ring
    greatCirclesGroup.add(createGreatCircle(new THREE.Vector3(0, 1, 0), 0x38bdf8, 1.03));
    // Prime Meridian & 90 deg Meridian
    greatCirclesGroup.add(createGreatCircle(new THREE.Vector3(1, 0, 0), 0x38bdf8, 1.031));
    greatCirclesGroup.add(createGreatCircle(new THREE.Vector3(0, 0, 1), 0x38bdf8, 1.032));
    // Diagonal Cathie Flight Harmonic Circles (aligned at ~51.84 degrees and ~31.7 degrees)
    greatCirclesGroup.add(createGreatCircle(new THREE.Vector3(1, 1, 1).normalize(), 0x10b981, 1.033));
    greatCirclesGroup.add(createGreatCircle(new THREE.Vector3(-1, 1, 1).normalize(), 0x10b981, 1.034));

    // 5. Cathie Geodetic Nodes (Interactive Beacons)
    const nodesGroup = new THREE.Group();
    globeGroup.add(nodesGroup);

    const latLonToVector3 = (lat: number, lon: number, radius: number): THREE.Vector3 => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      const x = -(radius * Math.sin(phi) * Math.cos(theta));
      const z = radius * Math.sin(phi) * Math.sin(theta);
      const y = radius * Math.cos(phi);
      return new THREE.Vector3(x, y, z);
    };

    const nodeMeshes: { mesh: THREE.Mesh; node: GeodeticNode }[] = [];
    const nodeBeaconGeo = new THREE.SphereGeometry(0.024, 16, 16);

    GEODETIC_NODES.forEach((node) => {
      const pos = latLonToVector3(node.latitude, node.longitude, earthRadius * 1.05);
      const nodeColor = node.polyhedronType === 'harmonic_nexus' ? 0x06b6d4 :
                         node.polyhedronType === 'cuboctahedron' ? 0x38bdf8 :
                         node.polyhedronType === 'icosahedron' ? 0xf59e0b : 0x10b981;

      const nodeMat = new THREE.MeshStandardMaterial({
        color: nodeColor,
        emissive: nodeColor,
        emissiveIntensity: 0.8,
        roughness: 0.2,
        metalness: 0.9,
      });

      const mesh = new THREE.Mesh(nodeBeaconGeo, nodeMat);
      mesh.position.copy(pos);
      mesh.userData = { node };

      // Surrounding orbital ring
      const ringGeo = new THREE.RingGeometry(0.035, 0.042, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: nodeColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.lookAt(pos.clone().multiplyScalar(2));
      mesh.add(ringMesh);

      nodesGroup.add(mesh);
      nodeMeshes.push({ mesh, node });
    });

    // 6. Standing Wave Pulses along Great Circles
    const waveParticlesCount = 60;
    const waveParticlesGeo = new THREE.BufferGeometry();
    const waveParticlePositions = new Float32Array(waveParticlesCount * 3);
    for (let i = 0; i < waveParticlesCount; i++) {
      const angle = (i / waveParticlesCount) * Math.PI * 2;
      waveParticlePositions[i * 3] = Math.cos(angle) * (earthRadius * 1.04);
      waveParticlePositions[i * 3 + 1] = 0;
      waveParticlePositions[i * 3 + 2] = Math.sin(angle) * (earthRadius * 1.04);
    }
    waveParticlesGeo.setAttribute('position', new THREE.BufferAttribute(waveParticlePositions, 3));
    const waveParticlesMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.025,
      transparent: true,
      opacity: 0.8,
    });
    const wavePointsMesh = new THREE.Points(waveParticlesGeo, waveParticlesMat);
    globeGroup.add(wavePointsMesh);

    // Raycasting for node hover and selection
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(nodesGroup.children, true);

      if (intersects.length > 0) {
        let target = intersects[0].object;
        while (target.parent && target.parent !== nodesGroup) {
          target = target.parent as THREE.Mesh;
        }
        if (target.userData?.node) {
          setHoveredNode(target.userData.node as GeodeticNode);
          container.style.cursor = 'pointer';
          return;
        }
      }
      setHoveredNode(null);
      container.style.cursor = 'grab';
    };

    const handleClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(nodesGroup.children, true);

      if (intersects.length > 0) {
        let target = intersects[0].object;
        while (target.parent && target.parent !== nodesGroup) {
          target = target.parent as THREE.Mesh;
        }
        if (target.userData?.node) {
          onSelectNode(target.userData.node as GeodeticNode);
        }
      }
    };

    // User Drag Controls (Smooth rotational momentum)
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };
    let rotVelocity = { x: 0.0012, y: 0.0006 };

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMousePos = { x: e.clientX, y: e.clientY };
      container.style.cursor = 'grabbing';
    };

    const handleWindowMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMousePos.x;
      const deltaY = e.clientY - prevMousePos.y;
      prevMousePos = { x: e.clientX, y: e.clientY };

      globeGroup.rotation.y += deltaX * 0.006;
      globeGroup.rotation.x += deltaY * 0.006;
      rotVelocity = { x: deltaY * 0.0008, y: deltaX * 0.0008 };
    };

    const handleWindowMouseUp = () => {
      isDragging = false;
      container.style.cursor = 'grab';
    };

    container.addEventListener('mousemove', handlePointerMove);
    container.addEventListener('click', handleClick);
    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleWindowMouseMove);
    window.addEventListener('mouseup', handleWindowMouseUp);

    // Animation Loop
    let animationFrameId = 0;
    let clock = new THREE.Clock();

    const animate = () => {
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Idle planetary rotation with damped user drag momentum
      if (!isDragging) {
        globeGroup.rotation.y += rotVelocity.y + 0.0015;
        globeGroup.rotation.x += rotVelocity.x;
        rotVelocity.x *= 0.96;
        rotVelocity.y *= 0.96;
      }

      // Pulse standing wave along great circles
      if (wavePointsMesh) {
        wavePointsMesh.rotation.y = elapsedTime * 0.4;
      }

      // Dynamic node scaling for selected node
      nodeMeshes.forEach(({ mesh, node }) => {
        const isSelected = selectedNode?.id === node.id;
        const targetScale = isSelected ? 1.6 : 1.0;
        mesh.scale.lerp(_tempVecA.set(targetScale, targetScale, targetScale), 0.15);
      });

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Window Resize Handling
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousemove', handlePointerMove);
      container.removeEventListener('click', handleClick);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('mouseup', handleWindowMouseUp);
      window.removeEventListener('resize', handleResize);

      // Clean disposal
      earthGeo.dispose();
      earthMat.dispose();
      earthTexture.dispose();
      atmosGeo.dispose();
      atmosMat.dispose();
      cuboctaLinesGeo.dispose();
      cuboctaLinesMat.dispose();
      icosaGeo.dispose();
      icosaWireframe.dispose();
      icosaLinesMat.dispose();
      nodeBeaconGeo.dispose();
      waveParticlesGeo.dispose();
      waveParticlesMat.dispose();
      renderer.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [selectedNode, onSelectNode]);

  return (
    <div className="relative w-full h-full min-h-[520px] bg-slate-950 overflow-hidden rounded-xl border border-slate-800">
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab select-none" />

      {/* Top Left Compass & Orientation Overlay */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <div className="text-xs font-mono uppercase tracking-wider text-slate-400">
          Geodetic Matrix Frame
        </div>
        <div className="text-base font-semibold text-slate-100 mt-0.5">
          21,600 Arc-Minute Harmonic Lattice
        </div>
        <div className="flex items-center gap-3 text-xs font-mono text-cyan-400 mt-1">
          <span>Cuboctahedron (24 Edges)</span>
          <span className="text-slate-600">/</span>
          <span>120-Polytope Grid</span>
        </div>
      </div>

      {/* Hovered Node Tooltip HUD */}
      {hoveredNode && (
        <div className="absolute bottom-6 left-4 z-10 bg-slate-900/90 border border-cyan-500/40 rounded-lg p-3 max-w-sm pointer-events-none shadow-xl">
          <div className="flex items-center justify-between text-xs text-cyan-400 font-mono">
            <span>{hoveredNode.polyhedronType.toUpperCase()}</span>
            <span>HARMONIC {hoveredNode.harmonicFrequency}</span>
          </div>
          <div className="text-sm font-semibold text-white mt-1">{hoveredNode.name}</div>
          <div className="text-xs text-slate-400 mt-0.5 font-mono">
            Lat: {hoveredNode.latitude.toFixed(2)}° · Lon: {hoveredNode.longitude.toFixed(2)}° (
            {hoveredNode.arcMinuteLat.toFixed(0)}′ / {hoveredNode.arcMinuteLon.toFixed(0)}′)
          </div>
          <div className="text-xs text-slate-300 mt-1.5 leading-relaxed line-clamp-2">
            {hoveredNode.description}
          </div>
          <div className="text-[11px] text-cyan-300/80 mt-1.5 font-mono">
            Click node to focus harmonic analysis
          </div>
        </div>
      )}

      {/* Top Right Quick Legends */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-1.5 bg-slate-900/80 border border-slate-800 rounded-lg p-2.5 text-[11px] font-mono text-slate-300">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-0.5 bg-cyan-400 inline-block" />
          <span>Cuboctahedral Lattice (Vector Eq.)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-0.5 bg-amber-400 inline-block" />
          <span>Icosahedral Dual Matrix</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-0.5 bg-sky-400 inline-block" />
          <span>21,600′ Great Circles</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
          <span>Bruce Cathie Harmonic Origin</span>
        </div>
      </div>
    </div>
  );
};
