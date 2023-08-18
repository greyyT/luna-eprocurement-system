import { KeyedMutator } from 'swr';
import Input from '../ui/Input';
import { useEffect, useState } from 'react';
import Modal from '../ui/Modal';
import { toast } from 'react-hot-toast';
import useToken from '@/hooks/useToken';
import { useParams } from 'react-router-dom';
import { addContact } from '@/api/entity';

interface AddContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  hasTransitionedIn: boolean;
  mutate: KeyedMutator<any>;
}

const AddContactModal: React.FC<AddContactModalProps> = ({ isOpen, onClose, hasTransitionedIn, mutate }) => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { token } = useToken();
  const { vendorCode } = useParams();

  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [position, setPosition] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(false);

  if (!isMounted) return null;

  const onSubmit = async () => {
    if (isLoading) return;

    const toastLoading = toast.loading('Adding contact...');
    setIsLoading(true);

    const response = await addContact(token, vendorCode, {
      name,
      phone,
      position,
    });

    toast.dismiss(toastLoading);
    setIsLoading(false);

    if (!response) {
      toast.error('Something went wrong');
      return;
    }

    toast.success('Successfully added contact');
    mutate();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} hasTransitionedIn={hasTransitionedIn} isLoading={isLoading}>
      <div className="p-9 bg-white rounded-[20px]" onClick={(ev) => ev.stopPropagation()}>
        <h3 className="font-bold font-inter text-2xl leading-[30px] text-black">Add new contact</h3>
        <div className="h-[3px] w-[500px] mt-3 bg-primary"></div>
        <div className="flex mt-4 gap-4 flex-col">
          <Input onChange={(ev) => setName(ev.target.value)} value={name} id={'name'} type="text" label="Full Name" />
          <Input
            onChange={(ev) => setPhone(ev.target.value)}
            value={phone}
            id={'phone'}
            type="text"
            label="Phone Number"
          />
          <Input
            onChange={(ev) => setPosition(ev.target.value)}
            value={position}
            id={'position'}
            type="text"
            label="Position"
          />
        </div>
        <div className="flex mt-6 gap-6">
          <button
            className={`flex-1 py-3 border border-solid border-gray-250 rounded-lg text-black font-inter leading-6 font-medium ${
              isLoading ? 'cursor-not-allowed opacity-50' : ''
            }`}
            onClick={() => {
              if (!isLoading) onClose();
            }}
          >
            Close
          </button>
          <button
            className={`flex-1 py-3 font-inter leading-6 font-medium bg-primary text-white rounded-lg ${
              isLoading ? 'cursor-not-allowed opacity-50' : ''
            }`}
            onClick={onSubmit}
          >
            Accept
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AddContactModal;
