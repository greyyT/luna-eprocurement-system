import useSWR from 'swr';
import fetcher from '@/api/fetcher';
import { z } from 'zod';

const projectSchema = z.object({
  id: z.string(),
  name: z.string(),
  code: z.string(),
  label: z.string(),
  isDefault: z.boolean(),
  purchaseAllowance: z.number(),
  currentPurchase: z.number(),
  purchaseCount: z.number(),
});

const projectListSchema = z.object({
  data: z.array(projectSchema),
  totalPages: z.number(),
  totalElements: z.number(),
  size: z.number(),
  currentPage: z.number(),
});

const useProjectList = (page: number | string) => {
  const SIZE = 3;
  const { data, isLoading, error, mutate } = useSWR(`/api/project?page=${page}&size=${SIZE}`, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  return {
    data: data ? projectListSchema.parse(data) : undefined,
    isLoading,
    error,
    mutate,
  };
};

export default useProjectList;
