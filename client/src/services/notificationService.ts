import { getMessaging, getToken, onMessage } from 'firebase/firebase-messaging';
import { app } from './firebase'; // update firebase.ts to expose app

// If 'window' or 'navigator' handles push
export const requestNotificationPermission = async () => {
  try {
    const messaging = getMessaging(app);
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await getToken(messaging, { vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY || 'mock' });
      console.log('FCM Token:', token);
      return token;
    }
  } catch (error) {
    console.error('Notification Setup Error', error);
  }
  return null;
};

export const listenForAlerts = (callback: (payload: any) => void) => {
  try {
    const messaging = getMessaging(app);
    return onMessage(messaging, (payload) => {
      callback(payload);
    });
  } catch (err) {
    console.error('Listen Error', err);
  }
};
