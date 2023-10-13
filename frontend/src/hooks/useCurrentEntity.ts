import useSWR from 'swr';
import fetcher from '@/api/fetcher';
import { z } from 'zod';

const teamSchema = z.object({
  id: z.string(),
  teamCode: z.string(),
  teamName: z.string(),
});

const departmentSchema = z.object({
  id: z.string(),
  departmentCode: z.string(),
  departmentName: z.string(),
  teams: z.array(teamSchema),
});

const legalEntitySchema = z.object({
  id: z.string(),
  code: z.string(),
  name: z.string(),
  departments: z.array(departmentSchema),
});

export const useCurrentEntity = () => {
  const { data, error, isLoading, mutate } = useSWR(`/api/entity/info`, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  return {
    data: data ? legalEntitySchema.parse(data) : undefined,
    error,
    isLoading,
    mutate,
  };
};
