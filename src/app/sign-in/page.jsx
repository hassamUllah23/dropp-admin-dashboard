'use client';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import useApiHook from '@/hooks/useApiHook';
import { RotatingLines } from 'react-loader-spinner';
import { toggleLogin, useDispatch } from '@/lib';
import { useRouter } from 'next/navigation';
import { signInSchema } from '@/schema/auth/authSchema';
import { toast } from 'react-toastify';

const SignIn = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { handleApiCall, isApiLoading } = useApiHook();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (values) => {
    const result = await handleApiCall({
      method: 'post',
      url: '/auth/employee/sign-in',
      data: {userName: values.email, password: values.password},
      headers: { Authorization: 'none' },
    });
    
    if (result.status === 200) {
      dispatch(
        toggleLogin({
          isLogin: true,
          userInfo: result?.data,
        })
      );
      localStorage.setItem('accessToken', result?.data?.accessToken);
      router.push('/dashboard/chat');
    }
  };

  return (
    <div className='relative z-10 flex items-center justify-center max-w-[37rem] h-full m-auto px-5 md:px-0'>
      <div className='relative overflow-hidden m-auto flex flex-col justify-center items-start w-full text-white px-3 py-5 md:p-8 charcoalBg rounded-2xl border border-gray-100'>
        <p className='md:text-6xl text-base font-bold pt-0 md:pt-5 text-center max-w-[20.5rem] m-auto leading-6 md:leading-8'>
          Welcome To The droppPhygital Testnet
        </p>
        <Formik
          initialValues={{
            email: '',
            password: '',
          }}
          validationSchema={signInSchema}
          onSubmit={handleLogin}
        >
          <Form className='w-full text-white text-sm md:text-base pt-2 md:pt-4 z-10 relative'>
            <div className='w-full block'>
              <div className='w-full sm:w-full'>
                <label className='w-full block pt-2 pb-3'>
                  Username<span className='text-red-600'> *</span>
                </label>
                <Field
                  name='email'
                  placeholder='Enter email here'
                  className='email mb-2 text-gray-700 text-base w-full leading-3 md:leading-5  py-3 md:py-4 px-3 rounded-2xl border border-solid bg-black border-lightGray-200 bg-black-200'
                />
                <ErrorMessage
                  name='email'
                  component='div'
                  className='text-red-600'
                />
              </div>
              <div className='w-full sm:w-full relative'>
                <label className='w-full block pt-5 pb-3'>
                  Password<span className='text-red-600'> *</span>
                </label>
                <div className='w-full relative mb-2'>
                  <Field
                    type={showPassword ? 'text' : 'password'}
                    name='password'
                    placeholder='Enter password'
                    className='password text-gray-700 text-base w-full leading-3 md:leading-5  py-3 md:py-4 px-3 rounded-2xl border border-solid bg-black border-lightGray-200 bg-black-200'
                  />
                  <button
                    type='button'
                    onClick={() =>
                      setShowPassword((prevShowPassword) => !prevShowPassword)
                    }
                    className='showPassword login absolute top-3 md:top-4 right-4 z-50 bg-transparent border-none text-white'
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
                        d='M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z'
                      />
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z'
                      />
                    </svg>
                  </button>
                </div>
                <ErrorMessage
                  name='password'
                  component='div'
                  className='text-red-600'
                />
              </div>
            </div>
            <div className='w-full flex justify-end mt-3'>
              <Link
                href='/forgot-password'
                className='text-dodgerblue block text-sm md:text-base btn-forgotPassword'
              >
                Forgot Password
              </Link>
            </div>
            <div className='w-full pt-4'>
              <button
                type='submit'
                disabled={isApiLoading}
                className='btn-login btn-Gradient text-base text-black w-full leading-3 md:leading-5 py-3 md:py-4 text-center rounded-2xl cursor-pointer font-semibold flex items-center justify-center'
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
                  <p>Enter</p>
                )}
              </button>
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default SignIn;
