import useSWR from 'swr';
import fetcher from '@/api/fetcher';
import { z } from 'zod';

const userSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string().email(),
  role: z.string(),
  legalEntityCode: z.string().nullable(),
  departmentCode: z.string().nullable(),
  departmentName: z.string().nullable(),
  teamCode: z.string().nullable(),
  teamName: z.string().nullable(),
});

const accountListSchema = z.object({
  data: z.array(userSchema),
  totalPages: z.number(),
  totalElements: z.number(),
  size: z.number(),
  currentPage: z.number(),
});

const useMemberList = (page: number | string | undefined) => {
  const { data, error, isLoading, mutate } = useSWR(`/api/entity/account?page=${page}&size=5`, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  return {
    data: data ? accountListSchema.parse(data) : undefined,
    error,
    isLoading,
    mutate,
  };
};

export default useMemberList;
