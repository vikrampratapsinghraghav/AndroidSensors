import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { accelerometer, barometer } from 'react-native-sensors';
import MapView, { Polyline } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
// import Geolocation from '@react-native-community/geolocation';
import { PermissionsAndroid } from 'react-native';
import ActivityTracker from './ActivityTracker';

const Dashboard = forwardRef((props, ref) =>{



  const [prevLocation, setPrevLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [distance, setDistance] = useState(0); // Total distance traveled
  const [locations, setLocations] = useState([]);


  // Expose internal methods or state to the parent using useImperativeHandle
  useImperativeHandle(ref, () => ({
    getState: () => ({
      distance,
    }),
   
  }));

  // Haversine formula to calculate the distance between two points
  const haversine = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371e3; // Radius of Earth in meters
    const φ1 = toRad(lat1);
    const φ2 = toRad(lat2);
    const Δφ = toRad(lat2 - lat1);
    const Δλ = toRad(lon2 - lon1);

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  };


 

  


  useEffect(() => {


    Geolocation.watchPosition(
      (position) => {
        console.log('position',position)
        // calDis(position)
        const { latitude, longitude } = position.coords;
        if (prevLocation) {
          // Calculate distance between previous and current location
          const d = haversine(
            prevLocation.lat,
            prevLocation.lon,
            latitude,
            longitude
          );
          setDistance((prev) => prev + d); // Update total distance
        }
        setPrevLocation({ lat: latitude, lon: longitude });

      },
      (error) => {
        console.error(error)
      },
      {
        interval: 2000,
        fastestInterval: 2000,

        maximumAge: 0,
        enableHighAccuracy: true,
        distanceFilter: 10
      }
    );

    return () => {

    };
  }, []);


  // console.log('distance', distance)
  return (
    <>
      <View style={styles.card}>
        <Text style={styles.cardTitle}> Total Distance</Text>
        <Text style={styles.cardValue}>{(distance).toFixed(2)} m</Text>
      </View>
    </>
  )
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  section: {
    marginBottom: 16,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    color: '#555',
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  map: {
    height: 200,
    marginTop: 16,
    borderRadius: 8,
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

export default Dashboard;
