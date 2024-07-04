import LoadingSvg from '@/components/common/LoadingSvg';
import React, { useState, useRef } from 'react';
import { toast } from 'react-toastify';

export default function UpdateJobAsset({
  onUploadAdminAsset,
  setLoading,
  type,
}) {
  const fileInputRef = useRef();

  const handleFiles = (file) => {
    setLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      setLoading(false);
      onUploadAdminAsset(file);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFiles(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (type === 'digital' || type === 'avatar') {
      // Only allow mp4 videos for 'digital' type
      if (file?.type?.startsWith('video/mp4')) {
        handleFiles(file);
      } else {
        toast.error('Please upload an MP4 video file.');
      }
    } else {
      // Only allow .glb files for other types
      if (file.name.endsWith('.glb')) {
        handleFiles(file);
      } else {
        toast.error('Please upload a .glb file.');
      }
    }
  };

  const openFileDialog = () => {
    fileInputRef.current.click();
  };
  return (
    <>
      <div className='pl-0 pr-2 md:px-5 pb-1 my-3 md:mt-10 text-white'>
        <div>
          <div className='flex space-x-2 items-start'>
            <div className='text-white flex justify-center items-center uppercase rounded-[1.4rem] w-8 md:w-10 flex-30 md:flex-48'>
              <img
                src='/assets/images/chat/ai.png'
                alt='AiImage'
                className='w-8 md:w-10'
              />
            </div>
            <div className='w-full flex-1 relative'>
              <div className=' p-6 md:p-14 relative bg-no-repeat bg-cover bgGrayImage rounded-xl'>
                <div className=' absolute top-2 right-2 md:top-3 md:right-3 cursor-pointer'>
                  <img
                    src='/assets/images/chat/info.svg'
                    className=' w-4 h-4 md:w-7 md:h-7 hidden'
                  />
                </div>
                <div
                  className='flex justify-center items-center cursor-pointer uploadJobAsset'
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={openFileDialog}
                >
                  <div className='flex flex-col items-center'>
                    <input
                      type='file'
                      accept={type === 'product' ? '.glb' : 'video/*'}
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className='hidden'
                    />
                    <img
                      src='/assets/images/auth/upload.png'
                      alt='upload'
                      className=' w-20 h-20 md:w-28 md:h-28  mx-auto'
                    />
                    <p className='pt-5'>Upload assets here...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
