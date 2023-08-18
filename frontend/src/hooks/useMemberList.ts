import useSWR from 'swr';
import fetcher from '@/api/fetcher';
import useCurrentUser from './useCurrentUser';

const useMemberList = (legalEntityCode: string, token: string) => {
  const { data: user } = useCurrentUser(token);

  const { data, error, isLoading, mutate } = useSWR(
    `/api/entity/${legalEntityCode}/account`,
    (url) => fetcher(url, token),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  const filteredData = data?.data?.filter((member: any) => member?.email !== user?.email);

  return {
    data: filteredData,
    error,
    isLoading,
    mutate,
  };
};

export default useMemberList;
