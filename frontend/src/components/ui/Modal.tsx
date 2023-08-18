import { useModal } from '@/hooks/useModal';

interface ModalProps {
  children: React.ReactNode;
  hasTransitionedIn: boolean;
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
}

const Modal: React.FC<ModalProps> = ({ children, hasTransitionedIn, isOpen, onClose, isLoading }) => {
  const closable = useModal((state) => state.closable);
  const setClosable = useModal((state) => state.setClosable);

  const handleClose = () => {
    if (isLoading) {
      return;
    }
    if (!closable) {
      setClosable(true);
    } else {
      onClose();
    }
  };

  if (!isOpen && !hasTransitionedIn) return null;

  return (
    <div className={`modal ${hasTransitionedIn && 'in'} ${isOpen && 'visible'}`} onClick={handleClose}>
      {children}
    </div>
  );
};

export default Modal;
