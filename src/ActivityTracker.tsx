import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, DeviceEventEmitter } from 'react-native';
import { Button, Text, Card, ActivityIndicator, Appbar } from 'react-native-paper';
import { hasLightSensor, startLightSensor, stopLightSensor } from 'react-native-ambient-light-sensor';

import { accelerometer, gyroscope, setUpdateIntervalForType, SensorTypes, barometer } from 'react-native-sensors';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
// import { barometer } from 'react-native-sensors';
const { width } = Dimensions.get('window');
const ActivityTracker = () => {
  const [activity, setActivity] = useState('Stationary');
  const [loading, setLoading] = useState(true);
  const [accelerometerData, setAccelerometerData] = useState({ x: 0, y: 0, z: 0 });
  const [gyroscopeData, setGyroscopeData] = useState({ x: 0, y: 0, z: 0 });
  const [barometerData, setBarometerData] = useState(null);
  const [pressure, setPressure] = useState(null);

  const [lightValue, setLightValue] = useState<number | null>(null);
  const [isLightSensorAvail, setIsLightSensorAvailable] = useState(false);
  const destroy$ = new Subject<void>(); // Used to clean up subscriptions
  const [result, setResult] = React.useState<number | undefined>();
  // const [hasSensor, setHasSensor] = React.useState<boolean>();

  // const [result, setResult] = React.useState<number | undefined>();
  const [lightSenAvail, setLightSenAvail] = useState<boolean>();

  // const destroy$ = new Subject();

  // Thresholds for detecting activity
  const stationaryThreshold = 1.0; // Allowable variation for stationary detection
  const walkingThreshold = 2.5;   // Moderate threshold for walking detection
  const runningThreshold = 3.5;   // Higher threshold for running detection

  useEffect(() => {


    setUpdateIntervalForType(SensorTypes.accelerometer, 100); // 100 ms for accelerometer
    setUpdateIntervalForType(SensorTypes.gyroscope, 100); // 100 ms for gyroscope
    setUpdateIntervalForType(SensorTypes.barometer, 100);

    // Accelerometer data subscription
    const accelerometerSubscription = accelerometer
      .pipe(map(({ x, y, z }) => ({ x, y, z })))
      .subscribe(setAccelerometerData);

    // Gyroscope data subscription
    const gyroscopeSubscription = gyroscope
      .pipe(map(({ x, y, z }) => ({ x, y, z })))
      .subscribe(setGyroscopeData);




    let barometerSubscription = null;

    try {
      if (barometer?.source?.source?.isSensorAvailable) {
        // Barometer subscription
        barometerSubscription = barometer
          .pipe(map(({ pressure }) => ({ pressure })))
          .subscribe(setBarometerData);
      }

    } catch (error) {
      console.log('error', error)
    }

   


    setLoading(false); // Data is ready



    // Clean up the subscriptions on component unmount
    return () => {
      accelerometerSubscription.unsubscribe();
      gyroscopeSubscription.unsubscribe();
      barometerSubscription?.unsubscribe()
    };
  }, []);

  useEffect(() => {
    const { x, y, z } = accelerometerData;
    const { x: gx, y: gy, z: gz } = gyroscopeData;

    // Calculate the magnitude of accelerometer data
    const accelMagnitude = Math.sqrt(x * x + y * y + z * z);
    // Calculate the magnitude of gyroscope data
    const gyroMagnitude = Math.sqrt(gx * gx + gy * gy + gz * gz);

    if (accelMagnitude < (9.8 + stationaryThreshold) && accelMagnitude > (9.8 - stationaryThreshold) && gyroMagnitude < 0.1) {
      setActivity('Stationary');
    } else if (accelMagnitude >= (9.8 + walkingThreshold) && accelMagnitude < (9.8 + runningThreshold) && gyroMagnitude < 2.5) {
      setActivity('Walking');
    } else if (accelMagnitude >= (9.8 + runningThreshold) && gyroMagnitude >= 2.5) {
      setActivity('Running');
    }
  }, [accelerometerData, gyroscopeData]);


  useEffect(() => {
    const initSensor = async () => {
      const sensorAvailable = await hasLightSensor();
      setIsLightSensorAvailable(sensorAvailable);

      if (sensorAvailable) {
        startLightSensor();

        // Create an RxJS Observable for Light Sensor changes
        const lightSensor$ = new Observable((subscriber) => {
          const listener = DeviceEventEmitter.addListener(
            "LightSensor",
            (data: { lightValue: number }) => {
              subscriber.next(data.lightValue);
            }
          );

          // Cleanup for observable
          return () => {
            listener.remove();
          };
        });

        // Subscribe to light sensor changes
        lightSensor$
          .pipe(takeUntil(destroy$)) // Unsubscribe when destroy$ emits
          .subscribe((value) => {
            setLightValue(value as number); // Update state with light value
          });
      }
    };

    initSensor();

    return () => {
      stopLightSensor();
      destroy$.next(); // Notify all subscribers to clean up
      destroy$.complete(); // Complete the subject
    };
  }, []);

console.log('lightValue',lightValue)
  

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Activity Dashboard</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Current Activity:</Text>
        <Text style={styles.value}>{activity}</Text>
      </View>

      {/* <View style={styles.card}>
        <Text style={styles.label}>Duration (seconds):</Text>
        <Text style={styles.value}>{duration}s</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Total Distance Traveled:</Text>
        <Text style={styles.value}>{(distance / 1000).toFixed(2)} km</Text>
      </View> */}

     
      <View style={styles.card}>
        <Text style={styles.label}>Ambient Light Level:</Text>
        <Text style={styles.value}>{lightValue ? `${lightValue} lux` : 'N/A'}</Text>
      </View>
     

  

      <View style={styles.card}>
        <Text style={styles.label}>Atmospheric Pressure:</Text>
        <Text style={styles.value}>{pressure ? `${pressure?.toFixed(2)} hPa` : 'Barometer not available'}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 8,
  },
});

export default ActivityTracker;