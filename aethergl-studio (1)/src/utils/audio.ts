/**
 * Audio Asset Hunter/Gatherer & Real-Time WebGL DSP Analyzer Service
 * Provides procedural synthesizer loops and ingests multiple MP3 files,
 * converting them into sub-bands and optimal 2D data texture formats for WebGL shaders.
 */

export interface TrackAsset {
  id: string;
  name: string;
  type: 'procedural' | 'user-upload';
  isPlaying: boolean;
  buffer?: AudioBuffer; // For uploaded MP3s
  synthType?: 'ambient' | 'synthwave' | 'chiptune'; // For procedural synthesizers
}

export class AudioEngine {
  public ctx: AudioContext | null = null;
  public analyser: AnalyserNode | null = null;
  
  // Roster of gatherer/provider tracks
  public tracks: TrackAsset[] = [];
  public activeTrackId: string | null = null;

  // Real-time analysis channels
  private freqData: Uint8Array;
  private timeData: Uint8Array;
  private textureBuffer: Uint8Array; // Size 256 * 2 * 4 (RGBA)

  // Web Audio Source holders
  private activeSource: AudioBufferSourceNode | null = null;
  private gainNode: GainNode | null = null;
  
  // Procedural synthesizers scheduling states
  private synthInterval: any = null;
  private synthStep = 0;
  private synthVolume = 0.3;

  constructor() {
    this.freqData = new Uint8Array(256);
    this.timeData = new Uint8Array(256);
    this.textureBuffer = new Uint8Array(256 * 2 * 4); // Row 0: Freq, Row 1: Wave, 4 channels per pixel

    // Preload procedural synth assets (hunter/gatherer provider)
    this.tracks = [
      { id: 'synthwave', name: 'Cyber Synthwave Beat (Procedural)', type: 'procedural', synthType: 'synthwave', isPlaying: false },
      { id: 'ambient', name: 'Aether Ambient Pad (Procedural)', type: 'procedural', synthType: 'ambient', isPlaying: false },
      { id: 'chiptune', name: '8-Bit Chiptune Arp (Procedural)', type: 'procedural', synthType: 'chiptune', isPlaying: false },
    ];
  }

  // Initialize Audio Context on user gestures
  public init() {
    if (this.ctx) return;
    
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    this.ctx = new AudioContextClass();
    
    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 512; // Gives 256 bins
    this.analyser.smoothingTimeConstant = 0.8;

    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.value = this.synthVolume;

    // Connect analyzer to output
    this.gainNode.connect(this.ctx.destination);
    this.analyser.connect(this.gainNode);
  }

  // Set visualizer volume
  public setVolume(vol: number) {
    this.synthVolume = vol;
    if (this.gainNode) {
      this.gainNode.gain.setValueAtTime(vol, this.ctx?.currentTime || 0);
    }
  }

  // Ingest external MP3 file, decode, and add to asset gatherer
  public async ingestMp3(file: File): Promise<TrackAsset> {
    this.init();
    if (!this.ctx) throw new Error('Audio Context could not be initialized.');

    const arrayBuffer = await file.arrayBuffer();
    const audioBuffer = await this.ctx.decodeAudioData(arrayBuffer);

    const track: TrackAsset = {
      id: `upload-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      name: file.name.replace(/\.mp3$/i, ''),
      type: 'user-upload',
      isPlaying: false,
      buffer: audioBuffer,
    };

    this.tracks.push(track);
    return track;
  }

  // Start playing a gathered track asset
  public playTrack(id: string) {
    this.init();
    if (!this.ctx || !this.analyser || !this.gainNode) return;

    this.stopActiveTrack();

    const track = this.tracks.find(t => t.id === id);
    if (!track) return;

    // Wake context up if suspended
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.activeTrackId = id;
    track.isPlaying = true;

    if (track.type === 'user-upload' && track.buffer) {
      // Create Buffer source for user MP3
      const source = this.ctx.createBufferSource();
      source.buffer = track.buffer;
      source.loop = true;
      source.connect(this.analyser);
      source.start(0);
      this.activeSource = source;
    } else if (track.type === 'procedural' && track.synthType) {
      // Scheduler looping synthesizer
      this.startProceduralSynth(track.synthType);
    }
  }

  // Stop currently running audio source
  public stopActiveTrack() {
    const active = this.tracks.find(t => t.id === this.activeTrackId);
    if (active) {
      active.isPlaying = false;
    }

    // Stop MP3 sources
    if (this.activeSource) {
      try {
        this.activeSource.stop();
      } catch (e) {}
      this.activeSource.disconnect();
      this.activeSource = null;
    }

    // Stop scheduling loops
    this.stopProceduralSynth();
    this.activeTrackId = null;
  }

  // Standard procedural sound generator loop
  private startProceduralSynth(type: 'ambient' | 'synthwave' | 'chiptune') {
    this.stopProceduralSynth();
    if (!this.ctx || !this.analyser) return;

    this.synthStep = 0;
    
    const playStep = () => {
      if (!this.ctx || !this.analyser) return;

      const time = this.ctx.currentTime;

      if (type === 'synthwave') {
        // Simple bass arp & drum loop
        // Beats every 0.15s (100 BPM)
        const isKick = this.synthStep % 4 === 0;
        const isSnare = this.synthStep % 8 === 4;

        // Kick oscillator
        if (isKick) {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.connect(gain);
          gain.connect(this.analyser);

          osc.frequency.setValueAtTime(150, time);
          osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.2);

          gain.gain.setValueAtTime(1.0, time);
          gain.gain.exponentialRampToValueAtTime(0.01, time + 0.2);

          osc.start(time);
          osc.stop(time + 0.2);
        }

        // Bass synthesizer note
        const notes = [55, 55, 65.4, 65.4, 73.4, 73.4, 82.4, 98.0];
        const freq = notes[Math.floor(this.synthStep / 4) % notes.length];
        
        const oscBass = this.ctx.createOscillator();
        const gainBass = this.ctx.createGain();
        oscBass.type = 'sawtooth';
        oscBass.connect(gainBass);
        gainBass.connect(this.analyser);

        oscBass.frequency.setValueAtTime(freq, time);
        
        gainBass.gain.setValueAtTime(0.3, time);
        gainBass.gain.exponentialRampToValueAtTime(0.01, time + 0.14);

        oscBass.start(time);
        oscBass.stop(time + 0.15);

      } else if (type === 'ambient') {
        // Slow minor seventh chord sweep (chords transition slowly)
        if (this.synthStep % 16 === 0) {
          // Play chords: A minor, D minor, G major, C major
          const chords = [
            [110, 130.8, 164.8, 196.0], // Am7
            [146.8, 174.6, 220, 261.6], // Dm7
            [196.0, 246.9, 293.7, 392.0]  // G7
          ];
          const activeChord = chords[Math.floor(this.synthStep / 16) % chords.length];

          activeChord.forEach((freq) => {
            if (!this.ctx || !this.analyser) return;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const filter = this.ctx.createBiquadFilter();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, time);

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(400, time);
            filter.frequency.exponentialRampToValueAtTime(2000, time + 1.2);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.analyser);

            gain.gain.setValueAtTime(0, time);
            gain.gain.linearRampToValueAtTime(0.15, time + 0.4);
            gain.gain.exponentialRampToValueAtTime(0.001, time + 2.3);

            osc.start(time);
            osc.stop(time + 2.5);
          });
        }
      } else if (type === 'chiptune') {
        // Quick arpeggiator notes
        const melody = [261.6, 293.7, 329.6, 392.0, 440.0, 523.3, 587.3, 659.3];
        const freq = melody[(this.synthStep) % melody.length];

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, time);

        osc.connect(gain);
        gain.connect(this.analyser);

        gain.gain.setValueAtTime(0.2, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.08);

        osc.start(time);
        osc.stop(time + 0.1);
      }

      this.synthStep++;
    };

    const intervalTime = type === 'ambient' ? 150 : type === 'synthwave' ? 150 : 80;
    this.synthInterval = setInterval(playStep, intervalTime);
  }

  private stopProceduralSynth() {
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
  }

  // Optimal DSP gatherer - outputs sub-bands and packages 2D visualizer data
  public analyze(): {
    freqData: Uint8Array;
    timeData: Uint8Array;
    volume: number;
    bass: number;
    mids: number;
    treble: number;
    textureBuffer: Uint8Array;
  } {
    if (!this.analyser) {
      return {
        freqData: this.freqData,
        timeData: this.timeData,
        volume: 0,
        bass: 0,
        mids: 0,
        treble: 0,
        textureBuffer: this.textureBuffer
      };
    }

    // Sample channels
    this.analyser.getByteFrequencyData(this.freqData as any);
    this.analyser.getByteTimeDomainData(this.timeData as any);

    // Calculate sub-bands and normalized values
    let sumVol = 0;
    let sumBass = 0;
    let sumMids = 0;
    let sumTreble = 0;

    // Pack arrays into Uint8 RGBA rows
    // Row 0: Y=0 (Frequency Spectrum 256 pixels)
    // Row 1: Y=1 (Time domain waveform amplitude 256 pixels)
    for (let i = 0; i < 256; i++) {
      const freqVal = this.freqData[i];
      const timeVal = this.timeData[i];

      const freqNorm = freqVal / 255.0;
      sumVol += freqNorm;

      // Classify frequencies
      if (i < 16) {
        sumBass += freqNorm; // Bass bin
      } else if (i < 120) {
        sumMids += freqNorm; // Mids bin
      } else {
        sumTreble += freqNorm; // Treble bin
      }

      // Pack Row 0 (Frequency)
      const pixelIdx0 = i * 4;
      this.textureBuffer[pixelIdx0] = freqVal;     // R
      this.textureBuffer[pixelIdx0 + 1] = freqVal; // G
      this.textureBuffer[pixelIdx0 + 2] = freqVal; // B
      this.textureBuffer[pixelIdx0 + 3] = 255;     // A

      // Pack Row 1 (Waveform)
      const pixelIdx1 = (256 + i) * 4;
      this.textureBuffer[pixelIdx1] = timeVal;     // R
      this.textureBuffer[pixelIdx1 + 1] = timeVal; // G
      this.textureBuffer[pixelIdx1 + 2] = timeVal; // B
      this.textureBuffer[pixelIdx1 + 3] = 255;     // A
    }

    const volume = sumVol / 256;
    const bass = sumBass / 16;
    const mids = sumMids / 104;
    const treble = sumTreble / 136;

    return {
      freqData: this.freqData,
      timeData: this.timeData,
      volume,
      bass: bass * 1.5, // Amplify bass slightly for better shader reaction
      mids,
      treble,
      textureBuffer: this.textureBuffer,
    };
  }
}
