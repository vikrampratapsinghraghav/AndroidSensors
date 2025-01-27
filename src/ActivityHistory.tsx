import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, Button } from "react-native";
import { Card, Title, Paragraph } from "react-native-paper";

type Activity = {
  id: string;
  startTime: string;
  endTime: string;
  distance: number; // in meters
  duration: number; // in seconds
};

const ActivityHistory = () => {
  const [activities, setActivities] = useState<Activity[]>([]);


  const loadActivities = async () => {
    const storedActivities = await AsyncStorage.getItem('activities');
    if (storedActivities) setActivities(JSON.parse(storedActivities));
};

  

  useEffect(() => {
   loadActivities();
  }, [])
  

  const renderItem = ({ item }: { item: Activity }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Title>Activity {item.id}</Title>
        <Paragraph>Start Time: {new Date(item.startTime).toLocaleString()}</Paragraph>
        <Paragraph>End Time: {new Date(item.endTime).toLocaleString()}</Paragraph>
        <Paragraph>Distance: {item.distance} meters</Paragraph>
        <Paragraph>Duration: {(item.duration)}</Paragraph>
      </Card.Content>
    </Card>
  );

  // Helper function to format duration in HH:MM:SS format
  const formatDuration = (duration: number) => {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = duration % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <View style={styles.container}>
      
      
      <FlatList
        data={activities}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F5F5F5",
  },
  list: {
    paddingBottom: 16,
  },
  card: {
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

export default ActivityHistory;