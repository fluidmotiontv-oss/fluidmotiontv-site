package com.example.ui.screens

import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ContentCopy
import androidx.compose.material.icons.filled.GraphicEq
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.MusicNote
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Stop
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.Slider
import androidx.compose.material3.SliderDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.MainViewModel
import com.example.ui.theme.ChakraPetchFontFamily
import com.example.ui.theme.CyberAmber
import com.example.ui.theme.CyberBorder
import com.example.ui.theme.CyberCyan
import com.example.ui.theme.CyberEmerald
import com.example.ui.theme.CyberPanelCard
import com.example.ui.theme.JetBrainsMonoFontFamily

@Composable
fun AudioLabScreen(viewModel: MainViewModel) {
    val context = LocalContext.current
    val scrollState = rememberScrollState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(scrollState)
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // SYNTH CORE CONTROL CARD
        Card(
            colors = CardDefaults.cardColors(containerColor = CyberPanelCard),
            border = androidx.compose.foundation.BorderStroke(1.dp, CyberBorder),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(
                            text = "HARMONIC SYNTH SYNCHRONIZER",
                            fontFamily = ChakraPetchFontFamily,
                            fontWeight = FontWeight.Bold,
                            fontSize = 15.sp,
                            color = Color.White
                        )
                        Text(
                            text = "Tone Generator: Sub-Harmonic Octave Mode",
                            fontFamily = JetBrainsMonoFontFamily,
                            fontSize = 11.sp,
                            color = Color.Gray
                        )
                    }

                    // Main Start/Stop Button
                    Button(
                        onClick = { viewModel.toggleSynth() },
                        colors = ButtonDefaults.buttonColors(
                            containerColor = if (viewModel.isSynthActive) CyberAmber else CyberCyan
                        ),
                        shape = RoundedCornerShape(6.dp)
                    ) {
                        Icon(
                            imageVector = if (viewModel.isSynthActive) Icons.Default.Stop else Icons.Default.PlayArrow,
                            contentDescription = "Trigger Synth",
                            tint = Color.Black,
                            modifier = Modifier.size(16.dp)
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = if (viewModel.isSynthActive) "STOP" else "ENGAGE",
                            fontFamily = JetBrainsMonoFontFamily,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color.Black
                        )
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                // GENRE PRESET BAR
                Text(
                    text = "AESTHETIC GENRE PROFILE",
                    fontFamily = JetBrainsMonoFontFamily,
                    fontSize = 10.sp,
                    color = CyberCyan,
                    modifier = Modifier.padding(bottom = 8.dp)
                )

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    val genres = listOf("dub-reggae" to "DUB REGGAE", "g-funk" to "G-FUNK", "trip-hop" to "TRIP-HOP")
                    genres.forEach { (id, label) ->
                        Button(
                            onClick = { viewModel.updateSynthGenre(id) },
                            colors = ButtonDefaults.buttonColors(
                                containerColor = if (viewModel.synthGenre == id) CyberCyan.copy(alpha = 0.2f) else Color.Transparent
                            ),
                            border = androidx.compose.foundation.BorderStroke(
                                1.dp,
                                if (viewModel.synthGenre == id) CyberCyan else CyberBorder
                            ),
                            shape = RoundedCornerShape(4.dp),
                            modifier = Modifier.weight(1f)
                        ) {
                            Text(
                                text = label,
                                fontFamily = JetBrainsMonoFontFamily,
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold,
                                color = if (viewModel.synthGenre == id) CyberCyan else Color.Gray,
                                textAlign = TextAlign.Center
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                // SLIDERS
                Text(
                    text = "SYNTH PARAMETERS",
                    fontFamily = JetBrainsMonoFontFamily,
                    fontSize = 10.sp,
                    color = CyberCyan,
                    modifier = Modifier.padding(bottom = 12.dp)
                )

                // 1. Frequency Slider
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text("RESONANCE BASELINE", fontFamily = JetBrainsMonoFontFamily, fontSize = 11.sp, color = Color.LightGray)
                    Text("${String.format("%.2f", viewModel.baseFreq)} Hz", fontFamily = JetBrainsMonoFontFamily, fontSize = 11.sp, color = CyberAmber, fontWeight = FontWeight.Bold)
                }
                Slider(
                    value = viewModel.baseFreq,
                    onValueChange = { viewModel.updateSynthFrequency(it) },
                    valueRange = 420.0f..444.0f,
                    colors = SliderDefaults.colors(
                        thumbColor = CyberAmber,
                        activeTrackColor = CyberAmber
                    )
                )

                // 2. Volume Slider
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text("SUB-HARMONIC AMPLITUDE", fontFamily = JetBrainsMonoFontFamily, fontSize = 11.sp, color = Color.LightGray)
                    Text("${(viewModel.subVolume * 100).toInt()}%", fontFamily = JetBrainsMonoFontFamily, fontSize = 11.sp, color = CyberCyan, fontWeight = FontWeight.Bold)
                }
                Slider(
                    value = viewModel.subVolume,
                    onValueChange = { viewModel.updateSynthVolume(it) },
                    valueRange = 0.0f..1.0f,
                    colors = SliderDefaults.colors(
                        thumbColor = CyberCyan,
                        activeTrackColor = CyberCyan
                    )
                )
            }
        }

        // ELEVENLABS / SUNO PITCH CALCULATION CARD
        Card(
            colors = CardDefaults.cardColors(containerColor = CyberPanelCard),
            border = androidx.compose.foundation.BorderStroke(1.dp, CyberBorder),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text(
                    text = "ELEVENLABS VOICE & SUNO AI ALIGNER",
                    fontFamily = ChakraPetchFontFamily,
                    fontSize = 15.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White,
                    modifier = Modifier.padding(bottom = 8.dp)
                )

                Text(
                    text = "ElevenLabs models render audio at 440Hz baseline. To achieve full Dragon 9 432Hz congruence, we calculate the precise resample metrics needed during the FFMPEG transcode stage:",
                    fontFamily = JetBrainsMonoFontFamily,
                    fontSize = 11.sp,
                    color = Color.LightGray,
                    lineHeight = 16.sp,
                    modifier = Modifier.padding(bottom = 12.dp)
                )

                val ratio = viewModel.baseFreq / 440f
                val semitones = 12 * Math.log(ratio.toDouble()) / Math.log(2.0)
                val targetSample48k = (48000 * ratio).toInt()

                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(Color(0xFF030508), RoundedCornerShape(6.dp))
                        .border(1.dp, CyberBorder, RoundedCornerShape(6.dp))
                        .padding(12.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        Text("Standard Pitch Baseline:", fontFamily = JetBrainsMonoFontFamily, fontSize = 11.sp, color = Color.Gray)
                        Text("440.00 Hz", fontFamily = JetBrainsMonoFontFamily, fontSize = 11.sp, color = Color.White)
                    }
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        Text("Target Solfeggio Tone:", fontFamily = JetBrainsMonoFontFamily, fontSize = 11.sp, color = Color.Gray)
                        Text("${String.format("%.2f", viewModel.baseFreq)} Hz", fontFamily = JetBrainsMonoFontFamily, fontSize = 11.sp, color = CyberAmber)
                    }
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        Text("Calculated Pitch Shift:", fontFamily = JetBrainsMonoFontFamily, fontSize = 11.sp, color = Color.Gray)
                        Text(String.format("%.4f st", semitones), fontFamily = JetBrainsMonoFontFamily, fontSize = 11.sp, color = CyberCyan, fontWeight = FontWeight.Bold)
                    }
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        Text("Resampled 48kHz Clock Rate:", fontFamily = JetBrainsMonoFontFamily, fontSize = 11.sp, color = Color.Gray)
                        Text("$targetSample48k Hz", fontFamily = JetBrainsMonoFontFamily, fontSize = 11.sp, color = CyberEmerald)
                    }
                }
            }
        }

        // COPYABLE SUNO PROMPT BOX
        val promptSuffix = "[Genre: ${viewModel.synthGenre.uppercase()}, Tuning: ${String.format("%.0fHz", viewModel.baseFreq)} Solfeggio, Tempo: ${viewModel.tempoBpm} BPM, Dub Delay, Warm Tape Saturation, Deep Sub-Bass]"
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .border(1.dp, CyberBorder, RoundedCornerShape(8.dp))
                .background(Color(0xFF030508), RoundedCornerShape(8.dp))
                .padding(12.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "// RECOMMENDED SUNO PROMPT SUFFIX",
                    fontFamily = JetBrainsMonoFontFamily,
                    fontSize = 11.sp,
                    color = CyberCyan
                )

                Button(
                    onClick = {
                        val clipboard = context.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
                        val clip = ClipData.newPlainText("Suno Suffix", promptSuffix)
                        clipboard.setPrimaryClip(clip)
                        Toast.makeText(context, "Suno Prompt suffix copied to clipboard!", Toast.LENGTH_SHORT).show()
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = Color.Transparent),
                    border = androidx.compose.foundation.BorderStroke(1.dp, CyberBorder),
                    shape = RoundedCornerShape(4.dp),
                    modifier = Modifier.size(24.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.ContentCopy,
                        contentDescription = "Copy Prompt Suffix",
                        tint = CyberCyan,
                        modifier = Modifier.size(12.dp)
                    )
                }
            }
            Spacer(modifier = Modifier.height(6.dp))
            Text(
                text = promptSuffix,
                fontFamily = JetBrainsMonoFontFamily,
                fontSize = 11.sp,
                color = CyberEmerald,
                lineHeight = 16.sp
            )
        }
    }
}
