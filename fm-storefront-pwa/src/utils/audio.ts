// Advanced Web Audio API Synthesizer with Real-time Radio Stations, Raw Proof Engine & Audio Reactive Analyzer

import { RadioStation, AudioReactiveData } from '../types/store';

export const RADIO_STATIONS: RadioStation[] = [
  {
    id: 'raw_proof',
    title: 'Raw Proof · Kinetic 808s & Heavy Bass',
    genre: 'Raw Audio / Heavy Bass',
    bpm: 92,
    description: 'Punchy 808 sub drops, raw analog saw leads, audio-reactive impulses, and heavy kinetic groove.'
  },
  {
    id: 'sovereign_deep',
    title: 'Sovereign Waves · Deep Synth',
    genre: 'Ambient Cinematic',
    bpm: 64,
    description: 'Sub-bass drone with warm analog filter sweeps and tape warmth.'
  },
  {
    id: 'aquarium_drift',
    title: 'Bioluminescent Aquarium · Drift',
    genre: 'Aquatic Chill & Sonar',
    bpm: 52,
    description: 'Underwater harmonics, subtle sonar pings, and oceanic caustics.'
  },
  {
    id: 'neon_cyber',
    title: 'Neon Cyber Lounge · 120Hz Pulse',
    genre: 'Lo-Fi Downtempo',
    bpm: 78,
    description: 'Lush electric chill keys with kinetic syncopated beats.'
  }
];

class SoundEngine {
  private ctx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private masterGain: GainNode | null = null;
  private activeStationId: string = 'raw_proof';
  private isPlaying: boolean = false;

  // Active oscillators / sound nodes
  private nodes: (OscillatorNode | GainNode | BiquadFilterNode | AudioBufferSourceNode)[] = [];
  private pulseInterval: any = null;

  // Audio reactive caching
  private freqData: Uint8Array = new Uint8Array(64);
  private customAudioSource: AudioBufferSourceNode | null = null;
  private customTrackName: string | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
        this.analyser = this.ctx.createAnalyser();
        this.analyser.fftSize = 64;
        this.analyser.smoothingTimeConstant = 0.8;
        this.freqData = new Uint8Array(this.analyser.frequencyBinCount);

        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.4, this.ctx.currentTime);
        this.masterGain.connect(this.analyser);
        this.analyser.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getActiveStationId(): string {
    return this.activeStationId;
  }

  public getCustomTrackName(): string | null {
    return this.customTrackName;
  }

  public setVolume(val: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, val)), this.ctx.currentTime);
    }
  }

  public togglePlay(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.play(this.activeStationId);
      return true;
    }
  }

  public setStation(stationId: string) {
    this.activeStationId = stationId;
    this.customTrackName = null;
    if (this.isPlaying) {
      this.stop();
      this.play(stationId);
    }
  }

  // Real-time audio reactive metrics (bass, mid, high, rawLevel: 0.0 to 1.0)
  public getAudioReactiveData(): AudioReactiveData {
    if (!this.analyser || !this.isPlaying) {
      // Gentle idle breath simulation when audio is paused
      const time = Date.now() * 0.002;
      return {
        bass: 0.15 + Math.sin(time) * 0.08,
        mid: 0.12 + Math.sin(time * 1.5 + 1) * 0.06,
        high: 0.08 + Math.cos(time * 2.2) * 0.04,
        rawLevel: 0.12 + Math.sin(time * 0.8) * 0.05
      };
    }

    (this.analyser as AnalyserNode).getByteFrequencyData(this.freqData as any);

    // Bass: sub-bass & 808 bins (bins 0-3: 0 to ~150Hz)
    let bassSum = 0;
    for (let i = 0; i < 4; i++) {
      bassSum += this.freqData[i] || 0;
    }
    const bass = Math.min(1.0, (bassSum / (4 * 255)) * 1.45);

    // Mids: synths & harmonic resonance (bins 4-14: ~150Hz to ~1.8kHz)
    let midSum = 0;
    for (let i = 4; i < 15; i++) {
      midSum += this.freqData[i] || 0;
    }
    const mid = Math.min(1.0, (midSum / (11 * 255)) * 1.3);

    // Highs: crisp hi-hats, sizzling leads & shimmer (bins 15-31: ~2kHz to ~10kHz)
    let highSum = 0;
    for (let i = 15; i < 32; i++) {
      highSum += this.freqData[i] || 0;
    }
    const high = Math.min(1.0, (highSum / (17 * 255)) * 1.6);

    const rawLevel = Math.max(bass * 0.8, (bass + mid + high) / 3);

    return { bass, mid, high, rawLevel };
  }

  public play(stationId = this.activeStationId) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    this.stop();
    this.activeStationId = stationId;
    this.isPlaying = true;

    try {
      if (stationId === 'raw_proof') {
        this.startRawProofStation();
      } else if (stationId === 'sovereign_deep') {
        this.startSovereignDeepStation();
      } else if (stationId === 'aquarium_drift') {
        this.startAquariumStation();
      } else {
        this.startNeonCyberStation();
      }
    } catch (e) {
      console.warn('Audio playback error:', e);
    }
  }

  // Play uploaded MP3 audio file with real-time reactive pipeline
  public async loadCustomAudioFile(file: File) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    try {
      this.stop();
      const arrayBuffer = await file.arrayBuffer();
      const audioBuffer = await this.ctx.decodeAudioData(arrayBuffer);

      const source = this.ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.loop = true;
      source.connect(this.masterGain);
      source.start(0);

      this.customAudioSource = source;
      this.customTrackName = file.name.replace(/\.[^/.]+$/, "");
      this.activeStationId = 'custom_mp3';
      this.isPlaying = true;
      this.nodes.push(source);
    } catch (err) {
      console.error('Failed to load custom audio file:', err);
    }
  }

  public stop() {
    if (this.pulseInterval) {
      clearInterval(this.pulseInterval);
      this.pulseInterval = null;
    }
    if (this.customAudioSource) {
      try {
        this.customAudioSource.stop();
        this.customAudioSource.disconnect();
      } catch {
        // Safe
      }
      this.customAudioSource = null;
    }
    this.nodes.forEach((node) => {
      try {
        if ('stop' in node && typeof (node as any).stop === 'function') {
          (node as any).stop();
        }
        node.disconnect();
      } catch {
        // Safe disposal
      }
    });
    this.nodes = [];
    this.isPlaying = false;
  }

  // Station: RAW PROOF - Kinetic 808s, Heavy Saw Bass & Audio Reactive Pulses
  private startRawProofStation() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    // 1. Raw Analog Saw Bassline (heavy, gritty, sovereign energy)
    const sawOsc = this.ctx.createOscillator();
    sawOsc.type = 'sawtooth';
    sawOsc.frequency.setValueAtTime(55, now); // A1 root

    const subOsc = this.ctx.createOscillator();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(41.2, now); // Low E sub punch

    const bassFilter = this.ctx.createBiquadFilter();
    bassFilter.type = 'lowpass';
    bassFilter.frequency.setValueAtTime(280, now);
    bassFilter.Q.setValueAtTime(3.5, now);

    const bassGain = this.ctx.createGain();
    bassGain.gain.setValueAtTime(0.001, now);
    bassGain.gain.exponentialRampToValueAtTime(0.3, now + 0.8);

    sawOsc.connect(bassFilter);
    subOsc.connect(bassFilter);
    bassFilter.connect(bassGain);
    bassGain.connect(this.masterGain);

    sawOsc.start(now);
    subOsc.start(now);
    this.nodes.push(sawOsc, subOsc, bassFilter, bassGain);

    // 2. High-energy 808 Kick and Hi-Hat Rhythmic Sequencer (92 BPM)
    const stepDurationMs = 652; // 92 BPM beat interval
    let step = 0;

    this.pulseInterval = setInterval(() => {
      if (!this.ctx || !this.masterGain || !this.isPlaying) return;
      step++;
      const time = this.ctx.currentTime;

      // Punchy 808 Kick on beats 1, 3, and syncopated drops
      if (step % 2 === 1 || step % 7 === 0) {
        try {
          const kickOsc = this.ctx.createOscillator();
          const kickGain = this.ctx.createGain();

          kickOsc.type = 'sine';
          // Pitch envelope: drops rapidly from 160Hz to 45Hz
          kickOsc.frequency.setValueAtTime(160, time);
          kickOsc.frequency.exponentialRampToValueAtTime(42, time + 0.12);

          // Amplitude envelope
          kickGain.gain.setValueAtTime(0.55, time);
          kickGain.gain.exponentialRampToValueAtTime(0.001, time + 0.35);

          kickOsc.connect(kickGain);
          kickGain.connect(this.masterGain);

          kickOsc.start(time);
          kickOsc.stop(time + 0.36);

          // Bass filter pulse
          bassFilter.frequency.setValueAtTime(480, time);
          bassFilter.frequency.exponentialRampToValueAtTime(260, time + 0.25);
        } catch {
          // Safe
        }
      }

      // Crisp Sizzling Hi-Hats / Kinetic Metallic Shimmer
      try {
        const hatOsc = this.ctx.createOscillator();
        const hatGain = this.ctx.createGain();
        const hatFilter = this.ctx.createBiquadFilter();

        hatFilter.type = 'highpass';
        hatFilter.frequency.setValueAtTime(7000, time);

        hatOsc.type = 'triangle';
        hatOsc.frequency.setValueAtTime(step % 4 === 2 ? 8800 : 6400, time);

        hatGain.gain.setValueAtTime(0.05, time);
        hatGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.08);

        hatOsc.connect(hatFilter);
        hatFilter.connect(hatGain);
        hatGain.connect(this.masterGain);

        hatOsc.start(time);
        hatOsc.stop(time + 0.09);
      } catch {
        // Safe
      }

      // Raw Cybernetic Synth Stab every 4 bars
      if (step % 4 === 0) {
        try {
          const stabOsc = this.ctx.createOscillator();
          const stabGain = this.ctx.createGain();
          stabOsc.type = 'sawtooth';
          stabOsc.frequency.setValueAtTime(step % 8 === 0 ? 220 : 164.8, time);

          stabGain.gain.setValueAtTime(0.12, time);
          stabGain.gain.exponentialRampToValueAtTime(0.001, time + 0.4);

          stabOsc.connect(stabGain);
          stabGain.connect(this.masterGain);

          stabOsc.start(time);
          stabOsc.stop(time + 0.41);
        } catch {
          // Safe
        }
      }
    }, stepDurationMs / 2);
  }

  // Station: Sovereign Deep Synth
  private startSovereignDeepStation() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    const sub = this.ctx.createOscillator();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(55, now);

    const mid1 = this.ctx.createOscillator();
    mid1.type = 'triangle';
    mid1.frequency.setValueAtTime(110, now);

    const mid2 = this.ctx.createOscillator();
    mid2.type = 'sine';
    mid2.frequency.setValueAtTime(164.81, now);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(220, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.25, now + 2);

    sub.connect(filter);
    mid1.connect(filter);
    mid2.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    sub.start(now);
    mid1.start(now);
    mid2.start(now);

    this.nodes.push(sub, mid1, mid2, filter, gain);

    let phase = 0;
    this.pulseInterval = setInterval(() => {
      if (!this.ctx) return;
      phase += 0.2;
      const freq = 200 + Math.sin(phase) * 90;
      filter.frequency.setTargetAtTime(freq, this.ctx.currentTime, 0.5);
    }, 500);
  }

  // Station: Bioluminescent Aquarium Drift
  private startAquariumStation() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(73.42, now);

    const chord = this.ctx.createOscillator();
    chord.type = 'sine';
    chord.frequency.setValueAtTime(146.83, now);

    const shimmer = this.ctx.createOscillator();
    shimmer.type = 'triangle';
    shimmer.frequency.setValueAtTime(220, now);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(320, now);
    filter.Q.setValueAtTime(2.5, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.22, now + 1.5);

    osc.connect(gain);
    chord.connect(filter);
    shimmer.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    chord.start(now);
    shimmer.start(now);

    this.nodes.push(osc, chord, shimmer, filter, gain);

    this.pulseInterval = setInterval(() => {
      if (!this.ctx || !this.masterGain) return;
      try {
        const ping = this.ctx.createOscillator();
        const pingGain = this.ctx.createGain();
        ping.type = 'sine';
        ping.frequency.setValueAtTime(880, this.ctx.currentTime);
        pingGain.gain.setValueAtTime(0.04, this.ctx.currentTime);
        pingGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.8);
        ping.connect(pingGain);
        pingGain.connect(this.masterGain);
        ping.start();
        ping.stop(this.ctx.currentTime + 1.8);
      } catch {
        // Safe
      }
    }, 4200);
  }

  // Station: Neon Cyber Lounge
  private startNeonCyberStation() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    const osc1 = this.ctx.createOscillator();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(130.81, now);

    const osc2 = this.ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(164.81, now);

    const osc3 = this.ctx.createOscillator();
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(196.00, now);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.2, now + 1.2);

    osc1.connect(filter);
    osc2.connect(filter);
    osc3.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc1.start(now);
    osc2.start(now);
    osc3.start(now);

    this.nodes.push(osc1, osc2, osc3, filter, gain);

    let beat = 0;
    this.pulseInterval = setInterval(() => {
      if (!this.ctx || !this.masterGain) return;
      beat++;
      try {
        const tick = this.ctx.createOscillator();
        const tickGain = this.ctx.createGain();
        tick.type = 'sine';
        tick.frequency.setValueAtTime(beat % 2 === 0 ? 320 : 260, this.ctx.currentTime);
        tickGain.gain.setValueAtTime(0.02, this.ctx.currentTime);
        tickGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.15);
        tick.connect(tickGain);
        tickGain.connect(this.masterGain);
        tick.start();
        tick.stop(this.ctx.currentTime + 0.15);
      } catch {
        // Safe
      }
    }, 770);
  }

  // Tactile button click haptic sound
  public playClick(freq = 580) {
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.5, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.025, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch {
      // Audio context may be unprimed
    }
  }

  public getFrequencyBins(): Uint8Array {
    if (!this.analyser || !this.isPlaying) {
      const time = Date.now() * 0.003;
      const dummy = new Uint8Array(32);
      for (let i = 0; i < 32; i++) {
        dummy[i] = Math.floor((Math.sin(time + i * 0.2) * 0.5 + 0.5) * 160);
      }
      return dummy;
    }
    (this.analyser as AnalyserNode).getByteFrequencyData(this.freqData as any);
    return this.freqData;
  }
}

export const soundEngine = new SoundEngine();
