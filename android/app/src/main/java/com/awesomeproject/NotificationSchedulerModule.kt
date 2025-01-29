package com.awesomeproject


import android.content.Intent
import android.util.Log
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Callback

class NotificationSchedulerModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "NotificationScheduler"
    }

    // Method to start the notification service from React Native
    @ReactMethod
    fun startNotificationService(timeInMillis: Double) {

        val time = timeInMillis.toLong() // Convert to Long

        Log.d("NotificationScheduler", "Starting service with time: $timeInMillis $time")



        val intent = Intent(reactApplicationContext, NotificationService::class.java)
        intent.putExtra("scheduledTime", time)
        reactApplicationContext.startService(intent)
    }
}