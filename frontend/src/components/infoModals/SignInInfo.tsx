import Modal from '@/components/ui/Modal';

interface SignInInfoProps {
  isOpen: boolean;
  hasTransitionedIn: boolean;
  onClose: () => void;
  isLoading: boolean;
}

const SignInInfo: React.FC<SignInInfoProps> = ({ isOpen, hasTransitionedIn, onClose, isLoading }) => {
  return (
    <Modal isOpen={isOpen} hasTransitionedIn={hasTransitionedIn} onClose={onClose} isLoading={isLoading}>
      <div
        className="w-[997px] max-h-[80vh] bg-white rounded-lg py-12 pl-[71px] pr-[83px] overflow-y-auto"
        onClick={(ev) => ev.preventDefault()}
      ></div>
    </Modal>
  );
};

export default SignInInfo;
