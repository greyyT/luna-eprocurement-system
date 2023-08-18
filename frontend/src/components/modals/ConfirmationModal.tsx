import { useEffect, useState } from 'react';
import Modal from '../ui/Modal';

import CloseIcon from '@/assets/icons/close.svg';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  hasTransitionedIn: boolean;
  onConfirm: () => void;
  isLoading: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  hasTransitionedIn,
  onConfirm,
  isLoading,
}) => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} hasTransitionedIn={hasTransitionedIn} isLoading={isLoading}>
      <div className="p-6 bg-white w-[500px] rounded-lg relative" onClick={(ev) => ev.stopPropagation()}>
        <h1 className="font-inter font-semibold text-lg">Are you sure?</h1>
        <p className="font-inter text-sm">This action cannot be undone</p>
        <img src={CloseIcon} className="h-4 cursor-pointer absolute top-6 right-6" alt="" onClick={onClose} />
        <div className="flex items-center justify-end mt-10 gap-4">
          <button
            className={`px-4 py-2 border border-primary rounded-md text-xs font-inter text-primary transition duration-150 ${
              isLoading ? 'cursor-not-allowed opacity-70' : 'hover:bg-primary hover:bg-opacity-20'
            }`}
            onClick={() => {
              if (!isLoading) onClose();
            }}
          >
            Cancel
          </button>
          <button
            className={`px-4 py-2 border bg-red border-red rounded-md text-xs font-inter text-white transition duration-150 ${
              isLoading ? 'cursor-not-allowed opacity-70' : 'hover:bg-opacity-80'
            }`}
            onClick={() => {
              if (!isLoading) onConfirm();
            }}
          >
            Confirm
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
