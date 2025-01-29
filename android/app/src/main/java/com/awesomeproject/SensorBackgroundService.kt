package com.awesomeproject

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.os.Build
import androidx.core.app.NotificationCompat
import android.app.Service
import android.content.Intent
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import android.os.IBinder
import android.util.Log

class SensorBackgroundService : Service(), SensorEventListener {

    private lateinit var sensorManager: SensorManager
    private var accelerometer: Sensor? = null
    private var gyroscope: Sensor? = null

    override fun onCreate() {
        super.onCreate()
        sensorManager = getSystemService(SENSOR_SERVICE) as SensorManager
        accelerometer = sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER)
        gyroscope = sensorManager.getDefaultSensor(Sensor.TYPE_GYROSCOPE)

        accelerometer?.let {
            sensorManager.registerListener(this, it, SensorManager.SENSOR_DELAY_NORMAL)
        }
        gyroscope?.let {
            sensorManager.registerListener(this, it, SensorManager.SENSOR_DELAY_NORMAL)
        }

        Log.d("SensorService", "Background Sensor Service Started")
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        startForegroundService()
        return START_STICKY
    }

    private fun startForegroundService() {
        val channelId = "sensor_service_channel"
        val channelName = "Sensor Background Service"

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                channelId,
                channelName,
                NotificationManager.IMPORTANCE_LOW
            )
            val manager = getSystemService(NotificationManager::class.java)
            manager.createNotificationChannel(channel)
        }

        val notification: Notification = NotificationCompat.Builder(this, channelId)
            .setContentTitle("Background Sensor Service")
            .setContentText("Tracking your sensor data in the background.")
            .setSmallIcon(R.drawable.rn_edit_text_material) // Replace with an actual icon
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .build()

        startForeground(1, notification) // This ensures the service stays alive
    }
    private fun updateNotification(text: String) {
        val notificationManager = getSystemService(NotificationManager::class.java)
        val notification: Notification = NotificationCompat.Builder(this, "sensor_service_channel")
            .setContentTitle("Background Sensor Service")
            .setContentText(text)
            .setSmallIcon(R.drawable.rn_edit_text_material)
            .build()

        notificationManager.notify(1, notification)
    }

    override fun onSensorChanged(event: SensorEvent?) {
        event?.let {
            var activityType = "Detecting..."
            var sensorReadings = ""

            when (it.sensor.type) {
                Sensor.TYPE_ACCELEROMETER -> {
                    val acceleration = Math.sqrt(
                        (it.values[0] * it.values[0] +
                                it.values[1] * it.values[1] +
                                it.values[2] * it.values[2]).toDouble()
                    ).toFloat()

                    // Determine activity based on acceleration
                    activityType = when {
                        acceleration < 1.5 -> "Stationary"
                        acceleration in 1.5..3.0 -> "Walking"
                        else -> "Running"
                    }

                    // Format accelerometer readings
                    sensorReadings = "Accelerometer: X=${it.values[0]}, Y=${it.values[1]}, Z=${it.values[2]}, Acceleration=$acceleration"
                }

                Sensor.TYPE_GYROSCOPE -> {
                    val rotation = Math.sqrt(
                        (it.values[0] * it.values[0] +
                                it.values[1] * it.values[1] +
                                it.values[2] * it.values[2]).toDouble()
                    ).toFloat()

                    // If there's significant rotation, adjust activity type to Running
                    if (rotation > 1.0 && activityType == "Walking") {
                        activityType = "Running"
                    }

                    // Format gyroscope readings
                    sensorReadings = "Gyroscope: X=${it.values[0]}, Y=${it.values[1]}, Z=${it.values[2]}, Rotation=$rotation"
                }
            }

            // Update the notification with activity and sensor readings
            updateNotification("Activity: $activityType\nReadings: $sensorReadings")
//            updateNotification("Readings: $sensorReadings")
        }
    }

    override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {}

    override fun onDestroy() {
        super.onDestroy()
        sensorManager.unregisterListener(this)
        Log.d("SensorService", "Background Sensor Service Stopped")
    }

    override fun onBind(intent: Intent?): IBinder? {
        return null
    }
}