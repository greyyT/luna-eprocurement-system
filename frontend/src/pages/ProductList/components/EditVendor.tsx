import { patchrPrice } from '@/api/entity';
import ActionButton from '@/components/ui/ActionButton';
import useToken from '@/hooks/useToken';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useLocation, useParams } from 'react-router-dom';
import { KeyedMutator } from 'swr';

interface EditVendorProps {
  name: string;
  price: string | number;
  vendorCode: string;
  mutate: KeyedMutator<any>;
}

const EditVendor: React.FC<EditVendorProps> = ({ name, price, vendorCode, mutate }) => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const { token } = useToken();
  const { productCode } = useParams();
  const entityCode = params.get('entityCode') || '';

  const [edit, setEdit] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [editPrice, setEditPrice] = useState<string>(String(price));
  const [error, setError] = useState<string>('');

  const onSubmit = async () => {
    setLoading(true);
    const toastLoading = toast.loading('Updating price...');

    const response = await patchrPrice(token, entityCode, productCode, vendorCode, editPrice);

    setLoading(false);
    toast.dismiss(toastLoading);

    if (!response) {
      toast.error('Something went wrong');
      return;
    }

    toast.success('Price updated successfully');
    mutate();
    setEdit(false);
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
            <ActionButton type="delete" onClick={() => {}} />
          </div>
        </>
      ) : (
        <>
          <h3 className="font-inter font-semibold leading-6 text-black flex justify-center py-[50px]">{name}</h3>
          <div className="flex flex-col justify-center items-center">
            <input
              type="text"
              value={editPrice}
              onChange={(ev) => setEditPrice(ev.target.value)}
              className="w-[152px] p-4 font-inter font-semibold leading-6 text-black outline-none border-solid border-[2px] border-primary rounded-lg"
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
