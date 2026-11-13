import React, { useRef, useEffect, useState, useCallback } from 'react';

const WaveformIcon = ({ type, active, onClick }) => {
  const paths = {
    sine: "M0,50 Q25,0 50,50 T100,50",
    square: "M0,50 L0,20 L50,20 L50,80 L100,80 L100,50",
    sawtooth: "M0,80 L50,20 L50,80 L100,20",
    triangle: "M0,50 L25,20 L75,80 L100,50"
  };
  return (
    <button onClick={onClick}
      className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
        active ? 'border-cyan-400 bg-cyan-400/20 shadow-[0_0_15px_rgba(34,211,238,0.4)]' : 'border-slate-600 bg-slate-800/50 hover:border-slate-400'
      }`}>
      <svg viewBox="0 0 100 100" className="w-6 h-6">
        <path d={paths[type]} fill="none" stroke={active ? '#22d3ee' : '#64748b'} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  );
};

const createImpulseResponse = (ctx, duration = 2.0, decay = 2.0) => {
  const rate = ctx.sampleRate;
  const length = rate * duration;
  const impulse = ctx.createBuffer(2, length, rate);
  for (let c = 0; c < 2; c++) {
    const ch = impulse.getChannelData(c);
    for (let i = 0; i < length; i++) {
      ch[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
    }
  }
  return impulse;
};

const midiToFreq = (n) => 440 * Math.pow(2, (n - 69) / 12);

const TideSynth = () => {
  const canvasRef = useRef(null);
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const masterGainRef = useRef(null);
  const filterRef = useRef(null);
  const delayRef = useRef(null);
  const delayGainRef = useRef(null);
  const reverbRef = useRef(null);
  const reverbGainRef = useRef(null);
  const dryGainRef = useRef(null);
  const lfoRef = useRef(null);
  const oscillatorsRef = useRef([]);
  const mediaDestRef = useRef(null);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const sequencerRef = useRef(null);
  const arpRef = useRef({ notes: [], index: 0, direction: 1 });
  const midiAccessRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [waveform, setWaveform] = useState('sawtooth');
  const [frequency, setFrequency] = useState(110);
  const [tideSpeed, setTideSpeed] = useState(0.4);
  const [tideIntensity, setTideIntensity] = useState(0.35);
  const [filterFreq, setFilterFreq] = useState(2400);
  const [resonance, setResonance] = useState(4);
  const [volume, setVolume] = useState(0.5);

  const [delayTime, setDelayTime] = useState(0.3);
  const [delayFeedback, setDelayFeedback] = useState(0.35);
  const [delayMix, setDelayMix] = useState(0.25);
  const [reverbMix, setReverbMix] = useState(0.2);
  const [reverbDecay, setReverbDecay] = useState(2.0);

  const [sequencerOn, setSequencerOn] = useState(false);
  const [bpm, setBpm] = useState(100);
  const [activeStep, setActiveStep] = useState(0);
  const steps = 16;
  const [pattern, setPattern] = useState(Array(steps).fill(false).map((_, i) => [0, 4, 7, 11].includes(i)));

  const [arpOn, setArpOn] = useState(false);
  const [arpMode, setArpMode] = useState('up');
  const [arpRange, setArpRange] = useState(2);

  const [midiEnabled, setMidiEnabled] = useState(false);
  const [midiDevices, setMidiDevices] = useState([]);
  const [lastMidiNote, setLastMidiNote] = useState(null);

  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const recordIntervalRef = useRef(null);

  const initAudio = useCallback(() => {
    if (audioCtxRef.current) return;
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    audioCtxRef.current = ctx;

    analyserRef.current = ctx.createAnalyser();
    analyserRef.current.fftSize = 2048;

    masterGainRef.current = ctx.createGain();
    masterGainRef.current.gain.value = volume;

    filterRef.current = ctx.createBiquadFilter();
    filterRef.current.type = 'lowpass';
    filterRef.current.frequency.value = filterFreq;
    filterRef.current.Q.value = resonance;

    delayRef.current = ctx.createDelay(5.0);
    delayRef.current.delayTime.value = delayTime;
    delayGainRef.current = ctx.createGain();
    delayGainRef.current.gain.value = delayFeedback;
    const delayMixGain = ctx.createGain();
    delayMixGain.gain.value = delayMix;

    reverbRef.current = ctx.createConvolver();
    reverbRef.current.buffer = createImpulseResponse(ctx, 3.0, reverbDecay);
    reverbGainRef.current = ctx.createGain();
    reverbGainRef.current.gain.value = reverbMix;
    dryGainRef.current = ctx.createGain();
    dryGainRef.current.gain.value = 1 - Math.min(reverbMix, 0.8);

    mediaDestRef.current = ctx.createMediaStreamDestination();

    filterRef.current.connect(dryGainRef.current);
    dryGainRef.current.connect(masterGainRef.current);

    filterRef.current.connect(delayRef.current);
    delayRef.current.connect(delayGainRef.current);
    delayGainRef.current.connect(delayRef.current);
    delayRef.current.connect(delayMixGain);
    delayMixGain.connect(masterGainRef.current);

    filterRef.current.connect(reverbRef.current);
    reverbRef.current.connect(reverbGainRef.current);
    reverbGainRef.current.connect(masterGainRef.current);

    masterGainRef.current.connect(analyserRef.current);
    analyserRef.current.connect(ctx.destination);
    masterGainRef.current.connect(mediaDestRef.current);

  }, [volume, filterFreq, resonance, delayTime, delayFeedback, delayMix, reverbMix, reverbDecay]);

  const playNote = useCallback((freq, velocity = 0.8) => {
    initAudio();
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    oscillatorsRef.current.forEach(o => { try { o.stop(); } catch(e){} });
    oscillatorsRef.current = [];
    if (lfoRef.current) { try { lfoRef.current.stop(); } catch(e){} }

    const osc = ctx.createOscillator();
    osc.type = waveform;
    osc.frequency.value = freq;

    const subOsc = ctx.createOscillator();
    subOsc.type = waveform === 'sine' ? 'sine' : 'square';
    subOsc.frequency.value = freq / 2;
    const subGain = ctx.createGain();
    subGain.gain.value = 0.35;

    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = tideSpeed;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = tideIntensity * 800;
    lfo.connect(lfoGain);
    lfoGain.connect(filterRef.current.frequency);
    lfo.start();
    lfoRef.current = lfo;

    const noteGain = ctx.createGain();
    noteGain.gain.value = velocity;

    osc.connect(noteGain);
    subOsc.connect(subGain);
    subGain.connect(noteGain);
    noteGain.connect(filterRef.current);

    const now = ctx.currentTime;
    noteGain.gain.setValueAtTime(0, now);
    noteGain.gain.linearRampToValueAtTime(velocity, now + 0.02);
    noteGain.gain.exponentialRampToValueAtTime(velocity * 0.5, now + 0.4);

    osc.start(now);
    subOsc.start(now);

    oscillatorsRef.current = [osc, subOsc, lfo, noteGain];
  }, [waveform, tideSpeed, tideIntensity, initAudio]);

  const stopNote = useCallback(() => {
    oscillatorsRef.current.forEach(o => { try { o.stop(); } catch(e){} });
    oscillatorsRef.current = [];
  }, []);

  const getArpNotes = useCallback(() => {
    const base = frequency;
    const notes = [];
    for (let o = 0; o < arpRange; o++) {
      const mult = Math.pow(2, o);
      notes.push(base * mult);
      notes.push(base * mult * 1.25);
      notes.push(base * mult * 1.5);
    }
    return notes;
  }, [frequency, arpRange]);

  const getNextArpFreq = useCallback(() => {
    const notes = getArpNotes();
    const arp = arpRef.current;
    if (arpMode === 'chord') return notes;

    let idx = arp.index;
    if (arpMode === 'up') {
      idx = (idx + 1) % notes.length;
    } else if (arpMode === 'down') {
      idx = (idx - 1 + notes.length) % notes.length;
    } else if (arpMode === 'updown') {
      idx += arp.direction;
      if (idx >= notes.length - 1) { idx = notes.length - 1; arp.direction = -1; }
      if (idx <= 0) { idx = 0; arp.direction = 1; }
    } else if (arpMode === 'random') {
      idx = Math.floor(Math.random() * notes.length);
    }
    arp.index = idx;
    return [notes[idx]];
  }, [arpMode, getArpNotes]);

  useEffect(() => {
    if (!isPlaying) {
      if (sequencerRef.current) clearInterval(sequencerRef.current);
      setActiveStep(0);
      return;
    }
    if (!sequencerOn && !arpOn) return;

    const interval = (60 / bpm) * 1000 / 4;
    let step = 0;

    sequencerRef.current = setInterval(() => {
      setActiveStep(step);

      if (sequencerOn && pattern[step]) {
        if (arpOn) {
          const freqs = getNextArpFreq();
          freqs.forEach(f => playNote(f));
        } else {
          playNote(frequency);
        }
      } else if (arpOn && !sequencerOn) {
        const freqs = getNextArpFreq();
        freqs.forEach(f => playNote(f));
      }

      step = (step + 1) % steps;
    }, interval);

    return () => clearInterval(sequencerRef.current);
  }, [isPlaying, sequencerOn, arpOn, bpm, pattern, frequency, playNote, getNextArpFreq]);

  const initMIDI = useCallback(async () => {
    try {
      const access = await navigator.requestMIDIAccess({ sysex: false });
      midiAccessRef.current = access;
      const inputs = Array.from(access.inputs.values());
      setMidiDevices(inputs.map(i => i.name));
      setMidiEnabled(true);

      inputs.forEach(input => {
        input.onmidimessage = (msg) => {
          const [cmd, note, vel] = msg.data;
          const type = cmd & 0xf0;
          if (type === 0x90 && vel > 0) {
            const f = midiToFreq(note);
            setLastMidiNote(note);
            setFrequency(f);
            playNote(f, vel / 127);
          } else if (type === 0x80 || (type === 0x90 && vel === 0)) {
            if (lastMidiNote === note) stopNote();
          }
        };
      });

      access.onstatechange = () => {
        const newInputs = Array.from(access.inputs.values());
        setMidiDevices(newInputs.map(i => i.name));
      };
    } catch (err) {
      console.warn('MIDI not available:', err);
      setMidiEnabled(false);
    }
  }, [playNote, stopNote, lastMidiNote]);

  const startRecording = useCallback(() => {
    if (!mediaDestRef.current) initAudio();
    const stream = mediaDestRef.current.stream;
    const mime = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') 
      ? 'audio/webm;codecs=opus' 
      : 'audio/webm';
    const recorder = new MediaRecorder(stream, { mimeType: mime });
    recorderRef.current = recorder;
    chunksRef.current = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: mime });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tide-synth-${new Date().toISOString().slice(0,19).replace(/:/g,'-')}.webm`;
      a.click();
      URL.revokeObjectURL(url);
    };

    recorder.start();
    setIsRecording(true);
    setRecordTime(0);
    recordIntervalRef.current = setInterval(() => setRecordTime(t => t + 1), 1000);
  }, [initAudio]);

  const stopRecording = useCallback(() => {
    if (recorderRef.current && recorderRef.current.state !== 'inactive') {
      recorderRef.current.stop();
    }
    setIsRecording(false);
    if (recordIntervalRef.current) clearInterval(recordIntervalRef.current);
  }, []);

  useEffect(() => {
    if (filterRef.current) {
      filterRef.current.frequency.setTargetAtTime(filterFreq, audioCtxRef.current?.currentTime || 0, 0.1);
      filterRef.current.Q.setTargetAtTime(resonance, audioCtxRef.current?.currentTime || 0, 0.1);
    }
    if (masterGainRef.current) {
      masterGainRef.current.gain.setTargetAtTime(volume, audioCtxRef.current?.currentTime || 0, 0.1);
    }
    if (delayRef.current) {
      delayRef.current.delayTime.setTargetAtTime(delayTime, audioCtxRef.current?.currentTime || 0, 0.1);
    }
    if (delayGainRef.current) {
      delayGainRef.current.gain.setTargetAtTime(delayFeedback, audioCtxRef.current?.currentTime || 0, 0.1);
    }
    if (reverbGainRef.current) {
      reverbGainRef.current.gain.setTargetAtTime(reverbMix, audioCtxRef.current?.currentTime || 0, 0.1);
    }
    if (dryGainRef.current) {
      dryGainRef.current.gain.setTargetAtTime(1 - Math.min(reverbMix, 0.8), audioCtxRef.current?.currentTime || 0, 0.1);
    }
  }, [filterFreq, resonance, volume, delayTime, delayFeedback, reverbMix]);

  useEffect(() => {
    if (reverbRef.current && audioCtxRef.current) {
      reverbRef.current.buffer = createImpulseResponse(audioCtxRef.current, 3.0, reverbDecay);
    }
  }, [reverbDecay]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const draw = () => {
      const w = canvas.width, h = canvas.height;
      ctx.fillStyle = 'rgba(2, 6, 23, 0.12)';
      ctx.fillRect(0, 0, w, h);

      if (analyserRef.current && isPlaying) {
        const bufLen = analyserRef.current.frequencyBinCount;
        const timeData = new Uint8Array(bufLen);
        const freqData = new Uint8Array(bufLen);
        analyserRef.current.getByteTimeDomainData(timeData);
        analyserRef.current.getByteFrequencyData(freqData);

        for (let layer = 0; layer < 3; layer++) {
          ctx.beginPath();
          ctx.strokeStyle = layer === 0 ? 'rgba(34,211,238,0.6)' : layer === 1 ? 'rgba(168,85,247,0.4)' : 'rgba(251,191,36,0.25)';
          ctx.lineWidth = 2;
          const slice = w / bufLen;
          let x = 0;
          for (let i = 0; i < bufLen; i++) {
            const v = timeData[i] / 128.0;
            const tide = Math.sin((Date.now()/1000 * tideSpeed) + (i*0.008) + (layer*2.1)) * tideIntensity * 35;
            const y = (v * h/2) + tide + h/2;
            if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
            x += slice;
          }
          ctx.stroke();
        }

        const barW = w / 72;
        for (let i = 0; i < 72; i++) {
          const barH = (freqData[i * 3] / 255) * h * 0.35;
          const hue = 175 + (i/72) * 70;
          ctx.fillStyle = `hsla(${hue}, 80%, 55%, 0.45)`;
          ctx.fillRect(i * barW, h - barH, barW - 1, barH);
        }
      } else {
        ctx.strokeStyle = 'rgba(34,211,238,0.15)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let x = 0; x < w; x++) {
          const y = h/2 + Math.sin((x*0.015) + (Date.now()/1200)) * 18;
          if (x===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
        }
        ctx.stroke();
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, tideSpeed, tideIntensity]);

  const toggleStep = (idx) => {
    const p = [...pattern];
    p[idx] = !p[idx];
    setPattern(p);
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopNote();
      setIsPlaying(false);
    } else {
      initAudio();
      if (audioCtxRef.current?.state === 'suspended') audioCtxRef.current.resume();
      setIsPlaying(true);
      if (!sequencerOn && !arpOn) playNote(frequency);
    }
  };

  const formatTime = (s) => `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;

  return (
    <div className="w-full h-full bg-slate-950 text-slate-100 p-6 overflow-auto">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-amber-400 bg-clip-text text-transparent">
            Tide Synth
          </h1>
          <p className="text-slate-400 text-sm mt-1">Fluid Motion Audio Engine • Dragon Nine</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={togglePlay}
            className={`px-8 py-3 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
              isPlaying 
                ? 'bg-red-500/20 border-2 border-red-400 text-red-300 shadow-[0_0_20px_rgba(248,113,113,0.3)]' 
                : 'bg-cyan-500/20 border-2 border-cyan-400 text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.3)]'
            }`}>
            {isPlaying ? '◼ Stop' : '▶ Invoke'}
          </button>
          <button onClick={isRecording ? stopRecording : startRecording}
            className={`px-4 py-3 rounded-xl font-bold text-sm transition-all border-2 ${
              isRecording
                ? 'bg-rose-500/20 border-rose-400 text-rose-300 animate-pulse'
                : 'bg-slate-800 border-slate-600 text-slate-300 hover:border-slate-400'
            }`}>
            {isRecording ? `⏹ ${formatTime(recordTime)}` : '⏺ Rec'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <div className="relative rounded-2xl border border-slate-700 bg-slate-900/50 overflow-hidden shadow-2xl">
            <canvas ref={canvasRef} width={900} height={320} className="w-full h-[320px]" />
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-cyan-400 animate-pulse' : 'bg-slate-600'}`} />
              <span className="text-xs text-slate-400 font-mono">{isPlaying ? 'LIVE' : 'STANDBY'}</span>
              {midiEnabled && <span className="text-xs text-purple-400 font-mono ml-2">MIDI ON</span>}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-700 bg-slate-900/50 p-5">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <h3 className="text-lg font-semibold text-slate-200">Tide Pattern</h3>
              <div className="flex items-center gap-4 flex-wrap">
                <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer">
                  <input type="checkbox" checked={sequencerOn} onChange={e => setSequencerOn(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-cyan-500" />
                  Sequencer
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">BPM</span>
                  <input type="range" min="40" max="200" value={bpm} onChange={e => setBpm(Number(e.target.value))}
                    className="w-20 accent-cyan-500" />
                  <span className="text-xs font-mono text-cyan-400 w-8">{bpm}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-1">
              {pattern.map((active, i) => (
                <button key={i} onClick={() => toggleStep(i)}
                  className={`flex-1 h-12 rounded-lg border-2 transition-all duration-150 ${
                    activeStep === i && isPlaying && sequencerOn
                      ? 'border-amber-400 bg-amber-400/30 shadow-[0_0_10px_rgba(251,191,36,0.4)]'
                      : active ? 'border-cyan-400 bg-cyan-400/20' : 'border-slate-700 bg-slate-800/30 hover:border-slate-500'
                  }`}>
                  <span className={`text-[10px] font-mono ${active ? 'text-cyan-300' : 'text-slate-600'}`}>{i+1}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-700 bg-slate-900/50 p-5">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <h3 className="text-lg font-semibold text-slate-200">Arpeggiator</h3>
              <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer">
                <input type="checkbox" checked={arpOn} onChange={e => setArpOn(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-purple-500" />
                Enable
              </label>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['up','down','updown','random','chord'].map(mode => (
                <button key={mode} onClick={() => setArpMode(mode)}
                  className={`px-3 py-2 rounded-lg border-2 text-sm font-semibold capitalize transition-all ${
                    arpMode === mode 
                      ? 'border-purple-400 bg-purple-400/20 text-purple-300' 
                      : 'border-slate-700 bg-slate-800/30 text-slate-400 hover:border-slate-500'
                  }`}>
                  {mode}
                </button>
              ))}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Range</span>
                <input type="range" min="1" max="4" step="1" value={arpRange}
                  onChange={e => setArpRange(Number(e.target.value))}
                  className="w-16 accent-purple-500" />
                <span className="text-xs font-mono text-purple-400">{arpRange} oct</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-700 bg-slate-900/50 p-5">
            <h3 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">Waveform</h3>
            <div className="flex gap-3">
              {['sine','square','sawtooth','triangle'].map(t => (
                <WaveformIcon key={t} type={t} active={waveform===t} onClick={() => setWaveform(t)} />
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-700 bg-slate-900/50 p-5">
            <div className="flex justify-between mb-2">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Frequency</h3>
              <span className="text-cyan-400 font-mono text-sm">{Math.round(frequency)} Hz</span>
            </div>
            <input type="range" min="55" max="880" step="1" value={frequency}
              onChange={e => { const f=Number(e.target.value); setFrequency(f); if(isPlaying && !sequencerOn && !arpOn) playNote(f); }}
              className="w-full accent-cyan-500" />
            <div className="flex justify-between mt-1 text-xs text-slate-600 font-mono"><span>A1</span><span>A3</span><span>A5</span></div>
          </div>

          <div className="rounded-2xl border border-slate-700 bg-slate-900/50 p-5">
            <h3 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">Filter</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1"><span className="text-xs text-slate-500">Cutoff</span><span className="text-xs text-purple-400 font-mono">{filterFreq} Hz</span></div>
                <input type="range" min="100" max="12000" step="10" value={filterFreq} onChange={e=>setFilterFreq(Number(e.target.value))} className="w-full accent-purple-500" />
              </div>
              <div>
                <div className="flex justify-between mb-1"><span className="text-xs text-slate-500">Resonance</span><span className="text-xs text-purple-400 font-mono">{resonance}</span></div>
                <input type="range" min="0.1" max="20" step="0.1" value={resonance} onChange={e=>setResonance(Number(e.target.value))} className="w-full accent-purple-500" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-700 bg-slate-900/50 p-5">
            <h3 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">Delay</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1"><span className="text-xs text-slate-500">Time</span><span className="text-xs text-amber-400 font-mono">{delayTime.toFixed(2)}s</span></div>
                <input type="range" min="0.05" max="2" step="0.01" value={delayTime} onChange={e=>setDelayTime(Number(e.target.value))} className="w-full accent-amber-500" />
              </div>
              <div>
                <div className="flex justify-between mb-1"><span className="text-xs text-slate-500">Feedback</span><span className="text-xs text-amber-400 font-mono">{Math.round(delayFeedback*100)}%</span></div>
                <input type="range" min="0" max="0.9" step="0.01" value={delayFeedback} onChange={e=>setDelayFeedback(Number(e.target.value))} className="w-full accent-amber-500" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-700 bg-slate-900/50 p-5">
            <h3 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">Reverb</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1"><span className="text-xs text-slate-500">Mix</span><span className="text-xs text-emerald-400 font-mono">{Math.round(reverbMix*100)}%</span></div>
                <input type="range" min="0" max="1" step="0.01" value={reverbMix} onChange={e=>setReverbMix(Number(e.target.value))} className="w-full accent-emerald-500" />
              </div>
              <div>
                <div className="flex justify-between mb-1"><span className="text-xs text-slate-500">Decay</span><span className="text-xs text-emerald-400 font-mono">{reverbDecay.toFixed(1)}s</span></div>
                <input type="range" min="0.5" max="5" step="0.1" value={reverbDecay} onChange={e=>setReverbDecay(Number(e.target.value))} className="w-full accent-emerald-500" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-700 bg-slate-900/50 p-5">
            <h3 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">Tide Motion</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1"><span className="text-xs text-slate-500">Speed</span><span className="text-xs text-rose-400 font-mono">{tideSpeed.toFixed(2)} Hz</span></div>
                <input type="range" min="0.1" max="5" step="0.1" value={tideSpeed} onChange={e=>setTideSpeed(Number(e.target.value))} className="w-full accent-rose-500" />
              </div>
              <div>
                <div className="flex justify-between mb-1"><span className="text-xs text-slate-500">Intensity</span><span className="text-xs text-rose-400 font-mono">{Math.round(tideIntensity*100)}%</span></div>
                <input type="range" min="0" max="1" step="0.01" value={tideIntensity} onChange={e=>setTideIntensity(Number(e.target.value))} className="w-full accent-rose-500" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-700 bg-slate-900/50 p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">MIDI Input</h3>
              <button onClick={initMIDI}
                className={`text-xs px-3 py-1 rounded-md border transition-all ${
                  midiEnabled ? 'border-purple-400 text-purple-300 bg-purple-400/10' : 'border-slate-600 text-slate-400 hover:border-slate-400'
                }`}>
                {midiEnabled ? 'Connected' : 'Enable'}
              </button>
            </div>
            {midiDevices.length > 0 ? (
              <div className="space-y-1">
                {midiDevices.map((d, i) => (
                  <div key={i} className="text-xs text-slate-500 font-mono truncate">• {d}</div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-600">{midiEnabled ? 'No devices found' : 'Click Enable to scan'}</p>
            )}
            {lastMidiNote !== null && (
              <p className="text-xs text-purple-400 mt-2 font-mono">Last: {lastMidiNote} ({Math.round(midiToFreq(lastMidiNote))} Hz)</p>
            )}
          </div>

          <div className="rounded-2xl border border-slate-700 bg-slate-900/50 p-5">
            <div className="flex justify-between mb-2">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Sovereign Level</h3>
              <span className="text-cyan-400 font-mono text-sm">{Math.round(volume*100)}%</span>
            </div>
            <input type="range" min="0" max="1" step="0.01" value={volume} onChange={e=>setVolume(Number(e.target.value))} className="w-full accent-cyan-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TideSynth;
