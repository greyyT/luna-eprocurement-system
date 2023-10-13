import axiosInstance from './axios';

const fetcher = async (url: string) => {
  const res = await axiosInstance.get(url);
  return res.data;
};

export default fetcher;
