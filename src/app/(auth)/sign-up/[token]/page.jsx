'use client';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import useApiHook from '@/hooks/useApiHook';
import { RotatingLines } from 'react-loader-spinner';
import { toggleLogin, useDispatch } from '@/lib';
import { useRouter } from 'next/navigation';
import { signupSchema } from '@/schema/auth/authSchema';
import jwt from 'jsonwebtoken';
import { toast } from 'react-toastify';

const SignUp = () => {
  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch();
  const { handleApiCall, isApiLoading } = useApiHook();
  const [passwordEntered, setPasswordEntered] = useState(false);
  const [showConPassword, setShowConPassword] = useState(false);
  const [upperLowerCase, setUpperLowerCase] = useState(false);
  const [hasSpecialChar, setHasSpecialChar] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [minLength, setMinLength] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [token] = useState(params?.token);
  const [error] = useState('');

  const handleSignUp = async (values) => {
    if (!hasNumber || !hasSpecialChar || !minLength || !upperLowerCase) {
      toast.error('Password requirements not met');
      return;
    }

    const name = `${values.firstName} ${values.lastName}`;

    const result = await handleApiCall({
      method: 'post',
      url: '/auth/employee/sign-up',
      data: { ...values, name, email: userEmail, platform: 'website' },
      headers: { Authorization: 'none' },
    });
    if (result.status === 201) {
      dispatch(
        toggleLogin({
          isLogin: true,
          userInfo: result?.data,
        })
      );
      return router.push('/dashboard');
    }

    toast.error('There was an error signing up. Please try again');
  };

  const validatepassword = (password) => {
    setPasswordEntered(true);

    const minLength = 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    setMinLength(password.length >= minLength);
    setUpperLowerCase(hasUppercase && hasLowercase);
    setHasNumber(hasNumber);
    setHasSpecialChar(hasSpecialChar);
  };

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwt.decode(token);
        const email = decodedToken?.sub;
        setUserEmail(email);
      } catch (error) {
        console.error('Error decoding token:', error);
        setUserEmail('');
      }
    }
  }, [token]);

  return (
    <div className='relative z-10 flex items-center justify-center max-w-[49.4rem] h-full m-auto py-10 px-5 md:p-3'>
      <div className='relative overflow-hidden m-auto flex flex-col justify-center items-start w-full text-white px-3 py-5 md:p-8 charcoalBg rounded-2xl border-gray-100'>
        <p className='md:text-6xl text-base font-bold pt-0 md:pt-5 text-center max-w-[20.5rem] m-auto leading-6 md:leading-8'>
          Create your account
        </p>
        <Formik
          initialValues={{
            firstName: '',
            lastName: '',
            userName: '',
            password: '',
            confirmpassword: '',
            consentChecked: false,
            token: params?.token,
            status: 'active',
          }}
          validationSchema={signupSchema}
          onSubmit={handleSignUp}
        >
          <Form className='w-full text-white text-sm md:text-base pt-2 md:pt-4 relative z-10'>
            <div className='grid grid-cols-1 md:grid-cols-2'>
              <div className=' w-full px-2'>
                <label className='w-full block pt-3 md:pt-5 pb-3'>
                  First Name<span className='text-red-600'> *</span>
                </label>
                <Field
                  type='text'
                  name='firstName'
                  placeholder='Enter first name here'
                  className='firstname mb-2 text-gray-700 text-base w-full leading-3 md:leading-5 py-3 md:py-4 px-3 rounded-2xl border border-solid bg-black border-lightGray-200 bg-black-200'
                />
                <ErrorMessage
                  name='firstName'
                  component='div'
                  className='text-red-600'
                />
              </div>

              <div className=' w-full px-2 relative'>
                <label className='w-full block pt-3 md:pt-5 pb-3'>
                  Last Name<span className='text-red-600'> *</span>
                </label>
                <Field
                  type='text'
                  name='lastName'
                  placeholder='Enter last name here'
                  className='lastname mb-2 text-gray-700 text-base w-full leading-3 md:leading-5 py-3 md:py-4 px-3 rounded-2xl border border-solid bg-black border-lightGray-200 bg-black-200'
                />
                <ErrorMessage
                  name='lastName'
                  component='div'
                  className='text-red-600'
                />
              </div>

              <div className=' px-2'>
                <label className='w-full block pt-3 md:pt-5 pb-3'>
                  Email<span className='text-red-600'> *</span>
                </label>
                <Field
                  type='email'
                  name='email'
                  value={userEmail}
                  placeholder='Enter email here'
                  readOnly={true}
                  className='email mb-2 text-gray-700 text-base w-full leading-3 md:leading-5 py-3 md:py-4 px-3 rounded-2xl border border-solid bg-black border-lightGray-200 bg-black-200'
                />
              </div>

              <div className=' px-2 relative'>
                <label className='w-full block pt-3 md:pt-5 pb-3'>
                  Username<span className='text-red-600'> *</span>
                </label>
                <Field
                  type='text'
                  name='userName'
                  placeholder='Enter username here'
                  className='username mb-2 text-gray-700 text-base w-full leading-3 md:leading-5 py-3 md:py-4 px-3 rounded-2xl border border-solid bg-black border-lightGray-200 bg-black-200'
                />
                <ErrorMessage
                  name='userName'
                  component='div'
                  className='text-red-600'
                />
              </div>

              <div className=' px-2 relative w-full items-center'>
                <label className='w-full block pt-3 md:pt-5 pb-3'>
                  Password<span className='text-red-600'> *</span>
                </label>
                <div className='relative w-full mb-2'>
                  <Field
                    type={showPassword ? 'text' : 'password'}
                    name='password'
                    onKeyUp={(e) => validatepassword(e.target.value)}
                    placeholder='Enter strong password'
                    className='password block text-gray-700 text-base w-full leading-3 md:leading-5 py-3 md:py-4 px-3 rounded-2xl border border-solid bg-black border-lightGray-200 bg-black-200 flex-grow'
                    autoComplete='new-password'
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

              <div className=' px-2 relative w-full items-center'>
                <label className='w-full block pt-3 md:pt-5 pb-3'>
                  Confirm Password<span className='text-red-600'> *</span>
                </label>
                <div className='relative w-full mb-2'>
                  <Field
                    type={showConPassword ? 'text' : 'password'}
                    name='confirmpassword'
                    placeholder='Enter confirm password'
                    className='cpassword block text-gray-700 text-base w-full leading-3 md:leading-5 py-3 md:py-4 px-3 rounded-2xl border border-solid bg-black border-lightGray-200 bg-black-200 flex-grow'
                    autoComplete='new-password'
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
                  name='confirmpassword'
                  component='div'
                  className='text-red-600'
                />
              </div>
            </div>

            {/* Password check list */}
            <div className=' w-full font-medium px-2 pt-3 md:pt-5'>
              {error && <p className='text-red-600 pb-4'>{error}</p>}
              <p className='pb-2'>Your Password must be:</p>
              <p className='py-1 grid grid-cols-1 md:grid-cols-2'>
                <span
                  className={`w-full flex mb-2 md:mb-0 characters ${
                    passwordEntered
                      ? minLength
                        ? 'text-green-600'
                        : ' text-red-600'
                      : 'text-white'
                  }`}
                >
                  <svg
                    width='16'
                    height='16'
                    className='relative top-0.5 mr-2'
                    viewBox='0 0 16 16'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d={
                        minLength && passwordEntered
                          ? 'M5.16669 8.00001L7.05335 9.88668L10.8334 6.11334'
                          : 'M5.16669 5.16669L10.8334 10.8334M5.16669 10.8334L10.8334 5.16669'
                      }
                      stroke={
                        passwordEntered
                          ? minLength
                            ? '#16A34A'
                            : 'red'
                          : 'white'
                      }
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                  8-12 Character long
                </span>
                <span
                  className={`w-full flex isUpperLowerCase ${
                    passwordEntered
                      ? upperLowerCase
                        ? 'text-green-600'
                        : ' text-red-600'
                      : 'text-white'
                  }`}
                >
                  <svg
                    width='16'
                    height='16'
                    className='relative top-0.5 mr-2'
                    viewBox='0 0 16 16'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d={
                        upperLowerCase && passwordEntered
                          ? 'M5.16669 8.00001L7.05335 9.88668L10.8334 6.11334'
                          : 'M5.16669 5.16669L10.8334 10.8334M5.16669 10.8334L10.8334 5.16669'
                      }
                      stroke={
                        passwordEntered
                          ? upperLowerCase
                            ? '#16A34A'
                            : 'red'
                          : 'white'
                      }
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                  Include a mix of uppercase & lowercase
                </span>
              </p>
              <p className='py-1 grid grid-cols-1 md:grid-cols-2'>
                <span
                  className={`w-full flex mb-2 md:mb-0 isNumber ${
                    passwordEntered
                      ? hasNumber
                        ? 'text-green-600'
                        : ' text-red-600'
                      : 'text-white'
                  }`}
                >
                  <svg
                    width='16'
                    height='16'
                    className='relative top-0.5 mr-2'
                    viewBox='0 0 16 16'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d={
                        hasNumber && passwordEntered
                          ? 'M5.16669 8.00001L7.05335 9.88668L10.8334 6.11334'
                          : 'M5.16669 5.16669L10.8334 10.8334M5.16669 10.8334L10.8334 5.16669'
                      }
                      stroke={
                        passwordEntered
                          ? hasNumber
                            ? '#16A34A'
                            : 'red'
                          : 'white'
                      }
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                  Include at least one numbers
                </span>
                <span
                  className={`w-full flex hasSpecialChar ${
                    passwordEntered
                      ? hasSpecialChar
                        ? 'text-green-600'
                        : ' text-red-600'
                      : 'text-white'
                  }`}
                >
                  <svg
                    width='16'
                    height='16'
                    className='relative top-0.5 mr-2'
                    viewBox='0 0 16 16'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d={
                        hasSpecialChar && passwordEntered
                          ? 'M5.16669 8.00001L7.05335 9.88668L10.8334 6.11334'
                          : 'M5.16669 5.16669L10.8334 10.8334M5.16669 10.8334L10.8334 5.16669'
                      }
                      stroke={
                        passwordEntered
                          ? hasSpecialChar
                            ? '#16A34A'
                            : 'red'
                          : 'white'
                      }
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                  Include at least one special character
                </span>
              </p>
            </div>

            {/* Terms and Conditions */}
            <div className='w-full md:col-span-2 pt-2 md:pt-7 px-2'>
              <div className='flex items-center mb-2'>
                <div className='flex items-center h-5'>
                  <Field
                    type='checkbox'
                    id='helperCheckbox'
                    name='consentChecked'
                    className='w-4 h-4 text-black-600 rounded-lg acknowledge'
                  />
                </div>
                <div className='ml-4'>
                  <label
                    htmlFor='helperCheckbox'
                    className='text-sm md:text-base text-white leading-6 relative'
                  >
                    By checking this check box I agree with dropp{' '}
                    <span className='text-dodgerblue terms'>
                      Terms & conditions and Privacy Policy.
                    </span>
                  </label>
                </div>
              </div>
              <ErrorMessage
                name='consentChecked'
                component='div'
                className='text-red-600 text-center'
              />
            </div>

            {/* Submit */}
            <div className='w-full pt-4 px-2'>
              <button
                type='submit'
                className='signup btn-Gradient text-base text-black w-full leading-3 md:leading-5 py-3 md:py-4 text-center rounded-2xl cursor-pointer font-semibold flex items-center justify-center'
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
                  <p>Sign up</p>
                )}
              </button>
            </div>

            {/* Login */}
            <p className='pt-6 col-span-2 text-center w-full'>
              Have an account?{' '}
              <Link href='/sign-in' className='text-white link-sign-in'>
                <b className='text-dodgerblue'>Login account</b>
              </Link>
            </p>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default SignUp;
