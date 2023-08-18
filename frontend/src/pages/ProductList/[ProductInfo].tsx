import AddPriceModal from '@/components/modals/AddPriceModal';
import { useModal } from '@/hooks/useModal';
import useMountTransition from '@/hooks/useMountTransition';
import useProductInfo from '@/hooks/useProductInfo';
import useToken from '@/hooks/useToken';
import { useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import EditVendor from './components/EditVendor';

import HomePathIcon from '@/assets/icons/home-path.svg';
import ArrowIcon from '@/assets/icons/arrow.svg';
import Product1 from '@/assets/images/product-1.png';
import ProductDetail1 from '@/assets/images/product-detail-1.png';
import ProductDetail2 from '@/assets/images/product-detail-2.png';
import ProductDetail3 from '@/assets/images/product-detail-3.png';

const ProductInfo = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const { productCode } = useParams();
  const { token } = useToken();
  const entityCode = params.get('entityCode') || '';

  const { data: productDetails, mutate } = useProductInfo(token, entityCode, productCode);

  const isOpen = useModal((state) => state.isOpen);
  const onOpen = useModal((state) => state.onOpen);
  const onClose = useModal((state) => state.onClose);
  const hasTransitionedIn = useMountTransition(isOpen, 200);

  useEffect(() => {
    document.title = `${productDetails?.name}`;
  }, [productDetails?.name]);

  return (
    <>
      <AddPriceModal isOpen={isOpen} onClose={onClose} hasTransitionedIn={hasTransitionedIn} mutate={mutate} />
      <div className="pl-[85px] pr-[152px] pt-9">
        <div className="flex gap-[120px]">
          <div className="w-[356px]">
            <div className="flex items-center gap-4">
              <Link to={`/?entityCode=${entityCode}`} className="cursor-pointer">
                <img src={HomePathIcon} alt="" />
              </Link>
              <img src={ArrowIcon} alt="" className="h-3" />
              <Link
                to={`/products?entityCode=${entityCode}`}
                className="font-inter font-medium leading-6 text-[#637381]"
              >
                Product List
              </Link>
              <img src={ArrowIcon} alt="" className="h-3" />
              <p className="text-black font-inter font-medium leading-6 underline underline-offset-4 cursor-pointer">
                {productDetails?.name}
              </p>
            </div>
            <div className="mt-7 w-full">
              <img src={Product1} alt="" className="w-full rounded-lg" />
            </div>
            <div className="mt-[18px] w-full grid grid-cols-3 gap-[18px]">
              <img src={ProductDetail1} alt="" className="w-full" />
              <img src={ProductDetail2} alt="" className="w-full" />
              <img src={ProductDetail3} alt="" className="w-full" />
            </div>
          </div>
          <div className="w-[470px]">
            <h1 className="font-inter font-bold text-[32px] leading-[45px] text-black">{productDetails?.name}</h1>
            <p className="font-inter font-medium leading-6 text-[#637381] mt-3">{productDetails?.description}</p>
            <h2 className="mt-7 font-inter font-semibold text-2xl text-black">Product Details</h2>
            <div className="mt-[30px] flex flex-col gap-[15px]">
              <div className="flex justify-between">
                <p className="font-inter font-medium text-sm leading-6 text-black">SKU</p>
                <p className="font-inter font-medium text-sm leading-6 text-black">{productDetails?.SKU}</p>
              </div>
              <div className="line"></div>
              <div className="flex justify-between">
                <p className="font-inter font-medium text-sm leading-6 text-black">Product Code</p>
                <p className="font-inter font-medium text-sm leading-6 text-black">{productDetails?.code}</p>
              </div>
              <div className="line"></div>
              <div className="flex justify-between">
                <p className="font-inter font-medium text-sm leading-6 text-black">Category</p>
                <p className="font-inter font-medium text-sm leading-6 text-black">{productDetails?.category}</p>
              </div>
              <div className="line"></div>
              <div className="flex justify-between">
                <p className="font-inter font-medium text-sm leading-6 text-black">Brand</p>
                <p className="font-inter font-medium text-sm leading-6 text-black">{productDetails?.brand}</p>
              </div>
              <div className="line"></div>
              <div className="flex justify-between">
                <p className="font-inter font-medium text-sm leading-6 text-black">Dimensions</p>
                <p className="font-inter font-medium text-sm leading-6 text-black">{`${productDetails?.dimension?.width}, ${productDetails?.dimension?.height}, ${productDetails?.dimension?.length}`}</p>
              </div>
              <div className="line"></div>
              <div className="flex justify-between">
                <p className="font-inter font-medium text-sm leading-6 text-black">Weight</p>
                <p className="font-inter font-medium text-sm leading-6 text-black">{productDetails?.weight}</p>
              </div>
              <div className="line"></div>
              <div className="flex justify-between">
                <p className="font-inter font-medium text-sm leading-6 text-black">Material</p>
                <p className="font-inter font-medium text-sm leading-6 text-black">{productDetails?.material}</p>
              </div>
              <div className="line"></div>
              <div className="flex justify-between">
                <p className="font-inter font-medium text-sm leading-6 text-black">Color</p>
                <p className="font-inter font-medium text-sm leading-6 text-black">{productDetails?.color}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-5">
          <h2 className="text-black font-inter text-2xl font-semibold">Vendor Lists</h2>
          <div className="flex justify-end">
            <button
              onClick={onOpen}
              className="text-primary text-[15px] font-inter cursor-pointer px-6 py-2 rounded-[32px] border border-solid border-primary hover:bg-primary hover:text-white transition-all duration-150"
            >
              + Add new vendor
            </button>
          </div>
          <div className="w-full bg-white border border-solid border-gray-300 mt-10 px-9 rounded-[10px]">
            <div className="w-full grid grid-cols-3 py-[18px]">
              <h3 className="flex justify-center font-inter font-semibold leading-6 text-black">Vendor</h3>
              <h3 className="flex justify-center font-inter font-semibold leading-6 text-black">Pricing</h3>
              <h3 className="flex justify-center font-inter font-semibold leading-6 text-black">Action</h3>
            </div>
            <div className="line"></div>
            {productDetails?.providedVendorInfo?.length === 0 ? (
              <p className="flex justify-center py-4 font-medium font-inter">No vendor to show</p>
            ) : (
              productDetails?.providedVendorInfo?.map((vendor: any, idx: number) => {
                return (
                  <div className="contents" key={idx}>
                    <EditVendor
                      name={vendor?.vendorName}
                      price={vendor?.price}
                      vendorCode={vendor?.vendorCode}
                      mutate={mutate}
                    />
                    {idx !== productDetails?.providedVendorInfo?.length - 1 && <div className="line"></div>}
                  </div>
                );
              })
            )}
          </div>
          <div className="pb-10"></div>
        </div>
      </div>
    </>
  );
};

export default ProductInfo;
