import { useEffect, useState } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import useToken from '@/hooks/useToken';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';

interface AddTeamModalProps {
  isOpen: boolean;
  hasTransitionedIn: boolean;
  onClose: () => void;
  variant: 'Department' | 'Team';
  handleCreate: any;
  departmentCode: string;
  mutate: any;
}

const AddTeamModal: React.FC<AddTeamModalProps> = ({
  isOpen,
  hasTransitionedIn,
  onClose,
  variant,
  handleCreate,
  departmentCode,
  mutate,
}) => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const legalEntityCode = params.get('entityCode') || '';

  const { token } = useToken();

  const [name, setName] = useState<string>('');
  const [code, setCode] = useState<string>('');

  useEffect(() => {
    setName('');
    setCode('');
  }, [isOpen]);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onSubmit = async () => {
    setIsLoading(true);
    const toastLoading = toast.loading(`Creating ${variant}...`);

    let response;

    if (variant === 'Department') {
      response = await handleCreate(token, name, code, legalEntityCode);
    } else {
      response = await handleCreate(token, name, code, departmentCode);
    }

    toast.dismiss(toastLoading);
    setIsLoading(false);

    if (!response) {
      console.log(response);
      toast.error('Something went wrong');
    }

    toast.success(`${variant} created successfully`);
    onClose();
    mutate();
  };

  if (!isMounted) return null;

  return (
    <Modal isOpen={isOpen} hasTransitionedIn={hasTransitionedIn} onClose={onClose} isLoading={isLoading}>
      <div className="p-9 bg-white rounded-[20px]" onClick={(ev) => ev.stopPropagation()}>
        <h3 className="font-bold font-inter text-2xl leading-[30px] text-black">Add {variant}</h3>
        <div className="h-[3px] w-[500px] mt-3 bg-primary"></div>
        <div className="flex mt-4 gap-4 flex-col">
          <Input
            onChange={(ev) => setName(ev.target.value)}
            value={name}
            id={'name'}
            type="text"
            label={`${variant} Name`}
          />
          <Input
            onChange={(ev) => setCode(ev.target.value)}
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
          >
            Close
          </button>
          <button
            className="flex-1 py-3 font-inter leading-6 font-medium bg-primary text-white rounded-lg"
            onClick={() => {
              if (!isLoading) onSubmit();
            }}
          >
            Accept
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AddTeamModal;
