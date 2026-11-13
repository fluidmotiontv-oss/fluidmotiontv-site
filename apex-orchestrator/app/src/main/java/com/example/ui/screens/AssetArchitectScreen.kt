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
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.ContentCopy
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
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
fun AssetArchitectScreen(viewModel: MainViewModel) {
    val context = LocalContext.current
    val scrollState = rememberScrollState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(scrollState)
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // STYLE PRESETS BAR
        Card(
            colors = CardDefaults.cardColors(containerColor = CyberPanelCard),
            border = androidx.compose.foundation.BorderStroke(1.dp, CyberBorder),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text(
                    text = "AESTHETIC STYLE PROFILE",
                    fontFamily = ChakraPetchFontFamily,
                    fontSize = 15.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White,
                    modifier = Modifier.padding(bottom = 12.dp)
                )

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    val styles = listOf(
                        "biomech" to "GIGER x BOTANY",
                        "surf" to "PEE DUB SURF",
                        "cartoon" to "SUPER PUFF"
                    )
                    styles.forEach { (id, label) ->
                        Button(
                            onClick = { viewModel.selectedAestheticPreset = id },
                            colors = ButtonDefaults.buttonColors(
                                containerColor = if (viewModel.selectedAestheticPreset == id) CyberCyan.copy(alpha = 0.2f) else Color.Transparent
                            ),
                            border = androidx.compose.foundation.BorderStroke(
                                1.dp,
                                if (viewModel.selectedAestheticPreset == id) CyberCyan else CyberBorder
                            ),
                            shape = RoundedCornerShape(4.dp),
                            modifier = Modifier.weight(1f)
                        ) {
                            Text(
                                text = label,
                                fontFamily = JetBrainsMonoFontFamily,
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold,
                                color = if (viewModel.selectedAestheticPreset == id) CyberCyan else Color.Gray,
                                textAlign = TextAlign.Center
                            )
                        }
                    }
                }
            }
        }

        // CUSTOM INPUT FORM
        Card(
            colors = CardDefaults.cardColors(containerColor = CyberPanelCard),
            border = androidx.compose.foundation.BorderStroke(1.dp, CyberBorder),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                Text(
                    text = "EXPAND CONCEPT BRIEF (GEMINI AI)",
                    fontFamily = ChakraPetchFontFamily,
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White
                )

                OutlinedTextField(
                    value = viewModel.userConcept,
                    onValueChange = { viewModel.userConcept = it },
                    label = { Text("CREATIVE CONCEPT CONCEPT", fontFamily = JetBrainsMonoFontFamily, fontSize = 11.sp) },
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = CyberCyan,
                        unfocusedBorderColor = CyberBorder,
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White
                    ),
                    textStyle = androidx.compose.ui.text.TextStyle(fontFamily = JetBrainsMonoFontFamily, fontSize = 12.sp),
                    modifier = Modifier.fillMaxWidth()
                )

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text("COMPLEX REASONING MODEL", fontFamily = ChakraPetchFontFamily, fontWeight = FontWeight.SemiBold, fontSize = 13.sp)
                        Text(
                            text = if (viewModel.isProModel) "Model: gemini-3.1-pro-preview" else "Model: gemini-3.5-flash",
                            fontFamily = JetBrainsMonoFontFamily,
                            fontSize = 11.sp,
                            color = Color.Gray
                        )
                    }

                    Switch(
                        checked = viewModel.isProModel,
                        onCheckedChange = { viewModel.isProModel = it },
                        colors = SwitchDefaults.colors(
                            checkedThumbColor = CyberCyan,
                            checkedTrackColor = CyberCyan.copy(alpha = 0.4f),
                            uncheckedThumbColor = Color.Gray,
                            uncheckedTrackColor = CyberBorder
                        )
                    )
                }

                // Generate Brief Button
                Button(
                    onClick = { viewModel.triggerBriefExpansion() },
                    colors = ButtonDefaults.buttonColors(containerColor = CyberCyan),
                    shape = RoundedCornerShape(4.dp),
                    enabled = !viewModel.isBriefLoading,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    if (viewModel.isBriefLoading) {
                        CircularProgressIndicator(modifier = Modifier.size(16.dp), color = Color.Black, strokeWidth = 2.dp)
                    } else {
                        Icon(imageVector = Icons.Default.AutoAwesome, contentDescription = null, tint = Color.Black)
                    }
                    Spacer(modifier = Modifier.width(6.dp))
                    Text("EXPAND PROMPT MATRIX", fontFamily = JetBrainsMonoFontFamily, fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Color.Black)
                }
            }
        }

        // OFF-LINE NOTICE IF APPLICABLE
        if (viewModel.briefErrorMsg != null) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .border(1.dp, CyberAmber.copy(alpha = 0.4f), RoundedCornerShape(8.dp))
                    .background(CyberAmber.copy(alpha = 0.05f), RoundedCornerShape(8.dp))
                    .padding(12.dp)
            ) {
                Row(verticalAlignment = Alignment.Top) {
                    Icon(
                        imageVector = Icons.Default.Warning,
                        contentDescription = "Warning",
                        tint = CyberAmber,
                        modifier = Modifier.padding(end = 10.dp, top = 2.dp).size(18.dp)
                    )
                    Text(
                        text = "SOVEREIGN API NOTICE:\n${viewModel.briefErrorMsg}. System automatically generated a high-fidelity local creative brief with precise biochemical formulas and Giger aesthetic schemas.",
                        fontFamily = JetBrainsMonoFontFamily,
                        fontSize = 11.sp,
                        lineHeight = 16.sp,
                        color = Color.LightGray
                    )
                }
            }
        }

        // EXPANDED BRIEF VIEW BOX
        if (viewModel.expandedBrief.isNotEmpty()) {
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
                        text = "// Generated Sovereign Prompt Matrix Brief",
                        fontFamily = JetBrainsMonoFontFamily,
                        fontSize = 11.sp,
                        color = CyberCyan
                    )

                    IconButton(
                        onClick = {
                            val clipboard = context.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
                            val clip = ClipData.newPlainText("Gemini Expanded Brief", viewModel.expandedBrief)
                            clipboard.setPrimaryClip(clip)
                            Toast.makeText(context, "Expanded prompt brief copied!", Toast.LENGTH_SHORT).show()
                        },
                        modifier = Modifier.size(24.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.ContentCopy,
                            contentDescription = "Copy brief",
                            tint = CyberCyan,
                            modifier = Modifier.size(14.dp)
                        )
                    }
                }
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = viewModel.expandedBrief,
                    fontFamily = JetBrainsMonoFontFamily,
                    fontSize = 11.sp,
                    color = CyberEmerald,
                    lineHeight = 16.sp
                )
            }
        }
    }
}
