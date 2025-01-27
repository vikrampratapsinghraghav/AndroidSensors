import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, DeviceEventEmitter } from 'react-native';
import { Button, Text, Card, ActivityIndicator, Appbar, Title, Paragraph } from 'react-native-paper';
import { hasLightSensor, startLightSensor, stopLightSensor } from 'react-native-ambient-light-sensor';

import { accelerometer, gyroscope, setUpdateIntervalForType, SensorTypes, barometer } from 'react-native-sensors';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import TrackDistance from './TrackDistance';
import Dashboard from './Dashboard';
import TimerScreen from './TimerScreen';
import Geolocation from '@react-native-community/geolocation';
// import { barometer } from 'react-native-sensors';
const { width } = Dimensions.get('window');
const SensorReadings = () => {

    const [accelerometerData, setAccelerometerData] = useState({ x: 0, y: 0, z: 0 });
    const [gyroscopeData, setGyroscopeData] = useState({ x: 0, y: 0, z: 0 });
    const [barometerData, setBarometerData] = useState(null);
    const [pressure, setPressure] = useState(null);

    const [coordinates, setCoordinates] = useState(undefined);
    const [lightValue, setLightValue] = useState<number | null>(null);
    const [isLightSensorAvail, setIsLightSensorAvailable] = useState(false);
    const [isBarometerAvail, setIsBarometerAvail] = useState(true);
    const destroy$ = new Subject<void>(); // Used to clean up subscriptions
   

    useEffect(() => {


        setUpdateIntervalForType(SensorTypes.accelerometer, 1000); // 100 ms for accelerometer
        setUpdateIntervalForType(SensorTypes.gyroscope, 1000); // 100 ms for gyroscope
        setUpdateIntervalForType(SensorTypes.barometer, 1000);

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
            else{
                setIsBarometerAvail(false)
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
    Geolocation.getCurrentPosition(position => {

        const { latitude, longitude } = position.coords;

        setCoordinates({ lat: latitude,  lng: longitude })
      
      });
  }, [])




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

    console.log('coordinates',coordinates)
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sensor Readings</Text>
            {/* Accelerometer Card */}
            <Card style={styles.card}>
                <Card.Content>
                    <Title>Accelerometer</Title>
                    <Paragraph>X: {accelerometerData.x.toFixed(2)} | Y: {accelerometerData.y.toFixed(2)} | Z: {accelerometerData.z.toFixed(2)}</Paragraph>
                </Card.Content>
            </Card>

            {/* Gyroscope Card */}
            <Card style={styles.card}>
                <Card.Content>
                    <Title>Gyroscope</Title>
                    <Paragraph>X: {gyroscopeData.x.toFixed(2)} | Y: {gyroscopeData.y.toFixed(2)} | Z: {gyroscopeData.z.toFixed(2)}</Paragraph>
                </Card.Content>
            </Card>

            {/* Barometer Card */}
            <Card style={styles.card}>
                <Card.Content>
                <Title>Pressure</Title>
                    {
                        isBarometerAvail ? <>
                      
                        <Paragraph>{pressure ? `${pressure.toFixed(2)} hPa` : "Loading..."}</Paragraph>
                        </> :  <Paragraph> Barometer not available</Paragraph>
                    }
                    
                </Card.Content>
            </Card>

            {/* Light Sensor Card */}
            <Card style={styles.card}>
                <Card.Content>
                    <Title>Light Level</Title>
                    <Paragraph>{lightValue !== null ? `${lightValue} lux` : "Loading..."}</Paragraph>
                </Card.Content>
            </Card>

             {/* Light Sensor Card */}
             <Card style={styles.card}>
                <Card.Content>
                    <Title>Coordinates</Title>
                    <Paragraph>{coordinates ? `${coordinates.lat} ${coordinates.lng}` : "Loading..."}</Paragraph>
                </Card.Content>
            </Card>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5F5F5",
        padding: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 16,
    },
    card: {
        width: "80%",
        marginBottom: 12,
        borderRadius: 8,
        backgroundColor: "#ffffff",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 2,
    },
});
export default SensorReadings