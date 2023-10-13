import { useEffect, useRef, useState } from 'react';
import Modal from '../ui/Modal';
import { toast } from 'react-hot-toast';
import { KeyedMutator } from 'swr';
import { z } from 'zod';

import CloseIcon from '@/assets/icons/close.svg';
import UploadIcon from '@/assets/images/upload.png';
import { AxiosError } from 'axios';
import axiosInstance, { handleError } from '@/api/axios';

interface AddVendorModalProps {
  isOpen: boolean;
  onClose: () => void;
  hasTransitionedIn: boolean;
  mutate: KeyedMutator<any>;
}

const schema = z.object({
  businessName: z.string().min(1, { message: 'Business name is required' }),
  businessNumber: z.string().min(1, { message: 'Business number is required' }),
  code: z.string().min(1, { message: 'Vendor code is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
});

const AddVendorModal: React.FC<AddVendorModalProps> = ({ isOpen, onClose, hasTransitionedIn, mutate }) => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [formData, setFormData] = useState({
    businessName: '',
    businessNumber: '',
    code: '',
    description: '',
  });

  const [selectedImage, setSelectedImage] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState<boolean>(false);

  const onChangeImage = (ev: any) => {
    const selectedFile = ev.target.files[0];

    if (selectedFile) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };

      reader.readAsDataURL(selectedFile);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setFormData({
          businessName: '',
          businessNumber: '',
          code: '',
          description: '',
        });
      }, 200);
    }
  }, [isOpen]);

  const onAddImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const onSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    if (loading) return;

    // Validate the input
    const validationResult = schema.safeParse(formData);

    // If the input is invalid, display the first error messages
    if (!validationResult.success) {
      const errors = validationResult.error.errors;

      if (errors.length > 0) {
        toast.error(errors[0].message);
        return;
      }
    }

    setLoading(true);
    const toastLoading = toast.loading('Creating vendor...');

    const vendor = {
      businessName: formData.businessName,
      businessNumber: formData.businessNumber,
      code: formData.code,
      description: formData.description,
      vendorImage: selectedImage,
    };

    try {
      await axiosInstance.post('/api/vendor', vendor);
      await mutate();
      toast.success('Vendor created successfully');
      onClose();
    } catch (error) {
      if (error instanceof AxiosError) {
        const message = handleError(error);
        toast.error(message);
      } else {
        toast.error('Something went wrong');
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
        className="w-[939px] max-h-[80vh] bg-white rounded-lg py-12 pl-14 pr-11 overflow-y-scroll"
        onClick={(ev) => ev.stopPropagation()}
      >
        <div className="flex justify-between w-full">
          <h1 className="font-inter font-semibold text-2xl text-black">Create a new product</h1>
          <img
            src={CloseIcon}
            alt=""
            onClick={() => {
              if (!loading) onClose();
            }}
            className="cursor-pointer p-2 hover:"
          />
        </div>
        <input type="file" ref={fileInputRef} className="hidden" onChange={onChangeImage} />
        {selectedImage ? (
          <div className="flex flex-col items-center gap-2 mt-4">
            <img src={selectedImage} alt="" className="w-60" />
            <p className="text-xs font-inter">
              Don't want this?{' '}
              <span className="text-primary cursor-pointer hover:underline font-inter" onClick={onAddImage}>
                Change the picture!
              </span>
            </p>
          </div>
        ) : (
          <div className="flex justify-center mt-9">
            <div className="flex flex-col items-center justify-center h-[180px] w-[389px] bg-[#F4F7FF] border border-dashed border-spacing-4 border-primary rounded-md">
              <img src={UploadIcon} className="h-10 cursor-pointer" alt="" onClick={onAddImage} />
              <p className="mt-[14px] text-xs font-inter">
                <span className="text-primary cursor-pointer font-inter hover:underline" onClick={onAddImage}>
                  Click to upload
                </span>
              </p>
              <p className="mt-1 text-center text-xs font-inter">
                SVG, PNG, JPG or GIF
                <br />
                (max, 800 X 800px)
              </p>
            </div>
          </div>
        )}
        <form onSubmit={onSubmit}>
          <div className="mt-7 flex flex-col gap-5">
            <input
              type="text"
              placeholder="Name"
              className={`w-full font-inter p-4 outline-none border border-solid border-[#F0F0F0] rounded-[5px] placeholder:text-[#637381] ${
                loading ? 'cursor-not-allowed opacity-80' : ''
              }`}
              value={formData.businessName}
              onChange={(ev) => setFormData({ ...formData, businessName: ev.target.value })}
            />
            <input
              type="text"
              placeholder="Description"
              className={`w-full font-inter p-4 outline-none border border-solid border-[#F0F0F0] rounded-[5px] placeholder:text-[#637381] ${
                loading ? 'cursor-not-allowed opacity-80' : ''
              }`}
              value={formData.description}
              onChange={(ev) => setFormData({ ...formData, description: ev.target.value })}
            />
            <input
              type="text"
              placeholder="Vendor Code"
              className={`w-full font-inter p-4 outline-none border border-solid border-[#F0F0F0] rounded-[5px] placeholder:text-[#637381] ${
                loading ? 'cursor-not-allowed opacity-80' : ''
              }`}
              value={formData.code}
              onChange={(ev) => setFormData({ ...formData, code: ev.target.value.toUpperCase() })}
            />
            <input
              type="text"
              placeholder="Bussiness Number"
              className={`w-full font-inter p-4 outline-none border border-solid border-[#F0F0F0] rounded-[5px] placeholder:text-[#637381] ${
                loading ? 'cursor-not-allowed opacity-80' : ''
              }`}
              value={formData.businessNumber}
              onChange={(ev) => setFormData({ ...formData, businessNumber: ev.target.value })}
            />
          </div>
          <button
            type="submit"
            className={`flex justify-center items-center h-14 w-full mt-10 rounded-[5px] placeholder:text-[#637381] text-white font-roboto leading-5 bg-primary ${
              loading ? 'cursor-not-allowed opacity-80' : ''
            }`}
          >
            Submit
          </button>
        </form>
      </div>
    </Modal>
  );
};

export default AddVendorModal;
