'use client';
import { useEffect, useState, useRef } from 'react';
import BarChart from './BarChart';
import useApiHook from '@/hooks/useApiHook';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import LoadingRotatingLines from '@/components/common/LoadingRotatingLines';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { isMobile } from 'react-device-detect';
import { RotatingLines } from 'react-loader-spinner';

export default function page() {
  const [showCustomDateFields, setShowCustomDateFields] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Last 24 Hours');
  const [showLoading, setShowLoading] = useState(false);
  const [filterType, setfilterType] = useState('');
  const [data, setData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const { handleApiCall, isApiLoading } = useApiHook();
  const contentRef = useRef(null);

  const currentDate = new Date();

  const bgColors = [
    'bg-red-500',
    'bg-blue-500',
    'bg-yellow-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-orange',
    'bg-indigo-500',
    'bg-pink-500',
  ];

  const handleStartDate = (date) => {
    setStartDate(date);
    // Ensure end date is not before start date
    if (endDate && date > endDate) {
      setEndDate(date);
    }
  };

  const handleEndDate = (date) => {
    setEndDate(date);
  };

  const handleCustomFilter = () => {
    setShowCustomDateFields(!showCustomDateFields);
    setSelectedOption('Custom');
    setIsOpen(false);
  };

  const dropdownRef = useRef(null);

  const handleDownloadPDF = async () => {
    // Hide non-printable elements temporarily for PDF generation
    const noPrintElements = document.querySelectorAll('.no-print');
    noPrintElements.forEach((el) => el.classList.add('hidden'));

    // Modify styles for PDF generation (if needed)
    const designChangeElements = document.querySelectorAll('.user-stats');
    designChangeElements.forEach((el) => el.classList.add('text-black'));

    const designChangeDropdown = document.querySelectorAll('.change-bg');
    designChangeDropdown.forEach((el) =>
      el.classList.add('bg-neutral-800', 'border-0')
    );

    const input = contentRef.current;
    if (input && isMobile) {
      const firstDiv = input.querySelector('.page-1');
      if (firstDiv) {
        firstDiv.style.height = '550px';
      }
    }
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const element = document.getElementById('page-break');

    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL('image/png');
    const imgProps = pdf.getImageProperties(imgData);
    let imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

    // // Adjust image height if needed
    // if (imgHeight > 250) imgHeight = imgHeight - 15;

    let heightLeft = imgHeight;
    let position = 0;
    let index = 0;

    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      if (index > 0) position = position + 10; // Adjust for margin between pages
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;
      index++;
    }

    // Save the PDF file
    pdf.save('statistics.pdf');

    // Restore original styles and visibility of non-printable elements
    noPrintElements.forEach((el) => el.classList.remove('hidden'));
    designChangeElements.forEach((el) => el.classList.remove('text-black'));
    designChangeDropdown.forEach((el) =>
      el.classList.remove('bg-neutral-800', 'border-0')
    );
    if (input && isMobile) {
      const firstDiv = input.querySelector('.page-1');
      if (firstDiv) {
        firstDiv.style.height = 'auto';
      }
    }
  };

  const handleOptionClick = async (type, value2) => {
    setSelectedOption(value2);
    setIsOpen(false);
    setShowCustomDateFields(false);
    let start, end;
    switch (type) {
      case 'last24Hours':
        start = new Date();
        start.setHours(0, 0, 0, 0);
        end = new Date(start);
        end.setHours(23, 59, 59, 59);
        break;
      case 'yesterday':
        start = new Date();
        start.setDate(start.getDate() - 1);
        start.setHours(0, 0, 0, 0);
        end = new Date(start);
        end.setHours(23, 59, 59, 59);
        break;
      case 'lastWeek':
        start = new Date();
        start.setHours(0, 0, 0, 0);
        start.setDate(start.getDate() - 7);
        end = new Date();
        end.setHours(23, 59, 59, 59);
        break;
      case 'lastMonth':
        start = new Date();
        start.setMonth(start.getMonth() - 1);
        start.setHours(0, 0, 0, 0);
        end = new Date();
        end.setHours(23, 59, 59, 59);
        break;
      case 'custom':
        setShowCustomDateFields(true);
        start = startDate;
        start.setHours(0, 0, 0, 0);
        end = endDate;
        end.setHours(23, 59, 59, 59);
        break;
      default:
        start = new Date();
        start.setHours(0, 0, 0, 0);
        end = new Date();
        end.setHours(23, 59, 59, 59);
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
          {
            label: 'Retweet Count',
            value: result.data?.retweetCount ? result.data?.retweetCount : 0,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
          },
          {
            label: 'Follow Twitter Count',
            value: result.data?.followTwitterCount
              ? result.data?.followTwitterCount
              : 0,
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderColor: 'rgba(153, 102, 255, 1)',
          },
          {
            label: 'Join Discord Count',
            value: result.data?.joinDiscordCount
              ? result.data?.joinDiscordCount
              : 0,
            backgroundColor: 'rgba(255, 159, 64, 0.2)',
            borderColor: 'rgba(255, 159, 64, 1)',
          },
          {
            label: 'Share Count',
            value:
              (result.data?.shareDiscordCount || 0) +
              (result.data?.shareTwitterCount || 0),
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
          },
          {
            label: 'Panorama Image Count',
            value: result.data?.panoramaCount ? result.data?.panoramaCount : 0,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
          },
        ]);
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  useEffect(() => {
    getUsersStats();
    //Add event listener to handle clicks outside of the dropdown
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      // Cleanup the event listener on component unmount
      document.removeEventListener('mousedown', handleClickOutside);
    };

    //return () => {};
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  return (
    <div ref={contentRef} className="text-white">
      <h2 className=" user-stats flex font-bold  w-full px-8 py-5 mt-8">
        User Statistics
      </h2>
      <div className="grid grid-cols-7 max-sm:grid-cols-1 text-white px-4 items-stretch">
        <div
          className="col-span-2 max-sm:col-span-1 text-white px-4 page-1 overflow-y-auto screenHeightForStatistics border-b border-gray-200"
          id="page-1"
        >
          {chartData.map((element) => {
            return (
              <div className="flex flex-wrap flex-row justify-between items-center w-full bg-neutral-800 rounded-md px-4 py-8 mb-4 last:mt-4">
                <div className="">{element.label}</div>
                <div className="text-4xl font-bold text-center">
                  {element.value}
                </div>
              </div>
            );
          })}
        </div>
        {/* <div className='md:hidden lg:hidden' id='page-break'></div> */}
        <div
          className={`col-span-5 max-sm:col-span-1 max-sm:mt-4 text-white px-4 h-full page-1 ${
            showCustomDateFields ? 'mb-5' : ''
          }`}
        >
          <div className="bg-neutral-800 p-4 rounded-md">
            <div className="flex text-white w-full justify-between">
              <button
                className="no-print w-40 rounded-md bg-Gradient ml-0.5 mt-0.5 px-6 text-sm font-semibold text-black shadow-sm"
                onClick={handleDownloadPDF}
              >
                Download PDF
              </button>
              {/* <select
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
              </select> */}
              <div className="relative flex" ref={dropdownRef}>
                <div className="flex justify-center w-full mr-3">
                  {isApiLoading && (
                    <RotatingLines
                      height="28"
                      width="28"
                      color="blue"
                      strokeWidth="5"
                      animationDuration="0.75"
                      ariaLabel="rotating-lines-loading"
                    />
                  )}
                </div>
                <div className="max-sm:ml-1 relative inline-block">
                  <button
                    onClick={toggleDropdown}
                    className="bg-black change-bg text-left text-sm inline-block px-3 py-2 h-10 rounded-lg font-light cursor-pointer w-40 border border-gray-150"
                  >
                    {selectedOption}
                    <svg
                      width="16"
                      height="16"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className=" absolute z-30 top-3 right-2 cursor-pointer"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </button>
                  {isOpen && (
                    <ul className="absolute bg-black w-40 border border-gray-150 pt-1 rounded-lg text-xs">
                      <li
                        onClick={() =>
                          handleOptionClick('last24Hours', 'Last 24 Hours')
                        }
                        className="cursor-pointer px-3 py-1 hover:bg-gray-100"
                      >
                        Last 24 Hours
                      </li>
                      {/* <li
                      onClick={() => handleOptionClick('yestery', 'Yesterday')}
                      className='cursor-pointer px-3 py-1 hover:bg-gray-100'
                    >
                      Yesterday
                    </li> */}
                      <li
                        onClick={() =>
                          handleOptionClick('lastWeek', 'Last Week')
                        }
                        className="cursor-pointer px-3 py-1 hover:bg-gray-100"
                      >
                        Last Week
                      </li>
                      <li
                        onClick={() =>
                          handleOptionClick('lastMonth', 'Last Month')
                        }
                        className="cursor-pointer px-3 py-1 hover:bg-gray-100"
                      >
                        Last Month
                      </li>
                      <li
                        onClick={handleCustomFilter}
                        className="cursor-pointer px-3 py-1 hover:bg-gray-100"
                      >
                        Custom
                      </li>
                    </ul>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-row flex-wrap no-print">
              <div>
                {showCustomDateFields ? (
                  <>
                    <div className="flex h-auto mt-3">
                      <div className="flex flex-wrap">
                        <div className="text-white max-sm:w-full mt-3 md:w-[35%]">
                          Start Date:
                          <DatePicker
                            name="startDate"
                            showYearDropdown
                            showMonthDropdown
                            dropdownMode="select"
                            selected={startDate}
                            selectsStart
                            startDate={startDate}
                            endDate={endDate}
                            onChange={handleStartDate}
                            dateFormat="dd-MM-yyyy"
                            className="mt-2 px-3 md:mr-2 rounded-md border-0 bg-white/5 py-1 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-white text-sm sm:leading-6"
                          />
                        </div>
                        <div className="text-white max-sm:w-full mt-3 md:w-[35%]">
                          End Date:
                          <DatePicker
                            name="endDate"
                            showYearDropdown
                            showMonthDropdown
                            dropdownMode="select"
                            selected={endDate}
                            selectsEnd
                            startDate={startDate}
                            endDate={endDate}
                            minDate={startDate}
                            maxDate={currentDate}
                            onChange={handleEndDate}
                            dateFormat="dd-MM-yyyy"
                            className="mt-2 px-3 md:mr-2 rounded-md border-0 bg-white/5 py-1 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-white text-sm sm:leading-6"
                          />
                        </div>
                        <div className="text-white max-sm:w-full mt-3  md:w-[20%]">
                          <div className="hidden">&nbsp</div>
                          <button
                            className="md:mt-7 ml-2 max-sm:ml-0 rounded-md bg-Gradient px-10 py-2  text-sm font-semibold text-black shadow-sm"
                            onClick={() =>
                              handleOptionClick('custom', 'Custom')
                            }
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
            <div className="flex w-full">
              {chartData?.length > 0 ? (
                <div className="flex flex-wrap justify-between flex-row w-full h-auto">
                  <div className="md:w-[40%] w-full p-3 overflow-y-auto">
                    {chartData.map((element, index) => {
                      return (
                        <div
                          className="flex items-center w-full px-3 first:mt-4 mb-4 last:mt-4 last:mb-0"
                          key={index}
                        >
                          <div className="w-[20%]">
                            <div
                              className={`p-4 rounded-full w-5 h-5
                                ${bgColors[index]} flex items-center justify-center
                                `}
                            ></div>
                          </div>
                          <div className="w-[100%] text-left text-base mx-2">
                            {element.label}
                          </div>
                          <div className="w-[40%] md:w-full text-center text-base">
                            {element.value}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="pieChart min-h-[400px] flexCenter max-sm:w-full md:w-[60%] w-full p-3">
                    <BarChart chartDataX={chartData} cData={data} />
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
