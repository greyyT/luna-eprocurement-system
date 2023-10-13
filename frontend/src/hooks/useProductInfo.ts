import useSWR from 'swr';
import fetcher from '@/api/fetcher';
import { z } from 'zod';

const priceSchema = z.object({
  id: z.string(),
  price: z.number(),
  vendorCode: z.string(),
  vendorName: z.string(),
});

const dimensionSchema = z.object({
  width: z.string(),
  height: z.string(),
  length: z.string(),
});

const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  SKU: z.string(),
  brand: z.string(),
  code: z.string(),
  category: z.string(),
  weight: z.string(),
  color: z.string(),
  material: z.string(),
  providedVendorInfo: z.array(priceSchema),
  dimension: dimensionSchema,
  productImage: z.string().nullable(),
});

const useProductInfo = (productCode: string | undefined) => {
  const { data, isLoading, error, mutate } = useSWR(`/api/product/${productCode}`, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  return {
    data: data ? productSchema.parse(data) : undefined,
    isLoading,
    error,
    mutate,
  };
};

export default useProductInfo;
