'use client';
import Image from 'next/image';
import React, { useState } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import useApiHook from '@/hooks/useApiHook';
import { RotatingLines } from 'react-loader-spinner';
import { signInSchema } from '@/schema/auth/authSchema';

const IntegrationPopup = ({ onClosePopup }) => {
  const { handleApiCall, isApiLoading } = useApiHook();
  const [showApiKey, setShowApiKey] = useState(false);

  const handleLogin = () => {
    
  };
  const handleClose = () => {
    setShowApiKey(false);
    onClosePopup();
  };

  return (
    <div className='fixed top-0 left-0 right-0 w-screen z-50 flex items-center justify-center h-full min-h-screen m-auto px-5 md:px-0 bg-white/20'>
      <div className='relative max-w-[32.5rem] overflow-hidden m-auto flex flex-col justify-center items-start w-full text-white px-3 py-5 md:p-8 charcoalBg rounded-2xl border border-gray-100'>
        <p className='md:text-6xl text-lg font-bold pt-0 md:pt-5 text-center max-w-[20.5rem] m-auto leading-6 md:leading-8'>
          Integrate Shoppify
        </p>
        <Formik
          initialValues={{
            email: '',
            password: '',
          }}
          validationSchema={signInSchema}
          onSubmit={handleLogin}
        >
          <Form className='w-full text-white text-base pt-2 md:pt-4 z-10 relative'>
            <div className='w-full block'>
              <div className='w-full sm:w-full'>
                <label className='w-full block pt-2 pb-3'>
                  API key<span className='text-red-600'> *</span>
                </label>
                <Field
                  type='text'
                  name='apikey'
                  placeholder='Enter API key here'
                  className='mb-2 text-gray-700 text-base spacing px-3 rounded-2xl border border-solid bg-black border-lightGray-200 bg-black-200'
                />
                <ErrorMessage
                  name='apikey'
                  component='div'
                  className='text-red-600'
                />
              </div>
              <div className='w-full sm:w-full relative'>
                <label className='w-full block pt-5 pb-3'>
                  Api Secret Key<span className='text-red-600'> *</span>
                </label>
                <div className='w-full relative mb-2'>
                  <Field
                    type={showApiKey ? 'text' : 'password'}
                    name='secretkey'
                    placeholder='Enter api secret key'
                    className='text-gray-700 text-base spacing px-3 rounded-2xl border border-solid bg-black border-lightGray-200 bg-black-200'
                  />
                  <button
                    type='button'
                    onClick={() =>
                      setShowApiKey((prevShowApiKey) => !prevShowApiKey)
                    }
                    className='absolute top-4 right-4 z-50 bg-transparent border-none'
                  >
                    <Image
                      src='/Auth/eye.svg'
                      width={24}
                      height={24}
                      className='ml-2 cursor-pointer'
                      alt='ContronNet'
                    />
                  </button>
                </div>
                <ErrorMessage
                  name='secretkey'
                  component='div'
                  className='text-red-600'
                />
              </div>
            </div>
            <div className='w-full pt-4 flex justify-end'>
              <button
                onClick={handleClose}
                className='bg-gray-200 w-40 text-white py-4 text-center rounded-2xl'
              >
                Cancel
              </button>
              <button
                type='submit'
                disabled={isApiLoading}
                onClick={handleClose}
                className='btn-Gradient w-40 text-base  py-4 ml-3 text-black text-center rounded-2xl cursor-pointer font-semibold flex items-center justify-center'
              >
                {isApiLoading ? (
                  <RotatingLines
                    visible={true}
                    height='14'
                    width='14'
                    color='blue'
                    strokeWidth='5'
                    animationDuration='0.75'
                    ariaLabel='rotating-lines-loading'
                    wrapperStyle={{}}
                    wrapperClass=''
                  />
                ) : (
                  <p>Connect Shopify</p>
                )}
              </button>
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default IntegrationPopup;
