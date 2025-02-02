import { useRouter } from 'next/navigation';
import LoadingSvg from '../common/LoadingSvg';

export default function NotificationsPopup({
  notificationData,
  isApiLoading,
  markAllNotificationAsRead,
  onClose,
}) {
  const router = useRouter();
  const getTimeLabel = (isoTimestamp) => {
    const timestamp = new Date(isoTimestamp).getTime();
    const currentTime = Date.now();
    const differenceInSeconds = Math.floor((currentTime - timestamp) / 1000);

    if (differenceInSeconds < 60) {
      return 'just now';
    } else if (differenceInSeconds < 3600) {
      const differenceInMinutes = Math.floor(differenceInSeconds / 60);
      return `${differenceInMinutes} min${
        differenceInMinutes > 1 ? 's' : ''
      } ago`;
    } else if (differenceInSeconds < 86400) {
      const differenceInHours = Math.floor(differenceInSeconds / 3600);
      return `${differenceInHours} hr${differenceInHours > 1 ? 's' : ''} ago`;
    } else if (differenceInSeconds < 604800) {
      const differenceInDays = Math.floor(differenceInSeconds / 86400);
      return `${differenceInDays} day${differenceInDays > 1 ? 's' : ''} ago`;
    } else if (differenceInSeconds < 2629746) {
      const differenceInWeeks = Math.floor(differenceInSeconds / 604800);
      return `${differenceInWeeks} week${differenceInWeeks > 1 ? 's' : ''} ago`;
    } else if (differenceInSeconds < 31556952) {
      const differenceInMonths = Math.floor(differenceInSeconds / 2629746);
      return `${differenceInMonths} month${
        differenceInMonths > 1 ? 's' : ''
      } ago`;
    } else {
      const differenceInYears = Math.floor(differenceInSeconds / 31556952);
      return `${differenceInYears} year${differenceInYears > 1 ? 's' : ''} ago`;
    }
  };

  const handleNotificationLink = (url) => {
    router.push(`/dashboard/job/${url}`)
    onClose();
  };

  // Check if notificationData is not empty
  if (!notificationData || notificationData.length === 0) {
    return (
      <div className='absolute right-[-10px] z-20 top-14 darkGrayBg w-[20rem] md:w-[30rem] p-4 rounded-2xl border border-white'>
        <div className='w-full'>
          <div className='w-full flex justify-start items-center py-1'>
            <span className='text-base font-semibold'>
              No new notifications{' '}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='absolute right-[-10px] z-20 top-14 darkGrayBg w-[20rem] md:w-[30rem] p-4 rounded-2xl border border-white'>
      <span className='absolute right-2 top-[-1rem]'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='white'
          viewBox='0 0 24 24'
          strokeWidth='1.5'
          stroke='currentColor'
          className='w-6 h-6'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='m4.5 15.75 7.5-7.5 7.5 7.5'
          />
        </svg>
      </span>

      <div className='w-full'>
        <div className='w-full flex justify-between relative items-center py-4 px-2'>
          <span className='text-base font-semibold'>Notification Panel</span>
          <span
            className='text-xs hover:text-slate-300'
            onClick={() => markAllNotificationAsRead()}
          >
            Mark all as read
          </span>
        </div>
        {isApiLoading ? (
          <div className='flex justify-center items-center h-[20rem]'>
            <LoadingSvg color={'#ffffff'} />
          </div>
        ) : (
          <div className='flex flex-col notificationScroll screenHeightForNotifications h-auto overflow-y-auto'>
            {notificationData?.length > 0 &&
              notificationData?.map((notification, index) => (
                <div
                  className='flex flex-col justify-start'
                  key={index}
                  id={notification?._id}
                  onClick={() => handleNotificationLink(notification?.job)}
                >
                  <div className='w-full flex justify-between relative items-center py-2 border-b border-gray-300 notificationItem'>
                    {!notification?.read && (
                      <span className='bg-blue-500 w-2 h-2 rounded-full' />
                    )}
                    <div className='flex flex-col mr-1 px-3 flex-1'>
                      <span className='text-sm font-semibold pb-1 capitalize leading-5'>
                        {notification?.title}
                      </span>
                      {/* <span className='text-xs text-gray-800'>
                        {notification?.message}
                      </span> */}
                    </div>
                    <span className='text-xs w-1/6 pr-2 text-gray-700'>
                      <small className='flex flex-row flex-wrap justify-end w-full text-right'>
                        {getTimeLabel(notification?.createdAt)}
                      </small>
                    </span>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
