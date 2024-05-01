import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getRefreshToken } from '@/utils/apiCalls/authApi';
import { instance } from '@/utils/instances';
import { selectAuth } from '@/lib';

const useAxiosInterceotor = () => {
  const auth = useSelector(selectAuth);
  const [isApiLoading, setIsApiLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const requestIntercept = instance.interceptors.request.use(
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
        toast.error(error?.response?.data?.errors || error.message);
        return Promise.reject(error);
      }
    );

    const responseIntercept = instance.interceptors.response.use(
      function (response) {
        setIsApiLoading(false);
        return response;
      },
      async function (error) {
        setIsApiLoading(false);
        const prevRequest = error.config;
        if (error.response?.status === 403 && !prevRequest.sent) {
          prevRequest.sent = true;
          const result = await getRefreshToken({
            userInfo: auth?.userInfo,
            dispatch,
          });
          prevRequest.headers[
            'Authorization'
          ] = `Bearer ${result?.data?.accessToken}`;
          return instance(prevRequest);
        }
        if (+prevRequest.headers['retryCall'] === 1)
          toast.error(error?.response?.data?.errors || error.message);
        prevRequest.headers['retryCall'] = 2;
        return Promise.reject(error);
      }
    );

    return () => {
      setIsApiLoading(false);
      instance.interceptors.request.eject(requestIntercept);
      instance.interceptors.response.eject(responseIntercept);
    };
  }, [auth]);

  return { instance, isApiLoading };
};

export default useAxiosInterceotor;
