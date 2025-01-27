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
import MedicineReminder from './src/MedicineReminder';
import { CHANNEL_ID, CHANNEL_NAME } from './src/constants';
import { PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import Dashboard from './src/Dashboard';
import MapSection from './src/Map';
import TrackActivity from './src/TrackActivity';
import HomeScreen from './src/Home';
import Readings from './src/Readings';
import ActivityHistory from './src/ActivityHistory';
import MedicineHistory from './src/MedicineHistory';
import BackgroundService from 'react-native-background-actions';



const Stack = createNativeStackNavigator();




function App(): React.JSX.Element {





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
  
  

  useEffect(() => {

    
    PushNotification.createChannel(
      {
        channelId: CHANNEL_ID, // (required)
        channelName: CHANNEL_NAME, // (required)
        channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
        playSound: false, // (optional) default: true
        soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
        importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
      },
      (created) =>{ console.log(`createChannel returned '${created}'`)


    
    
    } // (optional) callback returns whether the channel was created, false means it already existed.
    );
   
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

        <Stack.Screen name="MedicineReminder" component={MedicineReminder} options={{ title: "Add Medicine" }} />
        <Stack.Screen name="MedicineHistory" component={MedicineHistory} options={{ title: "Medicine History" }} />

      </Stack.Navigator>
    </NavigationContainer>
  );

  
}



export default App;
