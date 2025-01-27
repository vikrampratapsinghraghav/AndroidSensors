import React, { useState, useEffect } from 'react';
import { View, Text, Platform, PermissionsAndroid } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation'; // For location updates

const MapSection = () => {
  const [region, setRegion] = useState(null); // Store current region



  useEffect(() => {

    Geolocation.getCurrentPosition(position => {

      const { latitude, longitude } = position.coords;

      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    
    });
     
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

      
      return () => Geolocation.clearWatch(watchId);
    
  }, []);

  if (!region) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        region={region}
        showsUserLocation={true} // Show user's current location on the map
        followsUserLocation={true} // Follow the user’s location on the map
      >
        <Marker coordinate={region} />
      </MapView>
    </View>
  );
};

export default MapSection;