import React, { useState, useRef } from 'react';
import useChatApiHook from '@/hooks/chatApi/useChatApiHook';

export default function UploadAvatarForModal({ onUploadImageForModel }) {
  const [mediaList, setMediaList] = useState([]);
  const [showUploader, setShowUploader] = useState(true);
  const { handleChatApiCall, isChatApiLoading } = useChatApiHook();
  const fileInputRef = useRef();
  const handleFiles = (files) => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      reader.onload = async (e) => {
        const media = {
          id: Date.now(),
          dataURL: e.target.result,
        };
        setMediaList((prevMediaList) => [...prevMediaList, media]);
        setShowUploader(false);

        onUploadImageForModel(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveMedia = (id) => {
    setMediaList((prevMediaList) => {
      const removedMedia = prevMediaList.find((media) => media.id === id);
      return prevMediaList.filter((media) => media.id !== id);
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleFileChange = (e) => {
    handleFiles(e.target.files);
  };

  const openFileDialog = () => {
    fileInputRef.current.click();
  };

  return (
    <div className='pl-0 pr-2 md:px-5 pb-1 mt-3 md:mt-10 text-white modelUpload'>
      <div>
        <div className=' flex space-x-2'>
          <div className='text-white flex justify-center items-start uppercase  w-8 md:w-12 mr-2  flex-30 md:flex-48'>
            <img
              src='/assets/images/chat/ai.png'
              alt='AiImage'
              className='w-8 md:w-12'
            />
          </div>
          <div className='w-full flex-1'>
            <p className='pb-3 text-base'>
              Sure thing! Please upload your image below:
            </p>
            <div className=' p-3 md:p-14 relative bg-no-repeat bg-cover bgGrayImage rounded-2xl'>
              <div className=' absolute top-2 right-2 md:top-3 md:right-3 cursor-pointer'>
                <img
                  src='/assets/images/chat/info.svg'
                  className=' w-4 h-4 md:w-7 md:h-7'
                />
              </div>

              {showUploader && (
                <div
                  className='flex justify-center items-center cursor-pointer'
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={openFileDialog}
                >
                  <div className='flex flex-col items-center'>
                    <input
                      type='file'
                      accept='image'
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className='hidden'
                    />
                    <span className=' w-20 h-20 md:w-36 md:h-36 flexCenter bgDarkGray rounded-full'>
                      <svg className=' w-12 h-12 md:w-24 md:h-24' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                      </svg>

                    </span>
                    <p className='pt-5'>Upload Your Image</p>
                  </div>
                </div>
              )}

              <div className='media-container max-w-[32rem] m-auto text-center'>
                {mediaList.map((media, index) => (
                  <div
                    key={index}
                    className='media-item inline-block w-full relative flexCenter flex-col'
                  >
                    <img
                      src={media.dataURL}
                      alt='uploaded-img'
                      className='w-20 h-20 md:w-36 md:h-36 rounded-full object-cover '
                    />
                    <p className=' text-gray-800 pt-5 text-base'>
                      Image Uploaded
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
