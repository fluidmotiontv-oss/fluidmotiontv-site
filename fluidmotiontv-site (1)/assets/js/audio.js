/* 432 Hz ambient synth — Web Audio API, same voice as the .tech portal.
   Dual oscillators (108 Hz sine + 216 Hz triangle = 432 Hz harmonic stack). */
(function () {
  const btn = document.querySelector(".audio-toggle");
  if (!btn) return;

  let audioCtx = null;
  let masterGain = null;
  let isPlaying = false;

  function ensureCtx() {
    if (audioCtx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    audioCtx = new AC();
    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0, audioCtx.currentTime);
    masterGain.connect(audioCtx.destination);

    const osc1 = audioCtx.createOscillator();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(108, audioCtx.currentTime);
    osc1.connect(masterGain);
    osc1.start();

    const osc2 = audioCtx.createOscillator();
    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(216, audioCtx.currentTime);
    osc2.connect(masterGain);
    osc2.start();

    // slow shimmer LFO on the gain for a "breathing" bed
    const lfo = audioCtx.createOscillator();
    const lfoGain = audioCtx.createGain();
    lfo.frequency.setValueAtTime(0.08, audioCtx.currentTime);
    lfoGain.gain.setValueAtTime(0.05, audioCtx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(masterGain.gain);
    lfo.start();
  }

  function render() {
    btn.setAttribute("aria-pressed", String(isPlaying));
    const full = btn.querySelector(".audio-label-full");
    const short = btn.querySelector(".audio-label-short");
    const text = isPlaying ? "AUDIO: 432 Hz ACTIVE" : "AUDIO: MUTED";
    if (full) full.textContent = text;
    if (short) short.textContent = isPlaying ? "432 Hz" : "MUTED";
    if (!full && !short) btn.textContent = text;
  }

  btn.addEventListener("click", () => {
    ensureCtx();
    if (!audioCtx) {
      btn.textContent = "AUDIO: N/A";
      btn.disabled = true;
      return;
    }
    if (audioCtx.state === "suspended") audioCtx.resume();

    isPlaying = !isPlaying;
    if (isPlaying) {
      masterGain.gain.setTargetAtTime(0.2, audioCtx.currentTime, 0.5);
    } else {
      masterGain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.5);
    }
    render();
  });

  render();
})();
