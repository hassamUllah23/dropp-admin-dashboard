"use client";
import UpdateJobAsset from "@/components/dashboard/chat/adminAssetUpload/UpdateJobAsset";
import useApiHook from "@/hooks/useApiHook";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { JOB_COMPLETED } from "@/utils/constants";
import ViewJobAsset from "@/components/dashboard/chat/adminAssetUpload/ViewJobAsset";
import { useSelector } from '@/lib';
export default function Chat({ params: { id } }) {
  const scrollToBox = useRef(null);
  const { handleApiCall } = useApiHook();
  const [loading, setLoading] = useState(false);
  const [job, setJob] = useState(null);
  const [showInitialMsg, setShowInitialMsg] = useState(false);
  const notifications = useSelector(
    (state) => state.notification.notifications
  );
  const handleUploadAdminAsset = async (file) => {
    try {
      setLoading(true);
      const type = job.type === "digital" ? "video" : "glb";
      if (file && type) {
        const formDataFiles = new FormData();
        formDataFiles.append(`${type}`, file);
        const result = await handleApiCall({
          method: "PUT",
          url: `/jobs/avatar/${id}`,
          data: formDataFiles,
          headers: { "Content-Type": "multipart/form-data" },
        });
        setLoading(false);

        if (result?.status === 200) {
          toast.success("The output has been attached with this job.");
          setShowInitialMsg(true)
          updateJobAndTokenize();
        }
      }
    } catch (err) {
      setLoading(false);
      toast.error(err?.response?.data?.errors);
    }
  };

  useEffect(() => {
    scrollToBox.current.scrollTop = scrollToBox.current.scrollHeight + 200;
  }, []);

  const getJob = async () => {
    const result = await handleApiCall({
      method: "GET",
      url: `/jobs/${id}`,
    });
    if (!!result.data?.job) {
      setJob(result?.data.job);
      return result?.data.job;
    }

    return {};
  };

  useEffect(() => {
    if (id) {
      getJob();
    }
  }, [id, loading]);

  useEffect(() => {
    if (notifications.length > 0) {
      console.log('notifications', notifications)
      const jobId = notifications[0].jobId;
      const type = notifications[0].type;
      if(jobId === id && type === 'mintingAndTokenization')
      {
        console.log('inside notifications', notifications)
        getJob();
      }
    }
  }, [notifications]);

  const updateJobAndTokenize = async () => {
    await getJob();
    // toast.success('This asset has been tokenized!');
  };

  return (
    <>
      {loading && (
        <div className="w-full z-[1000] fixed left-0 top-0 right-0 bottom-0 flex items-center justify-center bg-black/60">
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
      )}
      <div className="w-full m-auto flex flex-col h-full  px-3 md:px-0">
        <div
          className="scrollable-div flex-grow overflow-y-auto"
          ref={scrollToBox}
        >
          <div className="m-auto chat-area h-auto max-w-[55.5rem]">
            <>
              {job && (
                <ViewJobAsset
                  key={job?.id}
                  user={job?.user}
                  artifacts={job?.artifacts}
                  url={
                    !!job && !!job?.outputs.length ? job?.outputs[0]?.url : null
                  }
                  setLoading={setLoading}
                  type={
                    !!job && !!job?.outputs.length
                      ? job?.outputs[0]?.type
                      : null
                  }
                  description={job?.description}
                  tokenizedNFTUrls={job?.tokenizedNFTUrls || []}
                  uploadedBy={job?.outputs[0]?.uploadedBy}
                  jobKeys={job}
                  status={job?.status}
                  showMinting={showInitialMsg}
                />
              )}

              {job && job.status !== JOB_COMPLETED && (
                <UpdateJobAsset
                  onUploadAdminAsset={handleUploadAdminAsset}
                  setLoading={setLoading}
                  type={job?.type}
                />
              )}
            </>
          </div>
        </div>
      </div>
    </>
  );
}
