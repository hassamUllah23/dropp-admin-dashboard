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

  useEffect(() => {
    router.push('/dashboard');
  }, []);


  return auth?.isLogin ? children : null;
}
