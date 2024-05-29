import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { selectAuth } from '@/lib';
import { chatInstance } from '@/utils/instances';

const useChatAxiosInterceotor = () => {
  const auth = useSelector(selectAuth);
  const [isApiLoading, setIsApiLoading] = useState(false);

  useEffect(() => {
    const requestIntercept = chatInstance.interceptors.request.use(
      (config) => {
        setIsApiLoading(true);
        config.headers['retryCall'] = 1;
        if (!config.headers['Authorization']) {
          config.headers[
            'Authorization'
          ] = `Bearer ${auth?.userInfo?.accessToken}`;
        }
        return config;
      },
      (error) => {
        setIsApiLoading(false);
        //toast.error(error?.response?.data?.error || error.message);
        return Promise.reject(error);
      }
    );

    const responseIntercept = chatInstance.interceptors.response.use(
      function (response) {
        setIsApiLoading(false);
        return response;
      },
      async function (error) {
        setIsApiLoading(false);
        const prevRequest = error.config;
        if (+prevRequest.headers['retryCall'] === 1)
          //toast.error(error?.response?.data?.error || error.message);
        prevRequest.headers['retryCall'] = 2;
        return Promise.reject(error);
      }
    );

    return () => {
      setIsApiLoading(false);
      chatInstance.interceptors.request.eject(requestIntercept);
      chatInstance.interceptors.response.eject(responseIntercept);
    };
  }, [auth]);

  return { chatInstance, isChatApiLoading: isApiLoading };
};

export default useChatAxiosInterceotor;
