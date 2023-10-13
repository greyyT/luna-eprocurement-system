import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';

import Modal from '../ui/Modal';
import SelectBox from './SelectBox';
import DatePick from '../ui/DatePick';

import PlusIcon from '@/assets/icons/plus-white.svg';
import MinusIcon from '@/assets/icons/minus.svg';
import useCurrentUser from '@/hooks/useCurrentUser';
import axiosInstance, { handleError } from '@/api/axios';
import { AxiosError } from 'axios';
import { usePurchaseRequisition } from '@/hooks/usePurchaseRequisition';
import ArrowIcon from '@/assets/icons/arrow-inactive.svg';

interface AddPurchaseRequisitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  hasTransitionedIn: boolean;
}

interface Product {
  code: string;
  quantity: string;
  vendorCode: string;
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

  const { data: user } = useCurrentUser();

  const priority = ['LOW', 'MEDIUM', 'HIGH'];

  const [name, setName] = useState<string>('');
  const [selectedPriority, setSelectedPriority] = useState<string | null>('');

  // Variables for choosing project
  const [projectChangeable, setProjectChangeable] = useState<boolean>(true);
  const [projectSearch, setProjectSearch] = useState<any>();
  const [projectCode, setProjectCode] = useState<string>('');

  // Variables for choosing product
  const [productList, setProductList] = useState<Product[]>([]);
  const [productChangeable, setProductChangeable] = useState<boolean>(true);
  const [productSearch, setProductSearch] = useState<any>();
  const [product, setProduct] = useState<Product>({
    code: '',
    quantity: '',
    vendorCode: '',
  });

  // Variables for choosing vendor
  const [vendorList, setVendorList] = useState<any[]>([]);
  const [chooseVendor, setChooseVendor] = useState<boolean>(false);
  const [vendor, setVendor] = useState<any>();

  // Handle choosing product
  const onChooseProduct = (productItem: any) => {
    setProduct({
      code: productItem.code,
      quantity: '',
      vendorCode: '',
    });
    setVendorList(productItem?.providedVendorInfo);
    setProductChangeable(false);
    setProductSearch(null);
  };

  // Handle choosing vendor
  const onChooseVendor = (vendorItem: any) => {
    setProduct({ ...product, vendorCode: vendorItem?.vendorCode });
    setVendor(vendorItem);
    setVendorList((prev) => prev.filter((vendor: any) => vendor?.id !== vendorItem?.id));
    setChooseVendor(false);
  };

  // State for adding product
  const [addProductState, setAddProductState] = useState<boolean>(true);

  // Fetch data for choosing product
  useEffect(() => {
    if (addProductState && productChangeable && product.code !== '') {
      const onSearchProducts = async () => {
        try {
          const response = await axiosInstance.get(`/api/product?search=${product.code}&page=1&size=2`);
          setProductSearch(
            response?.data.data.filter((item: any) => !productList.map((p: any) => p.code).includes(item.code)),
          );
        } catch (error) {
          toast.error('Failed to search products');
        }
      };
      onSearchProducts();
    } else {
      setProductSearch(null);
    }
  }, [addProductState, productChangeable, product.code, productList]);

  // Fetch data for choosing project
  useEffect(() => {
    if (projectChangeable && projectCode !== '') {
      const onSearchProjects = async () => {
        try {
          const response = await axiosInstance.get(`/api/project?search=${projectCode}&page=1&size=2`);
          setProjectSearch(response?.data.data);
        } catch (error) {
          toast.error('Failed to search projects');
        }
      };
      onSearchProjects();
    } else {
      setProjectSearch(null);
    }
  }, [projectChangeable, projectCode]);

  const fetchPurchaseRequisition = usePurchaseRequisition((state) => state.fetchData);
  const filterPurchaseRequisition = usePurchaseRequisition((state) => state.filterDate);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) {
      setName('');
      setSelectedPriority('');
      setProjectCode('');
      setProductList([]);
      setProduct({
        code: '',
        quantity: '',
        vendorCode: '',
      });
      setAddProductState(true);
      setProductChangeable(true);
      setProjectChangeable(true);
      setChooseVendor(false);
      setVendorList([]);
      setVendor(null);
    }
  }, [isOpen]);

  // Add product to chosen product list
  const onAddProduct = () => {
    if (addProductState) {
      if (product.code === '' || product.quantity === '') {
        toast.error('Please fill all fields');
        return;
      }
    }

    setProductList([...productList, product]);
    setProduct({
      code: '',
      quantity: '',
      vendorCode: '',
    });
    setAddProductState(false);
    setProductChangeable(true);
    setVendor(null);
    setVendorList([]);
  };

  // Remove product from chosen product list
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

    const targetDateValue = (document.getElementById('create-target-date') as HTMLInputElement).value;
    const dueDateValue = (document.getElementById('create-due-date') as HTMLInputElement).value;

    if (name === '' || selectedPriority === '' || projectCode === '' || targetDateValue === '' || dueDateValue === '') {
      toast.error('Please fill all fields');
      return;
    }

    const targetDate = new Date(targetDateValue);
    const dueDate = new Date(dueDateValue);

    if (targetDate < new Date()) {
      toast.error('Target date must be greater than today');
      return;
    }

    if (dueDate < new Date()) {
      toast.error('Due date must be greater than today');
      return;
    }

    if (targetDate > dueDate) {
      toast.error('Target date must be less than due date');
      return;
    }

    if (addProductState) {
      toast.error('Please save your changes first');
      return;
    }

    if (projectChangeable) {
      toast.error('Please choose proper project');
      return;
    }

    const purchaseRequisition = {
      projectCode,
      purchaseName: name,
      requester: user?.username,
      priority: selectedPriority,
      targetDate: formatDate(targetDate),
      dueDate: formatDate(dueDate),
      products: productList,
    };

    setIsLoading(true);
    const toastLoading = toast.loading('Creating purchase requisition...');

    try {
      await axiosInstance.post('/api/purchase-requisition', purchaseRequisition);
      await fetchPurchaseRequisition();
      toast.success('Purchase requisition created');
      filterPurchaseRequisition();
      onClose();
    } catch (error) {
      if (error instanceof AxiosError) {
        const message = handleError(error);
        toast.error(message);
      } else {
        toast.error('Something went wrong. Please try again later.');
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
              className={`
                w-full 
                border 
                border-solid 
                border-[#F0F0F0] 
                rounded-[5px] 
                py-[15px] 
                px-[14px] 
                text-mainText 
                placeholder:text-mainText 
                font-inter 
                text-[15px] 
                leading-5 
                outline-none 
                ${isLoading ? 'cursor-not-allowed' : ''}
              `}
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
        <div className="flex mt-4 relative">
          <input
            type="text"
            placeholder="Project code"
            readOnly={isLoading || !projectChangeable}
            value={projectCode}
            onChange={(ev) => setProjectCode(ev.target.value.toUpperCase())}
            className={`
              w-full 
              border 
              border-solid 
              border-[#F0F0F0] 
              rounded-[5px] 
              py-[15px] 
              px-[14px] 
              text-mainText 
              placeholder:text-mainText 
              font-inter 
              text-[15px] 
              leading-5 
              outline-none 
              ${isLoading ? 'cursor-not-allowed' : ''}
            `}
          />
          {!projectChangeable && (
            <button
              onClick={() => setProjectChangeable(true)}
              className={`
                absolute 
                top-[15px] 
                right-2 
                font-inter 
                text-primary 
                bg-primary 
                bg-opacity-10 
                px-2 
                py-1 
                rounded-lg 
                text-xs
                ${isLoading ? 'cursor-not-allowed' : 'hover:bg-opacity-25 hover:font-medium transition-all'}
              `}
            >
              Change
            </button>
          )}
          {projectSearch && projectSearch.length > 0 && (
            <div className="absolute top-15 left-0 w-full bg-white rounded-lg shadow-lg border border-solid border-[#E7E7E7] z-10">
              {projectSearch.map((projectItem: any, idx: number) => (
                <div
                  className="px-4 py-4 cursor-pointer hover:bg-[#F0F0F0] transition-all"
                  key={idx}
                  onClick={() => {
                    setProjectCode(projectItem.code);
                    setProjectChangeable(false);
                  }}
                >
                  <p className="font-inter font-medium text-mainText text-sm">
                    {projectItem?.code}: {projectItem?.name}
                  </p>
                </div>
              ))}
            </div>
          )}
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
            <div className="flex px-6 gap-4">
              <p className="ml-3 flex-1 font-inter font-medium leading-6">Product code</p>
              <p className="ml-3 flex-1 font-inter font-medium leading-6">Provider</p>
              <p className="ml-3 flex-1 font-inter font-medium leading-6">Quantity</p>
            </div>
            <div className="line mt-[18px]"></div>
            {productList.length > 0 &&
              productList.map((product: Product, idx: number) => (
                <div className="contents" key={idx}>
                  <div className="flex px-6 mt-5 gap-4">
                    <p className="flex-1 font-inter font-medium leading-6 text-mainText ml-4">{product.code}</p>
                    <p className="flex-1 font-inter font-medium leading-6 text-mainText ml-4">{product.vendorCode}</p>
                    <p className="flex-1 font-inter font-medium leading-6 text-mainText ml-4">{product.quantity}</p>
                  </div>
                  <div className="line mt-[18px]"></div>
                </div>
              ))}
            {addProductState && (
              <>
                <div className="flex px-6 mt-5 gap-4">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      className={`
                        font-inter 
                        font-medium 
                        rounded-lg 
                        text-mainText 
                        border 
                        border-solid 
                        border-[#E7E7E7] 
                        outline-primary 
                        text-sm 
                        leading-5 
                        py-2 
                        pl-3 
                        pr-20 
                        w-full
                        ${isLoading ? 'cursor-not-allowed' : ''}
                      `}
                      placeholder="Product code"
                      readOnly={!productChangeable}
                      value={product.code}
                      onChange={(ev) => setProduct({ ...product, code: ev.target.value.toUpperCase() })}
                    />
                    {!productChangeable && (
                      <button
                        onClick={() => {
                          setProductChangeable(true);
                          setVendorList([]);
                          setVendor(null);
                        }}
                        className={`
                          absolute 
                          top-[7px] 
                          right-2 
                          font-inter 
                          text-primary 
                          bg-primary 
                          bg-opacity-10 
                          px-2 
                          py-1 
                          rounded-lg 
                          text-xs 
                          hover:bg-opacity-25 
                          hover:font-medium 
                          transition-all
                          ${isLoading ? 'cursor-not-allowed' : ''}
                        `}
                      >
                        Change
                      </button>
                    )}
                    {productSearch && productSearch.length > 0 && (
                      <div className="absolute top-10 left-0 w-full bg-white rounded-lg shadow-lg border border-solid border-[#E7E7E7]">
                        {productSearch.map((productItem: any, idx: number) => (
                          <div
                            className="px-4 py-2 cursor-pointer hover:bg-[#F0F0F0] transition-all"
                            key={idx}
                            onClick={() => onChooseProduct(productItem)}
                          >
                            <p className="font-inter font-medium text-mainText text-sm">
                              {productItem?.code}: {productItem?.name}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 relative">
                    <button
                      onClick={() => {
                        if (isLoading) return;
                        if (productChangeable) return;
                        setChooseVendor(!chooseVendor);
                      }}
                      className={`
                        rounded-lg
                        border 
                        border-solid 
                        border-[#E7E7E7] 
                        outline-primary 
                        py-2 
                        px-3 
                        w-full 
                        flex 
                        justify-between 
                        items-center 
                        ${productChangeable || isLoading ? 'cursor-not-allowed' : ''}
                      `}
                    >
                      <p
                        className={`font-inter font-medium text-sm leading-5 text-mainText ${
                          vendor ? '' : 'text-opacity-60'
                        }`}
                      >
                        {vendor ? `${vendor?.vendorCode}: ${vendor?.price}$` : 'Choose Provider'}
                      </p>
                      <img src={ArrowIcon} alt="" className="opacity-40" />
                    </button>
                    {!productChangeable &&
                      chooseVendor &&
                      vendorList &&
                      (vendorList.length > 0 ? (
                        <div className="absolute top-10 left-0 w-full bg-white rounded-lg shadow-lg border border-solid border-[#E7E7E7]">
                          {vendorList.map((vendorItem: any, idx: number) => (
                            <div
                              className="px-4 py-2 cursor-pointer hover:bg-[#F0F0F0] transition-all"
                              key={idx}
                              onClick={() => onChooseVendor(vendorItem)}
                            >
                              <p className="font-inter font-medium text-mainText text-sm">
                                {vendorItem?.vendorCode}: {vendorItem?.price}$
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="absolute top-10 left-0 w-full bg-white rounded-lg shadow-lg border border-solid border-[#E7E7E7]">
                          <p
                            onClick={() => setChooseVendor(false)}
                            className="px-4 py-2 cursor-pointer hover:bg-[#F0F0F0] transition-all font-inter font-medium text-mainText text-sm"
                          >
                            No provider to show
                          </p>
                        </div>
                      ))}
                  </div>
                  <div className="flex-1">
                    <input
                      type="number"
                      className={`
                        font-inter 
                        font-medium 
                        rounded-lg 
                        text-mainText 
                        border 
                        border-solid 
                        border-[#E7E7E7] 
                        text-sm 
                        leading-5 
                        py-2 
                        px-3 
                        w-full 
                        ${productChangeable || isLoading ? 'cursor-not-allowed outline-none' : 'outline-primary'}
                      `}
                      placeholder="Quantity"
                      readOnly={productChangeable || isLoading}
                      value={product.quantity}
                      onChange={(ev) => setProduct({ ...product, quantity: ev.target.value })}
                    />
                  </div>
                </div>
                <div className="flex gap-2 ml-6 mt-8">
                  <button
                    onClick={onAddProduct}
                    className="
                      font-inter 
                      text-sm 
                      px-3 
                      py-1 
                      bg-white 
                      border 
                      border-solid 
                      border-primary 
                      text-primary 
                      rounded-lg 
                      hover:bg-primary 
                      hover:text-white 
                      transition-all"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setAddProductState(false)}
                    className="
                      font-inter 
                      text-sm 
                      px-3 
                      py-1 
                      bg-white 
                      border 
                      border-solid 
                      border-warn 
                      text-warn rounded-lg 
                      hover:bg-warn 
                      hover:text-white 
                      transition-all"
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
          className={`
            mt-6 
            bg-primary 
            text-white 
            rounded-[5px] 
            py-4 
            leading-5 
            w-full 
            font-inter 
            ${isLoading ? 'cursor-not-allowed opacity-70' : ''}
          `}
        >
          Submit
        </button>
      </div>
    </Modal>
  );
};

export default AddPurchaseRequisitionModal;
