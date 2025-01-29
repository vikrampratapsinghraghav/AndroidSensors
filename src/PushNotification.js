import PushNotification from 'react-native-push-notification';
import { CHANNEL_ID } from './constants';
import { NativeModules } from 'react-native';

const { NotificationScheduler } = NativeModules;

PushNotification.configure({
    onNotification: function (notification) {
        console.log('Notification:', notification);
    },
    requestPermissions: true,
});

export const scheduleNotification = (title, message, date) => {
    NotificationScheduler.startNotificationService(new Date().getTime() + 20 * 1000);

    // NotificationScheduler.startNotificationService(new Date(Date.now() + 10 * 1000));

    // PushNotification.localNotificationSchedule({
    //     //... You can use all the options from localNotifications
    //     channelId: CHANNEL_ID,
    //     title: title,
    //     message: message, // (required)
    //     date: new Date(Date.now() + 60 * 1000), // in 60 secs
    //     allowWhileIdle: true, // (optional) set notification to work while on doze, default: false
      
    //     /* Android Only Properties */
    //     repeatTime: 1, // (optional) Increment of configured repeatType. Check 'Repeating Notifications' section for more info.
    //   });
};