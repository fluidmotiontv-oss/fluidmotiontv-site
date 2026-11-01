/* FluidMotion wave engine — adapted from the live fluidmotiontv.tech portal.
   Interactive Three.js wireframe wave grid with pointer ripples.
   Modes: "teal" (default) or "chromatic" (hue-cycling, used on the shop). */
(function () {
  const container = document.getElementById("wave-canvas");
  if (!container || typeof THREE === "undefined") return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mode = container.dataset.mode === "chromatic" ? "chromatic" : "teal";

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  } catch (e) {
    return; // poster-bg stays visible — never a dead black canvas
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 30, 50);
  camera.lookAt(0, 0, 0);

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.domElement.setAttribute("aria-hidden", "true");
  container.appendChild(renderer.domElement);

  const geometry = new THREE.PlaneGeometry(90, 90, 60, 60);
  geometry.rotateX(-Math.PI / 2);
  const material = new THREE.MeshBasicMaterial({
    color: 0x00ffcc,
    wireframe: true,
    transparent: true,
    opacity: 0.3,
  });
  const plane = new THREE.Mesh(geometry, material);
  scene.add(plane);

  const posAttribute = geometry.attributes.position;
  const mouse = new THREE.Vector2(-999, -999);
  const raycaster = new THREE.Raycaster();
  let rippleIntensity = 0;
  let rafId = null;

  window.addEventListener("pointermove", (e) => {
    if (reduced) return;
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    rippleIntensity = 5.0;
  });

  const clock = new THREE.Clock();

  function frame() {
    const time = clock.getElapsedTime() * 1.5;

    // anthem energy drives the mesh (fed by audio.js via window.fmtvAudio)
    let audioLevel = 0;
    let fbins = null;
    const A = window.fmtvAudio;
    if (A && A.analyser) {
      A.analyser.getByteFrequencyData(A.freqData);
      fbins = A.freqData;
      let sum = 0;
      for (let i = 0; i < fbins.length; i++) sum += fbins[i];
      audioLevel = sum / fbins.length / 255;
    }

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(plane);

    if (mode === "chromatic") {
      const hue = (time * 15) % 360;
      material.color.setHSL(hue / 360, 0.9, 0.6);
      material.opacity = 0.42 + audioLevel * 0.3;
    } else {
      material.color.setHex(0x00ffcc);
      material.opacity = 0.3 + audioLevel * 0.4;
    }

    for (let i = 0; i < posAttribute.count; i++) {
      const x = posAttribute.getX(i);
      const z = posAttribute.getZ(i);
      let wave = Math.sin(x * 0.1 + time) * Math.cos(z * 0.1 + time * 0.8) * (2.5 + audioLevel * 8);

      // per-vertex frequency energy — the mesh dances to the anthem
      if (audioLevel > 0.01 && fbins) {
        wave += (fbins[i % fbins.length] / 255) * audioLevel * 6;
      }

      if (intersects.length > 0) {
        const dx = x - intersects[0].point.x;
        const dz = z - intersects[0].point.z;
        const dist = Math.sqrt(dx * dx + dz * dz);
        if (dist < 18) {
          wave += Math.sin(dist * 0.4 - time * 6) * rippleIntensity * (1 - dist / 18);
        }
      }
      posAttribute.setY(i, wave);
    }
    posAttribute.needsUpdate = true;
    if (rippleIntensity > 0) rippleIntensity *= 0.94;

    renderer.render(scene, camera);
  }

  function loop() {
    rafId = requestAnimationFrame(loop);
    frame();
  }

  function start() {
    if (rafId === null && !reduced) loop();
  }
  function stop() {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  if (reduced) {
    frame(); // one static, composed frame — no animation loop
  } else {
    start();
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stop();
      else start();
    });
  }

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    if (reduced) frame();
  });
})();
