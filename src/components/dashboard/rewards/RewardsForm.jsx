'use client';

import GetInitials from '@/components/common/GetInitials';
import { selectAuth, updateUserInfo, useDispatch, useSelector } from '@/lib';
import { useEffect, useRef, useState } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import useApiHook from '@/hooks/useApiHook';
import { toast } from 'react-toastify';
import { RotatingLines } from 'react-loader-spinner';
import { validationSchemaForName } from '@/schema/auth/authSchema';

const RewardsForm = () => {
  const [showLoading, setShowLoading] = useState(false);
  const dispatch = useDispatch();
  const [initialValues, setInitialValues] = useState(null);
  const auth = useSelector(selectAuth);
  const { handleApiCall, isApiLoading } = useApiHook();
  const fileInputRef = useRef();

  const handleProfile = async (values) => {
    setShowLoading(true);
    const result = await handleApiCall({
      method: 'put',
      url: '/user/update',
      data: values,
    })
      .then((res) => {
        if (res.status === 200) {
          dispatch(
            updateUserInfo({
              wallets: auth?.userInfo?.user?.wallets,
              ...res?.data,
            })
          );
          toast.success('Profile updated.');
          setShowLoading(false);
        }
        return res;
      })
      .catch((error) => {
        toast.error(error?.response?.data?.errors);
        setShowLoading(false);
      });
  };

  const getRewards = async () => {
    const result = await handleApiCall({
      method: 'get',
      url: '/settings/all',
    })
      .then((res) => {
        console.log(res)
        if (res.status === 200) {
          setInitialValues({
            image360Points: res?.data?.image360Points,
            initialAccountCreationPoints: res?.data?.initialAccountCreationPoints,
            initialAirDropPoints: res?.data?.initialAirDropPoints,
            initialVirtualPoints: res?.data?.initialVirtualPoints,
            initialWardDropPoints: res?.data?.initialWardDropPoints,
            polygon: res?.data?.polygon,
            shareDiscordPoints: res?.data?.shareDiscordPoints,
            shareTwitterPoints: res?.data?.shareTwitterPoints,
            solana: res?.data?.solana,
            wardrobeWizardPoints: res?.data?.wardrobeWizardPoints,
          });
        }
        return res;
      })
      .catch((error) => {
        toast.error(error?.response?.data?.errors);
      });
  };

  useEffect(() => {
    getRewards()
  }, []);



  return (
    <div className='md:col-span-2 w-full block'>
      {initialValues && (
        <Formik
          initialValues={initialValues}
          onSubmit={handleProfile}
          validationSchema={validationSchemaForName}
        >
          <Form className='md:col-span-2 w-full block'>
            <div className='grid grid-cols-1 gap-x-6 sm:grid-cols-6'>
              <div className='col-span-full flex items-center gap-x-8 relative profileContainer'>
                
              </div>

              <div className='sm:col-span-3'>
                <label
                  htmlFor='first-name'
                  className='block text-sm font-medium leading-6 text-white'
                >
                  initialAccountCreationPoints
                </label>
                <Field
                  type='text'
                  name='initialAccountCreationPoints'
                  id='initialAccountCreationPoints'
                  placeholder='Enter first name'
                  className='mt-2 px-3 block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-white sm:text-sm sm:leading-6'
                />
                <ErrorMessage
                  name='initialAccountCreationPoints'
                  component='div'
                  className='text-red-600 pt-4'
                />
              </div>

              <div className='sm:col-span-3'>
                <label
                  htmlFor='last-name'
                  className='block text-sm font-medium leading-6 text-white'
                >
                  Last name
                </label>
                <Field
                  type='text'
                  id='lastName'
                  name='lastName'
                  placeholder='Enter last name'
                  className='mt-2 px-3 block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-white sm:text-sm sm:leading-6'
                />
                <ErrorMessage
                  name='lastName'
                  component='div'
                  className='text-red-600  pt-4'
                />
              </div>

              <div className='col-span-full'>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium leading-6 text-white'
                >
                  Email address
                </label>
                <div className='mt-2'>
                  <input
                    type='email'
                    name='email'
                    value={auth?.userInfo?.user?.email || ''}
                    readOnly
                    disabled
                    className='mt-2 px-3 block w-full cursor-not-allowed rounded-md border-0 bg-gray py-1.5  text-gray-400 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-white sm:text-sm sm:leading-6'
                  />
                </div>
              </div>

              <div className='col-span-full'>
                <label
                  htmlFor='userName'
                  className='block text-sm font-medium leading-6 text-white'
                >
                  Username
                </label>
                <Field
                  type='text'
                  id='userName'
                  name='userName'
                  className='mt-2 px-3 block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-white sm:text-sm sm:leading-6'
                />
              </div>
            </div>

            <div className='mt-8 flex'>
              <button
                type='submit'
                className='rounded-md bg-Gradient px-10 py-3 text-sm font-semibold text-black shadow-sm'
              >
                {showLoading ? (
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
                  <p>Update Profile</p>
                )}
              </button>
            </div>
          </Form>
        </Formik>
      )}
    </div>
  );
};

export default RewardsForm;
