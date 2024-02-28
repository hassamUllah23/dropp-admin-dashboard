'use client';
import UpdateJobAsset from '@/components/dashboard/chat/adminAssetUpload/UpdateJobAsset';
import useApiHook from '@/hooks/useApiHook';
import {
  createNewNFTcontractForUser,
  submitMetaTransaction,
} from '@/utils/tokenisation-helpers';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import './styles.scss';
import { JOB_COMPLETED } from '@/utils/constants';
import ViewJobAsset from '@/components/dashboard/chat/adminAssetUpload/ViewJobAsset';

export default function Chat() {
  const scrollToBox = useRef(null);
  const { handleApiCall, isApiLoading } = useApiHook();
  const [loading, setLoading] = useState(false);
  const [job, setJob] = useState(null);

  const { id } = useParams();
  const router = useRouter();

  const handleUploadAdminAsset = async (file) => {
    try {
      setLoading(true);
      const type = job.type === 'digital' ? 'video' : 'glb';
      if (file && type) {
        const formDataFiles = new FormData();
        formDataFiles.append(`${type}`, file);
        const result = await handleApiCall({
          method: 'PUT',
          url: `/jobs/avatar/${id}`,
          data: formDataFiles,
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setLoading(false);

        if (result?.status === 200) {
          toast.success('The output has been attached with this job.');
          await getJob();
          await handleTokenisation();
          router.push(`/dashboard`);
        }
      }
    } catch (err) {
      setLoading(false);
      toast.error(err.response.data.errors);
    }
  };

  useEffect(() => {
    scrollToBox.current.scrollTop = scrollToBox.current.scrollHeight + 200;
  }, []);

  const getJob = async () => {
    const result = await handleApiCall({
      method: 'GET',
      url: `/jobs/${id}`,
    });
    if (!!result.data?.job) {
      setJob(result?.data.job);
    }
  };

  useEffect(() => {
    if (id) {
      getJob();
    }
  }, [id]);

  const handleTokenisation = async () => {
    try {
      if (job?.outputs?.length === 0) {
        window.alert('Upload a job output first.');
        return;
      }
      const contractAddress = await createNewNFTcontractForUser();
      await submitMetaTransaction(
        job.outputs[0].metadataUrl?.split('ipfs/')[1],
        contractAddress
      );
      toast.success('This asset has been tokenized!');
    } catch (err) {
      toast.error(err.message?.slice(0, 40));
    }
  };

  return (
    <div className='w-full m-auto flex flex-col h-full  px-3 md:px-0'>
      <div
        className='scrollable-div flex-grow overflow-y-auto'
        ref={scrollToBox}
      >
        <div className='m-auto chat-area h-auto max-w-[55.5rem]'>
          <>
            {!loading && isApiLoading && (
              <div className='w-full flex items-center justify-center'>
                <svg
                  className='animate-spin -ml-1 mr-3 h-16 w-16 text-white'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                >
                  <circle
                    className='opacity-25'
                    cx='12'
                    cy='12'
                    r='10'
                    stroke='currentColor'
                    strokeWidth='4'
                  ></circle>
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                  ></path>
                </svg>
              </div>
            )}
            {job && (
              <ViewJobAsset
                user={job?.user}
                artifacts={job?.artifacts}
                url={
                  !!job && !!job?.outputs.length ? job?.outputs[0]?.url : null
                }
                loading={loading}
                type={
                  !!job && !!job?.outputs.length ? job?.outputs[0]?.type : null
                }
                description={job?.description}
              />
            )}

            {job && job.status !== JOB_COMPLETED && (
              <UpdateJobAsset
                onUploadAdminAsset={handleUploadAdminAsset}
                loading={loading}
              />
            )}
          </>
        </div>
      </div>
    </div>
  );
}
