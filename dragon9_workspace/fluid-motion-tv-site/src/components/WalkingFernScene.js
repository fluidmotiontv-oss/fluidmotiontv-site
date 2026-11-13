import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class WalkingFernScene {
    constructor(containerElement) {
        this.container = containerElement;
        this.init();
    }

    init() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x05080a);
        this.scene.fog = new THREE.FogExp2(0x05080a, 0.035);

        this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.container.appendChild(this.renderer.domElement);

        this.camera = new THREE.PerspectiveCamera(48, this.container.clientWidth / this.container.clientHeight, 0.1, 1000);
        this.camera.position.set(0, 4, 15);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.maxPolarAngle = Math.PI / 2 - 0.05;
        this.controls.minDistance = 2;
        this.controls.maxDistance = 40;

        const ambientLight = new THREE.AmbientLight(0x0a192f, 1.2);
        this.scene.add(ambientLight);

        const keyLight = new THREE.DirectionalLight(0x64ffda, 2.0);
        keyLight.position.set(10, 20, 10);
        keyLight.castShadow = true;
        keyLight.shadow.mapSize.width = 2048;
        keyLight.shadow.mapSize.height = 2048;
        this.scene.add(keyLight);

        const fillLight = new THREE.DirectionalLight(0x1e3a8a, 1.0);
        fillLight.position.set(-15, 10, -10);
        this.scene.add(fillLight);

        this.createPathAndFlora();
        this.createAtmosphere();

        window.addEventListener('resize', this.onWindowResize.bind(this));
        this.clock = new THREE.Clock();
        this.animate();
    }

    createPathAndFlora() {
        const points = [
            new THREE.Vector3(0, 0, 10),
            new THREE.Vector3(-4, 0, 2),
            new THREE.Vector3(3, 0, -6),
            new THREE.Vector3(-2, 0, -14),
            new THREE.Vector3(0, 0, -24)
        ];
        this.curve = new THREE.CatmullRomCurve3(points);

        const tubeGeometry = new THREE.TubeGeometry(this.curve, 100, 1.2, 8, false);
        const trailMaterial = new THREE.MeshStandardMaterial({
            color: 0x111c24,
            roughness: 0.9,
            metalness: 0.1
        });
        const trailMesh = new THREE.Mesh(tubeGeometry, trailMaterial);
        trailMesh.receiveShadow = true;
        this.scene.add(trailMesh);

        const fernMaterial = new THREE.MeshStandardMaterial({
            color: 0x00b4d8,
            emissive: 0x0077b6,
            emissiveIntensity: 0.2,
            roughness: 0.4,
            side: THREE.DoubleSide
        });

        for (let i = 0; i <= 1.0; i += 0.05) {
            const point = this.curve.getPointAt(i);
            this.addFernFrond(point.clone().add(new THREE.Vector3(2.5, 0, 0)), fernMaterial);
            this.addFernFrond(point.clone().add(new THREE.Vector3(-2.5, 0, 0)), fernMaterial);
        }
    }

    addFernFrond(position, material) {
        const frondGroup = new THREE.Group();
        const bladeGeo = new THREE.ConeGeometry(0.3, 3, 4);
        bladeGeo.rotateX(Math.PI / 4);

        for (let j = 0; j < 5; j++) {
            const blade = new THREE.Mesh(bladeGeo, material);
            blade.position.set(j * 0.4, j * 0.2, 0);
            blade.rotation.z = (j - 2) * 0.25;
            blade.castShadow = true;
            frondGroup.add(blade);
        }

        frondGroup.position.copy(position);
        frondGroup.rotation.y = Math.random() * Math.PI * 2;
        this.scene.add(frondGroup);
    }

    createAtmosphere() {
        const particleCount = 600;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 40;
            positions[i + 1] = Math.random() * 8;
            positions[i + 2] = (Math.random() - 0.5) * 60;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const material = new THREE.PointsMaterial({
            color: 0x90e0ef,
            size: 0.08,
            transparent: true,
            opacity: 0.6
        });

        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }

    onWindowResize() {
        if (!this.container) return;
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        const delta = this.clock.getDelta();
        if (this.particles) {
            this.particles.rotation.y += delta * 0.02;
        }
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}
