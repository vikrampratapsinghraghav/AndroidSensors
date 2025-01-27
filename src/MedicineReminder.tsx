import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { scheduleNotification } from './PushNotification';

const MedicineReminder = () => {
   const [medicine, setMedicine] = useState('');
   const [time, setTime] = useState('');
   const [reminders, setReminders] = useState([]);

   // Save reminder
   const addReminder = async () => {
       if (!medicine || !time) {
           Alert.alert('Error', 'Please enter medicine name and time.');
           return;
       }

       const reminder = { id: Date.now().toString(), medicine, time };
       const updatedReminders = [...reminders, reminder];
       setReminders(updatedReminders);

       await AsyncStorage.setItem('reminders', JSON.stringify(updatedReminders));

       // Schedule notification
       const reminderTime = new Date(time);
       scheduleNotification('Medicine Reminder', `Take ${medicine}`, reminderTime);

       setMedicine('');
       setTime('');
       Alert.alert('Success', 'Reminder added and notification scheduled!');
   };

   // Load reminders
   const loadReminders = async () => {
       const storedReminders = await AsyncStorage.getItem('reminders');
       if (storedReminders) setReminders(JSON.parse(storedReminders));
   };

   React.useEffect(() => {
       loadReminders();
   }, []);

   return (
       <View style={{ flex: 1, padding: 20 }}>
           <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>
               Medicine Reminder
           </Text>

           <TextInput
               placeholder="Enter medicine name"
               value={medicine}
               onChangeText={setMedicine}
               style={{
                   borderWidth: 1,
                   borderColor: '#ccc',
                   padding: 10,
                   marginBottom: 10,
                   borderRadius: 5,
               }}
           />

           <TextInput
               placeholder="Enter time (YYYY-MM-DD HH:mm)"
               value={time}
               onChangeText={setTime}
               style={{
                   borderWidth: 1,
                   borderColor: '#ccc',
                   padding: 10,
                   marginBottom: 10,
                   borderRadius: 5,
               }}
           />

           <Button title="Add Reminder" onPress={addReminder} />
       </View>
   );
};

export default MedicineReminder;