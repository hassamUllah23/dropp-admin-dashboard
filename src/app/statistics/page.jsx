"use client";
import { useEffect, useState } from "react";
import { PieChart } from "./PieChart";
import useApiHook from "@/hooks/useApiHook";
import { toast } from "react-toastify";
import { data } from "autoprefixer";

export default function page() {
  const [chartData, setChartData] = useState([]);
  const [data, setData] = useState(null);
  const [days, setDays] = useState(1);
  const { handleApiCall, isApiLoading } = useApiHook();

  const getUsersStats = async () => {
    const result = await handleApiCall({
      method: "GET",
      url: `admin/user/users-stats?days=${days}`,
    });
    if (result.status === 200) {
      setData({
        newSignupsCount: result.data?.newSignupsCount
          ? result.data?.newSignupsCount
          : 0,
        connectedWalletCount: result.data?.connectedWalletCount
          ? result.data?.connectedWalletCount
          : 0,
        newActivationsCount: result.data?.newActivationsCount
          ? result.data?.newActivationsCount
          : 0,
      });
      setChartData(() => [
        {
          label: "Registrations",
          value: result.data?.newSignupsCount
            ? result.data?.newSignupsCount
            : 0,
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderColor: "rgba(255, 99, 132, 1)",
        },
        {
          label: "Activations",
          value: result.data?.newActivationsCount
            ? result.data?.newActivationsCount
            : 0,
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          borderColor: "rgba(54, 162, 235, 1)",
        },
        {
          label: "Wallet Connections",
          value: result.data?.connectedWalletCount
            ? result.data?.connectedWalletCount
            : 0,
          backgroundColor: "rgba(255, 206, 86, 0.2)",
          borderColor: "rgba(255, 206, 86, 1)",
        },
      ]);
    }
  };

  useEffect(() => {
    getUsersStats();
  }, []);

  return (
    <div className="divide-y divide-white/5 w-full mx-auto p-10  max-w-7xl">
      <div className="">
        <div>
          <h2 className="text-[40px] font-semibold leading-7 text-white">
            User Statistics
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-400"></p>
        </div>

        <div className="flex flex-col gap-y-5 pt-10">
          {chartData?.length > 0 &&
            chartData?.map((element) => {
              return (
                <div className="text-white w-full flex items-center">
                  <h1 className="flex items-center text-[1.2rem] font-[700]">
                    {element.label}: {element.value}
                  </h1>
                </div>
              );
            })}
        </div>

        {/* {data.length > 0 ? (
                    <div className='flex flex-row w-full justify-center items-center h-auto'>
                        <div className='w-1/2'>
                            <PieChart chartDataX={data} />
                        </div>
                    </div>
                ) : null} */}
      </div>
    </div>
  );
}
