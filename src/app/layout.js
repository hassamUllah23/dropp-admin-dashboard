'use client';
import { usePathname } from 'next/navigation';
import BackgroundVideo from '@/components/common/BackgroundVideo';
import StoreProvider from './StoreProvider';
import Navbar from '@/components/header/Navbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './style.scss';

export default function RootLayout({ children }) {
  const pathname = usePathname();

  return (
    <html lang='en'>
      <body className='relative '>
        <StoreProvider>
          {pathname === '/' || pathname === '/join-waitlist' ? (
            <>
              <div className='staticBG h-screen' />
              <Navbar />
            </>
          ) : (
            <>
              <Navbar />
              <BackgroundVideo />
            </>
          )}
          <div className={`w-full block screenHeight`}>{children}</div>
        </StoreProvider>
        <ToastContainer
          position={'top-center'}
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnHover
        />
      </body>
    </html>
  );
}
