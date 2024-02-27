'use client';
import { firebaseMessaging } from '@/config/firebase/firebaseClient';
import { useDispatch } from 'react-redux';
import { selectAuth, useSelector } from '@/lib';
import { getToken, onMessage } from '@firebase/messaging';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import useApiHook from '@/hooks/useApiHook';
import { addNotification } from '@/lib/slices/notification/notificationSlice';
import { toast } from 'react-toastify';

export default function Layout({ children }) {
  const auth = useSelector(selectAuth);
  const router = useRouter();
  const dispatch = useDispatch();
  const { handleApiCall, isApiLoading } = useApiHook();

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
    if (!auth?.isLogin) router.push('/');
  }, [auth, router]);

  useEffect(() => {
    onMessage(firebaseMessaging, (payload) => {
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
          },
        ];
        dispatch(addNotification(notification));
      } catch (error) {
        console.error('Error handling message:', error);
      }
    });
  }, [firebaseMessaging]);

  useEffect(() => {
    Notification.requestPermission().then((permission) => {
      if (permission !== 'granted')
        return toast.error('You have denied the notifications permission.');
      getToken(firebaseMessaging, {
        vapidKey:
          'BFjCyzqcytxVs-yc8fg2iP19jGMcE6U5RvKL3Wv3m9el3w4-oy9CshaNmJYZtxz4IfGD3WfMqqlMVgHkScOFsVQ',
      }).then((currentToken) => {
        if (
          currentToken &&
          !auth?.userInfo?.profile?.firebaseTokens?.some(
            (tokenObj) => tokenObj.token === currentToken
          )
        )
          return updateToken(currentToken);
      });
    });
  }, []);

  return auth?.isLogin ? children : null;
}
