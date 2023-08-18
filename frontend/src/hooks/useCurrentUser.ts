import useSWR from 'swr';
import fetcher from '@/api/fetcher';

const useCurrentUser = (token: string) => {
  const { data, error, isLoading, mutate } = useSWR('/api/account', (url) => fetcher(url, token), {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};

export default useCurrentUser;
