import React, { useEffect, useState } from "react";
import { View, Text, Button, PermissionsAndroid, Platform } from "react-native";
import Geolocation from '@react-native-community/geolocation';

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

const TrackDistance = () => {
  const [distance, setDistance] = useState(0); // Total distance traveled
  const [prevLocation, setPrevLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [isTracking, setIsTracking] = useState(false);

  const requestLocationPermission = async () => {
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const startTracking = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) return;

    setIsTracking(true);
    Geolocation.watchPosition(
      (position) => {
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
        console.error(error);
      },
      { enableHighAccuracy: true, distanceFilter: 1, interval: 1000 } // 1-meter accuracy, 1-second interval
    );
  };

  const stopTracking = () => {
    Geolocation.stopObserving();
    setIsTracking(false);
  };

  // useEffect(() => {
  //   startTracking()
  // }, [])
  

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>Distance Tracker</Text>
      <Text style={{ fontSize: 18, marginVertical: 16 }}>
        Total Distance: {(distance / 1000).toFixed(2)} km
      </Text>
    
    </View>
  );
};

export default TrackDistance;