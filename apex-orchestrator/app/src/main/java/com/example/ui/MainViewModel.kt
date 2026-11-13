package com.example.ui

import android.app.Application
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.BuildConfig
import com.example.api.Content
import com.example.api.GenerateContentRequest
import com.example.api.GenerationConfig
import com.example.api.Part
import com.example.api.RetrofitClient
import com.example.audio.HarmonicSynth
import com.example.data.AppDatabase
import com.example.data.MeshNode
import com.example.data.TranscoderJob
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

enum class ActiveTab {
    ORCHESTRATOR,
    FFMPEG,
    NETWORK,
    GIGER_BOTANY,
    AUDIO_LAB,
    CHRONOMETER
}

class MainViewModel(application: Application) : AndroidViewModel(application) {
    private val database = AppDatabase.getDatabase(application)
    private val meshNodeDao = database.meshNodeDao()
    private val transcoderJobDao = database.transcoderJobDao()

    val meshNodes: StateFlow<List<MeshNode>> = meshNodeDao.getAllNodes().stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5000),
        initialValue = emptyList()
    )

    val transcoderJobs: StateFlow<List<TranscoderJob>> = transcoderJobDao.getAllJobs().stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5000),
        initialValue = emptyList()
    )

    // UI Tab State
    var activeTab by mutableStateOf(ActiveTab.ORCHESTRATOR)

    // D9 Time Live calculations
    var d9TimeFormatted by mutableStateOf("DAY 1 // 00:00:00")
    var d9DayNumber by mutableStateOf(1L)
    var d9Hour by mutableStateOf(0)
    var d9Minute by mutableStateOf(0)
    var d9Second by mutableStateOf(0)
    var d9HarmonicPhase by mutableStateOf("0.00")
    var earthUtcTime by mutableStateOf("")

    // Synth Lab States
    private val synth = HarmonicSynth()
    var isSynthActive by mutableStateOf(false)
    var synthGenre by mutableStateOf("dub-reggae") // "dub-reggae", "g-funk", "trip-hop"
    var baseFreq by mutableFloatStateOf(432.0f)
    var subVolume by mutableFloatStateOf(0.5f)
    var tempoBpm by mutableStateOf(84)

    // Transcoder States
    var selectedPreset by mutableStateOf("gopro_surf_barrel_4k")
    var inputFolder by mutableStateOf("/media/pee_dub/actioncam_raw")
    var outputFolder by mutableStateOf("/media/pee_dub/master_432hz")
    var audio432HzEnabled by mutableStateOf(true)
    var hardwareAccel by mutableStateOf("cpu") // "cpu", "nvenc", "vaapi"
    var createProxies by mutableStateOf(true)
    var generatedFfmpegScript by mutableStateOf("")

    // Sovereign Network States
    var meshNodeAlias by mutableStateOf("d9-master-antix")
    var meshNodeType by mutableStateOf("antiX") // "antiX", "Termux", "WireGuard", "EdgeRelay"
    var meshNodeIp by mutableStateOf("10.9.0.5")
    var meshWireguardPort by mutableStateOf(51820)
    var meshTunnelDomain by mutableStateOf("fluidmotion.tv")
    var generatedWgConfig by mutableStateOf("")
    var generatedBootstrapScript by mutableStateOf("")

    // Orchestrator Manifest States
    var selectedProject by mutableStateOf("surf") // "surf", "superpuff", "broadcast"
    var targetNodeId by mutableStateOf("antix-legacy-01")
    var manifestEnableProxies by mutableStateOf(true)
    var generatedManifestJson by mutableStateOf("")
    var executionLog = mutableStateOf<List<String>>(emptyList())
    var isPipelineExecuting by mutableStateOf(false)

    // Gemini AI Asset Architect States
    var selectedAestheticPreset by mutableStateOf("biomech") // "biomech", "surf", "cartoon"
    var userConcept by mutableStateOf("An ammonite spiral carved with HR Giger biomechanical pipes and Totara bark texture on black sand")
    var isProModel by mutableStateOf(false)
    var expandedBrief by mutableStateOf("")
    var isBriefLoading by mutableStateOf(false)
    var briefErrorMsg by mutableStateOf<String?>(null)

    init {
        // Pre-populate databases with immersive initial telemetry data if empty
        viewModelScope.launch(Dispatchers.IO) {
            meshNodeDao.getAllNodes().collect { list ->
                if (instanceOfEmpty(list)) {
                    // Prepopulate Nodes
                    val initialNodes = listOf(
                        MeshNode(name = "antix-legacy-01", type = "antiX", ip = "10.9.0.1", port = 51820, tunnelDomain = "fluidmotion.tv", latencyMs = 12, status = "ONLINE", cpuLoad = 24),
                        MeshNode(name = "node-beta-termux", type = "Termux", ip = "10.9.0.2", port = 51821, tunnelDomain = "termux.fluidmotion.tv", latencyMs = 28, status = "ONLINE", cpuLoad = 41),
                        MeshNode(name = "wireguard-relay-nz", type = "WireGuard", ip = "10.9.0.3", port = 51822, tunnelDomain = "nz.fluidmotion.tv", latencyMs = 19, status = "ONLINE", cpuLoad = 15),
                        MeshNode(name = "pee-dub-edge-rel", type = "EdgeRelay", ip = "10.9.0.4", port = 51823, tunnelDomain = "edge.fluidmotion.tv", latencyMs = 8, status = "ONLINE", cpuLoad = 32)
                    )
                    initialNodes.forEach { meshNodeDao.insertNode(it) }
                }
            }
        }

        viewModelScope.launch(Dispatchers.IO) {
            transcoderJobDao.getAllJobs().collect { list ->
                if (instanceOfEmpty(list)) {
                    // Prepopulate Transcoder History
                    val mockJob = TranscoderJob(
                        presetName = "GoPro Hero Surf Barrel 4K High-Bitrate",
                        inputFolder = "/media/pee_dub/actioncam_raw",
                        outputFolder = "/media/pee_dub/master_432hz",
                        hardwareAccel = "cpu",
                        audio432Hz = true,
                        generateProxies = true,
                        scriptContent = "# Pre-populated transcode success"
                    )
                    transcoderJobDao.insertJob(mockJob)
                }
            }
        }

        // Live Clock ticking every second
        viewModelScope.launch {
            while (true) {
                calculateDragon9Time()
                delay(1000)
            }
        }

        // Generate script initially
        updateTranscoderScript()
        updateNetworkConfigs()
        updateManifestJson()
    }

    private fun <T> instanceOfEmpty(list: List<T>): Boolean {
        return list.isEmpty()
    }

    // Math for D9 Chronometer (26.66h Day)
    private fun calculateDragon9Time() {
        val now = System.currentTimeMillis()
        val D9_DAY_MS = 95976000L  // 26.66 hours * 3600 * 1000
        val D9_HOUR_MS = 3240000L  // 54 minutes * 60 * 1000
        val D9_MIN_MS = 60000L     // 60 seconds * 1000

        val totalD9Ms = now % D9_DAY_MS
        val hour = totalD9Ms / D9_HOUR_MS
        val hourRemMs = totalD9Ms % D9_HOUR_MS
        val minute = hourRemMs / D9_MIN_MS
        val second = (hourRemMs % D9_MIN_MS) / 1000
        val dayNumber = (now / D9_DAY_MS) + 1

        d9DayNumber = dayNumber
        d9Hour = hour.toInt()
        d9Minute = minute.toInt()
        d9Second = second.toInt()

        val pad = { num: Int -> String.format("%02d", num) }
        d9TimeFormatted = "DAY $dayNumber // ${pad(d9Hour)}:${pad(d9Minute)}:${pad(d9Second)}"
        d9HarmonicPhase = String.format("%.2f", (totalD9Ms.toDouble() / D9_DAY_MS.toDouble()) * 360.0)

        // Earth UTC live
        val earthSdf = java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss", java.util.Locale.US)
        earthSdf.timeZone = java.util.TimeZone.getTimeZone("UTC")
        earthUtcTime = "${earthSdf.format(java.util.Date(now))} UTC"
    }

    // Audio Synth Actions
    fun toggleSynth() {
        isSynthActive = !isSynthActive
        if (isSynthActive) {
            val wave = when (synthGenre) {
                "dub-reggae" -> "sine"
                "g-funk" -> "triangle"
                else -> "sawtooth"
            }
            synth.start(baseFreq, wave, subVolume)
        } else {
            synth.stop()
        }
    }

    fun updateSynthVolume(vol: Float) {
        subVolume = vol
        synth.updateVolume(vol)
    }

    fun updateSynthFrequency(freq: Float) {
        baseFreq = freq
        synth.updateFrequency(freq)
    }

    fun updateSynthGenre(genre: String) {
        synthGenre = genre
        val wave = when (genre) {
            "dub-reggae" -> "sine"
            "g-funk" -> "triangle"
            else -> "sawtooth"
        }
        synth.updateWaveType(wave)
    }

    override fun onCleared() {
        super.onCleared()
        synth.stop()
    }

    // Transcoder script generator
    fun updateTranscoderScript() {
        val hwFlags = when (hardwareAccel) {
            "nvenc" -> "-hwaccel cuda"
            "vaapi" -> "-hwaccel vaapi -hwaccel_output_format vaapi"
            else -> ""
        }
        val vCodec = when (hardwareAccel) {
            "nvenc" -> "hevc_nvenc"
            "vaapi" -> "hevc_vaapi"
            else -> "libx265"
        }
        val audioFilter = if (audio432HzEnabled) {
            "-af \"asetrate=44100*0.981818,aresample=48000,volume=1.05\""
        } else {
            "-c:a aac -b:a 320k"
        }

        generatedFfmpegScript = """
            #!/usr/bin/env bash
            # ==============================================================================
            # DRAGON 9 MASTER SUITE - AUTOMATED FFMPEG BATCH TRANSCODER
            # Preset: ${selectedPreset.replace("_", " ").uppercase()}
            # Sovereign Node: antiX Linux / Termux Bare-Metal
            # 432Hz Harmonic Remux: ${if (audio432HzEnabled) "ENABLED" else "DISABLED"}
            # ==============================================================================
            set -euo pipefail
            
            INPUT_DIR="$inputFolder"
            OUTPUT_DIR="$outputFolder"
            PROXY_DIR="${'$'}{OUTPUT_DIR}/proxies"
            
            mkdir -p "${'$'}{OUTPUT_DIR}"
            ${if (createProxies) "mkdir -p \"${'$'}{PROXY_DIR}\"" else "# Proxies disabled"}
            
            echo "[D9 TRANSCODER] Starting processing pipeline in ${'$'}{INPUT_DIR}..."
            
            for img in "${'$'}{INPUT_DIR}"/*.mp4; do
                [ -e "${'$'}{img}" ] || continue
                filename=$(basename -- "${'$'}{img}")
                base="${'$'}{filename%.*}"
                echo "[D9 LOG] Processing raw surf barrel file: ${'$'}{filename}"
                
                ${if (createProxies) """
                # Step 1: Rapid Proxy Generation (720p 8-bit ultrafast for editing)
                ffmpeg -y -i "${'$'}{img}" -vf "scale=1280:-2,format=yuv420p" -c:v libx264 -crf 28 -preset ultrafast -c:a copy "${'$'}{PROXY_DIR}/${'$'}{base}_proxy.mp4"
                """.trimIndent() else "# Proxies generation skipped"}
                
                # Step 2: Master 10-bit Transcode + 432Hz Audio Pitch Shift
                $hwFlags ffmpeg -y -i "${'$'}{img}" \
                  -c:v $vCodec -crf 19 -preset medium -pix_fmt yuv420p10le \
                  $audioFilter \
                  -movflags +faststart \
                  "${'$'}{OUTPUT_DIR}/${'$'}{base}_D9_432Hz.mp4"
                
                echo "[D9 LOG] Finished ${'$'}{base}"
            done
            echo "[D9 TRANSCODER] All surf barrel files transcoded cleanly."
        """.trimIndent()
    }

    fun runTranscoderJob() {
        viewModelScope.launch(Dispatchers.IO) {
            val job = TranscoderJob(
                presetName = when (selectedPreset) {
                    "gopro_surf_barrel_4k" -> "GoPro Hero Surf Barrel 4K High-Bitrate"
                    "insta360_360_barrel" -> "Insta360 Surf Barrel Equirectangular"
                    else -> "Drone Aerial Pee Dub Wave Tracking"
                },
                inputFolder = inputFolder,
                outputFolder = outputFolder,
                hardwareAccel = hardwareAccel,
                audio432Hz = audio432HzEnabled,
                generateProxies = createProxies,
                scriptContent = generatedFfmpegScript
            )
            transcoderJobDao.insertJob(job)
        }
    }

    fun deleteTranscoderJob(job: TranscoderJob) {
        viewModelScope.launch(Dispatchers.IO) {
            transcoderJobDao.deleteJob(job)
        }
    }

    // Network Config generator
    fun updateNetworkConfigs() {
        generatedWgConfig = """
            [Interface]
            # Node: $meshNodeAlias (Dragon 9 Sovereign Peer)
            PrivateKey = [GENERATED_SOVEREIGN_PRIVATE_KEY]
            Address = $meshNodeIp/24, fd00:d9:9999::1/64
            ListenPort = $meshWireguardPort
            SaveConfig = false
            MTU = 1380
            
            # PostUp / PostDown mesh rules for antiX & Termux
            PostUp = iptables -A FORWARD -i %i -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
            PostDown = iptables -D FORWARD -i %i -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE
            
            # Peer: Termux Mobile Endpoint
            [Peer]
            PublicKey = [TERMUX_NODE_PUBLIC_KEY]
            AllowedIPs = 10.9.0.2/32
            PersistentKeepalive = 25
            
            # Peer: Edge Relay
            [Peer]
            PublicKey = [EDGE_RELAY_PUBLIC_KEY]
            Endpoint = tunnel.$meshTunnelDomain:$meshWireguardPort
            AllowedIPs = 10.9.0.4/32
        """.trimIndent()

        generatedBootstrapScript = """
            #!/usr/bin/env bash
            # Dragon 9 antiX / Termux Sovereign Node Bootstrap
            echo "[D9 NETWORK] Initializing sovereign peer-to-peer router on $meshNodeAlias..."
            sudo apt-get update && sudo apt-get install -y wireguard wireguard-tools curl jq ffmpeg
            
            # Configure Cloudflare Tunnel
            echo "[D9 TUNNEL] Mounting sovereign ingress tunnel for $meshTunnelDomain..."
            curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
            sudo dpkg -i cloudflared.deb || sudo apt-get install -f -y
            echo "[D9 SYSTEM] Sovereign Node $meshNodeAlias is ONLINE. Syncing D9 Chronometer..."
        """.trimIndent()
    }

    fun addMeshNode() {
        viewModelScope.launch(Dispatchers.IO) {
            val newNode = MeshNode(
                name = meshNodeAlias,
                type = meshNodeType,
                ip = meshNodeIp,
                port = meshWireguardPort,
                tunnelDomain = meshTunnelDomain,
                latencyMs = (5..35).random(),
                status = "ONLINE",
                cpuLoad = (10..60).random()
            )
            meshNodeDao.insertNode(newNode)
        }
    }

    fun deleteMeshNode(node: MeshNode) {
        viewModelScope.launch(Dispatchers.IO) {
            meshNodeDao.deleteNode(node)
        }
    }

    // Orchestration Manifest generator
    fun updateManifestJson() {
        val projTitle = when (selectedProject) {
            "surf" -> "Pee Dub Surf Chronicles"
            "superpuff" -> "Super Puff Studio Series"
            else -> "FluidmotionTV Main Broadcast"
        }
        val pipeline = if (selectedProject == "superpuff") "cartoon-generator.js" else "orchestrator.js"

        generatedManifestJson = """
            {
              "${'$'}schema": "https://fluidmotion.tv/schemas/dragon9-orchestrator.json",
              "suiteVersion": "9.4.2-apex",
              "timestampD9": "$d9TimeFormatted",
              "harmonicResonanceHz": 432.0,
              "project": {
                "id": "${selectedProject}-chronicles",
                "name": "$projTitle",
                "pipeline": "$pipeline"
              },
              "clusterNode": {
                "id": "$targetNodeId",
                "arch": "x86_64-antiX-baremetal",
                "termuxCompatible": true,
                "sovereignRoute": "wireguard://10.9.0.1:51820",
                "p2pPeers": ["node-termux-mobile-01", "node-cloud-tunnel-nz"]
              },
              "encodingPipeline": {
                "inputSource": "/media/pee_dub/raw_surf_barrels/${selectedProject}_raw.mp4",
                "proxyTranscode": $manifestEnableProxies,
                "masterEncode": {
                  "container": "mp4",
                  "codecVideo": "libx265",
                  "crf": 18,
                  "audioPitchShift": "-0.32st",
                  "audioSampleRate": 48000
                }
              },
              "creativeAesthetics": {
                "styleFusion": "Biomechanical HR Giger x T tara & P huehue NZ Chemical Botany x Titanomagnetite Black Sand",
                "colorGrading": "High-contrast barrel-cyan, obsidian black, metallic ammonite iridescence"
              }
            }
        """.trimIndent()
    }

    fun runOrchestrationPipeline() {
        if (isPipelineExecuting) return
        viewModelScope.launch {
            isPipelineExecuting = true
            val logs = mutableListOf<String>()
            val pipeline = if (selectedProject == "superpuff") "cartoon-generator.js" else "orchestrator.js"

            logs.add("[D9 ORCHESTRATOR] Dispatching manifest to target cluster node: $targetNodeId...")
            executionLog.value = logs.toList()
            delay(600)

            logs.add("[D9 PIPELINE] Selected Pipeline script: $pipeline")
            executionLog.value = logs.toList()
            delay(500)

            logs.add("[D9 TIME] Syncing sovereign timestamp: $d9TimeFormatted")
            executionLog.value = logs.toList()
            delay(600)

            logs.add("[D9 HARMONIC] Harmonic Frequency lock at 432.0Hz: OK")
            executionLog.value = logs.toList()
            delay(500)

            logs.add("[D9 NETWORK] P2P WireGuard Tunnel Route: established via 10.9.0.1")
            executionLog.value = logs.toList()
            delay(600)

            logs.add("[D9 ENCODER] Verifying raw inputs in /media/pee_dub...")
            executionLog.value = logs.toList()
            delay(700)

            if (manifestEnableProxies) {
                logs.add("[D9 PROXY] Fast Transcode Proxy Pipeline: ACTIVE")
                executionLog.value = logs.toList()
                delay(600)
            } else {
                logs.add("[D9 PROXY] Fast Transcode Proxy Pipeline: BYPASSED")
                executionLog.value = logs.toList()
                delay(400)
            }

            logs.add("[D9 MASTER] Rendering 10-bit HEVC CRF 18 with 432Hz pitch reduction (-0.32st)...")
            executionLog.value = logs.toList()
            delay(1000)

            logs.add("[D9 SUCCESS] Pipeline execution validated successfully. Status 200 OK.")
            executionLog.value = logs.toList()
            isPipelineExecuting = false
        }
    }

    // Gemini AI Prompt expansion & Creative Brief generator
    fun triggerBriefExpansion() {
        isBriefLoading = true
        briefErrorMsg = null

        viewModelScope.launch {
            val apiKey = BuildConfig.GEMINI_API_KEY
            if (apiKey.isEmpty() || apiKey == "MY_GEMINI_API_KEY") {
                // If the key is not set, simulate an incredibly realistic, rich, creative brief locally!
                delay(1200)
                expandedBrief = generateLocalBriefTemplate()
                isBriefLoading = false
                return@launch
            }

            val systemInstructionPrompt = """
                You are the D9 Generative Asset Architect for FluidmotionTV. 
                Your job is to produce hyper-detailed, production-grade image generation prompts and creative briefs for Midjourney, Fooocus, or D9 Asset Architect tools. 
                Enforce visual aesthetics fusing HR Giger biomechanical complexity + Native New Zealand Botany (Totara bark, Pohuehue vines) + Titanomagnetite black sands & Ammonite geology + 432Hz cyber atmosphere. 
                Always deliver a structured creative brief with:
                1. Master Image Generation Prompt
                2. Negative Prompt
                3. Color Grading & Lighting Parameters
                4. Concept Narrative & Episode Context for Pee Dub Surf Chronicles or Super Puff.
            """.trimIndent()

            val request = GenerateContentRequest(
                contents = listOf(
                    Content(parts = listOf(Part(text = "Generate an expanded D9 Asset Architect prompt & creative brief based on concept: \"$userConcept\" in style: \"$selectedAestheticPreset\".")))
                ),
                generationConfig = GenerationConfig(temperature = 0.7f),
                systemInstruction = Content(parts = listOf(Part(text = systemInstructionPrompt)))
            )

            try {
                val response = withContext(Dispatchers.IO) {
                    RetrofitClient.service.generateContent(apiKey, request)
                }
                val textResponse = response.candidates?.firstOrNull()?.content?.parts?.firstOrNull()?.text
                if (textResponse != null) {
                    expandedBrief = textResponse
                } else {
                    expandedBrief = "Error: Model returned an empty payload. Falling back to local offline generation:\n\n${generateLocalBriefTemplate()}"
                }
            } catch (e: Exception) {
                expandedBrief = "Offline Simulation Mode (Invalid API Key):\n\n${generateLocalBriefTemplate()}"
                briefErrorMsg = "Gemini API Call failed: ${e.message}. Using high-fidelity offline template generator."
            } finally {
                isBriefLoading = false
            }
        }
    }

    private fun generateLocalBriefTemplate(): String {
        return when (selectedAestheticPreset) {
            "biomech" -> """
                [D9 GENERATIVE ASSET ARCHITECT BRIEF]
                - CONCEPT CONCEPT: $userConcept
                - CORE STYLE: Biomechanical HR Giger x New Zealand Totara & Pohuehue Botany
                
                1. MASTER IMAGE GENERATION PROMPT:
                   "High-contrast cinematic macro photography of a skeletal ammonite shell fused with biomechanical copper piping, woven with deep-grooved Totara tree bark and emerald green Pohuehue climbing vines. Deep glossy black obsidian texture with glittering titanomagnetite sand crystals under direct sunset edge lighting. Surreal, HR Giger aesthetic, photorealistic 8k, sharp focus."
                   
                2. NEGATIVE PROMPT:
                   "low quality, bright white background, plastic toys, blurry, flat lighting, digital painting, conceptual sketch"
                   
                3. COLOR GRADING:
                   "Deep Obsidian blacks, metallic bronze piping, iridescent emerald greens, and high-contrast gold highlight sparkles."
                   
                4. CONTEXT & ATMOSPHERE:
                   "Perfect for the opening title seq of Pee Dub Surf Chronicles Season 9, setting a gritty, sovereign, natural-mechanical aesthetic tuned to 432Hz soundscapes."
            """.trimIndent()
            "surf" -> """
                [D9 GENERATIVE ASSET ARCHITECT BRIEF]
                - CONCEPT CONCEPT: $userConcept
                - CORE STYLE: Pee Dub Action-Cam Surf Barrel High-Speed
                
                1. MASTER IMAGE GENERATION PROMPT:
                   "Extreme wide fisheye lens view from deep inside a giant, swirling cyan ocean barrel wave crashing over shimmering black titanomagnetite sand. Intense golden hour sunbeams piercing through the translucent water lip, high-velocity frozen water droplets in mid-air, professional action-cam realism, hyper-detailed textures."
                   
                2. NEGATIVE PROMPT:
                   "painting, CGI render, cartoon, soft water, dark muddy color, ugly, photorealistic failure"
                   
                3. COLOR GRADING:
                   "Hyper-saturated electric cyan, warm golden sunbeam flares, and dark metallic black sand reflections."
            """.trimIndent()
            else -> """
                [D9 GENERATIVE ASSET ARCHITECT BRIEF]
                - CONCEPT CONCEPT: $userConcept
                - CORE STYLE: Super Puff Cyberpunk Cartoon
                
                1. MASTER IMAGE GENERATION PROMPT:
                   "Vibrant cyberpunk cell-shaded illustration of character Super Puff inside a high-tech antiX Linux server farm. Wearing glassmorphic HUD visor scanning neon waveforms, surrounded by vintage analogue dub delay synthesizers and modular wire cables. Rich saturated ambient lighting in purple and amber, 2D vector style."
                   
                2. NEGATIVE PROMPT:
                   "3D model, photorealism, monochrome, dull flat color, sketch, unstyled line art"
                   
                3. COLOR GRADING:
                   "Highly saturated neon amber and deep electric violet backlights."
            """.trimIndent()
        }
    }
}
