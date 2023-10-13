import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';

import Modal from '../ui/Modal';
import { useModal } from '@/hooks/useModal';

import { useLocation } from 'react-router-dom';
import Pagination from '../ui/Pagination';
import useCurrentUser from '@/hooks/useCurrentUser';
import axiosInstance, { handleError } from '@/api/axios';
import { AxiosError } from 'axios';
import { usePurchaseRequisition } from '@/hooks/usePurchaseRequisition';
import ConfirmationModal from './ConfirmationModal';
import useMountTransition from '@/hooks/useMountTransition';
import { usePurchaseRequisitionInfo } from '@/hooks/usePurchaseRequisitionInfo';
import { usePurchaseRequisitionComments } from '@/hooks/usePurchaseRequisitionComments';

import SendIcon from '@/assets/icons/send.svg';
import TrashIcon from '@/assets/icons/trash.svg';
import EditIcon from '@/assets/icons/edit.svg';
import TrashInactiveIcon from '@/assets/icons/trash-inactive.svg';
import TrashActiveIcon from '@/assets/icons/trash-active.svg';
import { preload } from 'swr';
import fetcher from '@/api/fetcher';

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

  const currentPage = params.get('page') || 1;

  const { data: currentUser } = useCurrentUser();

  // Modal data
  const data = useModal((state) => state.data);

  // Purchase requisition info
  const {
    data: purchaseRequisitionInfo,
    isLoading: purchaseRequisitionInfoLoading,
    mutate: mutatePurchaseRequisitionInfo,
  } = usePurchaseRequisitionInfo(data?.id, hasTransitionedIn);

  const {
    data: purchaseRequisitionComments,
    isLoading: commentsLoading,
    mutate: mutateComments,
  } = usePurchaseRequisitionComments(data?.id, currentPage, hasTransitionedIn);

  // Preload next page comments
  useEffect(() => {
    if (purchaseRequisitionComments) {
      for (let i = 1; i <= purchaseRequisitionComments.totalPages; ++i) {
        preload(`/api/purchase-requisition/${data?.id}/comment?page=${i}&size=2`, fetcher);
      }
    }
  }, [currentPage, data?.id, purchaseRequisitionComments]);

  // Purchase requisition actions
  const approvePurchaseRequisition = usePurchaseRequisition((state) => state.approve);
  const rejectPurchaseRequisition = usePurchaseRequisition((state) => state.reject);
  const deletePurchaseRequisition = usePurchaseRequisition((state) => state.delete);

  // Add comment use state
  const [comment, setComment] = useState<string>('');

  // Reject comment use state
  const [rejectComment, setRejectComment] = useState<string>('');

  // Edit comment use state
  const [selectedComment, setSelectedComment] = useState<string>('');
  const [selectedCommentId, setSelectedCommentId] = useState<string>('');
  const [editComment, setEditComment] = useState<boolean>(false);

  // Confirmation modal for delete purchase requisition
  const [confirmationModal, setConfirmationModal] = useState<boolean>(false);
  const confirmationModalTransition = useMountTransition(confirmationModal, 200);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setEditComment(false);
        setRejectComment('');
        setComment('');
      }, 200);
    }
  }, [isOpen]);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const formatDate = (date: string | undefined) => {
    if (!date) return;
    return date.split('-').join('/');
  };

  // Handle post comment
  const onPostComment = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    if (comment === '') {
      toast.error('Comment cannot be empty');
      return;
    }

    const newComment = {
      content: comment,
    };

    setIsLoading(true);
    const toastLoading = toast.loading('Posting comment...');

    try {
      await axiosInstance.post(`/api/purchase-requisition/${purchaseRequisitionInfo?.id}/comment`, newComment);
      await mutateComments();
      setComment('');
      toast.success('Comment posted');
    } catch (error) {
      if (error instanceof AxiosError) {
        const message = handleError(error);
        toast.error(message);
      } else {
        toast.error('Something went wrong! Please try again later.');
      }
    } finally {
      setIsLoading(false);
      toast.dismiss(toastLoading);
    }
  };

  // Handle approve purchase requisition
  const onApprovePurchaseRequisition = async () => {
    if (!currentUser?.approve) {
      toast.error('You do not have permission to approve purchase requisition.');
      return;
    }

    setIsLoading(true);
    const toastLoading = toast.loading('Approving...');

    try {
      await axiosInstance.post(`/api/purchase-requisition/${purchaseRequisitionInfo?.id}/approve`);
      toast.success('Approved');
      approvePurchaseRequisition(data?.id);
      onClose();
    } catch (error) {
      if (error instanceof AxiosError) {
        const message = handleError(error);
        toast.error(message);
      } else {
        toast.error('Something went wrong! Please try again later.');
      }
    } finally {
      setIsLoading(false);
      toast.dismiss(toastLoading);
    }
  };

  // Handle reject purchase requisition
  const onRejectPurchaseRequisition = async () => {
    if (!currentUser?.reject) {
      toast.error('You do not have permission to reject purchase requisition.');
      return;
    }

    if (rejectComment === '') {
      toast.error('You must enter reason for rejection');
      return;
    }

    setIsLoading(true);
    const toastLoading = toast.loading('Rejecting purchase requisition...');

    try {
      await axiosInstance.post(`/api/purchase-requisition/${purchaseRequisitionInfo?.id}/reject`, {
        comment: rejectComment,
      });
      await mutatePurchaseRequisitionInfo();
      toast.success('Purchase requisition rejected');
      setRejectComment('');
      rejectPurchaseRequisition(data?.id);
      onClose();
    } catch (error) {
      if (error instanceof AxiosError) {
        const message = handleError(error);
        toast.error(message);
      } else {
        toast.error('Something went wrong! Please try again later.');
      }
    } finally {
      setIsLoading(false);
      toast.dismiss(toastLoading);
    }
  };

  // Handle remove purchase requisition
  const onRemovePurchaseRequisition = async () => {
    setIsLoading(true);
    const toastLoading = toast.loading('Deleting purchase requisition...');

    try {
      await axiosInstance.delete(`/api/purchase-requisition/${purchaseRequisitionInfo?.id}`);
      deletePurchaseRequisition(data?.id, data?.status);
      toast.success('Purchase requisition deleted');
      setConfirmationModal(false);
      onClose();
    } catch (error) {
      if (error instanceof AxiosError) {
        const message = handleError(error);
        toast.error(message);
      } else {
        toast.error('Something went wrong! Please try again later.');
      }
    } finally {
      setIsLoading(false);
      toast.dismiss(toastLoading);
    }
  };

  // Handle delete comment
  const onDeleteComment = async (commentId: string) => {
    setIsLoading(true);
    const toastLoading = toast.loading('Deleting comment...');

    try {
      await axiosInstance.delete(`/api/purchase-requisition/${purchaseRequisitionInfo?.id}/comment/${commentId}`);
      await mutateComments();
      toast.success('Comment deleted');
    } catch (error) {
      if (error instanceof AxiosError) {
        const message = handleError(error);
        toast.error(message);
      } else {
        toast.error('Something went wrong! Please try again later.');
      }
    } finally {
      setIsLoading(false);
      toast.dismiss(toastLoading);
    }
  };

  // Handle edit comment
  const onEditComment = async (commentId: string, content: string) => {
    if (selectedComment === '') {
      toast.error('Comment cannot be empty');
      return;
    }

    if (selectedComment === content) {
      setEditComment(false);
      return;
    }

    setIsLoading(true);
    const toastLoading = toast.loading('Editing comment...');

    try {
      await axiosInstance.patch(`/api/purchase-requisition/${purchaseRequisitionInfo?.id}/comment/${commentId}`, {
        content: selectedComment,
      });
      await mutateComments();
      toast.success('Comment edited');
      setEditComment(false);
    } catch (error) {
      if (error instanceof AxiosError) {
        const message = handleError(error);
        toast.error(message);
      } else {
        toast.error('Something went wrong! Please try again later.');
      }
    } finally {
      setIsLoading(false);
      toast.dismiss(toastLoading);
    }
  };

  if (!isMounted) return null;

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} hasTransitionedIn={hasTransitionedIn} isLoading={isLoading}>
        <div
          onClick={(ev) => ev.stopPropagation()}
          className="w-[997px] max-h-[80vh] bg-white rounded-lg py-12 pl-[71px] pr-[83px] overflow-y-auto"
        >
          <h1 className="font-semibold text-2xl leading-[30px] font-inter">Purchase request detail</h1>
          {purchaseRequisitionInfo?.isRejected && (
            <div className="flex mt-2">
              <p className="py-[6px] px-8 font-inter text-[15px] leading-5 bg-warn rounded-[10px] text-white font-semibold">
                Rejected - {purchaseRequisitionInfo?.rejectedComment}
              </p>
            </div>
          )}
          <div className="flex mt-6">
            <p className="py-[6px] px-8 font-inter text-[15px] leading-5 bg-[#879BDF4D] rounded-[10px]">
              Purchase request - info
            </p>
          </div>
          {purchaseRequisitionInfoLoading ? (
            <div className="animate-pulse">
              <div className="flex gap-7 mt-8">
                <div className="flex-1 rounded-[5px] bg-slate-200 h-13"></div>
                <div className="flex-1 rounded-[5px] bg-slate-200 h-13"></div>
              </div>
              <div className="flex mt-4 bg-slate-200 rounded-[5px] h-13"></div>
            </div>
          ) : (
            <>
              <div className="flex gap-7 mt-8">
                <div className="flex-1">
                  <p
                    className="
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
                      outline-none"
                  >
                    {purchaseRequisitionInfo?.purchaseName}
                  </p>
                </div>
                <div className="flex-1">
                  <p
                    className="
                w-full
                border 
                border-solid 
                border-[#F0F0F0] 
                rounded-[5px]
                py-[15px] 
                px-[14px] 
                text-mainText 
                placeholder:text-mainText 
                font-inter text-[15px] 
                leading-5 
                outline-none"
                  >
                    {purchaseRequisitionInfo?.priority}
                  </p>
                </div>
              </div>
              <div className="flex mt-4">
                <p
                  className="
                    w-full 
                    border 
                    border-solid 
                    border-[#F0F0F0] 
                    rounded-[5px] 
                    py-[15px] 
                    px-[14px] 
                    text-mainText 
                    placeholder:text-mainText 
                    font-inter text-[15px] 
                    leading-5 
                    outline-none"
                >
                  {purchaseRequisitionInfo?.projectCode}
                </p>
              </div>
            </>
          )}
          <div className="flex mt-4 gap-7">
            <div className="flex-1">
              <div className="w-full">
                <p className="font-inter text-[15px] leading-5 text-mainText">Target date</p>
                {purchaseRequisitionInfoLoading ? (
                  <div className="mt-2 h-13 flex bg-slate-200 rounded-[5px] animate-pulse"></div>
                ) : (
                  <p
                    className="
                  mt-2 
                  w-full 
                  border 
                  border-solid 
                  border-[#F0F0F0] 
                  rounded-[5px] py-[15px] 
                  px-[14px] 
                  text-mainText 
                  font-inter 
                  text-[15px] 
                  leading-5"
                  >
                    {formatDate(purchaseRequisitionInfo?.targetDate)}
                  </p>
                )}
              </div>
            </div>
            <div className="flex-1">
              <div className="w-full">
                <p className="font-inter text-[15px] leading-5 text-mainText">Due date</p>
                {purchaseRequisitionInfoLoading ? (
                  <div className="mt-2 h-13 flex bg-slate-200 rounded-[5px] animate-pulse"></div>
                ) : (
                  <p
                    className="
                  mt-2 
                  w-full 
                  border 
                  border-solid 
                  border-[#F0F0F0] 
                  rounded-[5px] py-[15px] 
                  px-[14px] 
                  text-mainText 
                  font-inter 
                  text-[15px] 
                  leading-5"
                  >
                    {formatDate(purchaseRequisitionInfo?.dueDate)}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between items-center">
              <h3 className="font-inter text-black font-semibold text-xl leading-[26px] capitalize">Product list</h3>
            </div>
            <div className="mt-6">
              <div className="flex px-6 gap-8">
                <p className="flex-1 font-inter font-medium leading-6">Product code</p>
                <p className="flex-1 font-inter font-medium leading-6">Price</p>
                <p className="flex-1 font-inter font-medium leading-6">Quantity</p>
              </div>
              <div className="line mt-[18px]"></div>
              {purchaseRequisitionInfoLoading ? (
                [...Array(3)].map((_, idx: number) => (
                  <div className="contents" key={idx}>
                    <div className="flex px-6 mt-5 gap-8 animate-pulse">
                      <div className="flex-1 h-6 bg-slate-200 rounded-md"></div>
                      <div className="flex-1 h-6 bg-slate-200 rounded-md"></div>
                      <div className="flex-1 h-6 bg-slate-200 rounded-md"></div>
                    </div>
                    <div className="line mt-[18px]"></div>
                  </div>
                ))
              ) : purchaseRequisitionInfo?.products?.length !== 0 ? (
                purchaseRequisitionInfo?.products?.map((product, idx: number) => (
                  <div className="contents" key={idx}>
                    <div className="flex px-6 mt-5">
                      <p className="flex-1 font-inter font-medium leading-6 text-mainText">{product?.code}</p>
                      <p className="flex-1 font-inter font-medium leading-6 text-mainText">
                        {product?.price.toLocaleString('en-US', {
                          style: 'currency',
                          currency: 'USD',
                          minimumFractionDigits: 2,
                        })}
                      </p>
                      <p className="flex-1 font-inter font-medium leading-6 text-mainText">{product?.quantity}</p>
                    </div>
                    <div className="line mt-[18px]"></div>
                  </div>
                ))
              ) : (
                <div className="flex px-6 mt-5">
                  <p className="flex-1 font-inter font-medium leading-6 text-mainText">No products to show</p>
                </div>
              )}
              {purchaseRequisitionInfoLoading ? (
                <div className="flex justify-end mt-5">
                  <div className="w-44 h-[25px] bg-slate-200 rounded-md mr-6 animate-pulse"></div>
                </div>
              ) : (
                purchaseRequisitionInfo?.products?.length !== 0 && (
                  <p className="text-end font-inter mr-6 mt-5 font-semibold text-mainText">
                    Total Price:{' '}
                    <span className="text-warn font-normal">
                      {Number(
                        purchaseRequisitionInfo?.products?.reduce(
                          (acc: number, cur) => acc + cur.price * cur.quantity,
                          0,
                        ),
                      ).toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </p>
                )
              )}
            </div>
          </div>
          <div className="flex mt-10">
            <p className="py-[6px] px-8 font-inter text-[15px] leading-5 bg-[#879BDF4D] rounded-[10px]">
              Purchase request - Additional info
            </p>
          </div>
          <div className="mt-8">
            <h4 className="font-inter font-medium leading-6">Comment</h4>
            {commentsLoading ? (
              <div className="mt-2 flex gap-5">
                <div className="flex-1 bg-slate-200 rounded-md"></div>
                <div className="h-13 w-13 bg-slate-200 rounded-md"></div>
              </div>
            ) : (
              purchaseRequisitionInfo?.status !== 'COMPLETED' &&
              purchaseRequisitionInfo?.status !== 'CANCELLED' && (
                <form className="mt-2 flex gap-5" onSubmit={onPostComment}>
                  <input
                    type="text"
                    placeholder="Type something here..."
                    name="input-comment"
                    readOnly={isLoading}
                    value={comment}
                    onChange={(ev) => setComment(ev.target.value)}
                    className={`
                    flex-1 
                    bg-[#F4F7FF] 
                    border 
                    border-solid 
                    border-[#e7e7e7] 
                    py-[14px] 
                    px-[30px] 
                    font-inter 
                    leading-6 
                    text-mainText 
                    placeholder:text-mainText 
                    outline-none 
                    rounded-md ${isLoading ? 'cursor-not-allowed' : ''}
                  `}
                  />
                  <div className={isLoading ? 'cursor-not-allowed opacity-70' : ''}>
                    <button
                      type="submit"
                      className={`h-13 w-13 flex items-center justify-center bg-primary rounded-md ${
                        isLoading ? 'cursor-not-allowed' : ''
                      }`}
                    >
                      <img src={SendIcon} alt="" className="w-6  " />
                    </button>
                  </div>
                </form>
              )
            )}
            {commentsLoading ? (
              [...Array(2)].map((_, idx: number) => (
                <div className="mt-11 w-full animate-pulse" key={idx}>
                  <div className="h-[1px] w-full bg-black"></div>
                  <div className="mt-[22px] ml-4 h-5 w-24 bg-slate-200 rounded-md"></div>
                  <div className="flex-1 mt-2 h-12 bg-slate-200 rounded-2xl"></div>
                  <div className="flex justify-end mt-5">
                    <div className="rounded-sm bg-slate-200 h-4 w-32"></div>
                  </div>
                </div>
              ))
            ) : purchaseRequisitionComments?.totalElements !== 0 ? (
              purchaseRequisitionComments?.data.map((comment, idx: number) => (
                <div className="mt-11 w-full peer comments" key={idx}>
                  <div className="h-[1px] w-full bg-black"></div>
                  <p className="mt-[22px] ml-4 text-mainText text-sm leading-5 font-bold">{comment.username}</p>
                  {purchaseRequisitionInfo?.status !== 'COMPLETED' &&
                  purchaseRequisitionInfo?.status !== 'CANCELLED' ? (
                    <input
                      id={`comment-${comment.id}`}
                      value={!(selectedCommentId === comment.id && editComment) ? comment.content : selectedComment}
                      onChange={(ev) => setSelectedComment(ev.target.value)}
                      readOnly={isLoading || !(selectedCommentId === comment.id && editComment)}
                      className="w-full px-5 py-3 text-white bg-primary leading-6 font-inter rounded-2xl mt-2 outline-none"
                    />
                  ) : (
                    <div className="w-full px-5 py-3 text-white bg-primary leading-6 font-inter rounded-2xl mt-2">
                      {comment.content}
                    </div>
                  )}
                  <div className="flex justify-between pt-5">
                    <div className="">
                      {currentUser?.username === comment.username &&
                        !editComment &&
                        data?.status !== 'COMPLETED' &&
                        data?.status !== 'CANCELLED' && (
                          <div className="hidden gap-2 ml-2 comments-action">
                            <img
                              onClick={() => {
                                setSelectedCommentId(comment.id);
                                setSelectedComment(comment.content);
                                setEditComment(true);
                                document.getElementById(`comment-${comment.id}`)?.focus();
                              }}
                              src={EditIcon}
                              alt=""
                              className="w-4 cursor-pointer"
                            />
                            <div
                              onClick={() => onDeleteComment(comment.id)}
                              className="relative w-[14px] trash-selector cursor-pointer"
                            >
                              <img src={TrashInactiveIcon} alt="" className="absolute trash-inactive w-[14px]" />
                              <img src={TrashActiveIcon} alt="" className="absolute trash-active w-[14px]" />
                            </div>
                          </div>
                        )}
                      {editComment && selectedCommentId === comment.id && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => onEditComment(comment.id, comment.content)}
                            className="
                              px-3 
                              py-1 
                              text-sm 
                              border 
                              border-solid 
                              border-primary 
                              text-primary 
                              font-inter 
                              rounded-xl 
                              hover:bg-primary 
                              hover:text-white 
                              transition-all 
                              font-medium"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditComment(false)}
                            className="
                              px-3 
                              py-1 
                              text-sm 
                              border 
                              border-solid 
                              border-warn 
                              text-warn font-inter 
                              rounded-xl 
                              hover:bg-warn 
                              hover:text-white 
                              transition-all 
                              font-medium"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="">
                      <p className="text-mainText text-right font-medium text-xs leading-4 font-inter">
                        {comment?.createdDate}
                      </p>
                      {comment?.isUpdated === true && (
                        <p className="text-mainText text-right font-medium text-xs leading-4 font-inter">
                          <span className="font-semibold">Edited at:</span> {comment?.updatedDate}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="mt-4 w-full peer comments">
                <div className="h-[1px] w-full bg-black"></div>
                <p className="mt-[22px] ml-4 text-mainText text-sm leading-5 font-bold font-inter">
                  No comments to show
                </p>
              </div>
            )}
            {purchaseRequisitionComments?.totalPages !== 0 && (
              <Pagination totalPages={purchaseRequisitionComments?.totalPages} defaultPage={1} />
            )}
          </div>
          {!purchaseRequisitionInfoLoading && (
            <>
              <div className="flex mt-8">
                <p className="py-[6px] px-8 font-inter text-[15px] leading-5 bg-[#879BDF4D] rounded-[10px]">
                  Purchase request - Action
                </p>
              </div>
              {purchaseRequisitionInfo?.status === 'WAITING_TO_APPROVAL' &&
              purchaseRequisitionInfo?.isApproved === false &&
              purchaseRequisitionInfo?.isRejected === false ? (
                <>
                  <input
                    type="text"
                    placeholder="(If reject) Reason for rejection"
                    readOnly={isLoading}
                    value={rejectComment}
                    onChange={(ev) => setRejectComment(ev.target.value)}
                    className={`
                      w-full
                      mt-6 
                      bg-[#F4F7FF] 
                      border 
                      border-solid 
                      border-[#e7e7e7] 
                      py-[14px] 
                      px-[30px] 
                      font-inter 
                      leading-6 
                      text-mainText 
                      placeholder:text-mainText 
                      outline-none 
                      rounded-md ${isLoading ? 'cursor-not-allowed' : ''}
                    `}
                  />
                  <div className="flex mt-10 justify-between">
                    <div className="flex gap-5">
                      <button
                        onClick={onApprovePurchaseRequisition}
                        className="rounded-md px-6 py-3 bg-primary text-white font-inter font-medium leading-5"
                      >
                        Approve
                      </button>

                      <button
                        onClick={onRejectPurchaseRequisition}
                        className="rounded-md px-6 py-3 bg-[#f28500] text-white font-inter font-medium leading-5"
                      >
                        Reject
                      </button>
                    </div>
                    <button
                      onClick={() => setConfirmationModal(true)}
                      className="rounded-md px-6 py-1 bg-warn text-white font-inter font-medium leading-5"
                    >
                      <img src={TrashIcon} alt="" className="w-5" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="mt-5 flex justify-end">
                  <button
                    onClick={() => setConfirmationModal(true)}
                    className="rounded-md px-6 py-2 bg-warn text-white font-inter font-medium leading-5"
                  >
                    <img src={TrashIcon} alt="" className="w-5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </Modal>
      <ConfirmationModal
        isOpen={confirmationModal}
        header="Are you sure?"
        description={
          data?.status === 'COMPLETED'
            ? 'The purchase requisition has already been completed. This action can only remove the purchase requisition from the views.'
            : 'This action cannot be undone'
        }
        hasTransitionedIn={confirmationModalTransition}
        isLoading={isLoading}
        onClose={() => setConfirmationModal(false)}
        onConfirm={onRemovePurchaseRequisition}
      />
    </>
  );
};

export default PurchaseRequisitionInfoModal;
