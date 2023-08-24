import useSWR from 'swr';
import fetcher from '@/api/fetcher';

const useProjectList = (token: string, legalEntityCode: string | undefined, page: number | string) => {
  const SIZE = 3;
  const { data, isLoading, error, mutate } = useSWR(
    `/api/project/legalEntity/${legalEntityCode}?page=${page}&size=${SIZE}`,
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

export default useProjectList;
