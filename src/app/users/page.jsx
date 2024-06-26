"use client";
import { useState, useEffect, useId } from "react";
import useApiHook from "@/hooks/useApiHook";
import { RotatingLines } from "react-loader-spinner";
import { toast } from "react-toastify";
import BalanceEditor from "@/components/userList/BalanceEditor";
import useDebounceHook from "@/hooks/useDebounceHook";

const page = () => {
  const { handleApiCall, isApiLoading } = useApiHook();
  const [searchValue, setSearchValue] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [pageSize] = useState(10);
  const [deleting, setDeleting] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(false);
  const [users, setUsers] = useState(
    filteredUsers.map((user) => ({ ...user, isEditing: false }))
  );
  const [dropdownStates, setDropdownStates] = useState([]);
  const [showDropDown, setShowDropDown] = useState([]);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showConfirmationDeleteModal, setShowConfirmationDeleteModal] =
    useState(false);
  const [userDeleteId, setUserDeleteId] = useState("");
  const [selectedUserIndex, setSelectedUserIndex] = useState(null);
  const [confirmationAction, setConfirmationAction] = useState("");
  let url = `/employee/all-users?page=${page}&pageSize=${pageSize}&search=${searchValue}`;

  // // Function to handle input change
  const handleInputChange = (e, index) => {
    const { value } = e.target;
    const updatedUsers = [...users];
    updatedUsers[index].balance = parseInt(value);
    setUsers(updatedUsers);
  };

  // Function to toggle editing mode
  const toggleEditing = (index) => {
    const updatedUsers = [...users];
    updatedUsers[index].isEditing = !updatedUsers[index].isEditing;
    setUsers(updatedUsers);
  };

  const getAllUsers = async (e) => {
    const result = await handleApiCall({
      method: "GET",
      url: url,
    });

    setUsers(result.data?.users);
    await calculatePageCount(result?.data?.count);

    setDropdownStates(
      result.data?.users.map((employee) =>
        employee.status === "active" ? "active" : "inactive"
      )
    );
  };

  // const handleSearchInputChange = (e) => {
  //   const newSearchValue = e.target.value;
  //   setSearchValue(newSearchValue);
  // };

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
    setSelectedUserIndex(index);
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
        userId: filteredUsers[selectedUserIndex]._id,
        status: confirmationAction,
      },
    });
    if (result.status === 200) {
      const option = confirmationAction;
      const index = selectedUserIndex;
      const updatedDropdownStates = [...dropdownStates];
      updatedDropdownStates[index] = option;
      setDropdownStates(updatedDropdownStates);
      toast.success("Status updated successfully");
      setShowConfirmationModal(false);
    } else {
      toast.error("Something went wrong");
    }
  };

  const handleBalanceSave = () => {
    getAllUsers();
  };
  const handleCancel = async (index) => {
    getAllUsers();
    toggleEditing(index);
  };

  const handleInputChanges = useDebounceHook({
    callback: getAllUsers,
    delay: 550,
  });

  useEffect(() => {
    if (searchValue.trim().length > 3 || searchValue.length === 0) {
      setPage(1);
      handleInputChanges(searchValue);
    }
  }, [searchValue]);

  useEffect(() => {
    getAllUsers();
  }, [page, pageSize]);

  useEffect(() => {
    setShowDropDown(filteredUsers.map(() => false));
  }, [filteredUsers]);

  const getPageNumbers = () => {
    const delta = 0;
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

  const handleDeleteUser = async (userId) => {
    try {
      setDeleting(() => true);
      setDeleteUserId(() => userId);
      const result = await handleApiCall({
        method: "DELETE",
        url: `/admin/user/delete?user=${userId}`,
      });
      toast.success(
        result?.data?.message
          ? result?.data?.message
          : "User data deleted succesfully"
      );

      setUsers((prev) => {
        const removeIndex = prev.findIndex((element) => element._id === userId);
        return removeIndex !== -1
          ? [...prev.splice(removeIndex, 1)]
          : [...prev];
      });
      setShowConfirmationDeleteModal(false);
      await calculatePageCount(count - 1);
    } catch (error) {
      toast.error("Something went wrong, try again.");
    } finally {
      setDeleting(() => false);
      setDeleteUserId(() => null);
    }
  };

  const handleDelete = async (id) => {
    setShowConfirmationDeleteModal(true);
    setUserDeleteId(id);
  };

  return (
    <div className="px-3 md:px-14 py-6 w-full m-auto flex flex-col text-white">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 justify-between my-4">
        <h1 className="flex items-center text-[20px] font-[700] leading-[23.48px]">
          Users
        </h1>

        <div className="max-w-[334px] w-full flex items-center border border-white rounded-lg p-2">
          <input
            type="text"
            id="search"
            className="w-full bg-transparent"
            placeholder="Search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
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
      </div>

      <div className="scrollbar-custom mb-6">
        <table className="table-auto overflow-scroll text-white w-[1024px] lg:w-full border border-transparent mb-3">
          <thead className="bg-[#262626] text-white rounded-[4px]">
            <tr className="">
              <th className="py-4 px-2 text-sm text-[#FFFFFF] leading-[21.74px] text-center rounded-l-[4px]">
                Name
              </th>
              <th className="py-4 px-2 text-sm text-[#FFFFFF] leading-[21.74px] text-left">
                Email
              </th>
              <th className="py-4 px-2 text-sm text-[#FFFFFF] leading-[21.74px] text-left">
                Last Activity
              </th>
              <th className="py-4 px-2 text-sm text-[#FFFFFF] text-left leading-[21.74px]">
                Current Balance
              </th>
              <th className="py-4 px-2 text-sm text-[#FFFFFF] leading-[21.74px]">
                Status
              </th>
              <th className="py-4 px-2 text-sm text-[#FFFFFF] leading-[21.74px] rounded-r-[4px] text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((item, index) => {
                return (
                  <tr key={index} className="my-3 row w-full darkGrayBg">
                    <td className="py-4 px-2 text-sm text-[#FFFFFF] text-center leading-[21.74px] rounded-l-[4px] border-b-8  border-t-8 border-black">
                      {`${item.name}`}
                    </td>
                    <td className="py-4 px-2 text-sm text-[#808080] leading-[21.74px] border-b-8 border-t-8 border-black w-[200px] sm:w-[unset] md:w-[unset] lg:w-[unset] ">
                      {item.email}
                    </td>
                    <td className="py-4 px-2 w-[150px] sm:w-[150px] md:w-[170px] lg:w-[238px]  text-sm text-[#808080] leading-[21.74px] border-b-8 border-t-8 border-black">
                      {item?.createdAt.split("T")[0]}
                    </td>
                    <td className="coinsUpdate w-[125px] sm:w-[200px] md:w-[125px] lg:w-[161px] py-4 px-2 text-sm text-[#808080] leading-[21.74px] border-b-8  border-t-8 border-black">
                      <BalanceEditor
                        employee={item}
                        index={index}
                        handleInputChange={handleInputChange}
                        handleBalanceSave={handleBalanceSave}
                        handleCancel={handleCancel}
                      />
                    </td>
                    <td className="py-4 px-2 text-[10px] text-black leading-[21.74px] text-center border-b-8  border-t-8 border-black">
                      <div className="relative inline-block text-left">
                        <div>
                          <button
                            type="button"
                            className={`inline-flex justify-center items-center w-24 rounded-2xl px-2 py-1 text-sm font-medium ${
                              dropdownStates[index] === "active"
                                ? "bg-[#67C24B]"
                                : "bg-[#850101]"
                            }`}
                            id="options-menu"
                            aria-haspopup="true"
                            aria-expanded="true"
                            onClick={() => handleShowDropDown(index)}
                            disabled={isApiLoading || deleting}
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
                            className="origin-top-right absolute right-0 mt-2 w-20 rounded-md shadow-lg border border-white text-white bg-[#0C0C0C] z-[5]"
                            role="menu"
                            aria-orientation="vertical"
                            aria-labelledby="options-menu"
                          >
                            <div role="none">
                              <button
                                className="text-left block w-full px-4 py-2 text-sm hover:bg-[#67C24B] hover:text-white border-b border-white"
                                onClick={() =>
                                  handleOptionClick("active", index)
                                }
                              >
                                Active
                              </button>
                              <button
                                className="text-left block w-full px-4 py-2 text-sm hover:bg-[#850101] hover:text-white"
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
                    <td className="py-4 px-2 border-b-8 border-t-8 border-black">
                      <div className="flex justify-center items-center">
                        <button
                          className="bg-[#850101] p-1 rounded-[4px]"
                          disabled={deleting}
                          onClick={() => {
                            handleDelete(item._id);
                          }}
                        >
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
                <td colSpan="5" className="pl-1 pt-4">
                  No user found
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
                  pageNumber === page && "!bg-[#262626]"
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
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-center"
                  onClick={() => setShowConfirmationModal(false)}
                >
                  Cancle
                </button>
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mr-2 w-[5rem] text-center"
                  onClick={confirmAction}
                >
                  {isApiLoading ? (
                    <div className="flex justify-center items-center">
                      <RotatingLines
                        height="20"
                        width="20"
                        color="gray"
                        strokeColor="white"
                        strokeWidth="5"
                        animationDuration="0.75"
                        ariaLabel="rotating-lines-loading"
                      />
                    </div>
                  ) : (
                    <span>Confirm</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Confirmation Delete Modal */}
      <div>
        {showConfirmationDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center shadow-lg bg-opacity-50">
            <div className="bg-[#0C0C0C] p-4 rounded flex flex-col gap-3 max-w-[500px] w-full border border-white">
              <h1 className="text-[26px] font-[700]">Confirmation</h1>
              <p className="mb-4">Are you sure you want to delete this user?</p>
              <div className="flex justify-end gap-4  mt-5">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-center"
                  onClick={() => setShowConfirmationDeleteModal(false)}
                >
                  Cancle
                </button>
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mr-2 w-[5rem] text-center"
                  onClick={() => handleDeleteUser(userDeleteId)}
                >
                  {isApiLoading ? (
                    <div className="flex justify-center items-center">
                      <RotatingLines
                        height="20"
                        width="20"
                        color="gray"
                        strokeColor="white"
                        strokeWidth="5"
                        animationDuration="0.75"
                        ariaLabel="rotating-lines-loading"
                      />
                    </div>
                  ) : (
                    <span>Confirm</span>
                  )}
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
