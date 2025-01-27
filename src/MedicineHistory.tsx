import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react'
import { FlatList, Text, View } from 'react-native';

const MedicineHistory = () => {
    const [reminders, setReminders] = useState([]);
    // Load reminders
    const loadReminders = async () => {
        const storedReminders = await AsyncStorage.getItem('reminders');
        if (storedReminders) setReminders(JSON.parse(storedReminders));
    };

    React.useEffect(() => {
        loadReminders();
    }, []);
    return (
        <FlatList
            data={reminders}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <View
                    style={{
                        padding: 10,
                        marginVertical: 5,
                        borderWidth: 1,
                        borderColor: '#ccc',
                        borderRadius: 5,
                    }}
                >
                    <Text style={{ fontSize: 18 }}>{item.medicine}</Text>
                    <Text style={{ color: '#666' }}>{item.time}</Text>
                </View>
            )}
        />
    )
}

export default MedicineHistory