import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from '@/lib';
import { setJob } from '@/lib/slices/job/jobActions';
import Script from 'next/script';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import Link from 'next/link';
import GetInitials from '../common/GetInitials';
import VideoUrl from './VideoUrl';
import UpdateJobStatus from '../../updateJobStatus';
import useApiHook from '@/hooks/useApiHook';
import { toast } from 'react-toastify';

const ViewJobAsset = ({
  user,
  artifacts,
  url,
  type,
  description,
  tokenizedNFTUrls,
  uploadedBy,
  jobKeys,
  setLoading,
  status,
  showMinting,
}) => {
  const [uploadedVideoCount] = useState(!!url ? 1 : 0);
  const [savedVideos, setSavedVideos] = useState(null);
  const { output } = useSelector((state) => state.job);
  const [progress, setProgress] = useState(0);
  const [showJobStatus, setShowJobStatus] = useState(false);
  const [jobStatus, setJobStatus] = useState(jobKeys.status);
  const dispatch = useDispatch();
  const { handleApiCall } = useApiHook();
  const calculateAvatarSize = () => {
    const viewportWidth = window.innerWidth;
    if (viewportWidth < 1024) {
      return '40px';
    } else if (viewportWidth < 786) {
      return '30px';
    } else {
      return '60px';
    }
  };
  const [avatarSize, setAvatarSize] = useState(calculateAvatarSize());

  const handleTokenizeAsset = async () => {
    setLoading(true);
    const result = await handleApiCall({
      method: 'GET',
      url: `/jobs/job-output-tokenized?jobId=${jobKeys?.id}`,
    })
      .then((res) => {
        if (res.status === 200) {
          toast.success('Great! Asset has been tokenized');
          setLoading(false);
        }
        return res;
      })
      .catch((error) => {
        setLoading(false);
        //toast.error(error?.response?.data?.errors);
      });
  };

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

  const handleStatusClick = async (status) => {
    setLoading(true);
    setShowJobStatus(false);

    const result = await handleApiCall({
      method: 'PUT',
      url: `/jobs/${jobKeys?.id}/update-status/`,
      data: { status: status, jobId: jobKeys?.id },
    })
      .then((res) => {
        if (res.status === 200) {
          setJobStatus(status);
          setShowJobStatus(false);
        }
        return res;
      })
      .catch((error) => {
        toast.error(error?.response?.data?.errors);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const modelViewer = document.getElementById(`model-viewer`);
    const progressHandler = (event) => {
      const { totalProgress } = event.detail;
      setProgress(totalProgress * 100);
    };
    const handleResize = () => setAvatarSize(calculateAvatarSize());
    setAvatarSize(calculateAvatarSize());
    window?.addEventListener('resize', handleResize);
    modelViewer?.addEventListener('progress', progressHandler);
    return () => {
      modelViewer?.removeEventListener('progress', progressHandler);
      window?.removeEventListener('resize', handleResize);
    };
  }, []);

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
      <div className='text-white flex justify-between items-center pl-8  md:pl-16 pt-2'>
        <Link href='/dashboard' className='flex items-center'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth='1.5'
            stroke='#fff'
            class='w-6 h-6'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3'
            />
          </svg>
          <span className='inline-block pl-2'>Back to dashboard</span>
        </Link>
      </div>
      <div
        className='pl-0 pr-2 md:px-5 pb-1 mt-3 md:mt-10 text-white'
        key={user?.id}
      >
        <div>
          <div className=' flex space-x-2'>
            <div className=' w-[1.85rem] h-[1.85rem] md:w-10 md:h-10 text-xs md:text-base rounded-full text-black flexCenter font-semibold bg-slate-200'>
              <GetInitials fullName={user?.name} />
            </div>
            <div className='w-full relative'>
              <div className=' p-8 md:p-14 relative bg-no-repeat bg-cover bgGrayImage rounded-xl'>
                <UpdateJobStatus
                  jobKeys={jobKeys}
                  showJobStatus={showJobStatus}
                  jobStatus={jobStatus}
                  handleStatusClick={handleStatusClick}
                  setShowJobStatus={setShowJobStatus}
                />
                {jobStatus != 'completed' && tokenizedNFTUrls?.length === 0 && (
                  <button
                    className='bg-white rounded-xl py-1.5 px-3 text-black text-[.7rem] sm:text-xs font-semibold mr-2 md:mr-5 absolute right-20 top-4'
                    onClick={handleTokenizeAsset}
                  >
                    Tokenize
                  </button>
                )}

                <div className=' absolute top-2 right-2 md:top-3 md:right-3 cursor-pointer'>
                  <img
                    src='/assets/images/chat/info.svg'
                    className=' w-4 h-4 md:w-7 md:h-7 hidden'
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
                    {description && description !== '' && (
                      <>
                        <h1 className='text-md md:text-xl mb-3 font-bold'>
                          User's Script:
                        </h1>
                        <p className='pb-6'>{description}</p>
                      </>
                    )}
                    <h1 className='text-md md:text-xl mb-5 font-bold pt-4 sm:pt-0'>
                      User's Input:
                    </h1>

                    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
                      {artifacts.map((item) => {
                        return (
                          <>
                            {item?.type === 'image' && (
                              <div>
                                <img
                                  src={item?.url}
                                  alt='artifact'
                                  className='w-full rounded-md object-cover h-24 md:h-36'
                                />
                              </div>
                            )}
                            {item?.type === 'audio' && (
                              <Link
                                href={item.url}
                                target='_blank'
                                className='flexCenter border flex w-full h-24 md:h-36 rounded-md lightGrayBg'
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
                          className='cursor-pointer w-14 h-24 md:h-36'
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
                    <VideoUrl url={url} />
                  ) : (
                    <>
                      <div className='w-full glbModal h-[16rem] md:h-[24rem]'>
                        {url && (
                          <model-viewer
                            id={`model-viewer`}
                            alt='3d modal'
                            src={url}
                            ar
                            shadow-intensity='1'
                            style={{ width: '100%', height: '100%' }}
                            camera-controls
                            auto-rotate-delay='2000'
                            interaction-prompt='when-focused'
                            interaction-policy='allow-when-focused'
                            touch-action='pan-y'
                            autoplay
                            animation-name='Running'
                            ar-modes='webxr scene-viewer'
                            camera-orbit={
                              status != 'in-queue'
                                ? '0deg 90deg 5m'
                                : '180deg 90deg 5m'
                            }
                          >
                            {progress < 100 && (
                              <div className='bg-transparent left-2 right-2 bottom-0 absolute'>
                                <div className='border border-gray-500 bg-transparent p-1 rounded-xl'>
                                  <div className='dark:bg-transparent rounded-xl overflow-hidden'>
                                    <div
                                      id={`progress-bar-div`}
                                      slot='progress-bar'
                                      className='bg-gray-500 text-xs font-semibold text-white text-center p-0.5 leading-none rounded-full'
                                      style={{ width: `${progress}%` }}
                                    >
                                      <p className='text-[.6rem]'>
                                        {`${Math.round(progress)}%`}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </model-viewer>
                        )}
                      </div>
                    </>
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

              {tokenizedNFTUrls?.length > 0 ? (
                <div className='bg-gray-100 absolute right-0 bottom-3 rounded-md px-2 py-1'>
                  <a
                    href={tokenizedNFTUrls}
                    className=' text-gray-600 text-xs flexCenter cursor-pointer'
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <span>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 16 16'
                        fill='#fff'
                        className='w-4 h-4'
                      >
                        <path d='M7.628 1.099a.75.75 0 0 1 .744 0l5.25 3a.75.75 0 0 1 0 1.302l-5.25 3a.75.75 0 0 1-.744 0l-5.25-3a.75.75 0 0 1 0-1.302l5.25-3Z' />
                        <path d='m2.57 7.24-.192.11a.75.75 0 0 0 0 1.302l5.25 3a.75.75 0 0 0 .744 0l5.25-3a.75.75 0 0 0 0-1.303l-.192-.11-4.314 2.465a2.25 2.25 0 0 1-2.232 0L2.57 7.239Z' />
                        <path d='m2.378 10.6.192-.11 4.314 2.464a2.25 2.25 0 0 0 2.232 0l4.314-2.465.192.11a.75.75 0 0 1 0 1.303l-5.25 3a.75.75 0 0 1-.744 0l-5.25-3a.75.75 0 0 1 0-1.303Z' />
                      </svg>
                    </span>
                    <span className='inline-block pl-1 max-w-48'>
                      Tokenized NFT Url
                    </span>
                  </a>
                </div>
              ) : (
                <div>
                  {uploadedBy === 'admin' && (
                    <div
                      className={`bg-gray-100 absolute right-0 bottom-2 rounded-xl px-2 py-1 `}
                    >
                      <span className='inline-block text-sm pl-1 max-w-56 text-white'>
                        Asset is being tokenized...
                      </span>
                    </div>
                  )}
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
