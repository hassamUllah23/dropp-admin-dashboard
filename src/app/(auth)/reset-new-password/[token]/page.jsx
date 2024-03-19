'use client';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import React, { useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import useApiHook from '@/hooks/useApiHook';
import { toast } from 'react-toastify';
import { RotatingLines } from 'react-loader-spinner';
import { resetPasswordSchema } from '@/schema/auth/authSchema';

const ResetNewPassowrd = () => {
  const router = useRouter();
  const params = useParams();
  const [token] = useState(params?.token);
  const { handleApiCall, isApiLoading } = useApiHook();
  const [showPassword, setShowPassword] = useState(false);
  const [showConPassword, setShowConPassword] = useState(false);

  const handleSetPassword = async (values) => {
    if (!token) return toast.error('Verification token is not valid');
    const result = await handleApiCall({
      method: 'post',
      url: '/auth/reset-new-password',
      data: {
        password: values?.password,
        token: token,
      },
    });
    if (result?.status === 200) {
      toast.success(result?.data?.message);
      setTimeout(() => {
        router.push('/sign-in');
      }, 2000);
    }
  };

  return (
    <div className='relative z-10 flex items-center justify-center max-w-[37rem] h-full m-auto px-5 md:px-0'>
      <div className='relative overflow-hidden m-auto flex flex-col justify-center items-start w-full text-white px-3 py-5 md:p-8 charcoalBg rounded-2xl border-gray-100'>
        <p className='md:text-6xl text-base font-bold pt-0 md:pt-5 text-center max-w-[20.5rem] m-auto leading-6 md:leading-8'>
          Set your new password
        </p>
        <Formik
          initialValues={{
            password: '',
            confirmPassword: '',
          }}
          validationSchema={resetPasswordSchema}
          onSubmit={handleSetPassword}
        >
          <Form className='w-full text-white text-sm md:text-base pt-2 md:pt-4 z-10 relative'>
            <div className='w-full'>
              <div className='w-full sm:w-full float-left relative'>
                <label className='w-full block pt-2 pb-3'>
                  Set Password<span className='text-red-600'> *</span>
                </label>
                <div className='w-full relative mb-2'>
                  <Field
                    type={showPassword ? 'text' : 'password'}
                    name='password'
                    placeholder='Enter strong password'
                    className='password text-gray-700 text-base w-full leading-3 md:leading-5 py-3 md:py-4 px-3 rounded-2xl border border-solid bg-black border-lightGray-200 bg-black-200'
                  />
                  <button
                    type='button'
                    onClick={() =>
                      setShowPassword((prevShowPassword) => !prevShowPassword)
                    }
                    className='showPassword absolute top-3 md:top-4 right-4 z-50 bg-transparent border-none text-white'
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
              <div className='w-full sm:w-full float-left relative'>
                <label className='w-full block pt-5 pb-3'>
                  Confirm Password<span className='text-red-600'> *</span>
                </label>
                <div className='w-full relative mb-2'>
                  <Field
                    type={showConPassword ? 'text' : 'password'}
                    name='confirmPassword'
                    placeholder='Enter confirm password'
                    className='cpassword text-gray-700 text-base w-full leading-3 md:leading-5 py-3 md:py-4 px-3 rounded-2xl border border-solid bg-black border-lightGray-200 bg-black-200'
                    required
                  />
                  <button
                    type='button'
                    onClick={() =>
                      setShowConPassword(
                        (prevShowPassword) => !prevShowPassword
                      )
                    }
                    className='showConPassword absolute top-3 md:top-4 right-4 z-50 bg-transparent border-none text-white'
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
                  name='confirmPassword'
                  component='div'
                  className='text-red-600'
                />
              </div>
            </div>
            <div className='w-full float-left pt-6'>
              <button
                type='submit'
                className='btn-submit btn-Gradient text-base text-black w-full leading-3 md:leading-5 py-3 md:py-4 text-center rounded-2xl cursor-pointer font-semibold flex items-center justify-center'
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
                  />
                ) : (
                  <p>Set password</p>
                )}
              </button>
            </div>
            <p className='pt-6 float-left text-center w-full'>
              <Link href='/sign-in' className='text-white back-to-login'>
                Back to login
              </Link>
            </p>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default ResetNewPassowrd;
