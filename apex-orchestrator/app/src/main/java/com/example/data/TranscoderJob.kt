package com.example.data

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "transcoder_jobs")
data class TranscoderJob(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val presetName: String,
    val inputFolder: String,
    val outputFolder: String,
    val hardwareAccel: String,
    val audio432Hz: Boolean,
    val generateProxies: Boolean,
    val scriptContent: String,
    val timestamp: Long = System.currentTimeMillis()
)
