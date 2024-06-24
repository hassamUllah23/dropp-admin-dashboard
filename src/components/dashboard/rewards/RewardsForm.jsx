'use client';

import { useEffect, useState } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import useApiHook from '@/hooks/useApiHook';
import { toast } from 'react-toastify';
import { RotatingLines } from 'react-loader-spinner';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const RewardsForm = () => {
  const [showLoading, setShowLoading] = useState(false);
  const [initialValues, setInitialValues] = useState(null);
  const { handleApiCall, isApiLoading } = useApiHook();

  const saveRewards = async (values) => {
    setShowLoading(true);
    await handleApiCall({
      method: 'put',
      url: '/settings/change',
      data: values,
    })
      .then((res) => {
        if (res.status === 200) {
          toast.success('Rewards updated.');
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
    await handleApiCall({
      method: 'get',
      url: '/settings',
    })
      .then((res) => {
        if (res.status === 200) {
          setInitialValues({
            initialVirtualPoints: res?.data?.initialVirtualPoints,
            skyboxGeneration: res?.data?.skyboxGeneration,
            initialWardDropPoints: res?.data?.initialWardDropPoints,
            shareDiscordPoints: res?.data?.shareDiscordPoints,
            shareTwitterPoints: res?.data?.shareTwitterPoints,
            initialAccountCreationPoints:
              res?.data?.initialAccountCreationPoints,
            followDiscordPoints: res?.data?.followDiscordPoints,
            followTwitterPoints: res?.data?.followTwitterPoints,
            walletPoints: res.data?.walletPoints,
            leaderboardStartDate: new Date(res?.data?.leaderboardStartDate),
            leaderboardEndDate: new Date(res?.data?.leaderboardEndDate),
            retweetPoints: res.data?.retweetPoints,
            tweetUrl: res.data?.tweetUrl,
            settingsId: res?.data?._id,
          });
        }
        return res;
      })
      .catch((error) => {
        toast.error(error?.response?.data?.errors);
      });
  };

  useEffect(() => {
    getRewards();
  }, []);

  const validationSchema = Yup.object().shape({
    initialVirtualPoints: Yup.number().required('Required'),
    skyboxGeneration: Yup.number().required('Required'),
    initialWardDropPoints: Yup.number().required('Required'),
    shareDiscordPoints: Yup.number().required('Required'),
    shareTwitterPoints: Yup.number().required('Required'),
    initialAccountCreationPoints: Yup.number().required('Required'),
    walletPoints: Yup.number().required('Required'),
    followDiscordPoints: Yup.number().required('Required'),
    followTwitterPoints: Yup.number().required('Required'),
    leaderboardStartDate: Yup.date().required('Required'),
    leaderboardEndDate: Yup.date().required('Required'),
    retweetPoints: Yup.number().required('Required'),
    tweetUrl: Yup.string().required('Required'),
  });

  const titles = {
    initialVirtualPoints: '360 Image Points',
    skyboxGeneration: 'Max limit of 360 generation',
    initialWardDropPoints: 'Wardrobe Points',
    shareDiscordPoints: 'Share on Discord Points',
    shareTwitterPoints: 'Share on Twitter Points',
    followDiscordPoints: 'Follow Discord Points',
    followTwitterPoints: 'Follow Twitter Points',
    initialAccountCreationPoints: 'Account creation points',
    leaderboardStartDate: 'Leaderboard Start Date',
    leaderboardEndDate: 'Leaderboard End Date',
    walletPoints: 'Wallet Connection Points',
    tweetUrl: 'Twitter Tweet ID',
    retweetPoints: 'Twitter Retweet Points',
    settingsId: 'Settings ID',
  };

  const getFieldType = (key) => {
    if (key === 'tweetUrl') {
      return 'text';
    }
    return 'number';
  };

  return (
    <div className='md:col-span-2 w-full block'>
      {initialValues ? (
        <Formik
          initialValues={initialValues}
          onSubmit={saveRewards}
          validationSchema={validationSchema}
        >
          {({ setFieldValue, values }) => (
            <Form className='md:col-span-2 w-full block'>
              <div className='grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 rewardsCol'>
                {Object.keys(initialValues).map((key) => (
                  <div className='sm:col-span-3' key={key}>
                    {key === 'settingsId' ? (
                      <div></div>
                    ) : (
                      <label
                        htmlFor={key}
                        className='block text-sm font-medium leading-6 text-white'
                      >
                        {titles[key]}
                      </label>
                    )}

                    {key === 'leaderboardStartDate' ||
                    key === 'leaderboardEndDate' ? (
                      <DatePicker
                        selected={values[key]}
                        onChange={(date) => setFieldValue(key, date)}
                        dateFormat='dd-MM-yyyy'
                        className='mt-2 px-3 block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-white sm:text-sm sm:leading-6'
                      />
                    ) : key === 'settingsId' ? (
                      <div></div>
                    ) : key === 'tweetUrl' ? (
                      <div className='relative'>
                        <span className='text-white/70 absolute left-2 top-[.6rem] text-base'>
                          x.com/droppgroup/status/
                        </span>
                        <Field
                          type={getFieldType(key)}
                          name={key}
                          id={key}
                          placeholder={`Enter Tweet Id`}
                          className='mt-2 px-3 block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-white sm:text-sm sm:leading-6 pl-[12rem]'
                        />
                      </div>
                    ) : (
                      <Field
                        type={getFieldType(key)}
                        name={key}
                        id={key}
                        placeholder={`Enter ${key}`}
                        className='mt-2 px-3 block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-white sm:text-sm sm:leading-6'
                      />
                    )}
                    <ErrorMessage
                      name={key}
                      component='div'
                      className='text-red-600 pt-4'
                    />
                  </div>
                ))}
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
                    <p>Update Settings</p>
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      ) : (
        <div className='md:col-span-2 w-full block'>
          <div role='status' className='flexCenter'>
            <svg
              aria-hidden='true'
              className='w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-white'
              viewBox='0 0 100 101'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                fill='currentColor'
              />
              <path
                d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                fill='currentFill'
              />
            </svg>
            <span className='sr-only'>Loading...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RewardsForm;
