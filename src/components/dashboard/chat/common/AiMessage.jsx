import React from 'react';

export default function AiMessage({ message }) {
  return (
    <div className='pl-0 pr-2 md:px-5 pb-1 mt-3 md:mt-10'>
      <div>
        <div className=' flex space-x-2'>
          <div className='text-white flex justify-center items-center uppercase rounded-[1.4rem] w-8 md:w-12 mr-2 flex-30 md:flex-48'>
            <img
              src='/chat/ai.png'
              alt='AiImage'
              className='w-8 md:w-12'
            />
          </div>
          <div className='bg-[#5f6369] text-white w-full p-2 md:p-4 rounded-xl leading-6 flex-1'>
            <div>{message}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
