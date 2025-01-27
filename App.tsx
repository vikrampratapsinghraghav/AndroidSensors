/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';
import {
  Alert,
  Button,
  SafeAreaView,
  Text,
} from 'react-native';
import BackgroundFetch from 'react-native-background-fetch';
// import PushNotification from 'react-native-push-notification';
// import PushNotification from 'react-native-push-notification';
import PushNotification, {Importance} from 'react-native-push-notification';
import { PermissionsAndroid, Platform } from "react-native";
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ActivityTracker from './src/ActivityTracker';
import MedicineReminder from './src/MedicineReminder';
import { CHANNEL_ID, CHANNEL_NAME } from './src/constants';
import { PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import Dashboard from './src/Dashboard';
import MapSection from './src/Map';
import TrackActivity from './src/TrackActivity';
import HomeScreen from './src/Home';
import Readings from './src/Readings';
import ActivityHistory from './src/ActivityHistory';



const Stack = createNativeStackNavigator();




function App(): React.JSX.Element {


  // useEffect(() => {
  //   // Configure notifications
  //   // configureNotifications();

  //   // Configure BackgroundFetch
  //   const configureBackgroundFetch = async () => {
  //     console.log('fkjhsdfkhj')
  //     // Initialize BackgroundFetch
  //     BackgroundFetch.configure(
  //       {
  //         minimumFetchInterval: 1, // Fetch every 15 minutes
  //         stopOnTerminate: false, // Continue running even if the app is terminated
  //         startOnBoot: true, // Start background fetch after device boot
  //         enableHeadless: true, // Allow background tasks without UI
  //       },
  //       async (taskId) => {
  //         console.log('[BackgroundFetch] Task executed:', taskId);

  //         // Perform your repeated task here
  //         // showNotification('Task Executed', 'Your background task ran successfully!');

  //         // Mark the task as complete
  //         BackgroundFetch.finish(taskId);
  //       },
  //       (error) => {
  //         console.error('[BackgroundFetch] Failed to configure:', error);
  //       }
  //     );

  //     // Check the status of BackgroundFetch
  //     const status = await BackgroundFetch.status();
  //     console.log('[BackgroundFetch] Status:', status);
  //   };

  //   configureBackgroundFetch();

  //   return () => {
  //     // Optionally stop BackgroundFetch when the component is unmounted
  //     BackgroundFetch.stop();
  //   };
  // }, []);

  // useEffect(() => {
  //   // Create Notification Channel (required for Android 8.0+)
  //   PushNotification.createChannel(
  //     {
  //       channelId: 'default-channel', // Unique channel ID
  //       channelName: 'Default Channel', // Human-readable name
  //       channelDescription: 'A channel for default notifications', // Optional
  //       importance: 4, // High importance
  //       vibrate: true, // Enable vibration
  //     },
  //     (created) => console.log(`Notification Channel Created: ${created}`) // Log if the channel was created
  //   );

  //   // Configure PushNotification
  //   PushNotification.configure({
  //     onNotification: function (notification) {
  //       console.log('Notification Received:', notification);
  //     },
  //     popInitialNotification: true,
  //     requestPermissions: true, // Request permissions on iOS
  //   });
  // }, []);

  async function requestNotificationPermission() {
    if (Platform.OS === "android" && Platform.Version >= 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
  
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Notification permission granted");
      } else {
        console.log("Notification permission denied");
      }
    }
  }

  const requestPermissions = async () => {
    try {
      if (Platform.OS === "android") {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
          PermissionsAndroid.PERMISSIONS.BODY_SENSORS,
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        ]);
        if (
          granted["android.permission.ACCESS_FINE_LOCATION"] !==
            PermissionsAndroid.RESULTS.GRANTED ||
          granted["android.permission.BODY_SENSORS"] !==
            PermissionsAndroid.RESULTS.GRANTED
        ) {
          Alert.alert("Permission Denied", "Permissions are required to run the app.");
        } else {
          // initializeTracking();
        }
      } else {
        const locationPermission = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        const motionPermission = await request(PERMISSIONS.IOS.MOTION);

        if (
          locationPermission !== RESULTS.GRANTED ||
          motionPermission !== RESULTS.GRANTED
        ) {
          Alert.alert("Permission Denied", "Permissions are required to run the app.");
        } else {
          // initializeTracking();
        }
      }
    } catch (err) {
      console.warn(err);
    }
  };
  // const requestLocationPermission = async () => {
  //   try {
  //     const granted = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  //       {
  //         title: 'Location Permission',
  //         message: 'This app needs access to your location',
  //         buttonNegative: 'Cancel',
  //         buttonPositive: 'OK',
  //       }
  //     );
  //     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //       console.log('Location permission granted');
  //     } else {
  //       console.log('Location permission denied');
  //     }
  //   } catch (err) {
  //     console.warn(err);
  //   }
  // };

  useEffect(() => {
    // PushNotification.createChannel(
    //   {
    //     channelId: CHANNEL_ID, // (required)
    //     channelName: CHANNEL_NAME, // (required)
    //     channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
    //     playSound: false, // (optional) default: true
    //     soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
    //     importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
    //     vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
    //   },
    //   (created) =>{ console.log(`createChannel returned '${created}'`)
    //   PushNotification.localNotificationSchedule({
    //     //... You can use all the options from localNotifications
    //     channelId: CHANNEL_ID,
    //     message: "My Notification Message", // (required)
    //     date: new Date(Date.now() + 6 * 1000), // in 60 secs
    //     allowWhileIdle: true, // T
    //     /* Android Only Properties */
    //     // repeatTime: 1, // (optional) Increment of configured repeatType. Check 'Repeating Notifications' section for more info.
    //   });
    
    // } // (optional) callback returns whether the channel was created, false means it already existed.
    // );
   
    // requestNotificationPermission();
    requestPermissions()
  }, [])
  

  

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="MainScreen"
        screenOptions={{
          headerStyle: { backgroundColor: "#6200EE" },
          headerTintColor: "#FFF",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      >
        <Stack.Screen name="MainScreen" component={HomeScreen} options={{ title: "Home" }} />
        <Stack.Screen name="TrackActivity" component={TrackActivity} options={{ title: "Track Activity" }} />
        <Stack.Screen name="ActivityHistory" component={ActivityHistory} options={{ title: "Activity History" }} />
        <Stack.Screen name="MapScreen" component={MapSection} options={{ title: "Map Screen" }} />

        <Stack.Screen name="SensorsReadings" component={Readings} options={{ title: "Sensors Reading" }} />

        <Stack.Screen name="MedicineReminder" component={MedicineReminder} options={{ title: "Medicine Reminder" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  return (
    <NavigationContainer>
        <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <Dashboard />
      {/* <MapSection /> */}
      {/* <MedicineReminder /> */}
      {/* <ActivityTracker /> */}
     
    </SafeAreaView>
    </NavigationContainer>
  
  );
}



export default App;
