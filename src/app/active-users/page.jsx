"use client";
import { useState, useEffect } from "react";
import useApiHook from "@/hooks/useApiHook";
const page = () => {
  const { handleApiCall, isApiLoading } = useApiHook();
  const [searchValue, setSearchValue] = useState("");
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [pageSize] = useState(12);
  const [employees, setEmpoyees] = useState([]);
  let url = `/employee/all-users?page=${page}&pageSize=${pageSize}`;

  const getAllEmployees = async () => {
    const result = await handleApiCall({
      method: "GET",
      url: url,
    });
    const sortedEmployees = result.data?.users?.sort((a, b) =>
      a.firstName.localeCompare(b.firstName)
    );
    console.log("result", result);
    setEmpoyees(sortedEmployees);
    await calculatePageCount(result?.data?.count);
  };

  const filterEmployees = (searchValue) => {
    if (searchValue.trim() === "") {
      setFilteredEmployees(employees);
    } else {
      const filteredData = employees.filter((employee) => {
        const lowerCaseSearchValue = searchValue.toLowerCase();
        const fullName =
          `${employee.firstName} ${employee.lastName}`.toLowerCase();
        return fullName.includes(lowerCaseSearchValue);
      });
      setFilteredEmployees(filteredData);
    }
  };

  const handleSearchInputChange = (e) => {
    const newSearchValue = e.target.value;
    setSearchValue(newSearchValue);
    filterEmployees(newSearchValue);
  };

  const calculatePageCount = async (count) => {
    setCount(count);
    setPageCount(Math.ceil(count / pageSize));
  };

  console.log(count, pageCount, page);
  useEffect(() => {
    setFilteredEmployees(employees);
  }, [employees]);

  useEffect(() => {
    getAllEmployees();
  }, [page, pageSize]);

  return (
    <div className="px-3 md:px-14 py-6 max-w-screen-3xl h-full w-full m-auto flex flex-col min-w-80 z-10 text-white">
      <div className="flex justify-between items-center">
        <h1 className="text-[20px] font-[700] leading-[23.48px]">
          Active users
        </h1>
        {filteredEmployees.length > 0 && (
          <div className="max-w-[334px] w-full flex items-center border border-white rounded-lg p-3">
            <input
              type="text"
              id="search"
              className="w-full bg-transparent"
              placeholder="Search"
              value={searchValue}
              onChange={handleSearchInputChange}
            />
            <label htmlFor="search" className="cursor-pointer">
              <img
                src="/search-normal.svg"
                alt="search icon"
                width={24}
                height={24}
              />
            </label>
          </div>
        )}
      </div>
      {isApiLoading ? (
        <div className="w-full flex items-center justify-center">
          <svg
            className="animate-spin -ml-1 mr-3 h-16 w-16 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      ) : (
        <table className="text-white w-full border border-transparent mt-4 mb-6">
          <thead className="sticky top-0 bg-[#262626] text-white rounded-[4px]">
            <tr className="">
              <th className="py-4 px-2 text-[10px] text-[#FFFFFF] leading-[11.74px] text-left rounded-l-[4px]">
                Employee Name
              </th>
              <th className="py-4 px-2 text-[10px] text-[#FFFFFF] leading-[11.74px] text-left">
                Employee Email
              </th>
              <th className="py-2 px-4 text-[10px] text-[#FFFFFF] leading-[11.74px]">
                Last Activity
              </th>
              <th className="py-4 px-2 text-[10px] text-[#FFFFFF] leading-[11.74px]">
                Status
              </th>
              <th className="py-4 px-2 text-[10px] text-[#FFFFFF] leading-[11.74px] rounded-r-[4px]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((item, index) => {
                return (
                  <tr key={index} className="my-3 row w-full darkGrayBg">
                    <td className="py-4 px-2 text-[10px] text-[#FFFFFF] leading-[11.74px] rounded-l-[4px]">
                      {`${item.firstName} ${item.lastName}`}
                    </td>
                    <td className="py-4 px-2 text-[10px] text-[#808080] leading-[11.74px]">
                      {item.email}
                    </td>
                    <td className="py-4 px-2 text-[10px] text-[#808080] leading-[11.74px] text-center">
                      22-03-2024
                    </td>
                    <td className="py-4 px-2 text-[10px] text-[#808080] leading-[11.74px] text-center">
                      {item.status}
                    </td>
                    <td className="py-4 px-2 rounded-r-[4px]">
                      <div className="flex justify-center items-center">
                        <button className="cursor-pointer bg-[#850101] p-1 rounded-[4px] ">
                          <img
                            src="/trash.svg"
                            alt="delete_icon"
                            width={16}
                            height={16}
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="pl-1">
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
      {pageCount > 1 && (
        <div className="flex gap-[10px] items-center justify-center">
          {page > 1 && (
            <button
              className="w-9 h-9 flex items-center justify-center  bg-[#1B1B1B] rounded-[6px] cursor-pointer hover:bg-[#262626]"
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
            {Array.from({ length: pageCount }, (_, i) => (
              <div
                key={i}
                className={`bg-[#1B1B1B] py-2 px-[14px] rounded-[6px] cursor-pointer ${
                  i + 1 == page && "!bg-[#262626]"
                }`}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
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

export default page;
