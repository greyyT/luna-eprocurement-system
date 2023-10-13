import { KeyedMutator } from 'swr';
import Input from '../ui/Input';
import { useEffect, useState } from 'react';
import Modal from '../ui/Modal';
import { toast } from 'react-hot-toast';
import { AxiosError } from 'axios';
import axiosInstance, { handleError } from '@/api/axios';
import { z } from 'zod';

interface AddContactModalProps {
  vendorId: string | undefined;
  isOpen: boolean;
  onClose: () => void;
  hasTransitionedIn: boolean;
  mutate: KeyedMutator<any>;
}

const schema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  phone: z.string().min(1, { message: 'Phone is required' }),
  position: z.string().min(1, { message: 'Position is required' }),
});

const AddContactModal: React.FC<AddContactModalProps> = ({ vendorId, isOpen, onClose, hasTransitionedIn, mutate }) => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    position: '',
  });

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setFormData({
          name: '',
          phone: '',
          position: '',
        });
      }, 200);
    }
  }, [isOpen]);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  if (!isMounted) return null;

  const onSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    if (isLoading) return;

    // Validate the input
    const validationResult = schema.safeParse(formData);

    // If the input is invalid, display the first error messages
    if (!validationResult.success) {
      const errors = validationResult.error.errors;

      if (errors.length > 0) {
        toast.error(errors[0].message);
        return;
      }
    }

    const toastLoading = toast.loading('Adding contact...');
    setIsLoading(true);

    try {
      await axiosInstance.post('/api/vendor/contact', {
        ...formData,
        vendorId,
      });
      await mutate();
      toast.success('Contact added successfully');
      onClose();
    } catch (error) {
      if (error instanceof AxiosError) {
        const message = handleError(error);
        toast.error(message);
      } else {
        toast.error('Something went wrong');
      }
    } finally {
      toast.dismiss(toastLoading);
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} hasTransitionedIn={hasTransitionedIn} isLoading={isLoading}>
      <div className="p-9 bg-white rounded-[20px]" onClick={(ev) => ev.stopPropagation()}>
        <h3 className="font-bold font-inter text-2xl leading-[30px] text-black">Add new contact</h3>
        <div className="h-[3px] w-[500px] mt-3 bg-primary"></div>
        <form onSubmit={onSubmit}>
          <div className="flex mt-4 gap-4 flex-col">
            <Input
              onChange={(ev) => setFormData({ ...formData, name: ev.target.value })}
              value={formData.name}
              id={'name'}
              type="text"
              label="Full Name"
            />
            <Input
              onChange={(ev) => setFormData({ ...formData, phone: ev.target.value })}
              value={formData.phone}
              id={'phone'}
              type="text"
              label="Phone Number"
            />
            <Input
              onChange={(ev) => setFormData({ ...formData, position: ev.target.value })}
              value={formData.position}
              id={'position'}
              type="text"
              label="Position"
            />
          </div>
          <div className="flex mt-6 gap-6">
            <button
              type="button"
              className={`
              flex-1 
              py-3 
              border 
              border-solid 
              border-gray-250 
              rounded-lg 
              text-black 
              font-inter 
              leading-6 
              font-medium 
              ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
              onClick={() => !isLoading && onClose()}
            >
              Close
            </button>
            <button
              className={`
              flex-1 
              py-3 
              font-inter 
              leading-6 
              font-medium 
              bg-primary 
              text-white 
              rounded-lg 
              ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
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

export default AddContactModal;
