import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { accelerometer, barometer } from 'react-native-sensors';
import MapView, { Polyline } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
// import Geolocation from '@react-native-community/geolocation';
import { PermissionsAndroid } from 'react-native';
import ActivityTracker from './ActivityTracker';

const Dashboard = () => {
  const [activityType, setActivityType] = useState('Stationary');
  const [activityDuration, setActivityDuration] = useState(0);
  const [totalDistance, setTotalDistance] = useState(0);
  const [lightLevel, setLightLevel] = useState(null);
  const [pressure, setPressure] = useState(null);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const watchID = Geolocation.watchPosition(
      (position) => {
        console.log('watchPosition', JSON.stringify(position));
        // setPosition(JSON.stringify(position));
      },
      (error) => Alert.alert('WatchPosition Error', JSON.stringify(error)),
      
    );
    // Clean up the watcher when the component unmounts
    // return () => Geolocation.clearWatch(watchId);
  }, []);


  useEffect(() => {

    Geolocation.getCurrentPosition(info => {

      console.log(info)
      setLocations(info.coords)

    });

    // Geolocation.watchPosition(success: ())




    // Track activity type and duration
    // const accelerometerSubscription = new accelerometer({ updateInterval: 500 }).subscribe(({ x, y, z }) => {
    //   const magnitude = Math.sqrt(x * x + y * y + z * z);
    //   if (magnitude > 1.2 && magnitude < 2.5) {
    //     setActivityType('Walking');
    //   } else if (magnitude >= 2.5) {
    //     setActivityType('Running');
    //   } else {
    //     setActivityType('Stationary');
    //   }
    // });

    // const activityTimer = setInterval(() => {
    //   setActivityDuration((prev) => prev + 1);
    // }, 1000);

    // Track atmospheric pressure
    // const barometerSubscription = new barometer({ updateInterval: 1000 }).subscribe(({ pressure }) => {
    //   setPressure(pressure);
    // });

    // Track location and calculate distance
    Geolocation.watchPosition(
      (position) => {
        console.log('position', position)
        const { latitude, longitude } = position.coords;
        // setLocations((prevLocations) => {
        //   if (prevLocations.length > 0) {
        //     const lastLocation = prevLocations[prevLocations.length - 1];
        //     const distance = calculateDistance(
        //       lastLocation.latitude,
        //       lastLocation.longitude,
        //       latitude,
        //       longitude
        //     );
        //     setTotalDistance((prevDistance) => prevDistance + distance);
        //   }
        //   return [...prevLocations, { latitude, longitude }];
        // });
      },
      (error) => {
        console.error(error)
      },
      {
        interval: 1000,
        fastestInterval: 1000,
        // timeout: 1000,
        maximumAge: 0,

        enableHighAccuracy: true,
        distanceFilter: 0
      }
    );

    return () => {
      //   accelerometerSubscription.unsubscribe();
      //   barometerSubscription.unsubscribe();
      //   clearInterval(activityTimer);
    };
  }, []);
  console.log('first', locations)

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371e3; // Earth's radius in meters
    const φ1 = toRad(lat1);
    const φ2 = toRad(lat2);
    const Δφ = toRad(lat2 - lat1);
    const Δλ = toRad(lon2 - lon1);

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };
  //   console.log('first',locations && locations.length> 0 && locations[0] )
  //   console.log('first',locations && locations.length> 0 && locations[0] )
  return (
    <ScrollView style={styles.container}>
      <ActivityTracker />
      {/* <Text style={styles.header}>Activity Dashboard</Text> */}
      {/* <MapView
        style={styles.map}
        initialRegion={{
          latitude:locations&& locations.latitude || 25.2723196,
          longitude:locations&& locations.longitude || 55.3283125,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      /> */}
      {/* <View style={styles.section}>
        <Text style={styles.label}>Current Activity:</Text>
        <Text style={styles.value}>{activityType}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Activity Duration:</Text>
        <Text style={styles.value}>{activityDuration} seconds</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Total Distance Traveled:</Text>
        <Text style={styles.value}>{(totalDistance / 1000).toFixed(2)} km</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Ambient Pressure:</Text>
        <Text style={styles.value}>{pressure ? `${pressure} hPa` : 'Loading...'}</Text>
      </View> */}

      {
        locations && <></>
        //     <MapView
        //     style={styles.map}
        //     initialRegion={{
        //       latitude: locations[0]?.latitude ,
        //       longitude: locations[0]?.longitude ,
        //       latitudeDelta: 0.01,
        //       longitudeDelta: 0.01,
        //     }}
        //   >
        //     {locations.length > 1 && <Polyline coordinates={locations} strokeWidth={4} strokeColor="blue" />}
        //   </MapView>
      }

    </ScrollView>
  );
};

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
});

export default Dashboard;
