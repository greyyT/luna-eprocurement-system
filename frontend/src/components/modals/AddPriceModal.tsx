import { useEffect, useState } from 'react';
import { KeyedMutator } from 'swr';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import { toast } from 'react-hot-toast';
import axiosInstance from '@/api/axios';
import { isAxiosError } from 'axios';
import { z } from 'zod';

interface AddPriceModalProps {
  productId: string | undefined;
  isOpen: boolean;
  onClose: () => void;
  hasTransitionedIn: boolean;
  mutate: KeyedMutator<any>;
}

const schema = z.object({
  vendorCode: z.string().min(1, { message: 'Vendor code is required' }),
  price: z
    .string()
    .min(1, { message: 'Price is required' })
    .regex(/^\d+(\.\d{1,2})?$/, { message: 'Price must be a number with up to 2 decimal places' }),
});

const AddPriceModal: React.FC<AddPriceModalProps> = ({ productId, isOpen, onClose, hasTransitionedIn, mutate }) => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [formData, setFormData] = useState({
    vendorCode: '',
    price: '',
  });

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setFormData({
          vendorCode: '',
          price: '',
        });
      }, 200);
    }
  }, [isOpen]);

  const [isLoading, setIsLoading] = useState<boolean>(false);

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

    const toastLoading = toast.loading('Adding vendor and price...');
    setIsLoading(true);

    try {
      await axiosInstance.post('/api/product/add-price', {
        productId,
        vendorCode: formData.vendorCode,
        price: Number(formData.price),
      });
      await mutate();
      toast.success('Vendor and price added successfully');
      onClose();
    } catch (err) {
      if (isAxiosError(err)) {
        if (err?.response?.data.message) {
          toast.error(err.response.data.message);
        }
      } else {
        toast.error('Something went wrong. Please try again later.');
      }
    } finally {
      toast.dismiss(toastLoading);
      setIsLoading(false);
    }
  };

  if (!isMounted) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} hasTransitionedIn={hasTransitionedIn} isLoading={isLoading}>
      <div className="p-9 bg-white rounded-[20px]" onClick={(ev) => ev.stopPropagation()}>
        <h3 className="font-bold font-inter text-2xl leading-[30px] text-black">Add new vendor</h3>
        <div className="h-[3px] w-[500px] mt-3 bg-primary"></div>
        <form onSubmit={onSubmit}>
          <div className="flex mt-4 gap-4 flex-col">
            <Input
              onChange={(ev) => setFormData({ ...formData, vendorCode: ev.target.value.toUpperCase() })}
              value={formData.vendorCode}
              id={'vendor-code'}
              type="text"
              label="Vendor Code"
            />
            <Input
              onChange={(ev) => setFormData({ ...formData, price: ev.target.value })}
              value={formData.price}
              id={'price'}
              type="number"
              label="Price"
            />
          </div>
          <div className="flex mt-6 gap-6">
            <button
              type="button"
              className="flex-1 py-3 border border-solid border-gray-250 rounded-lg text-black font-inter leading-6 font-medium"
              onClick={() => !isLoading && onClose()}
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

export default AddPriceModal;
