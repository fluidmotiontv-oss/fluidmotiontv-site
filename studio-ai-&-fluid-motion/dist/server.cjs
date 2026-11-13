var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json({ limit: "10mb" }));
var aiClient = null;
function getGenAI() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY environment variable is not set. Gemini API calls will fail.");
    }
    aiClient = new import_genai.GoogleGenAI({
      apiKey: apiKey || "",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
  }
  return aiClient;
}
var memoryVault = {
  nodeName: "Port Waikato, Aotearoa (Pee Dub Coastal Node)",
  ispTunnel: "dragon9ph.mesh (AS65001 Sovereign Mesh Gateway)",
  clockAnchor: "projector_clock.png",
  totalHarmonyNotesDistributed: 14250,
  communityFundBalance: 1282.5,
  // 9% of total
  ecosystemVoidBalance: 142.5
  // 1% of total
};
var artistLedgers = [
  { id: "art-1", artistName: "Kai (Pee Dub Shredder)", harmonyNotes: 3400, shavings: 120, totalEarned: 3777, splitCreator: 3400, splitCommunity: 340, splitVoid: 37 },
  { id: "art-2", artistName: "Aroha (Coastal Beats)", harmonyNotes: 4800, shavings: 250, totalEarned: 5333, splitCreator: 4800, splitCommunity: 480, splitVoid: 53 },
  { id: "art-3", artistName: "Tane (Vector Wave)", harmonyNotes: 2100, shavings: 90, totalEarned: 2333, splitCreator: 2100, splitCommunity: 210, splitVoid: 23 },
  { id: "art-4", artistName: "Campground Crew", harmonyNotes: 3950, shavings: 180, totalEarned: 4388, splitCreator: 3950, splitCommunity: 395, splitVoid: 43 }
];
var radioSubmissions = [
  { id: "rad-1", trackName: "Port Waikato Sunset Dub", artistName: "Aroha (Coastal Beats)", bpm: 82, genre: "Dub / Reggae", status: "Now Playing", submittedAt: "D9-H12 (11:14 AM)", harmonyEarned: 150 },
  { id: "rad-2", trackName: "Pee Dub Point Break Trip-Hop", artistName: "Kai (Pee Dub Shredder)", bpm: 94, genre: "Trip-Hop", status: "Queued", submittedAt: "D9-H14 (01:22 PM)", harmonyEarned: 120 },
  { id: "rad-3", trackName: "Campground Fire Funky House", artistName: "Campground Crew", bpm: 122, genre: "Funky House", status: "Queued", submittedAt: "D9-H16 (03:10 PM)", harmonyEarned: 200 }
];
var registeredAlbums = [
  { id: "alb-1", title: "Sovereign Surf Sessions Vol. 1", artist: "Pee Dub Collective", tracksCount: 8, bpmRange: "78-124 BPM", priceHarmony: 150, sales: 42, coverTheme: "Sunset Barrel" },
  { id: "alb-2", title: "Dragon 9 Apex Echoes", artist: "Aroha & Friends", tracksCount: 6, bpmRange: "80-95 BPM", priceHarmony: 120, sales: 29, coverTheme: "Vector Waveform" }
];
var artworkSales = [
  { id: "art-s1", title: "Pee Dub Barrel Vector Sticker", artist: "Tane (Vector Wave)", type: "Vector Art (1:1)", priceHarmony: 30, sales: 88, rating: 4.9 },
  { id: "art-s2", title: "Coastal Sunset 9:16 AR Lens", artist: "Kai (Pee Dub Shredder)", type: "AR Beach Overlay (9:16)", priceHarmony: 45, sales: 64, rating: 5 }
];
function applyPGFilter(text) {
  const badWordsMap = {
    fuck: "wipeout",
    fucking: "gnarly-wipeout",
    shit: "bogus-wave",
    bitch: "barney",
    ass: "fin-chop",
    asshole: "kook",
    damn: "dang-set",
    crap: "foam-soup",
    dick: "drifter",
    bastard: "heavy-current"
  };
  let count = 0;
  let filteredText = text;
  Object.keys(badWordsMap).forEach((word) => {
    const regex = new RegExp(`\\b${word}\\b`, "gi");
    if (regex.test(filteredText)) {
      count++;
      filteredText = filteredText.replace(regex, badWordsMap[word]);
    }
  });
  return { filteredText, replacementCount: count };
}
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    node: memoryVault.nodeName,
    protocol: "Dragon 9 Sovereign Clock Engine & Fluid Motion Architecture",
    ispTunnel: memoryVault.ispTunnel,
    clockAnchor: memoryVault.clockAnchor,
    uptimeMinutes: Math.floor(process.uptime() / 60)
  });
});
app.get("/api/vault/state", (req, res) => {
  res.json({
    vault: memoryVault,
    artistLedgers,
    radioSubmissions,
    registeredAlbums,
    artworkSales
  });
});
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message string is required." });
    }
    const { filteredText: cleanUserMsg, replacementCount } = applyPGFilter(message);
    const ai = getGenAI();
    const systemInstruction = `
You are "Studio AI", the Principal Creative Mentor and Assistant Editor for Studio AI & Fluid Motion Unified Studio at Port Waikato, Aotearoa (Pee Dub Coastal Node).

PROJECT PROTOCOL: Dragon 9 Sovereign Clock Engine & Fluid Motion Architecture.
PRIMARY NODE: Port Waikato, Aotearoa (Pee Dub Coastal Node).

MISSION & CREATIVE TONE:
- Core Purpose: Empower young creators, surfers, campground guests, and local beachgoers to turn ocean sessions, outdoor quests, and nature footage into vector art, beats, digital comics, and AR stories.
- Voice & Tone: Supportive, encouraging, hype-focused, and mentor-first. Natural surf and creative terminology ("Stoke level high!", "Let's lay down a beat", "Awesome wave!", "Clean line!").
- Zero Jargon Rule: NEVER use technical developer jargon (e.g. refrain from technical API/database jargon with users). If asked about technical mechanics, keep it simple, hype, and focus on creative vibes ("Let me handle the heavy lifting \u2014 what vibe are you feeling for this set?").
- Inclusivity Benchmark: "The best surfer out there is the one having the most fun. Everyone brings value."
- Signature Sign-off: Always sign off or conclude responses with "Catch you on the next set. \u{1F919}" or similar surf mentor warmth.
- D9 Clock Awareness: Keep responses mindful of the 26 Operational Hours (54 min each) and the 18-minute Apex Wedges (Midday & Midnight pause/premiere windows).
- Sovereign Split: Remind creators that 90% goes to them, 9% to local campground gear/community fund, and 1% to ecosystem void.
    `;
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: cleanUserMsg,
      config: {
        systemInstruction,
        temperature: 0.85
      }
    });
    const reply = response.text || "Stoke level high! Keep creating rad vibes. Catch you on the next set. \u{1F919}";
    res.json({
      reply,
      pgFiltered: replacementCount > 0,
      filterNotice: replacementCount > 0 ? "Surf Slang Guardrail Applied: Profanity converted to coastal surf slang! \u{1F30A}" : null
    });
  } catch (err) {
    console.error("Error in /api/chat:", err);
    res.status(500).json({
      error: "Studio AI mentor is currently riding a wave. Try again in a second!",
      details: err.message
    });
  }
});
app.post("/api/vectorize-prompt", async (req, res) => {
  try {
    const { userPrompt, aspectRatio } = req.body;
    const ai = getGenAI();
    const systemInstruction = `
You are the Vector Art & Sticker Assistant for Studio AI at Port Waikato, Aotearoa.
Convert the user's creative idea into a rich SVG styling concept.
Output a JSON object with:
- title: A cool surf/coastal sticker title
- promptDescription: Refined visual prompt for vector artwork
- colorPalette: Array of 4-5 hex colors inspired by Pee Dub ocean, black sand sunset, surf lime, or neon sunset.
- stickerStyle: Short description of lines (e.g., "Bold 3px black outlines, flat vector gradients, white sticker margin")
- beachSlangTag: A catchy coastal tag
    `;
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Idea: ${userPrompt || "A surfboard breaking through sunset ocean barrel"}. Target aspect ratio: ${aspectRatio || "1:1"}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json"
      }
    });
    let result = {};
    try {
      result = JSON.parse(response.text || "{}");
    } catch {
      result = {
        title: "Pee Dub Wave Rider",
        promptDescription: userPrompt,
        colorPalette: ["#0284c7", "#f97316", "#10b981", "#1e293b", "#ffffff"],
        stickerStyle: "Bold 4px vector contour, vibrant coastal fills",
        beachSlangTag: "Stoke High!"
      };
    }
    res.json(result);
  } catch (err) {
    console.error("Error in /api/vectorize-prompt:", err);
    res.status(500).json({ error: err.message });
  }
});
app.post("/api/comic-assistant", async (req, res) => {
  try {
    const { theme, panelCount = 4 } = req.body;
    const ai = getGenAI();
    const systemInstruction = `
You are the Collaborative Comic Builder Assistant for Studio AI (Port Waikato node).
Generate a comic story arc with ${panelCount} panels.
Return JSON with:
- storyTitle: Catchy surf/coastal comic title
- panels: Array of objects [{ panelIndex: 1, sceneDescription: "...", dialogue: "...", speaker: "...", jewelTagSuggestion: "e.g. @Kai_Shredder" }]
Ensure all dialogue is fun, PG rated, and filled with surf stoke!
    `;
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Comic theme: ${theme || "First time catching the Port Waikato point break barrel"}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json"
      }
    });
    let result = {};
    try {
      result = JSON.parse(response.text || "{}");
    } catch {
      result = {
        storyTitle: "Tales from Pee Dub Point",
        panels: [
          { panelIndex: 1, sceneDescription: "Sun rising over Port Waikato sand dunes with mist", dialogue: "Check that swell! Pure glass out there!", speaker: "Kai", jewelTagSuggestion: "@Kai_Shredder" },
          { panelIndex: 2, sceneDescription: "Paddling out into the lineup past the black sand point", dialogue: "Paddle hard! Here comes the set of the morning!", speaker: "Aroha", jewelTagSuggestion: "@Aroha_Beats" },
          { panelIndex: 3, sceneDescription: "Dropping into a deep turquoise barrel with golden light reflections", dialogue: "Yewww! Stoke level maximum!", speaker: "Tane", jewelTagSuggestion: "@Tane_Vector" },
          { panelIndex: 4, sceneDescription: "High-fiving on the beach near campground fire", dialogue: "Let's turn this ride into a beat and a comic panel!", speaker: "Crew", jewelTagSuggestion: "@Campground_Crew" }
        ]
      };
    }
    res.json(result);
  } catch (err) {
    console.error("Error in /api/comic-assistant:", err);
    res.status(500).json({ error: err.message });
  }
});
app.post("/api/radio/submit", (req, res) => {
  const { trackName, artistName, bpm, genre } = req.body;
  if (!trackName) {
    return res.status(400).json({ error: "Track name is required." });
  }
  const newSub = {
    id: `rad-${Date.now()}`,
    trackName: trackName || "Pee Dub Freestyle Beat",
    artistName: artistName || "Campground Surfer",
    bpm: Number(bpm) || 85,
    genre: genre || "Dub / Reggae",
    status: "Queued",
    submittedAt: `D9-H${Math.floor(Math.random() * 26) + 1} (${(/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })})`,
    harmonyEarned: 100
  };
  radioSubmissions.unshift(newSub);
  memoryVault.totalHarmonyNotesDistributed += 100;
  memoryVault.communityFundBalance += 10;
  memoryVault.ecosystemVoidBalance += 1;
  res.json({
    success: true,
    submission: newSub,
    harmonyEarned: 100,
    message: "Beat submitted to /radio/queue! Earned 100 Harmony Notes! \u{1F3B5}"
  });
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Studio AI] Server running on http://0.0.0.0:${PORT} (Node: Port Waikato, Aotearoa)`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
