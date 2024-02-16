import useChatAxiosInterceotor from './useChatAxiosInterceotor';

const useChatApiHook = () => {
  const { chatInstance, isChatApiLoading } = useChatAxiosInterceotor();

  const handleChatApiCall = async ({
    method,
    url,
    data,
    headers,
    responseType = 'json',
  }) =>
    await chatInstance({
      method,
      url,
      data,
      headers,
      responseType: responseType,
    });

  return { handleChatApiCall, isChatApiLoading };
};

export default useChatApiHook;
