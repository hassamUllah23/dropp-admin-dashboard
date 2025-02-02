'use client';
import React, { useState, useEffect, useRef } from 'react';
import JobOptions from './JobOptions';
import { useDispatch, selectAuth, useSelector } from '@/lib';
import { useRouter } from 'next/navigation';
import { setJob } from '@/lib/slices/job/jobActions';
import LoadingSvg from '../common/LoadingSvg';
import useApiHook from '@/hooks/useApiHook';
import UpdateJobStatus from './updateJobStatus';
import { toast } from 'react-toastify';

export default function SingleJob({ jobKeys }) {
  const { handleApiCall } = useApiHook();
  const [showJobOptions, setShowJobOptions] = useState(false);
  const [showAssignTaskPopup, setShowAssignTaskPopup] = useState(false);
  const [jobStatus, setJobStatus] = useState(jobKeys.status);
  const [showJobStatus, setShowJobStatus] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const jobOptionsRef = useRef(null);
  const assignTaskPopupRef = useRef(null);
  const auth = useSelector(selectAuth);
  const router = useRouter();
  let isAdmin = auth?.userInfo?.user?.role;
  const dispatch = useDispatch();

  let jobId = jobKeys.id;
  const createdAt = new Date(jobKeys.createdAt);
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(createdAt);

  const showStatuses = () => {
    setShowJobStatus(!showJobStatus);
  };

  const handleStatusClick = async (status) => {
    setShowLoading(true);
    setShowJobStatus(false);
    const result = await handleApiCall({
      method: 'PUT',
      url: `/jobs/${jobId}/update-status/`,
      data: { status: status, jobId: jobId },
    })
    .then((res) => {
      if (res.status === 200) {
        setJobStatus(status);
        setShowJobStatus(false);
      }
      return res;
    })
    .catch((error) => {
      toast.error(error?.response?.data?.errors);
    }).finally(() => setShowLoading(false));
  };

  const routeToJob = () => {
    if (isAdmin === 'admin') {
      if (jobKeys.status == 'completed') {
        dispatch(setJob(true, jobId, jobKeys?.outputs[0]?.url));
      } else {
        dispatch(setJob(true, jobId, null));
      }
    }
    router.push(`/dashboard/job/${jobKeys.id}`);
  };

  const showArtifacts = () => {};

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        jobOptionsRef.current &&
        !jobOptionsRef.current.contains(event.target)
      ) {
        setShowJobOptions(false);
      }
      if (
        assignTaskPopupRef.current &&
        !assignTaskPopupRef.current.contains(event.target)
      ) {
        setShowAssignTaskPopup(false);
        setShowJobStatus(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [jobOptionsRef, assignTaskPopupRef]);

  return (
    <div
      className={` w-full rounded-2xl p-5 relative font-bold ${
        jobKeys.platform == 'aramco'
          ? '  bg-[#E6E6E6] text-black'
          : 'darkGrayBg'
      }`}
    >
      <div className='flex flex-col' ref={jobOptionsRef}>
        <div
          className={`flex items-center justify-between  border-b pb-4 ${
            jobKeys.platform == 'aramco'
              ? ' border-lightGray-100'
              : 'border-black'
          }`}
        >
          <div className='w-max flex items-center'>
            {jobKeys.platform == 'aramco' ? (
              <img
                src='/assets/images/dashboard/aramco.svg'
                alt='aramco'
                className='w-9 h-9 rounded-3xl'
              />
            ) : (
              <span className='btn-Gradient w-9 h-9 rounded-3xl flexCenter flex'>
                <svg
                  width='16'
                  height='16'
                  viewBox='0 0 16 16'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M2.11328 4.96001L7.99995 8.36667L13.8466 4.98001'
                    stroke='#0C0C0C'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M8 14.4067V8.36'
                    stroke='#0C0C0C'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M6.61993 1.65333L3.05993 3.62666C2.25326 4.07333 1.59326 5.19333 1.59326 6.11333V9.87999C1.59326 10.8 2.25326 11.92 3.05993 12.3667L6.61993 14.3467C7.37993 14.7667 8.62659 14.7667 9.38659 14.3467L12.9466 12.3667C13.7533 11.92 14.4133 10.8 14.4133 9.87999V6.11333C14.4133 5.19333 13.7533 4.07333 12.9466 3.62666L9.38659 1.64666C8.61993 1.22666 7.37993 1.22666 6.61993 1.65333Z'
                    stroke='#0C0C0C'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </span>
            )}

            <p
              onClick={routeToJob}
              className={`pl-1 cursor-pointer capitalize ml-3 ${
                jobKeys.platform == 'aramco'
                  ? 'text-black font-semibold'
                  : 'text-white font-medium'
              }`}
            >
              {jobKeys.user.name}
            </p>
          </div>
          {/* <span
            className=' w-6 text-right cursor-pointer relative'
            onClick={() => setShowJobOptions(!showJobOptions)}
          >
            {jobKeys.platform == 'aramco' ? (
              <svg
                width='2'
                height='18'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth='1.5'
                stroke='#C0C0C0'
                className='w-6 h-6'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z'
                />
              </svg>
            ) : (
              <svg
                width='2'
                height='18'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth='1.5'
                stroke='currentColor'
                className='w-6 h-6'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z'
                />
              </svg>
            )}

            {showJobOptions && <JobOptions jobStatus={status} />}
          </span> */}
        </div>

        <p
          className={`text-base ellipsis py-3 ${
            jobKeys.platform == 'aramco' ? ' font-semibold' : 'font-medium'
          }`}
        >
          {jobKeys.description?.length === 0 && <span className=' inline-block'></span>}
          {jobKeys.description?.length > 35
            ? `${jobKeys.description?.slice(0, 35)}...`
            : jobKeys.description + ' '}
        </p>

        <div className='flex items-center pb-3'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 16 16'
            fill='currentColor'
            className='w-4 h-4'
          >
            <path d='M5.75 7.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5ZM5 10.25a.75.75 0 1 1 1.5 0 .75.75 0 0 1-1.5 0ZM10.25 7.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5ZM7.25 8.25a.75.75 0 1 1 1.5 0 .75.75 0 0 1-1.5 0ZM8 9.5A.75.75 0 1 0 8 11a.75.75 0 0 0 0-1.5Z' />
            <path
              fillRule='evenodd'
              d='M4.75 1a.75.75 0 0 0-.75.75V3a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2V1.75a.75.75 0 0 0-1.5 0V3h-5V1.75A.75.75 0 0 0 4.75 1ZM3.5 7a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v4.5a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1V7Z'
              clipRule='evenodd'
            />
          </svg>
          <span className='text-xs pl-2 text-lightGray-200'>
            {formattedDate}
          </span>
        </div>

        <div
          className={`flex space-x-2 pb-4 border-b artifacts ${
            jobKeys.platform == 'aramco'
              ? ' border-lightGray-100'
              : 'border-black'
          }`}
        >
        {jobKeys.artifacts?.length === 0 && <span className=' block w-11 h-11 rounded-lg assignedClr'></span>}
          {jobKeys?.artifacts.slice(0, 3).map((artifacts, index) =>
            artifacts?.type === 'image' ? (
              <img
                key={index}
                src={artifacts.url}
                className='w-11 h-11 rounded-lg'
                alt='Image'
              />
            ) : artifacts?.type === 'video' ? (
              <span
                key={index}
                className={`flexCenter w-11 h-11 rounded-lg ${
                  jobKeys.platform == 'aramco'
                    ? ' bgLightGray clrDarkGray'
                    : 'lightGrayBg'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
              </span>
            ) : (
              <span
                key={index}
                className={`flexCenter w-11 h-11 rounded-lg ${
                  jobKeys.platform == 'aramco'
                    ? ' bgLightGray clrDarkGray'
                    : 'lightGrayBg'
                }`}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth='1.5'
                  stroke='currentColor'
                  className='w-6 h-6'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z'
                  />
                </svg>
              </span>
            )
          )}

          {jobKeys?.artifacts?.length > 3 && (
            <button
              onClick={showArtifacts}
              className={`w-11 h-11 rounded-lg inline-block flexCenter text-base font-semibold ${
                jobKeys.platform === 'aramco'
                  ? 'bgLightGray clrDarkGray'
                  : 'lightGrayBg'
              }`}
            >
              +{Math.min(jobKeys.artifacts.length - 3)}
            </button>
          )}
        </div>
        {showLoading ? (
          <div className='flexCenter pt-5 relative loadingArea'>
            {jobKeys.platform == 'aramco' ? (
              <LoadingSvg color={'#333333'} />
            ) : (
              <LoadingSvg color={'#ffffff'} />
            )}
          </div>
        ) : (
          <div
            className='flex items-center pt-4 justify-between relative yessss'
            ref={assignTaskPopupRef}
          >
            <UpdateJobStatus
              jobKeys={jobKeys}
              showJobStatus={showJobStatus}
              jobStatus={jobStatus}
              handleStatusClick={handleStatusClick}
              setShowJobStatus={setShowJobStatus}
              isFromDashboard={true}
            />
            <div className='flex items-center'>
              <div className=' relative flex space-x-1 jobOptions'>
                <button
                  title='Sell'
                  className={` ${
                    jobStatus != 'completed' && jobKeys.platform == 'aramco'
                      ? 'bgLightGray'
                      : jobStatus == 'completed'
                      ? 'lightGrayBg'
                      : 'bg-gray-100'
                  } w-7 h-7 md:w-6 md:h-6 rounded-full flexCenter`}
                >
                  <svg
                    width='12'
                    height='12'
                    viewBox='0 0 16 16'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M12.3332 8.43333V10.9C12.3332 12.98 10.3932 14.6667 7.99984 14.6667C5.6065 14.6667 3.6665 12.98 3.6665 10.9V8.43333C3.6665 10.5133 5.6065 12 7.99984 12C10.3932 12 12.3332 10.5133 12.3332 8.43333Z'
                      stroke={jobStatus == 'completed' ? 'white' : 'gray'}
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                    <path
                      d='M12.3332 5.1C12.3332 5.70667 12.1665 6.26666 11.8732 6.74666C11.1598 7.92 9.69317 8.66667 7.99984 8.66667C6.3065 8.66667 4.83984 7.92 4.12651 6.74666C3.83317 6.26666 3.6665 5.70667 3.6665 5.1C3.6665 4.06 4.15317 3.12 4.93317 2.44C5.71983 1.75333 6.79984 1.33333 7.99984 1.33333C9.19984 1.33333 10.2798 1.75333 11.0665 2.43333C11.8465 3.12 12.3332 4.06 12.3332 5.1Z'
                      stroke={jobStatus == 'completed' ? 'white' : 'gray'}
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                    <path
                      d='M12.3332 5.1V8.43333C12.3332 10.5133 10.3932 12 7.99984 12C5.6065 12 3.6665 10.5133 3.6665 8.43333V5.1C3.6665 3.02 5.6065 1.33333 7.99984 1.33333C9.19984 1.33333 10.2798 1.75333 11.0665 2.43333C11.8465 3.12 12.3332 4.06 12.3332 5.1Z'
                      stroke={jobStatus == 'completed' ? 'white' : 'gray'}
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                </button>
                <button
                  title='Share'
                  className={` ${
                    jobStatus != 'completed' && jobKeys.platform == 'aramco'
                      ? 'bgLightGray'
                      : jobStatus == 'completed'
                      ? 'lightGrayBg'
                      : 'bg-gray-100'
                  } w-7 h-7 md:w-6 md:h-6 rounded-full flexCenter`}
                >
                  <svg
                    width='12'
                    height='12'
                    viewBox='0 0 16 16'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M11.3066 4.11333C12.64 5.04 13.56 6.51333 13.7466 8.21333'
                      stroke={jobStatus == 'completed' ? 'white' : 'gray'}
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                    <path
                      d='M2.32666 8.24667C2.49999 6.55333 3.40666 5.08 4.72666 4.14667'
                      stroke={jobStatus == 'completed' ? 'white' : 'gray'}
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                    <path
                      d='M5.45996 13.96C6.23329 14.3533 7.11329 14.5733 8.03996 14.5733C8.93329 14.5733 9.77329 14.3733 10.5266 14.0067'
                      stroke={jobStatus == 'completed' ? 'white' : 'gray'}
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                    <path
                      d='M8.03986 5.13333C9.06343 5.13333 9.89319 4.30357 9.89319 3.28C9.89319 2.25643 9.06343 1.42667 8.03986 1.42667C7.01629 1.42667 6.18652 2.25643 6.18652 3.28C6.18652 4.30357 7.01629 5.13333 8.03986 5.13333Z'
                      stroke={jobStatus == 'completed' ? 'white' : 'gray'}
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                    <path
                      d='M3.22003 13.28C4.2436 13.28 5.07337 12.4502 5.07337 11.4267C5.07337 10.4031 4.2436 9.57333 3.22003 9.57333C2.19646 9.57333 1.3667 10.4031 1.3667 11.4267C1.3667 12.4502 2.19646 13.28 3.22003 13.28Z'
                      stroke={jobStatus == 'completed' ? 'white' : 'gray'}
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                    <path
                      d='M12.7801 13.28C13.8037 13.28 14.6334 12.4502 14.6334 11.4267C14.6334 10.4031 13.8037 9.57333 12.7801 9.57333C11.7565 9.57333 10.9268 10.4031 10.9268 11.4267C10.9268 12.4502 11.7565 13.28 12.7801 13.28Z'
                      stroke={jobStatus == 'completed' ? 'white' : 'gray'}
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                </button>
                <button
                  title='Export'
                  className={` ${
                    jobStatus != 'completed' && jobKeys.platform == 'aramco'
                      ? 'bgLightGray'
                      : jobStatus == 'completed'
                      ? 'lightGrayBg'
                      : 'bg-gray-100'
                  } w-7 h-7 md:w-6 md:h-6 rounded-full flexCenter`}
                >
                  <svg
                    width='12'
                    height='12'
                    viewBox='0 0 16 16'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M6.21338 4.33333L7.92005 2.62667L9.62671 4.33333'
                      stroke={jobStatus == 'completed' ? 'white' : 'gray'}
                      strokeMiterlimit='10'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                    <path
                      d='M7.91992 9.45333V2.67333'
                      stroke={jobStatus == 'completed' ? 'white' : 'gray'}
                      strokeMiterlimit='10'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                    <path
                      d='M2.6665 8C2.6665 10.9467 4.6665 13.3333 7.99984 13.3333C11.3332 13.3333 13.3332 10.9467 13.3332 8'
                      stroke={jobStatus == 'completed' ? 'white' : 'gray'}
                      strokeMiterlimit='10'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
