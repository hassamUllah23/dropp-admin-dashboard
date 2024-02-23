import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';
const firebaseConfig = {
  apiKey: "AIzaSyCghLsazo3XkbLw9_MD34HXEAe35C9rKwc",
  authDomain: "controllnet.firebaseapp.com",
  projectId: "controllnet",
  storageBucket: "controllnet.appspot.com",
  messagingSenderId: "664029840039",
  appId: "1:664029840039:web:aad5768717ac353f3a5182",
  measurementId: "G-0NPTEDRKXZ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const messaging = getMessaging();
export async function getFCMToken() {
    try {
        const token = await getToken(messaging, { vapidKey: 'P4PP43WWy8tnqmseUMw96d96128jtu5U92ymPvcnwhM'});
        return token;
    } catch (e) {
        console.log('getFCMToken error', e);
        return undefined
    }
}