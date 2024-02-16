'use client';
import { selectAuth, useSelector } from '@/lib';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Layout({ children }) {
  const auth = useSelector(selectAuth);
  const router = useRouter();

  useEffect(() => {
    if (!auth?.isLogin) router.push('/');
  }, [auth, router]);

  return auth?.isLogin ? children : null;
}
