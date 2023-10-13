import { useEffect, useState } from 'react';

interface ActionButtonProps {
  type: 'edit' | 'delete' | 'add team' | 'cancel' | 'done';
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
      className={`
        flex 
        items-center 
        justify-center 
        rounded-[32px] 
        transition-all 
        bg-white 
        border 
        border-solid 
        action-btn-${color} 
        capitalize 
        text-sm 
        leading-[18px] 
        px-5 py-2 
        hover:text-white 
        font-inter 
        font-medium 
        ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
    >
      {type}
    </button>
  );
};

export default ActionButton;
