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

const useVendorInfo = (vendor: string | undefined) => {
  const { data, isLoading, error, mutate } = useSWR(`/api/vendor/${vendor}`, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  return {
    data: data ? vendorSchema.parse(data) : undefined,
    isLoading,
    error,
    mutate,
  };
};

export default useVendorInfo;
