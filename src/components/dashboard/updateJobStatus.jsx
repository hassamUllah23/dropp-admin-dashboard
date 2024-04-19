import React from "react";
import { useEffect, useRef, useState } from "react";
import { useSelector, selectAuth } from "@/lib";

const UpdateJobStatus = ({
  jobKeys,
  jobStatus,
  showJobStatus,
  handleStatusClick,
  setShowJobStatus,
  isFromDashboard,
}) => {
  const assignTaskPopupRef = useRef(null);
  const [showAssignTaskPopup, setShowAssignTaskPopup] = useState(false);
  const auth = useSelector(selectAuth);
  let isAdmin = auth?.userInfo?.user?.role;

  const assignTaskPopup = () => {
    setShowAssignTaskPopup(!showAssignTaskPopup);
  };
  const showStatuses = () => {
    setShowJobStatus(!showJobStatus);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        assignTaskPopupRef.current &&
        !assignTaskPopupRef.current.contains(event.target)
      ) {
        setShowAssignTaskPopup(false);
        setShowJobStatus(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [assignTaskPopupRef]);
  return (
    <div
      className={`${!isFromDashboard && "absolute top-4 right-8 md:right-14"}`}
      ref={assignTaskPopupRef}
    >
      <button
        onClick={showStatuses}
        // disabled={jobStatus === "completed"}
        className={`w-[4.4rem] btn-status leading-6 text-[.5rem] flexCenter rounded-2xl font-medium ${
          jobStatus === "assigned"
            ? "assignedBg assignedClr"
            : jobStatus === "rejected"
            ? "rejectedBg rejectedClr"
            : jobStatus === "generating"
            ? "generatingBg generatingClr"
            : jobStatus === "in-queue"
            ? "queueBg queueBgClr"
            : "completedBg completedClr"
        }`}
      >
        <span
          className={`inline-block w-2 h-2 rounded-full mr-1 ${
            jobStatus === "assigned"
              ? "assignedSpanBg"
              : jobStatus === "rejected"
              ? "rejectedSpanBg"
              : jobStatus === "generating"
              ? "generatingSpanBg"
              : jobStatus === "in-queue"
              ? "queueBgSpanBg"
              : "completedSpanBg"
          }`}
        ></span>
        {jobStatus === "assigned"
          ? "Assigned"
          : jobStatus === "rejected"
          ? "Rejected"
          : jobStatus === "generating"
          ? "Generating"
          : jobStatus === "in-queue"
          ? "In Queue"
          : "Completed"}
      </button>

      {showJobStatus && (
        <div
          className={`flex flex-col absolute left-0 bgDarkGray py-2 px-4 leading-5 text-white text-xs font-light w-40 rounded-lg z-10 cursor-pointer ${
            isFromDashboard ? "top-14" : "top-7"
          }`}
        >
          <p
            className="blackBorderBottom py-2 hover:font-semibold"
            onClick={() => handleStatusClick("assigned")}
          >
            Assigned
          </p>
          <p
            className="blackBorderBottom py-2 hover:font-semibold"
            onClick={() => handleStatusClick("rejected")}
          >
            Rejected
          </p>
          <p
            className="blackBorderBottom py-2 hover:font-semibold"
            onClick={() => handleStatusClick("generating")}
          >
            Generating
          </p>
          <p
            className="blackBorderBottom py-2 hover:font-semibold"
            onClick={() => handleStatusClick("completed")}
          >
            Completed
          </p>
          <p
            className="py-2 hover:font-semibold"
            onClick={() => handleStatusClick("in-queue")}
          >
            In-queue
          </p>
        </div>
      )}
      <div className="flex items-center">
        {isAdmin == "admins" && (
          <div className="flex assignedEmployees blackBG py-2 pl-2 mr-1 rounded-3xl">
            <div className="flex -space-x-2 rtl:space-x-reverse  items-center pr-1">
              {employees
                .filter((employee) => employee.assigned === true)
                .slice(0, 2)
                .map((employee, index) => (
                  <img
                    className={`w-6 h-6 border rounded-full ${
                      jobKeys.platform == "aramco"
                        ? " border-white"
                        : " border-gray-150"
                    }`}
                    src={employee.image}
                    key={index}
                    alt=""
                  />
                ))}

              {employees.filter((employee) => employee.assigned === true)
                .length > 2 && (
                <button
                  className={`flex items-center justify-center w-6 h-6 text-[.6rem] font-semibold text-black bg-white rounded-full hover:bg-gray-800  border ${
                    jobKeys.platform == "aramco"
                      ? " border-white"
                      : " border-gray-150"
                  }`}
                >
                  +
                  {Math.min(
                    employees.filter((employee) => employee.assigned === true)
                      ?.length - 2
                  )}
                </button>
              )}

              <span
                className="inline-block pl-4 cursor-pointer"
                onClick={assignTaskPopup}
              >
                <svg
                  width="11"
                  height="12"
                  viewBox="0 0 11 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.85323 4.64445L5.95545 7.54223C5.61323 7.88446 5.05323 7.88446 4.71101 7.54223L1.81323 4.64445"
                    stroke="#8D939C"
                    strokeWidth="0.666667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdateJobStatus;
