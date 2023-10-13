import { useEffect, useState } from 'react';
import { KeyedMutator } from 'swr';
import { toast } from 'react-hot-toast';

import Modal from '../ui/Modal';
import CloseIcon from '@/assets/icons/close.svg';
import axiosInstance, { handleError } from '@/api/axios';
import { useModal } from '@/hooks/useModal';
import SwitchButton from '../ui/SwitchButton';
import { z } from 'zod';
import { AxiosError } from 'axios';

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  hasTransitionedIn: boolean;
  mutate: KeyedMutator<any>;
  variant: string;
}

const addProjectSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  label: z.string().min(1, { message: 'Project Label is required' }),
  code: z.string().min(1, { message: 'Project Code is required' }),
  purchaseAllowance: z
    .string()
    .min(1, { message: 'Purchase Allowance is required' })
    .regex(/^\d+(\.\d{1,2})?$/, { message: 'Purchase Allowance must be a number with up to 2 decimal places' }),
});

const editProjectSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  label: z.string().min(1, { message: 'Project Label is required' }),
});

const AddProjectModal: React.FC<AddProjectModalProps> = ({ isOpen, onClose, hasTransitionedIn, mutate, variant }) => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
      setLabel(data?.label);
    }
  }, [variant, data, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setName('');
        setLabel('');
        setCode('');
        setPurchaseAllowance('');
      }, 200);
    }
  }, [isOpen, variant]);

  const onSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    if (loading) return;

    setLoading(true);
    const toastLoading = toast.loading(`${variant === 'add' ? 'Adding' : 'Editing'} project...`);

    let validationResult;
    // Validate the input
    if (variant === 'add') {
      validationResult = addProjectSchema.safeParse({ name, label, code, purchaseAllowance });
    } else {
      validationResult = editProjectSchema.safeParse({ name, label });
    }

    // If the input is invalid, display the first error messages
    if (!validationResult?.success) {
      const errors = validationResult?.error.errors;

      if (errors && errors.length > 0) {
        toast.error(errors[0].message);
        return;
      }
    }

    const project = {
      name,
      code,
      label,
      purchaseAllowance,
    };

    try {
      if (variant === 'add') {
        await axiosInstance.post(`/api/project`, project);
      } else {
        if (name !== data?.name || label !== data?.label) {
          await axiosInstance.patch(`/api/project/${data?.id}`, { name, label });
        }
        if (checked) {
          await axiosInstance.post(`/api/project/${data?.id}/mark-default`);
        }
      }
      await mutate();
      toast.success(`Project ${variant === 'add' ? 'added' : 'updated'} successfully`);
      onClose();
    } catch (error) {
      if (error instanceof AxiosError) {
        const message = handleError(error);
        toast.error(message);
      } else {
        toast.error('Something went wrong. Please try again later.');
      }
    } finally {
      setLoading(false);
      toast.dismiss(toastLoading);
    }
  };

  if (!isMounted) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} hasTransitionedIn={hasTransitionedIn} isLoading={loading}>
      <div
        className="w-[939px] max-h-[80vh] bg-white rounded-lg py-12 pl-14 pr-11"
        onClick={(ev) => ev.stopPropagation()}
      >
        <form onSubmit={onSubmit}>
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
              className={`
              w-full 
              font-inter 
              p-4 
              outline-none 
              border 
              border-solid 
              border-[#F0F0F0] 
              rounded-[5px] 
              placeholder:text-[#637381] 
              ${loading ? 'cursor-not-allowed opacity-80' : ''}`}
              value={name}
              onChange={(ev) => setName(ev.target.value)}
            />
            <input
              type="text"
              placeholder="Project label"
              readOnly={loading}
              className={`
              w-full 
              font-inter 
              p-4 
              outline-none 
              border 
              border-solid 
              border-[#F0F0F0] 
              rounded-[5px] 
              placeholder:text-[#637381] 
              ${loading ? 'cursor-not-allowed opacity-80' : ''}`}
              value={label}
              onChange={(ev) => setLabel(ev.target.value)}
            />
            {variant === 'add' && (
              <>
                <input
                  type="text"
                  placeholder="Project code"
                  readOnly={loading}
                  className={`
                  w-full 
                  font-inter 
                  p-4 
                  outline-none 
                  border 
                  border-solid 
                  border-[#F0F0F0] 
                  rounded-[5px] 
                  placeholder:text-[#637381] 
                  ${loading ? 'cursor-not-allowed opacity-80' : ''}`}
                  value={code}
                  onChange={(ev) => setCode(ev.target.value.toUpperCase())}
                />
                <input
                  type="number"
                  placeholder="Purchase Allowance"
                  readOnly={loading}
                  className={`
                  w-full 
                  font-inter 
                  p-4 
                  outline-none 
                  border 
                  border-solid 
                  border-[#F0F0F0] 
                  rounded-[5px] 
                  placeholder:text-[#637381] 
                  ${loading ? 'cursor-not-allowed opacity-80' : ''}`}
                  value={purchaseAllowance}
                  onChange={(ev) => setPurchaseAllowance(ev.target.value)}
                />
              </>
            )}
          </div>
          <button
            type="submit"
            className={`
            flex 
            justify-center 
            items-center 
            h-14 
            w-full 
            mt-10 
            rounded-[5px] 
            text-white 
            font-roboto 
            leading-5 
            bg-primary 
            ${loading ? 'cursor-not-allowed opacity-80' : ''}`}
          >
            Submit
          </button>
        </form>
      </div>
    </Modal>
  );
};

export default AddProjectModal;
