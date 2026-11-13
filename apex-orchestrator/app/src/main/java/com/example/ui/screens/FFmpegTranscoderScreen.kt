package com.example.ui.screens

import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
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
import androidx.compose.material.icons.filled.Build
import androidx.compose.material.icons.filled.ChevronRight
import androidx.compose.material.icons.filled.ContentCopy
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Folder
import androidx.compose.material.icons.filled.History
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material.icons.filled.VideoFile
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Checkbox
import androidx.compose.material3.CheckboxDefaults
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
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

@Composable
fun FFmpegTranscoderScreen(viewModel: MainViewModel) {
    val context = LocalContext.current
    val scrollState = rememberScrollState()
    val jobsHistory by viewModel.transcoderJobs.collectAsState()

    var dropdownExpanded by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(scrollState)
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // TRANSCODER PARAMETERS CARD
        Card(
            colors = CardDefaults.cardColors(containerColor = CyberPanelCard),
            border = androidx.compose.foundation.BorderStroke(1.dp, CyberBorder),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                Text(
                    text = "FFMPEG BATCH PIPELINE PARAMETERS",
                    fontFamily = ChakraPetchFontFamily,
                    fontSize = 15.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White
                )

                // Preset selector
                Column {
                    Text("ACTION-CAM PRESET", fontFamily = JetBrainsMonoFontFamily, fontSize = 11.sp, color = Color.Gray)
                    Box {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .border(1.dp, CyberBorder, RoundedCornerShape(4.dp))
                                .background(Color(0xFF030508))
                                .clickable { dropdownExpanded = true }
                                .padding(12.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = when (viewModel.selectedPreset) {
                                    "gopro_surf_barrel_4k" -> "GoPro Hero Surf Barrel 4K High-Bitrate"
                                    "insta360_360_barrel" -> "Insta360 Surf Barrel Equirectangular"
                                    else -> "Drone Aerial Pee Dub Wave Tracking"
                                },
                                fontFamily = JetBrainsMonoFontFamily,
                                fontSize = 12.sp,
                                color = Color.White
                            )
                            Icon(imageVector = Icons.Default.ChevronRight, contentDescription = "Dropdown", tint = CyberCyan)
                        }

                        DropdownMenu(
                            expanded = dropdownExpanded,
                            onDismissRequest = { dropdownExpanded = false },
                            modifier = Modifier.background(CyberPanelCard)
                        ) {
                            DropdownMenuItem(
                                text = { Text("GoPro Hero Surf Barrel 4K", color = Color.White, fontFamily = JetBrainsMonoFontFamily, fontSize = 12.sp) },
                                onClick = {
                                    viewModel.selectedPreset = "gopro_surf_barrel_4k"
                                    dropdownExpanded = false
                                    viewModel.updateTranscoderScript()
                                }
                            )
                            DropdownMenuItem(
                                text = { Text("Insta360 Surf Barrel Equirectangular", color = Color.White, fontFamily = JetBrainsMonoFontFamily, fontSize = 12.sp) },
                                onClick = {
                                    viewModel.selectedPreset = "insta360_360_barrel"
                                    dropdownExpanded = false
                                    viewModel.updateTranscoderScript()
                                }
                            )
                            DropdownMenuItem(
                                text = { Text("Drone Aerial Pee Dub Wave Tracking", color = Color.White, fontFamily = JetBrainsMonoFontFamily, fontSize = 12.sp) },
                                onClick = {
                                    viewModel.selectedPreset = "drone_aerial_pee_dub"
                                    dropdownExpanded = false
                                    viewModel.updateTranscoderScript()
                                }
                            )
                        }
                    }
                }

                // Input Folder
                OutlinedTextField(
                    value = viewModel.inputFolder,
                    onValueChange = {
                        viewModel.inputFolder = it
                        viewModel.updateTranscoderScript()
                    },
                    label = { Text("INPUT FOOTAGE DIRECTORY", fontFamily = JetBrainsMonoFontFamily, fontSize = 11.sp) },
                    leadingIcon = { Icon(imageVector = Icons.Default.Folder, contentDescription = null, tint = CyberCyan) },
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = CyberCyan,
                        unfocusedBorderColor = CyberBorder,
                        focusedLabelColor = CyberCyan,
                        unfocusedLabelColor = Color.Gray,
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White
                    ),
                    textStyle = TextStyle(fontFamily = JetBrainsMonoFontFamily, fontSize = 12.sp),
                    modifier = Modifier.fillMaxWidth()
                )

                // Output Folder
                OutlinedTextField(
                    value = viewModel.outputFolder,
                    onValueChange = {
                        viewModel.outputFolder = it
                        viewModel.updateTranscoderScript()
                    },
                    label = { Text("MASTER OUTPUT DIRECTORY", fontFamily = JetBrainsMonoFontFamily, fontSize = 11.sp) },
                    leadingIcon = { Icon(imageVector = Icons.Default.Folder, contentDescription = null, tint = CyberAmber) },
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = CyberCyan,
                        unfocusedBorderColor = CyberBorder,
                        focusedLabelColor = CyberCyan,
                        unfocusedLabelColor = Color.Gray,
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White
                    ),
                    textStyle = TextStyle(fontFamily = JetBrainsMonoFontFamily, fontSize = 12.sp),
                    modifier = Modifier.fillMaxWidth()
                )

                // Hardware acceleration toggle
                Column {
                    Text("HARDWARE ACCELERATION ENGINE", fontFamily = JetBrainsMonoFontFamily, fontSize = 11.sp, color = Color.Gray)
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        listOf("cpu" to "CPU", "nvenc" to "NVIDIA NVENC", "vaapi" to "VAAPI").forEach { (id, label) ->
                            Button(
                                onClick = {
                                    viewModel.hardwareAccel = id
                                    viewModel.updateTranscoderScript()
                                },
                                colors = ButtonDefaults.buttonColors(
                                    containerColor = if (viewModel.hardwareAccel == id) CyberAmber.copy(alpha = 0.2f) else Color.Transparent
                                ),
                                border = androidx.compose.foundation.BorderStroke(
                                    1.dp,
                                    if (viewModel.hardwareAccel == id) CyberAmber else CyberBorder
                                ),
                                shape = RoundedCornerShape(4.dp),
                                modifier = Modifier.weight(1f)
                            ) {
                                Text(
                                    text = label,
                                    fontFamily = JetBrainsMonoFontFamily,
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = if (viewModel.hardwareAccel == id) CyberAmber else Color.Gray,
                                    textAlign = TextAlign.Center
                                )
                            }
                        }
                    }
                }

                // Checkboxes for proxies & 432Hz tuning
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Checkbox(
                            checked = viewModel.audio432HzEnabled,
                            onCheckedChange = {
                                viewModel.audio432HzEnabled = it
                                viewModel.updateTranscoderScript()
                            },
                            colors = CheckboxDefaults.colors(
                                checkedColor = CyberEmerald,
                                uncheckedColor = CyberBorder
                            )
                        )
                        Text("Apply 432Hz Pitch Lock", fontFamily = JetBrainsMonoFontFamily, fontSize = 11.sp, color = Color.White)
                    }

                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Checkbox(
                            checked = viewModel.createProxies,
                            onCheckedChange = {
                                viewModel.createProxies = it
                                viewModel.updateTranscoderScript()
                            },
                            colors = CheckboxDefaults.colors(
                                checkedColor = CyberCyan,
                                uncheckedColor = CyberBorder
                            )
                        )
                        Text("Generate 720p Proxies", fontFamily = JetBrainsMonoFontFamily, fontSize = 11.sp, color = Color.White)
                    }
                }

                // Main Run & Save Button
                Button(
                    onClick = {
                        viewModel.runTranscoderJob()
                        Toast.makeText(context, "Transcoder profile generated and saved to Room DB!", Toast.LENGTH_LONG).show()
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = CyberCyan),
                    shape = RoundedCornerShape(4.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Icon(imageVector = Icons.Default.Build, contentDescription = null, tint = Color.Black, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(6.dp))
                    Text("GENERATE & COMMIT SCRIPT", fontFamily = JetBrainsMonoFontFamily, fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Color.Black)
                }
            }
        }

        // BASH SCRIPT DISPLAY
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
                    text = "// pee_dub_transcode_432hz.sh (Generated Bash)",
                    fontFamily = JetBrainsMonoFontFamily,
                    fontSize = 11.sp,
                    color = CyberCyan
                )

                IconButton(
                    onClick = {
                        val clipboard = context.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
                        val clip = ClipData.newPlainText("FFmpeg Script", viewModel.generatedFfmpegScript)
                        clipboard.setPrimaryClip(clip)
                        Toast.makeText(context, "Transcode script copied to clipboard!", Toast.LENGTH_SHORT).show()
                    },
                    modifier = Modifier.size(24.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.ContentCopy,
                        contentDescription = "Copy script",
                        tint = CyberCyan,
                        modifier = Modifier.size(14.dp)
                    )
                }
            }
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = viewModel.generatedFfmpegScript,
                fontFamily = JetBrainsMonoFontFamily,
                fontSize = 11.sp,
                color = CyberEmerald,
                lineHeight = 16.sp
            )
        }

        // PERSISTIZED ROOM DATABASE RUNS HISTORY
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
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(imageVector = Icons.Default.History, contentDescription = null, tint = CyberAmber, modifier = Modifier.size(18.dp))
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = "JOB PROFILES DATABASE (ROOM)",
                            fontFamily = ChakraPetchFontFamily,
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color.White
                        )
                    }
                    Text(
                        text = "${jobsHistory.size} SAVED",
                        fontFamily = JetBrainsMonoFontFamily,
                        fontSize = 11.sp,
                        color = CyberAmber
                    )
                }

                Spacer(modifier = Modifier.height(12.dp))

                if (jobsHistory.isEmpty()) {
                    Text(
                        text = "No saved transcode presets inside Room DB.",
                        fontFamily = JetBrainsMonoFontFamily,
                        fontSize = 11.sp,
                        color = Color.Gray,
                        modifier = Modifier.padding(vertical = 12.dp)
                    )
                } else {
                    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        jobsHistory.forEach { job ->
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .background(Color(0xFF030508), RoundedCornerShape(4.dp))
                                    .border(1.dp, CyberBorder, RoundedCornerShape(4.dp))
                                    .padding(8.dp),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.weight(1f)) {
                                    Icon(imageVector = Icons.Default.VideoFile, contentDescription = null, tint = CyberCyan, modifier = Modifier.size(16.dp))
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Column {
                                        Text(job.presetName, fontFamily = ChakraPetchFontFamily, fontSize = 12.sp, fontWeight = FontWeight.SemiBold, color = Color.White)
                                        Text(
                                            "Out: ${job.outputFolder} | 432Hz: ${if (job.audio432Hz) "Y" else "N"}",
                                            fontFamily = JetBrainsMonoFontFamily,
                                            fontSize = 10.sp,
                                            color = Color.Gray
                                        )
                                    }
                                }
                                IconButton(onClick = { viewModel.deleteTranscoderJob(job) }) {
                                    Icon(imageVector = Icons.Default.Delete, contentDescription = "Delete", tint = Color.Red, modifier = Modifier.size(16.dp))
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
