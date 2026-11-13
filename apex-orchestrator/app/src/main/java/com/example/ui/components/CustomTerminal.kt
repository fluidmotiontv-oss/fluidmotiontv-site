package com.example.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.theme.CyberBorder
import com.example.ui.theme.CyberCyan
import com.example.ui.theme.CyberEmerald
import com.example.ui.theme.JetBrainsMonoFontFamily

@Composable
fun CustomTerminal(
    title: String,
    logs: List<String>,
    modifier: Modifier = Modifier,
    emptyMessage: String = "Console idle. Ready for orchestration."
) {
    Column(
        modifier = modifier
            .fillMaxWidth()
            .border(1.dp, CyberBorder, RoundedCornerShape(8.dp))
            .background(Color(0xFF030508), RoundedCornerShape(8.dp))
            .padding(12.dp)
    ) {
        Text(
            text = "// $title",
            fontFamily = JetBrainsMonoFontFamily,
            fontSize = 11.sp,
            color = CyberCyan,
            modifier = Modifier.padding(bottom = 8.dp)
        )

        Box(
            modifier = Modifier
                .fillMaxWidth()
                .heightIn(min = 120.dp, max = 220.dp)
        ) {
            if (logs.isEmpty()) {
                Text(
                    text = emptyMessage,
                    fontFamily = JetBrainsMonoFontFamily,
                    fontSize = 11.sp,
                    color = Color.Gray,
                    modifier = Modifier.padding(top = 4.dp)
                )
            } else {
                LazyColumn(
                    modifier = Modifier.fillMaxWidth()
                ) {
                    items(logs) { log ->
                        Text(
                            text = log,
                            fontFamily = JetBrainsMonoFontFamily,
                            fontSize = 11.sp,
                            color = if (log.contains("SUCCESS") || log.contains("OK")) CyberEmerald else Color.LightGray,
                            lineHeight = 16.sp,
                            modifier = Modifier.padding(vertical = 2.dp)
                        )
                    }
                }
            }
        }
    }
}
