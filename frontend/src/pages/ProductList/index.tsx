import { deleteProduct } from '@/api/entity';
import { searchProduct } from '@/api/search';
import AddProductModal from '@/components/modals/AddProductModal';
import ConfirmationModal from '@/components/modals/ConfirmationModal';
import Pagination from '@/components/ui/Pagination';
import SearchBox from '@/components/ui/SearchBox';
import { useModal } from '@/hooks/useModal';
import useMountTransition from '@/hooks/useMountTransition';
import useProductList from '@/hooks/useProductList';
import useToken from '@/hooks/useToken';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Link, useLocation } from 'react-router-dom';

import PlusWhiteIcon from '@/assets/icons/plus-white.svg';
import Product1 from '@/assets/images/product-1.png';
import TrashInactive from '@/assets/icons/trash-inactive.svg';
import TrashActive from '@/assets/icons/trash-active.svg';

const ProductList = () => {
  useEffect(() => {
    document.title = 'Products List';
  }, []);

  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const { token } = useToken();
  const entityCode = params.get('entityCode') || '';
  const currentPage = params.get('page') || 1;

  const { data: productList, mutate } = useProductList(token, entityCode, currentPage);

  const [search, setSearch] = useState<string>('');
  const [searchResult, setSearchResult] = useState<any>();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Add product modal
  const isOpen = useModal((state) => state.isOpen);
  const onOpen = useModal((state) => state.onOpen);
  const onClose = useModal((state) => state.onClose);
  const productTransition = useMountTransition(isOpen, 200);

  // Confirmation modal
  const [isConfirmationOpen, setIsConfirmationOpen] = useState<boolean>(false);
  const [productCode, setProductCode] = useState<string>('');
  const confirmationTransition = useMountTransition(isConfirmationOpen, 200);

  useEffect(() => {
    if (search.length !== 0) {
      const onSearchProducts = async () => {
        const response = await searchProduct(token, entityCode, search);

        if (response) {
          setSearchResult(response);
        }
      };
      onSearchProducts();
    } else {
      setSearchResult(null);
    }
  }, [search, entityCode, token]);

  const onDeleteProduct = async () => {
    const toastLoading = toast.loading('Deleting product...');
    setIsLoading(true);

    const response = await deleteProduct(token, productCode);

    setIsLoading(false);
    toast.dismiss(toastLoading);

    if (!response) {
      toast.error('Something went wrong');
      return;
    }

    toast.success('Product deleted successfully');
    mutate();
  };

  return (
    <>
      <ConfirmationModal
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        hasTransitionedIn={confirmationTransition}
        onConfirm={onDeleteProduct}
        isLoading={isLoading}
      />
      <AddProductModal isOpen={isOpen} onClose={onClose} hasTransitionedIn={productTransition} mutate={mutate} />
      <div className="pl-10 pr-18 pt-7">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="font-inter font-semibold text-2xl leading-[30px] text-black">Products List</h1>
            <p className="mt-2 font-inter text-sm leading-5 text-mainText">
              In this page, user can view their product lists and find vendors accordingly
            </p>
          </div>
          <div className="flex gap-5">
            <SearchBox
              search={search}
              setSearch={setSearch}
              searchResult={searchResult}
              api={'products-list'}
              placeholder={'Search by vendor, sku, code name'}
              name="name"
              code="code"
            />
            <button className="bg-primary h-11 w-11 flex items-center justify-center rounded-[4px]" onClick={onOpen}>
              <img src={PlusWhiteIcon} alt="" />
            </button>
          </div>
        </div>
        <div className="mt-5 flex flex-col bg-white rounded-[10px] border border-solid border-gray-300 px-9">
          <div className="grid products-list-columns w-full">
            <h3 className="font-inter text-black font-semibold leading-6 py-[18px] flex items-center">Product</h3>
            <h3 className="font-inter text-black font-semibold leading-6 py-[18px] flex items-center">SKU</h3>
            <h3 className="font-inter text-black font-semibold leading-6 py-[18px] flex items-center">Product code</h3>
            <h3 className="font-inter text-black font-semibold leading-6 py-[18px] flex items-center">Vendor</h3>
            <h3 className="font-inter text-black font-semibold leading-6 py-[18px] flex items-center">Remove</h3>
          </div>
          <div className="line"></div>
          {productList?.data.length !== 0 ? (
            productList?.data?.map((product: any, idx: number) => {
              return (
                <div className="contents" key={product?.code}>
                  <div className="grid products-list-columns w-full">
                    <div className="flex items-center py-[30px]">
                      <img src={Product1} alt="" className="w-[70px] rounded-[5px]" />
                      <div className="leading-6 ml-5">
                        <Link
                          className="text-lg font-inter font-semibold text-black hover:text-primary hover:underline hover:underline-offset-2"
                          to={`/products/${product?.code}?entityCode=${entityCode}`}
                        >
                          {product?.name}
                        </Link>
                        <p className="font-medium font-inter text-[#637681] pr-5">{product?.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center font-inter font-semibold text-lg leading-6 text-black">
                      {product?.SKU}
                    </div>
                    <div className="flex items-center font-inter font-semibold text-lg leading-6 text-black">
                      {product?.code}
                    </div>
                    <div className="flex flex-col justify-center items-baseline gap-3">
                      {product?.providedVendorInfo?.map((vendor: any) => {
                        return (
                          <div
                            key={vendor?.vendorCode}
                            className="font-inter font-medium text-sm leading-[22px] text-primary bg-[#879BDF] bg-opacity-30 px-[14px] py-1 rounded-[30px]"
                          >
                            {vendor?.vendorName}
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex items-center">
                      <div
                        onClick={() => {
                          setProductCode(product?.code);
                          setIsConfirmationOpen(true);
                        }}
                        className="relative h-5 w-4 ml-4 trash-selector cursor-pointer"
                      >
                        <img src={TrashInactive} alt="" className="absolute trash-inactive" />
                        <img src={TrashActive} alt="" className="absolute trash-active" />
                      </div>
                    </div>
                  </div>
                  {idx !== productList?.data?.length - 1 && <div className="line"></div>}
                </div>
              );
            })
          ) : (
            <p className="text-center py-4 font-inter font-medium">No product added</p>
          )}
        </div>
        {productList && (
          <div className="mt-7 flex items-center justify-center">
            <Pagination totalPages={productList?.totalPages} />
          </div>
        )}
      </div>
    </>
  );
};

export default ProductList;
