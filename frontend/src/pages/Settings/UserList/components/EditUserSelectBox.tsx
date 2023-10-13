import { useModal } from '@/hooks/useModal';
import useMountTransition from '@/hooks/useMountTransition';
import React, { useEffect, useState } from 'react';

import ArrowActive from '@/assets/icons/arrow-active.svg';
import ArrowInactive from '@/assets/icons/arrow-inactive.svg';

interface EditUserSelectBoxProps {
  options: any;
  selected: any;
  setSelected: any;
  alt: string;
  placeholder: string;
  isLoading: boolean;
  name: string;
}

const EditUserSelectBox: React.FC<EditUserSelectBoxProps> = React.memo(
  ({ options, selected, setSelected, alt, isLoading, placeholder, name }) => {
    const closable = useModal((state) => state.closable);
    const setClosable = useModal((state) => state.setClosable);

    const [active, setActive] = useState<boolean>(false);
    const [newOptions, setNewOptions] = useState<any>(options);

    const hasTransitionedIn = useMountTransition(active, 200);

    useEffect(() => {
      setNewOptions(options?.filter((option: any) => option?.id !== selected?.id));
    }, [selected, options]);

    // Detect click outside of the select box, if clicked, close the select box
    useEffect(() => {
      if (closable) {
        setActive(false);
      }
    }, [closable]);

    // Detect click on the select box, if clicked, open the select box, toggle closable state
    const onClick = (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      if (isLoading) return;
      ev.stopPropagation();
      setClosable(active);
      setActive(!active);
    };

    return (
      <button
        onClick={onClick}
        className={`
          w-full 
          flex 
          items-center 
          py-3 
          px-5
          relative 
          border
          border-solid 
          rounded-[5px] 
          ${isLoading ? 'opacity-80 cursor-not-allowed' : ''} 
          ${active ? 'border-primary' : 'border-gray-100'}
          ${!options ? 'cursor-not-allowed pointer-events-none opacity-60' : ''}
        `}
      >
        <div className="flex justify-between w-full">
          <p
            className={`
              font-inter 
              leading-6 
              font-medium} 
              ${active ? 'text-primary' : 'text-black'}`}
          >
            {selected?.[name] || alt}
          </p>
          <img src={active ? ArrowActive : ArrowInactive} alt="" />
        </div>
        {options && (active || hasTransitionedIn) && (
          <div className={`select-box ${hasTransitionedIn && 'in'} ${active && 'visible'}`}>
            {!newOptions || newOptions?.length === 0 ? (
              <p className="py-2 text-center pl-5 w-full text-black font-inter font-semibold leading-6">
                {placeholder}
              </p>
            ) : (
              newOptions?.map((option: any) => {
                return (
                  <div
                    key={option?.id}
                    onClick={() => setSelected(option)}
                    className="py-2 text-left pl-5 w-full text-mainText font-inter font-semibold leading-6 hover:bg-gray-200 hover:text-primary"
                  >
                    {option?.[name]}
                  </div>
                );
              })
            )}
          </div>
        )}
      </button>
    );
  },
);

export default EditUserSelectBox;
