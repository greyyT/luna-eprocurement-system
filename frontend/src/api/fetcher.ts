import axiosInstance from './axios';

const fetcher = async (url: string, token: string) => {
  const res = await axiosInstance.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export default fetcher;
