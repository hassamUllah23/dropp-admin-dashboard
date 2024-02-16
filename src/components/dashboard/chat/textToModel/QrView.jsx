import React from 'react';

export default function QrView() {
  return (
    <div className='pl-0 pr-2 md:px-5 pb-1  mt-3 md:mt-10'>

        <div className=' flex space-x-2'>
          <div className='justify-center items-center w-8 h-2 md:w-12 mr-2'>
              <span className='w-8 h-2 md:w-12'> </span>
            </div>
          <p className='text-base text-white mb-3'>
            Scan QR code to enter your webXR experience.
          </p>
        </div>

      <div>
        <div className='flex space-x-2'>
          <div className='text-white flex justify-center items-start uppercase rounded-[1.4rem] w-8 md:w-12 mr-2 flex-30 md:flex-48'>
            <img src='/chat/ai.png' alt='AiImage' className='w-8 md:w-12' />
          </div>
          <div className='w-full flex-1'>
            <div className='w-full bg-no-repeat bg-cover bgGrayImage p-2 md:p-10 rounded-xl flexCenter'>
              <img src='/chat/QR.jpg' className=' p-3 max-w-28 md:max-w-80' />
            </div>
            <div className=' flex justify-start gap-2 h-5 mt-2'>
              <img src='/chat/doc.png' className=' w-5 h-5 cursor-pointer' />
              <img src='/chat/thumb_up.png' className=' w-5 h-5 cursor-pointer' />
              <img src='/chat/thumb_down.png' className=' w-5 h-5 cursor-pointer' />
              <img src='/chat/reset.png' className=' w-5 h-5 cursor-pointer'/>
              <img src='/chat/comment.png' className=' w-5 h-5 cursor-pointer' />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
