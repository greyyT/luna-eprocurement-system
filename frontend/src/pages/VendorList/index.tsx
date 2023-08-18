import { searchVendor } from '@/api/search';
import AddVendorModal from '@/components/modals/AddVendorModal';
import Pagination from '@/components/ui/Pagination';
import SearchBox from '@/components/ui/SearchBox';
import { useModal } from '@/hooks/useModal';
import useMountTransition from '@/hooks/useMountTransition';
import useToken from '@/hooks/useToken';
import useVendorList from '@/hooks/useVendorList';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import PlusWhite from '@/assets/icons/plus-white.svg';
import Vendor1 from '@/assets/images/vendor-1.png';
import TrashInactive from '@/assets/icons/trash-inactive.svg';
import TrashActive from '@/assets/icons/trash-active.svg';

const VendorList = () => {
  useEffect(() => {
    document.title = 'Vendors List';
  }, []);

  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const { token } = useToken();
  const currentPage = params.get('page') || 1;
  const entityCode = params.get('entityCode') || '';
  const { data: vendorsList, mutate } = useVendorList(token, currentPage);

  const [search, setSearch] = useState<string>('');
  const [searchResult, setSearchResult] = useState<any>();

  const isOpen = useModal((state) => state.isOpen);
  const onOpen = useModal((state) => state.onOpen);
  const onClose = useModal((state) => state.onClose);
  const hasTransitionedIn = useMountTransition(isOpen, 200);

  useEffect(() => {
    if (search.length !== 0) {
      const onSearchVendors = async () => {
        const response = await searchVendor(token, search);

        if (response) {
          setSearchResult(response);
        }
      };
      onSearchVendors();
    } else {
      setSearchResult(null);
    }
  }, [search, token]);

  return (
    <>
      <AddVendorModal isOpen={isOpen} onClose={onClose} hasTransitionedIn={hasTransitionedIn} mutate={mutate} />
      <div className="pl-10 pr-18 pt-7">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="font-inter font-semibold text-2xl leading-[30px] text-black">Vendor List</h1>
            <p className="mt-2 font-inter text-sm leading-5 text-mainText">
              In this page, user can view all the vendor list that provide the product
            </p>
          </div>
          <div className="flex gap-5">
            <SearchBox
              search={search}
              setSearch={setSearch}
              searchResult={searchResult}
              api={'vendor-list'}
              placeholder={'Search by vendor, code, name, or BN'}
              name="businessName"
              code="code"
            />
            <button className="bg-primary h-11 w-11 flex items-center justify-center rounded-[4px]" onClick={onOpen}>
              <img src={PlusWhite} alt="" />
            </button>
          </div>
        </div>
        <div className="mt-5 flex flex-col bg-white rounded-[10px] border border-solid border-gray-300 px-9">
          <div className="grid vendors-list-columns w-full">
            <h3 className="font-inter text-black font-semibold leading-6 py-[18px] flex items-center">Product</h3>
            <h3 className="font-inter text-black font-semibold leading-6 py-[18px] flex items-center">Vendor Code</h3>
            <h3 className="font-inter text-black font-semibold leading-6 py-[18px] flex items-center">
              Business Number
            </h3>
            <h3 className="font-inter text-black font-semibold leading-6 py-[18px] flex items-center">Group</h3>
            <h3 className="font-inter text-black font-semibold leading-6 py-[18px] flex items-center">Action</h3>
          </div>
          <div className="line"></div>
          {vendorsList?.data.length !== 0 ? (
            vendorsList?.data?.map((vendor: any, idx: number) => (
              <div key={idx} className="grid vendors-list-columns w-full">
                <div className="flex items-center my-[30px]">
                  <img src={Vendor1} alt="" className="w-[70px] mr-5" />
                  <div>
                    <Link
                      to={`/vendors/${vendor?.code}?entityCode=${entityCode}`}
                      className="font-inter text-black font-semibold leading-6"
                    >
                      {vendor?.businessName}
                    </Link>
                    <p className="font-inter text-black font-normal leading-6">Lorem Ipsum</p>
                  </div>
                </div>
                <p className="font-inter text-black font-semibold leading-6 self-center">{vendor?.code}</p>
                <p className="font-inter text-black font-semibold leading-6 self-center">{vendor?.businessNumber}</p>
                <p className="font-inter text-black font-semibold leading-6 self-center">Group A</p>
                <div className="flex items-center">
                  <div className="relative h-5 w-4 ml-4 trash-selector cursor-pointer">
                    <img src={TrashInactive} alt="" className="absolute trash-inactive" />
                    <img src={TrashActive} alt="" className="absolute trash-active" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="py-4 text-center font-inter font-semibold">No vendor added</p>
          )}
        </div>
        {vendorsList && (
          <div className="mt-7 flex items-center justify-center">
            <Pagination totalPages={vendorsList?.totalPages} />
          </div>
        )}
      </div>
    </>
  );
};

export default VendorList;
