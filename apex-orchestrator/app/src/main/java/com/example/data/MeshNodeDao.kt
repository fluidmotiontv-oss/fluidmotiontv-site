package com.example.data

import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import kotlinx.coroutines.flow.Flow

@Dao
interface MeshNodeDao {
    @Query("SELECT * FROM mesh_nodes ORDER BY id DESC")
    fun getAllNodes(): Flow<List<MeshNode>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertNode(node: MeshNode)

    @Delete
    suspend fun deleteNode(node: MeshNode)

    @Query("DELETE FROM mesh_nodes")
    suspend fun clearAllNodes()
}
