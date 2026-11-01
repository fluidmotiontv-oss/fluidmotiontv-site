/* Site chrome: mobile menu, service worker registration. */
(function () {
  // ---- mobile menu ----
  const menuBtn = document.querySelector(".menu-btn");
  const menu = document.getElementById("mobileMenu");
  const closeBtn = menu && menu.querySelector(".close-menu");

  function setMenu(open) {
    if (!menu || !menuBtn) return;
    menu.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    if (open) {
      const first = menu.querySelector("a");
      if (first) first.focus();
    } else {
      menuBtn.focus();
    }
  }

  if (menuBtn && menu) {
    menuBtn.addEventListener("click", () => setMenu(true));
    if (closeBtn) closeBtn.addEventListener("click", () => setMenu(false));
    menu.addEventListener("click", (e) => {
      if (e.target === menu) setMenu(false);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && menu.classList.contains("open")) setMenu(false);
    });
    menu.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => menu.classList.remove("open"))
    );
  }

  // ---- PWA service worker ----
  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("sw.js").catch(() => {
        /* offline support is progressive — never block the page */
      });
    });
  }
})();
