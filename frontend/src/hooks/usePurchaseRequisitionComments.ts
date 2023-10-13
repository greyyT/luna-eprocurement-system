import useSWR from 'swr';
import fetcher from '@/api/fetcher';
import { z } from 'zod';

const commentsSchema = z.object({
  id: z.string(),
  username: z.string(),
  content: z.string(),
  isUpdated: z.boolean(),
  createdDate: z.string(),
  updatedDate: z.string(),
});

const commentListSchema = z.object({
  data: z.array(commentsSchema),
  totalPages: z.number(),
  totalElements: z.number(),
  size: z.number(),
  currentPage: z.number(),
});

export const usePurchaseRequisitionComments = (id: string, page: number | string, isOpen: boolean) => {
  const key = id && isOpen ? `/api/purchase-requisition/${id}/comment?page=${page}&size=2` : null;

  const { data, error, isLoading, mutate } = useSWR(key, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  return {
    data: data ? commentListSchema.parse(data) : undefined,
    error,
    isLoading,
    mutate,
  };
};
