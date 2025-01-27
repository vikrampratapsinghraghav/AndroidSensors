import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button, Card } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

const HomeScreen = () => {
  const navigation = useNavigation();

  // Navigate to the respective screens
  const navigateToStartNewActivity = () => navigation.navigate("TrackActivity");
  const navigateToActivityHistory = () => navigation.navigate("ActivityHistory");
  const navigateToAddMedicine = () => navigation.navigate("MedicineReminder");
  const navigateToMedicineHistory = () => navigation.navigate("MedicineHistory");
    return (
      <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>

      <Card style={styles.card}>
        <Card.Content>
          <Button mode="contained" onPress={navigateToStartNewActivity} style={styles.button}>
            Start New Activity
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Button mode="contained" onPress={navigateToActivityHistory} style={styles.button}>
            Activity History
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Button mode="contained" onPress={navigateToAddMedicine} style={styles.button}>
            Add Medicine
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Button mode="contained" onPress={navigateToMedicineHistory} style={styles.button}>
            Medicine History
          </Button>
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
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
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
  button: {
    width: "100%",
    paddingVertical: 12,
  },
});

export default HomeScreen