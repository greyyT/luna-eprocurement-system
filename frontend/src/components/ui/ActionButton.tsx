import { useEffect, useState } from 'react';

interface ActionButtonProps {
  type: string;
  onClick: () => void;
  isLoading?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({ type, onClick, isLoading }) => {
  const [color, setColor] = useState<string>('');

  useEffect(() => {
    if (type === 'edit' || type === 'add team' || type === 'done') {
      setColor('primary');
    } else if (type === 'delete' || type === 'cancel') {
      setColor('red');
    }
  }, [type]);

  return (
    <button
      onClick={() => {
        if (isLoading) return;
        onClick();
      }}
      className={`flex items-center justify-center rounded-[32px] transition duration-50 bg-white border border-solid action-btn-${color} ${
        isLoading ? 'opacity-70 cursor-not-allowed' : ''
      }`}
    >
      <p className={`px-5 py-2 capitalize text-sm leading-[18px] hover:text-white`}>{type}</p>
    </button>
  );
};

export default ActionButton;
