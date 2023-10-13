import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Link, useLocation } from 'react-router-dom';

import AddProductModal from '@/components/modals/AddProductModal';
import ConfirmationModal from '@/components/modals/ConfirmationModal';
import Pagination from '@/components/ui/Pagination';
import SearchBox from '@/components/ui/SearchBox';
import { useModal } from '@/hooks/useModal';
import useMountTransition from '@/hooks/useMountTransition';
import useProductList from '@/hooks/useProductList';

import PlusWhiteIcon from '@/assets/icons/plus-white.svg';
import TrashInactive from '@/assets/icons/trash-inactive.svg';
import TrashActive from '@/assets/icons/trash-active.svg';
import axiosInstance from '@/api/axios';

const ProductList = () => {
  useEffect(() => {
    document.title = 'Products List';
  }, []);

  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const entityCode = params.get('entityCode') || '';
  const currentPage = params.get('page') || 1;

  const { data: productList, isLoading: productListLoading, mutate } = useProductList(currentPage);

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

  // Handle search products
  useEffect(() => {
    if (search.length !== 0) {
      const onSearchProducts = async () => {
        try {
          const response = await axiosInstance.get(`/api/product?search=${search}&page=1&size=2`);
          setSearchResult(response?.data.data);
        } catch (error) {
          toast.error('Failed to search products');
        }
      };
      onSearchProducts();
    } else {
      setSearchResult(null);
    }
  }, [search, entityCode]);

  // Handle delete product
  const onDeleteProduct = async () => {
    const toastLoading = toast.loading('Deleting product...');
    setIsLoading(true);

    try {
      await axiosInstance.delete(`/api/product/${productCode}`);
      toast.success('Product deleted successfully');
      mutate();
      setIsConfirmationOpen(false);
    } catch (error) {
      toast.error('Failed to delete product');
    } finally {
      setIsLoading(false);
      toast.dismiss(toastLoading);
    }
  };

  return (
    <>
      <ConfirmationModal
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        hasTransitionedIn={confirmationTransition}
        onConfirm={onDeleteProduct}
        isLoading={isLoading}
        header={'Are you sure?'}
        description="This will permanently delete the product."
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
          {productListLoading && (
            <div className="flex gap-5 animate-pulse">
              <div className="w-[385px] rounded-lg bg-slate-200 h-11"></div>
              <div className="h-11 w-11 bg-slate-200 rounded-[4px]"></div>
            </div>
          )}
          {!productListLoading && (
            <div className="flex gap-5">
              <SearchBox
                search={search}
                setSearch={setSearch}
                searchResult={searchResult}
                api={'products'}
                placeholder={'Search by vendor, sku, code name'}
                name="name"
                code="code"
                img="productImage"
                link
              />
              <button className="bg-primary h-11 w-11 flex items-center justify-center rounded-[4px]" onClick={onOpen}>
                <img src={PlusWhiteIcon} alt="" />
              </button>
            </div>
          )}
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
          {productListLoading &&
            [...Array(3)].map((_, idx: number) => (
              <div className="contents" key={idx}>
                <div className="grid products-list-columns w-full animate-pulse">
                  <div className="flex items-center py-[30px]">
                    <div className="w-[70px] h-[70px] rounded-md bg-slate-200"></div>
                    <div className="ml-5">
                      <div className="h-6 w-32 bg-slate-200 rounded-md"></div>
                      <div className="h-4 w-52 bg-slate-200 rounded-md mt-2"></div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="h-6 w-24 bg-slate-200 rounded-md"></div>
                  </div>
                  <div className="flex items-center">
                    <div className="h-6 w-28 bg-slate-200 rounded-md"></div>
                  </div>
                  <div className="flex justify-center flex-col gap-3">
                    <div className="h-8 w-24 bg-slate-200 rounded-[30px]"></div>
                    <div className="h-8 w-24 bg-slate-200 rounded-[30px]"></div>
                  </div>
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-xl bg-slate-200"></div>
                  </div>
                </div>
                {idx !== 2 && <div className="line"></div>}
              </div>
            ))}
          {!productListLoading &&
            productList?.totalElements !== 0 &&
            productList?.data?.map((product, idx: number) => {
              return (
                <div className="contents" key={idx}>
                  <div className="grid products-list-columns w-full">
                    <div className="flex items-center py-[30px]">
                      <div
                        style={{ backgroundImage: `url(${product?.productImage})` }}
                        className="w-[70px] h-[70px] rounded-md bg-no-repeat bg-cover bg-center"
                      ></div>
                      <div className="leading-6 ml-5">
                        <Link
                          className="text-lg font-inter font-semibold text-black hover:text-primary hover:underline hover:underline-offset-2"
                          to={`/products/${product?.code}`}
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
                      {product?.providedVendorInfo?.length > 0 ? (
                        product?.providedVendorInfo?.map((vendor, idx: number) => {
                          return (
                            <p
                              key={idx}
                              className="font-inter font-medium text-sm leading-[22px] text-primary bg-[#879BDF] bg-opacity-30 px-[14px] py-1 rounded-[30px]"
                            >
                              {vendor?.vendorName}
                            </p>
                          );
                        })
                      ) : (
                        <div className="font-inter font-medium text-sm leading-[22px] text-white bg-rose-500 px-[14px] py-1 rounded-[30px]">
                          NaN
                        </div>
                      )}
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
            })}
          {!productListLoading && productList?.totalElements === 0 && (
            <p className="text-center py-4 font-inter font-medium">No product added</p>
          )}
        </div>
        {!productListLoading && productList?.totalElements !== 0 && (
          <div className="mt-7 flex items-center justify-center">
            <Pagination totalPages={productList?.totalPages} />
          </div>
        )}
      </div>
    </>
  );
};

export default ProductList;
