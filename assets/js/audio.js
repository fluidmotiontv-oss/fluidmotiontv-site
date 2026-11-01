/* Dragon 9 anthem player — "Beneath The Iron Tooth" (replaces the old 432 Hz drone).
   The AUDIO toggle loads + plays the anthem loop and exposes an analyser on
   window.fmtvAudio so waves.js can dance to the music. */
(function () {
  const btn = document.querySelector(".audio-toggle");
  if (!btn) return;

  let audioCtx = null;
  let masterGain = null;
  let source = null;
  let isPlaying = false;
  let loading = false;

  function ensureCtx() {
    if (audioCtx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    audioCtx = new AC();
    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0, audioCtx.currentTime);

    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.8;
    const freqData = new Uint8Array(analyser.frequencyBinCount);

    masterGain.connect(analyser);
    analyser.connect(audioCtx.destination);

    // bridge for waves.js — the mesh reads this every frame
    window.fmtvAudio = { analyser: analyser, freqData: freqData };
  }

  async function startAnthem() {
    if (source || loading) return;
    loading = true;
    render("AUDIO: LOADING…");
    try {
      const res = await fetch("assets/Beneath_The_Iron_Tooth.mp3");
      const buf = await audioCtx.decodeAudioData(await res.arrayBuffer());
      source = audioCtx.createBufferSource();
      source.buffer = buf;
      source.loop = true;
      source.connect(masterGain);
      source.start();
    } catch (e) {
      render("AUDIO: N/A");
      btn.disabled = true;
      loading = false;
      return;
    }
    loading = false;
    render();
  }

  function render(override) {
    btn.setAttribute("aria-pressed", String(isPlaying));
    const full = btn.querySelector(".audio-label-full");
    const short = btn.querySelector(".audio-label-short");
    const text = override || (isPlaying ? "ANTHEM: PLAYING" : "ANTHEM: OFF");
    if (full) full.textContent = text;
    if (short) short.textContent = isPlaying ? "ANTHEM" : "OFF";
    if (!full && !short) btn.textContent = text;
  }

  btn.addEventListener("click", () => {
    ensureCtx();
    if (!audioCtx) {
      render("AUDIO: N/A");
      btn.disabled = true;
      return;
    }
    if (audioCtx.state === "suspended") audioCtx.resume();

    isPlaying = !isPlaying;
    if (isPlaying) {
      startAnthem();
      masterGain.gain.setTargetAtTime(0.3, audioCtx.currentTime, 0.5);
    } else {
      masterGain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.5);
    }
    render();
  });

  render();
})();
