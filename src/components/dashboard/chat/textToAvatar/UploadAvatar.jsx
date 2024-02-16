import Image from 'next/image';
import React, { useState, useRef, useEffect } from 'react';
import PhotoRequirementsPopup from '../../../common/PhotoRequirementsPopup';
import { toast } from 'react-toastify';
export default function UploadAvatar({ onUploadAvatar }) {
  const [mediaList, setMediaList] = useState([]);
  const [showUploader, setShowUploader] = useState(true);
  const [showPhotoRequirement, setShowPhotoRequirement] = useState(false);
  const [fileSaved, setFileSaved] = useState(true);
  const fileInputRef = useRef();
  const requirementsRef = useRef(null);

  const handleFiles = async (files) => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      reader.onload = async (e) => {
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
          toast.error('Image size must be less than 10MB.');
          setFileSaved(false);
        } else {
          setFileSaved(true);
      
          var image = document.createElement('img');
          image.src = e.target.result;
          image.onload = async function () {
            var height = this.height;
            var width = this.width;
            if (height < 200 || width < 200) {
              toast.error('Image dimensions must be at least 200x200 pixels.');
              setFileSaved(false);
            } else {
              const media = {
                id: Date.now(),
                dataURL: e.target.result,
              };
              setMediaList((prevMediaList) => [...prevMediaList, media]);
              setShowUploader(false);
              onUploadAvatar(file);
            }
          };
        }
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

  const showPhotoRequirements = () => {
    setShowPhotoRequirement(!showPhotoRequirement)
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        requirementsRef.current &&
        !requirementsRef.current.contains(event.target)
      ) {
        setShowPhotoRequirement(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [requirementsRef]);
  return (
    <div className='pl-0 pr-2 md:px-5 pb-1 mt-3 md:mt-10 text-white avatarImageUpload'>
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
            <p className='pb-3 text-xs md:text-base'>
              Sure thing! Please upload your image below:
            </p>
            <div className=' p-5 md:p-14 relative bg-no-repeat bg-cover bgGrayImage rounded-2xl'>
              <div className=' absolute top-2 right-2 md:top-3 md:right-3 cursor-pointer' ref={requirementsRef}>
                <img
                  src='/assets/images/chat/info.svg'
                  className=' w-4 h-4 md:w-7 md:h-7'
                  onClick={(showPhotoRequirements)}
                />
              </div>

              {showPhotoRequirement && (
                <PhotoRequirementsPopup />
              )}

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
                      <svg
                        className=' w-12 h-12 md:w-24 md:h-24'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='#D9D9D9'
                        viewBox='0 0 24 24'
                        stroke-width='1.5'
                        stroke='#D9D9D9'
                      >
                        <path
                          stroke-linecap='round'
                          stroke-linejoin='round'
                          d='M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z'
                        />
                      </svg>
                    </span>
                    <p className='pt-5 text-xs md:text-base'>Upload Your Image</p>
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
                    <p className=' text-gray-800 pt-5 text-xs md:text-base'>
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
