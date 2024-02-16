import useAxiosInterceotor from './useAxiosInterceotor';

const useApiHook = () => {
  const { instance, isApiLoading } = useAxiosInterceotor();

  const handleApiCall = async ({ method, url, data, headers }) =>
    await instance({
      method,
      url,
      data,
      headers,
    });

  return { handleApiCall, isApiLoading };
};

export default useApiHook;
