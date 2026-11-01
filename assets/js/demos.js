/* Live demo gallery — three small self-contained Three.js scenes.
   Each pauses when scrolled out of view to protect the frame budget. */
(function () {
  if (typeof THREE === "undefined") return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function mountDemo(canvasId, build) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    } catch (e) {
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const width = canvas.clientWidth || 320;
    const height = canvas.clientHeight || 240;
    renderer.setSize(width, height, false);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 500);
    const tick = build(scene, camera);
    const clock = new THREE.Clock();

    let visible = true;
    let rafId = null;

    function frame() {
      const t = clock.getElapsedTime();
      tick(t);
      renderer.render(scene, camera);
    }
    function loop() {
      rafId = requestAnimationFrame(loop);
      frame();
    }
    function sync() {
      if (visible && !document.hidden && !reduced && rafId === null) loop();
      if ((!visible || document.hidden) && rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    }

    if ("IntersectionObserver" in window) {
      new IntersectionObserver((entries) => {
        visible = entries[0].isIntersecting;
        sync();
      }, { threshold: 0.05 }).observe(canvas);
    }
    document.addEventListener("visibilitychange", sync);

    if (reduced) frame();
    else sync();

    window.addEventListener("resize", () => {
      const w = canvas.clientWidth || 320;
      const h = canvas.clientHeight || 240;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
      if (reduced) frame();
    });
  }

  /* 1 — ripple grid (miniature of the portal background) */
  mountDemo("demo-ripple", (scene, camera) => {
    camera.position.set(0, 9, 15);
    camera.lookAt(0, 0, 0);
    const geo = new THREE.PlaneGeometry(30, 30, 34, 34);
    geo.rotateX(-Math.PI / 2);
    const mat = new THREE.MeshBasicMaterial({
      color: 0x00ffcc, wireframe: true, transparent: true, opacity: 0.4,
    });
    scene.add(new THREE.Mesh(geo, mat));
    const pos = geo.attributes.position;
    return (t) => {
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const z = pos.getZ(i);
        pos.setY(i, Math.sin(x * 0.4 + t * 1.6) * Math.cos(z * 0.4 + t * 1.2) * 1.4);
      }
      pos.needsUpdate = true;
    };
  });

  /* 2 — particle field (a drifting teal/magenta starfield) */
  mountDemo("demo-particles", (scene, camera) => {
    camera.position.set(0, 0, 26);
    const count = 900;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 34;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      color: 0x00ffcc, size: 0.16, transparent: true, opacity: 0.85,
    });
    const points = new THREE.Points(geo, mat);
    scene.add(points);
    return (t) => {
      points.rotation.y = t * 0.08;
      points.rotation.x = Math.sin(t * 0.15) * 0.12;
      const hue = (t * 12) % 360;
      mat.color.setHSL(hue / 360, 0.85, 0.65);
    };
  });

  /* 3 — torus knot (the magenta "private module" artifact) */
  mountDemo("demo-knot", (scene, camera) => {
    camera.position.set(0, 0, 9);
    const geo = new THREE.TorusKnotGeometry(2.6, 0.72, 110, 14);
    const mat = new THREE.MeshBasicMaterial({
      color: 0xff0055, wireframe: true, transparent: true, opacity: 0.55,
    });
    const knot = new THREE.Mesh(geo, mat);
    scene.add(knot);
    return (t) => {
      knot.rotation.x = t * 0.35;
      knot.rotation.y = t * 0.5;
    };
  });
})();
