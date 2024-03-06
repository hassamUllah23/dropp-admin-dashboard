import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: 'AIzaSyBsU1i3q5M6hVEWP3Alff5yN5mdt2cbVh4',
  authDomain: 'controlnet-notifications.firebaseapp.com',
  projectId: 'controlnet-notifications',
  storageBucket: 'controlnet-notifications.appspot.com',
  messagingSenderId: '861163626998',
  appId: '1:861163626998:web:d7d6f03e982f6022b467d7',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const messaging = getMessaging();
export async function getFCMToken() {
  try {
    const token = await getToken(messaging, {
      vapidKey:
        'BFjCyzqcytxVs-yc8fg2iP19jGMcE6U5RvKL3Wv3m9el3w4-oy9CshaNmJYZtxz4IfGD3WfMqqlMVgHkScOFsVQ',
    });
    return token;
  } catch (e) {
    return undefined;
  }
}
