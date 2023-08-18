import useSWR from 'swr';
import fetcher from '@/api/fetcher';

const useVendorList = (token: string, page: string | number) => {
  const SIZE = 3;
  const { data, isLoading, error, mutate } = useSWR(
    `/api/vendor?page=${page}&size=${SIZE}`,
    (url: string) => fetcher(url, token),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  return {
    data,
    isLoading,
    error,
    mutate,
  };
};

export default useVendorList;
