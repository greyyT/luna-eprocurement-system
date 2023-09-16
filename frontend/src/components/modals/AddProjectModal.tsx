import useToken from '@/hooks/useToken';
import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { KeyedMutator } from 'swr';
import Modal from '../ui/Modal';

import CloseIcon from '@/assets/icons/close.svg';
import { toast } from 'react-hot-toast';
import axiosInstance from '@/api/axios';
import { useModal } from '@/hooks/useModal';
import SwitchButton from '../ui/SwitchButton';

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  hasTransitionedIn: boolean;
  mutate: KeyedMutator<any>;
  variant: string;
}

const AddProjectModal: React.FC<AddProjectModalProps> = ({ isOpen, onClose, hasTransitionedIn, mutate, variant }) => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const { token } = useToken();
  const legalEntityCode = params.get('entityCode');

  const data = useModal((state) => state.data);

  const [name, setName] = useState<string>('');
  const [label, setLabel] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [purchaseAllowance, setPurchaseAllowance] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);

  const [checked, setChecked] = useState<boolean>(false);

  useEffect(() => {
    if (variant === 'edit' && isOpen) {
      setName(data?.name);
      setChecked(data?.isDefault);
    }
  }, [variant, data, isOpen]);

  useEffect(() => {
    if (variant !== 'edit') {
      setName('');
      setLabel('');
      setCode('');
      setPurchaseAllowance('');
    }
  }, [isOpen, variant]);

  const onSubmit = useCallback(async () => {
    if (loading) return;

    setLoading(true);
    const toastLoading = toast.loading('Adding project...');

    const project = {
      name,
      projectCode: {
        code,
        label,
      },
      purchaseAllowance,
      legalEntityCode,
    };

    try {
      if (variant === 'add') {
        await axiosInstance.post(`/api/project`, project, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success('Project added successfully');
      } else {
        if (name !== data?.name) {
          await axiosInstance.patch(
            `/api/project/${data?.projectCode.code}`,
            { name },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
        }
        if (checked) {
          await axiosInstance.post(
            `/api/project/${data?.projectCode.code}/markDefault`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
        }
        toast.success('Project updated successfully');
      }
      onClose();
      mutate();
    } catch (error) {
      if (variant === 'add') toast.error('Failed to add project');
      else toast.error('Failed to update project');
    } finally {
      setLoading(false);
      toast.dismiss(toastLoading);
    }
  }, [code, label, legalEntityCode, name, purchaseAllowance, token, onClose, loading, mutate, variant, data, checked]);

  if (!isMounted) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} hasTransitionedIn={hasTransitionedIn} isLoading={loading}>
      <div
        className="w-[939px] max-h-[80vh] bg-white rounded-lg py-12 pl-14 pr-11"
        onClick={(ev) => ev.stopPropagation()}
      >
        <div className="flex justify-between w-full">
          <h1 className="font-inter font-semibold text-2xl text-black">
            {variant === 'add' ? 'Create a new project' : 'Edit project'}
          </h1>
          <img
            src={CloseIcon}
            alt=""
            onClick={() => {
              if (!loading) onClose();
            }}
            className="cursor-pointer p-2 hover:"
          />
        </div>
        {variant === 'edit' && (
          <div className="flex gap-2 items-center">
            <h2 className="font-inter text-sm">Mark this project as default</h2>
            <SwitchButton disable={data?.isDefault} checked={checked} onChange={() => setChecked(!checked)} />
          </div>
        )}
        <div className="mt-7 flex flex-col gap-5">
          <input
            type="text"
            placeholder="Name"
            className={`w-full font-inter p-4 outline-none border border-solid border-[#F0F0F0] rounded-[5px] placeholder:text-[#637381] ${
              loading ? 'cursor-not-allowed opacity-80' : ''
            }`}
            value={name}
            onChange={(ev) => setName(ev.target.value)}
          />
          {variant === 'add' && (
            <>
              <input
                type="text"
                placeholder="Project label"
                className={`w-full font-inter p-4 outline-none border border-solid border-[#F0F0F0] rounded-[5px] placeholder:text-[#637381] ${
                  loading ? 'cursor-not-allowed opacity-80' : ''
                }`}
                value={label}
                onChange={(ev) => setLabel(ev.target.value)}
              />
              <input
                type="text"
                placeholder="Project code"
                className={`w-full font-inter p-4 outline-none border border-solid border-[#F0F0F0] rounded-[5px] placeholder:text-[#637381] ${
                  loading ? 'cursor-not-allowed opacity-80' : ''
                }`}
                value={code}
                onChange={(ev) => setCode(ev.target.value)}
              />
              <input
                type="text"
                placeholder="Purchase Allowance"
                className={`w-full font-inter p-4 outline-none border border-solid border-[#F0F0F0] rounded-[5px] placeholder:text-[#637381] ${
                  loading ? 'cursor-not-allowed opacity-80' : ''
                }`}
                value={purchaseAllowance}
                onChange={(ev) => setPurchaseAllowance(ev.target.value)}
              />
            </>
          )}
        </div>
        <button
          onClick={onSubmit}
          className={`flex justify-center items-center h-14 w-full mt-10 rounded-[5px] placeholder:text-[#637381] text-white font-roboto leading-5 bg-primary ${
            loading ? 'cursor-not-allowed opacity-80' : ''
          }`}
        >
          Submit
        </button>
      </div>
    </Modal>
  );
};

export default AddProjectModal;
