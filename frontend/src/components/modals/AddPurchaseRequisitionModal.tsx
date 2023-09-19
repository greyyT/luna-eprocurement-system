import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';

import Modal from '../ui/Modal';
import SelectBox from './SelectBox';
import DatePick from '../ui/DatePick';

import PlusIcon from '@/assets/icons/plus-white.svg';
import MinusIcon from '@/assets/icons/minus.svg';
import useCurrentUser from '@/hooks/useCurrentUser';
import useToken from '@/hooks/useToken';
import axiosInstance from '@/api/axios';
import { isAxiosError } from 'axios';

interface AddPurchaseRequisitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  hasTransitionedIn: boolean;
}

interface Product {
  code: string;
  quantity: string;
}

const AddPurchaseRequisitionModal: React.FC<AddPurchaseRequisitionModalProps> = ({
  isOpen,
  onClose,
  hasTransitionedIn,
}) => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { token } = useToken();
  const { data: user } = useCurrentUser(token);

  const priority = ['Low', 'Medium', 'High'];

  const [name, setName] = useState<string>('');
  const [selectedPriority, setSelectedPriority] = useState<string | null>('');
  const [projectCode, setProjectCode] = useState<string>('');

  const [productList, setProductList] = useState<Product[]>([]);
  const [product, setProduct] = useState<Product>({
    code: '',
    quantity: '',
  });
  const [addProductState, setAddProductState] = useState<boolean>(true);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setName('');
    setSelectedPriority('');
    setProjectCode('');
    setProductList([]);
    setProduct({
      code: '',
      quantity: '',
    });
    setAddProductState(true);
  }, [isOpen]);

  const onAddProduct = () => {
    if (product.code === '' || product.quantity === '') {
      toast.error('Please fill all fields');
      return;
    }

    setProductList([...productList, product]);
    setProduct({
      code: '',
      quantity: '',
    });
    setAddProductState(false);
  };

  const onRemoveProduct = () => {
    if (isLoading) return;
    const newList = productList.slice(0, -1);
    setProductList(newList);
  };

  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Adding 1 because months are zero-based
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

  const onSubmit = async () => {
    if (isLoading) return;

    const targetDate = (document.getElementById('create-target-date') as HTMLInputElement).value;
    const dueDate = (document.getElementById('create-due-date') as HTMLInputElement).value;

    if (
      name === '' ||
      selectedPriority === '' ||
      projectCode === '' ||
      productList.length === 0 ||
      targetDate === '' ||
      dueDate === ''
    ) {
      toast.error('Please fill all fields');
      return;
    }

    if (new Date(targetDate) > new Date(dueDate)) {
      toast.error('Target date must be less than due date');
      return;
    }

    if (addProductState) {
      toast.error('Please save your changes first');
      return;
    }

    const purchaseRequisition = {
      projectCode,
      purchaseName: name,
      requester: user?.username,
      priority: selectedPriority,
      targetDate: formatDate(new Date(targetDate)),
      dueDate: formatDate(new Date(dueDate)),
      products: productList,
    };

    setIsLoading(true);
    const toastLoading = toast.loading('Creating purchase requisition...');

    try {
      await axiosInstance.post('/api/purchase-requisition', purchaseRequisition, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('Purchase requisition created');
      onClose();
    } catch (err) {
      if (isAxiosError(err)) {
        if (err?.response?.data.message) {
          toast.error(err.response.data.message);
        }
      } else {
        toast.error('Something went wrong!');
      }
    } finally {
      setIsLoading(false);
      toast.dismiss(toastLoading);
    }
  };

  if (!isMounted) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} hasTransitionedIn={hasTransitionedIn} isLoading={isLoading}>
      <div
        onClick={(ev) => ev.stopPropagation()}
        className="w-[997px] max-h-[80vh] bg-white rounded-lg py-12 pl-[71px] pr-[83px] overflow-y-auto"
      >
        <h1 className="font-semibold text-2xl leading-[30px] font-inter">Create a purchase requisition</h1>
        <div className="flex gap-7 mt-8">
          <div className="flex-1">
            <input
              value={name}
              readOnly={isLoading}
              onChange={(ev) => setName(ev.target.value)}
              type="text"
              placeholder="Purchase requisition name"
              className={`w-full border border-solid border-[#F0F0F0] rounded-[5px] py-[15px] px-[14px] text-mainText placeholder:text-mainText font-inter text-[15px] leading-5 outline-none ${
                isLoading ? 'cursor-not-allowed' : ''
              }`}
            />
          </div>
          <div className="flex-1">
            <SelectBox
              selected={selectedPriority}
              setSelected={setSelectedPriority}
              options={priority}
              alt="Priority"
              isLoading={isLoading}
              noItemPlaceholder="No priority"
              variant="purchase"
            />
          </div>
        </div>
        <div className="flex mt-4">
          <input
            type="text"
            placeholder="Project code"
            readOnly={isLoading}
            value={projectCode}
            onChange={(ev) => setProjectCode(ev.target.value)}
            className={`w-full border border-solid border-[#F0F0F0] rounded-[5px] py-[15px] px-[14px] text-mainText placeholder:text-mainText font-inter text-[15px] leading-5 outline-none ${
              isLoading ? 'cursor-not-allowed' : ''
            }`}
          />
        </div>
        <div className="flex mt-4 gap-7">
          <div className={`flex-1 ${isLoading ? 'cursor-not-allowed opacity-70' : ''}`}>
            <DatePick placeholder="Target date" id="create-target-date" clearBtn={false} />
          </div>
          <div className={`flex-1 ${isLoading ? 'cursor-not-allowed opacity-70' : ''}`}>
            <DatePick placeholder="Due date" id="create-due-date" clearBtn={false} />
          </div>
        </div>
        <div className="mt-4 py-5 px-[25px] border border-solid border-[#E7E7E7] rounded-lg">
          <div className="flex justify-between items-center">
            <h3 className="font-inter text-black font-semibold text-xl leading-[26px] capitalize">Add product list</h3>
            <div className="flex gap-2">
              <button
                className={`bg-primary h-6 w-6 flex items-center justify-center rounded-[4px] ${
                  isLoading ? 'cursor-not-allowed' : ''
                }`}
                onClick={() => {
                  if (isLoading) return;
                  setAddProductState(true);
                }}
              >
                <img src={PlusIcon} alt="" className="w-3" />
              </button>
              <img
                src={MinusIcon}
                alt=""
                className={`w-6 ${isLoading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                onClick={onRemoveProduct}
              />
            </div>
          </div>
          <div className="mt-11">
            <div className="flex px-6">
              <p className="flex-1 font-inter font-medium leading-6">Product code</p>
              <p className="flex-1 font-inter font-medium leading-6">Quantity</p>
            </div>
            <div className="line mt-[18px]"></div>
            {productList.length > 0 &&
              productList.map((product: Product, idx: number) => (
                <div className="contents" key={idx}>
                  <div className="flex px-6 mt-5">
                    <p className="flex-1 font-inter font-medium leading-6 text-mainText">{product.code}</p>
                    <p className="flex-1 font-inter font-medium leading-6 text-mainText">{product.quantity}</p>
                  </div>
                  <div className="line mt-[18px]"></div>
                </div>
              ))}
            {addProductState && (
              <>
                <div className="flex px-6 mt-5">
                  <div className="flex-1">
                    <input
                      type="text"
                      className="font-inter font-medium rounded-lg text-mainText border border-solid border-[#E7E7E7] outline-primary text-sm leading-5 py-2 px-3"
                      placeholder="Product code"
                      value={product.code}
                      onChange={(ev) => setProduct({ ...product, code: ev.target.value })}
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      className="font-inter font-medium rounded-lg text-mainText border border-solid border-[#E7E7E7] outline-primary text-sm leading-5 py-2 px-3"
                      placeholder="Quantity"
                      value={product.quantity}
                      onChange={(ev) => setProduct({ ...product, quantity: ev.target.value })}
                    />
                  </div>
                </div>
                <div className="flex gap-2 ml-6 mt-8">
                  <button
                    onClick={onAddProduct}
                    className="font-inter text-sm px-3 py-1 bg-white border border-solid border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-all"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setAddProductState(false)}
                    className="font-inter text-sm px-3 py-1 bg-white border border-solid border-warn text-warn rounded-lg hover:bg-warn hover:text-white transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        <button
          onClick={onSubmit}
          className={`mt-6 bg-primary text-white rounded-[5px] py-4 leading-5 w-full font-inter ${
            isLoading ? 'cursor-not-allowed opacity-70' : ''
          }`}
        >
          Submit
        </button>
      </div>
    </Modal>
  );
};

export default AddPurchaseRequisitionModal;
