'use client';
import { selectAuth, useSelector } from '@/lib';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Layout({ children }) {
  const auth = useSelector(selectAuth);
  const router = useRouter();
  console.log(auth)
  useEffect(() => {
    if (!auth?.isLogin) router.push('/sign-in');
  }, [auth, router]);

  return auth?.isLogin ? children : null;
}
