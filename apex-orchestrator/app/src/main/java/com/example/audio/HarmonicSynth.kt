package com.example.audio

import android.media.AudioFormat
import android.media.AudioManager
import android.media.AudioTrack
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.launch
import kotlin.math.sin

class HarmonicSynth {
    private var audioTrack: AudioTrack? = null
    private var isPlaying = false
    private var synthJob: Job? = null
    @Volatile private var frequency = 108.0f // Sub-bass octave (432 / 4)
    @Volatile private var waveType = "sine"
    @Volatile private var volume = 0.5f

    private val scope = CoroutineScope(Dispatchers.Default)

    fun start(freq: Float, type: String, vol: Float) {
        if (isPlaying) {
            stop()
        }
        frequency = freq / 4f // sub-harmonic octave
        waveType = type
        volume = vol
        isPlaying = true

        synthJob = scope.launch {
            val sampleRate = 48000
            val minBufferSize = AudioTrack.getMinBufferSize(
                sampleRate,
                AudioFormat.CHANNEL_OUT_MONO,
                AudioFormat.ENCODING_PCM_16BIT
            )
            val bufferSize = if (minBufferSize > 0) minBufferSize else 4096

            val track = try {
                AudioTrack(
                    AudioManager.STREAM_MUSIC,
                    sampleRate,
                    AudioFormat.CHANNEL_OUT_MONO,
                    AudioFormat.ENCODING_PCM_16BIT,
                    bufferSize,
                    AudioTrack.MODE_STREAM
                )
            } catch (e: Exception) {
                null
            }

            if (track == null) {
                isPlaying = false
                return@launch
            }

            audioTrack = track
            try {
                track.play()
            } catch (e: Exception) {
                isPlaying = false
                return@launch
            }

            val buffer = ShortArray(bufferSize)
            var angle = 0.0

            while (isPlaying) {
                val currentFreq = frequency
                val currentVol = volume
                val currentType = waveType

                for (i in buffer.indices) {
                    val angleIncrement = (2.0 * Math.PI * currentFreq) / sampleRate
                    angle += angleIncrement
                    if (angle > 2.0 * Math.PI) {
                        angle -= 2.0 * Math.PI
                    }
                    val sample = when (currentType) {
                        "sine" -> sin(angle)
                        "triangle" -> {
                            val raw = (angle / (2.0 * Math.PI)) * 4.0 - 1.0
                            if (raw > 1.0) 2.0 - raw else if (raw < -1.0) -2.0 - raw else raw
                        }
                        else -> { // sawtooth / vinyl pad approximation
                            (angle / Math.PI) - 1.0
                        }
                    }
                    buffer[i] = (sample * 32767.0 * currentVol * 0.3).toInt().toShort()
                }
                try {
                    track.write(buffer, 0, buffer.size)
                } catch (e: Exception) {
                    break
                }
            }
        }
    }

    fun updateVolume(vol: Float) {
        volume = vol
    }

    fun updateFrequency(freq: Float) {
        frequency = freq / 4f // sub-harmonic octave
    }

    fun updateWaveType(type: String) {
        waveType = type
    }

    fun stop() {
        isPlaying = false
        synthJob?.cancel()
        synthJob = null
        try {
            audioTrack?.stop()
            audioTrack?.release()
        } catch (e: Exception) {
            // ignore
        }
        audioTrack = null
    }
}
