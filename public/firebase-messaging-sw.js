importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: 'AIzaSyBsU1i3q5M6hVEWP3Alff5yN5mdt2cbVh4',
  authDomain: 'controlnet-notifications.firebaseapp.com',
  projectId: 'controlnet-notifications',
  storageBucket: 'controlnet-notifications.appspot.com',
  messagingSenderId: '861163626998',
  appId: '1:861163626998:web:d7d6f03e982f6022b467d7',
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log({ payload });
});