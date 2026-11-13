# Dragon9 — Coastal Time Anchor

An interactive, conceptual Three.js coastal relief model covering a 27 km radius (54 km diameter). It includes the nine-pylon Synchronize Time Anchor Point, animated surf break, river mouth, coastal town, surrounding hills, vegetation, survey rings, and a lighthouse.

## Run

- Development: `npm run dev`
- Production: `npm run build`, then `npm run preview`

## Controls

Drag to orbit, scroll/pinch to zoom, or select one of the four site buttons for a close-up. Number keys 1–4 select sites; 0 restores the overview; Space pauses/resumes the field. Map layers can be independently toggled. Select “Play narration” (or press N) to hear Kimitimi’s artist statement through the browser’s speech voice; select it again to stop. “Play power beat” (or B) starts an original pre-rendered 92 BPM instrumental; no recorded music or samples are used. The instrumental ducks beneath narration.

The geography is an original concept, not a georeferenced survey. Distances use 1 scene unit = 1 km; landmark and settlement vertical scales are exaggerated for legibility. No data is stored or transmitted.

## Deterministic capture

Open `?t=0` (or another time in seconds) to render a paused frame. `window.__seek(t)`, `window.__play()`, and `window.__SCENE_READY__` support reproducible capture. The animation loop is 12 seconds.
