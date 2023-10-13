import { useEffect, useRef, useState } from 'react';
import { KeyedMutator } from 'swr';

import Modal from '../ui/Modal';
import { toast } from 'react-hot-toast';
import { z } from 'zod';

import CloseIcon from '@/assets/icons/close.svg';
import UploadIcon from '@/assets/images/upload.png';
import axiosInstance, { handleError } from '@/api/axios';
import { AxiosError } from 'axios';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  hasTransitionedIn: boolean;
  mutate: KeyedMutator<any>;
}

const schema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
  SKU: z.string().min(1, { message: 'SKU is required' }),
  code: z.string().min(1, { message: 'Code is required' }),
  category: z.string().min(1, { message: 'Category is required' }),
  brand: z.string().min(1, { message: 'Brand is required' }),
  width: z.string().min(1, { message: 'Width is required' }),
  height: z.string().min(1, { message: 'Height is required' }),
  length: z.string().min(1, { message: 'Length is required' }),
  weight: z.string().min(1, { message: 'Weight is required' }),
  material: z.string().min(1, { message: 'Material is required' }),
  color: z.string().min(1, { message: 'Color is required' }),
});

const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, hasTransitionedIn, mutate }) => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    SKU: '',
    code: '',
    category: '',
    brand: '',
    width: '',
    height: '',
    length: '',
    weight: '',
    material: '',
    color: '',
  });

  const [selectedImage, setSelectedImage] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setFormData({
          name: '',
          description: '',
          SKU: '',
          code: '',
          category: '',
          brand: '',
          width: '',
          height: '',
          length: '',
          weight: '',
          material: '',
          color: '',
        });
      }, 200);
    }
  }, [isOpen]);

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

  const onAddImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const onSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    if (loading) return;

    const validationResult = schema.safeParse(formData);

    if (!validationResult.success) {
      const errors = validationResult.error.errors;

      if (errors.length > 0) {
        toast.error(errors[0].message);
        return;
      }
    }

    const product = {
      name: formData.name,
      description: formData.description,
      SKU: formData.SKU,
      brand: formData.brand,
      code: formData.code,
      category: formData.category,
      weight: formData.weight,
      dimension: {
        width: formData.width,
        height: formData.height,
        length: formData.length,
      },
      color: formData.color,
      material: formData.material,
      productImage: selectedImage,
    };

    setLoading(true);
    const toastLoading = toast.loading('Creating product...');

    try {
      await axiosInstance.post('/api/product', product);
      await mutate();
      toast.success('Product created successfully');
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
        className="w-[939px] max-h-[80vh] bg-white rounded-lg py-12 pl-14 pr-11 overflow-y-auto"
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
              value={formData.name}
              onChange={(ev) => setFormData({ ...formData, name: ev.target.value })}
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
            <div className="flex gap-14">
              <input
                type="text"
                placeholder="SKU"
                className={`w-full font-inter p-4 outline-none border border-solid border-[#F0F0F0] rounded-[5px] placeholder:text-[#637381] ${
                  loading ? 'cursor-not-allowed opacity-80' : ''
                }`}
                value={formData.SKU}
                onChange={(ev) => setFormData({ ...formData, SKU: ev.target.value })}
              />
              <input
                type="text"
                placeholder="Product Code"
                className={`w-full font-inter p-4 outline-none border border-solid border-[#F0F0F0] rounded-[5px] placeholder:text-[#637381] ${
                  loading ? 'cursor-not-allowed opacity-80' : ''
                }`}
                value={formData.code}
                onChange={(ev) => setFormData({ ...formData, code: ev.target.value.toUpperCase() })}
              />
            </div>
            <div className="flex gap-14">
              <input
                type="text"
                placeholder="Category"
                className={`w-full font-inter p-4 outline-none border border-solid border-[#F0F0F0] rounded-[5px] placeholder:text-[#637381] ${
                  loading ? 'cursor-not-allowed opacity-80' : ''
                }`}
                value={formData.category}
                onChange={(ev) => setFormData({ ...formData, category: ev.target.value })}
              />
              <input
                type="text"
                placeholder="Brand"
                className={`w-full font-inter p-4 outline-none border border-solid border-[#F0F0F0] rounded-[5px] placeholder:text-[#637381] ${
                  loading ? 'cursor-not-allowed opacity-80' : ''
                }`}
                value={formData.brand}
                onChange={(ev) => setFormData({ ...formData, brand: ev.target.value })}
              />
            </div>
            <div className="flex gap-14">
              <input
                type="text"
                placeholder="Width (cm)"
                className={`w-full font-inter p-4 outline-none border border-solid border-[#F0F0F0] rounded-[5px] placeholder:text-[#637381] ${
                  loading ? 'cursor-not-allowed opacity-80' : ''
                }`}
                value={formData.width}
                onChange={(ev) => setFormData({ ...formData, width: ev.target.value })}
              />
              <input
                type="text"
                placeholder="Height (cm)"
                className={`w-full font-inter p-4 outline-none border border-solid border-[#F0F0F0] rounded-[5px] placeholder:text-[#637381] ${
                  loading ? 'cursor-not-allowed opacity-80' : ''
                }`}
                value={formData.height}
                onChange={(ev) => setFormData({ ...formData, height: ev.target.value })}
              />
            </div>
            <div className="flex gap-14">
              <input
                type="text"
                placeholder="Length (cm)"
                className={`w-full font-inter p-4 outline-none border border-solid border-[#F0F0F0] rounded-[5px] placeholder:text-[#637381] ${
                  loading ? 'cursor-not-allowed opacity-80' : ''
                }`}
                value={formData.length}
                onChange={(ev) => setFormData({ ...formData, length: ev.target.value })}
              />
              <input
                type="text"
                placeholder="Weight (kg)"
                className={`w-full font-inter p-4 outline-none border border-solid border-[#F0F0F0] rounded-[5px] placeholder:text-[#637381] ${
                  loading ? 'cursor-not-allowed opacity-80' : ''
                }`}
                value={formData.weight}
                onChange={(ev) => setFormData({ ...formData, weight: ev.target.value })}
              />
            </div>
            <div className="flex gap-14">
              <input
                type="text"
                placeholder="Material"
                className={`w-full font-inter p-4 outline-none border border-solid border-[#F0F0F0] rounded-[5px] placeholder:text-[#637381] ${
                  loading ? 'cursor-not-allowed opacity-80' : ''
                }`}
                value={formData.material}
                onChange={(ev) => setFormData({ ...formData, material: ev.target.value })}
              />
              <input
                type="text"
                placeholder="Color"
                className={`w-full font-inter p-4 outline-none border border-solid border-[#F0F0F0] rounded-[5px] placeholder:text-[#637381] ${
                  loading ? 'cursor-not-allowed opacity-80' : ''
                }`}
                value={formData.color}
                onChange={(ev) => setFormData({ ...formData, color: ev.target.value })}
              />
            </div>
          </div>
          <button
            className={`flex justify-center items-center h-14 w-full mt-10 rounded-[5px] placeholder:text-[#637381] text-white font-roboto leading-5 bg-primary ${
              loading ? 'cursor-not-allowed opacity-80' : ''
            }`}
            type="submit"
          >
            Submit
          </button>
        </form>
      </div>
    </Modal>
  );
};

export default AddProductModal;
