import { updateUserToken } from '@/lib/slices/auth/authSlice';
import { instance } from '@/utils/instances';

export const getRefreshToken = async ({ userInfo, dispatch }) => {
  const result = await instance.get(`/refresh-token/${userInfo?.refreshToken}`);
  dispatch(updateUserToken(result?.data));
  return { data: result?.data };
};
