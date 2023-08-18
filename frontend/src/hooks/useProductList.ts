import useSWR from 'swr';
import fetcher from '@/api/fetcher';

const useProductList = (token: string, legalEntityCode: string, page: number | string) => {
  const SIZE = 3;
  const { data, isLoading, error, mutate } = useSWR(
    `/api/product/${legalEntityCode}?page=${page}&size=${SIZE}`,
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

export default useProductList;
