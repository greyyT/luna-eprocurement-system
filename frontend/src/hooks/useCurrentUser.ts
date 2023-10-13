import fetcher from '@/api/fetcher';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useSWR from 'swr';
import { z } from 'zod';

const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  username: z.string(),
  role: z.string().nullable(),
  legalEntityCode: z.string().nullable(),
  departmentCode: z.string().nullable(),
  teamCode: z.string().nullable(),
  approve: z.boolean().optional(),
  reject: z.boolean().optional(),
});

const useCurrentUser = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const parts = pathname.split('/'); // Split the pathname into parts

  // The last part of the pathname should be what you want
  const currentRoute = parts[parts.length - 1];
  const navigate = useNavigate();

  const { data, error, isLoading, mutate } = useSWR('/api/account', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    shouldRetryOnError: currentRoute !== 'sign-in' && currentRoute !== 'sign-up',
    onError: (err) => {
      if (currentRoute === 'sign-in' || currentRoute === 'sign-up') return;
      if (err.response.status === 401) {
        toast.error('Your session has expired. Please sign in again.');
        navigate('/sign-in');
      }
    },
    onSuccess: () => {
      if (currentRoute === 'sign-in' || currentRoute === 'sign-up') {
        navigate('/');
      }
    },
  });

  return {
    data: data ? userSchema.parse(data) : undefined,
    error,
    isLoading,
    mutate,
  };
};

export default useCurrentUser;
