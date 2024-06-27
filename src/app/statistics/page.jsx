'use client';
import { useEffect, useState, useRef } from 'react';
import { PieChart } from './PieChart';
import useApiHook from '@/hooks/useApiHook';
import { toast } from 'react-toastify';
import { data } from 'autoprefixer';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import LoadingRotatingLines from '@/components/common/LoadingRotatingLines';
import html2pdf from 'html2pdf.js';

export default function page() {
  const [showCustomDateFields, setShowCustomDateFields] = useState(false);
  const [tabValue, setTabValue] = useState('today');
  const [showLoading, setShowLoading] = useState(false);
  const [filterType, setfilterType] = useState('');
  const [data, setData] = useState([]);
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

  const contentRef = useRef();

  const generatePdf = () => {
    const element = contentRef.current;
    const opt = {
      margin: 0,
      filename: 'my-document.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    };

    const noPrintElements = document.querySelectorAll('.no-print');
    noPrintElements.forEach((el) => el.classList.add('hidden'));

    const designChangeElements = document.querySelectorAll('.user-stats');
    designChangeElements.forEach((el) => el.classList.add('text-black'));

    html2pdf()
      .from(element)
      .set(opt)
      .toPdf()
      .get('pdf')
      .then(() => {
        noPrintElements.forEach((el) => el.classList.remove('hidden'));
        designChangeElements.forEach((el) => el.classList.remove('text-black'));
      })
      .save();
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
        setData(result.data);
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
    <div ref={contentRef} className='text-white'>
      <h2 className=' user-stats flex font-bold  w-full px-8 py-5 mt-8'>
        User Statistics
      </h2>
      <div className='grid grid-cols-7 max-sm:grid-cols-1 text-white px-4'>
        <div className='col-span-2 max-sm:col-span-1 text-white px-4'>
          {chartData.map((element) => {
            return (
              <div className='flex flex-row justify-between items-center w-full bg-neutral-800 rounded-md px-4 py-8 first:mb-4 last:mt-4'>
                <div className=''>{element.label}</div>
                <div className='text-4xl font-bold '>{element.value}</div>
              </div>
            );
          })}
        </div>
        <div className='col-span-5 max-sm:col-span-1 max-sm:mt-4 text-white px-4'>
          <div className='bg-neutral-800 p-4 rounded-md'>
            <div className='flex text-white w-full justify-between'>
              <button
                className='no-print w-40 mt-2 ml-2 rounded-md bg-Gradient px-7 py-3 text-sm font-semibold text-black shadow-sm'
                onClick={generatePdf}
              >
                Download PDF
              </button>
              <select
                className='bg-neutral-800 p-1 rounded-md border border-solid border-gray-600 h-10 mt-2 ml-2'
                onChange={(e) => {
                  if (e.target.value == 'custom') {
                    setShowCustomDateFields(!showCustomDateFields);
                  } else {
                    handleTab(e.target.value);
                  }
                }}
              >
                <option value='today'>Today</option>
                <option value='yesterday'>Yesterday</option>
                <option value='lastWeek'>Last Week</option>
                <option value='lastMonth'>Last Month</option>
                <option value='custom'>Custom</option>
              </select>
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
                            showYearDropdown
                            showMonthDropdown
                            dropdownMode='select'
                            selected={startDate}
                            onChange={handleStartDate}
                            dateFormat='dd-MM-yyyy'
                            className='mt-2 px-3 block rounded-md border-0 bg-white/5 py-1 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-white text-sm sm:leading-6'
                          />
                        </div>
                        <div className='text-white'>
                          End Date:
                          <DatePicker
                            name='endDate'
                            showYearDropdown
                            showMonthDropdown
                            dropdownMode='select'
                            selected={endDate}
                            onChange={handleEndDate}
                            dateFormat='dd-MM-yyyy'
                            className='mt-2 px-3 block rounded-md border-0 bg-white/5 py-1 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-white text-sm sm:leading-6'
                          />
                        </div>
                      </div>
                      <div className=''>
                        <div className='text-white'>
                          <div className='hidden'>&nbsp</div>
                          <button
                            className='mt-6 ml-2 rounded-md bg-Gradient px-10 py-2  text-sm font-semibold text-black shadow-sm'
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
            <div className='flex w-full'>
              {chartData?.length > 0 ? (
                <div className='flex flex-wrap justify-between items-center flex-row w-full h-auto'>
                  <div className='md:w-[50%] w-full p-3'>
                    {chartData.map((element, index) => {
                      return (
                        <div
                          className='flex items-center w-full px-3 first:mb-4 last:mt-4'
                          key={index}
                        >
                          <div className='w-[20%]'>
                            <div
                              className={`p-4 rounded-full w-5 h-5 ${
                                index === 0 ? 'bg-cyan-500' : ''
                              } ${index === 1 ? 'bg-emerald-700' : ''} ${
                                index === 2 ? 'bg-amber-400' : ''
                              } `}
                            ></div>
                          </div>
                          <div className='w-[100%] text-left text-base mx-2'>
                            {element.label}
                          </div>
                          <div className='w-[40%] md:w-full text-center text-base'>
                            {element.value}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className='flex justify-left max-sm:w-full md:w-[45%] w-full p-3 items-start max-sm:items-center max-sm:justify-center  md:pr-24'>
                    <PieChart chartDataX={chartData} cData={data} />
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
