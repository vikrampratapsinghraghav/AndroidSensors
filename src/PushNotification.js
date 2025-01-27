import PushNotification from 'react-native-push-notification';
import { CHANNEL_ID } from './constants';

PushNotification.configure({
    onNotification: function (notification) {
        console.log('Notification:', notification);
    },
    requestPermissions: true,
});

export const scheduleNotification = (title, message, date) => {
    console.log('adjhgfsjhdfbhjsf')
    PushNotification.localNotificationSchedule({
        //... You can use all the options from localNotifications
        channelId: CHANNEL_ID,
        title: title,
        message: message, // (required)
        date: new Date(Date.now() + 60 * 1000), // in 60 secs
        allowWhileIdle: true, // (optional) set notification to work while on doze, default: false
      
        /* Android Only Properties */
        repeatTime: 1, // (optional) Increment of configured repeatType. Check 'Repeating Notifications' section for more info.
      });
};