import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, DeviceEventEmitter } from 'react-native';
import { Button, Text, Card, ActivityIndicator, Appbar } from 'react-native-paper';
import { hasLightSensor, startLightSensor, stopLightSensor } from 'react-native-ambient-light-sensor';

import { accelerometer, gyroscope, setUpdateIntervalForType, SensorTypes, barometer } from 'react-native-sensors';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import TrackDistance from './TrackDistance';
import Dashboard from './Dashboard';
import TimerScreen from './TimerScreen';
// import { barometer } from 'react-native-sensors';
const { width } = Dimensions.get('window');
const ActivityTracker = () => {
 

return (

    <TimerScreen />
)
  

 
};



export default ActivityTracker;