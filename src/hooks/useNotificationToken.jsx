import { useEffect, useState } from 'react';
import 'firebase/messaging';
import { getMessaging, getToken } from 'firebase/messaging';
import firebaseApp from '@/config/firebase/firebaseClient';
import { toast } from 'react-toastify';
import useApiHook from './useApiHook';
import { selectAuth, useSelector } from '@/lib';

const useNotificationToken = () => {
  const auth = useSelector(selectAuth);
  const { handleApiCall } = useApiHook();
  const [token, setToken] = useState('');
  const [messaging, setMessaging] = useState(null);
  const [notificationPermissionStatus, setNotificationPermissionStatus] =
    useState('');

  const updateToken = async (token) => {
    await handleApiCall({
      method: 'PUT',
      url: '/employee/update-firebase-token',
      data: {
        type: 'web',
        token: token,
      },
      token: auth.userInfo?.accessToken,
    });
  };

  useEffect(() => {
    const messaging = getMessaging(firebaseApp);
    setMessaging(messaging);

    const retrieveToken = async () => {
      try {
        if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
          // Retrieve the notification permission status
          const permission = await Notification.requestPermission();
          setNotificationPermissionStatus(permission);

          // Check if permission is granted before retrieving the token
          if (permission === 'granted') {
            const currentToken = await getToken(messaging, {
              vapidKey:
              'BKzDNqn_tgilFtqaQp-nZT14FkxJouzxmABLsuC-TUkVv2q-DdCJeJp8clEgUendPf70feGATfxmaOUMCERW884',
            });
            if (currentToken) {
              setToken(currentToken);
              updateToken(currentToken);
            } else {
              toast.error(
                'No registration token available. Request permission to generate one.'
              );
            }
          } else {
            toast.error(
              'Notification permission has been denied. If you want to receive notifications you must enable the notifications in your browser settings.'
            );
          }
        }
      } catch (error) {
        toast.error(
          'Notification token not received. If you want to receive notifications you must enable the notifications in your browser settings and reload the page again.'
        );
        //if (notificationPermissionStatus === 'granted') retrieveToken();
      }
    };

    retrieveToken();
  }, []);

  return { fcmToken: token, messaging, notificationPermissionStatus };
};

export default useNotificationToken;
