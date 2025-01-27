import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import ActivityScreen from "./ActivityScreen";
import Dashboard from "./Dashboard";
import { Button } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const TimerScreen = () => {
    const [startTime, setStartTime] = useState<Date | null>(null); // Start time
    const [endTime, setEndTime] = useState<Date | null>(null); // Start time
    const navigation = useNavigation();
    const [duration, setDuration] = useState<string>("00:00:00"); // Duration in hh:mm:ss format
    const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
   const [activities, setActivities] = useState([]);

    const activityRef = useRef(null);


    const loadActivities = async () => {
        const storedActivities = await AsyncStorage.getItem('activities');
        if (storedActivities) setActivities(JSON.parse(storedActivities));
    };

    const getActivityState = async () => {
        const activityState = activityRef.current?.getState();
        if (activityState) {
            console.log("Activity State:", activityState);

            const activity = { id: Date.now().toString(), distance:activityState.distance, duration: duration, startTime: startTime, endTime: new Date()};

            const updatedActivities = [...activities, activity];
            setActivities(updatedActivities);
     
            await AsyncStorage.setItem('activities', JSON.stringify(updatedActivities));
        }
    };

    const startTimer = () => {
        const now = new Date();
        setStartTime(now); // Set the start time
   

        // Start the timer
        const interval = setInterval(() => {
            const elapsed = new Date().getTime() - now.getTime(); // Time elapsed in milliseconds
            const hours = Math.floor(elapsed / (1000 * 60 * 60));
            const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((elapsed % (1000 * 60)) / 1000);

            setDuration(
                `${hours.toString().padStart(2, "0")}:${minutes
                    .toString()
                    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
            );
        }, 1000);

        setTimer(interval);
    };

    const stopTimer = () => {
        if (timer) {
            clearInterval(timer); // Stop the timer
            setTimer(null);
        }
        const now = new Date();
        setEndTime(now)
    };

    console.log('Activities', activities)

    useEffect(() => {
        loadActivities();
        startTimer()

        return () => {
            stopTimer()
        }
    }, [])


    return (
        <View style={styles.container}>
            <View style={styles.timerSection}>
                <Text style={styles.timerText}>{duration}</Text>
                {startTime && (
                    <Text style={styles.startTimeText}>
                        Started At: {startTime.toLocaleTimeString()}
                    </Text>
                )}
            </View>
            <ActivityScreen />
            <Dashboard ref={activityRef} />
            

            <Button
                mode="contained"
                onPress={() => {
                    navigation.navigate("SensorsReadings")
                }}
                style={styles.button}
                color="#ff343e"
            >
               Check Readings
            </Button>

            <Button
                mode="contained"
                onPress={() => {
                    // stopTimer()
                    // getActivityState()
                    navigation.navigate('MapScreen')
                }}
                style={styles.button}
                color="#F44336"
            >
                View On Map
            </Button>

            <Button
                mode="contained"
                onPress={() => {
                    stopTimer()
                    getActivityState()
                    navigation.goBack()
                }}
                style={styles.button}
                color="#F44336"
            >
                Finish Activity
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F5F5",
        padding: 16,
    },
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
    button: {
        marginTop: 16,
        width: "100%",
        borderRadius: 8,
    },
});

export default TimerScreen;