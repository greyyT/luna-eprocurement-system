import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

import Input from '@/components/ui/Input';
import handleInput from '@/utils/validator';
import axiosInstance from '@/api/axios';
import useToken from '@/hooks/useToken';

const CreateEntity = () => {
  useEffect(() => {
    document.title = 'Create Entity';
  }, []);

  const { token } = useToken();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [entityCode, setEntityCode] = useState<string>('');
  const [bussinessNum, setBussinessNum] = useState<string>('');
  const [error, setError] = useState<{ entity: string; bussinessNum: string }>({ entity: '', bussinessNum: '' });

  useEffect(() => {
    setError({ entity: '', bussinessNum: '' });
  }, [entityCode, bussinessNum]);

  const onSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    const entityError = handleInput(entityCode, 'required', 'entityCode');

    if (entityError) {
      setError({ ...error, entity: entityError });
      toast.error('Check your input');
      return;
    }

    const bussinessError = handleInput(bussinessNum, 'required');

    if (bussinessError) {
      setError({ ...error, bussinessNum: bussinessError });
      toast.error('Check your input');
      return;
    }

    setLoading(true);

    try {
      await axiosInstance.post(
        '/api/entity/create-entity',
        { name: bussinessNum, code: entityCode },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success('Successfully created entity');
      navigate({
        pathname: '/',
        search: `entityCode=${entityCode}`,
      });
    } catch (err) {
      toast.error('Something went wrong');
      if (axios.isAxiosError(err)) {
        if (err.response) {
          setError({
            entity: err.response.data.message,
            bussinessNum: err.response.data.message,
          });
        } else {
          setError({
            entity: 'Internal server error',
            bussinessNum: 'Internal server error',
          });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-8 py-9">
      <Input
        label="Legal Entity Code"
        onChange={(ev) => setEntityCode(ev.target.value)}
        id="entity"
        type="text"
        value={entityCode}
        error={error.entity}
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
        className={`h-12 bg-primary mt-4 text-white font-inter rounded-md ${
          loading ? 'bg-opacity-80 cursor-not-allowed' : ''
        }`}
        type="submit"
      >
        Create a Legal Entity
      </button>
    </form>
  );
};

export default CreateEntity;
