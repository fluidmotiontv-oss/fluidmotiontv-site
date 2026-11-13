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
import androidx.compose.material.icons.filled.ChevronRight
import androidx.compose.material.icons.filled.ContentCopy
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Checkbox
import androidx.compose.material3.CheckboxDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
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
import com.example.ui.components.CustomTerminal
import com.example.ui.theme.ChakraPetchFontFamily
import com.example.ui.theme.CyberAmber
import com.example.ui.theme.CyberBorder
import com.example.ui.theme.CyberCyan
import com.example.ui.theme.CyberEmerald
import com.example.ui.theme.CyberPanelCard
import com.example.ui.theme.JetBrainsMonoFontFamily

@Composable
fun ManifestStudioScreen(viewModel: MainViewModel) {
    val context = LocalContext.current
    val scrollState = rememberScrollState()
    val nodes by viewModel.meshNodes.collectAsState()

    var projectDropdownExpanded by remember { mutableStateOf(false) }
    var nodeDropdownExpanded by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(scrollState)
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // MANIFEST CONFIGURATION CONTROLS CARD
        Card(
            colors = CardDefaults.cardColors(containerColor = CyberPanelCard),
            border = androidx.compose.foundation.BorderStroke(1.dp, CyberBorder),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                Text(
                    text = "PIPELINE ORCHESTRATION PIPELINES",
                    fontFamily = ChakraPetchFontFamily,
                    fontSize = 15.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White
                )

                // 1. Select Project Dropdown
                Column {
                    Text("ACTIVE PROJECT PIPELINE", fontFamily = JetBrainsMonoFontFamily, fontSize = 11.sp, color = Color.Gray)
                    Box {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .border(1.dp, CyberBorder, RoundedCornerShape(4.dp))
                                .background(Color(0xFF030508))
                                .clickable { projectDropdownExpanded = true }
                                .padding(12.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = when (viewModel.selectedProject) {
                                    "surf" -> "Pee Dub Surf Chronicles"
                                    "superpuff" -> "Super Puff Cartoon Generator"
                                    else -> "FluidmotionTV Main Broadcast"
                                },
                                fontFamily = JetBrainsMonoFontFamily,
                                fontSize = 12.sp,
                                color = Color.White
                            )
                            Icon(imageVector = Icons.Default.ChevronRight, contentDescription = null, tint = CyberCyan)
                        }

                        DropdownMenu(
                            expanded = projectDropdownExpanded,
                            onDismissRequest = { projectDropdownExpanded = false },
                            modifier = Modifier.background(CyberPanelCard)
                        ) {
                            DropdownMenuItem(
                                text = { Text("Pee Dub Surf Chronicles", color = Color.White, fontFamily = JetBrainsMonoFontFamily, fontSize = 12.sp) },
                                onClick = {
                                    viewModel.selectedProject = "surf"
                                    projectDropdownExpanded = false
                                    viewModel.updateManifestJson()
                                }
                            )
                            DropdownMenuItem(
                                text = { Text("Super Puff Studio Series", color = Color.White, fontFamily = JetBrainsMonoFontFamily, fontSize = 12.sp) },
                                onClick = {
                                    viewModel.selectedProject = "superpuff"
                                    projectDropdownExpanded = false
                                    viewModel.updateManifestJson()
                                }
                            )
                            DropdownMenuItem(
                                text = { Text("FluidmotionTV Main Broadcast", color = Color.White, fontFamily = JetBrainsMonoFontFamily, fontSize = 12.sp) },
                                onClick = {
                                    viewModel.selectedProject = "broadcast"
                                    projectDropdownExpanded = false
                                    viewModel.updateManifestJson()
                                }
                            )
                        }
                    }
                }

                // 2. Select Cluster Node Dropdown
                Column {
                    Text("TARGET EXECUTION NODE", fontFamily = JetBrainsMonoFontFamily, fontSize = 11.sp, color = Color.Gray)
                    Box {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .border(1.dp, CyberBorder, RoundedCornerShape(4.dp))
                                .background(Color(0xFF030508))
                                .clickable { nodeDropdownExpanded = true }
                                .padding(12.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = viewModel.targetNodeId,
                                fontFamily = JetBrainsMonoFontFamily,
                                fontSize = 12.sp,
                                color = Color.White
                            )
                            Icon(imageVector = Icons.Default.ChevronRight, contentDescription = null, tint = CyberCyan)
                        }

                        DropdownMenu(
                            expanded = nodeDropdownExpanded,
                            onDismissRequest = { nodeDropdownExpanded = false },
                            modifier = Modifier.background(CyberPanelCard)
                        ) {
                            nodes.forEach { node ->
                                DropdownMenuItem(
                                    text = { Text(node.name, color = Color.White, fontFamily = JetBrainsMonoFontFamily, fontSize = 12.sp) },
                                    onClick = {
                                        viewModel.targetNodeId = node.name
                                        nodeDropdownExpanded = false
                                        viewModel.updateManifestJson()
                                    }
                                )
                            }
                        }
                    }
                }

                // Proxy toggler
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Checkbox(
                        checked = viewModel.manifestEnableProxies,
                        onCheckedChange = {
                            viewModel.manifestEnableProxies = it
                            viewModel.updateManifestJson()
                        },
                        colors = CheckboxDefaults.colors(
                            checkedColor = CyberCyan,
                            uncheckedColor = CyberBorder
                        )
                    )
                    Text("Generate Fast Proxies in Manifest", fontFamily = JetBrainsMonoFontFamily, fontSize = 11.sp, color = Color.White)
                }

                // Execute Pipeline Button
                Button(
                    onClick = { viewModel.runOrchestrationPipeline() },
                    colors = ButtonDefaults.buttonColors(containerColor = CyberCyan),
                    shape = RoundedCornerShape(4.dp),
                    enabled = !viewModel.isPipelineExecuting,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    if (viewModel.isPipelineExecuting) {
                        CircularProgressIndicator(modifier = Modifier.size(16.dp), color = Color.Black, strokeWidth = 2.dp)
                    } else {
                        Icon(imageVector = Icons.Default.PlayArrow, contentDescription = null, tint = Color.Black)
                    }
                    Spacer(modifier = Modifier.width(6.dp))
                    Text("LAUNCH PIPELINE EXECUTION", fontFamily = JetBrainsMonoFontFamily, fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Color.Black)
                }
            }
        }

        // SCROLLABLE MANIFEST JSON BLOCK
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
                val pipelineName = if (viewModel.selectedProject == "superpuff") "cartoon-generator.js" else "orchestrator.js"
                Text(
                    text = "// $pipelineName Manifest (JSON Scheme)",
                    fontFamily = JetBrainsMonoFontFamily,
                    fontSize = 11.sp,
                    color = CyberCyan
                )

                IconButton(
                    onClick = {
                        val clipboard = context.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
                        val clip = ClipData.newPlainText("JSON Manifest", viewModel.generatedManifestJson)
                        clipboard.setPrimaryClip(clip)
                        Toast.makeText(context, "Manifest JSON copied!", Toast.LENGTH_SHORT).show()
                    },
                    modifier = Modifier.size(24.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.ContentCopy,
                        contentDescription = "Copy JSON",
                        tint = CyberCyan,
                        modifier = Modifier.size(14.dp)
                    )
                }
            }
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = viewModel.generatedManifestJson,
                fontFamily = JetBrainsMonoFontFamily,
                fontSize = 11.sp,
                color = CyberAmber,
                lineHeight = 16.sp
            )
        }

        // CASCADE CONSOLE LOGGER
        CustomTerminal(
            title = "PIPELINE TERMINAL TELEMETRY",
            logs = viewModel.executionLog.value,
            emptyMessage = "Click 'LAUNCH PIPELINE EXECUTION' to trigger high-fidelity cluster deployment sequence."
        )
    }
}
