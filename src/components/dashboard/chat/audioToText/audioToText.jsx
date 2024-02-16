import React, { useState, useRef } from 'react';
import useChatApiHook from '@/hooks/chatApi/useChatApiHook';
import RadioBox from './radioBox';
import SelectLanguage from './selectLanguage';

export default function AudioToText({ onUploadVoiceForText, onLanguageSelect ,data}) {
  const [media, setMedia] = useState([]);
  const [showUploader, setShowUploader] = useState(false);
  const [showUploadedFile, setShowUploadedFile] = useState(false);
  const [uploadFile, setUploadFile] = useState(false);
  const fileInputRef = useRef();

  const handleFiles = (files) => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      reader.onload = async (e) => {
        const audioBlob = new Blob([e.target.result], { type: 'audio/mp3' });
        const audioDataURL = URL.createObjectURL(audioBlob);

        const audio = new Audio();
        audio.src = audioDataURL;

        audio.onloadedmetadata = () => {
          const media = {
            id: Date.now(),
            audioURL: audioDataURL,
            fileName: file.name,
            fileSize: file.size,
            duration: audio.duration,
          };
          setMedia(media);
          setUploadFile(true);
          setShowUploader(false);
          setShowUploadedFile(true)
          onUploadVoiceForText(files[0]);
          
        };
      };

      reader.readAsArrayBuffer(file);
    }
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

  const handleLanguageChange = (language) => {
    if(language != null)
    {
      onLanguageSelect(language);
      setShowUploadedFile(false)
      setShowUploader(true)
    }
  }
  
  function formatDuration(duration) {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds}`;
  }

  function formatFileSize(size) {
    const fileSizeInKB = size / 1024;
    return `${fileSizeInKB.toFixed(2)} KB`;
  }

  return (
    <div className='pl-0 pr-2 md:px-5 pb-1 mt-3 md:mt-10 text-white avatarAudioUpload'>
      <div>
        <div className=' flex space-x-2'>
          <div className='text-white flex justify-center items-start uppercase w-8 md:w-12 mr-2 flex-30 md:flex-48'>
            <img
              src='/assets/images/chat/ai.png'
              alt='AiImage'
              className='w-8 md:w-12'
            />
          </div>
          <div className='w-full flex-1'>
            <p className='pb-3 text-xs md:text-base'>Upload your voice</p>
            <div className=' p-10 relative bg-no-repeat bg-cover bgGrayImage rounded-2xl min-h-48'>
              {data.isDone && <div className='absolute left-0 right-0 bottom-0 top-0 bg-black/5 z-20'></div>}

              <SelectLanguage onLanguageChange={handleLanguageChange}/>
              

              {showUploader && (
                <div
                  className='flex relative justify-center items-center cursor-pointer bg-white bg-opacity-5 rounded-lg dashedBorder p-10 md:p-16'
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={openFileDialog}
                >
                  <div className=' absolute top-2 right-2 md:top-3 md:right-3 cursor-pointer'>
                    <img
                      src='/assets/images/chat/info.svg'
                      className=' w-4 h-4 md:w-7 md:h-7'
                    />
                  </div>

                  <div className=' absolute top-2 left-2 md:top-4 md:left-4 cursor-pointer'>
                    <p className='text-xs md:text-base'>Upload Voice</p>
                  </div>

                  <div className='flex flex-col items-center'>
                    <input
                      type='file'
                      accept='audio/mp3'
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className='hidden'
                    />
                    <span className=' w-24 h-24 flexCenter bgDarkGray rounded-full'>
                      <svg
                        className=' w-11 h-11'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='#D9D9D9'
                        viewBox='0 0 24 24'
                        strokeWidth='1.5'
                        stroke='#D9D9D9'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z'
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              )}

              {showUploadedFile && (
                <div className='media-container w-full text-left  bg-white bg-opacity-5 rounded-lg dashedBorder p-6'>
                  <p className='text-xs md:text-base'>Voice Uploaded</p>
                  {media && (
                    <div className='media-item w-full inline-block rounded-md relative pl-5'>
                      <div className='flex flex-col'>
                        <p className=' items-center flex pt-4'>
                          <svg
                            className='w-8 h-8'
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                            strokeWidth='1.5'
                            stroke='currentColor'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              d='M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
                            />
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              d='M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z'
                            />
                          </svg>
                          <span className=' inline-block pl-2 text-white text-opacity-80 text-sm'>
                            {formatFileSize(media.fileSize)} - {' '}
                            {formatDuration(media.duration)} - {media.fileName}
                          </span>
                        </p>

                        
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
      
          </div>
        </div>
      </div>
    </div>
  );
}
