'use client';
import { useDispatch } from 'react-redux';
import { selectAuth, useSelector } from '@/lib';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import {
  addSocketNotification,
} from '@/lib/slices/notification/notificationSlice';
import socket from '@/lib/socket';
export default function Layout({ children }) {
  const auth = useSelector(selectAuth);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    socket.on('jobTokenization', (tokenizationJob) => {
      console.log('socket received notification');
      console.log({ tokenizationJob });
      const notification = [
        {
          jobId: tokenizationJob?.jobId,
          type: tokenizationJob?.type,
        },
      ];
      console.log(notification);
      dispatch(addSocketNotification(notification));
    });
    socket.on('jobCreation', (jobId) => {
      console.log('socket received new job notification');
      console.log({ jobId });
      const notification = [
        {
          jobId,
        },
      ];
      console.log(notification);
      dispatch(addSocketNotification(notification));
    });
  }, []);

  useEffect(() => {
    if (!auth?.isLogin) router.push('/sign-in');
  }, [auth, router]);



  return auth?.isLogin ? children : null;
}
