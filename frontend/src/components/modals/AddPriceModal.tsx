import { useEffect, useState } from 'react';
import { KeyedMutator } from 'swr';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { addPrice } from '@/api/entity';
import useToken from '@/hooks/useToken';

interface AddPriceModalProps {
  isOpen: boolean;
  onClose: () => void;
  hasTransitionedIn: boolean;
  mutate: KeyedMutator<any>;
}

const AddPriceModal: React.FC<AddPriceModalProps> = ({ isOpen, onClose, hasTransitionedIn, mutate }) => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { token } = useToken();
  const { productCode } = useParams();

  const [vendorCode, setVendorCode] = useState<string>('');
  const [price, setPrice] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onSubmit = async () => {
    if (isLoading) return;

    const toastLoading = toast.loading('Adding vendor and price...');
    setIsLoading(true);

    const response = await addPrice(token, productCode, vendorCode, price);

    toast.dismiss(toastLoading);
    setIsLoading(false);

    if (!response) {
      toast.error('Something went wrong');
      return;
    }

    toast.success('Vendor and price added successfully');
    mutate();
    onClose();
  };

  if (!isMounted) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} hasTransitionedIn={hasTransitionedIn} isLoading={isLoading}>
      <div className="p-9 bg-white rounded-[20px]" onClick={(ev) => ev.stopPropagation()}>
        <h3 className="font-bold font-inter text-2xl leading-[30px] text-black">Add new vendor</h3>
        <div className="h-[3px] w-[500px] mt-3 bg-primary"></div>
        <div className="flex mt-4 gap-4 flex-col">
          <Input
            onChange={(ev) => setVendorCode(ev.target.value)}
            value={vendorCode}
            id={'vendor-code'}
            type="text"
            label="Vendor Code"
          />
          <Input onChange={(ev) => setPrice(ev.target.value)} value={price} id={'price'} type="text" label="Price" />
        </div>
        <div className="flex mt-6 gap-6">
          <button
            className="flex-1 py-3 border border-solid border-gray-250 rounded-lg text-black font-inter leading-6 font-medium"
            onClick={() => {
              if (!isLoading) onClose();
            }}
          >
            Close
          </button>
          <button
            className="flex-1 py-3 font-inter leading-6 font-medium bg-primary text-white rounded-lg"
            onClick={onSubmit}
          >
            Accept
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AddPriceModal;
