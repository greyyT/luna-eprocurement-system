import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';

import Input from '@/components/ui/Input';
import useToken from '@/hooks/useToken';
import handleInput from '@/utils/validator';
import axiosInstance from '@/api/axios';

const JoinEntity = () => {
  useEffect(() => {
    document.title = 'Join Entity';
  }, []);

  const navigate = useNavigate();
  const { token } = useToken();

  const [loading, setLoading] = useState<boolean>(false);
  const [entityCode, setEntityCode] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    setError('');
  }, [entityCode]);

  const onSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    const enityError = handleInput(entityCode, 'required', 'entityCode');

    if (enityError) {
      setError(enityError);
      toast.error('Check your input');
      return;
    }

    setLoading(true);

    try {
      await axiosInstance.post(
        '/api/entity/join-entity',
        { legalEntityCode: entityCode },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast.success('Successfully joined entity');
      navigate({
        pathname: '/',
        search: `entityCode=${entityCode}`,
      });
    } catch (err) {
      toast.error('Something went wrong');
      if (axios.isAxiosError(err)) {
        if (err.response) {
          setError(err.response.data.message);
        } else {
          setError('Internal server error');
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
        error={error}
      />
      <button
        className={`h-12 bg-primary mt-4 text-white font-inter rounded-md ${
          loading ? 'bg-opacity-80 cursor-not-allowed' : ''
        }`}
        type="submit"
      >
        Join a Legal Entity
      </button>
    </form>
  );
};

export default JoinEntity;
