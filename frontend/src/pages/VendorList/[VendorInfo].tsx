import AddContactModal from '@/components/modals/AddContactModal';
import ActionButton from '@/components/ui/ActionButton';
import { useModal } from '@/hooks/useModal';
import useMountTransition from '@/hooks/useMountTransition';
import useVendorInfo from '@/hooks/useVendorInfo';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import HomeIcon from '@/assets/icons/home-path.svg';
import ArrowIcon from '@/assets/icons/arrow.svg';
import axiosInstance, { handleError } from '@/api/axios';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import ConfirmationModal from '@/components/modals/ConfirmationModal';

const VendorInfo = () => {
  const { vendorCode } = useParams();

  const { data: vendorInfo, isLoading: vendorInfoLoading, mutate } = useVendorInfo(vendorCode);

  useEffect(() => {
    document.title = vendorInfo?.businessName || 'Vendor Info';
  }, [vendorInfo]);

  const isOpen = useModal((state) => state.isOpen);
  const onOpen = useModal((state) => state.onOpen);
  const onClose = useModal((state) => state.onClose);
  const hasTransitionedIn = useMountTransition(isOpen, 200);

  const [confirmationModalOpen, setConfirmationModalOpen] = useState<boolean>(false);
  const confirmationModalTransition = useMountTransition(confirmationModalOpen, 200);
  const [contactId, setContactId] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(false);

  // handle delete contact
  const onDeleteContact = async () => {
    const toastLoading = toast.loading('Deleting contact...');
    setIsLoading(true);

    try {
      await axiosInstance.delete(`/api/vendor/contact/${contactId}`);
      await mutate();
      toast.success('Contact deleted successfully');
      setConfirmationModalOpen(false);
    } catch (error) {
      if (error instanceof AxiosError) {
        const message = handleError(error);
        toast.error(message);
      } else {
        toast.error('Failed to delete contact');
      }
    } finally {
      setIsLoading(false);
      toast.dismiss(toastLoading);
    }
  };

  return (
    <>
      <ConfirmationModal
        header="Delete contact"
        description="Are you sure you want to delete this contact?"
        isOpen={confirmationModalOpen}
        onClose={() => setConfirmationModalOpen(false)}
        hasTransitionedIn={confirmationModalTransition}
        onConfirm={() => onDeleteContact()}
        isLoading={isLoading}
      />
      <AddContactModal
        vendorId={vendorInfo?.id}
        isOpen={isOpen}
        onClose={onClose}
        hasTransitionedIn={hasTransitionedIn}
        mutate={mutate}
      />
      <div className="pl-[85px] pr-[152px] pt-9">
        <div className="flex gap-16">
          <div className="w-[400px]">
            <div className="flex items-center gap-4">
              {vendorInfoLoading ? (
                <>
                  <div className="h-6 w-6 animate-pulse bg-slate-200 rounded-md"></div>
                  <img src={ArrowIcon} alt="" className="h-3" />
                  <div className="h-6 w-[88px] animate-pulse bg-slate-200 rounded-md"></div>
                  <img src={ArrowIcon} alt="" className="h-3" />
                  <div className="flex-1 bg-slate-200 rounded-md animate-pulse h-6"></div>
                </>
              ) : (
                <>
                  <Link to={`/`} className="cursor-pointer">
                    <img src={HomeIcon} alt="" />
                  </Link>
                  <img src={ArrowIcon} alt="" className="h-3" />
                  <Link to={`/vendors`} className="font-inter font-medium leading-6 text-[#637381]">
                    Vendor List
                  </Link>
                  <img src={ArrowIcon} alt="" className="h-3" />
                  <p className="text-black font-inter font-medium leading-6 underline underline-offset-4 cursor-pointer">
                    {vendorInfo?.businessName}
                  </p>
                </>
              )}
            </div>
            {vendorInfoLoading ? (
              <div className="animate-pulse">
                <div className="mt-7 h-[45px] rounded-md bg-slate-200"></div>
                <div className="mt-2 h-4 bg-slate-200 rounded-md"></div>
              </div>
            ) : (
              <>
                <h1 className="font-inter mt-7 text-[32px] leading-[45px] text-black font-bold">
                  {vendorInfo?.businessName}
                </h1>
                <p className="font-inter text-mainText">{vendorInfo?.description}</p>
              </>
            )}
            <h2 className="mt-7 mb-[30px] font-inter text-black font-semibold text-2xl leading-[30px]">
              Vendor Details
            </h2>
            {vendorInfoLoading ? (
              <div className="animate-pulse">
                <div className="flex justify-between">
                  <div className="w-32 h-6 rounded-md bg-slate-200"></div>
                  <div className="w-52 h-6 rounded-md bg-slate-200"></div>
                </div>
                <div className="line my-3"></div>
                <div className="flex justify-between">
                  <div className="w-32 h-6 rounded-md bg-slate-200"></div>
                  <div className="w-52 h-6 rounded-md bg-slate-200"></div>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between">
                  <p className="font-inter text-sm leading-6 text-black">Vendor Code</p>
                  <p className="font-inter text-sm leading-6 text-black">{vendorCode}</p>
                </div>
                <div className="line my-3"></div>
                <div className="flex justify-between">
                  <p className="font-inter text-sm leading-6 text-black">Business Number</p>
                  <p className="font-inter text-sm leading-6 text-black">{vendorInfo?.businessNumber}</p>
                </div>
              </>
            )}
          </div>
          {vendorInfoLoading ? (
            <div className="flex-1 bg-slate-200 animate-pulse rounded-2xl"></div>
          ) : (
            <div className="flex-1 p-10">
              <div
                style={{ backgroundImage: `url('${vendorInfo?.vendorImage}')` }}
                className="w-full h-full bg-no-repeat bg-center bg-cover rounded-2xl"
              ></div>
            </div>
          )}
        </div>
        <h2 className="mt-14 font-inter text-black font-semibold text-2xl leading-[30px]">Contact list</h2>
        {vendorInfoLoading ? (
          <div className="flex justify-end animate-pulse">
            <div className="bg-slate-200 w-[176px] h-[38px] rounded-[32px]"></div>
          </div>
        ) : (
          <>
            <div className="flex justify-end">
              <button
                onClick={onOpen}
                className="
              text-primary 
              text-sm 
              font-inter 
              cursor-pointer 
              px-6 
              py-2 
              rounded-[32px] 
              border 
              border-solid 
              border-primary 
              hover:bg-primary 
              hover:text-white 
              transition-all 
              duration-150
            "
              >
                + Add new contact
              </button>
            </div>
          </>
        )}
        <div className="w-full bg-white border border-solid border-gray-300 mt-5 px-9 rounded-[10px]">
          <div className="grid vendor-info-columns py-[18px]">
            <h3 className="font-inter text-black font-semibold leading-6 flex items-center">Full Name</h3>
            <h3 className="font-inter text-black font-semibold leading-6 flex items-center">Phone Number</h3>
            <h3 className="font-inter text-black font-semibold leading-6 flex items-center">Position</h3>
            <div className="flex justify-center">
              <h3 className="font-inter text-black font-semibold leading-6 flex items-center">Action</h3>
            </div>
          </div>
          <div className="line"></div>
          {vendorInfoLoading ? (
            [...Array(3)].map((_, idx: number) => (
              <div key={idx}>
                <div className="grid vendor-info-columns py-[18px] animate-pulse">
                  <div className="h-6 w-44 rounded-md bg-slate-200"></div>
                  <div className="h-6 w-32 rounded-md bg-slate-200"></div>
                  <div className="h-6 w-32 rounded-md bg-slate-200"></div>
                  <div className="flex justify-center">
                    <div className="h-9 w-[85px] rounded-[32px] bg-slate-200"></div>
                  </div>
                </div>
                {idx !== 2 && <div className="line"></div>}
              </div>
            ))
          ) : vendorInfo?.contacts?.length === 0 ? (
            <p className="font-inter text-black font-medium leading-6 flex items-center justify-center py-[18px]">
              No contacts to show
            </p>
          ) : (
            vendorInfo?.contacts?.map((contact, idx: number) => (
              <div key={idx}>
                <div className="grid vendor-info-columns py-[18px]">
                  <p className="font-inter text-black font-medium leading-6 flex items-center">{contact?.name}</p>
                  <p className="font-inter text-black font-medium leading-6 flex items-center">{contact?.phone}</p>
                  <p className="font-inter text-black font-medium leading-6 flex items-center">{contact?.position}</p>
                  <div className="flex justify-center items-center">
                    <ActionButton
                      type="delete"
                      onClick={() => {
                        setContactId(contact?.id);
                        setConfirmationModalOpen(true);
                      }}
                    />
                  </div>
                </div>
                {idx !== vendorInfo?.contacts?.length - 1 && <div className="line"></div>}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default VendorInfo;
