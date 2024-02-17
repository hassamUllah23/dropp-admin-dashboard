import LoadingSvg from '@/components/common/LoadingSvg';
import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from '@/lib';
import { setJob } from '@/lib/slices/job/jobActions';
import Script from 'next/script';
export default function UpdateJobAsset({
  onUploadAdminAsset,
  index,
  url,
  message,
  type,
}) {
  const [videoUrl, setVideoUrl] = useState(url || '');
  const [uploadedVideoCount, setUploadedVideoCount] = useState(!!url ? 1 : 0);
  const [showLoading, setShowLoading] = useState(false);
  const fileInputRef = useRef();
  const [savedVideos, setSavedVideos] = useState(null);
  const { output } = useSelector((state) => state.job);

  const dispatch = useDispatch();

  const handleFiles = (file) => {
    setShowLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      setVideoUrl(e.target.result);
      setUploadedVideoCount((prevCount) => prevCount + 1);
      setShowLoading(false);
      onUploadAdminAsset(file);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveMedia = (id) => {
    setSavedVideos(null);
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
    console.log(file);
    handleFiles(file);
  };

  const openFileDialog = () => {
    fileInputRef.current.click();
  };

  const handleVideoDownload = () => {
    const anchor = document.createElement('a');
    if (savedVideos !== null) {
      anchor.href = savedVideos; 
    } else {
      anchor.href = videoUrl; 
    }
    anchor.download = 'video.mp4';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  const handleGlbDownload = () => {
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = '3d_model.glb';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  useEffect(() => {
    setSavedVideos(output);
    dispatch(setJob(false, null, null));
  }, []);
  return (
    <>
      <Script
        type='module'
        src='https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js'
      />
      <div className='pl-0 pr-2 md:px-5 pb-1 mt-3 md:mt-10 text-white'>
        <div>
          <div className=' flex space-x-2'>
            <div className='text-white flex justify-center items-start uppercase  w-8 md:w-12 mr-2'>
              <img
                src='/assets/images/chat/ai.png'
                alt='AiImage'
                className='w-8 md:w-12'
              />
            </div>
            <div className='w-full'>
              <div className=' p-3 md:p-14 relative bg-no-repeat bg-cover bgGrayImage rounded-xl'>
                <div className=' absolute top-2 right-2 md:top-3 md:right-3 cursor-pointer'>
                  <img
                    src='/assets/images/chat/info.svg'
                    className=' w-4 h-4 md:w-7 md:h-7'
                  />
                </div>

                {savedVideos != null && (
                  <div className='media-container max-w-[32rem] m-auto text-center relative uploadedVideo'>
                    <div className='media-item inline-block mx-2 my-1 md:mx-3 md:my-3 rounded-md relative'>
                      <video
                        controls
                        className=' max-w-56 md:max-w-96 rounded-md object-cover '
                      >
                        <source src={savedVideos} type='video/mp4' />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                    {/* <button
                      onClick={() => handleRemoveMedia()}
                      className="absolute top-2 right-2 cursor-pointer bg-transparent"
                    >
                      <img
                        src="/assets/images/chat/remove.png"
                        className=" w-3"
                      />
                    </button> */}
                  </div>
                )}
                {savedVideos == null && (
                  <div>
                    {showLoading ? (
                      <div className='flexCenter relative loadingArea py-16'>
                        <LoadingSvg color={'#fafafa'} />
                      </div>
                    ) : (
                      <div className='w-full'>
                        {uploadedVideoCount === 0 && (
                          <div
                            className='flex justify-center items-center cursor-pointer'
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onClick={openFileDialog}
                          >
                            <div className='flex flex-col items-center'>
                              <input
                                type='file'
                                accept='video/*,.glb'
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className='hidden'
                              />
                              <img
                                src='/assets/images/auth/upload.png'
                                alt='upload'
                                className=' w-28 h-28  mx-auto'
                              />
                              <p className='pt-5'>
                                {message || 'Upload assets here...'}
                              </p>
                            </div>
                          </div>
                        )}

                        <div className='media-container max-w-[32rem] m-auto text-center'>
                          {uploadedVideoCount > 0 &&
                            (type === 'video' ? (
                              <div className='media-item inline-block mx-2 my-1 md:mx-3 md:my-3 rounded-md relative'>
                                <video
                                  controls
                                  className=' max-w-56 md:max-w-96 rounded-md object-cover '
                                >
                                  <source src={videoUrl} type='video/mp4' />
                                  Your browser does not support the video tag.
                                </video>
                              </div>
                            ) : (
                              <div className='w-full glbModal'>
                                <model-viewer
                                  alt='3d modal'
                                  src={url}
                                  ar
                                  shadow-intensity='0.5'
                                  style={{ width: '100%', height: '385px' }}
                                  camera-controls
                                  auto-rotate-delay='2000'
                                  interaction-prompt='when-focused'
                                  interaction-policy='allow-when-focused'
                                  loading='eager'
                                  default-progress-bar
                                  touch-action='pan-y'
                                  autoplay
                                  animation-name='Running'
                                  ar-modes='webxr scene-viewer'
                                  camera-orbit='0deg 180deg 5m'
                                ></model-viewer>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              {uploadedVideoCount != 0 ? (
                <div className='flex justify-start gap-2 h-5 mt-2'>
              
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='20'
                    height='20'
                    viewBox='0 0 24 24'
                    fill='none'
                    onClick={() => {
                      if (savedVideos !== null) {
                        handleVideoDownload();
                      } else if (uploadedVideoCount > 0) {
                        handleVideoDownload();
                      } else {
                        handleGlbDownload();
                      }
                    }}
                    className='cursor-pointer'
                  >
                    <path
                      d='M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15'
                      stroke='#FFFFFF'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                    <path
                      d='M7 10L12 15L17 10'
                      stroke='#FFFFFF'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                    <path
                      d='M12 15V3'
                      stroke='#FFFFFF'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>

                </div>
              ) : null}
              
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
