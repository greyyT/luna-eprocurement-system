import useSWR from 'swr';
import fetcher from '@/api/fetcher';

export const useCurrentEntity = (legalEntityCode: string, token: string) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/api/entity/${legalEntityCode}/info`,
    (url) => fetcher(url, token),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  return {
    data: data?.data[0],
    error,
    isLoading,
    mutate,
  };
};
