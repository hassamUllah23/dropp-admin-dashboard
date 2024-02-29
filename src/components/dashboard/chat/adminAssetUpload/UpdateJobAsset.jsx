import LoadingSvg from "@/components/common/LoadingSvg";
import React, { useState, useRef } from "react";
export default function UpdateJobAsset({ onUploadAdminAsset, loading, type }) {
  const [showLoading, setShowLoading] = useState(false);
  const fileInputRef = useRef();

  const handleFiles = (file) => {
    setShowLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      setShowLoading(false);
      onUploadAdminAsset(file);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFiles(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleFiles(file);
  };

  const openFileDialog = () => {
    fileInputRef.current.click();
  };
  return (
    <>
      <div className="pl-0 pr-2 md:px-5 pb-1 my-3 md:mt-10 text-white">
        <div>
          <div className=" flex space-x-2">
            <div className="text-white flex justify-center items-start uppercase  w-8 md:w-12 mr-2">
              <img
                src="/assets/images/chat/ai.png"
                alt="AiImage"
                className="w-8 md:w-12"
              />
            </div>
            <div className="w-full">
              <div className=" p-3 md:p-14 relative bg-no-repeat bg-cover bgGrayImage rounded-xl">
                <div className=" absolute top-2 right-2 md:top-3 md:right-3 cursor-pointer">
                  <img
                    src="/assets/images/chat/info.svg"
                    className=" w-4 h-4 md:w-7 md:h-7"
                  />
                </div>

                <div>
                  {showLoading ? (
                    <div className="flexCenter relative loadingArea py-16">
                      <LoadingSvg color={"#fafafa"} />
                    </div>
                  ) : (
                    <div className="w-full">
                      {loading ? (
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
                        <div
                          className="flex justify-center items-center cursor-pointer"
                          onDrop={handleDrop}
                          onDragOver={handleDragOver}
                          onClick={openFileDialog}
                        >
                          <div className="flex flex-col items-center">
                            <input
                              type="file"
                              accept={type === "digital" ? "video/*" : ".glb"}
                              ref={fileInputRef}
                              onChange={handleFileChange}
                              className="hidden"
                            />
                            <img
                              src="/assets/images/auth/upload.png"
                              alt="upload"
                              className=" w-28 h-28  mx-auto"
                            />
                            <p className="pt-5">Upload assets here...</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
