'use client';
import { useEffect, useState } from 'react';
import { PieChart } from './PieChart';
import useApiHook from '@/hooks/useApiHook';
import { toast } from 'react-toastify';
import { data } from 'autoprefixer';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import LoadingRotatingLines from '@/components/common/LoadingRotatingLines';

export default function page() {
  const [showCustomDateFields, setShowCustomDateFields] = useState(false);
  const [tabValue, setTabValue] = useState('today');
  const [showLoading, setShowLoading] = useState(false);
  const [filterType, setfilterType] = useState('');
  const [chartData, setChartData] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const { handleApiCall, isApiLoading } = useApiHook();

  const handleStartDate = (date) => {
    setStartDate(date);
  };
  const handleEndDate = (date) => {
    setEndDate(date);
  };

  const handleTab = async (type) => {
    setTabValue(type);
    setShowCustomDateFields(false);
    let start, end;
    switch (type) {
      case 'today':
        start = new Date();
        start.setHours(0, 0, 0, 0);
        end = new Date(start);
        end.setHours(23, 59, 59, 999);
        break;
      case 'yesterday':
        start = new Date();
        start.setDate(start.getDate() - 1);
        start.setHours(0, 0, 0, 0);
        end = new Date(start);
        end.setHours(23, 59, 59, 999);
        break;
      case 'lastWeek':
        start = new Date();
        start.setHours(0, 0, 0, 0);
        start.setDate(start.getDate() - 7);
        end = new Date();
        break;
      case 'lastMonth':
        start = new Date();
        start.setMonth(start.getMonth() - 1);
        start.setHours(0, 0, 0, 0);
        end = new Date();
        break;
      case 'custom':
        setShowCustomDateFields(true);
        start = startDate;
        start.setHours(0, 0, 0, 0);
        end = endDate;
        break;
      default:
        start = new Date();
        end = new Date();
    }

    setStartDate(start);
    setEndDate(end);

    setfilterType(type);
    setShowLoading(true);

    getUsersStats(start, end);
  };

  const getUsersStats = async (start, end) => {
    try {
      const startDefault = new Date();
      startDefault.setHours(0, 0, 0, 0);
      const result = await handleApiCall({
        method: 'POST',
        url: `admin/user/users-stats`,
        data: {
          startDate: start || startDefault,
          endDate: end || new Date(),
        },
      });
      setShowLoading(false);
      if (result.status === 200) {
        setChartData(() => [
          {
            label: 'Registrations',
            value: result.data?.newSignupsCount
              ? result.data?.newSignupsCount
              : 0,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
          },
          {
            label: 'Activations',
            value: result.data?.newActivationsCount
              ? result.data?.newActivationsCount
              : 0,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
          },
          {
            label: 'Wallet Connections',
            value: result.data?.connectedWalletCount
              ? result.data?.connectedWalletCount
              : 0,
            backgroundColor: 'rgba(255, 206, 86, 0.2)',
            borderColor: 'rgba(255, 206, 86, 1)',
          },
        ]);
        console.log(chartData, 'in parent');
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  useEffect(() => {
    getUsersStats();

    return () => {};
  }, []);

  return (
    <div className='divide-y divide-white/5 w-full mx-auto p-2.5  max-w-7xl'>
      <div className=''>
        <div>
          <h2 className='text-base text-[40px] font-semibold leading-7 text-white'>
            User Statistics
          </h2>
          <p className='mt-1 text-sm leading-6 text-gray-400'></p>
        </div>

        <div className='flex flex-col gap-y-5 pt-10'>
          {chartData.map((element) => {
            return (
              <div className='text-white'>
                <h1 className='flex items-center text-[30px] font-[700] leading-[23.48px] pb-4'>
                  {element.label}
                </h1>
                <h1 className='flex items-center text-[20px] font-[500] leading-[23.48px]'>
                  {element.value}
                </h1>
              </div>
            );
          })}
        </div>
        <div className='flex flex-col gap-y-5 pt-5'>
          <h2 className='text-[25px] font-semibold leading-7 text-white mb-2'>
            Date Filters
          </h2>
        </div>
        <div className='flex flex-col mb-0 md:mb-2'>
          <div className='flex text-base md:text-1xl font-bold p-1 md:p-2 leading-5 md:leading-8 rounded-md lightGrayBg text-white'>
            <button
              className={`${
                tabValue == 'today' && 'darkGrayBg'
              } px-6 uppercase py-3 rounded-lg transition-all ease-in-out  hover:bg-gray-100 `}
              onClick={() => handleTab('today')}
            >
              Today
            </button>
            <button
              className={`${
                tabValue == 'yesterday' && 'darkGrayBg'
              } px-6 uppercase py-3 rounded-lg transition-all ease-in-out hover:bg-gray-100 ml-2`}
              onClick={() => handleTab('yesterday')}
            >
              Yesterday
            </button>
            <button
              className={`${
                tabValue === 'lastWeek' && 'darkGrayBg'
              } px-6 uppercase py-3 rounded-lg transition-all ease-in-out hover:bg-gray-100 ml-2`}
              onClick={() => handleTab('lastWeek')}
            >
              Last Week
            </button>
            <button
              className={`${
                tabValue == 'lastMonth' && 'darkGrayBg'
              } px-6 uppercase py-3 rounded-lg transition-all ease-in-out  hover:bg-gray-100 `}
              onClick={() => handleTab('lastMonth')}
            >
              Last Month
            </button>
            <button
              className={`${
                tabValue === 'custom' && 'darkGrayBg'
              } px-6 uppercase py-3 rounded-lg transition-all ease-in-out hover:bg-gray-100 ml-2`}
              onClick={() => setShowCustomDateFields(!showCustomDateFields)}
            >
              Custom
            </button>
          </div>
          <div className='flex flex-row'>
            <div>
              {showCustomDateFields ? (
                <>
                  <div className='flex w-full h-auto mt-3'>
                    <div className='flex flex-row'>
                      <div className='text-white'>
                        Start Date:
                        <DatePicker
                          name='startDate'
                          selected={startDate}
                          onChange={handleStartDate}
                          dateFormat='dd-MM-yyyy'
                          className='mt-2 px-3 block rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-white text-sm sm:leading-6'
                        />
                      </div>
                      <div className='text-white'>
                        End Date:
                        <DatePicker
                          name='endDate'
                          selected={endDate}
                          onChange={handleEndDate}
                          dateFormat='dd-MM-yyyy'
                          className='mt-2 px-3 block rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-white text-sm sm:leading-6'
                        />
                      </div>
                    </div>
                    <div className=''>
                      <div className='text-white'>
                        <button
                          className='mt-2 ml-2 rounded-md bg-Gradient px-10 py-3 text-sm font-semibold text-black shadow-sm'
                          onClick={() => handleTab('custom')}
                        >
                          {showLoading && filterType == 'custom' ? (
                            <LoadingRotatingLines />
                          ) : (
                            <p>Submit</p>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                ''
              )}
            </div>
          </div>
        </div>

        {chartData?.length > 0 ? (
          <div className='flex flex-row w-full justify-center items-center h-auto'>
            <div className='w-1/2'>
              <PieChart chartDataX={chartData} />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
