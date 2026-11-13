package com.example.data

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "mesh_nodes")
data class MeshNode(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val name: String,
    val type: String, // "antiX", "Termux", "WireGuard", "EdgeRelay"
    val ip: String,
    val port: Int,
    val tunnelDomain: String,
    val latencyMs: Int,
    val status: String, // "ONLINE", "SYNCING", "OFFLINE"
    val cpuLoad: Int,
    val timestamp: Long = System.currentTimeMillis()
)
