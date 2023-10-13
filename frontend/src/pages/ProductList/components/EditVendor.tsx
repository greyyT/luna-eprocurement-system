import axiosInstance, { handleError } from '@/api/axios';
import ActionButton from '@/components/ui/ActionButton';
import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { KeyedMutator } from 'swr';
import { z } from 'zod';

interface EditVendorProps {
  id: string;
  name: string;
  price: string | number;
  mutate: KeyedMutator<any>;
}

const priceSchema = z
  .string()
  .min(1, { message: 'Price is required' })
  .regex(/^\d+(\.\d{1,2})?$/, { message: 'Price must be a number with up to 2 decimal places' });

const EditVendor: React.FC<EditVendorProps> = ({ id, name, price, mutate }) => {
  const [edit, setEdit] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [editPrice, setEditPrice] = useState<string>(String(price));
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (edit) {
      setEditPrice(String(price));
    }
  }, [edit, price]);

  const onSubmit = async () => {
    if (loading) return;

    // Validate the input
    const validationResult = priceSchema.safeParse(editPrice);

    // If the input is invalid, display the first error messages
    if (!validationResult.success) {
      const errors = validationResult.error.errors;

      if (errors.length > 0) {
        toast.error(errors[0].message);
        return;
      }
    }

    if (Number(editPrice) === Number(price)) {
      toast('Nothing was changed!', {
        icon: '🔔',
      });
      return;
    }

    setLoading(true);
    const toastLoading = toast.loading('Updating price...');
    try {
      await axiosInstance.patch(`/api/product/update-price`, { id, price: Number(editPrice) });
      await mutate();
      toast.success('Price updated successfully');
    } catch (error) {
      if (error instanceof AxiosError) {
        const message = handleError(error);
        toast.error(message);
      } else {
        toast.error('Something went wrong');
      }
    } finally {
      setLoading(false);
      setEdit(false);
      toast.dismiss(toastLoading);
    }
  };

  const onDelete = async () => {
    if (loading) return;

    setLoading(true);
    const toastLoading = toast.loading('Deleting price...');
    try {
      await axiosInstance.delete(`/api/product/delete-price/${id}`);
      await mutate();
      toast.success('Price deleted successfully');
    } catch (error) {
      if (error instanceof AxiosError) {
        const message = handleError(error);
        toast.error(message);
      } else {
        toast.error('Something went wrong');
      }
    } finally {
      setLoading(false);
      setEdit(false);
      toast.dismiss(toastLoading);
    }
  };

  const onCancel = () => {
    if (loading) return;
    setEditPrice('');
    setError('');
    setEdit(false);
  };

  return (
    <div className="w-full grid grid-cols-3 py-[18px]">
      {!edit ? (
        <>
          <h3 className="font-inter font-semibold leading-6 text-black flex justify-center py-[50px]">{name}</h3>
          <h3 className="font-inter font-semibold leading-6 text-black flex justify-center items-center">
            {Number(price).toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 2,
            })}
          </h3>
          <div className="flex justify-center items-center gap-4">
            <ActionButton type="edit" onClick={() => setEdit(true)} />
            <ActionButton type="delete" onClick={onDelete} />
          </div>
        </>
      ) : (
        <>
          <h3 className="font-inter font-semibold leading-6 text-black flex justify-center py-[50px]">{name}</h3>
          <div className="flex flex-col justify-center items-center">
            <input
              type="number"
              value={editPrice}
              onChange={(ev) => setEditPrice(ev.target.value)}
              className="
                w-[152px] 
                p-4 
                font-inter 
                font-semibold 
                leading-6 
                text-black 
                outline-none 
                border-solid 
                border-[2px] 
                border-primary 
                rounded-lg"
              placeholder={String(price)}
            />
            <p className="text-sm text-red font-light">{error}</p>
          </div>
          <div className="flex justify-center items-center gap-4">
            <ActionButton type="done" onClick={onSubmit} />
            <ActionButton type="cancel" onClick={onCancel} />
          </div>
        </>
      )}
    </div>
  );
};

export default EditVendor;
