package com.example.data

import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import kotlinx.coroutines.flow.Flow

@Dao
interface TranscoderJobDao {
    @Query("SELECT * FROM transcoder_jobs ORDER BY id DESC")
    fun getAllJobs(): Flow<List<TranscoderJob>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertJob(job: TranscoderJob)

    @Delete
    suspend fun deleteJob(job: TranscoderJob)

    @Query("DELETE FROM transcoder_jobs")
    suspend fun clearAllJobs()
}
