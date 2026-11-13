import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { CameraViewMode, TierItem } from '../types/store';
import { TIERS_DATA } from '../data/tiers';
import { soundEngine } from '../utils/audio';
import { LightingPresetId, LIGHTING_PRESETS } from '../data/lightingPresets';
import { WaveDirection, WaveCameraAngle } from '../types/wave';
import { WAVE_SPOTS } from '../data/waveSpots';
import aquariumEnvBg from '../assets/images/aquarium_tunnel_env_1790840978491.jpg';

interface ThreeSceneProps {
  viewMode: CameraViewMode;
  onSelectTier: (tier: TierItem) => void;
  hoveredTierId: string | null;
  setHoveredTierId: (id: string | null) => void;
  bloomIntensity?: number;
  onZoomChange?: (zoomOffset: number) => void;
  resetZoomTrigger?: number;
  fogDensity?: number;
  dofEnabled?: boolean;
  lightingPreset?: LightingPresetId;
  waveHeightFt?: number;
  waveDirection?: WaveDirection;
  waveCameraAngle?: WaveCameraAngle;
  waveSpotId?: string;
}

export const ThreeScene: React.FC<ThreeSceneProps> = ({
  viewMode,
  onSelectTier,
  hoveredTierId,
  setHoveredTierId,
  bloomIntensity = 1.2,
  onZoomChange,
  resetZoomTrigger,
  fogDensity = 1.0,
  dofEnabled = true,
  lightingPreset = 'holographic-blue',
  waveHeightFt = 18,
  waveDirection = 'left',
  waveCameraAngle = 'gantry',
  waveSpotId = 'teahupoo'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const targetCamPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 1.3, 10.5));
  const targetLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 1.0, 0));
  const currentLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 1.0, 0));
  const mouseParallaxRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const bloomRef = useRef<number>(bloomIntensity);
  const fogDensityRef = useRef<number>(fogDensity);
  const waveHeightRef = useRef<number>(waveHeightFt);
  const waveDirectionRef = useRef<WaveDirection>(waveDirection);
  const waveCameraAngleRef = useRef<WaveCameraAngle>(waveCameraAngle);
  const waveSpotIdRef = useRef<string>(waveSpotId);

  useEffect(() => {
    waveHeightRef.current = waveHeightFt;
  }, [waveHeightFt]);

  useEffect(() => {
    waveDirectionRef.current = waveDirection;
  }, [waveDirection]);

  useEffect(() => {
    waveCameraAngleRef.current = waveCameraAngle;
  }, [waveCameraAngle]);

  useEffect(() => {
    waveSpotIdRef.current = waveSpotId;
  }, [waveSpotId]);
  const dofEnabledRef = useRef<boolean>(dofEnabled);
  const lightingPresetRef = useRef<LightingPresetId>(lightingPreset);

  useEffect(() => {
    lightingPresetRef.current = lightingPreset;
  }, [lightingPreset]);

  useEffect(() => {
    fogDensityRef.current = fogDensity;
  }, [fogDensity]);

  useEffect(() => {
    dofEnabledRef.current = dofEnabled;
  }, [dofEnabled]);

  // Subtle scroll-to-zoom refs
  const targetZoomRef = useRef<number>(0);
  const currentZoomRef = useRef<number>(0);
  const viewModeRef = useRef<CameraViewMode>(viewMode);

  useEffect(() => {
    viewModeRef.current = viewMode;
    // Reset zoom smoothly when switching view targets
    targetZoomRef.current = 0;
  }, [viewMode]);

  useEffect(() => {
    if (resetZoomTrigger !== undefined) {
      targetZoomRef.current = 0;
    }
  }, [resetZoomTrigger]);

  // Keep bloomRef in sync with prop for real-time 60fps render adjustments
  useEffect(() => {
    bloomRef.current = bloomIntensity;
    if (containerRef.current) {
      if (bloomIntensity > 0.2) {
        const glowPx = Math.round(bloomIntensity * 10);
        const alpha = Math.min(0.35, 0.08 * bloomIntensity);
        containerRef.current.style.filter = `drop-shadow(0 0 ${glowPx}px rgba(0, 240, 255, ${alpha}))`;
      } else {
        containerRef.current.style.filter = 'none';
      }
    }
  }, [bloomIntensity]);

  // Update target camera coordinates whenever viewMode changes
  useEffect(() => {
    switch (viewMode) {
      case 'doorway':
        targetCamPosRef.current.set(0, 1.3, 10.5);
        targetLookAtRef.current.set(0, 1.0, 0);
        break;
      case 'overview':
        targetCamPosRef.current.set(0, 1.7, 7.2);
        targetLookAtRef.current.set(0, 0.7, 0);
        break;
      case 'tier1':
        targetCamPosRef.current.set(-3.8, 1.0, 3.2);
        targetLookAtRef.current.set(-3.8, 0.85, 0);
        break;
      case 'tier2':
        targetCamPosRef.current.set(0, 1.25, 3.4);
        targetLookAtRef.current.set(0, 1.05, 0.4);
        break;
      case 'tier3':
        targetCamPosRef.current.set(3.8, 1.0, 3.2);
        targetLookAtRef.current.set(3.8, 0.85, 0);
        break;
      case 'aquarium':
        targetCamPosRef.current.set(0, 1.4, -14);
        targetLookAtRef.current.set(0, 1.4, -28);
        break;
      case 'horizon':
        targetCamPosRef.current.set(0, 2.2, 1.8);
        targetLookAtRef.current.set(0, 3.2, -50);
        break;
      case 'wave':
        const hScale = Math.min(2.2, Math.max(0.6, (waveHeightFt || 18) / 10));
        if (waveCameraAngle === 'barrel') {
          const xOffset = waveDirection === 'left' ? 4.5 : -4.5;
          const lookX = waveDirection === 'left' ? -16.0 : 16.0;
          targetCamPosRef.current.set(38 + xOffset, Math.max(1.0, 1.35 * hScale), -13.2);
          targetLookAtRef.current.set(38 + lookX, Math.max(0.8, 1.15 * hScale), -13.2);
        } else if (waveCameraAngle === 'shoulder') {
          const sideX = waveDirection === 'left' ? -14 : 14;
          targetCamPosRef.current.set(38 + sideX, 1.8, -4.5);
          targetLookAtRef.current.set(38, 2.4, -13.5);
        } else {
          // Gantry / Overlook
          targetCamPosRef.current.set(24, 6.2, -5);
          targetLookAtRef.current.set(38, 2.5, -13.5);
        }
        break;
    }
  }, [viewMode, waveCameraAngle, waveDirection, waveHeightFt]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth;
    let height = container.clientHeight;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#020611');
    scene.fog = new THREE.FogExp2('#020611', 0.045);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 120);
    camera.position.set(0, 1.3, 10.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    const textureLoader = new THREE.TextureLoader();

    // 2. Studio & Atmospheric Lighting (Dynamic Preset Controlled)
    const initialPreset = LIGHTING_PRESETS[lightingPresetRef.current] || LIGHTING_PRESETS['holographic-blue'];
    const ambientLight = new THREE.AmbientLight(initialPreset.ambientColor, initialPreset.ambientIntensity);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(initialPreset.keyLightColor, initialPreset.keyLightIntensity);
    keyLight.position.set(6, 12, 8);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(initialPreset.fillLightColor, initialPreset.fillLightIntensity);
    fillLight.position.set(-6, -2, -4);
    scene.add(fillLight);

    const centerGlow = new THREE.PointLight(initialPreset.centerGlowColor, initialPreset.centerGlowIntensity, 25);
    centerGlow.position.set(0, 4, 1);
    scene.add(centerGlow);

    // 3. Grid Floor in Exhibition Hall
    const gridHelper = new THREE.GridHelper(36, 36, initialPreset.gridColor, initialPreset.gridSubColor);
    gridHelper.position.y = -0.01;
    scene.add(gridHelper);

    // 4. "Path of the Ferns" / Sovereign Doorway Portal
    const portalGroup = new THREE.Group();
    portalGroup.position.set(0, 0, -3.5);

    const frameGeo = new THREE.BoxGeometry(7.5, 6.2, 0.4);
    const frameMat = new THREE.MeshStandardMaterial({
      color: '#070b16',
      roughness: 0.7,
      metalness: 0.4
    });
    const portalArch = new THREE.Mesh(frameGeo, frameMat);
    portalArch.position.set(0, 3.1, 0);
    portalGroup.add(portalArch);

    // Neon portal rim glowing frame
    const portalRimGeo = new THREE.RingGeometry(2.6, 2.68, 4);
    const portalRimMat = new THREE.MeshBasicMaterial({
      color: '#00f0ff',
      side: THREE.DoubleSide
    });
    const portalRim = new THREE.Mesh(portalRimGeo, portalRimMat);
    portalRim.rotation.z = Math.PI / 4;
    portalRim.scale.set(1.4, 1.25, 1);
    portalRim.position.set(0, 2.8, 0.05);
    portalGroup.add(portalRim);

    // Portal backdrop showing aquarium vista through the archway
    const aquariumTexture = textureLoader.load(aquariumEnvBg);
    aquariumTexture.colorSpace = THREE.SRGBColorSpace;

    const portalBackdropGeo = new THREE.PlaneGeometry(5.8, 4.8);
    const portalBackdropMat = new THREE.MeshBasicMaterial({
      map: aquariumTexture,
      transparent: true,
      opacity: 0.85
    });
    const portalBackdrop = new THREE.Mesh(portalBackdropGeo, portalBackdropMat);
    portalBackdrop.position.set(0, 2.8, -0.2);
    portalGroup.add(portalBackdrop);

    scene.add(portalGroup);

    // 5. Holographic Display Cases & 3D Sovereign E-Books
    const displayCases: {
      tier: TierItem;
      group: THREE.Group;
      bookMesh: THREE.Mesh;
      pedestalGlow: THREE.Mesh;
      caseGlass: THREE.Mesh;
      wireframe: THREE.LineSegments;
      topRim: THREE.Mesh;
      haloRings: THREE.Mesh[];
      collider: THREE.Mesh;
    }[] = [];

    TIERS_DATA.forEach((tier) => {
      const caseGroup = new THREE.Group();
      caseGroup.position.set(tier.threePosition[0], tier.threePosition[1], tier.threePosition[2]);

      const baseColor = new THREE.Color(tier.accentColor);

      // A. Pedestal Base (Cylinder with glowing ring)
      const baseGeo = new THREE.CylinderGeometry(1.2, 1.35, 0.45, 32);
      const baseMat = new THREE.MeshStandardMaterial({
        color: '#090f1d',
        roughness: 0.3,
        metalness: 0.8
      });
      const pedestalBase = new THREE.Mesh(baseGeo, baseMat);
      pedestalBase.position.y = 0.225;
      caseGroup.add(pedestalBase);

      // Glowing Neon Top Rim
      const rimGeo = new THREE.TorusGeometry(1.16, 0.035, 16, 48);
      const rimMat = new THREE.MeshBasicMaterial({ color: baseColor });
      const topRim = new THREE.Mesh(rimGeo, rimMat);
      topRim.rotation.x = Math.PI / 2;
      topRim.position.y = 0.45;
      caseGroup.add(topRim);

      // Floor Projector Light Ring
      const projGeo = new THREE.RingGeometry(1.28, 1.5, 32);
      const projMat = new THREE.MeshBasicMaterial({
        color: baseColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
      });
      const projRing = new THREE.Mesh(projGeo, projMat);
      projRing.rotation.x = -Math.PI / 2;
      projRing.position.y = 0.02;
      caseGroup.add(projRing);

      // B. Glass / Wireframe Display Case
      const caseGeo = new THREE.CylinderGeometry(1.2, 1.2, 2.6, 24, 1, true);
      const caseMat = new THREE.MeshPhysicalMaterial({
        color: baseColor,
        transparent: true,
        opacity: 0.14,
        roughness: 0.05,
        metalness: 0.1,
        transmission: 0.9,
        ior: 1.45,
        side: THREE.DoubleSide,
        depthWrite: false
      });
      const caseGlass = new THREE.Mesh(caseGeo, caseMat);
      caseGlass.position.y = 1.75;
      caseGroup.add(caseGlass);

      // Neon Wireframe Outlines
      const edgesGeo = new THREE.EdgesGeometry(caseGeo);
      const edgesMat = new THREE.LineBasicMaterial({
        color: baseColor,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
      });
      const wireframe = new THREE.LineSegments(edgesGeo, edgesMat);
      wireframe.position.y = 1.75;
      caseGroup.add(wireframe);

      // C. 3D E-Book Mesh with Sovereign Media Cover
      const coverTexture = textureLoader.load(tier.coverImage);
      coverTexture.colorSpace = THREE.SRGBColorSpace;

      const bookWidth = 1.35;
      const bookHeight = 1.95;
      const bookDepth = tier.id === 'tier3' ? 0.36 : tier.id === 'tier2' ? 0.28 : 0.22;

      const pageMat = new THREE.MeshStandardMaterial({
        color: '#f1f5f9',
        roughness: 0.85,
        metalness: 0.05
      });
      const spineMat = new THREE.MeshStandardMaterial({
        color: '#070b14',
        roughness: 0.3,
        metalness: 0.6
      });
      const coverFaceMat = new THREE.MeshStandardMaterial({
        map: coverTexture,
        roughness: 0.2,
        metalness: 0.3
      });
      const backFaceMat = new THREE.MeshStandardMaterial({
        color: '#070b14',
        roughness: 0.35,
        metalness: 0.5
      });

      const bookMaterials = [
        pageMat,      // +X (pages edge)
        spineMat,     // -X (spine)
        pageMat,      // +Y (top pages)
        pageMat,      // -Y (bottom pages)
        coverFaceMat, // +Z (front cover)
        backFaceMat   // -Z (back cover)
      ];

      const bookGeo = new THREE.BoxGeometry(bookWidth, bookHeight, bookDepth);
      const bookMesh = new THREE.Mesh(bookGeo, bookMaterials);
      bookMesh.position.y = 1.75;
      bookMesh.rotation.y = -0.25;
      caseGroup.add(bookMesh);

      // D. Floating Orbiting Neon Rings
      const haloRings: THREE.Mesh[] = [];
      const haloGeo1 = new THREE.TorusGeometry(1.08, 0.018, 12, 48);
      const haloMat1 = new THREE.MeshBasicMaterial({
        color: baseColor,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending
      });
      const halo1 = new THREE.Mesh(haloGeo1, haloMat1);
      halo1.position.y = 1.75;
      halo1.rotation.x = Math.PI / 3;
      caseGroup.add(halo1);
      haloRings.push(halo1);

      const haloGeo2 = new THREE.TorusGeometry(0.88, 0.012, 12, 48);
      const halo2 = new THREE.Mesh(haloGeo2, haloMat1);
      halo2.position.y = 1.75;
      halo2.rotation.y = Math.PI / 4;
      caseGroup.add(halo2);
      haloRings.push(halo2);

      // Interactive Collider
      const colliderGeo = new THREE.CylinderGeometry(1.3, 1.3, 3.2, 16);
      const colliderMat = new THREE.MeshBasicMaterial({ visible: false });
      const collider = new THREE.Mesh(colliderGeo, colliderMat);
      collider.position.y = 1.6;
      caseGroup.add(collider);
      (collider as any).tierData = tier;

      scene.add(caseGroup);

      displayCases.push({
        tier,
        group: caseGroup,
        bookMesh,
        pedestalGlow: projRing,
        caseGlass,
        wireframe,
        topRim,
        haloRings,
        collider
      });
    });

    // 6. 3D TUNNEL AQUARIUM (Arched Glass Underwater Tunnel)
    const aquariumGroup = new THREE.Group();
    aquariumGroup.position.set(0, 0, -20); // Extends deep into the vista

    // Tunnel Arch Glass Geometry
    const tunnelRadius = 3.6;
    const tunnelLength = 26;
    const tunnelGeo = new THREE.CylinderGeometry(
      tunnelRadius,
      tunnelRadius,
      tunnelLength,
      32,
      1,
      true,
      0,
      Math.PI // Upper half semicircle arch
    );
    const tunnelMat = new THREE.MeshPhysicalMaterial({
      color: '#06b6d4',
      transparent: true,
      opacity: 0.22,
      roughness: 0.1,
      transmission: 0.85,
      ior: 1.33,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const tunnelMesh = new THREE.Mesh(tunnelGeo, tunnelMat);
    tunnelMesh.rotation.z = Math.PI / 2; // Lie horizontal
    tunnelMesh.rotation.y = Math.PI / 2; // Orient along Z axis
    tunnelMesh.position.y = 0;
    aquariumGroup.add(tunnelMesh);

    // Glowing Neon Structural Arches along the tunnel
    const archCount = 7;
    for (let i = 0; i < archCount; i++) {
      const zOffset = -tunnelLength / 2 + (i * tunnelLength) / (archCount - 1);
      const ribGeo = new THREE.TorusGeometry(tunnelRadius + 0.05, 0.05, 12, 32, Math.PI);
      const ribMat = new THREE.MeshBasicMaterial({ color: '#00f0ff' });
      const rib = new THREE.Mesh(ribGeo, ribMat);
      rib.position.set(0, 0, zOffset);
      aquariumGroup.add(rib);
    }

    // Tunnel Walkway Floor (Where people walk in)
    const walkwayGeo = new THREE.PlaneGeometry(tunnelRadius * 1.9, tunnelLength);
    const walkwayMat = new THREE.MeshStandardMaterial({
      color: '#030812',
      roughness: 0.5,
      metalness: 0.6
    });
    const walkway = new THREE.Mesh(walkwayGeo, walkwayMat);
    walkway.rotation.x = -Math.PI / 2;
    walkway.position.y = 0.01;
    aquariumGroup.add(walkway);

    // Glowing LED pedestrian pathway guides on floor (demarcating human walk-in path)
    const guideGeo = new THREE.BoxGeometry(0.08, 0.04, tunnelLength);
    const guideMat = new THREE.MeshBasicMaterial({ color: '#00f0ff' });
    const leftGuide = new THREE.Mesh(guideGeo, guideMat);
    leftGuide.position.set(-tunnelRadius * 0.88, 0.03, 0);
    aquariumGroup.add(leftGuide);

    const rightGuide = new THREE.Mesh(guideGeo, guideMat);
    rightGuide.position.set(tunnelRadius * 0.88, 0.03, 0);
    aquariumGroup.add(rightGuide);

    // Subtle Caustic Light Reflections on Tunnel Floor
    const causticGeo = new THREE.PlaneGeometry(tunnelRadius * 1.8, tunnelLength);
    const causticMat = new THREE.MeshBasicMaterial({
      color: '#22d3ee',
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending
    });
    const causticFloor = new THREE.Mesh(causticGeo, causticMat);
    causticFloor.rotation.x = -Math.PI / 2;
    causticFloor.position.y = 0.02;
    aquariumGroup.add(causticFloor);

    // 6B. SPARKLY WATER SURFACE OVERHEAD & SUNLIGHT CAUSTIC SHAFTS
    const waterWidth = 32;
    const waterLength = tunnelLength + 10;
    const waterSurfaceGeo = new THREE.PlaneGeometry(waterWidth, waterLength, 48, 48);
    const waterOrigPositions = (waterSurfaceGeo.attributes.position.array as Float32Array).slice();

    const waterSurfaceMat = new THREE.MeshPhysicalMaterial({
      color: '#0284c7',
      emissive: '#082f49',
      roughness: 0.12,
      metalness: 0.1,
      transmission: 0.75,
      transparent: true,
      opacity: 0.65,
      ior: 1.333,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const waterSurface = new THREE.Mesh(waterSurfaceGeo, waterSurfaceMat);
    waterSurface.rotation.x = Math.PI / 2; // Lie flat horizontal overhead
    waterSurface.position.set(0, 8.5, 0);
    aquariumGroup.add(waterSurface);

    // Glittering Water Surface Sparkle Diamonds (Sun glints on wave crests)
    const waterSparkleCount = 180;
    const waterSparklePositions = new Float32Array(waterSparkleCount * 3);
    const waterSparklePhases = new Float32Array(waterSparkleCount);

    for (let s = 0; s < waterSparkleCount; s++) {
      const sIdx = s * 3;
      waterSparklePositions[sIdx] = (Math.random() - 0.5) * (waterWidth - 2);
      waterSparklePositions[sIdx + 1] = 8.4 + (Math.random() - 0.5) * 0.35;
      waterSparklePositions[sIdx + 2] = (Math.random() - 0.5) * (waterLength - 2);
      waterSparklePhases[s] = Math.random() * Math.PI * 2;
    }

    const waterSparkleGeo = new THREE.BufferGeometry();
    waterSparkleGeo.setAttribute('position', new THREE.BufferAttribute(waterSparklePositions, 3));

    // Crisp Diamond / Star Flare Texture for Water Sparkles
    const sparkleCanvas = document.createElement('canvas');
    sparkleCanvas.width = 64;
    sparkleCanvas.height = 64;
    const spCtx = sparkleCanvas.getContext('2d');
    if (spCtx) {
      spCtx.clearRect(0, 0, 64, 64);
      const grad = spCtx.createRadialGradient(32, 32, 0, 32, 32, 30);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.25, 'rgba(186, 230, 253, 0.95)');
      grad.addColorStop(0.6, 'rgba(56, 189, 248, 0.4)');
      grad.addColorStop(1, 'rgba(0, 240, 255, 0)');
      spCtx.fillStyle = grad;
      spCtx.beginPath();
      spCtx.arc(32, 32, 30, 0, Math.PI * 2);
      spCtx.fill();

      // Diamond cross rays
      spCtx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      spCtx.beginPath();
      spCtx.moveTo(32, 4);
      spCtx.lineTo(34, 30);
      spCtx.lineTo(60, 32);
      spCtx.lineTo(34, 34);
      spCtx.lineTo(32, 60);
      spCtx.lineTo(30, 34);
      spCtx.lineTo(4, 32);
      spCtx.lineTo(30, 30);
      spCtx.closePath();
      spCtx.fill();
    }
    const waterSparkleTexture = new THREE.CanvasTexture(sparkleCanvas);

    const waterSparkleMat = new THREE.PointsMaterial({
      map: waterSparkleTexture,
      size: 0.55,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const waterSparkles = new THREE.Points(waterSparkleGeo, waterSparkleMat);
    aquariumGroup.add(waterSparkles);

    // Downwelling Sunbeam Caustic Light Shafts descending from the water surface
    const sunbeamCount = 8;
    const sunbeams: THREE.Mesh[] = [];
    const sunbeamMat = new THREE.MeshBasicMaterial({
      color: '#38bdf8',
      transparent: true,
      opacity: 0.12,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false
    });

    for (let b = 0; b < sunbeamCount; b++) {
      const beamLength = 5.2;
      const beamGeo = new THREE.ConeGeometry(1.6 + (b % 3) * 0.4, beamLength, 8, 1, true);
      const beam = new THREE.Mesh(beamGeo, sunbeamMat);
      beam.position.set(
        (Math.sin(b * 1.7) * 4.2),
        6.2,
        -waterLength / 2 + 3 + (b * (waterLength - 6)) / (sunbeamCount - 1)
      );
      beam.rotation.x = Math.PI; // point downwards
      beam.rotation.z = Math.sin(b) * 0.15; // natural underwater slant
      aquariumGroup.add(beam);
      sunbeams.push(beam);
    }

    // Dedicated top-down sunlight illuminating the water and creatures from above
    const topWaterLight = new THREE.DirectionalLight('#7dd3fc', 2.0);
    topWaterLight.position.set(0, 14, 0);
    aquariumGroup.add(topWaterLight);

    // 7. SWIMMING BIOLUMINESCENT AQUARIUM CREATURES (Strictly ABOVE and OUTSIDE the tunnel)

    // A. Glowing Neon Manta Rays (3 rays - gliding strictly ABOVE the tunnel glass)
    const mantaRays: { group: THREE.Group; leftWing: THREE.Mesh; rightWing: THREE.Mesh; speed: number; phase: number }[] = [];
    for (let m = 0; m < 3; m++) {
      const manta = new THREE.Group();
      manta.position.set((m - 1) * 3.5, 5.2 + m * 0.4, -6 - m * 8);

      const bodyGeo = new THREE.ConeGeometry(0.5, 1.8, 4);
      const bodyMat = new THREE.MeshBasicMaterial({ color: '#00f0ff' });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      body.rotation.x = Math.PI / 2;
      manta.add(body);

      // Left Wing
      const wingGeo = new THREE.BufferGeometry();
      const leftVertices = new Float32Array([
        0, 0, 0.4,
        -1.8, 0, -0.4,
        0, 0, -0.8
      ]);
      wingGeo.setAttribute('position', new THREE.BufferAttribute(leftVertices, 3));
      const wingMat = new THREE.MeshBasicMaterial({
        color: '#38bdf8',
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.75,
        blending: THREE.AdditiveBlending
      });
      const leftWing = new THREE.Mesh(wingGeo, wingMat);
      manta.add(leftWing);

      // Right Wing
      const rightWingGeo = new THREE.BufferGeometry();
      const rightVertices = new Float32Array([
        0, 0, 0.4,
        1.8, 0, -0.4,
        0, 0, -0.8
      ]);
      rightWingGeo.setAttribute('position', new THREE.BufferAttribute(rightVertices, 3));
      const rightWing = new THREE.Mesh(rightWingGeo, wingMat);
      manta.add(rightWing);

      // Tail
      const tailGeo = new THREE.CylinderGeometry(0.03, 0.01, 2.2, 8);
      const tail = new THREE.Mesh(tailGeo, bodyMat);
      tail.position.z = -1.6;
      tail.rotation.x = Math.PI / 2;
      manta.add(tail);

      aquariumGroup.add(manta);
      mantaRays.push({ group: manta, leftWing, rightWing, speed: 0.8 + m * 0.3, phase: m * 1.5 });
    }

    // B. School of Bioluminescent Neon Fish (26 fish - swimming strictly above the tunnel or in deep side flanks)
    const fishSchool: { mesh: THREE.Mesh; basePos: THREE.Vector3; speed: number; offset: number; isOverhead: boolean }[] = [];
    const fishGeo = new THREE.ConeGeometry(0.12, 0.5, 4);
    const fishColors = ['#00f0ff', '#10b981', '#a855f7', '#38bdf8', '#fb7185'];

    for (let f = 0; f < 26; f++) {
      const fMat = new THREE.MeshBasicMaterial({
        color: fishColors[f % fishColors.length],
        transparent: true,
        opacity: 0.88
      });
      const fish = new THREE.Mesh(fishGeo, fMat);
      fish.rotation.x = Math.PI / 2;

      const isOverhead = f < 16;
      let basePos: THREE.Vector3;

      if (isOverhead) {
        // Overhead school gliding across the top of the glass dome (y = 4.4 to 6.8)
        basePos = new THREE.Vector3(
          (Math.random() - 0.5) * 6.2,
          4.5 + Math.random() * 2.2,
          -12 - Math.random() * 18
        );
      } else {
        // Flank school swimming in deep ocean waters outside the side glass (|x| >= 4.8)
        const side = f % 2 === 0 ? 1 : -1;
        basePos = new THREE.Vector3(
          side * (4.8 + Math.random() * 3.2),
          1.4 + Math.random() * 2.4,
          -10 - Math.random() * 18
        );
      }

      fish.position.copy(basePos);
      aquariumGroup.add(fish);

      fishSchool.push({
        mesh: fish,
        basePos,
        speed: 1.1 + Math.random() * 0.9,
        offset: f * 0.45,
        isOverhead
      });
    }

    // C. Glowing Pulsating Jellyfish (8 jellyfish - drifting strictly ABOVE the tunnel arch)
    const jellyfish: { group: THREE.Group; basePos: THREE.Vector3; speed: number; phase: number }[] = [];
    for (let j = 0; j < 8; j++) {
      const jelly = new THREE.Group();
      const domeGeo = new THREE.SphereGeometry(0.35, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2);
      const domeMat = new THREE.MeshBasicMaterial({
        color: j % 2 === 0 ? '#c084fc' : '#38bdf8',
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.68,
        blending: THREE.AdditiveBlending
      });
      const dome = new THREE.Mesh(domeGeo, domeMat);
      jelly.add(dome);

      // Trailing Tentacles
      for (let t = 0; t < 4; t++) {
        const tGeo = new THREE.CylinderGeometry(0.015, 0.005, 0.8, 6);
        const tMat = new THREE.MeshBasicMaterial({ 
          color: j % 2 === 0 ? '#f472b6' : '#22d3ee', 
          transparent: true, 
          opacity: 0.55 
        });
        const tentacle = new THREE.Mesh(tGeo, tMat);
        tentacle.position.set((Math.random() - 0.5) * 0.2, -0.4, (Math.random() - 0.5) * 0.2);
        jelly.add(tentacle);
      }

      // Floating in open water above tunnel apex (y = 4.6 to 7.4)
      const basePos = new THREE.Vector3(
        (Math.random() - 0.5) * 5.8,
        4.8 + Math.random() * 2.2,
        -10 - Math.random() * 18
      );
      jelly.position.copy(basePos);
      aquariumGroup.add(jelly);

      jellyfish.push({ group: jelly, basePos, speed: 0.5 + Math.random() * 0.5, phase: j * 1.1 });
    }

    scene.add(aquariumGroup);

    // 8. PLASMA ENGINE (Holographic Energy Core & Tendril Arcs)
    const plasmaGroup = new THREE.Group();
    plasmaGroup.position.set(0, 3.8, -3.2);

    const outerPlasmaGeo = new THREE.IcosahedronGeometry(0.85, 1);
    const outerPlasmaMat = new THREE.MeshBasicMaterial({
      color: '#c084fc',
      wireframe: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });
    const outerPlasma = new THREE.Mesh(outerPlasmaGeo, outerPlasmaMat);
    plasmaGroup.add(outerPlasma);

    const innerPlasmaGeo = new THREE.SphereGeometry(0.48, 24, 24);
    const innerPlasmaMat = new THREE.MeshBasicMaterial({
      color: '#ec4899',
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });
    const innerPlasma = new THREE.Mesh(innerPlasmaGeo, innerPlasmaMat);
    plasmaGroup.add(innerPlasma);

    const plasmaArcs: THREE.Mesh[] = [];
    for (let a = 0; a < 3; a++) {
      const arcGeo = new THREE.TorusGeometry(0.95 + a * 0.12, 0.02, 12, 48);
      const arcMat = new THREE.MeshBasicMaterial({
        color: a === 0 ? '#00f0ff' : a === 1 ? '#ec4899' : '#a855f7',
        transparent: true,
        opacity: 0.75,
        blending: THREE.AdditiveBlending
      });
      const arc = new THREE.Mesh(arcGeo, arcMat);
      arc.rotation.set((a * Math.PI) / 3, (a * Math.PI) / 4, 0);
      plasmaGroup.add(arc);
      plasmaArcs.push(arc);
    }

    const plasmaLight = new THREE.PointLight('#a855f7', 1.8, 14);
    plasmaGroup.add(plasmaLight);
    scene.add(plasmaGroup);

    // 9. HORIZON ENGINE (Undulating Cyber Terrain & Neon Horizon Sun)
    const horizonGroup = new THREE.Group();
    horizonGroup.position.set(0, -0.2, -45);

    const horizonGeo = new THREE.PlaneGeometry(62, 70, 44, 44);
    const horizonOrigPos = new Float32Array(horizonGeo.attributes.position.array);
    const horizonMat = new THREE.MeshBasicMaterial({
      color: '#06b6d4',
      wireframe: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });
    const horizonMesh = new THREE.Mesh(horizonGeo, horizonMat);
    horizonMesh.rotation.x = -Math.PI / 2;
    horizonGroup.add(horizonMesh);

    // Neon Horizon Sun at the vanishing point
    const horizonSunGroup = new THREE.Group();
    horizonSunGroup.position.set(0, 6.8, -75);

    const sunGeo = new THREE.CircleGeometry(5.5, 48);
    const sunMat = new THREE.MeshBasicMaterial({
      color: '#ec4899',
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });
    const horizonSun = new THREE.Mesh(sunGeo, sunMat);
    horizonSunGroup.add(horizonSun);

    const sunRingGeo = new THREE.RingGeometry(5.7, 5.9, 48);
    const sunRingMat = new THREE.MeshBasicMaterial({
      color: '#f59e0b',
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.95
    });
    const horizonSunRing = new THREE.Mesh(sunRingGeo, sunRingMat);
    horizonSunGroup.add(horizonSunRing);

    horizonGroup.add(horizonSunGroup);
    scene.add(horizonGroup);

    // 10. 3D FREQUENCY-REACTIVE EQUALIZER WAVE RING & ACOUSTIC PULSE
    const eqGroup = new THREE.Group();
    eqGroup.position.set(0, 4.9, -3.15);
    scene.add(eqGroup);

    const eqBarCount = 32;
    const eqBars: THREE.Mesh[] = [];
    const barGeo = new THREE.BoxGeometry(0.08, 1.0, 0.08);
    barGeo.translate(0, 0.5, 0);

    const eqPalette = [
      '#00f0ff', '#38bdf8', '#818cf8', '#a855f7', '#ec4899', '#f43f5e', '#fb7185', '#38bdf8'
    ];

    for (let b = 0; b < eqBarCount; b++) {
      const angle = (b / eqBarCount) * Math.PI * 2;
      const radius = 2.15;
      const barMat = new THREE.MeshBasicMaterial({
        color: eqPalette[b % eqPalette.length],
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending
      });
      const bar = new THREE.Mesh(barGeo, barMat);
      bar.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
      bar.rotation.y = -angle;
      eqGroup.add(bar);
      eqBars.push(bar);
    }

    const acousticRingGeo = new THREE.RingGeometry(2.1, 2.18, 48);
    const acousticRingMat = new THREE.MeshBasicMaterial({
      color: '#00f0ff',
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });
    const acousticRing = new THREE.Mesh(acousticRingGeo, acousticRingMat);
    acousticRing.rotation.x = Math.PI / 2;
    acousticRing.position.set(0, 4.9, -3.15);
    scene.add(acousticRing);

    // 11. SUBTLE 3D HOLOGRAPHIC DUST PARTICLE EFFECT (Main Exhibition Room)
    const dustCanvas = document.createElement('canvas');
    dustCanvas.width = 64;
    dustCanvas.height = 64;
    const dCtx = dustCanvas.getContext('2d');
    if (dCtx) {
      const grad = dCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.2, 'rgba(186, 230, 253, 0.85)');
      grad.addColorStop(0.5, 'rgba(147, 197, 253, 0.35)');
      grad.addColorStop(0.8, 'rgba(192, 132, 252, 0.12)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      dCtx.fillStyle = grad;
      dCtx.fillRect(0, 0, 64, 64);
    }
    const dustTexture = new THREE.CanvasTexture(dustCanvas);

    const dustCount = 420;
    const dustGeo = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);
    const dustColors = new Float32Array(dustCount * 3);
    const dustSpeeds = new Float32Array(dustCount);
    const dustPhases = new Float32Array(dustCount);

    const colorCyan = new THREE.Color('#38bdf8');
    const colorViolet = new THREE.Color('#c084fc');
    const colorGold = new THREE.Color('#fde047');

    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 11;
      dustPositions[i * 3 + 1] = 0.15 + Math.random() * 4.0;
      dustPositions[i * 3 + 2] = -1.8 + Math.random() * 11.5;

      dustSpeeds[i] = 0.0028 + Math.random() * 0.0065;
      dustPhases[i] = Math.random() * Math.PI * 2;

      const randColor = Math.random();
      const chosenColor = randColor > 0.65 ? colorCyan : (randColor > 0.25 ? colorViolet : colorGold);
      dustColors[i * 3] = chosenColor.r;
      dustColors[i * 3 + 1] = chosenColor.g;
      dustColors[i * 3 + 2] = chosenColor.b;
    }

    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    dustGeo.setAttribute('color', new THREE.BufferAttribute(dustColors, 3));

    const dustMat = new THREE.PointsMaterial({
      map: dustTexture,
      size: 0.08,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.45,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const dustParticles = new THREE.Points(dustGeo, dustMat);
    scene.add(dustParticles);

    // 11. INTERACTIVE HOLOGRAPHIC SPARK MOUSE TRAIL EFFECT
    const sparkCanvas = document.createElement('canvas');
    sparkCanvas.width = 64;
    sparkCanvas.height = 64;
    const sCtx = sparkCanvas.getContext('2d');
    if (sCtx) {
      // Soft radial glow
      const radialGrad = sCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
      radialGrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      radialGrad.addColorStop(0.25, 'rgba(165, 243, 252, 0.85)');
      radialGrad.addColorStop(0.6, 'rgba(192, 132, 252, 0.25)');
      radialGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      sCtx.fillStyle = radialGrad;
      sCtx.fillRect(0, 0, 64, 64);

      // Star-flare horizontal cross beam
      const hGrad = sCtx.createLinearGradient(0, 32, 64, 32);
      hGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      hGrad.addColorStop(0.5, 'rgba(255, 255, 255, 1)');
      hGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      sCtx.fillStyle = hGrad;
      sCtx.fillRect(0, 30.5, 64, 3);

      // Star-flare vertical cross beam
      const vGrad = sCtx.createLinearGradient(32, 0, 32, 64);
      vGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      vGrad.addColorStop(0.5, 'rgba(255, 255, 255, 1)');
      vGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      sCtx.fillStyle = vGrad;
      sCtx.fillRect(30.5, 0, 3, 64);
    }
    const sparkTexture = new THREE.CanvasTexture(sparkCanvas);

    const maxSparks = 180;
    const sparkGeo = new THREE.BufferGeometry();
    const sparkPositions = new Float32Array(maxSparks * 3);
    const sparkColors = new Float32Array(maxSparks * 3);

    interface SparkItem {
      x: number;
      y: number;
      z: number;
      vx: number;
      vy: number;
      vz: number;
      life: number;
      decay: number;
      baseColor: THREE.Color;
    }

    const sparks: SparkItem[] = [];
    const sparkPalette = [
      new THREE.Color('#00f0ff'), // cyan
      new THREE.Color('#38bdf8'), // sky
      new THREE.Color('#ec4899'), // neon pink
      new THREE.Color('#a855f7'), // purple
      new THREE.Color('#ffffff')  // white
    ];

    for (let s = 0; s < maxSparks; s++) {
      sparkPositions[s * 3] = 0;
      sparkPositions[s * 3 + 1] = -999;
      sparkPositions[s * 3 + 2] = 0;

      sparkColors[s * 3] = 0;
      sparkColors[s * 3 + 1] = 0;
      sparkColors[s * 3 + 2] = 0;

      sparks.push({
        x: 0,
        y: -999,
        z: 0,
        vx: 0,
        vy: 0,
        vz: 0,
        life: 0,
        decay: 0.024,
        baseColor: sparkPalette[s % sparkPalette.length]
      });
    }

    sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPositions, 3));
    sparkGeo.setAttribute('color', new THREE.BufferAttribute(sparkColors, 3));

    const sparkMat = new THREE.PointsMaterial({
      map: sparkTexture,
      size: 0.18,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.95,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const sparkPoints = new THREE.Points(sparkGeo, sparkMat);
    scene.add(sparkPoints);

    let sparkIndex = 0;
    const lastCursorPos = new THREE.Vector2(-999, -999);

    const emitSparksAtCursor = (normX: number, normY: number, count = 2) => {
      const vector = new THREE.Vector3(normX, normY, 0.5);
      vector.unproject(camera);
      const dir = vector.sub(camera.position).normalize();

      raycaster.setFromCamera(new THREE.Vector2(normX, normY), camera);
      const hits = raycaster.intersectObjects(displayCases.map(d => d.collider));
      const depth = hits.length > 0 && hits[0].distance ? Math.min(hits[0].distance - 0.05, 4.2) : 3.4;

      const origin = camera.position.clone().add(dir.multiplyScalar(depth));

      for (let c = 0; c < count; c++) {
        sparkIndex = (sparkIndex + 1) % maxSparks;
        const sp = sparks[sparkIndex];
        const color = sparkPalette[Math.floor(Math.random() * sparkPalette.length)];

        sp.x = origin.x + (Math.random() - 0.5) * 0.09;
        sp.y = origin.y + (Math.random() - 0.5) * 0.09;
        sp.z = origin.z + (Math.random() - 0.5) * 0.09;

        sp.vx = (Math.random() - 0.5) * 0.018;
        sp.vy = (Math.random() - 0.5) * 0.018 + 0.004;
        sp.vz = (Math.random() - 0.5) * 0.018;

        sp.life = 1.0;
        sp.decay = 0.024 + Math.random() * 0.012; // lingers ~30 to 45 frames (0.5 to 0.75 seconds)
        sp.baseColor = color;
      }
    };

    // 13. CYBER WAVE CHAMBER (Fluid Hydrodynamics Wave Lab & Barreling Surfing Simulation)
    const waveChamberGroup = new THREE.Group();
    waveChamberGroup.position.set(38, 0, -14);
    scene.add(waveChamberGroup);

    // Gantry Observation Deck
    const gantryGeo = new THREE.BoxGeometry(7, 0.3, 5);
    const gantryMat = new THREE.MeshStandardMaterial({ color: '#030816', roughness: 0.4, metalness: 0.8 });
    const gantryMesh = new THREE.Mesh(gantryGeo, gantryMat);
    gantryMesh.position.set(-14, 5.0, 9);
    waveChamberGroup.add(gantryMesh);

    // Gantry Railing with glowing cyan top rail
    const railGeo = new THREE.BoxGeometry(7, 0.9, 0.08);
    const railMat = new THREE.MeshBasicMaterial({ color: '#00f0ff', transparent: true, opacity: 0.65 });
    const railMesh = new THREE.Mesh(railGeo, railMat);
    railMesh.position.set(-14, 5.5, 11.4);
    waveChamberGroup.add(railMesh);

    // Underwater Bathymetry Reef Platform Grid (The shallow coral/rock shelf triggering the barrel)
    const reefGeo = new THREE.PlaneGeometry(42, 32, 42, 32);
    const reefMat = new THREE.MeshBasicMaterial({
      color: '#0891b2',
      wireframe: true,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending
    });
    const reefMesh = new THREE.Mesh(reefGeo, reefMat);
    reefMesh.rotation.x = -Math.PI / 2;
    reefMesh.position.y = -0.15;
    waveChamberGroup.add(reefMesh);

    // Bathymetry Iso-depth Contour Steps
    const stepCount = 5;
    for (let st = 0; st < stepCount; st++) {
      const stepGeo = new THREE.BoxGeometry(36 - st * 3.5, 0.25, 5);
      const stepMat = new THREE.MeshBasicMaterial({
        color: st === 0 ? '#f43f5e' : st === 1 ? '#f59e0b' : '#00f0ff',
        wireframe: true,
        transparent: true,
        opacity: 0.45 - st * 0.06
      });
      const step = new THREE.Mesh(stepGeo, stepMat);
      step.position.set(0, -st * 0.45 - 0.25, -4 + st * 4);
      waveChamberGroup.add(step);
    }

    // THE BARRELING WAVE MESH & CYBER GRID
    const waveSegmentsU = 72; // along wave depth (trough -> face -> crest -> curl)
    const waveSegmentsV = 56; // along peel line (X axis)
    const waveWidth = 36;
    const waveDepth = 26;
    const waveGeo = new THREE.PlaneGeometry(waveWidth, waveDepth, waveSegmentsV, waveSegmentsU);
    const origWavePositions = (waveGeo.attributes.position.array as Float32Array).slice();

    // Solid Wave Material (Translucent glowing oceanic water)
    const waveSolidMat = new THREE.MeshPhysicalMaterial({
      color: '#0284c7',
      emissive: '#0369a1',
      emissiveIntensity: 0.45,
      roughness: 0.08,
      metalness: 0.1,
      transmission: 0.72,
      transparent: true,
      opacity: 0.75,
      ior: 1.333,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const waveMesh = new THREE.Mesh(waveGeo, waveSolidMat);
    waveMesh.rotation.x = -Math.PI / 2;
    waveChamberGroup.add(waveMesh);

    // Cyber Grid Wireframe Overlay (The glowing scientific matrix grid)
    const waveGridMat = new THREE.MeshBasicMaterial({
      color: '#00f0ff',
      wireframe: true,
      transparent: true,
      opacity: 0.78,
      blending: THREE.AdditiveBlending
    });
    const waveGridMesh = new THREE.Mesh(waveGeo, waveGridMat);
    waveGridMesh.rotation.x = -Math.PI / 2;
    waveChamberGroup.add(waveGridMesh);

    // Lip Crest Glowing Line (High-intensity neon rim along the curling lip)
    const lipCurvePoints = waveSegmentsV + 1;
    const lipPositions = new Float32Array(lipCurvePoints * 3);
    const lipGeo = new THREE.BufferGeometry();
    lipGeo.setAttribute('position', new THREE.BufferAttribute(lipPositions, 3));
    const lipMat = new THREE.LineBasicMaterial({
      color: '#38bdf8',
      linewidth: 3,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending
    });
    const lipLine = new THREE.Line(lipGeo, lipMat);
    lipLine.rotation.x = -Math.PI / 2;
    waveChamberGroup.add(lipLine);

    // Hydraulic Spit / Spray Particle System (Blasting out of the barrel mouth!)
    const spitCount = 160;
    const spitGeo = new THREE.BufferGeometry();
    const spitPositions = new Float32Array(spitCount * 3);
    const spitVelocities: THREE.Vector3[] = [];
    const spitLifetimes = new Float32Array(spitCount);

    for (let sp = 0; sp < spitCount; sp++) {
      spitPositions[sp * 3] = 0;
      spitPositions[sp * 3 + 1] = -100;
      spitPositions[sp * 3 + 2] = 0;
      spitVelocities.push(new THREE.Vector3(0, 0, 0));
      spitLifetimes[sp] = Math.random();
    }
    spitGeo.setAttribute('position', new THREE.BufferAttribute(spitPositions, 3));

    const spitMat = new THREE.PointsMaterial({
      color: '#ffffff',
      size: 0.35,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const spitParticles = new THREE.Points(spitGeo, spitMat);
    waveChamberGroup.add(spitParticles);

    // Chamber Ambient Downlight & Tube Spotlight
    const waveSpotLight = new THREE.SpotLight('#00f0ff', 4.5, 38, Math.PI / 4, 0.4);
    waveSpotLight.position.set(0, 16, 8);
    waveSpotLight.target.position.set(0, 2, -2);
    waveChamberGroup.add(waveSpotLight);
    waveChamberGroup.add(waveSpotLight.target);

    const barrelTubeLight = new THREE.PointLight('#38bdf8', 3.0, 18);
    barrelTubeLight.position.set(0, 3, -1);
    waveChamberGroup.add(barrelTubeLight);

    // 12. Pointer Interaction & Raycasting
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      mouseParallaxRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 0.35,
        y: (e.clientY / window.innerHeight - 0.5) * 0.2
      };

      // Emit holographic spark trail as cursor traverses 3D space
      const dist = Math.hypot(mouse.x - lastCursorPos.x, mouse.y - lastCursorPos.y);
      if (dist > 0.007) {
        emitSparksAtCursor(mouse.x, mouse.y, Math.min(4, Math.max(1, Math.round(dist * 40))));
        lastCursorPos.copy(mouse);
      }

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(displayCases.map(d => d.collider));

      if (intersects.length > 0) {
        const hitTier = (intersects[0].object as any).tierData as TierItem;
        if (hitTier) {
          setHoveredTierId(hitTier.id);
          container.style.cursor = 'pointer';
          return;
        }
      }
      setHoveredTierId(null);
      container.style.cursor = 'default';
    };

    const handlePointerUp = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(displayCases.map(d => d.collider));

      if (intersects.length > 0) {
        const hitTier = (intersects[0].object as any).tierData as TierItem;
        if (hitTier) {
          onSelectTier(hitTier);
        }
      }
    };

    // Scroll-to-zoom wheel event handler
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      // Sensitivity calibrated for smooth trackpad and mouse wheel scroll
      const delta = -e.deltaY * 0.0022;
      const isTierFocus = viewModeRef.current === 'tier1' || viewModeRef.current === 'tier2' || viewModeRef.current === 'tier3';
      const maxZoom = isTierFocus ? 1.85 : 2.5;
      const minZoom = isTierFocus ? -0.8 : -1.5;

      targetZoomRef.current = THREE.MathUtils.clamp(
        targetZoomRef.current + delta,
        minZoom,
        maxZoom
      );
    };

    // Pinch-to-zoom touch handlers for mobile / trackpad
    let initialPinch = 0;
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        initialPinch = Math.hypot(dx, dy);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        const rect = container.getBoundingClientRect();
        const tx = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
        const ty = -((touch.clientY - rect.top) / rect.height) * 2 + 1;
        emitSparksAtCursor(tx, ty, 2);
      } else if (e.touches.length === 2) {
        e.preventDefault();
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const currentDist = Math.hypot(dx, dy);
        const delta = (currentDist - initialPinch) * 0.012;
        initialPinch = currentDist;

        const isTierFocus = viewModeRef.current === 'tier1' || viewModeRef.current === 'tier2' || viewModeRef.current === 'tier3';
        const maxZoom = isTierFocus ? 1.85 : 2.5;
        const minZoom = isTierFocus ? -0.8 : -1.5;

        targetZoomRef.current = THREE.MathUtils.clamp(
          targetZoomRef.current + delta,
          minZoom,
          maxZoom
        );
      }
    };

    container.addEventListener('mousemove', handlePointerMove);
    container.addEventListener('click', handlePointerUp);
    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });

    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // 10. 60 FPS Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Camera dolly zoom along lookAt direction vector
      currentZoomRef.current = THREE.MathUtils.lerp(currentZoomRef.current, targetZoomRef.current, 0.08);

      if (onZoomChange) {
        onZoomChange(currentZoomRef.current);
      }

      // Camera position with smooth parallax
      const targetPos = targetCamPosRef.current.clone();
      targetPos.x += mouseParallaxRef.current.x;
      targetPos.y -= mouseParallaxRef.current.y;

      // Gently pull the camera closer to the selected display case along line of sight
      const forwardDir = currentLookAtRef.current.clone().sub(targetPos).normalize();
      targetPos.addScaledVector(forwardDir, currentZoomRef.current);

      camera.position.lerp(targetPos, 0.06);
      currentLookAtRef.current.lerp(targetLookAtRef.current, 0.06);
      camera.lookAt(currentLookAtRef.current);

      // Dynamic Atmospheric Fog Controller & Depth-of-Field Zoom Falloff
      const isAquarium = viewModeRef.current === 'aquarium';
      const isHorizon = viewModeRef.current === 'horizon';
      const isCaseFocus = viewModeRef.current === 'tier1' || viewModeRef.current === 'tier2' || viewModeRef.current === 'tier3';

      const currentPreset = LIGHTING_PRESETS[lightingPresetRef.current] || LIGHTING_PRESETS['holographic-blue'];

      let baseDensity = 0.040;
      let targetFogHex = currentPreset.fogColor;

      if (isAquarium) {
        baseDensity = 0.055;
        targetFogHex = '#021324'; // Oceanic deep cyan mist
      } else if (isHorizon) {
        baseDensity = 0.026;
        targetFogHex = '#020412';
      } else if (isCaseFocus) {
        baseDensity = 0.045;
        targetFogHex = currentPreset.bgBaseColor;
      }

      // Intensifies the depth-of-field as the user zooms into specific 3D display cases
      const zoomFactor = Math.max(0, currentZoomRef.current);
      let dofMultiplier = 1.0;

      if (dofEnabledRef.current) {
        if (isCaseFocus) {
          // As camera dollies close to the e-book cover, background fades deeper into oceanic haze
          dofMultiplier += zoomFactor * 0.95;
        } else if (isAquarium) {
          // Inside aquarium tunnel, zooming pulls distant waters and creatures into abyssal haze
          dofMultiplier += zoomFactor * 0.85;
        }
      }

      const finalTargetDensity = baseDensity * (fogDensityRef.current || 1.0) * dofMultiplier;

      const expFog = scene.fog as THREE.FogExp2;
      if (expFog) {
        expFog.density = THREE.MathUtils.lerp(expFog.density, finalTargetDensity, 0.05);
        const targetCol = new THREE.Color(targetFogHex);
        expFog.color.lerp(targetCol, 0.04);
        (scene.background as THREE.Color).lerp(targetCol, 0.04);
      }

      // Depth-of-field optical falloff on aquarium portal backdrop
      if (portalBackdropMat) {
        const targetBackdropOpacity = isCaseFocus && dofEnabledRef.current
          ? Math.max(0.25, 0.85 - zoomFactor * 0.3)
          : 0.85;
        portalBackdropMat.opacity = THREE.MathUtils.lerp(portalBackdropMat.opacity, targetBackdropOpacity, 0.06);
      }

      // Dynamic Global Lighting Preset Interpolation
      const audio = soundEngine.getAudioReactiveData();
      const bloom = bloomRef.current;

      const targetAmbient = new THREE.Color(currentPreset.ambientColor);
      const targetKey = new THREE.Color(currentPreset.keyLightColor);
      const targetFill = new THREE.Color(currentPreset.fillLightColor);
      const targetCenter = new THREE.Color(currentPreset.centerGlowColor);
      const targetGrid = new THREE.Color(currentPreset.gridColor);
      const targetSun = new THREE.Color(currentPreset.sunColor);
      const targetSunRing = new THREE.Color(currentPreset.sunRingColor);

      ambientLight.color.lerp(targetAmbient, 0.05);
      const pulseSpeed = 1.35;
      const pulseAmplitude = 0.16;
      const ambientPulse = Math.sin(elapsedTime * pulseSpeed) * pulseAmplitude + (audio.bass * 0.12);
      const targetAmbientIntensity = currentPreset.ambientIntensity * (1.0 + ambientPulse);
      ambientLight.intensity = THREE.MathUtils.lerp(ambientLight.intensity, targetAmbientIntensity, 0.06);

      keyLight.color.lerp(targetKey, 0.05);
      keyLight.intensity = THREE.MathUtils.lerp(keyLight.intensity, currentPreset.keyLightIntensity, 0.05);

      fillLight.color.lerp(targetFill, 0.05);
      fillLight.intensity = THREE.MathUtils.lerp(fillLight.intensity, currentPreset.fillLightIntensity, 0.05);

      centerGlow.color.lerp(targetCenter, 0.05);
      centerGlow.intensity = THREE.MathUtils.lerp(
        centerGlow.intensity,
        currentPreset.centerGlowIntensity * (0.8 + bloom * 0.3 + audio.bass * 0.8),
        0.06
      );

      portalRimMat.color.lerp(targetGrid, 0.05);
      sunMat.color.lerp(targetSun, 0.05);
      sunRingMat.color.lerp(targetSunRing, 0.05);

      if (gridHelper.material) {
        if (Array.isArray(gridHelper.material)) {
          (gridHelper.material[0] as THREE.LineBasicMaterial).color.lerp(targetGrid, 0.05);
        } else {
          (gridHelper.material as THREE.LineBasicMaterial).color.lerp(targetGrid, 0.05);
        }
      }

      renderer.toneMappingExposure = THREE.MathUtils.lerp(
        renderer.toneMappingExposure,
        currentPreset.exposure * (0.88 + bloom * 0.16 + audio.rawLevel * 0.18),
        0.06
      );

      // Animate PLASMA ENGINE (Reacts to Bass, Mids and High frequencies)
      outerPlasma.rotation.x += 0.008 + audio.high * 0.05;
      outerPlasma.rotation.y += 0.012 + audio.mid * 0.06;
      outerPlasma.scale.setScalar(1.0 + audio.bass * 0.45);
      innerPlasma.scale.setScalar(1.0 + audio.bass * 0.75);

      plasmaArcs.forEach((arc, aIdx) => {
        arc.rotation.z += (0.015 + aIdx * 0.006) + audio.high * 0.08;
        arc.rotation.x += 0.01 + audio.mid * 0.04;
      });
      plasmaLight.intensity = (1.4 + audio.bass * 3.8) * bloom;

      // Animate HORIZON ENGINE (Terrain wave undulation & Neon Sun pulse)
      const hPos = horizonGeo.attributes.position.array as Float32Array;
      const vertCount = hPos.length / 3;
      for (let k = 0; k < vertCount; k++) {
        const idx = k * 3;
        const origX = horizonOrigPos[idx];
        const origY = horizonOrigPos[idx + 1];
        // Traveling cybernetic terrain wave amplified by Raw Proof sub-bass
        const wave = Math.sin(origX * 0.22 + elapsedTime * 3.4) * Math.cos(origY * 0.16 + elapsedTime * 2.2);
        hPos[idx + 2] = wave * (0.8 + audio.bass * 3.8);
      }
      horizonGeo.attributes.position.needsUpdate = true;

      horizonSun.scale.setScalar(1.0 + audio.bass * 0.35);
      horizonSunRing.scale.setScalar(1.0 + audio.bass * 0.55);
      (horizonSun.material as THREE.MeshBasicMaterial).opacity = Math.min(1.0, 0.7 + audio.mid * 0.3);

      // Animate Display Cases & Sovereign Books with Audio Reactive Accents
      displayCases.forEach((item, index) => {
        const isHovered = hoveredTierId === item.tier.id;
        const speed = 0.8 + index * 0.15;

        const floatOffset = Math.sin(elapsedTime * speed + index * 2) * 0.08;
        item.bookMesh.position.y = 1.75 + floatOffset + (isHovered ? 0.12 : 0);
        item.bookMesh.rotation.y = -0.25 + Math.sin(elapsedTime * 0.5 + index) * 0.35 + (isHovered ? elapsedTime * 0.6 : 0);

        // Orbiting halo rings with audio-reactive spin & opacity
        item.haloRings.forEach((halo, hIndex) => {
          halo.rotation.z = elapsedTime * (hIndex === 0 ? (0.6 + audio.mid * 0.8) : (-0.8 - audio.mid * 0.8));
          halo.position.y = 1.75 + floatOffset;
          (halo.material as THREE.MeshBasicMaterial).opacity = Math.min(1.0, (0.65 + audio.mid * 0.35) * bloom);
        });

        // Pulsing pedestal floor ring and neon edge wireframe driven by 808 sub drops
        const pulse = Math.sin(elapsedTime * 2.5 + index) * 0.15 + 0.45;
        (item.pedestalGlow.material as THREE.MeshBasicMaterial).opacity = Math.min(1.0, (isHovered ? 0.95 : (pulse + audio.bass * 0.45)) * bloom);
        (item.caseGlass.material as THREE.MeshPhysicalMaterial).opacity = Math.min(0.4, (isHovered ? 0.24 : 0.14) * (0.6 + bloom * 0.4));
        (item.wireframe.material as THREE.LineBasicMaterial).opacity = Math.min(1.0, (0.55 + audio.high * 0.45) * bloom);
      });

      // Animate Aquarium Creatures (Strictly ABOVE and OUTSIDE the pedestrian tunnel)
      // A. Manta Rays soaring majestically above the glass arch
      mantaRays.forEach((manta, mIndex) => {
        const flap = Math.sin(elapsedTime * 3.2 + manta.phase) * 0.32;
        manta.leftWing.rotation.z = flap;
        manta.rightWing.rotation.z = -flap;

        // Circular sweeping trajectory soaring smoothly ABOVE the tunnel arch
        const angle = elapsedTime * 0.22 * manta.speed + manta.phase;
        manta.group.position.x = Math.sin(angle) * 4.6;
        manta.group.position.z = -14 + Math.cos(angle) * 8.5;
        // Strictly maintains height above arch apex 3.65 (y stays between 4.55 and 5.65)
        manta.group.position.y = 5.1 + Math.sin(elapsedTime * 0.65 + mIndex) * 0.55;
        manta.group.rotation.y = angle + Math.PI / 2;
        manta.group.rotation.x = Math.cos(angle) * 0.08;
        manta.group.rotation.z = Math.sin(angle) * 0.12;
      });

      // B. Neon Fish School (Overhead school strictly above dome, flank school outside walls)
      fishSchool.forEach((fish) => {
        const swimAngle = elapsedTime * fish.speed + fish.offset;
        if (fish.isOverhead) {
          fish.mesh.position.x = fish.basePos.x + Math.sin(swimAngle) * 1.6;
          // Strictly maintains height above glass apex (y >= 4.2)
          fish.mesh.position.y = Math.max(4.2, fish.basePos.y + Math.cos(swimAngle * 1.3) * 0.35);
          fish.mesh.position.z = fish.basePos.z + Math.cos(swimAngle) * 1.2;
        } else {
          // Flank fish outside the side glass (|x| >= 4.6)
          const sideSign = Math.sign(fish.basePos.x);
          fish.mesh.position.x = sideSign * Math.max(4.6, Math.abs(fish.basePos.x) + Math.sin(swimAngle) * 0.8);
          fish.mesh.position.y = fish.basePos.y + Math.cos(swimAngle * 1.2) * 0.3;
          fish.mesh.position.z = fish.basePos.z + Math.cos(swimAngle) * 1.1;
        }
        fish.mesh.rotation.y = Math.sin(swimAngle * 2) * 0.25;
      });

      // C. Jellyfish Contraction & Drift strictly above tunnel dome
      jellyfish.forEach((jelly) => {
        const pulse = Math.sin(elapsedTime * 2.2 + jelly.phase);
        const scaleVal = 1.0 + Math.max(0, pulse) * 0.35;
        jelly.group.scale.set(scaleVal, 1.0 / (scaleVal * 0.85), scaleVal);
        jelly.group.position.y = Math.max(4.4, jelly.basePos.y + Math.sin(elapsedTime * 0.6 + jelly.phase) * 0.4);
      });

      // Animate Sparkly Water Surface Overhead (Wave ripples & diamond sun glints)
      const wPos = waterSurfaceGeo.attributes.position.array as Float32Array;
      const wVertCount = wPos.length / 3;
      for (let k = 0; k < wVertCount; k++) {
        const idx = k * 3;
        const origX = waterOrigPositions[idx];
        const origY = waterOrigPositions[idx + 1];
        // Gentle ocean ripple waves
        const wave1 = Math.sin(origX * 0.45 + elapsedTime * 1.8) * 0.15;
        const wave2 = Math.cos(origY * 0.35 + elapsedTime * 2.2) * 0.12;
        wPos[idx + 2] = wave1 + wave2;
      }
      waterSurfaceGeo.attributes.position.needsUpdate = true;

      // Twinkling water sparkles on the top surface
      const spArray = waterSparkleGeo.attributes.position.array as Float32Array;
      for (let s = 0; s < waterSparkleCount; s++) {
        const sIdx = s * 3;
        // Subtle drift with water currents
        spArray[sIdx] += Math.sin(elapsedTime * 0.5 + waterSparklePhases[s]) * 0.003;
        spArray[sIdx + 2] += Math.cos(elapsedTime * 0.4 + waterSparklePhases[s]) * 0.003;
      }
      waterSparkleGeo.attributes.position.needsUpdate = true;
      waterSparkleMat.opacity = Math.min(1.0, 0.75 + Math.sin(elapsedTime * 3.2) * 0.2 + (audio.high * 0.25));

      // Sunbeam shafts gentle waver and pulse
      sunbeams.forEach((beam, bIdx) => {
        beam.rotation.z = Math.sin(elapsedTime * 0.8 + bIdx) * 0.08;
        (beam.material as THREE.MeshBasicMaterial).opacity = 0.08 + Math.sin(elapsedTime * 1.5 + bIdx) * 0.04 + (audio.mid * 0.05);
      });

      // Caustic floor shimmer
      causticFloor.material.opacity = 0.18 + Math.sin(elapsedTime * 2) * 0.08;

      // Animate CYBER WAVE CHAMBER (Fluid Hydrodynamics Wave Lab & Barreling Surfing Simulation)
      const currentWaveHeight = Math.max(0.6, (waveHeightRef.current || 18) * 0.3048); // convert ft to meters
      const isLeft = waveDirectionRef.current === 'left';
      const activeSpot = WAVE_SPOTS.find(s => s.id === waveSpotIdRef.current) || WAVE_SPOTS[0];

      // Dynamic color interpolation based on active spot
      waveGridMat.color.lerp(new THREE.Color(activeSpot.colorScheme.gridColor), 0.06);
      lipMat.color.lerp(new THREE.Color(activeSpot.colorScheme.lipColor), 0.06);
      waveSolidMat.emissive.lerp(new THREE.Color(activeSpot.colorScheme.waterEmissive), 0.06);
      waveSpotLight.color.lerp(new THREE.Color(activeSpot.colorScheme.gridColor), 0.06);

      const wArray = waveGeo.attributes.position.array as Float32Array;
      const vSegments = waveSegmentsV;
      const uSegments = waveSegmentsU;
      let lipIdx = 0;
      const swellPhase = elapsedTime * 1.5;

      for (let iy = 0; iy <= uSegments; iy++) {
        // u goes from 0 (deep water flats) to 1.0 (curling lip & barrel)
        const u = iy / uSegments;

        for (let ix = 0; ix <= vSegments; ix++) {
          const vertIdx = (iy * (vSegments + 1) + ix) * 3;
          // v goes from 0 to 1 along peel line
          const rawV = ix / vSegments;
          const v = isLeft ? rawV : (1.0 - rawV);

          const origX = origWavePositions[vertIdx];
          const origY = origWavePositions[vertIdx + 1];

          // Peel taper along reef
          const peelProfile = Math.sin(Math.min(1.0, Math.max(0.0, (v + 0.18) * 1.05)) * Math.PI);
          const localH = currentWaveHeight * (0.35 + 0.65 * peelProfile);

          let defX = origX;
          let defY = origY;
          let defZ = 0;

          if (u < 0.38) {
            // Trough drawdown and shoaling swell approach
            const troughFactor = Math.sin((u / 0.38) * Math.PI);
            defZ = -localH * 0.18 * troughFactor;
            defZ += Math.sin(origX * 0.4 + origY * 0.5 + swellPhase) * 0.08 * (1.0 + audio.bass * 0.4);
          } else if (u <= 0.70) {
            // Steep Shoaling Face (Accelerating upwards as reef shallows)
            const t = (u - 0.38) / 0.32;
            const steepness = Math.pow(t, 2.0);
            defZ = localH * steepness;
            // Drawback suction pulling water into the face
            defY = origY - localH * 0.28 * Math.pow(t, 1.5);
            // Traveling face ribs
            defZ += Math.sin(origX * 0.8 - defZ * 1.2 + swellPhase * 1.6) * 0.05;
          } else {
            // The Curling Lip & Cylindrical Barrel!
            const t = (u - 0.70) / 0.30;
            const curlAngle = t * (1.38 * Math.PI); // up to ~250 degrees
            const barrelRadius = Math.max(0.35, localH * 0.42);

            // Audio sub-bass puffs the barrel tube outward
            const audioInflate = 1.0 + audio.bass * 0.18;
            const r = barrelRadius * audioInflate;

            const crestZ = localH;
            const crestY = origY - localH * 0.28;

            // Pitching forward in local +Y and curling downward in local -Z
            defZ = crestZ + r * Math.sin(curlAngle);
            defY = crestY + r * (1.0 - Math.cos(curlAngle)) + t * localH * 0.32;

            // Track lip line at apex of curl (t ~ 0.5 - 0.7)
            if (t > 0.52 && t < 0.64 && iy === Math.round(uSegments * 0.85)) {
              if (lipIdx < lipCurvePoints) {
                const lIdx = lipIdx * 3;
                lipPositions[lIdx] = defX;
                lipPositions[lIdx + 1] = defY;
                lipPositions[lIdx + 2] = defZ + 0.06;
                lipIdx++;
              }
            }
          }

          wArray[vertIdx] = defX;
          wArray[vertIdx + 1] = defY;
          wArray[vertIdx + 2] = defZ;
        }
      }
      waveGeo.attributes.position.needsUpdate = true;
      waveGeo.computeVertexNormals();
      lipGeo.attributes.position.needsUpdate = true;

      // Animate Hydraulic Spit / Spray Particles
      const spitPos = spitGeo.attributes.position.array as Float32Array;
      const mouthX = (isLeft ? -4.5 : 4.5);
      const mouthY = -2.2;
      const mouthZ = currentWaveHeight * 0.58;

      for (let sp = 0; sp < spitCount; sp++) {
        const s3 = sp * 3;
        spitLifetimes[sp] += 0.038;

        if (spitLifetimes[sp] > 1.0) {
          spitLifetimes[sp] = 0;
          spitPos[s3] = mouthX + (Math.random() - 0.5) * 1.8;
          spitPos[s3 + 1] = mouthY + (Math.random() - 0.5) * 1.2;
          spitPos[s3 + 2] = mouthZ + (Math.random() - 0.5) * 1.0;

          // Velocity shooting forward along peel direction and out the mouth
          const xDir = (isLeft ? -1 : 1) * (0.12 + Math.random() * 0.25);
          const yDir = 0.28 + Math.random() * 0.35 + audio.bass * 0.25;
          const zDir = (Math.random() - 0.4) * 0.12;
          spitVelocities[sp].set(xDir, yDir, zDir);
        } else {
          const vel = spitVelocities[sp];
          spitPos[s3] += vel.x;
          spitPos[s3 + 1] += vel.y;
          spitPos[s3 + 2] += vel.z;
          vel.x *= 0.98;
          vel.y *= 0.97;
          vel.z -= 0.003;
        }
      }
      spitGeo.attributes.position.needsUpdate = true;
      spitMat.opacity = Math.min(0.9, (0.45 + audio.high * 0.35) * bloom);

      // Animate 3D Holographic Particle Dust in Main Exhibition Room
      const dPositions = dustGeo.attributes.position.array as Float32Array;
      const bassLift = 1.0 + audio.bass * 0.85;

      for (let i = 0; i < dustCount; i++) {
        const idx = i * 3;
        const phase = dustPhases[i];

        // Vertical convection drift with audio kick responsiveness
        dPositions[idx + 1] += dustSpeeds[i] * bassLift;

        // Gentle Brownian horizontal oscillation
        dPositions[idx] += Math.sin(elapsedTime * 0.45 + phase) * 0.0022;
        dPositions[idx + 2] += Math.cos(elapsedTime * 0.35 + phase * 1.3) * 0.0018;

        // Continuous seamless recycling back to the floor
        if (dPositions[idx + 1] > 4.25) {
          dPositions[idx + 1] = 0.15;
          dPositions[idx] = (Math.random() - 0.5) * 11;
          dPositions[idx + 2] = -1.8 + Math.random() * 11.5;
        }
      }
      dustGeo.attributes.position.needsUpdate = true;

      // Holographic dust opacity pulsing with audio mids and bloom
      dustMat.opacity = Math.min(0.75, (0.35 + audio.mid * 0.22) * (0.8 + bloom * 0.3));

      // Animate Interactive Holographic Spark Mouse Trails
      const sPositions = sparkGeo.attributes.position.array as Float32Array;
      const sColors = sparkGeo.attributes.color.array as Float32Array;

      for (let s = 0; s < maxSparks; s++) {
        const sp = sparks[s];
        const idx = s * 3;

        if (sp.life > 0) {
          sp.life -= sp.decay;
          sp.x += sp.vx;
          sp.y += sp.vy;
          sp.z += sp.vz;
          sp.vy -= 0.00015; // gentle micro-gravity drift

          sPositions[idx] = sp.x;
          sPositions[idx + 1] = sp.y;
          sPositions[idx + 2] = sp.z;

          // Quadratic decay for smooth ethereal fade
          const alphaFade = Math.max(0, sp.life * sp.life);
          sColors[idx] = sp.baseColor.r * alphaFade;
          sColors[idx + 1] = sp.baseColor.g * alphaFade;
          sColors[idx + 2] = sp.baseColor.b * alphaFade;
        } else {
          sPositions[idx + 1] = -999;
          sColors[idx] = 0;
          sColors[idx + 1] = 0;
          sColors[idx + 2] = 0;
        }
      }
      sparkGeo.attributes.position.needsUpdate = true;
      sparkGeo.attributes.color.needsUpdate = true;
      sparkMat.opacity = Math.min(1.0, 0.95 * (0.8 + bloom * 0.3));

      // Animate 3D Frequency-Reactive Equalizer Bars & Acoustic Pulse Ring
      const freqBins = soundEngine.getFrequencyBins();
      eqBars.forEach((bar, bIdx) => {
        const binVal = (freqBins[bIdx % freqBins.length] || 0) / 255;
        const targetScaleY = Math.max(0.08, binVal * 1.85 * (0.7 + bloom * 0.4));
        bar.scale.y = THREE.MathUtils.lerp(bar.scale.y, targetScaleY, 0.25);
        (bar.material as THREE.MeshBasicMaterial).opacity = Math.min(1.0, (0.4 + binVal * 0.6) * bloom);
      });

      acousticRing.scale.setScalar(1.0 + audio.bass * 0.45);
      (acousticRing.material as THREE.MeshBasicMaterial).opacity = Math.min(1.0, (0.3 + audio.bass * 0.7) * bloom);

      // Portal gentle rotation
      portalRim.rotation.z = (Math.PI / 4) + Math.sin(elapsedTime * 0.5) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handlePointerMove);
      container.removeEventListener('click', handlePointerUp);
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 w-full h-full overflow-hidden select-none bg-black"
    />
  );
};
