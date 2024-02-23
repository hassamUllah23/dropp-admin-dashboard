import React from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

export default function NotificationsPopup({ notificationData }) {
  console.log(notificationData);
  const router = useRouter();
  const getTimeLabel = (timestamp) => {
    const currentTime = Date.now();
    const differenceInSeconds = Math.floor((currentTime - timestamp) / 1000);

    if (differenceInSeconds < 60) {
      return "just now";
    } else if (differenceInSeconds < 3600) {
      const differenceInMinutes = Math.floor(differenceInSeconds / 60);
      return `${differenceInMinutes} minute${
        differenceInMinutes > 1 ? "s" : ""
      } ago`;
    } else if (differenceInSeconds < 86400) {
      const differenceInHours = Math.floor(differenceInSeconds / 3600);
      const remainingMinutes = Math.floor((differenceInSeconds % 3600) / 60);
      return `${differenceInHours} hour${
        differenceInHours > 1 ? "s" : ""
      } ${remainingMinutes} minute${remainingMinutes > 1 ? "s" : ""} ago`;
    } else if (differenceInSeconds < 604800) {
      const differenceInDays = Math.floor(differenceInSeconds / 86400);
      return `${differenceInDays} day${differenceInDays > 1 ? "s" : ""} ago`;
    } else if (differenceInSeconds < 2629746) {
      const differenceInWeeks = Math.floor(differenceInSeconds / 604800);
      return `${differenceInWeeks} week${differenceInWeeks > 1 ? "s" : ""} ago`;
    } else if (differenceInSeconds < 31556952) {
      const differenceInMonths = Math.floor(differenceInSeconds / 2629746);
      return `${differenceInMonths} month${
        differenceInMonths > 1 ? "s" : ""
      } ago`;
    } else {
      const differenceInYears = Math.floor(differenceInSeconds / 31556952);
      return `${differenceInYears} year${differenceInYears > 1 ? "s" : ""} ago`;
    }
  };
  console.log("popup", notificationData);
  const handleNotification = () => {
    const jobId = notificationData[0].jobId;
    router.push(`/dashboard/chat/${jobId}`);
  };

  const sortedNotifications = [...notificationData].sort(
    (a, b) => b.createdAt - a.createdAt
  );

  // Check if notificationData is not empty
  if (!notificationData || notificationData.length === 0) {
    return (
      <div className="absolute right-[-10px] z-20 top-14 darkGrayBg w-[20rem] md:w-[30rem] p-4 rounded-2xl border border-white">
        <div className="w-full">
          <div className="w-full flex justify-start items-center py-1">
            <span className="text-base font-semibold">No new notification </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute right-[-10px] z-20 top-14 darkGrayBg w-[20rem] md:w-[30rem] p-4 rounded-2xl border border-white">
      <span className="absolute right-2 top-[-1rem]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="white"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m4.5 15.75 7.5-7.5 7.5 7.5"
          />
        </svg>
      </span>

      <div className="w-full">
        <div className="w-full flex justify-between relative items-center py-4">
          <span className="text-base font-semibold">Notification Panel</span>
          <span className="text-xs">Mark all as read</span>
        </div>
        <div className="flex flex-col notificationScroll screenHeightForNotifications h-auto overflow-y-auto">
          {sortedNotifications.map((notification, index) => (
            <div
              className="flex flex-col"
              key={index}
              id={notification?.messageId}
              onClick={handleNotification}
            >
              <div className="w-full flex justify-between relative items-center py-4 border-b border-gray-300 notificationItem">
                <div className="flex flex-col pl-3">
                  <span className="text-base font-semibold pb-1">
                    {notification?.title}
                  </span>
                  <span className="text-sm text-gray-800">
                    {notification?.message}
                  </span>
                </div>
                <span className="text-xs text-gray-700">
                  {getTimeLabel(notification?.createdAt)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
