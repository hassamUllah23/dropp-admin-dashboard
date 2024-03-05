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
      token: auth.token,
    });
  };

  useEffect(() => {
    const retrieveToken = async () => {
      try {
        if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
          const messaging = getMessaging(firebaseApp);
          setMessaging(messaging);

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
          }
        }
      } catch (error) {
        toast.error('An error occurred while retrieving token:', error);
      }
    };

    retrieveToken();
  }, []);

  return { fcmToken: token, messaging, notificationPermissionStatus };
};

export default useNotificationToken;
