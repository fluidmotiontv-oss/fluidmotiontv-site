import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import * as geom from '../utils/geometry';
import * as math from '../utils/math';
import * as noise from '../utils/noise';

export interface WebGLObject {
  id: string;
  name: string;
  type: 'plane' | 'cube' | 'sphere' | 'torus' | 'cylinder';
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  color: [number, number, number];
  visible: boolean;
}

export interface UniformValue {
  name: string;
  type: 'float' | 'vec2' | 'vec3' | 'vec4' | 'color';
  value: number[];
}

export interface WebGLCanvasProps {
  objects: WebGLObject[];
  vertexShaderSource: string;
  fragmentShaderSource: string;
  customUniforms: UniformValue[];
  isScreenSpaceMode: boolean; // Raymarching / Global vs 3D Scene
  selectedObjectId: string | null;
  onCompileStatus: (status: {
    success: boolean;
    vertexError: string | null;
    fragmentError: string | null;
    linkError: string | null;
  }) => void;
  onFPSUpdate: (fps: number) => void;
  audioDataTextureBuffer?: Uint8Array | null;
  audioVolume?: number;
  audioBass?: number;
  audioMids?: number;
  audioTreble?: number;
  audioEngine?: any;
  postProcessing?: {
    bloom: boolean;
    bloomIntensity: number;
    bloomRadius: number;
    vignette: boolean;
    vignetteIntensity: number;
    vignetteSmoothness: number;
    chromatic: boolean;
    chromaticIntensity: number;
  } | null;
}

export interface WebGLCanvasRef {
  takeSnapshot: () => string | null;
  startRecording: () => void;
  stopRecording: () => Promise<Blob | null>;
  isRecording: boolean;
}

export const WebGLCanvas = forwardRef<WebGLCanvasRef, WebGLCanvasProps>(({
  objects,
  vertexShaderSource,
  fragmentShaderSource,
  customUniforms,
  isScreenSpaceMode,
  selectedObjectId,
  onCompileStatus,
  onFPSUpdate,
  audioDataTextureBuffer = null,
  audioVolume = 0,
  audioBass = 0,
  audioMids = 0,
  audioTreble = 0,
  audioEngine = null,
  postProcessing = null,
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  
  // Programs & Shaders Cache
  const activeProgramRef = useRef<WebGLProgram | null>(null);
  
  // Interactive camera state
  const cameraRef = useRef({
    theta: 0.8, // yaw
    phi: 1.1,   // pitch
    radius: 4.5,
    target: [0, 0, 0] as [number, number, number],
  });
  const mouseStateRef = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
    button: 0,
  });

  // Time & Animation
  const startTimeRef = useRef(Date.now());
  const lastTimeRef = useRef(Date.now());
  const frameCountRef = useRef(0);
  const animationFrameIdRef = useRef<number | null>(null);

  // Textures cache
  const texturesRef = useRef<{
    white: WebGLTexture | null;
    perlin: WebGLTexture | null;
    cellular: WebGLTexture | null;
    gradient: WebGLTexture | null;
    audio: WebGLTexture | null;
  }>({ white: null, perlin: null, cellular: null, gradient: null, audio: null });

  // Geometry buffers cache
  const geometriesRef = useRef<{
    [key: string]: {
      positionBuffer: WebGLBuffer;
      normalBuffer: WebGLBuffer;
      texcoordBuffer: WebGLBuffer;
      indexBuffer: WebGLBuffer;
      count: number;
    };
  }>({});

  // Media Capture state
  const [isRecordingState, setIsRecordingState] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  // Expose controls to parent
  useImperativeHandle(ref, () => ({
    takeSnapshot: () => {
      const canvas = canvasRef.current;
      if (!canvas || !glRef.current) return null;
      
      // Render once to make sure drawing buffer is ready
      renderScene();
      return canvas.toDataURL('image/png');
    },
    startRecording: () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      recordedChunksRef.current = [];
      try {
        const stream = canvas.captureStream(30); // 30 FPS
        const recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' });
        
        recorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            recordedChunksRef.current.push(e.data);
          }
        };

        recorder.start();
        mediaRecorderRef.current = recorder;
        setIsRecordingState(true);
      } catch (err) {
        console.error('Recording initialization failed', err);
      }
    },
    stopRecording: async () => {
      const recorder = mediaRecorderRef.current;
      if (!recorder) return null;

      return new Promise<Blob | null>((resolve) => {
        recorder.onstop = () => {
          const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
          setIsRecordingState(false);
          resolve(blob);
        };
        recorder.stop();
      });
    },
    isRecording: isRecordingState,
  }));

  // Initial WebGL Setup and Buffers Generation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { preserveDrawingBuffer: true, antialias: true }) || 
               canvas.getContext('experimental-webgl', { preserveDrawingBuffer: true, antialias: true }) as WebGLRenderingContext;

    if (!gl) {
      console.error('WebGL is not supported in this browser.');
      return;
    }
    glRef.current = gl;

    // Generate procedural canvases and load into WebGL textures
    const initTextures = () => {
      const uploadTexture = (canvasEl: HTMLCanvasElement): WebGLTexture | null => {
        const tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvasEl);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.generateMipmap(gl.TEXTURE_2D);
        return tex;
      };

      texturesRef.current.white = uploadTexture(noise.generateWhiteNoise());
      texturesRef.current.perlin = uploadTexture(noise.generatePerlinNoise());
      texturesRef.current.cellular = uploadTexture(noise.generateCellularNoise());
      texturesRef.current.gradient = uploadTexture(noise.generateGradientMap());
    };
    initTextures();

    // Setup geometries and upload to VBOs
    const initGeometries = () => {
      const uploadGeometry = (mesh: geom.MeshData): typeof geometriesRef.current[string] => {
        const positionBuffer = gl.createBuffer()!;
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, mesh.positions, gl.STATIC_DRAW);

        const normalBuffer = gl.createBuffer()!;
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, mesh.normals, gl.STATIC_DRAW);

        const texcoordBuffer = gl.createBuffer()!;
        gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, mesh.texcoords, gl.STATIC_DRAW);

        const indexBuffer = gl.createBuffer()!;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.indices, gl.STATIC_DRAW);

        return {
          positionBuffer,
          normalBuffer,
          texcoordBuffer,
          indexBuffer,
          count: mesh.indices.length,
        };
      };

      geometriesRef.current.plane = uploadGeometry(geom.createPlane());
      geometriesRef.current.cube = uploadGeometry(geom.createCube());
      geometriesRef.current.sphere = uploadGeometry(geom.createSphere());
      geometriesRef.current.torus = uploadGeometry(geom.createTorus());
      geometriesRef.current.cylinder = uploadGeometry(geom.createCylinder());
    };
    initGeometries();

    // Clean up
    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, []);

  // Live Shader Compiler & Linker Effect
  useEffect(() => {
    const gl = glRef.current;
    if (!gl) return;

    // Helper to compile a single shader and return compile status/errors
    const compileShader = (source: string, type: number): { shader: WebGLShader | null; error: string | null } => {
      const shader = gl.createShader(type);
      if (!shader) return { shader: null, error: 'Could not create WebGL shader instance.' };

      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
      if (!success) {
        const log = gl.getShaderInfoLog(shader);
        gl.deleteShader(shader);
        return { shader: null, error: log || 'Shader compilation failed with unknown error.' };
      }
      return { shader, error: null };
    };

    const vsResult = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
    const fsResult = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);

    if (vsResult.error || fsResult.error) {
      onCompileStatus({
        success: false,
        vertexError: vsResult.error,
        fragmentError: fsResult.error,
        linkError: null,
      });
      // Do not replace active program with broken code
      return;
    }

    // Attempt Linkage
    const program = gl.createProgram();
    if (!program) {
      onCompileStatus({
        success: false,
        vertexError: null,
        fragmentError: null,
        linkError: 'Failed to create WebGL program context.',
      });
      return;
    }

    gl.attachShader(program, vsResult.shader!);
    gl.attachShader(program, fsResult.shader!);
    gl.linkProgram(program);

    const linkSuccess = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!linkSuccess) {
      const linkLog = gl.getProgramInfoLog(program);
      gl.deleteProgram(program);
      onCompileStatus({
        success: false,
        vertexError: null,
        fragmentError: null,
        linkError: linkLog || 'Program linkage failed.',
      });
      return;
    }

    // Clean up prior shader instances
    gl.deleteShader(vsResult.shader!);
    gl.deleteShader(fsResult.shader!);

    // Save and register active program
    activeProgramRef.current = program;
    onCompileStatus({
      success: true,
      vertexError: null,
      fragmentError: null,
      linkError: null,
    });
  }, [vertexShaderSource, fragmentShaderSource]);

  // Main Render Loop Orchestrator
  const renderScene = () => {
    const gl = glRef.current;
    const canvas = canvasRef.current;
    const program = activeProgramRef.current;

    if (!gl || !canvas || !program) return;

    // Auto-resize viewport
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const width = Math.floor(rect.width * dpr);
    const height = Math.floor(rect.height * dpr);
    
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.04, 0.05, 0.07, 1.0); // Dark sleek charcoal base
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);

    gl.useProgram(program);

    // Compute elapsed and delta times
    const now = Date.now();
    const u_time = (now - startTimeRef.current) / 1000;
    
    // FPS counter calculation
    frameCountRef.current++;
    if (now - lastTimeRef.current >= 1000) {
      onFPSUpdate(Math.round((frameCountRef.current * 1000) / (now - lastTimeRef.current)));
      frameCountRef.current = 0;
      lastTimeRef.current = now;
    }

    // Bind basic standard uniforms
    const uTimeLoc = gl.getUniformLocation(program, 'u_time');
    if (uTimeLoc) gl.uniform1f(uTimeLoc, uTimeLoc ? u_time : 0);

    const uResolutionLoc = gl.getUniformLocation(program, 'u_resolution');
    if (uResolutionLoc) gl.uniform2f(uResolutionLoc, canvas.width, canvas.height);

    // Camera setup based on orbit inputs
    const cam = cameraRef.current;
    const eyeX = cam.radius * Math.sin(cam.phi) * Math.sin(cam.theta);
    const eyeY = cam.radius * Math.cos(cam.phi);
    const eyeZ = cam.radius * Math.sin(cam.phi) * Math.cos(cam.theta);
    const eye = [eyeX + cam.target[0], eyeY + cam.target[1], eyeZ + cam.target[2]];

    const uCameraPosLoc = gl.getUniformLocation(program, 'u_cameraPosition');
    if (uCameraPosLoc) gl.uniform3f(uCameraPosLoc, eye[0], eye[1], eye[2]);

    // Bind textures into texture units 0 - 3
    const bindTex = (unit: number, name: string, tex: WebGLTexture | null) => {
      if (!tex) return;
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      const loc = gl.getUniformLocation(program, name);
      if (loc) gl.uniform1i(loc, unit);
    };

    bindTex(0, 'u_noiseWhite', texturesRef.current.white);
    bindTex(1, 'u_noisePerlin', texturesRef.current.perlin);
    bindTex(2, 'u_noiseCellular', texturesRef.current.cellular);
    bindTex(3, 'u_noiseGradient', texturesRef.current.gradient);

    // Read from audioEngine if provided, falling back to manual props
    let activeTextureBuffer = audioDataTextureBuffer;
    let activeVolume = audioVolume;
    let activeBass = audioBass;
    let activeMids = audioMids;
    let activeTreble = audioTreble;

    if (audioEngine) {
      const audio = audioEngine.analyze();
      activeTextureBuffer = audio.textureBuffer;
      activeVolume = audio.volume;
      activeBass = audio.bass;
      activeMids = audio.mids;
      activeTreble = audio.treble;
    }

    // Bind & Upload Audio DSP data texture to slot 4 (Y=0 frequency, Y=1 waveform)
    if (activeTextureBuffer) {
      gl.activeTexture(gl.TEXTURE4);
      if (!texturesRef.current.audio) {
        texturesRef.current.audio = gl.createTexture();
      }
      gl.bindTexture(gl.TEXTURE_2D, texturesRef.current.audio);
      
      // Discrete DSP sampler settings
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      
      // Upload 256 x 2 pixel RGBA texture dynamically
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        256,
        2,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        activeTextureBuffer
      );

      const uAudioDataLoc = gl.getUniformLocation(program, 'u_audioData');
      if (uAudioDataLoc) gl.uniform1i(uAudioDataLoc, 4);
    }

    // Bind sub-band numerical scalar uniforms
    const uAudioVolumeLoc = gl.getUniformLocation(program, 'u_audioVolume');
    if (uAudioVolumeLoc) gl.uniform1f(uAudioVolumeLoc, activeVolume);

    const uBassLoc = gl.getUniformLocation(program, 'u_bass');
    if (uBassLoc) gl.uniform1f(uBassLoc, activeBass);

    const uMidsLoc = gl.getUniformLocation(program, 'u_mids');
    if (uMidsLoc) gl.uniform1f(uMidsLoc, activeMids);

    const uTrebleLoc = gl.getUniformLocation(program, 'u_treble');
    if (uTrebleLoc) gl.uniform1f(uTrebleLoc, activeTreble);

    // Bind custom user uniforms
    customUniforms.forEach((u) => {
      const loc = gl.getUniformLocation(program, u.name);
      if (!loc) return;

      switch (u.type) {
        case 'float':
          gl.uniform1f(loc, u.value[0]);
          break;
        case 'vec2':
          gl.uniform2f(loc, u.value[0], u.value[1]);
          break;
        case 'vec3':
        case 'color':
          gl.uniform3f(loc, u.value[0], u.value[1], u.value[2]);
          break;
        case 'vec4':
          gl.uniform4f(loc, u.value[0], u.value[1], u.value[2], u.value[3]);
          break;
      }
    });

    // Bind global post-processing uniforms
    const uBloomEnabledLoc = gl.getUniformLocation(program, 'u_bloomEnabled');
    if (uBloomEnabledLoc) gl.uniform1f(uBloomEnabledLoc, postProcessing?.bloom ? 1.0 : 0.0);

    const uBloomIntensityLoc = gl.getUniformLocation(program, 'u_bloomIntensity');
    if (uBloomIntensityLoc) gl.uniform1f(uBloomIntensityLoc, postProcessing?.bloomIntensity ?? 0.5);

    const uBloomRadiusLoc = gl.getUniformLocation(program, 'u_bloomRadius');
    if (uBloomRadiusLoc) gl.uniform1f(uBloomRadiusLoc, postProcessing?.bloomRadius ?? 1.0);

    const uVignetteEnabledLoc = gl.getUniformLocation(program, 'u_vignetteEnabled');
    if (uVignetteEnabledLoc) gl.uniform1f(uVignetteEnabledLoc, postProcessing?.vignette ? 1.0 : 0.0);

    const uVignetteIntensityLoc = gl.getUniformLocation(program, 'u_vignetteIntensity');
    if (uVignetteIntensityLoc) gl.uniform1f(uVignetteIntensityLoc, postProcessing?.vignetteIntensity ?? 0.8);

    const uVignetteSmoothnessLoc = gl.getUniformLocation(program, 'u_vignetteSmoothness');
    if (uVignetteSmoothnessLoc) gl.uniform1f(uVignetteSmoothnessLoc, postProcessing?.vignetteSmoothness ?? 0.5);

    const uChromaticEnabledLoc = gl.getUniformLocation(program, 'u_chromaticEnabled');
    if (uChromaticEnabledLoc) gl.uniform1f(uChromaticEnabledLoc, postProcessing?.chromatic ? 1.0 : 0.0);

    const uChromaticIntensityLoc = gl.getUniformLocation(program, 'u_chromaticIntensity');
    if (uChromaticIntensityLoc) gl.uniform1f(uChromaticIntensityLoc, postProcessing?.chromaticIntensity ?? 0.01);

    const projectionMatrix = math.perspective(Math.PI / 4, canvas.width / canvas.height, 0.1, 100);
    const viewMatrix = math.lookAt(eye, cam.target, [0, 1, 0]);

    const uProjLoc = gl.getUniformLocation(program, 'u_projectionMatrix');
    if (uProjLoc) gl.uniformMatrix4fv(uProjLoc, false, projectionMatrix);

    const uViewLoc = gl.getUniformLocation(program, 'u_viewMatrix');
    if (uViewLoc) gl.uniformMatrix4fv(uViewLoc, false, viewMatrix);

    // Map attribute buffers
    const positionAttr = gl.getAttribLocation(program, 'a_position');
    const normalAttr = gl.getAttribLocation(program, 'a_normal');
    const texcoordAttr = gl.getAttribLocation(program, 'a_texcoord');

    const drawMesh = (meshKey: string, modelMatrix: math.Mat4, objectColor: [number, number, number]) => {
      const geomBuffers = geometriesRef.current[meshKey];
      if (!geomBuffers) return;

      // Color binding
      const uColorLoc = gl.getUniformLocation(program, 'u_color');
      if (uColorLoc) gl.uniform3f(uColorLoc, objectColor[0], objectColor[1], objectColor[2]);

      const uModelLoc = gl.getUniformLocation(program, 'u_modelMatrix');
      if (uModelLoc) gl.uniformMatrix4fv(uModelLoc, false, modelMatrix);

      // Attribute position
      if (positionAttr !== -1) {
        gl.enableVertexAttribArray(positionAttr);
        gl.bindBuffer(gl.ARRAY_BUFFER, geomBuffers.positionBuffer);
        gl.vertexAttribPointer(positionAttr, 3, gl.FLOAT, false, 0, 0);
      }

      // Attribute normal
      if (normalAttr !== -1) {
        gl.enableVertexAttribArray(normalAttr);
        gl.bindBuffer(gl.ARRAY_BUFFER, geomBuffers.normalBuffer);
        gl.vertexAttribPointer(normalAttr, 3, gl.FLOAT, false, 0, 0);
      }

      // Attribute UV coordinates
      if (texcoordAttr !== -1) {
        gl.enableVertexAttribArray(texcoordAttr);
        gl.bindBuffer(gl.ARRAY_BUFFER, geomBuffers.texcoordBuffer);
        gl.vertexAttribPointer(texcoordAttr, 2, gl.FLOAT, false, 0, 0);
      }

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, geomBuffers.indexBuffer);
      gl.drawElements(gl.TRIANGLES, geomBuffers.count, gl.UNSIGNED_SHORT, 0);
    };

    if (isScreenSpaceMode) {
      // Screen space mode renders a single full screen plane
      const identityModel = math.createIdentity();
      drawMesh('plane', identityModel, [1, 1, 1]);
    } else {
      // 3D scene mode renders multiple individual geometries
      objects.forEach((obj) => {
        if (!obj.visible) return;

        let mat = math.createIdentity();
        mat = math.translate(mat, obj.position[0], obj.position[1], obj.position[2]);
        
        // Rotations (XYZ)
        mat = math.rotateX(mat, obj.rotation[0] * Math.PI / 180);
        mat = math.rotateY(mat, obj.rotation[1] * Math.PI / 180);
        mat = math.rotateZ(mat, obj.rotation[2] * Math.PI / 180);

        mat = math.scale(mat, obj.scale[0], obj.scale[1], obj.scale[2]);

        // Draw individual model (selected item gets a subtle color tint/glow if desired)
        drawMesh(obj.type, mat, obj.color);
      });
    }
  };

  // Setup loop run effect
  useEffect(() => {
    const runLoop = () => {
      renderScene();
      animationFrameIdRef.current = requestAnimationFrame(runLoop);
    };
    runLoop();

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [objects, customUniforms, isScreenSpaceMode, selectedObjectId, postProcessing]);

  // Orbit camera dragging & gesture handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    mouseStateRef.current = {
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      button: e.button,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const state = mouseStateRef.current;
    if (!state.isDragging) return;

    const dx = e.clientX - state.startX;
    const dy = e.clientY - state.startY;

    state.startX = e.clientX;
    state.startY = e.clientY;

    const cam = cameraRef.current;

    if (state.button === 0) {
      // Left click drag: Orbit rotate camera
      cam.theta -= dx * 0.007;
      cam.phi = Math.max(0.1, Math.min(Math.PI - 0.1, cam.phi - dy * 0.007));
    } else if (state.button === 1 || e.shiftKey) {
      // Middle click or Shift + drag: Pan camera focal point
      const factor = cam.radius * 0.0015;
      const cosT = Math.cos(cam.theta);
      const sinT = Math.sin(cam.theta);

      cam.target[0] -= (dx * cosT - dy * sinT) * factor;
      cam.target[2] += (dx * sinT + dy * cosT) * factor;
    }
  };

  const handleMouseUp = () => {
    mouseStateRef.current.isDragging = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    const cam = cameraRef.current;
    cam.radius = Math.max(1.0, Math.min(25.0, cam.radius + e.deltaY * 0.005));
  };

  return (
    <div className="relative w-full h-full group bg-black/60 rounded-xl overflow-hidden border border-[#1f212a] shadow-inner">
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onContextMenu={(e) => e.preventDefault()}
        className="w-full h-full cursor-grab active:cursor-grabbing block"
      />
      
      {/* Dynamic Recording/FPS HUD */}
      <div className="absolute top-3 left-4 flex items-center gap-2 pointer-events-none select-none z-10">
        <span className="text-[10px] tracking-wider font-mono bg-black/80 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded shadow-sm flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          RENDER CONTEXT READY
        </span>
        
        {isRecordingState && (
          <span className="text-[10px] tracking-wider font-mono bg-red-500/90 text-white border border-red-500/20 px-2 py-0.5 rounded shadow flex items-center gap-1.5 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
            REC
          </span>
        )}
      </div>

      {/* Camera Instructions overlay */}
      <div className="absolute bottom-3 right-4 bg-[#0d0e12]/80 border border-[#1f212a]/40 backdrop-blur px-2.5 py-1.5 rounded text-[10px] text-gray-500 font-mono pointer-events-none select-none hidden group-hover:block transition-all z-10 shadow">
        Drag: Orbit rotate · Shift+Drag: Pan · Scroll: Zoom
      </div>
    </div>
  );
});

WebGLCanvas.displayName = 'WebGLCanvas';
