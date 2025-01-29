package com.awesomeproject

import android.Manifest
import android.app.Notification
import android.app.Service
import android.content.Intent
import android.content.pm.PackageManager
import android.os.IBinder
import androidx.core.app.ActivityCompat
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import java.util.*

class NotificationService : Service() {

    private var isAppOpen = false // Track if app is open
    private val notificationManager by lazy { NotificationManagerCompat.from(this) }

    override fun onBind(intent: Intent?): IBinder? {
        return null
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        // Check if the app is open and if the time is close to the scheduled notification
        val scheduledTime = intent?.getLongExtra("scheduled_time", 0L) ?: return START_NOT_STICKY
        val currentTime = System.currentTimeMillis()
        val delay = scheduledTime - currentTime

        if (isAppOpen) {
            // Don't show the notification if app is open 15 minutes before the scheduled time
            if (delay <= 15 * 60 * 1000) {
                return START_NOT_STICKY
            }
        }

        // Show notification if conditions are met
        showNotification()
        return START_STICKY
    }

    private fun showNotification() {
        val notification: Notification = NotificationCompat.Builder(this, "your_channel_id")
            .setContentTitle("Scheduled Notification")
            .setContentText("Time to take your medicine!")
            .setSmallIcon(R.drawable.rn_edit_text_material)
            .build()

        if (ActivityCompat.checkSelfPermission(
                this,
                Manifest.permission.POST_NOTIFICATIONS
            ) != PackageManager.PERMISSION_GRANTED
        ) {
            // TODO: Consider calling
            //    ActivityCompat#requestPermissions
            // here to request the missing permissions, and then overriding
            //   public void onRequestPermissionsResult(int requestCode, String[] permissions,
            //                                          int[] grantResults)
            // to handle the case where the user grants the permission. See the documentation
            // for ActivityCompat#requestPermissions for more details.
            return
        }
        notificationManager.notify(1, notification)
    }

    fun setAppOpenStatus(isOpen: Boolean) {
        isAppOpen = isOpen
    }
}