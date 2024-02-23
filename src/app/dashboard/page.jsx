'use client';
import React, { useState, useEffect, useCallback} from 'react';
import SingleJob from '@/components/dashboard/SingleJob';
import useApiHook from '@/hooks/useApiHook';
export default function Dashboard() {
  const { handleApiCall, isApiLoading } = useApiHook();
  const [allJobs, setAllJobs] = useState([]);
  let url ="/jobs/all/admin";
  
  const loadJobs = async () => {
    const result = await handleApiCall({
      method: 'GET',
      url: url,
    });
    
    setAllJobs(result?.data?.jobs);
  };
  
  useEffect(() => {
    loadJobs()
  }, []);

  return (
    <div className='p-2.5 pt-4 md:pt-10 max-w-screen-3xl h-fu w-full m-auto flex flex-col min-w-80 z-10 text-white'>
      <div className='flex justify-end mb-2 md:mb-5 pr-3 md:pr-10'>
        <button className=' text-sm px-5 lightGrayBg leading-10 rounded-2xl flexCenter'>
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

      <div className='grid grid-col-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  px-3 md:px-10 py-3 gap-4 md:gap-6'>
        {[...allJobs]?.reverse()?.map((job) => (
          <SingleJob key={job._id} jobKeys={job}/>
        ))}
      </div>
    </div>
  );
}
