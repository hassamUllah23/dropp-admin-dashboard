importScripts(
  'https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js'
);
importScripts(
  'https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js'
);

const firebaseConfig = {
  apiKey: 'AIzaSyBwrpNc8rYwOVD21Q0WCdrp2ypK1XCN3Cw',
  authDomain: 'controlnet-cfc19.firebaseapp.com',
  projectId: 'controlnet-cfc19',
  storageBucket: 'controlnet-cfc19.appspot.com',
  messagingSenderId: '184563454323',
  appId: '1:184563454323:web:69ee401599dae1f3c17506',
  measurementId: 'G-Y5MGQ8S116',
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log({ payload });
});
