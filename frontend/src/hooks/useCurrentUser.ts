import useSWR from 'swr';
import fetcher from '@/api/fetcher';
import { useNavigate } from 'react-router-dom';
import useToken from './useToken';
import toast from 'react-hot-toast';

const useCurrentUser = (token: string) => {
  const navigate = useNavigate();
  const { deleteToken } = useToken();

  const { data, error, isLoading, mutate } = useSWR('/api/account', (url) => fetcher(url, token), {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    onError: (err) => {
      if (err.response.status === 403 || err.response.status === 401) {
        toast.error('Your session has expired. Please sign in again.');
        deleteToken();
        navigate('/sign-in');
      }
    },
  });

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};

export default useCurrentUser;
