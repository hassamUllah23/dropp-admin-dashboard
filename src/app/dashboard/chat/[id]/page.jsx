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

export default function Chat() {
  const scrollToBox = useRef(null);
  const { handleApiCall, isApiLoading } = useApiHook();

  const [job, setJob] = useState(null);

  const { id } = useParams();
  const router = useRouter();

  const handleUploadAdminAsset = async (file) => {
    const type = !!job && !!job.outputs.length ? job.outputs[0].type : null;
    if (file && type) {
      const formDataFiles = new FormData();
      formDataFiles.append(`${type}`, file);
      const result = await handleApiCall({
        method: 'PUT',
        url: `/jobs/avatar/${id}`,
        data: formDataFiles,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (result?.status === 200) {
        toast.success('The output has been attached with this job.');
        getJob();
      }
    }
  };

  useEffect(() => {
    scrollToBox.current.scrollTop = scrollToBox.current.scrollHeight + 200;
  }, []);

  const getJob = async () => {
    const result = await handleApiCall({
      method: 'GET',
      url: `/jobs/all/admin`,
    });
    if (!!result.data?.jobs) {
      setJob(result.data.jobs.find((j) => j.id === id));
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
        job.outputs[0].url.split('outputs/')[1],
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
          {!!job?.outputs?.length && (
            <button className='tokenize' onClick={handleTokenisation}>
              Tokenize this output
            </button>
          )}
          {isApiLoading ? (
            <p style={{ color: 'white', textAlign: 'center' }}>Loading...</p>
          ) : (
            <>
              <UpdateJobAsset
                onUploadAdminAsset={handleUploadAdminAsset}
                url={!!job && !!job.outputs.length ? job.outputs[0].url : null}
                type={
                  !!job && !!job.outputs.length ? job.outputs[0].type : null
                }
              />
              {job?.outputs?.length > 0 && job.status !== JOB_COMPLETED && (
                <UpdateJobAsset
                  onUploadAdminAsset={handleUploadAdminAsset}
                  type={
                    !!job && !!job.outputs.length ? job.outputs[0].type : null
                  }
                  url={
                    !!job && !!job.outputs.length > 0
                      ? job.outputs[1]?.url
                      : null
                  }
                  message={'Upload final output here'}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
