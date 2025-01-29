package com.awesomeproject

import android.Manifest
import android.app.Notification
import android.app.Service
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Handler
import android.os.IBinder
import android.os.Looper
import android.util.Log
import androidx.core.app.ActivityCompat
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleObserver
import androidx.lifecycle.OnLifecycleEvent
import androidx.lifecycle.ProcessLifecycleOwner
import java.util.*

class NotificationService : Service(), LifecycleObserver {

    private var lastOpenApp = System.currentTimeMillis() // Track if app is open
    private val notificationManager by lazy { NotificationManagerCompat.from(this) }
    private lateinit var handler: Handler

    override fun onCreate() {
        super.onCreate()

        // Observe app lifecycle
        ProcessLifecycleOwner.get().lifecycle.addObserver(this)
    }

    override fun onBind(intent: Intent?): IBinder? {
        return null
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        // Check if the app is open and if the time is close to the scheduled notification
        val scheduledTime = intent?.getLongExtra("scheduledTime", 0L) ?: return START_NOT_STICKY
        val currentTime = System.currentTimeMillis()
        val delay = scheduledTime - currentTime

        handler = Handler(Looper.getMainLooper())

        Log.d("NotificationService", "Service started. Scheduled time: $scheduledTime ${delay} ${currentTime} ${lastOpenApp}")
        Log.d("NotificationService", "Service started. Scheduled time:   ${scheduledTime-currentTime}")

        handler.postDelayed({

            Log.d("NotificationService", "post delay   ${scheduledTime-currentTime} ${scheduledTime} ${currentTime} ${lastOpenApp} ${System.currentTimeMillis() - lastOpenApp }")


            if (System.currentTimeMillis() - lastOpenApp  > 10000 &&  System.currentTimeMillis() >= scheduledTime) {
                showNotification()
            } else {
                Log.d("NotificationService", "Skipping notification. Current time: $currentTime")
            }
        }, scheduledTime - System.currentTimeMillis())

//        if (!isAppOpen)
//        {
//            // Don't show the notification if app is open 15 minutes before the scheduled time
//            if (delay <= 30 * 1000) {
//                return START_NOT_STICKY
//            }
//        }

        // Show notification if conditions are met
        if (shouldShowNotification(scheduledTime)) {
//            showNotification()
        } else {
            Log.d("NotificationService", "Skipping notification because app is open or too early.")
        }
        return START_STICKY
    }

    private fun showNotification() {
        val notification: Notification = NotificationCompat.Builder(this, "Sensor23dd1777")
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




    // Detect when app goes to background
    @OnLifecycleEvent(Lifecycle.Event.ON_STOP)
    fun onAppBackgrounded() {
        lastOpenApp = System.currentTimeMillis()
        Log.d("NotificationService", "App moved to background")
    }

    // Detect when app comes to foreground
    @OnLifecycleEvent(Lifecycle.Event.ON_START)
    fun onAppForegrounded() {
        lastOpenApp = System.currentTimeMillis()
        Log.d("NotificationService", "App moved to foreground")
    }
    fun shouldShowNotification(scheduledTime: Long): Boolean {
        val currentTime = System.currentTimeMillis()
        val fifteenMinutesBefore = scheduledTime - (  30 * 1000)
        Log.d("NotificationService", "App moved to foreground ${currentTime} ${fifteenMinutesBefore} ${scheduledTime} ")
        return   currentTime >= fifteenMinutesBefore
    }
}