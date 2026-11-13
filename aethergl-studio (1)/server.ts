import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '10mb' }));

// Initialize Google GenAI
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// AI Shader engineering endpoint
app.post('/api/gemini/generate-shader', async (req, res) => {
  try {
    const { prompt, currentVertex, currentFragment, currentUniforms, action = 'create' } = req.body;

    if (!apiKey) {
      return res.status(500).json({ 
        error: 'Gemini API key is not configured in the workspace settings.' 
      });
    }

    let systemInstruction = `You are a legendary WebGL and GLSL graphics engineer and shader artist, skilled in high-performance raymarching, signing distance fields (SDFs), math-based generative art, custom shading models, 3D vertex displacements, and visual effects. 
Your goal is to fulfill the user's request by returning complete, optimized, compiles-on-first-try WebGL GLSL shaders (Vertex and Fragment) and custom interactive uniform variables.

Rules for Vertex Shaders:
- Target WebGL 1.0/GLSL ES 1.00 or WebGL 2.0 (compatible with standard mobile/desktop browsers). Prefer WebGL 1.0 compatibility unless specified.
- Must accept standard attributes: attribute vec3 a_position; attribute vec3 a_normal; attribute vec2 a_texcoord;
- Must output standard varyings for fragment shader: varying vec3 v_position; varying vec3 v_normal; varying vec2 v_texcoord;
- Must calculate gl_Position. Include standard matrices if needed, or pass-through for screen-space/raymarching effects. Standard uniforms provided: uniform mat4 u_modelMatrix; uniform mat4 u_viewMatrix; uniform mat4 u_projectionMatrix;
- Can deform geometry based on time or custom parameters if requested (e.g. wave vertex displacement).

Rules for Fragment Shaders:
- Set precision mediump float; at the top.
- Must accept matching varyings: varying vec3 v_position; varying vec3 v_normal; varying vec2 v_texcoord;
- Built-in uniforms available by default:
  - uniform float u_time; (elapsed time in seconds)
  - uniform vec2 u_resolution; (canvas width/height in pixels)
  - uniform vec2 u_mouse; (normalized mouse coordinates [0, 1])
  - uniform vec3 u_cameraPosition; (world position of orbit camera)
- To output colors, use gl_FragColor.
- If doing Raymarching, setup the ray origin and ray direction using v_texcoord, camera position, or standard screen ray setup, and render beautiful procedural math shapes (spheres, toruses, fractals, infinite repetition, lighting, shadows, ambient occlusion).

Rules for Custom Uniforms:
- Define any custom uniforms you need in your shader code. Add them to the 'uniforms' JSON array so the UI can draw beautiful slider/color controls for them.
- Supported custom uniform types: "float", "vec2", "vec3", "vec4", "color" (acts as a vec3 color picker in UI).
- Uniform names should start with "u_" (e.g., u_waveSpeed, u_glowIntensity).
- Provide reasonable default values, mins, maxes, and descriptions.

If the action is 'optimize': Refactor the current shaders to make them more performant, reduce branch instructions, use step() or clamp() instead of if-else where possible, and document the optimizations.
If the action is 'debug': Locate errors based on the user's query or logs and fix them.
If the action is 'explain': Thoroughly explain the mathematical concepts in the markdown explanation.

Ensure you always return fully qualified WebGL shader code that doesn't reference missing functions or variables. Always provide both the vertex AND fragment shader code.`;

    const userContent = `Action: ${action.toUpperCase()}
User Prompt: ${prompt}

[CURRENT VERTEX SHADER]
${currentVertex || '// None'}

[CURRENT FRAGMENT SHADER]
${currentFragment || '// None'}

[CURRENT UNIFORMS]
${JSON.stringify(currentUniforms || [], null, 2)}

Fulfill the user's request. Output valid GLSL shader code inside the specified JSON format. Make sure to define the uniforms you declare inside both the GLSL code AND the returned uniforms JSON array so the editor can register them.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userContent,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description: 'A catchy, creative title for the shader preset.'
            },
            vertexShader: {
              type: Type.STRING,
              description: 'The complete GLSL vertex shader code.'
            },
            fragmentShader: {
              type: Type.STRING,
              description: 'The complete GLSL fragment shader code.'
            },
            uniforms: {
              type: Type.ARRAY,
              description: 'Custom uniforms defined in the shader that should be interactive in the editor UI.',
              items: {
                type: Type.OBJECT,
                properties: {
                  name: {
                    type: Type.STRING,
                    description: 'The exact GLSL variable name, e.g., "u_speed".'
                  },
                  type: {
                    type: Type.STRING,
                    description: 'The type of uniform.',
                    enum: ['float', 'vec2', 'vec3', 'vec4', 'color']
                  },
                  defaultValue: {
                    type: Type.ARRAY,
                    description: 'An array of numbers representing the default value (1 number for float, 2 for vec2, 3 for vec3/color, 4 for vec4).',
                    items: { type: Type.NUMBER }
                  },
                  min: {
                    type: Type.NUMBER,
                    description: 'Minimum slider limit (only applicable for float/vec parameters).'
                  },
                  max: {
                    type: Type.NUMBER,
                    description: 'Maximum slider limit (only applicable for float/vec parameters).'
                  },
                  description: {
                    type: Type.STRING,
                    description: 'A friendly description of what this control adjusts.'
                  }
                },
                required: ['name', 'type', 'defaultValue', 'description']
              }
            },
            explanation: {
              type: Type.STRING,
              description: 'A rich markdown explanation of the shader, math, algorithms, and how to interact with it.'
            }
          },
          required: ['title', 'vertexShader', 'fragmentShader', 'uniforms', 'explanation']
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error('Empty response from Gemini API.');
    }

    const parsedResult = JSON.parse(resultText);
    res.json(parsedResult);
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ 
      error: error.message || 'An error occurred during AI shader generation.' 
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', geminiKeyConfigured: !!apiKey });
});

// Setup dev/prod servers
const PORT = process.env.PORT || 3000;

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    
    app.use(vite.middlewares);
    
    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = await import('fs').then(fs => fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8'));
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    // Serve static files in production
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`[AetherGL] Server active at http://localhost:${PORT}`);
  });
}

startServer();
