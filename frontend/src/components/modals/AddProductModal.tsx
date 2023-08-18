import { useEffect, useRef, useState } from 'react';
import { KeyedMutator } from 'swr';

import Modal from '../ui/Modal';
import { useLocation } from 'react-router-dom';
import { createProduct } from '@/api/entity';
import useToken from '@/hooks/useToken';
import { toast } from 'react-hot-toast';

import CloseIcon from '@/assets/icons/close.svg';
import UploadIcon from '@/assets/images/upload.png';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  hasTransitionedIn: boolean;
  mutate: KeyedMutator<any>;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, hasTransitionedIn, mutate }) => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const { token } = useToken();
  const legalEntityCode = params.get('entityCode');

  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [SKU, setSKU] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [brand, setBrand] = useState<string>('');
  const [width, setWidth] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [length, setLength] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [material, setMaterial] = useState<string>('');
  const [color, setColor] = useState<string>('');

  const [selectedImage, setSelectedImage] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setName('');
    setDescription('');
    setSKU('');
    setCode('');
    setCategory('');
    setBrand('');
    setWidth('');
    setHeight('');
    setLength('');
    setWeight('');
    setMaterial('');
    setColor('');
    setSelectedImage(null);
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

  const onSubmit = async () => {
    if (loading) return;

    const product = {
      name,
      description,
      SKU,
      brand,
      code,
      category,
      weight,
      dimension: {
        width,
        height,
        length,
      },
      color,
      material,
      mediaFile: {
        productImage: 'Test',
        videoLink: 'test',
      },
      legalEntityCode,
    };

    setLoading(true);
    const toastLoading = toast.loading('Creating product...');

    const response = await createProduct(token, product);

    setLoading(false);
    toast.dismiss(toastLoading);

    if (!response) {
      toast.error('Something went wrong');
      return;
    }

    toast.success('Product created successfully');
    mutate();
    onClose();
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
          <input
            type="text"
            placeholder="Description"
            className={`w-full font-inter p-4 outline-none border border-solid border-[#F0F0F0] rounded-[5px] placeholder:text-[#637381] ${
              loading ? 'cursor-not-allowed opacity-80' : ''
            }`}
            value={description}
            onChange={(ev) => setDescription(ev.target.value)}
          />
          <div className="flex gap-14">
            <input
              type="text"
              placeholder="SKU"
              className={`w-full font-inter p-4 outline-none border border-solid border-[#F0F0F0] rounded-[5px] placeholder:text-[#637381] ${
                loading ? 'cursor-not-allowed opacity-80' : ''
              }`}
              value={SKU}
              onChange={(ev) => setSKU(ev.target.value)}
            />
            <input
              type="text"
              placeholder="Product Code"
              className={`w-full font-inter p-4 outline-none border border-solid border-[#F0F0F0] rounded-[5px] placeholder:text-[#637381] ${
                loading ? 'cursor-not-allowed opacity-80' : ''
              }`}
              value={code}
              onChange={(ev) => setCode(ev.target.value)}
            />
          </div>
          <div className="flex gap-14">
            <input
              type="text"
              placeholder="Category"
              className={`w-full font-inter p-4 outline-none border border-solid border-[#F0F0F0] rounded-[5px] placeholder:text-[#637381] ${
                loading ? 'cursor-not-allowed opacity-80' : ''
              }`}
              value={category}
              onChange={(ev) => setCategory(ev.target.value)}
            />
            <input
              type="text"
              placeholder="Brand"
              className={`w-full font-inter p-4 outline-none border border-solid border-[#F0F0F0] rounded-[5px] placeholder:text-[#637381] ${
                loading ? 'cursor-not-allowed opacity-80' : ''
              }`}
              value={brand}
              onChange={(ev) => setBrand(ev.target.value)}
            />
          </div>
          <div className="flex gap-14">
            <input
              type="text"
              placeholder="Width"
              className={`w-full font-inter p-4 outline-none border border-solid border-[#F0F0F0] rounded-[5px] placeholder:text-[#637381] ${
                loading ? 'cursor-not-allowed opacity-80' : ''
              }`}
              value={width}
              onChange={(ev) => setWidth(ev.target.value)}
            />
            <input
              type="text"
              placeholder="Height"
              className={`w-full font-inter p-4 outline-none border border-solid border-[#F0F0F0] rounded-[5px] placeholder:text-[#637381] ${
                loading ? 'cursor-not-allowed opacity-80' : ''
              }`}
              value={height}
              onChange={(ev) => setHeight(ev.target.value)}
            />
          </div>
          <div className="flex gap-14">
            <input
              type="text"
              placeholder="Length"
              className={`w-full font-inter p-4 outline-none border border-solid border-[#F0F0F0] rounded-[5px] placeholder:text-[#637381] ${
                loading ? 'cursor-not-allowed opacity-80' : ''
              }`}
              value={length}
              onChange={(ev) => setLength(ev.target.value)}
            />
            <input
              type="text"
              placeholder="Weight"
              className={`w-full font-inter p-4 outline-none border border-solid border-[#F0F0F0] rounded-[5px] placeholder:text-[#637381] ${
                loading ? 'cursor-not-allowed opacity-80' : ''
              }`}
              value={weight}
              onChange={(ev) => setWeight(ev.target.value)}
            />
          </div>
          <div className="flex gap-14">
            <input
              type="text"
              placeholder="Material"
              className={`w-full font-inter p-4 outline-none border border-solid border-[#F0F0F0] rounded-[5px] placeholder:text-[#637381] ${
                loading ? 'cursor-not-allowed opacity-80' : ''
              }`}
              value={material}
              onChange={(ev) => setMaterial(ev.target.value)}
            />
            <input
              type="text"
              placeholder="Color"
              className={`w-full font-inter p-4 outline-none border border-solid border-[#F0F0F0] rounded-[5px] placeholder:text-[#637381] ${
                loading ? 'cursor-not-allowed opacity-80' : ''
              }`}
              value={color}
              onChange={(ev) => setColor(ev.target.value)}
            />
          </div>
        </div>
        <button
          className={`flex justify-center items-center h-14 w-full mt-10 rounded-[5px] placeholder:text-[#637381] text-white font-roboto leading-5 bg-primary ${
            loading ? 'cursor-not-allowed opacity-80' : ''
          }`}
          onClick={onSubmit}
        >
          Submit
        </button>
      </div>
    </Modal>
  );
};

export default AddProductModal;
