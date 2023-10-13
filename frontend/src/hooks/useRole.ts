import useSWR from 'swr';
import fetcher from '@/api/fetcher';
import { z } from 'zod';

const roleSchema = z.object({
  id: z.string(),
  role: z.string(),
  approve: z.boolean(),
  reject: z.boolean(),
});

const roleListSchema = z.array(roleSchema);

export const useRole = () => {
  const { data, error, isLoading, mutate } = useSWR(`/api/role`, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  return {
    data: data ? roleListSchema.parse(data) : undefined,
    error,
    isLoading,
    mutate,
  };
};
