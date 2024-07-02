import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getRefreshToken } from '@/utils/apiCalls/authApi';
import { instance } from '@/utils/instances';
import { selectAuth, toggleLogin } from '@/lib';
import { useRouter } from 'next/navigation';
const useAxiosInterceotor = () => {
  const auth = useSelector(selectAuth);
  const [isApiLoading, setIsApiLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
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
        //toast.error(error?.response?.data?.errors || error.message);
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
          })
            .then((res) => {
              if (res.status === 200) {
                prevRequest.headers[
                  'Authorization'
                ] = `Bearer ${result?.data?.accessToken}`;
                return instance(prevRequest);
              }
              return res;
            })
            .catch((error) => {
              localStorage.removeItem('accessToken');
              dispatch(toggleLogin({ isLogin: false, userInfo: null }));
              router.push('/sign-in');
              //toast.error(error?.response?.data?.errors);
            });
        }
        if (+prevRequest.headers['retryCall'] === 1)
          //toast.error(error?.response?.data?.errors || error.message);
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
