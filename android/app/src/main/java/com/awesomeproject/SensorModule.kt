package com.awesomeproject

import android.content.Intent
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class SensorModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "SensorModule"
    }

    @ReactMethod
    fun startSensorService() {
        val serviceIntent = Intent(reactApplicationContext, SensorBackgroundService::class.java)
        reactApplicationContext.startForegroundService(serviceIntent)
    }

    @ReactMethod
    fun stopSensorService() {
        val serviceIntent = Intent(reactApplicationContext, SensorBackgroundService::class.java)
        reactApplicationContext.stopService(serviceIntent)
    }
}