import InfoModal from '@/components/infoModals/InfoModal';
import useCurrentUser from '@/hooks/useCurrentUser';
import useMountTransition from '@/hooks/useMountTransition';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';

const InfoModalLayout = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const hasTransitionedIn = useMountTransition(isOpen, 200);

  const { isLoading } = useCurrentUser();

  const location = useLocation();

  return (
    <>
      {children}
      {!isLoading && (
        <>
          <button
            onClick={() => setIsOpen(true)}
            className="fixed bottom-4 right-4 bg-primary text-white h-12 w-12 text-xl font-bold rounded-full"
          >
            ?
          </button>
          <InfoModal
            isOpen={isOpen}
            hasTransitionedIn={hasTransitionedIn}
            isLoading={false}
            onClose={() => setIsOpen(false)}
            location={location.pathname}
          />
        </>
      )}
    </>
  );
};

export default InfoModalLayout;
