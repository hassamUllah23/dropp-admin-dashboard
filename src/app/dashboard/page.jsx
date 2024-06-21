'use client';
import React, { useState, useEffect, useMemo } from 'react';
import SingleJob from '@/components/dashboard/SingleJob';
import useApiHook from '@/hooks/useApiHook';
import { RotatingLines } from 'react-loader-spinner';
import { useSelector } from '@/lib';

export default function Dashboard() {
  const { handleApiCall, isApiLoading } = useApiHook();
  const [allJobs, setAllJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [pageSize, setPageSize] = useState(12);
  const [showLoader, setShowLoader] = useState(false);
  const notifications = useSelector(
    (state) => state.notification.notifications
  );
  let url = `/jobs/all/admin?page=${page}&pageSize=${pageSize}`;

  const loadJobs = async () => {
    await handleApiCall({
      method: 'GET',
      url: url,
    })
      .then((res) => {
        if (res.status === 200) {
          setAllJobs(res?.data?.jobs);
          calculatePageCount(res?.data?.count);
        }
        return res;
      })
      .catch((error) => {
        //toast.error(error?.response?.data?.errors);
      });
  };

  const calculatePageCount = async (count) => {
    setCount(count);
    setPageCount(Math.ceil(count / pageSize));
  };

  const handlePageSizeChange = (newPage) => {
    setPage(newPage);
    setShowLoader(true);
  };

  // const pageOptions = useMemo(() => {
  //   const roundedTotal = Math.ceil(count / pageSize);

  //   return Array.from({ length: roundedTotal }, (_, index) => (index + 1) * 10);
  // }, [count, pageSize]);

  useEffect(() => {
    loadJobs().then(() => setShowLoader(false));
  }, []);

  useEffect(() => {
    loadJobs().then(() => setShowLoader(false));
  }, [page, pageSize]);

  useEffect(() => {
    console.log('received socket notification');
    loadJobs();
  }, [notifications]);

  return (
    <div className='p-2.5 pt-4 md:pt-10 max-w-screen-3xl h-fu w-full m-auto flex flex-col min-w-80 z-10 text-white'>
      <div className='flex justify-end mb-2 md:mb-5 pr-3 md:pr-10'>
        <button className=' text-sm px-5 lightGrayBg leading-10 rounded-2xl hidden'>
          <svg
            width='24'
            height='24'
            className='w-6 h-6 mr-2'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth='1.5'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z'
            />
          </svg>
          <span>Filters</span>
        </button>
      </div>
      <div className='grid grid-cols-3 gap-x-4 items-center md:px-5 mx-3 md:mx-5 mb-2'>
        <div>
          <span className='text-base leading-5'>
            Page {page} - {pageCount} of {count}
          </span>
        </div>
        <div className='flex justify-center'>
          {showLoader && (
            <RotatingLines
              height='28'
              width='28'
              color='blue'
              strokeWidth='5'
              animationDuration='0.75'
              ariaLabel='rotating-lines-loading'
            />
          )}
        </div>
        <div className='flex justify-end'>
          {page > 1 && (
            <button
              className='text-sm px-3 lightGrayBg leading-8 rounded-xl flexCenter hover:bg-white hover:text-black'
              onClick={() => handlePageSizeChange(page - 1)}
              disabled={page === 1}
            >
              Previous
            </button>
          )}
          {page < pageCount && (
            <button
              className='text-sm px-3 lightGrayBg leading-8 rounded-xl flexCenter ml-2 hover:bg-white hover:text-black'
              onClick={() => handlePageSizeChange(page + 1)}
            >
              Next
            </button>
          )}
        </div>
      </div>
      <div className='grid grid-col-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  px-3 md:px-10 py-3 gap-4 md:gap-6'>
        {allJobs?.map((job) => (
          <SingleJob key={job._id} jobKeys={job} />
        ))}
      </div>
      {/* <div className='flex justify-end items-center px-5 mx-5'>
        <select
          value={pageSize}
          onChange={(e) => {
            setPage(1);
            setPageSize(Number(e.target.value));
          }}
          className='text-sm p-2 lightGrayBg leading-10 rounded-2xl flexCenter mr-2 justify-center'
        >
          {pageOptions.map((size, index) => (
            <option key={index} value={size}>
              {size}
            </option>
          ))}
        </select>
        per page
      </div> */}
    </div>
  );
}
