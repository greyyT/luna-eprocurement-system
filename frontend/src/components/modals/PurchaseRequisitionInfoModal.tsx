import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';

import Modal from '../ui/Modal';
import { useModal } from '@/hooks/useModal';

import SendIcon from '@/assets/icons/send.svg';
import useToken from '@/hooks/useToken';
import usePurchaseRequisitionInfo from '@/hooks/usePurchaseRequisitionInfo';
import { useLocation } from 'react-router-dom';
import Pagination from '../ui/Pagination';
import useCurrentUser from '@/hooks/useCurrentUser';
import axiosInstance from '@/api/axios';
import { isAxiosError } from 'axios';
import { usePurchaseRequisition } from '@/hooks/usePurchaseRequisition';

interface PurchaseRequisitionInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  hasTransitionedIn: boolean;
}

const PurchaseRequisitionInfoModal: React.FC<PurchaseRequisitionInfoModalProps> = ({
  isOpen,
  onClose,
  hasTransitionedIn,
}) => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const { token } = useToken();

  const currentPage = params.get('page') || 1;

  const { data: currentUser } = useCurrentUser(token);

  const data = useModal((state) => state.data);
  const purchaseRequisitionInfo = usePurchaseRequisitionInfo((state) => state.data);
  const purchaseRequisitionComments = usePurchaseRequisitionInfo((state) => state.comments);
  const fetchPurchaseRequisitionInfo = usePurchaseRequisitionInfo((state) => state.fetchData);
  const fetchPurchaseRequisitionComments = usePurchaseRequisitionInfo((state) => state.fetchComments);

  const approvePurchaseRequisition = usePurchaseRequisition((state) => state.approve);

  const [comment, setComment] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      fetchPurchaseRequisitionInfo(token, data?.projectCode, data?.id);
    }
  }, [isOpen, data, token, fetchPurchaseRequisitionInfo]);

  useEffect(() => {
    if (isOpen) {
      fetchPurchaseRequisitionComments(token, data?.projectCode, data?.id, currentPage);
    }
  }, [isOpen, data, token, fetchPurchaseRequisitionComments, currentPage]);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const formatDate = (date: string) => {
    if (!date) return;
    return date.split('-').join('/');
  };

  const onPostComment = async () => {
    if (comment === '') {
      toast.error('Comment cannot be empty');
      return;
    }

    const newComment = {
      content: comment,
      userName: currentUser?.username,
    };

    setIsLoading(true);
    const toastLoading = toast.loading('Posting comment...');

    try {
      await axiosInstance.post(`/api/purchase-requisition/${data?.projectCode}/${data?.id}/comment`, newComment, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('Comment posted');
    } catch (err) {
      if (isAxiosError(err)) {
        if (err?.response?.data.message) {
          toast.error(err.response.data.message);
        } else {
          toast.error('Something went wrong!');
        }
      }
    } finally {
      setIsLoading(false);
      toast.dismiss(toastLoading);
    }

    await fetchPurchaseRequisitionComments(token, data?.projectCode, data?.id, currentPage, true);
  };

  const onApprove = async () => {
    setIsLoading(true);
    const toastLoading = toast.loading('Approving...');

    try {
      await axiosInstance.post(
        `/api/purchase-requisition/${data?.id}/set-status`,
        { status: 'WAITING_TO_APPROVAL', isApproved: true },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      toast.success('Approved');
      approvePurchaseRequisition(data?.id);
      onClose();
    } catch (error) {
      if (isAxiosError(error)) {
        if (error?.response?.data.message) {
          toast.error(error.response.data.message);
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
        <h1 className="font-semibold text-2xl leading-[30px] font-inter">Purchase request detail</h1>
        <div className="flex mt-2">
          <p className="py-[6px] px-8 font-inter text-[15px] leading-5 bg-[#879BDF4D] rounded-[10px]">
            Purchase request - info
          </p>
        </div>
        <div className="flex gap-7 mt-8">
          <div className="flex-1">
            <p className="w-full border border-solid border-[#F0F0F0] rounded-[5px] py-[15px] px-[14px] text-mainText placeholder:text-mainText font-inter text-[15px] leading-5 outline-none">
              {data?.purchaseName}
            </p>
          </div>
          <div className="flex-1">
            <p className="w-full border border-solid border-[#F0F0F0] rounded-[5px] py-[15px] px-[14px] text-mainText placeholder:text-mainText font-inter text-[15px] leading-5 outline-none">
              {data?.priority}
            </p>
          </div>
        </div>
        <div className="flex mt-4">
          <p className="w-full border border-solid border-[#F0F0F0] rounded-[5px] py-[15px] px-[14px] text-mainText placeholder:text-mainText font-inter text-[15px] leading-5 outline-none">
            {data?.projectCode}
          </p>
        </div>
        <div className="flex mt-4 gap-7">
          <div className="flex-1">
            <div className="w-full">
              <p className="font-inter text-[15px] leading-5 text-mainText">Target date</p>
              <p className="mt-2 w-full border border-solid border-[#F0F0F0] rounded-[5px] py-[15px] px-[14px] text-mainText placeholder:text-mainText font-inter text-[15px] leading-5 outline-none">
                {formatDate(data?.targetDate)}
              </p>
            </div>
          </div>
          <div className="flex-1">
            <div className="w-full">
              <p className="font-inter text-[15px] leading-5 text-mainText">Due date</p>
              <p className="mt-2 w-full border border-solid border-[#F0F0F0] rounded-[5px] py-[15px] px-[14px] text-mainText placeholder:text-mainText font-inter text-[15px] leading-5 outline-none">
                {formatDate(data?.dueDate)}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex justify-between items-center">
            <h3 className="font-inter text-black font-semibold text-xl leading-[26px] capitalize">Product list</h3>
          </div>
          <div className="mt-6">
            <div className="flex px-6">
              <p className="flex-1 font-inter font-medium leading-6">Product code</p>
              <p className="flex-1 font-inter font-medium leading-6">Quantity</p>
            </div>
            <div className="line mt-[18px]"></div>
            {purchaseRequisitionInfo?.products.map((product: any, idx: number) => (
              <div className="contents" key={idx}>
                <div className="flex px-6 mt-5">
                  <p className="flex-1 font-inter font-medium leading-6 text-mainText">{product?.code}</p>
                  <p className="flex-1 font-inter font-medium leading-6 text-mainText">{product?.quantity}</p>
                </div>
                <div className="line mt-[18px]"></div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex mt-10">
          <p className="py-[6px] px-8 font-inter text-[15px] leading-5 bg-[#879BDF4D] rounded-[10px]">
            Purchase request - Additional info
          </p>
        </div>
        <div className="mt-8">
          <h4 className="font-inter font-medium leading-6">Comment</h4>
          <div className="mt-2 flex gap-5">
            <input
              type="text"
              placeholder="Type something here..."
              readOnly={isLoading}
              value={comment}
              onChange={(ev) => setComment(ev.target.value)}
              className={`flex-1 bg-[#F4F7FF] border border-solid border-[#e7e7e7] py-[14px] px-[30px] font-inter leading-6 text-mainText placeholder:text-mainText outline-none rounded-md ${
                isLoading ? 'cursor-not-allowed' : ''
              }`}
            />

            <div className={isLoading ? 'cursor-not-allowed opacity-70' : ''}>
              <button
                onClick={onPostComment}
                className={`h-13 w-13 flex items-center justify-center bg-primary rounded-md ${
                  isLoading ? 'cursor-not-allowed' : ''
                }`}
              >
                <img src={SendIcon} alt="" className="w-6  " />
              </button>
            </div>
          </div>
          {purchaseRequisitionComments?.data.map((comment: any, idx: number) => (
            <div className="mt-11 w-full" key={idx}>
              <div className="h-[1px] w-full bg-black"></div>
              <p className="mt-[22px] text-mainText text-sm leading-5 font-bold">{comment.username}</p>
              <p className="mt-[22px] w-full px-5 py-3 text-white bg-primary leading-6 font-inter rounded-2xl">
                {comment.content}
              </p>
              <p className="text-mainText text-right font-medium text-xs leading-4 font-inter mt-[30px]">
                {comment.createdDate}
              </p>
            </div>
          ))}
          <Pagination totalPages={purchaseRequisitionComments?.totalPages || 10} defaultPage={1} />
        </div>
        <div className="flex mt-8">
          <p className="py-[6px] px-8 font-inter text-[15px] leading-5 bg-[#879BDF4D] rounded-[10px]">
            Purchase request - Action
          </p>
        </div>
        {data?.status === 'WAITING_TO_APPROVAL' && data?.isApproved === false ? (
          <button
            onClick={onApprove}
            className="mt-7 rounded-md px-6 py-3 bg-primary text-white font-inter font-medium leading-5"
          >
            Approve
          </button>
        ) : (
          <p className="font-inter mt-4 font-medium text-sm">
            No action can be committed
            {data?.isApproved === true && ' - purchase requisition has already been approved.'}
          </p>
        )}
      </div>
    </Modal>
  );
};

export default PurchaseRequisitionInfoModal;
