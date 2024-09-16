"use client";
import { useEffect, useState } from "react";
import useApiHook from "@/hooks/useApiHook";
import { RotatingLines } from "react-loader-spinner";
import { toast } from "react-toastify";
import { Heading } from "@/components/common/Heading";
import useDebounceHook from "@/hooks/useDebounceHook";
import Image from "next/image";

const Generations = () => {
  const { handleApiCall, isApiLoading } = useApiHook();
  const [searchKey, setSearchKey] = useState("");
  const [filteredGenerations, setFilteredGenerations] = useState([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [pageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [generations, setGenerations] = useState(
    [
      // {
      //   _id: null,
      //   prompt: null,
      //   imageUrl: null,
      //   ipExists: null,
      //   metadata: null,
      //   available: null,
      //   updatedAt: null,
      //   userIds: [],
      // },
    ]
  );
  const [filters, setFilters] = useState({
    ipExists: undefined,
    available: undefined,
  });

  useState(false);
  const clearStates = () => {
    setCount(() => 0);
    setPage(() => 0);
    setPageCount(() => 0);
    setTotalRecords(() => 0);
    setFilteredGenerations(() => []);
    setGenerations(() => []);
  };

  const clearFilters = () => {
    setSearchKey(() => "");
    setFilters(() => {
      return {
        available: undefined,
        ipExists: undefined,
      };
    });
  };

  const getGenerations = async () => {
    console.log({ filters });

    try {
      const result = await handleApiCall({
        method: "GET",
        url:
          `/generations/list?page=${page}&pageSize=${pageSize}` +
          `${
            filters.available !== undefined
              ? `&available=${filters.available}`
              : ""
          }` +
          `${
            filters.ipExists !== undefined
              ? `&ipExists=${filters.ipExists}`
              : ""
          }`,
      });

      setGenerations(() => result.data?.generations);
      setTotalRecords(() => result.data?.totalCount);
      // await calculatePageCount(result?.data?.count);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    }
  };

  const searchGenerations = useDebounceHook({
    callback: async (key) => {
      clearStates();
      try {
        const result = await handleApiCall({
          method: "GET",
          url: `/generations/search?key=${key}&page=${page}&pageSize=${pageSize}`,
        });

        setGenerations(() => result.data?.generations);
        setTotalRecords(() => result.data?.generations.length);
        // await calculatePageCount(result?.data?.count);
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong.");
      }
    },
    delay: 500,
  });

  const handleChangeIp = (e) => {
    setFilters((prev) => {
      let newValue = { ...prev };
      newValue.ipExists = e.target.value;
      return newValue;
    });
    // getGenerations();
  };

  const handleChangeAvailable = (e) => {
    setFilters((prev) => {
      let newValue = { ...prev };
      newValue.available = e.target.value;
      return newValue;
    });

    // getGenerations();
  };

  const calculatePageCount = async (count) => {
    setCount(count);
    setPageCount(Math.ceil(count / pageSize));
  };

  const getPageNumbers = () => {
    const delta = 1;
    const range = [];
    let start = 1;
    let end = Math.min(start + 1, pageCount);

    if (page === 1) {
      for (let i = start; i <= end; i++) {
        range.push(i);
      }
      if (end < pageCount) {
        range.push("...");
        range.push(pageCount - 1, pageCount);
      }
    } else {
      start = Math.max(1, page - delta);
      end = Math.min(page + delta, pageCount);

      if (page - start < delta) {
        end = Math.min(page + delta + (delta - (page - start)), pageCount);
        start = Math.max(1, end - 2 * delta);
      }

      if (end - page < delta) {
        start = Math.max(1, start - (delta - (end - page)));
        end = Math.min(page + delta, pageCount);
      }

      if (start > 1) {
        range.push(1);
        if (start > 2) {
          range.push("...");
        }
      }
      for (let i = start; i <= end; i++) {
        range.push(i);
      }

      if (end < pageCount) {
        if (end < pageCount - 1) {
          range.push("...");
        }
        range.push(pageCount);
      }
    }

    return range;
  };

  useEffect(() => {
    getGenerations();
    return () => {};
  }, []);

  useEffect(() => {
    getGenerations();
    return () => {};
  }, [filters]);

  return (
    <div className="flex flex-col w-full py-10 text-white">
      <div className="flex flex-row justify-between pb-3">
        <div className="w-1/4">
          <Heading text={`Generations (${totalRecords})`} />
        </div>
        <div className="w-3/4">
          <div className="flex flex-row items-center justify-end gap-x-3 text-white">
            {/* Search by prompt */}

            <button
              type="button"
              className="text-base text-white text-nowrap leading-3 md:leading-5 p-3 text-center rounded-2xl flex items-center justify-center"
              onClick={clearFilters}
            >
              Clear Filters
            </button>

            <input
              type="search"
              value={searchKey}
              onChange={(e) => {
                const key = e.target.value;
                setSearchKey(() => key);
                if (
                  key !== "" &&
                  key !== null &&
                  key !== undefined &&
                  key?.length !== 0
                ) {
                  searchGenerations(key);
                } else {
                  getGenerations();
                }
              }}
              placeholder="Search Prompt"
              className=" w-[217px] text-[#494949] text-base font-normal font-['Arial'] px-3 py-1.5 rounded-md border-0 bg-gray-200 text-gray-400 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-white sm:text-sm sm:leading-6"
            />

            {/* filter by ip */}
            <select
              value={filters.ipExists}
              onChange={handleChangeIp}
              className="w-[217px] text-[#494949] text-base font-normal font-['Arial'] px-3 py-2.5 rounded-md border-0 bg-gray-200 text-gray-400 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-white sm:text-sm sm:leading-6"
            >
              <option value={null} selected disabled>
                Filter by IP
              </option>
              <option value={true} className="text-white">
                Yes
              </option>
              <option value={false} className="text-white">
                No
              </option>
            </select>

            {/* filter by ip */}
            <select
              value={filters.available}
              onChange={handleChangeAvailable}
              className="w-[217px] text-[#494949] text-base font-normal font-['Arial'] px-3 py-2.5 rounded-md border-0 bg-gray-200 text-gray-400 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-white sm:text-sm sm:leading-6"
            >
              <option value={null} selected disabled>
                Filter by Availability
              </option>
              <option value={true} className="text-white">
                Available
              </option>
              <option value={false} className="text-white">
                Unavailable
              </option>
            </select>
          </div>
        </div>
      </div>

      <div className="scrollbar-custom mb-6">
        <table className="table-auto overflow-scroll text-white w-[1024px] lg:w-full border border-transparent mb-3">
          <thead className="bg-[#262626] text-white rounded-[4px]">
            <tr className="">
              {[
                {
                  title: "Image",
                  align: "start",
                },
                {
                  title: "Prompt",
                  align: "start",
                },
                {
                  title: "Swipes",
                  align: "center",
                },
                {
                  title: "IP",
                  align: "center",
                },
                {
                  title: "Available",
                  align: "center",
                },
              ].map((element, index) => (
                <TableHeader
                  key={index}
                  text={element.title}
                  align={element.align}
                />
              ))}
            </tr>
          </thead>

          <tbody>
            {isApiLoading ? (
              <tr className="w-full h-[300px]">
                <td className="w-full h-full">
                  <div className="flex justify-center items-center w-full h-full ">
                    <RotatingLines
                      height="40"
                      width="40"
                      color="gray"
                      strokeColor="white"
                      strokeWidth="5"
                      animationDuration="0.75"
                      ariaLabel="rotating-lines-loading"
                    />
                  </div>
                </td>
              </tr>
            ) : (
              <>
                {generations.length > 0 ? (
                  generations.map((generation, index) => {
                    return (
                      <tr key={index} className="my-3 row w-full darkGrayBg">
                        <td className="py-4 px-2 text-sm text-[#FFFFFF] text-left leading-[21.74px] rounded-l-[4px] border-b-8  border-t-8 border-black">
                          <Image
                            // loader={() => src}
                            src={
                              generation?.imageUrl
                                ? `${generation?.imageUrl}`
                                : `/assets/images/broken-file.svg`
                            }
                            alt="Description of image"
                            className="w-24 h-16 rounded-lg"
                            width={100} // Desired width in pixels
                            height={50} // Desired height in pixels
                            quality={100} // Quality (0 to 100), lower means more compression
                          />
                        </td>
                        <td className="py-4 px-2 text-lg font-base font-['Raleway'] text-[#808080] leading-[21.74px] border-b-8 border-t-8 border-black">
                          {generation?.prompt}
                        </td>
                        <td className="py-4 px-2 text-center text-base font-normal font-['Raleway'] text-[#808080] leading-[21.74px] border-b-8 border-t-8 border-black">
                          {generation?.userIds?.length}
                        </td>
                        <td className="py-4 px-2 text-center capitalize text-base font-normal font-['Raleway'] text-[#808080] leading-[21.74px] border-b-8 border-t-8 border-black">
                          {generation?.ipExists?.toString()}
                        </td>
                        <td className="py-4 px-2 text-center capitalize text-base font-normal font-['Raleway'] text-[#808080] leading-[21.74px] border-b-8 border-t-8 border-black">
                          {generation?.available?.toString()}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="pl-1 pt-4">
                      No generation found
                    </td>
                  </tr>
                )}
              </>
            )}
          </tbody>
        </table>
      </div>
      {pageCount > 1 && (
        <div className="flex gap-[10px] items-center justify-center mb-3">
          {page > 1 && (
            <button
              className="w-9 h-9 flex items-center justify-center bg-[#1B1B1B] rounded-[6px] cursor-pointer hover:bg-[#262626]"
              onClick={() => setPage(page - 1)}
            >
              <img
                src="/arrow-left.svg"
                alt="arrow-left"
                width={20}
                height={20}
              />
            </button>
          )}
          <div className="flex gap-[10px]">
            {getPageNumbers().map((pageNumber, index) => (
              <div
                key={index}
                className={`bg-[#1B1B1B] py-2 px-[9px] sm:px-[14px] md:px-[14px] lg:px-[14px] rounded-[6px] cursor-pointer ${
                  pageNumber === page && "!bg-[#3f3f3f]"
                }`}
                onClick={() => {
                  if (pageNumber !== "...") {
                    setPage(pageNumber);
                  }
                }}
              >
                {pageNumber}
              </div>
            ))}
          </div>
          {page < pageCount && (
            <button
              className="w-9 h-9 flex items-center justify-center bg-[#1B1B1B] rounded-[6px] cursor-pointer hover:bg-[#262626]"
              onClick={() => setPage(page + 1)}
            >
              <img
                src="/arrow-down.svg"
                alt="arrow-right"
                width={20}
                height={20}
              />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

function TableHeader({ text, align }) {
  return (
    <th
      className={`py-4 px-2 text-${align} text-sm text-[#FFFFFF] leading-[21.74px] text-left rounded-l-[4px]`}
    >
      {text}
    </th>
  );
}

export { Generations };
