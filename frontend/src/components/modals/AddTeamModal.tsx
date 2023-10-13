import { useEffect, useState } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import { toast } from 'react-hot-toast';
import { AxiosError } from 'axios';
import axiosInstance, { handleError } from '@/api/axios';
import { z } from 'zod';

interface AddTeamModalProps {
  isOpen: boolean;
  hasTransitionedIn: boolean;
  onClose: () => void;
  variant: 'Department' | 'Team';
  departmentId: string;
  mutate: any;
}

const schema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  code: z.string().min(1, { message: 'Code is required' }),
});

const AddTeamModal: React.FC<AddTeamModalProps> = ({
  isOpen,
  hasTransitionedIn,
  onClose,
  variant,
  departmentId,
  mutate,
}) => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [name, setName] = useState<string>('');
  const [code, setCode] = useState<string>('');

  useEffect(() => {
    setName('');
    setCode('');
  }, [isOpen]);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    if (isLoading) return;

    const validationResult = schema.safeParse({ name, code });

    // If the input is invalid, display the first error messages
    if (!validationResult.success) {
      const errors = validationResult.error.errors;

      if (errors.length > 0) {
        toast.error(errors[0].message);
        return;
      }
    }

    setIsLoading(true);
    const toastLoading = toast.loading(`Creating ${variant}...`);

    try {
      if (variant === 'Department') {
        await axiosInstance.post('api/department', {
          departmentCode: code,
          departmentName: name,
        });
      } else {
        await axiosInstance.post('api/team', {
          teamCode: code,
          teamName: name,
          departmentId,
        });
      }
      await mutate();
      toast.success(`${variant} created successfully`);
      onClose();
    } catch (error) {
      if (error instanceof AxiosError) {
        const response = handleError(error);
        toast.error(response);
      } else {
        toast.error('Something went wrong');
      }
    } finally {
      toast.dismiss(toastLoading);
      setIsLoading(false);
    }
  };

  if (!isMounted) return null;

  return (
    <Modal isOpen={isOpen} hasTransitionedIn={hasTransitionedIn} onClose={onClose} isLoading={isLoading}>
      <div className="p-9 bg-white rounded-[20px]" onClick={(ev) => ev.stopPropagation()}>
        <h3 className="font-bold font-inter text-2xl leading-[30px] text-black">Add {variant}</h3>
        <div className="h-[3px] w-[500px] mt-3 bg-primary"></div>
        <form onSubmit={onSubmit}>
          <div className="flex mt-4 gap-4 flex-col">
            <Input
              onChange={(ev) => setName(ev.target.value)}
              value={name}
              id={'name'}
              type="text"
              label={`${variant} Name`}
            />
            <Input
              onChange={(ev) => setCode(ev.target.value.toUpperCase())}
              value={code}
              id={'code'}
              type="text"
              label={`${variant} Code`}
            />
          </div>
          <div className="flex mt-6 gap-6">
            <button
              className="flex-1 py-3 border border-solid border-gray-250 rounded-lg text-black font-inter leading-6 font-medium"
              onClick={() => {
                if (!isLoading) onClose();
              }}
              type="button"
            >
              Close
            </button>
            <button
              className="flex-1 py-3 font-inter leading-6 font-medium bg-primary text-white rounded-lg"
              type="submit"
            >
              Accept
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddTeamModal;
