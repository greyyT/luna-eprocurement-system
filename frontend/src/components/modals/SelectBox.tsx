import { useModal } from '@/hooks/useModal';
import useMountTransition from '@/hooks/useMountTransition';
import React, { useCallback, useEffect, useState } from 'react';

import ArrowActive from '@/assets/icons/arrow-active.svg';
import ArrowInactive from '@/assets/icons/arrow-inactive.svg';

interface SelectBoxProps {
  options: any;
  selected: any;
  setSelected: any;
  code?: string;
  name?: string;
  alt: string;
  isLoading: boolean;
}

const SelectBox: React.FC<SelectBoxProps> = React.memo(
  ({ options, selected, setSelected, code, name, alt, isLoading }) => {
    const closable = useModal((state) => state.closable);
    const setClosable = useModal((state) => state.setClosable);

    const [active, setActive] = useState<boolean>(false);
    const [newOptions, setNewOptions] = useState<any>(options);

    const hasTransitionedIn = useMountTransition(active, 200);

    useEffect(() => {
      if (code) {
        setNewOptions(options?.filter((option: any) => option?.[code] !== selected?.[code]).sort());
      } else {
        setNewOptions(options?.filter((option: any) => option !== selected).sort());
      }
    }, [selected, options, code]);

    useEffect(() => {
      if (closable) {
        setActive(false);
      }
    }, [closable]);

    const onClick = useCallback(
      (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        ev.stopPropagation();
        setClosable(active);
        setActive(!active);
      },
      [active, setClosable],
    );

    return (
      <button
        onClick={onClick}
        className={`w-[500px] flex items-center py-3 px-5 relative border border-solid rounded-[5px] 
        ${isLoading ? 'opacity-80 cursor-not-allowed' : ''} 
        ${selected === false ? 'opacity-30 pointer-events-none' : active ? 'border-primary' : 'border-gray-100'}`}
      >
        <div className="flex justify-between w-full">
          <p className={`font-inter font-medium leading-6 pointer ${active ? 'text-primary' : ' text-black'}`}>
            {typeof selected !== 'object'
              ? selected
                ? selected
                : `-- ${alt} --`
              : name && selected?.[name]
              ? selected?.[name]
              : `-- ${alt} --`}
          </p>
          <img src={active ? ArrowActive : ArrowInactive} alt="" />
        </div>
        {selected !== false && (active || hasTransitionedIn) && (
          <div className={`select-box ${hasTransitionedIn && 'in'} ${active && 'visible'}`}>
            {!newOptions || newOptions?.length === 0 ? (
              <div className="py-2 text-center pl-5 w-full text-black font-inter font-semibold leading-6">
                -- No item available --
              </div>
            ) : (
              newOptions?.map((option: any) => {
                return (
                  <div
                    key={code ? option?.[code] : option}
                    onClick={() => setSelected(option)}
                    className="py-2 text-left pl-5 w-full text-mainText font-inter font-semibold leading-6 hover:bg-gray-200 hover:text-primary"
                  >
                    {name ? option?.[name] : option}
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

export default SelectBox;
