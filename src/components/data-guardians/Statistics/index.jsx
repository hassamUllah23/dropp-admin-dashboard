import { Heading } from "@/components/common/Heading";

import { useState, useEffect } from "react";
import useApiHook from "@/hooks/useApiHook";

function Statistics({}) {
  const { handleApiCall, isApiLoading } = useApiHook();

  const [statistics, setStatistics] = useState({
    totalSwipeCount: 0,
    totalSwipePoints: 0,
    totalDgnStaked: 0,
    totalDgnSupply: 0,
  });
  // const array1 = [
  //   {
  //     title: "Total Swipes",
  //     value: statistics.totalYesSwipes,
  //     badge: "Yes",
  //   },
  //   {
  //     title: "Total Swipes",
  //     value: statistics.totalNoSwipes,
  //     badge: "No",
  //   },
  // ];

  const array2 = [
    {
      title: "Total Swipes",
      value: statistics?.totalSwipeCount,
      badge: null,
    },
    {
      title: "Total Swipe Points",
      value: statistics?.totalSwipePoints,
      badge: null,
    },
    {
      title: "D-GN Supply Pool",
      value: statistics?.totalDgnSupply,
    },
    {
      title: "Staked D-GN",
      value: statistics?.totalDgnStaked,
    },
  ];

  const getStatistics = async () => {
    const result = await handleApiCall({
      method: "GET",
      url: `/swipe/points/stats`,
    });

    console.log({ result });
    setStatistics((prev) => {
      let newStatistics = { ...prev };
      newStatistics.totalSwipeCount = result?.data?.totalSwipeCount;
      newStatistics.totalSwipePoints = result?.data?.totalSwipePoints;
      newStatistics.totalDgnStaked = result?.data?.totalDgnStaked;
      newStatistics.totalDgnSupply = result?.data?.totalDgnSupply;
      return { ...newStatistics };
    });
  };

  useEffect(() => {
    getStatistics();
    return () => {};
  }, []);
  return (
    <div className="text-white">
      <Heading text={"Statistics"} />
      {/* <div className="flex flex-row justify-start items-center gap-y-3 gap-x-2 my-3 w-full">
        {array1.map((element, index) => (
          <div key={index} className="w-full">
            <Statistic {...element} />
          </div>
        ))}
      </div> */}
      <div className="flex flex-row justify-start items-center gap-y-3 gap-x-2 my-3 w-full">
        {array2.map((element, index) => (
          <div key={index} className="w-full">
            <Statistic {...element} />
          </div>
        ))}
      </div>
    </div>
  );
}

function Statistic({ title, value, badge, percentage, percentageTrend }) {
  return (
    <div className="rounded-lg px-5 pt-6 pb-5 bgGrayImage">
      <div className=" flex flex-row w-full">
        <div className="w-full">
          <div className="flex flex-row gap-x-2 justify-start items-center">
            <p className="text-[#8d939c] text-sm font-normal font-['Arial'] leading-[18.20px]">
              {title}
            </p>
            {badge ? (
              <p className="text-white text-sm font-bold font-['Arial'] leading-[18.20px]">
                {badge}
              </p>
            ) : null}
          </div>
          <div className="text-[#e6e6e6] text-[28px] font-bold font-['Arial'] leading-loose">
            {value}
          </div>
        </div>
        {/* <div className="w-1/4">
          <div className="flex flex-row w-full h-full justify-center items-center">
            <p
              className={`${
                percentageTrend ? "text-green-600" : "text-red-600"
              }`}
            >
              {percentage}
            </p>
          </div>
        </div> */}
      </div>
    </div>
  );
}

export { Statistics };
