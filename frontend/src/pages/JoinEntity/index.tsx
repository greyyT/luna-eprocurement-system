import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { AxiosError } from 'axios';
import { z } from 'zod';

import Input from '@/components/ui/Input';
import axiosInstance, { handleError } from '@/api/axios';
import useCurrentUser from '@/hooks/useCurrentUser';

const schema = z.object({
  entityCode: z.string().min(4).max(6),
});

const JoinEntity = () => {
  useEffect(() => {
    document.title = 'Join Entity';
  }, []);

  const navigate = useNavigate();

  const { mutate } = useCurrentUser();

  const [loading, setLoading] = useState<boolean>(false);
  const [entityCode, setEntityCode] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    setError('');
  }, [entityCode]);

  const onSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    const validationResult = schema.safeParse({ entityCode });

    if (!validationResult.success) {
      const errors = validationResult.error.errors;

      if (errors.length > 0) {
        setError(errors[0].message);
        return;
      }
    }

    const toastLoading = toast.loading('Joining entity...');
    setLoading(true);

    try {
      await axiosInstance.post('/api/entity/join-entity', { legalEntityCode: entityCode });
      await mutate();
      toast.success('Successfully joined entity');
      navigate('/');
    } catch (error) {
      if (error instanceof AxiosError) {
        const message = handleError(error);
        toast.error(message);
      } else {
        toast.error('An error occurred');
      }
    } finally {
      setLoading(false);
      toast.dismiss(toastLoading);
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-8 py-9">
      <Input
        label="Legal Entity Code"
        onChange={(ev) => setEntityCode(ev.target.value.toUpperCase())}
        id="entity"
        type="text"
        value={entityCode}
        error={error}
      />
      <button
        className={`
          h-12 
          bg-primary 
          mt-4 
          text-white 
          font-inter 
          rounded-md 
          ${loading ? 'bg-opacity-80 cursor-not-allowed' : ''}
        `}
        type="submit"
      >
        Join this Legal Entity
      </button>
    </form>
  );
};

export default JoinEntity;
