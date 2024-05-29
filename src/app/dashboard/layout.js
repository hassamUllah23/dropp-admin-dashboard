'use client';
import { useDispatch } from 'react-redux';
import { getMessaging, onMessage } from '@firebase/messaging';
import { selectAuth, useSelector } from '@/lib';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { addNotification } from '@/lib/slices/notification/notificationSlice';
import useNotificationToken from '@/hooks/useNotificationToken';
import firebaseApp from '@/config/firebase/firebaseClient';

export default function Layout({ children }) {
  const auth = useSelector(selectAuth);
  const router = useRouter();
  const dispatch = useDispatch();
  const { messaging } = useNotificationToken();

  useEffect(() => {
    if (!auth?.isLogin) router.push('/sign-in');
  }, [auth, router]);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      const fbMessaging = getMessaging(firebaseApp);
      const unsubscribe = onMessage(fbMessaging, (payload) => {
        try {
          const notification = [
            {
              messageId: payload?.messageId,
              sender: payload?.from,
              title: payload?.notification?.title,
              message: payload?.notification?.body,
              jobId: payload?.data?.jobId,
              isRead: false,
              createdAt: Date.now(),
              type:payload?.data?.type
            },
          ];
          dispatch(addNotification(notification));
          console.log('notification')
          console.log(notification)
        } catch (error) {
          console.error('Error handling message:', error);
        }
      });
      return () => {
        unsubscribe();
      };
    }
  }, [messaging]);

  return auth?.isLogin ? children : null;
}
