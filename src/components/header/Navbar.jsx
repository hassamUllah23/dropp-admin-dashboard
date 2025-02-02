'use client';
import { selectAuth, toggleLogin, useDispatch, useSelector } from '@/lib';
import Link from 'next/link';
import React, { useState, useRef, useEffect } from 'react';
import SideBar from './SideBar';
import NotificationsPopup from './NotificationsPopup';
import {
  clearNotifications,
  clearSocketNotifications,
} from '@/lib/slices/notification/notificationSlice';
import { useRouter } from 'next/navigation';
import useApiHook from '@/hooks/useApiHook';
import { toast } from 'react-toastify';
import useNotificationSound from '@/hooks/useNotificationSound';

export default function Navbar() {
  const auth = useSelector(selectAuth);
  const router = useRouter();
  const { handleApiCall, isApiLoading } = useApiHook();
  const dispatch = useDispatch();
  const [showSidebar, setShowSidebar] = useState(false);
  const [notificationsData, setNotificationsData] = useState([]);
  const notifications = useSelector(
    (state) => state.notification.notifications
  );
  const [showNotification, setShowNotification] = useState(false);
  const [showNotificationDot, setShowNotificationDot] = useState(false);
  const notificationRef = useRef(null);

  const playNotificationSound = useNotificationSound();

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
    document.body.style.overflowY = showSidebar ? 'visible' : 'hidden';
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    dispatch(toggleLogin({ isLogin: false, userInfo: null }));
    router.push('/sign-in');
  };

  const handleNotifications = () => {
    setShowNotification(!showNotification);
    setShowNotificationDot(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotification(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [notificationRef]);

  const getNotification = async () => {
    await handleApiCall({
      method: 'GET',
      url: '/employee/notification/all',
    })
      .then((res) => {
        console.log(res?.data);
        if (res?.status === 200) {
          setNotificationsData(res?.data?.notifications);
        }
        return res;
      })
      .catch((error) => {
        if (error?.response?.data?.errors === 'Invalid token') {
          toast.error('Session expired, please login again');
          handleLogout();
        }
      });
  };

  const markAllNotificationAsRead = async () => {
    const result = await handleApiCall({
      method: 'GET',
      url: '/employee/notification/read-all',
    });
    if (result?.status === 204) {
      getNotification();
    }
  };

  useEffect(() => {
    if (auth?.isLogin && notifications.length > 0) {
      console.log('Notifications recieved on navbar');
      setNotificationsData(notifications);
      setShowNotificationDot(true);
      getNotification();
      playNotificationSound();
    }
  }, [notifications]);

  useEffect(() => {
    dispatch(clearNotifications());
    dispatch(clearSocketNotifications());
    if (auth?.isLogin) getNotification();
  }, []);

  return (
    <>
      <section className='pt-4 pb-2 md:px-2.5 flex justify-between max-w-screen-3xl m-auto min-w-80 z-10'>
        <Link href='/dashboard' className='pl-3 md:pl-10'>
          <img
            src='/assets/images/navbar/logo.png'
            className=' w-14 md:w-[5.5rem]'
          />
        </Link>
        <div className=' flex justify-center items-center gap-2 pr-2 md:pr-10'>
          {auth?.isLogin ? (
            <div className='flex pr-0 md:pr-1'>
              <span
                ref={notificationRef}
                title='Notifications'
                className='cursor-pointer relative w-8 md:w-10 inline-block flexCenter rounded-xl py-1 pl-2 md:pl-3 text-white notifications'
              >
                <svg
                  onClick={handleNotifications}
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-6 h-6'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0'
                  />
                </svg>
                {showNotificationDot && (
                  <span className='inline-block bg-red-700 top-[1px] right-1 w-2 h-2 rounded-full absolute'></span>
                )}

                {showNotification && (
                  <NotificationsPopup
                    isApiLoading={isApiLoading}
                    notificationData={notificationsData}
                    markAllNotificationAsRead={markAllNotificationAsRead}
                    onClose={() => setShowNotification(false)}
                  />
                )}
              </span>
              <button
                className='text-white ml-3 mr-2'
                onClick={handleLogout}
                title='Logout'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-6 h-6'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9'
                  />
                </svg>
              </button>
              <span
                className='cursor-pointer w-8 md:w-10 inline-block flexCenter rounded-xl py-0 md:py-1 pl-2 md:pl-3 text-white'
                onClick={toggleSidebar}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                  fill='currentColor'
                  className='w-8 h-8'
                >
                  <path
                    fillRule='evenodd'
                    d='M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z'
                    clipRule='evenodd'
                  />
                </svg>
              </span>
            </div>
          ) : (
            <div className='flex'>
              <Link
                title='Sign In'
                href='/sign-in'
                className='cursor-pointer w-10 md:w-14 flexCenter rounded-xl py-1 text-black'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                  className='w-6 h-6'
                >
                  <path
                    fillRule='evenodd'
                    d='M3 4.25A2.25 2.25 0 0 1 5.25 2h5.5A2.25 2.25 0 0 1 13 4.25v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 0-.75-.75h-5.5a.75.75 0 0 0-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 0 0 .75-.75v-2a.75.75 0 0 1 1.5 0v2A2.25 2.25 0 0 1 10.75 18h-5.5A2.25 2.25 0 0 1 3 15.75V4.25Z'
                    fill='#ffffff'
                    clipRule='evenodd'
                  />
                  <path
                    fillRule='evenodd'
                    d='M19 10a.75.75 0 0 0-.75-.75H8.704l1.048-.943a.75.75 0 1 0-1.004-1.114l-2.5 2.25a.75.75 0 0 0 0 1.114l2.5 2.25a.75.75 0 1 0 1.004-1.114l-1.048-.943h9.546A.75.75 0 0 0 19 10Z'
                    fill='#ffffff'
                    clipRule='evenodd'
                  />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </section>
      {showSidebar && <SideBar onClose={toggleSidebar} />}
    </>
  );
}
