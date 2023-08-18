import useSWR from 'swr';
import fetcher from '@/api/fetcher';

const useVendorInfo = (token: string, vendor: string | undefined) => {
  const { data, isLoading, error, mutate } = useSWR(`/api/vendor/${vendor}`, (url) => fetcher(url, token), {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  return {
    data,
    isLoading,
    error,
    mutate,
  };
};

export default useVendorInfo;
