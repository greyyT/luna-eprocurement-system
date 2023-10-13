import useSWR from 'swr';
import fetcher from '@/api/fetcher';
import { z } from 'zod';

const productSchema = z.object({
  id: z.string(),
  code: z.string(),
  quantity: z.number(),
  vendorCode: z.string(),
  vendorName: z.string(),
  price: z.number(),
});

const purchaseRequisitionInfoSchema = z.object({
  id: z.string(),
  purchaseName: z.string(),
  priority: z.string(),
  projectCode: z.string(),
  requester: z.string(),
  targetDate: z.string(),
  dueDate: z.string(),
  status: z.string(),
  products: z.array(productSchema),
  isApproved: z.boolean(),
  isRejected: z.boolean(),
  rejectedComment: z.string().nullable(),
  commentCount: z.number(),
});

export const usePurchaseRequisitionInfo = (id: string, isOpen: boolean) => {
  const key = id && isOpen ? `/api/purchase-requisition/${id}` : null;

  const { data, error, isLoading, mutate } = useSWR(key, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  return {
    data: data ? purchaseRequisitionInfoSchema.parse(data) : undefined,
    error,
    isLoading,
    mutate,
  };
};
