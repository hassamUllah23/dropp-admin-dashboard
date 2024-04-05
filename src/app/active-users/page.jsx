"use client";
import { useState, useEffect } from "react";
import useApiHook from "@/hooks/useApiHook";
import { RotatingLines } from "react-loader-spinner";
import { toast } from "react-toastify";

const page = () => {
  const { handleApiCall, isApiLoading } = useApiHook();
  const [searchValue, setSearchValue] = useState("");
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [pageSize] = useState(10);
  const [employees, setEmployees] = useState(
    filteredEmployees.map((employee) => ({ ...employee, isEditing: false }))
  );
  const [dropdownStates, setDropdownStates] = useState([]);
  const [showDropDown, setShowDropDown] = useState([]);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedEmployeeIndex, setSelectedEmployeeIndex] = useState(null);
  const [confirmationAction, setConfirmationAction] = useState("");

  let url = `/employee/all-users?page=${page}&pageSize=${pageSize}`;

  // // Function to handle input change
  const handleInputChange = (e, index) => {
    const { value } = e.target;
    const updatedEmployees = [...employees];
    // updatedEmployees[index].coins = value;
    setEmployees(updatedEmployees);
  };

  // Function to toggle editing mode
  const toggleEditing = (index) => {
    const updatedEmployees = [...employees];
    updatedEmployees[index].isEditing = !updatedEmployees[index].isEditing;
    setEmployees(updatedEmployees);
  };
  const getAllEmployees = async () => {
    const result = await handleApiCall({
      method: "GET",
      url: url,
    });
    const sortedEmployees = result.data?.users?.sort((a, b) =>
      a.firstName.localeCompare(b.firstName)
    );
    setEmployees(sortedEmployees);
    await calculatePageCount(result?.data?.count);
    setDropdownStates(
      sortedEmployees.map((employee) =>
        employee.status === "active" ? "active" : "inactive"
      )
    );
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

  const handleShowDropDown = (index) => {
    setShowDropDown((prevState) => {
      const newState = [...prevState];
      newState[index] = !newState[index];
      return newState;
    });
  };
  const handleOptionClick = (option, index) => {
    setConfirmationAction(option);
    setSelectedEmployeeIndex(index);
    setShowDropDown((prevState) => {
      const newState = [...prevState];
      newState[index] = false;
      return newState;
    });
    setShowConfirmationModal(true);
  };

  const confirmAction = async () => {
    const result = await handleApiCall({
      method: "PUT",
      url: `/admin/user/status`,
      data: {
        userId: filteredEmployees[selectedEmployeeIndex]._id,
        status: confirmationAction,
      },
    });
    if (result.status === 200) {
      const option = confirmationAction;
      const index = selectedEmployeeIndex;
      const updatedDropdownStates = [...dropdownStates];
      updatedDropdownStates[index] = option;
      setDropdownStates(updatedDropdownStates);
      toast.success("Status updated successfully");
      setShowConfirmationModal(false);
    } else {
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    setFilteredEmployees(employees);
  }, [employees]);

  useEffect(() => {
    getAllEmployees();
  }, [page, pageSize]);

  useEffect(() => {
    setShowDropDown(filteredEmployees.map(() => false));
  }, [filteredEmployees]);

  return (
    <div className="px-3 md:px-14 py-6 w-full m-auto flex flex-col text-white">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 justify-between my-4">
        <h1 className="flex items-center text-[20px] font-[700] leading-[23.48px]">
          Active users
        </h1>
        {isApiLoading && (
          <div className="flex justify-center items-center">
            <RotatingLines
              height="24"
              width="24"
              color="blue"
              strokeWidth="5"
              animationDuration="0.75"
              ariaLabel="rotating-lines-loading"
            />
          </div>
        )}
        {filteredEmployees.length > 0 && (
          <div className="max-w-[334px] w-full flex items-center border border-white rounded-lg p-2">
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

      <div className="overflow-x-auto ">
        <table className="text-white w-full border border-transparent mb-6">
          <thead className="bg-[#262626] text-white rounded-[4px]">
            <tr className="">
              <th className="py-4 px-2 text-[10px] text-[#FFFFFF] leading-[11.74px] text-left rounded-l-[4px]">
                Employee Name
              </th>
              <th className="py-4 px-2 text-[10px] text-[#FFFFFF] leading-[11.74px] text-left">
                Employee Email
              </th>
              <th className="py-4 px-2 text-[10px] text-[#FFFFFF] leading-[11.74px] text-left">
                Last Activity
              </th>
              {/* <th className="py-4 px-2 text-[10px] text-[#FFFFFF] text-left leading-[11.74px]">
                Coins
              </th> */}
              <th className="py-4 px-2 text-[10px] text-[#FFFFFF] leading-[11.74px]">
                Status
              </th>
              <th className="py-4 px-2 text-[10px] text-[#FFFFFF] leading-[11.74px] rounded-r-[4px] text-right">
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
                    <td className="py-4 px-2 text-[10px] text-[#808080] leading-[11.74px]">
                      22-03-2024
                    </td>
                    {/* <td className="py-4 px-2 text-[10px] text-[#808080] leading-[11.74px] relative group cursor-pointer">
                      <div className="flex gap-2 items-center">
                        {item.isEditing ? (
                          <input
                            type="number"
                            value={item.coins}
                            onChange={(e) => handleInputChange(e, index)}
                            autoFocus
                            className="bg-[#0C0C0C] rounded-[4px] p-4"
                          />
                        ) : (
                          <div className="flex gap-[5px] items-center">
                            <img
                              src="/assets/images/sidebar/dropcoin.png"
                              alt="dropcoin"
                              width={21.93}
                              height={26.01}
                            />
                            <span className="text-[14px] leading-[16.1px]">
                              30
                            </span>
                          </div>
                        )}
                        {!item.isEditing ? (
                          <div className="absolute right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center items-center">
                            <button onClick={() => toggleEditing(index)}>
                              <img
                                src="/edit-2.svg"
                                alt="arrow"
                                width={21.33}
                                height={21.33}
                              />
                            </button>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <button onClick={() => toggleEditing(index)}>
                              <img
                                src="/close-square.svg"
                                alt="close-button"
                                width={32}
                                height={32}
                              />
                            </button>
                            <button>
                              <img
                                src="/tick-square.svg"
                                alt="close-button"
                                width={32}
                                height={32}
                              />
                            </button>
                          </div>
                        )}
                      </div>
                    </td> */}
                    <td className="py-4 px-2 text-[10px] text-black leading-[11.74px] text-center">
                      <div className="relative inline-block text-left">
                        <div>
                          <button
                            type="button"
                            className={`inline-flex justify-center items-center w-full max-w-[100px] rounded-2xl px-2 py-1 text-sm font-medium ${
                              dropdownStates[index] === "active"
                                ? "bg-[#67C24B]"
                                : "bg-[#850101]"
                            }`}
                            id="options-menu"
                            aria-haspopup="true"
                            aria-expanded="true"
                            onClick={() => handleShowDropDown(index)}
                          >
                            {dropdownStates[index] === "active"
                              ? "Active"
                              : "Inactive"}
                            <svg
                              className="-mr-1 ml-2 h-5 w-5"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 12l-6-6h12l-6 6z"
                              />
                            </svg>
                          </button>
                        </div>

                        {showDropDown[index] && (
                          <div
                            className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg border border-white text-white bg-[#0C0C0C] z-50"
                            role="menu"
                            aria-orientation="vertical"
                            aria-labelledby="options-menu"
                          >
                            <div role="none">
                              <button
                                className="block w-full px-4 py-2 text-sm hover:bg-[#67C24B] hover:text-white border-b border-white"
                                onClick={() =>
                                  handleOptionClick("active", index)
                                }
                              >
                                Active
                              </button>
                              <button
                                className="block w-full px-4 py-2 text-sm hover:bg-[#850101] hover:text-white"
                                onClick={() =>
                                  handleOptionClick("inactive", index)
                                }
                              >
                                Inactive
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-2 rounded-r-[4px]">
                      <div className="flex justify-end items-center">
                        <button className="bg-[#850101] p-1 rounded-[4px] cursor-not-allowed" disabled={true}>
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
      </div>
      {pageCount > 1 && (
        <div className="flex gap-[10px] items-center justify-center mb-3">
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
      <div>
        {showConfirmationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center shadow-lg bg-opacity-50">
            <div className="bg-[#0C0C0C] p-4 rounded flex flex-col gap-3 max-w-[500px] w-full border border-white">
              <h1 className="text-[26px] font-[700]">Confirmation</h1>
              <p className="mb-4">
                Are you sure you want to {confirmationAction} the status?
              </p>
              <div className="flex justify-end gap-4  mt-5">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  onClick={() => setShowConfirmationModal(false)}
                >
                  Cancle
                </button>
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mr-2"
                  onClick={confirmAction}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default page;
