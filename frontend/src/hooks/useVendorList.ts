import useSWR from 'swr';
import fetcher from '@/api/fetcher';
import { z } from 'zod';

const contactSchema = z.object({
  id: z.string(),
  name: z.string(),
  phone: z.string(),
  position: z.string(),
});

const vendorSchema = z.object({
  id: z.string(),
  businessName: z.string(),
  code: z.string(),
  businessNumber: z.string(),
  description: z.string(),
  contacts: z.array(contactSchema),
  vendorImage: z.string(),
});

const vendorListSchema = z.object({
  data: z.array(vendorSchema),
  totalPages: z.number(),
  totalElements: z.number(),
  size: z.number(),
  currentPage: z.number(),
});

const useVendorList = (page: string | number) => {
  const SIZE = 3;
  const { data, isLoading, error, mutate } = useSWR(`/api/vendor?page=${page}&size=${SIZE}`, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  return {
    data: data ? vendorListSchema.parse(data) : undefined,
    isLoading,
    error,
    mutate,
  };
};

export default useVendorList;
