import AddVendorModal from '@/components/modals/AddVendorModal';
import Pagination from '@/components/ui/Pagination';
import SearchBox from '@/components/ui/SearchBox';
import { useModal } from '@/hooks/useModal';
import useMountTransition from '@/hooks/useMountTransition';
import useVendorList from '@/hooks/useVendorList';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import PlusWhite from '@/assets/icons/plus-white.svg';
import TrashInactive from '@/assets/icons/trash-inactive.svg';
import TrashActive from '@/assets/icons/trash-active.svg';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import axiosInstance, { handleError } from '@/api/axios';
import ConfirmationModal from '@/components/modals/ConfirmationModal';
import useProductList from '@/hooks/useProductList';

const VendorList = () => {
  useEffect(() => {
    document.title = 'Vendors List';
  }, []);

  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const currentPage = params.get('page') || 1;
  const { data: vendorsList, isLoading: vendorsListLoading, mutate } = useVendorList(currentPage);
  const { mutate: mutateProductList } = useProductList(1);

  const [search, setSearch] = useState<string>('');
  const [searchResult, setSearchResult] = useState<any>();

  const isOpen = useModal((state) => state.isOpen);
  const onOpen = useModal((state) => state.onOpen);
  const onClose = useModal((state) => state.onClose);
  const hasTransitionedIn = useMountTransition(isOpen, 200);

  const [confirmationModalOpen, setConfirmationModalOpen] = useState<boolean>(false);
  const confirmationModalTransition = useMountTransition(confirmationModalOpen, 200);
  const [vendorId, setVendorId] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(false);

  // handle search vendors
  useEffect(() => {
    if (search.length !== 0) {
      const onSearchVendors = async () => {
        try {
          const response = await axiosInstance.get(`/api/vendor?search=${search}&page=1&size=2`);
          setSearchResult(response?.data.data);
        } catch (error) {
          toast.error('Failed to search vendors');
        }
      };
      onSearchVendors();
    } else {
      setSearchResult(null);
    }
  }, [search]);

  // handle delete vendor
  const onDeleteVendor = async () => {
    const toastLoading = toast.loading('Deleting vendor...');
    setIsLoading(true);

    try {
      await axiosInstance.delete(`/api/vendor/${vendorId}`);
      await mutate();
      await mutateProductList();
      toast.success('Vendor deleted successfully');
      setConfirmationModalOpen(false);
    } catch (error) {
      if (error instanceof AxiosError) {
        const message = handleError(error);
        toast.error(message);
      } else {
        toast.error('An error occured');
      }
    } finally {
      toast.dismiss(toastLoading);
      setIsLoading(false);
    }
  };

  return (
    <>
      <ConfirmationModal
        isOpen={confirmationModalOpen}
        onClose={() => setConfirmationModalOpen(false)}
        hasTransitionedIn={confirmationModalTransition}
        onConfirm={onDeleteVendor}
        header="Are you sure?"
        description="You are about to delete this vendor. This action cannot be undone."
        isLoading={isLoading}
      />
      <AddVendorModal isOpen={isOpen} onClose={onClose} hasTransitionedIn={hasTransitionedIn} mutate={mutate} />
      <div className="pl-10 pr-18 pt-7">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="font-inter font-semibold text-2xl leading-[30px] text-black">Vendor List</h1>
            <p className="mt-2 font-inter text-sm leading-5 text-mainText">
              In this page, user can view all the vendor list that provide the product
            </p>
          </div>
          {vendorsListLoading && (
            <div className="flex gap-5 animate-pulse">
              <div className="w-[385px] rounded-lg bg-slate-200 h-11"></div>
              <div className="h-11 w-11 bg-slate-200 rounded-[4px]"></div>
            </div>
          )}
          {!vendorsListLoading && (
            <div className="flex gap-5">
              <SearchBox
                search={search}
                setSearch={setSearch}
                searchResult={searchResult}
                api={'vendors'}
                placeholder={'Search by vendor, code, name, or BN'}
                name="businessName"
                code="code"
                img="vendorImage"
                link
              />
              <button className="bg-primary h-11 w-11 flex items-center justify-center rounded-[4px]" onClick={onOpen}>
                <img src={PlusWhite} alt="" />
              </button>
            </div>
          )}
        </div>
        <div className="mt-5 flex flex-col bg-white rounded-[10px] border border-solid border-gray-300 px-9">
          <div className="grid vendors-list-columns w-full">
            <h3 className="font-inter text-black font-semibold leading-6 py-[18px] flex items-center">Vendor</h3>
            <h3 className="font-inter text-black font-semibold leading-6 py-[18px] flex items-center">Vendor Code</h3>
            <h3 className="font-inter text-black font-semibold leading-6 py-[18px] flex items-center">
              Business Number
            </h3>
            <h3 className="font-inter text-black font-semibold leading-6 py-[18px] flex items-center">Action</h3>
          </div>
          <div className="line"></div>
          <div className="animate-pulse">
            {vendorsListLoading &&
              [...Array(3)].map((_, idx: number) => (
                <div className="contents" key={idx}>
                  <div className="grid vendors-list-columns w-full">
                    <div className="flex items-center my-[30px]">
                      <div className="w-[70px] h-[70px] rounded-lg bg-slate-200 mr-5"></div>
                      <div>
                        <div className="h-6 w-20 bg-slate-200 rounded-md"></div>
                        <div className="h-4 w-48 bg-slate-200 rounded-md mt-2"></div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="h-6 w-24 rounded-md bg-slate-200"></div>
                    </div>
                    <div className="flex items-center">
                      <div className="h-6 w-36 rounded-md bg-slate-200"></div>
                    </div>
                    <div className="flex items-center">
                      <div className="h-6 w-6 rounded-md bg-slate-200 ml-4"></div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
          {!vendorsListLoading &&
            (vendorsList?.data.length !== 0 ? (
              vendorsList?.data?.map((vendor, idx: number) => (
                <div className="contents" key={idx}>
                  <div className="grid vendors-list-columns w-full">
                    <div className="flex items-center my-[30px]">
                      <img src={vendor?.vendorImage} alt="" className="w-[70px] mr-5 rounded-lg" />
                      <div>
                        <Link to={`/vendors/${vendor?.code}`} className="font-inter text-black font-semibold leading-6">
                          {vendor?.businessName}
                        </Link>
                        <p className="font-inter text-black font-normal leading-6">{vendor?.description}</p>
                      </div>
                    </div>
                    <p className="font-inter text-black font-semibold leading-6 self-center">{vendor?.code}</p>
                    <p className="font-inter text-black font-semibold leading-6 self-center">
                      {vendor?.businessNumber}
                    </p>
                    <div className="flex items-center">
                      <button
                        onClick={() => {
                          setVendorId(vendor?.id);
                          setConfirmationModalOpen(true);
                        }}
                        className="relative h-5 w-4 ml-4 trash-selector"
                      >
                        <img src={TrashInactive} alt="" className="absolute trash-inactive top-0" />
                        <img src={TrashActive} alt="" className="absolute trash-active top-0" />
                      </button>
                    </div>
                  </div>
                  {idx !== vendorsList?.data.length - 1 && <div className="line"></div>}
                </div>
              ))
            ) : (
              <p className="py-4 text-center font-inter font-semibold">No vendor added</p>
            ))}
        </div>
        {!vendorsListLoading && vendorsList?.totalElements !== 0 && (
          <div className="mt-7 flex items-center justify-center">
            <Pagination totalPages={vendorsList?.totalPages} />
          </div>
        )}
      </div>
    </>
  );
};

export default VendorList;
