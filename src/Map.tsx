import React, { useState, useEffect } from 'react';
import { View, Text, Platform, PermissionsAndroid } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation'; // For location updates

const MapSection = () => {
  const [region, setRegion] = useState(null); // Store current region
  const [isLocationPermissionGranted, setLocationPermissionGranted] = useState(false);

  // Request location permission for Android
  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'We need access to your location to show it on the map',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      setLocationPermissionGranted(granted === PermissionsAndroid.RESULTS.GRANTED);
    } else {
      setLocationPermissionGranted(true);
    }
  };

  useEffect(() => {
    // Request permissions when the component mounts
    // requestLocationPermission();

    // if (isLocationPermissionGranted) 
        {
      // Start watching the user's location if permissions are granted
      const watchId = Geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setRegion({
            latitude,
            longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
        },
        (error) => {
          console.log(error.message);
        },
        {
          enableHighAccuracy: true,
          distanceFilter: 10, 
          interval: 1000, 
        }
      );

      // Clean up the watcher when the component unmounts
      return () => Geolocation.clearWatch(watchId);
    }
  }, []);

//   if (!region) {
//     return <Text>Loading...</Text>;
//   }

  return (
    <View style={{ flex: 1 }}>
      {/* <MapView
        style={{ flex: 1 }}
        region={region}
        showsUserLocation={true} // Show user's current location on the map
        followsUserLocation={true} // Follow the user’s location on the map
      >
        <Marker coordinate={region} />
      </MapView> */}
    </View>
  );
};

export default MapSection;