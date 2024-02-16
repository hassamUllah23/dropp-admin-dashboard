import LoadingSvg from "@/components/common/LoadingSvg";
import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "@/lib";
import { setJob } from "@/lib/slices/job/jobActions";
export default function UpdateJobAsset({
  onUploadAdminAsset,
  index,
  url,
  message,
}) {
  console.log(url);
  const [videoUrl, setVideoUrl] = useState(url || "");
  const [uploadedVideoCount, setUploadedVideoCount] = useState(!!url ? 1 : 0);
  const [showLoading, setShowLoading] = useState(false);
  const fileInputRef = useRef();
  const [savedVideos, setSavedVideos] = useState(null);
  const { output } = useSelector((state) => state.job);

  const dispatch = useDispatch();

  const handleFiles = (file) => {
    setShowLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      setVideoUrl(e.target.result);
      setUploadedVideoCount((prevCount) => prevCount + 1);
      setShowLoading(false);
      onUploadAdminAsset(file);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveMedia = (id) => {
    setSavedVideos(null);
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

  useEffect(() => {
    setSavedVideos(output);
    console.log(savedVideos);
    dispatch(setJob(false, null, null));
  }, []);
  return (
    <>
      <div className="pl-0 pr-2 md:px-5 pb-1 mt-3 md:mt-10 text-white">
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

                {savedVideos != null && (
                  <div className="media-container max-w-[32rem] m-auto text-center relative">
                    <div className="media-item inline-block mx-2 my-1 md:mx-3 md:my-3 rounded-md relative">
                      <video
                        controls
                        className=" max-w-56 md:max-w-96 rounded-md object-cover "
                      >
                        <source src={savedVideos} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                    {/* <button
                      onClick={() => handleRemoveMedia()}
                      className="absolute top-2 right-2 cursor-pointer bg-transparent"
                    >
                      <img
                        src="/assets/images/chat/remove.png"
                        className=" w-3"
                      />
                    </button> */}
                  </div>
                )}
                {savedVideos == null && (
                  <div>
                    {showLoading ? (
                      <div className="flexCenter relative loadingArea py-16">
                        <LoadingSvg color={"#fafafa"} />
                      </div>
                    ) : (
                      <div className="w-full">
                        {uploadedVideoCount === 0 && (
                          <div
                            className="flex justify-center items-center cursor-pointer"
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onClick={openFileDialog}
                          >
                            <div className="flex flex-col items-center">
                              <input
                                type="file"
                                accept="video/*"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                              />
                              <img
                                src="/assets/images/auth/upload.png"
                                alt="upload"
                                className=" w-28 h-28  mx-auto"
                              />
                              <p className="pt-5">
                                {message || "Upload assets here..."}
                              </p>
                            </div>
                          </div>
                        )}

                        <div className="media-container max-w-[32rem] m-auto text-center">
                          {uploadedVideoCount > 0 && (
                            <div className="media-item inline-block mx-2 my-1 md:mx-3 md:my-3 rounded-md relative">
                              <video
                                controls
                                className=" max-w-56 md:max-w-96 rounded-md object-cover "
                              >
                                <source src={videoUrl} type="video/mp4" />
                                Your browser does not support the video tag.
                              </video>
                            </div>
                          )}
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
    </>
  );
}
