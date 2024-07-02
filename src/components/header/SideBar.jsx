'use client';
import React, { useEffect, useState } from 'react';
import IntegrationPopup from './IntegrationPopup';
import { useRouter } from 'next/navigation';
import GetInitials from '../common/GetInitials';
import useApiHook from '@/hooks/useApiHook';
import {
  handleChatModel,
  selectChat,
  useDispatch,
  useSelector,
  selectAuth,
} from '@/lib';
import ChatModel from './ChatModels/ChatModel';
import TextToImageModel from './ChatModels/TextToImageModel';
import ThreeDModal from './ChatModels/ThreeDModal';
import DigitalHuman from './ChatModels/DigitalHuman';
import { RotatingLines } from 'react-loader-spinner';
import NetworkModel from './Networks/NetworkModel';
export default function SideBar({ onClose }) {
  const { handleApiCall, isApiLoading } = useApiHook();
  const [showIntegration, setShowIntegration] = useState(true);
  const [showIntegrationPopup, setShowIntegrationPopup] = useState(false);
  const [AiModals, setAiModals] = useState([]);
  const [networkModal, setNetworkModals] = useState([]);
  const [showSpinner, setShowSpinner] = useState(true);
  const [showNetworkSpinner, setShowNetworkSpinner] = useState(true);
  const router = useRouter();
  const auth = useSelector(selectAuth);

  const toggleIntegration = () => {
    setShowIntegration(!showIntegration);
  };

  const addIntegration = () => {
    setShowIntegrationPopup(!showIntegrationPopup);
  };

  const linkToDashboard = () => {
    onClose();
    router.push('/dashboard');
  };

  // const linkToInviteUsers = () => {
  //   onClose();
  //   router.push('/invite-users');
  // };

  const linkToUsersList = () => {
    onClose();
    router.push('/users');
  };

  const linkToStatistics = () => {
    onClose();
    router.push('/statistics');
  };

  const linkToSettings = () => {
    onClose();
    router.push('/settings');
  };

  let fullName = auth?.userInfo?.profile?.name;

  const loadModels = async () => {
    const result = await handleApiCall({
      method: 'GET',
      url: '/ai-models',
    });
    setShowSpinner(false);
    setAiModals(result?.data);
  };

  const loadNetworks = async () => {
    const result = await handleApiCall({
      method: 'GET',
      url: '/settings',
    });
    setShowNetworkSpinner(false);
    setNetworkModals(result?.data);
  };

  useEffect(() => {
    loadModels();
    loadNetworks();
  }, []);

  return (
    <div className='relative z-10'>
      <div className='fixed w-[22rem] flex flex-col min-h-screen blackBG p-4 pt-3 right-0 top-0 bottom-0 text-white text-base z-20 overflow-auto md:overflow-visible md:over'>
        <span
          className='absolute top-9 right-9 md:top-12 md:right-12'
          onClick={onClose}
        >
          <img
            src='/assets/images/sidebar/close.svg'
            alt='close'
            className='w-5 h-5 cursor-pointer'
          />
        </span>

        <div className=' flex space-x-2  items-center blackBorderBottom py-4 md:py-5'>
          <div className='justify-center items-center w-8 mr-2 h-8 md:w-14 md:h-14 flex'>
            {auth?.userInfo?.user?.avatar == null ? (
              <span className='w-8 h-8 md:w-14 md:h-14 text-xs md:text-base rounded-full text-black flexCenter font-semibold bg-slate-200'>
                <GetInitials fullName={fullName} />
              </span>
            ) : (
              <img
                src='/assets/images/chat/UserImg.png'
                alt='user'
                className='w-8 h-8 md:w-14 md:h-14'
              />
            )}
          </div>
          <div className=''>
            <p className='text-base text-white pt-1 pb-1 capitalize'>
              {fullName}
            </p>
          </div>
        </div>

        <div className='flex flex-col screenHeightForSidebar overflow-y-auto'>
          {/* <div className=' flex space-x-2  items-center blackBorderBottom py-4 md:py-5'>
            <div className='justify-center items-center w-7 h-8 md:w-12 md:h-14 mr-2'>
              <img
                src='/assets/images/sidebar/dropcoin.png'
                alt='coin'
                className='w-7 h-8 md:w-12 md:h-14'
              />
            </div>
            <div className=''>
              <p className='text-[.75rem] text-gray-300'>Reward Balance</p>
              <p className='text-[1.5rem] text-white pt-1 pb-1 font-bold'>
                300.56
              </p>
            </div>
          </div> */}

          <div className=' w-full blackBorderBottom pt-2 pb-3 md:pt-3 md:pb-4'>
            <p className=' pt-3  py-1 font-semibold pb-3'>Pages</p>
            <div className='w-full py-2'>
              <p
                className='flex items-middle text-white/80 cursor-pointer'
                onClick={linkToDashboard}
              >
                <img
                  src='/assets/images/sidebar/dashboard.svg'
                  className=' w-4 h-4 inline'
                />{' '}
                <span className=' text-sm pl-2'> Dashboard</span>
              </p>
            </div>
            {/* <div className='w-full py-2'>
              <p
                className='flex items-middle text-white/80 cursor-pointer'
                onClick={linkToInviteUsers}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-4 h-4'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z'
                  />
                </svg>

                <span className=' text-sm pl-2'> Invite users</span>
              </p>
            </div> */}
            <div className='w-full py-2'>
              <p
                className='flex items-middle text-white/80 cursor-pointer'
                onClick={linkToUsersList}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-4 h-4'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z'
                  />
                </svg>

                <span className=' text-sm pl-2'> Users list</span>
              </p>
            </div>
            <div className='w-full py-2'>
              <p
                className='flex items-middle text-white/80 cursor-pointer'
                onClick={linkToStatistics}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-4 h-4'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z'
                  />
                </svg>

                <span className=' text-sm pl-2'>Statistics</span>
              </p>
            </div>
            {/* <div className="flex items-middle py-2">
              <p className="flex items-middle text-white/80">
                <img
                  src="/assets/images/sidebar/logo.png"
                  className=" w-4 h-3 inline"
                />{" "}
                <span className=" text-sm pl-2"> About dropp</span>
              </p>
            </div>
            <div className="flex items-middle py-2">
              <p className="flex items-middle text-white/80">
                <img
                  src="/assets/images/sidebar/call.svg"
                  className=" w-4 h-4 inline"
                />{" "}
                <span className=" text-sm pl-2"> Contact Us</span>
              </p>
            </div> */}
            <div className='flex items-middle py-2'>
              <p className='flex items-middle text-white/80'>
                <svg
                  width='16'
                  height='16'
                  viewBox='0 0 16 16'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M2.00684 7.48V10.4733C2.00684 13.4667 3.20684 14.6667 6.20017 14.6667H9.7935C12.7868 14.6667 13.9868 13.4667 13.9868 10.4733V7.48'
                    stroke='#E6E6E6'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M7.99999 8C9.21999 8 10.12 7.00667 9.99999 5.78667L9.55999 1.33334H6.44666L5.99999 5.78667C5.87999 7.00667 6.77999 8 7.99999 8Z'
                    stroke='#E6E6E6'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M12.2065 8C13.5532 8 14.5399 6.90667 14.4065 5.56667L14.2199 3.73334C13.9799 2 13.3132 1.33334 11.5665 1.33334H9.5332L9.99987 6.00667C10.1132 7.10667 11.1065 8 12.2065 8Z'
                    stroke='#E6E6E6'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M3.75992 8C4.85992 8 5.85325 7.10667 5.95992 6.00667L6.10659 4.53334L6.42659 1.33334H4.39326C2.64659 1.33334 1.97992 2 1.73992 3.73334L1.55992 5.56667C1.42659 6.90667 2.41326 8 3.75992 8Z'
                    stroke='#E6E6E6'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M8.00016 11.3333C6.88683 11.3333 6.3335 11.8867 6.3335 13V14.6667H9.66683V13C9.66683 11.8867 9.1135 11.3333 8.00016 11.3333Z'
                    stroke='#E6E6E6'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>

                <span className=' text-sm pl-2'> Marketplace</span>
              </p>
            </div>
            <div className='flex items-middle py-2'>
              <p
                className='flex items-middle text-white/80 cursor-pointer'
                onClick={linkToSettings}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-4 h-4'
                >
                  <path
                    stroke-linecap='round'
                    stroke-linejoin='round'
                    d='M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z'
                  />
                  <path
                    stroke-linecap='round'
                    stroke-linejoin='round'
                    d='M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z'
                  />
                </svg>

                <span className=' text-sm pl-2'> Settings </span>
              </p>
            </div>
          </div>

          <div className=' w-full  pt-2 pb-3 md:pt-3 md:pb-4 textModals blackBorderBottom'>
            <p className=' pt-3  py-1 font-semibold pb-3'>Select Ai Models</p>
            <div className='w-full relative'>
              <div className='flex items-middle relative z-40'>
                <ChatModel
                  model={AiModals}
                  showLoading={(value) => setShowSpinner(value)}
                  resetData={(value) => setAiModals(value)}
                />
              </div>
              <div className='flex items-middle relative z-30'>
                <TextToImageModel
                  model={AiModals}
                  showLoading={(value) => setShowSpinner(value)}
                  resetData={(value) => setAiModals(value)}
                />
              </div>
              <div className='flex items-middle relative z-20'>
                <ThreeDModal
                  model={AiModals}
                  showLoading={(value) => setShowSpinner(value)}
                  resetData={(value) => setAiModals(value)}
                />
              </div>
              <div className='flex items-middle relative z-10'>
                <DigitalHuman
                  model={AiModals}
                  showLoading={(value) => setShowSpinner(value)}
                  resetData={(value) => setAiModals(value)}
                />
              </div>
              {showSpinner && (
                <div className='flexCenter absolute right-0 top-0 left-0 bottom-0 bg-black/80 z-50'>
                  <RotatingLines
                    visible={true}
                    height='20'
                    width='20'
                    color='blue'
                    strokeWidth='5'
                    animationDuration='0.75'
                    ariaLabel='rotating-lines-loading'
                  />
                </div>
              )}
            </div>
          </div>

          <div className=' w-full pt-0 pb-3 md:pb-4 textModals'>
            <p className=' pt-3  py-1 font-semibold pb-3'>Select Network</p>
            <div className='w-full relative'>
              <div className='flex items-middle relative z-40'>
                <NetworkModel
                  model={networkModal}
                  showLoading={(value) => setShowNetworkSpinner(value)}
                  resetData={(value) => setNetworkModals(value)}
                />
              </div>
              {showNetworkSpinner && (
                <div className='flexCenter absolute right-0 top-0 left-0 bottom-0 bg-black/80 z-50'>
                  <RotatingLines
                    visible={true}
                    height='20'
                    width='20'
                    color='blue'
                    strokeWidth='5'
                    animationDuration='0.75'
                    ariaLabel='rotating-lines-loading'
                  />
                </div>
              )}
            </div>
          </div>

          <div className=' w-full blackBorderBottom  pt-2 pb-3 md:pt-3 md:pb-4 hidden'>
            <p className=' pt-3  py-1 font-semibold pb-3'>Integrations</p>
            <div className='flex items-middle py-1'>
              <p className='w-full text-white/80 flex justify-between'>
                <span className=' text-sm'>Live Integration</span>
                {!showIntegration && (
                  <span className='inline-block pr-3'>
                    <img
                      src='/assets/images/sidebar/inactiveToggle.svg'
                      className=' w-7 h-4 inline cursor-pointer'
                      onClick={toggleIntegration}
                    />
                  </span>
                )}
                {showIntegration && (
                  <span className='inline-block pr-3'>
                    <img
                      src='/assets/images/sidebar/toggle.svg'
                      className=' w-7 h-4 inline cursor-pointer'
                      onClick={toggleIntegration}
                    />
                  </span>
                )}
              </p>
            </div>

            {showIntegration && (
              <div className='w-full flex  flex-wrap'>
                <span
                  onClick={addIntegration}
                  className=' inline-block h-12 w-12 flexCenter darkGrayBg cursor-pointer darkGrayBgBorder rounded-lg mx-1 my-1 hover:border-[#67C24B]'
                >
                  <img
                    src='/assets/images/sidebar/shopify.svg'
                    className='w-7 h-7 opacity-40'
                  />
                </span>
                <span
                  onClick={addIntegration}
                  className=' inline-block h-12 w-12 flexCenter darkGrayBg cursor-pointer darkGrayBgBorder rounded-lg mx-1 my-1 hover:border-[#67C24B]'
                >
                  <img
                    src='/assets/images/sidebar/wp.svg'
                    className='w-7 h-7 opacity-40'
                  />
                </span>
                <span
                  onClick={addIntegration}
                  className=' inline-block h-12 w-12 flexCenter darkGrayBg cursor-pointer darkGrayBgBorder rounded-lg mx-1 my-1 hover:border-[#67C24B] '
                >
                  <img
                    src='/assets/images/sidebar/canva.svg'
                    className='w-7 h-7 opacity-40'
                  />
                </span>
                <span
                  onClick={addIntegration}
                  className=' inline-block h-12 w-12 flexCenter darkGrayBg cursor-pointer darkGrayBgBorder rounded-lg mx-1 my-1 hover:border-[#67C24B]'
                >
                  <img
                    src='/assets/images/sidebar/appStore.svg'
                    className='w-7 h-7 opacity-40'
                  />
                </span>
                <span
                  onClick={addIntegration}
                  className=' inline-block h-12 w-12 flexCenter darkGrayBg cursor-pointer darkGrayBgBorder rounded-lg mx-1 my-1 hover:border-[#67C24B]'
                >
                  <img
                    src='/assets/images/sidebar/android.svg'
                    className='w-7 h-7 opacity-40'
                  />
                </span>
                <span
                  onClick={addIntegration}
                  className=' inline-block h-12 w-12 flexCenter darkGrayBg cursor-pointer darkGrayBgBorder rounded-lg mx-1 my-1 hover:border-[#67C24B]'
                >
                  <img
                    src='/assets/images/sidebar/wix.svg'
                    className='w-7 h-7 opacity-40'
                  />
                </span>
              </div>
            )}
          </div>

          <div className=' w-full blackBorderBottom  pt-2 pb-3 md:pt-3 md:pb-4 hidden'>
            <p className=' pt-3  py-1 font-semibold pb-3'>Knowledge hub</p>
            <div className='w-full py-2'>
              <p className='text-white/80 flex items-middle'>
                <img
                  src='/assets/images/sidebar/add.svg'
                  className=' w-4 h-4 inline'
                />
                <span className=' text-sm pl-2'>Upload New Training Data</span>
              </p>
            </div>
            <div className='w-full py-2'>
              <p className='text-white/80 flex items-middle'>
                {' '}
                <img
                  src='/assets/images/sidebar/clock.svg'
                  className=' w-4 h-4 inline'
                />{' '}
                <span className=' text-sm pl-2'>My Training History</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {showIntegrationPopup && (
        <IntegrationPopup onClosePopup={() => setShowIntegrationPopup(false)} />
      )}

      <div className='whiteOverlay fixed top-0 left-0 right-0 bottom-0 bg-white/10 z-10'></div>
    </div>
  );
}
