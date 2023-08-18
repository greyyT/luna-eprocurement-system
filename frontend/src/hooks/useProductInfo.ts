import useSWR from 'swr';
import fetcher from '@/api/fetcher';

const useProductInfo = (token: string, legalEntityCode: string, productCode: string | undefined) => {
  const { data, isLoading, error, mutate } = useSWR(
    `/api/product/${legalEntityCode}/${productCode}`,
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

export default useProductInfo;
