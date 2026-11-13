/**
 * HoloCraft 3D - Hologram Sound Engine & "Raw Power" Audio Synthesizer
 * Synthesizes 432 Hz Solfeggio harmonics, laser scans, and the audio-reactive "Raw Power" cyber beat.
 */

class HologramSoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;
  private masterGain: GainNode | null = null;
  private carrierOsc: OscillatorNode | null = null;
  private subOsc: OscillatorNode | null = null;
  private lfoOsc: OscillatorNode | null = null;
  private lfoGain: GainNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private isInitialized: boolean = false;

  // Power Song state
  private isPowerSongActive: boolean = false;
  private powerSongInterval: number | null = null;

  public init() {
    if (this.isInitialized && this.ctx) return;

    try {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.15, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Lowpass filter for warm analog hologram hum
      this.filter = this.ctx.createBiquadFilter();
      this.filter.type = 'lowpass';
      this.filter.frequency.setValueAtTime(950, this.ctx.currentTime);
      this.filter.Q.setValueAtTime(2.0, this.ctx.currentTime);
      this.filter.connect(this.masterGain);

      // 432.0 Hz Primary Hologram Carrier Tone
      this.carrierOsc = this.ctx.createOscillator();
      this.carrierOsc.type = 'sine';
      this.carrierOsc.frequency.setValueAtTime(432.0, this.ctx.currentTime);

      // Sub-harmonic 108.0 Hz (432 / 4)
      this.subOsc = this.ctx.createOscillator();
      this.subOsc.type = 'triangle';
      this.subOsc.frequency.setValueAtTime(108.0, this.ctx.currentTime);

      // 1.2 Hz Endocrine heartbeat / laser pulse LFO
      this.lfoOsc = this.ctx.createOscillator();
      this.lfoOsc.type = 'sine';
      this.lfoOsc.frequency.setValueAtTime(1.2, this.ctx.currentTime);

      this.lfoGain = this.ctx.createGain();
      this.lfoGain.gain.setValueAtTime(120, this.ctx.currentTime);
      this.lfoOsc.connect(this.lfoGain);
      this.lfoGain.connect(this.filter.frequency);

      const oscGain = this.ctx.createGain();
      oscGain.gain.setValueAtTime(0.12, this.ctx.currentTime);

      this.carrierOsc.connect(oscGain);
      this.subOsc.connect(oscGain);
      oscGain.connect(this.filter);

      this.carrierOsc.start();
      this.subOsc.start();
      this.lfoOsc.start();

      this.isInitialized = true;
    } catch (e) {
      console.warn('AudioContext initialization deferred until gesture:', e);
    }
  }

  public toggleMute(): boolean {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      const target = this.isMuted ? 0 : 0.15;
      this.masterGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.05);
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  // Toggle "Raw Power" Cyber-Rock Beat
  public togglePowerSong(): boolean {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.isPowerSongActive = !this.isPowerSongActive;

    if (this.isPowerSongActive) {
      // Unmute if currently muted
      if (this.isMuted) {
        this.toggleMute();
      }

      // Play driving 432Hz cyber-rock bassline & beat sequence (~125 BPM)
      const beatInterval = 480; // ms per beat
      let step = 0;

      const chordFrequencies = [216.0, 324.0, 432.0, 364.5, 546.75]; // Power chord frequencies tuned to 432Hz

      this.powerSongInterval = window.setInterval(() => {
        if (!this.ctx || !this.masterGain || !this.isPowerSongActive) return;
        const now = this.ctx.currentTime;

        // Bass synth pulse
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();
        bassOsc.type = step % 2 === 0 ? 'sawtooth' : 'square';
        const freq = chordFrequencies[step % chordFrequencies.length];
        bassOsc.frequency.setValueAtTime(freq * 0.5, now);
        bassOsc.frequency.exponentialRampToValueAtTime(freq * 0.25, now + 0.25);

        bassGain.gain.setValueAtTime(0.18, now);
        bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        bassOsc.connect(bassGain);
        bassGain.connect(this.masterGain);

        bassOsc.start(now);
        bassOsc.stop(now + 0.4);

        // Hi-hat / cyber snare snap on offbeats
        if (step % 2 !== 0) {
          const noiseBuffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.08, this.ctx.sampleRate);
          const output = noiseBuffer.getChannelData(0);
          for (let i = 0; i < output.length; i++) {
            output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.02));
          }
          const whiteNoise = this.ctx.createBufferSource();
          whiteNoise.buffer = noiseBuffer;

          const noiseFilter = this.ctx.createBiquadFilter();
          noiseFilter.type = 'highpass';
          noiseFilter.frequency.setValueAtTime(4000, now);

          const noiseGain = this.ctx.createGain();
          noiseGain.gain.setValueAtTime(0.08, now);

          whiteNoise.connect(noiseFilter);
          noiseFilter.connect(noiseGain);
          noiseGain.connect(this.masterGain);

          whiteNoise.start(now);
        }

        step = (step + 1) % 16;
      }, beatInterval);
    } else {
      if (this.powerSongInterval) {
        clearInterval(this.powerSongInterval);
        this.powerSongInterval = null;
      }
    }

    return this.isPowerSongActive;
  }

  public getIsPowerSongActive(): boolean {
    return this.isPowerSongActive;
  }

  public triggerLaserScanSound() {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(864.0, now); // 432 * 2
      osc.frequency.exponentialRampToValueAtTime(216.0, now + 0.3);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch {
      // ignore
    }
  }

  public triggerHologramCaptureChime() {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const notes = [432.0, 546.75, 648.0, 864.0]; // Pythagorean Major Triad + Octave
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const noteTime = now + idx * 0.07;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0.08, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(noteTime);
        osc.stop(noteTime + 0.45);
      });
    } catch {
      // ignore
    }
  }
}

export const hologramSound = new HologramSoundEngine();
