import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
// import { accelerometer } from 'react-native-sensors';
// import { map } from 'rxjs/operators';
import { PermissionsAndroid, Platform } from 'react-native';

import { accelerometer, gyroscope, setUpdateIntervalForType, SensorTypes } from 'react-native-sensors';

  import { map, filter } from "rxjs/operators";

const AccelerometerExample = () => {
    const [accelData, setAccelData] = useState({});
    const [gyroData, setGyroData] = useState({});
  
    useEffect(() => {
      // Set the update interval (optional, default is 100 ms)
      setUpdateIntervalForType(SensorTypes.accelerometer, 100); // 100ms
      setUpdateIntervalForType(SensorTypes.gyroscope, 100); // 100ms
  
      // Subscribe to accelerometer updates
      const accelSubscription = accelerometer.subscribe(({ x, y, z }) => {
        setAccelData({ x, y, z });
      });
  
      // Subscribe to gyroscope updates
      const gyroSubscription = gyroscope.subscribe(({ x, y, z }) => {
        setGyroData({ x, y, z });
      });
  
      // Cleanup subscriptions on unmount
      return () => {
        accelSubscription.unsubscribe();
        gyroSubscription.unsubscribe();
      };
    }, []);

//   const initData = () => {
//     const subscription = accelerometer?.pipe(
//         map(({ x, y, z }) => ({
//           x,
//           y,
//           z
//         }))
//       )
//       .subscribe(setAcceleration);
//   }

//   const requestPermissions = async () => {
//     if (Platform.OS === 'android') {
//       try {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//           {
//             title: 'Permission to access location',
//             message: 'We need access to your location to track motion data.',
//             buttonNeutral: 'Ask Me Later',
//             buttonNegative: 'Cancel',
//             buttonPositive: 'OK',
//           },
//         );
//         if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//             initData()
//           console.log('Location permission granted');
//         } else {
//           console.log('Location permission denied');
//         }
//       } catch (err) {
//         console.warn(err);
//       }
//     }
//   };
  
//   useEffect(() => {
//     // requestPermissions();
//   }, []);

//   useEffect(() => {
//     // Subscribe to the accelerometer
//     const subscription = accelerometer?.pipe(
//         map(({ x, y, z }) => ({
//           x,
//           y,
//           z
//         }))
//       )
//       .subscribe(setAcceleration);

//     // Cleanup the subscription when the component is unmounted
//     return () => subscription.unsubscribe();
//   }, []);

console.log('first',accelData)

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Accelerometer</Text>
      <Text>X: {accelData.x?.toFixed(2)}</Text>
      <Text>Y: {accelData.y?.toFixed(2)}</Text>
      <Text>Z: {accelData.z?.toFixed(2)}</Text>

      <Text style={styles.heading}>Gyroscope</Text>
      <Text>X: {gyroData.x?.toFixed(2)}</Text>
      <Text>Y: {gyroData.y?.toFixed(2)}</Text>
      <Text>Z: {gyroData.z?.toFixed(2)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
    },
    heading: {
      fontSize: 20,
      fontWeight: 'bold',
      marginVertical: 8,
    },
  });
  

export default AccelerometerExample;