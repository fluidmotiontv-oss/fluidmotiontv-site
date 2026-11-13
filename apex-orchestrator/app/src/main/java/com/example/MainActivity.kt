package com.example

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
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
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.Code
import androidx.compose.material.icons.filled.Dns
import androidx.compose.material.icons.filled.GraphicEq
import androidx.compose.material.icons.filled.MusicNote
import androidx.compose.material.icons.filled.Radio
import androidx.compose.material.icons.filled.Schedule
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.ActiveTab
import com.example.ui.MainViewModel
import com.example.ui.screens.AssetArchitectScreen
import com.example.ui.screens.AudioLabScreen
import com.example.ui.screens.ChronometerScreen
import com.example.ui.screens.FFmpegTranscoderScreen
import com.example.ui.screens.ManifestStudioScreen
import com.example.ui.screens.MeshNetworkScreen
import com.example.ui.theme.ChakraPetchFontFamily
import com.example.ui.theme.CyberAmber
import com.example.ui.theme.CyberBorder
import com.example.ui.theme.CyberCyan
import com.example.ui.theme.CyberEmerald
import com.example.ui.theme.CyberObsidianBg
import com.example.ui.theme.CyberPanelCard
import com.example.ui.theme.JetBrainsMonoFontFamily
import com.example.ui.theme.MyApplicationTheme

class MainActivity : ComponentActivity() {
    private val viewModel: MainViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            MyApplicationTheme {
                Scaffold(
                    topBar = { TopHeader(viewModel) },
                    bottomBar = { BottomBar(viewModel) },
                    containerColor = CyberObsidianBg
                ) { innerPadding ->
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(innerPadding)
                    ) {
                        when (viewModel.activeTab) {
                            ActiveTab.ORCHESTRATOR -> ManifestStudioScreen(viewModel)
                            ActiveTab.FFMPEG -> FFmpegTranscoderScreen(viewModel)
                            ActiveTab.NETWORK -> MeshNetworkScreen(viewModel)
                            ActiveTab.GIGER_BOTANY -> AssetArchitectScreen(viewModel)
                            ActiveTab.AUDIO_LAB -> AudioLabScreen(viewModel)
                            ActiveTab.CHRONOMETER -> ChronometerScreen(viewModel)
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun TopHeader(viewModel: MainViewModel) {
    Card(
        colors = CardDefaults.cardColors(containerColor = CyberPanelCard),
        shape = RoundedCornerShape(0.dp),
        modifier = Modifier
            .fillMaxWidth()
            .statusBarsPadding()
            .border(width = 1.dp, color = CyberBorder, shape = RoundedCornerShape(0.dp))
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 10.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Branding Group
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(28.dp)
                            .background(Color(0xFF030508), RoundedCornerShape(4.dp))
                            .border(1.dp, CyberCyan, RoundedCornerShape(4.dp)),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = "D9",
                            fontFamily = JetBrainsMonoFontFamily,
                            fontWeight = FontWeight.Bold,
                            fontSize = 11.sp,
                            color = CyberCyan
                        )
                    }
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "FLUIDMOTION TV",
                        fontFamily = ChakraPetchFontFamily,
                        fontWeight = FontWeight.Bold,
                        fontSize = 15.sp,
                        color = Color.White
                    )
                }

                // Interactive Audio Trigger Button
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier
                        .background(
                            if (viewModel.isSynthActive) CyberAmber.copy(alpha = 0.2f) else Color.Transparent,
                            RoundedCornerShape(6.dp)
                        )
                        .border(
                            width = 1.dp,
                            color = if (viewModel.isSynthActive) CyberAmber else CyberBorder,
                            shape = RoundedCornerShape(6.dp)
                        )
                        .clickable { viewModel.toggleSynth() }
                        .padding(horizontal = 8.dp, vertical = 6.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.Radio,
                        contentDescription = "432Hz lock",
                        tint = if (viewModel.isSynthActive) CyberAmber else Color.Gray,
                        modifier = Modifier.size(14.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = if (viewModel.isSynthActive) "432HZ LOCK" else "432HZ MUTED",
                        fontFamily = JetBrainsMonoFontFamily,
                        fontSize = 9.sp,
                        fontWeight = FontWeight.Bold,
                        color = if (viewModel.isSynthActive) CyberAmber else Color.Gray
                    )
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Sub-status indicators
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(6.dp)
                            .background(CyberEmerald, RoundedCornerShape(3.dp))
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = "NODES ONLINE: 4/9 SYNC",
                        fontFamily = JetBrainsMonoFontFamily,
                        fontSize = 9.sp,
                        color = CyberEmerald
                    )
                }

                // Live Ticking D9 Clock representation in header
                Text(
                    text = viewModel.d9TimeFormatted,
                    fontFamily = JetBrainsMonoFontFamily,
                    fontSize = 10.sp,
                    color = CyberCyan,
                    fontWeight = FontWeight.Bold
                )
            }
        }
    }
}

@Composable
fun BottomBar(viewModel: MainViewModel) {
    NavigationBar(
        containerColor = CyberPanelCard,
        tonalElevation = 8.dp,
        modifier = Modifier
            .fillMaxWidth()
            .border(1.dp, CyberBorder)
    ) {
        val navItems = listOf(
            Triple(ActiveTab.ORCHESTRATOR, "Manifest", Icons.Default.Code),
            Triple(ActiveTab.FFMPEG, "Transcoder", Icons.Default.Settings),
            Triple(ActiveTab.NETWORK, "Mesh", Icons.Default.Dns),
            Triple(ActiveTab.GIGER_BOTANY, "Prompt", Icons.Default.AutoAwesome),
            Triple(ActiveTab.AUDIO_LAB, "Synth", Icons.Default.MusicNote),
            Triple(ActiveTab.CHRONOMETER, "Clock", Icons.Default.Schedule)
        )

        navItems.forEach { (tab, label, icon) ->
            NavigationBarItem(
                selected = viewModel.activeTab == tab,
                onClick = { viewModel.activeTab = tab },
                icon = {
                    Icon(
                        imageVector = icon,
                        contentDescription = label,
                        modifier = Modifier.size(20.dp)
                    )
                },
                label = {
                    Text(
                        text = label,
                        fontFamily = ChakraPetchFontFamily,
                        fontSize = 9.sp,
                        fontWeight = FontWeight.Bold
                    )
                },
                colors = NavigationBarItemDefaults.colors(
                    selectedIconColor = CyberCyan,
                    unselectedIconColor = Color.Gray,
                    selectedTextColor = CyberCyan,
                    unselectedTextColor = Color.Gray,
                    indicatorColor = CyberCyan.copy(alpha = 0.15f)
                )
            )
        }
    }
}
