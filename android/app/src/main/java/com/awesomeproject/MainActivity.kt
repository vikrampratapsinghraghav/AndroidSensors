package com.awesomeproject

import android.content.Intent
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

import android.os.Bundle
//import androidx.compose.ui.node.Owner
import com.facebook.react.ReactActivity
import androidx.lifecycle.ProcessLifecycleOwner
import androidx.lifecycle.LifecycleOwner
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.DefaultLifecycleObserver




class MainActivity : ReactActivity() {

    private lateinit var notificationServiceIntent: Intent


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Initialize the service intent
//        notificationServiceIntent = Intent(this, NotificationService::class.java)
//
////         Observe lifecycle changes to detect foreground/background state
//        ProcessLifecycleOwner.get().lifecycle.addObserver(object : DefaultLifecycleObserver {
//            override fun onStart(owner: LifecycleOwner) {
//                // App is in foreground - Stop background service
//                stopService(notificationServiceIntent)
//            }
//
//            override fun onStop(owner: LifecycleOwner) {
//                // App is in background - Start background service
//                startService(notificationServiceIntent)
//            }
//        })
    }


    override fun onDestroy() {
        super.onDestroy()
        stopService(notificationServiceIntent)
    }
  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "AwesomeProject"
    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)

        // Handle your new intent here
        // For example, checking if there is data or processing the intent
        if (intent != null) {
            // Do something with the new intent
        }
    }

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
