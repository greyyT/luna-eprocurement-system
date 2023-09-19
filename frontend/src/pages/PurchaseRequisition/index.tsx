import { useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

import SearchBox from '@/components/ui/SearchBox';
import DatePick from '@/components/ui/DatePick';

import PlusIcon from '@/assets/icons/plus-white.svg';
import { useModal } from '@/hooks/useModal';
import useMountTransition from '@/hooks/useMountTransition';
import { useLocation } from 'react-router-dom';
import useToken from '@/hooks/useToken';
import { usePurchaseRequisition } from '@/hooks/usePurchaseRequisition';
import AddPurchaseRequisitionModal from '@/components/modals/AddPurchaseRequisitionModal';
import PurchaseRequisitionInfoModal from '@/components/modals/PurchaseRequisitionInfoModal';
import toast from 'react-hot-toast';
import axiosInstance from '@/api/axios';
import { isAxiosError } from 'axios';

const PurchaseRequisition: React.FC = () => {
  const [windowHeight, setWindowHeight] = useState<number>(window.innerHeight);

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

  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const legalEntityCode = params.get('entityCode') || '';

  const { token } = useToken();

  const data = usePurchaseRequisition((state) => state.data);
  const originalData = usePurchaseRequisition((state) => state.originalData);
  const isFetched = usePurchaseRequisition((state) => state.isFetched);
  const fetchData = usePurchaseRequisition((state) => state.fetchData);
  const setPurchaseRequisition = usePurchaseRequisition((state) => state.setData);
  const setDateStart = usePurchaseRequisition((state) => state.setDateStart);
  const setDateEnd = usePurchaseRequisition((state) => state.setDateEnd);
  const filterDate = usePurchaseRequisition((state) => state.filterDate);

  useEffect(() => {
    if (!isFetched) fetchData(token, legalEntityCode || '');
  }, [isFetched, fetchData, legalEntityCode, token]);

  const [search, setSearch] = useState<string>('');

  const isOpen = useModal((state) => state.isOpen);
  const onOpen = useModal((state) => state.onOpen);
  const onClose = useModal((state) => state.onClose);
  const setData = useModal((state) => state.setData);
  const hasTransitionedIn = useMountTransition(isOpen, 200);

  const [addModal, setAddModal] = useState<boolean>(false);
  const addModalTransition = useMountTransition(addModal, 200);

  const onDragEnd = async (result: any) => {
    if (!result.destination) return;
    const unchangedData = JSON.parse(JSON.stringify(originalData));

    const { source, destination } = result;
    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = data[source.droppableId];
      const destColumn = data[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
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

      const toastLoading = toast.loading('Applying Changes...');
      try {
        await axiosInstance.post(
          `/api/purchase-requisition/${removed?.id}/set-status`,
          {
            status: removed.status,
            isApproved: removed.isApproved,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        toast.success('Changes Applied Successfully');
      } catch (error) {
        if (isAxiosError(error)) {
          if (error?.response?.data?.message) {
            toast.error(error.response.data.message);
          } else {
            toast.error('Something went wrong');
          }
        }
        setPurchaseRequisition(unchangedData);
      } finally {
        toast.dismiss(toastLoading);
      }
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

  const formatDate = (date: string) => {
    return date.split('-').join('/');
  };

  const [filterError, setFilterError] = useState<boolean>(false);

  const onFilter = () => {
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

  const onOpenDetail = (item: any) => {
    onOpen();
    setData(item);
  };

  return (
    <>
      <PurchaseRequisitionInfoModal
        isOpen={isOpen}
        onClose={() => {
          const newSearchParams = new URLSearchParams(location.search);
          newSearchParams.delete('page');
          history.replaceState(null, '', `?${newSearchParams.toString()}`);
          onClose();
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
          <div className="flex gap-5 pr-18 scroll">
            <SearchBox
              search={search}
              setSearch={setSearch}
              searchResult={null}
              api={'products-list'}
              placeholder={'Search by project code or purchase name'}
              name="name"
              code="code"
            />
            <button
              className="bg-primary h-11 w-11 flex items-center justify-center rounded-[4px]"
              onClick={() => setAddModal(true)}
            >
              <img src={PlusIcon} alt="" />
            </button>
          </div>
        </div>
        <div className="flex gap-3 mt-4 relative">
          <div className="w-60">
            <DatePick placeholder="Select date start" id="filter-date-start" />
          </div>
          <p className="font-inter text-sm text-mainText mt-[10px]">to</p>
          <div className="w-60">
            <DatePick placeholder="Select date end" id="filter-date-end" />
          </div>
          {filterError && (
            <p className="font-inter text-xs text-warn absolute -bottom-5">Date start must be earlier than date end</p>
          )}
          <button
            className="bg-white border border-solid border-primary text-primary font-inter hover:bg-primary hover:text-white transition-all px-4 py-1 mt-[2px] rounded-2xl ml-2"
            onClick={onFilter}
          >
            Filter
          </button>
        </div>
        <div className="mt-8 flex-1 flex flex-col overflow-x-scroll kanban-scroll">
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
                          className="bg-[#879BDF4D] px-[6px] py-2 flex flex-col gap-3 items-center w-[266px] overflow-y-auto overflow-x-hidden column-scroll"
                          style={{ height: windowHeight - 338 }}
                        >
                          {column.items?.map((item: any, index: number) => (
                            <Draggable key={item.id} draggableId={item.id} index={index}>
                              {(provided) => (
                                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                  <div
                                    onClick={() => onOpenDetail(item)}
                                    className="w-[240px] bg-white px-4 py-3 rounded-lg cursor-pointer"
                                  >
                                    <div className="flex justify-between">
                                      <p
                                        className={`font-inter text-xs leading-6 px-2 rounded-[5px] priority${item.priority}`}
                                      >
                                        {item.priority}
                                      </p>
                                      <p className="font-inter text-black text-sm leading-6">{item.projectCode}</p>
                                    </div>
                                    <div className="line my-2"></div>
                                    <h1 className="font-inter text-black font-bold leading-6">{item.purchaseName}</h1>
                                    <p className="mt-[6px] font-inter text-xs leading-6">
                                      From: {formatDate(item.targetDate)} - To: {formatDate(item.dueDate)}
                                    </p>
                                    <div className="line mt-4 mb-2"></div>
                                    <p className="text-sm text-[#838995] font-medium leading-6 font-inter text-right">
                                      {item.requester}
                                    </p>
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
        </div>
      </div>
    </>
  );
};

export default PurchaseRequisition;
