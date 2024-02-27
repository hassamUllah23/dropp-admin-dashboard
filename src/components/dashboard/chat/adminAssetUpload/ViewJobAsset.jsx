import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from '@/lib';
import { setJob } from '@/lib/slices/job/jobActions';
import Avatar from 'react-avatar';
import Script from 'next/script';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import Link from 'next/link';

const ViewJobAsset = ({ user, artifacts, url, type, description }) => {
  const [uploadedVideoCount] = useState(!!url ? 1 : 0);
  const [savedVideos, setSavedVideos] = useState(null);
  const { output } = useSelector((state) => state.job);
  const dispatch = useDispatch();
  const handleVideoDownload = () => {
    const anchor = document.createElement('a');
    if (savedVideos !== null) {
      anchor.href = savedVideos;
    } else {
      anchor.href = url;
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
  const handleUserInput = () => {
    const zip = new JSZip();

    const fetchAndAddToZip = (item) => {
      let urlArray = item.url?.split('/');

      return fetch(item.url)
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              `Failed to fetch ${item.type}: ${response.statusText}`
            );
          }
          return response.blob();
        })
        .then((blob) => {
          zip.file(urlArray[urlArray.length - 1], blob);
        })
        .catch((error) => console.error(error));
    };

    const fetchAndAddPromises = artifacts?.map(fetchAndAddToZip);
    Promise.all(fetchAndAddPromises)
      .then(() => {
        zip.generateAsync({ type: 'blob' }).then((content) => {
          saveAs(content, 'files.zip');
        });
      })
      .catch((error) => console.error(error));
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
              <Avatar name={user?.name} round='50px' size='60' />
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
                  </div>
                )}
                {artifacts?.length > 0 && (
                  <div className='mb-5'>
                    {type === 'video' && (
                      <>
                        <h1 className='text-md md:text-xl mb-3 font-bold'>
                          User's Script:
                        </h1>
                        <p className='pb-6'>{description}</p>
                      </>
                    )}
                    <h1 className='text-md md:text-xl mb-5 font-bold'>
                      User's Input:
                    </h1>

                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
                      {artifacts.map((item) => {
                        return (
                          <>
                            {item?.type === 'image' && (
                              <div>
                                <img
                                  src={item?.url}
                                  alt='artifact'
                                  className='w-full rounded-md object-cover h-36'
                                />
                              </div>
                            )}
                            {item?.type === 'audio' && (
                              <Link
                                href={item.url}
                                target='_blank'
                                className='flexCenter border flex w-full h-full rounded-md lightGrayBg'
                              >
                                <svg
                                  xmlns='http://www.w3.org/2000/svg'
                                  fill='none'
                                  viewBox='0 0 24 24'
                                  strokeWidth='1.5'
                                  stroke='currentColor'
                                  className='w-14 h-36'
                                >
                                  <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    d='M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z'
                                  />
                                </svg>
                              </Link>
                            )}
                          </>
                        );
                      })}
                      <div className='lightGrayBg flexCenter border w-full rounded-md'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='20'
                          height='20'
                          viewBox='0 0 24 24'
                          fill='none'
                          onClick={() => handleUserInput()}
                          className='cursor-pointer w-14 h-36'
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
                    </div>
                  </div>
                )}
                {url && (
                  <div className='mt-10 mb-5 text-md md:text-xl font-bold'>
                    <h1>Assets:</h1>
                  </div>
                )}
                <div className='media-container max-w-[32rem] m-auto text-center'>
                  {type === 'video' ? (
                    <div className='media-item inline-block mx-2 my-1 md:mx-3 md:my-3 rounded-md relative'>
                      <video
                        controls
                        className=' max-w-56 md:max-w-96 rounded-md object-cover '
                      >
                        <source src={url} type='video/mp4' />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  ) : (
                    <div className='w-full glbModal'>
                      {url && (
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
                      )}
                    </div>
                  )}
                </div>
              </div>
              {uploadedVideoCount !== 0 && (
                <div className='flex justify-start gap-2 h-5 mt-2 mb-4'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='20'
                    height='20'
                    viewBox='0 0 24 24'
                    fill='none'
                    onClick={() => {
                      if (savedVideos !== null || uploadedVideoCount > 0) {
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
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewJobAsset;
