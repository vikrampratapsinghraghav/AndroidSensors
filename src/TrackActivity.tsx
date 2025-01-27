import React, { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';
import BackgroundService from 'react-native-background-actions';

import TimerScreen from './TimerScreen';
import { accelerometer, gyroscope, SensorTypes, setUpdateIntervalForType } from 'react-native-sensors';
import { map } from 'rxjs';
// import { barometer } from 'react-native-sensors';
const { width } = Dimensions.get('window');

// Define the task to run in the background
const backgroundTask = async (taskData) => {

    const [activity, setActivity] = useState('Stationary');
    const [accelerometerData, setAccelerometerData] = useState({ x: 0, y: 0, z: 0 });
    const [gyroscopeData, setGyroscopeData] = useState({ x: 0, y: 0, z: 0 });

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
    
    
    
    
          
    
    
            return () => {
                accelerometerSubscription.unsubscribe();
                gyroscopeSubscription.unsubscribe();
               
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

    const { taskId } = taskData;

    let count = 0;
    while (BackgroundService.isRunning()) {
        console.log('Running task', count);
        count++;

      

        // Simulate some background work (for example, counting)
        await new Promise(resolve => setTimeout(resolve, 1000)); // wait 1 second

        // Call to notify task is still running
        BackgroundService.updateNotification({ taskId,    title:  'Tracking Actitvity',
            message: `You are ${activity}`, });
       
    }
};

// Define the configuration for background task
const options = {
    taskName: 'Activity Track',
    taskTitle: 'Tracking Actitvity',
    taskDesc: 'You are stationnary',
    taskIcon: {
        name: 'ic_launcher', // Android icon
        type: 'mipmap', // Type of the icon (mipmap for Android)
    },
    color: 'blue',
    isSilent: false,
    taskTimeout: 6000000,
};

const ActivityTracker = () => {
    // Start the background task
    const startBackgroundTask = async () => {

        await BackgroundService.start(backgroundTask, options);
    };
    const stopBackgroundTask = async () => {

        await BackgroundService.stop();
    };

    useEffect(() => {
        startBackgroundTask()

        return () => {
            stopBackgroundTask()
        }
    }, [])


    return (

        <TimerScreen />
    )

};



export default ActivityTracker;