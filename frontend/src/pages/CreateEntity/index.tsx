import { useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import { toast } from 'react-hot-toast';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';

import Input from '@/components/ui/Input';
import axiosInstance, { handleError } from '@/api/axios';
import useCurrentUser from '@/hooks/useCurrentUser';

const schema = z.object({
  entityCode: z.string().min(4).max(6),
  bussinessNum: z.string().min(9).max(9),
});

const CreateEntity = () => {
  useEffect(() => {
    document.title = 'Create Entity';
  }, []);

  const navigate = useNavigate();

  const { mutate } = useCurrentUser();

  const [loading, setLoading] = useState<boolean>(false);
  const [entityCode, setEntityCode] = useState<string>('');
  const [bussinessNum, setBussinessNum] = useState<string>('');
  const [error, setError] = useState<{ entityCode: string; bussinessNum: string }>({
    entityCode: '',
    bussinessNum: '',
  });

  // Reset the error messages when the user changes the input
  useEffect(() => {
    setError({ entityCode: '', bussinessNum: '' });
  }, [entityCode, bussinessNum]);

  // Handle the sign up form submission
  const onSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    // Validate the form
    const validationResult = schema.safeParse({ entityCode, bussinessNum });

    // If the input is invalid, display the first error messages
    if (!validationResult.success) {
      const errors = validationResult.error.errors;

      if (errors.length > 0) {
        setError({ ...error, [errors[0].path[0]]: errors[0].message });
        return;
      }
    }

    const toastLoading = toast.loading('Creating entity...');
    setLoading(true);

    try {
      await axiosInstance.post('/api/entity/create-entity', { name: bussinessNum, code: entityCode });
      await mutate();
      toast.success('Successfully created entity');
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
        error={error.entityCode}
      />
      <Input
        label="Bussiness Registration number"
        onChange={(ev) => setBussinessNum(ev.target.value)}
        id="bussiness"
        type="text"
        value={bussinessNum}
        error={error.bussinessNum}
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
        Create a Legal Entity
      </button>
    </form>
  );
};

export default CreateEntity;
