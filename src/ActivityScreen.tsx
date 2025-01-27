import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, DeviceEventEmitter } from 'react-native';
import { Button, Text, Card, ActivityIndicator, Appbar } from 'react-native-paper';
import { hasLightSensor, startLightSensor, stopLightSensor } from 'react-native-ambient-light-sensor';

import { accelerometer, gyroscope, setUpdateIntervalForType, SensorTypes, barometer } from 'react-native-sensors';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

// import { barometer } from 'react-native-sensors';
const ActivityScreen = () => {


    const [activity, setActivity] = useState('Stationary');
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

    return (
        <>
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Current Activity</Text>
                <Text style={styles.cardValue}>{activity}</Text>
            </View>
        </>
    )
}
const styles = StyleSheet.create({

    topSection: {
        flexDirection: "row",
        justifyContent: "space-around",
        backgroundColor: "#FFFFFF",
        padding: 16,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 4,
        marginBottom: 24,
    },
    infoBox: {
        alignItems: "center",
    },
    infoTitle: {
        fontSize: 14,
        color: "#888888",
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333333",
    },
    timerSection: {
        alignItems: "center",
        marginBottom: 24,
    },
    timerText: {
        fontSize: 48,
        fontWeight: "bold",
        color: "#333333",
        marginBottom: 8,
    },
    startTimeText: {
        fontSize: 16,
        color: "#666666",
    },
    buttonContainer: {
        marginTop: 16,
    },

    container: {
        flex: 1,
        backgroundColor: "#F5F5F5",
        padding: 16,
        justifyContent: "center",
    },
    card: {
        backgroundColor: "#FFFFFF",
        padding: 20,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
        marginBottom: 20,
        alignItems: "center",
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#888888",
        marginBottom: 8,
    },
    cardValue: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333333",
    },
});
export default ActivityScreen