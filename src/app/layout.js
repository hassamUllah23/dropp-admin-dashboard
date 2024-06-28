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
      <head>
        <title>Dropp CMS</title>
        <link rel='icon' type='image/svg+xml' href='/Favicon.svg' />
      </head>
      <body className='relative '>
        <StoreProvider>
          {pathname === '/' || pathname === '/sign-in' ? (
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
