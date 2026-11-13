package com.example.ui.screens

import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.Language
import androidx.compose.material.icons.filled.Schedule
import androidx.compose.material.icons.filled.Speed
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.font.FontWeight
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
import kotlin.math.cos
import kotlin.math.sin

@Composable
fun ChronometerScreen(viewModel: MainViewModel) {
    val nodes by viewModel.meshNodes.collectAsState()
    val scrollState = rememberScrollState()

    // Harmonic rotation animation for the holographic HUD radar
    val infiniteTransition = rememberInfiniteTransition(label = "hud_rotation")
    val angleDegrees by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = 360f,
        animationSpec = infiniteRepeatable(
            animation = tween(12000, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "rotation"
    )

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(scrollState)
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // RADAR / HUD CHRONOMETER INSTRUMENT CARD
        Card(
            colors = CardDefaults.cardColors(containerColor = CyberPanelCard),
            border = androidx.compose.foundation.BorderStroke(1.dp, CyberBorder),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(
                modifier = Modifier.padding(16.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    text = "TEMPORAL RADAR // CO-ORDINATE MESH",
                    fontFamily = JetBrainsMonoFontFamily,
                    fontSize = 11.sp,
                    color = CyberCyan,
                    modifier = Modifier.padding(bottom = 16.dp)
                )

                // Holographic Circle HUD
                Box(
                    modifier = Modifier
                        .size(200.dp)
                        .background(Color(0xFF04060A), RoundedCornerShape(100.dp))
                        .border(1.dp, CyberBorder, RoundedCornerShape(100.dp)),
                    contentAlignment = Alignment.Center
                ) {
                    Canvas(modifier = Modifier.fillMaxSize()) {
                        val center = Offset(size.width / 2, size.height / 2)
                        val radius = size.width / 2 - 10f

                        // Inner circles
                        drawCircle(CyberCyan, radius * 0.7f, style = Stroke(1f), alpha = 0.2f)
                        drawCircle(CyberAmber, radius * 0.4f, style = Stroke(1f), alpha = 0.15f)

                        // Grid lines
                        drawLine(CyberCyan, Offset(0f, center.y), Offset(size.width, center.y), strokeWidth = 1f, alpha = 0.15f)
                        drawLine(CyberCyan, Offset(center.x, 0f), Offset(center.x, size.height), strokeWidth = 1f, alpha = 0.15f)

                        // Outer sweep hand representing harmonic lock status
                        val angleRadians = Math.toRadians(angleDegrees.toDouble())
                        val sweepX = center.x + radius * cos(angleRadians).toFloat()
                        val sweepY = center.y + radius * sin(angleRadians).toFloat()

                        drawLine(
                            brush = Brush.linearGradient(listOf(CyberCyan, Color.Transparent)),
                            start = center,
                            end = Offset(sweepX, sweepY),
                            strokeWidth = 2f
                        )
                    }

                    // Floating text parameters in center
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(
                            text = "DAY ${viewModel.d9DayNumber}",
                            fontFamily = ChakraPetchFontFamily,
                            fontWeight = FontWeight.Bold,
                            fontSize = 16.sp,
                            color = CyberAmber
                        )
                        Text(
                            text = String.format("%02d:%02d:%02d", viewModel.d9Hour, viewModel.d9Minute, viewModel.d9Second),
                            fontFamily = JetBrainsMonoFontFamily,
                            fontSize = 20.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color.White
                        )
                        Text(
                            text = "${viewModel.d9HarmonicPhase}° PHASE",
                            fontFamily = JetBrainsMonoFontFamily,
                            fontSize = 10.sp,
                            color = CyberCyan
                        )
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Stats Row
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceAround
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text("D9 FREQ", fontFamily = JetBrainsMonoFontFamily, fontSize = 10.sp, color = Color.Gray)
                        Text("432.00 Hz", fontFamily = JetBrainsMonoFontFamily, fontSize = 13.sp, color = CyberAmber, fontWeight = FontWeight.Bold)
                    }
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text("SYNCHRONY", fontFamily = JetBrainsMonoFontFamily, fontSize = 10.sp, color = Color.Gray)
                        Text("${nodes.size} NODES", fontFamily = JetBrainsMonoFontFamily, fontSize = 13.sp, color = CyberEmerald, fontWeight = FontWeight.Bold)
                    }
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text("CYCLE", fontFamily = JetBrainsMonoFontFamily, fontSize = 10.sp, color = Color.Gray)
                        Text("26.66H / DAY", fontFamily = JetBrainsMonoFontFamily, fontSize = 13.sp, color = CyberCyan, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }

        // TIME STANDARDS CARD
        Card(
            colors = CardDefaults.cardColors(containerColor = CyberPanelCard),
            border = androidx.compose.foundation.BorderStroke(1.dp, CyberBorder),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text(
                    text = "TEMPORAL SYSTEM MATRIX",
                    fontFamily = ChakraPetchFontFamily,
                    fontSize = 15.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White,
                    modifier = Modifier.padding(bottom = 12.dp)
                )

                // Item 1: D9 Time
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        imageVector = Icons.Default.Schedule,
                        contentDescription = "D9 Clock",
                        tint = CyberCyan,
                        modifier = Modifier.padding(end = 12.dp)
                    )
                    Column(modifier = Modifier.weight(1f)) {
                        Text("Sovereign D9 Local Time", fontFamily = ChakraPetchFontFamily, fontWeight = FontWeight.SemiBold, fontSize = 14.sp)
                        Text("Proprietary 26.66h endocrine heartbeat algorithm", fontFamily = JetBrainsMonoFontFamily, fontSize = 11.sp, color = Color.Gray)
                    }
                    Text(
                        text = viewModel.d9TimeFormatted.replace("DAY ", "D"),
                        fontFamily = JetBrainsMonoFontFamily,
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold,
                        color = CyberCyan
                    )
                }

                // Item 2: Earth UTC
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        imageVector = Icons.Default.Language,
                        contentDescription = "Earth Clock",
                        tint = CyberAmber,
                        modifier = Modifier.padding(end = 12.dp)
                    )
                    Column(modifier = Modifier.weight(1f)) {
                        Text("Earth UTC Baseline", fontFamily = ChakraPetchFontFamily, fontWeight = FontWeight.SemiBold, fontSize = 14.sp)
                        Text("Standard Greenwich Mean Time (24.00h)", fontFamily = JetBrainsMonoFontFamily, fontSize = 11.sp, color = Color.Gray)
                    }
                    Text(
                        text = viewModel.earthUtcTime,
                        fontFamily = JetBrainsMonoFontFamily,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = CyberAmber
                    )
                }

                // Item 3: Grid Phase Alignment
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        imageVector = Icons.Default.Speed,
                        contentDescription = "Sync",
                        tint = CyberEmerald,
                        modifier = Modifier.padding(end = 12.dp)
                    )
                    Column(modifier = Modifier.weight(1f)) {
                        Text("Solfeggio Phase Offset", fontFamily = ChakraPetchFontFamily, fontWeight = FontWeight.SemiBold, fontSize = 14.sp)
                        Text("AntiX router pipeline delay correction", fontFamily = JetBrainsMonoFontFamily, fontSize = 11.sp, color = Color.Gray)
                    }
                    Text(
                        text = "-0.32 st",
                        fontFamily = JetBrainsMonoFontFamily,
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold,
                        color = CyberEmerald
                    )
                }
            }
        }

        // DOCUMENTATION BOX
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .border(1.dp, CyberBorder, RoundedCornerShape(8.dp))
                .background(Color(0xFF030508), RoundedCornerShape(8.dp))
                .padding(12.dp)
        ) {
            Row(verticalAlignment = Alignment.Top) {
                Icon(
                    imageVector = Icons.Default.Info,
                    contentDescription = "Info",
                    tint = CyberCyan,
                    modifier = Modifier.padding(end = 10.dp, top = 2.dp).size(18.dp)
                )
                Text(
                    text = "THEORY OF OPERATION:\nSovereign nodes in the FluidmotionTV mesh rely on Dragon 9 endocrine synchronization. Running on antiX Linux core-clocks, the master D9 timeline shifts baseline audio frequencies by -0.32 semitones to ground synthetic vocals into natural 432Hz harmonic space.",
                    fontFamily = JetBrainsMonoFontFamily,
                    fontSize = 11.sp,
                    lineHeight = 16.sp,
                    color = Color.LightGray
                )
            }
        }
    }
}
