import { useEffect, useState } from 'react';
import { DragDropContext, Draggable, DropResult, Droppable } from 'react-beautiful-dnd';
import { isAxiosError } from 'axios';
import toast from 'react-hot-toast';

import SearchBox from '@/components/ui/SearchBox';
import DatePick from '@/components/ui/DatePick';

import PlusIcon from '@/assets/icons/plus-white.svg';
import { useModal } from '@/hooks/useModal';
import useMountTransition from '@/hooks/useMountTransition';
import { usePurchaseRequisition } from '@/hooks/usePurchaseRequisition';
import AddPurchaseRequisitionModal from '@/components/modals/AddPurchaseRequisitionModal';
import PurchaseRequisitionInfoModal from '@/components/modals/PurchaseRequisitionInfoModal';
import axiosInstance from '@/api/axios';
import ConfirmationModal from '@/components/modals/ConfirmationModal';
import useCurrentUser from '@/hooks/useCurrentUser';
import { mutate } from 'swr';

const PurchaseRequisition: React.FC = () => {
  const [windowHeight, setWindowHeight] = useState<number>(window.innerHeight);

  // Set the page height to fit the screen
  useEffect(() => {
    document.title = 'Purchase Requisition';

    window.addEventListener('resize', () => {
      setWindowHeight(window.innerHeight);
    });

    return () => {
      window.removeEventListener('resize', () => {
        setWindowHeight(window.innerHeight);
      });
    };
  }, []);

  const { data: currentUser } = useCurrentUser();

  // Purchase requisition props
  const data = usePurchaseRequisition((state) => state.data);
  const originalData = usePurchaseRequisition((state) => state.originalData);
  const isFetched = usePurchaseRequisition((state) => state.isFetched);
  const fetchData = usePurchaseRequisition((state) => state.fetchData);
  const setPurchaseRequisition = usePurchaseRequisition((state) => state.setData);
  const setDateStart = usePurchaseRequisition((state) => state.setDateStart);
  const setDateEnd = usePurchaseRequisition((state) => state.setDateEnd);
  const filterDate = usePurchaseRequisition((state) => state.filterDate);
  const cancelPurchase = usePurchaseRequisition((state) => state.cancel);
  const purchaseRequisitionLoading = usePurchaseRequisition((state) => state.isLoading);

  useEffect(() => {
    if (!isFetched) fetchData();
  }, [isFetched, fetchData]);

  // Modal for purchase requisition info
  const isOpen = useModal((state) => state.isOpen);
  const onOpen = useModal((state) => state.onOpen);
  const onClose = useModal((state) => state.onClose);
  const setData = useModal((state) => state.setData);
  const hasTransitionedIn = useMountTransition(isOpen, 200);

  // Modal for add purchase requisition
  const [addModal, setAddModal] = useState<boolean>(false);
  const addModalTransition = useMountTransition(addModal, 200);

  // Declare variant for confirmation modal
  const [variant, setVariant] = useState<'set-status' | 'reject'>('set-status');
  const [rejectComment, setRejectComment] = useState<string>('');

  // Confirmation modal
  const [ConfirmationModalOpen, setConfirmationModalOpen] = useState<boolean>(false);
  const ConfirmationModalTransition = useMountTransition(ConfirmationModalOpen, 200);
  const [purchase, setPurchase] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Unstage purchase requisition data
  const [unstageData, setUnstageData] = useState<any>(null);

  // Handle search purchase requisition
  const [search, setSearch] = useState<string>('');
  const [searchResult, setSearchResult] = useState<any>();

  useEffect(() => {
    if (search.length !== 0) {
      const onSearchProjects = async () => {
        try {
          const response = await axiosInstance.get(`/api/purchase-requisition?search=${search}&page=1&size=3`);
          setSearchResult(response?.data.data);
        } catch (error) {
          toast.error('Failed to search projects');
        }
      };
      onSearchProjects();
    } else {
      setSearchResult(null);
    }
  }, [search]);

  // Handle reject purchase requisition
  const rejectPurchaseRequisition = async (id: string): Promise<void> => {
    if (rejectComment === '') {
      toast.error('Please fill the reason for rejection');
      return;
    }

    const toastLoading = toast.loading('Rejecting Purchase...');
    setIsLoading(true);

    try {
      await axiosInstance.post(`/api/purchase-requisition/${id}/reject`, {
        comment: rejectComment,
      });
      await mutate(`/api/purchase-requisition/${id}`, undefined, true);
      toast.success('Purchase Rejected Successfully');
      setConfirmationModalOpen(false);
      setRejectComment('');
      cancelPurchase(id);
    } catch (error) {
      if (isAxiosError(error)) {
        if (error?.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error('Something went wrong');
        }
      }
    } finally {
      setIsLoading(false);
      toast.dismiss(toastLoading);
    }
  };

  const changeStatus = async (id: string, status: string) => {
    const toastLoading = toast.loading('Applying Changes...');
    setIsLoading(true);

    try {
      await axiosInstance.post(`/api/purchase-requisition/${id}/set-status`, {
        status: status,
      });
      await mutate(`/api/purchase-requisition/${id}`);
      toast.success('Changes Applied Successfully');
      setConfirmationModalOpen(false);
      return true;
    } catch (error) {
      if (isAxiosError(error)) {
        if (error?.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error('Something went wrong');
        }
      }
    } finally {
      setIsLoading(false);
      toast.dismiss(toastLoading);
    }
  };

  const onDragEnd = async (result: DropResult): Promise<void> => {
    if (!result.destination) return;
    const data = JSON.parse(JSON.stringify(originalData));
    setUnstageData(data);

    const { source, destination } = result;

    // If the item is dropped outside the list
    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = data[source.droppableId];
      const destColumn = data[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);

      // Check if the request is already completed or cancelled
      if (removed.status === 'COMPLETED' || removed.status === 'CANCELLED') {
        toast.error('The request is already completed or cancelled');
        return;
      }
      // If the request is not approved, it cannot be moved to the following column
      if (!removed.isApproved) {
        if (
          destination.droppableId === 'TO_DO' ||
          destination.droppableId === 'IN_PROGRESS' ||
          destination.droppableId === 'COMPLETED'
        ) {
          toast.error('The request must be approved before moving to this column');
          return;
        }
        // If the request is approved, it cannot be moved back to the waiting to approval column
      } else {
        if (destination.droppableId === 'WAITING_TO_APPROVAL') {
          toast.error('The request is already approved');
          return;
        }
      }
      // If the user is not allowed to cancel the request, it cannot be moved to the cancelled column
      if (destination.droppableId === 'CANCELLED' && !currentUser?.reject) {
        toast.error('You are not allowed to cancel this request');
        return;
      }

      removed.status = destination.droppableId;
      destItems.splice(destination.index, 0, removed);

      setPurchaseRequisition({
        ...originalData,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      });

      filterDate();

      // If the request is moved to the completed or cancelled column, show confirmation modal
      if (removed.status === 'COMPLETED') {
        setPurchase(removed);
        setVariant('set-status');
        setConfirmationModalOpen(true);
        return;
      }

      if (removed.status === 'CANCELLED') {
        setPurchase(removed);
        setVariant('reject');
        setConfirmationModalOpen(true);
        return;
      }

      const isSuccess = await changeStatus(removed.id, removed.status);

      // If the request is not successfully updated, revert the changes
      if (!isSuccess) {
        setPurchaseRequisition(data);
      }
      // If the item is dropped inside the list
    } else {
      const column = data[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);

      setPurchaseRequisition({
        ...originalData,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
      });
      filterDate();
    }
  };

  const formatDate = (date: string): string => {
    return date.split('-').join('/');
  };

  const [filterError, setFilterError] = useState<boolean>(false);

  const onFilter = (): void => {
    const dateStartValue = document.querySelector('#filter-date-start') as HTMLInputElement;
    const dateEndValue = document.querySelector('#filter-date-end') as HTMLInputElement;

    const dateStart = dateStartValue.value.length > 0 ? new Date(dateStartValue.value) : null;
    const dateEnd = dateEndValue.value.length > 0 ? new Date(dateEndValue.value) : null;

    if (dateStart && dateEnd && dateStart > dateEnd) {
      setFilterError(true);
      return;
    }

    setFilterError(false);

    setDateStart(dateStart);
    setDateEnd(dateEnd);
    filterDate();
  };

  return (
    <>
      <ConfirmationModal
        header="Are you sure?"
        description="You cannot update this purchase's status if you complete/cancel this purchase."
        isOpen={ConfirmationModalOpen}
        isLoading={isLoading}
        hasTransitionedIn={ConfirmationModalTransition}
        onClose={() => {
          setConfirmationModalOpen(false);
          setPurchaseRequisition(unstageData);
        }}
        onConfirm={async () => {
          if (variant === 'reject') await rejectPurchaseRequisition(purchase.id);
          else await changeStatus(purchase.id, purchase.status);
        }}
        input={variant === 'reject'}
        inputValue={rejectComment}
        setInputValue={setRejectComment}
        inputPlaceholder="Reason for rejection"
      />
      <PurchaseRequisitionInfoModal
        isOpen={isOpen}
        onClose={() => {
          const newSearchParams = new URLSearchParams(location.search);
          newSearchParams.delete('page');
          history.replaceState(null, '', `?${newSearchParams.toString()}`);
          onClose();
          setTimeout(() => {
            setData(null);
          }, 200);
        }}
        hasTransitionedIn={hasTransitionedIn}
      />
      <AddPurchaseRequisitionModal
        isOpen={addModal}
        onClose={() => setAddModal(false)}
        hasTransitionedIn={addModalTransition}
      />
      <div className="pl-10 pt-7 flex-1 flex flex-col">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="font-inter font-semibold text-2xl leading-[30px] text-black">Purchase Requisition</h1>
            <p className="mt-2 font-inter text-sm leading-5 text-mainText max-w-[600px]">
              In this page, requester can make request to Purchasing department to procure a certain quantity of a
              material. The Purchasing department can manage the request list.
            </p>
          </div>
          {purchaseRequisitionLoading ? (
            <div className="flex gap-5 pr-18 animate-pulse">
              <div className="w-[385px] rounded-lg bg-slate-200 h-11"></div>
              <div className="h-11 w-11 bg-slate-200 rounded-[4px]"></div>
            </div>
          ) : (
            <div className="flex gap-5 pr-18">
              <SearchBox
                search={search}
                setSearch={setSearch}
                searchResult={searchResult}
                placeholder={'Search by project code or purchase name'}
                name="purchaseName"
                code="projectCode"
                link={false}
                onClick={(result: any) => {
                  setData(result);
                  onOpen();
                  setSearch('');
                }}
              />
              <button
                className="bg-primary h-11 w-11 flex items-center justify-center rounded-[4px]"
                onClick={() => setAddModal(true)}
              >
                <img src={PlusIcon} alt="" />
              </button>
            </div>
          )}
        </div>
        {purchaseRequisitionLoading ? (
          <div className="flex gap-3 mt-4 animate-pulse items-center">
            <div className="w-60 h-[42px] rounded-lg bg-slate-200"></div>
            <div className="w-[14px] h-[20px] rounded-md bg-slate-200"></div>
            <div className="w-60 h-[42px] rounded-lg bg-slate-200"></div>
            <div className="w-[72px] h-10 rounded-2xl bg-slate-200 ml-2"></div>
          </div>
        ) : (
          <div className="flex gap-3 mt-4 relative">
            <div className="w-60">
              <DatePick placeholder="Select date start" id="filter-date-start" />
            </div>
            <p className="font-inter text-sm text-mainText mt-[10px]">to</p>
            <div className="w-60">
              <DatePick placeholder="Select date end" id="filter-date-end" />
            </div>
            {filterError && (
              <p className="font-inter text-xs text-warn absolute -bottom-5">
                Date start must be earlier than date end
              </p>
            )}
            <button
              className="
              bg-white 
              border 
              border-solid 
              border-primary 
              text-primary 
              font-inter 
              hover:bg-primary 
              hover:text-white 
              transition-all 
              px-4 
              py-1 
              mt-[2px] 
              rounded-2xl 
              ml-2"
              onClick={onFilter}
            >
              Filter
            </button>
          </div>
        )}
        <div className="mt-8 flex-1 flex flex-col overflow-x-scroll kanban-scroll">
          {purchaseRequisitionLoading ? (
            <div className="flex gap-2 animate-pulse">
              {[...Array(8)].map((_, idx: number) => (
                <div className="w-[266px] flex flex-col gap-2" key={idx}>
                  <div className="h-11 bg-slate-200 rounded-t-3xl"></div>
                  <div style={{ height: windowHeight - 338 }} className="bg-slate-200 column-scroll w-[266px]"></div>
                </div>
              ))}
            </div>
          ) : (
            <DragDropContext onDragEnd={(result) => onDragEnd(result)}>
              <div className="flex gap-2">
                {Object.entries(data).map(([columnId, column], index) => (
                  <div key={index} className="w-[266px] flex flex-col gap-2">
                    <div className="py-3 text-center bg-[#879BDF4D] font-inter font-bold text-sm leading-5 rounded-t-3xl">
                      {column.title}
                    </div>
                    <Droppable droppableId={columnId}>
                      {(provided) => (
                        <div ref={provided.innerRef} {...provided.droppableProps}>
                          <div
                            className="
                            bg-[#879BDF4D] 
                            px-[6px] 
                            py-2 
                            flex 
                            flex-col 
                            gap-3 
                            items-center 
                            w-[266px] 
                            overflow-y-auto 
                            overflow-x-hidden 
                            column-scroll"
                            style={{ height: windowHeight - 338 }}
                          >
                            {column.items?.map((item: any, index: number) => (
                              <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    <div
                                      onClick={() => {
                                        onOpen();
                                        setData(item);
                                      }}
                                      className="w-[240px] bg-white px-4 py-3 rounded-lg cursor-pointer"
                                    >
                                      <div className="flex justify-between">
                                        <p
                                          className={`font-inter text-xs leading-6 px-2 rounded-[5px] priority${item.priority}`}
                                        >
                                          {item.priority.charAt(0) + item.priority.slice(1).toLowerCase()}
                                        </p>
                                        <p className="font-inter text-black text-sm leading-6">{item.projectCode}</p>
                                      </div>
                                      <div className="line my-2"></div>
                                      <h1 className="font-inter text-black font-bold leading-6">{item.purchaseName}</h1>
                                      <p className="mt-[6px] font-inter text-xs leading-6">
                                        From: {formatDate(item.targetDate)} - To: {formatDate(item.dueDate)}
                                      </p>
                                      {item.isApproved && (
                                        <div className="mt-1 flex items-center justify-center py-1 rounded-md bg-[#13C296]">
                                          <p className="font-inter text-xs leading-5 text-white">Approve</p>
                                        </div>
                                      )}
                                      {item.isRejected && (
                                        <div className="mt-1 flex items-center justify-center py-1 rounded-md bg-[#DC2626]">
                                          <p className="font-inter text-xs leading-5 text-white">Rejected</p>
                                        </div>
                                      )}
                                      <div className="line mt-4 mb-2"></div>
                                      <div className="flex justify-end">
                                        <p className="text-sm text-[#838995] font-medium leading-6 font-inter text-right">
                                          {item.requester}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        </div>
                      )}
                    </Droppable>
                  </div>
                ))}
              </div>
            </DragDropContext>
          )}
        </div>
      </div>
    </>
  );
};

export default PurchaseRequisition;
