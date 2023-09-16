import { useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

import SearchBox from '@/components/ui/SearchBox';
import DatePick from '@/components/ui/DatePick';
import PurchaseRequisitionColumns from '@/utils/data';

import PlusIcon from '@/assets/icons/plus-white.svg';
import ChatIcon from '@/assets/icons/chat.svg';

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

  const [search, setSearch] = useState<string>('');

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [columns, setColumns] = useState(PurchaseRequisitionColumns);

  const onDragEnd = (result: any, columns: any, setColumns: any) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      });
    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
      });
    }
  };

  const formatDate = (date: Date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const onFilter = () => {
    const dateStartValue = document.querySelector("#date-start") as HTMLInputElement;
    console.log(dateStartValue.value.length)
  }

  return (
    <>
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
            <button className="bg-primary h-11 w-11 flex items-center justify-center rounded-[4px]" onClick={() => {}}>
              <img src={PlusIcon} alt="" />
            </button>
          </div>
        </div>
        <div className="flex gap-3 mt-4 relative">
          <DatePick placeholder="Select date start" setSelectedDate={setStartDate} id="date-start" />
          <p className="font-inter text-sm text-mainText mt-[10px]">to</p>
          <DatePick placeholder="Select date end" setSelectedDate={setEndDate} id="date-end"/>
          {startDate && endDate && startDate > endDate && (
            <p className="font-inter text-xs text-warn absolute -bottom-7">Date start must be earlier than date end</p>
          )}
          <button 
            className='bg-white border border-solid border-primary text-primary font-inter hover:bg-primary hover:text-white transition-all px-4 py-1 mt-1 rounded-2xl ml-2' 
            onClick={onFilter}
          >
            Filter
          </button>
        </div>
        <div className="mt-8 flex-1 flex flex-col overflow-x-scroll kanban-scroll">
          <DragDropContext onDragEnd={(result) => onDragEnd(result, columns, setColumns)}>
            <div className="flex gap-2">
              {Object.entries(columns).map(([columnId, column], index) => (
                <div key={index} className="w-[266px] flex flex-col gap-2">
                  <div className="py-3 text-center bg-[#879BDF4D] font-inter font-bold text-sm leading-5 rounded-t-3xl">
                    {column.title}
                  </div>
                  <Droppable droppableId={columnId}>
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.droppableProps}>
                        <div
                          className="bg-[#879BDF4D] px-[6px] py-2 flex flex-col gap-3 items-center w-[266px] overflow-y-auto overflow-x-hidden column-scroll"
                          style={{ height: windowHeight - 326 }}
                        >
                          {column.items.map((item: any, index: number) => (
                            <Draggable key={item.id} draggableId={item.id} index={index}>
                              {(provided) => (
                                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                  <div className="w-[240px] bg-white px-4 py-3 rounded-lg cursor-pointer">
                                    <div className="flex justify-between">
                                      <p
                                        className={`font-inter text-xs leading-6 px-2 rounded-[5px] priority${item.priority}`}
                                      >
                                        {item.priority}
                                      </p>
                                      <p className="font-inter text-black text-sm leading-6">{item.projectCode}</p>
                                    </div>
                                    <div className="line my-2"></div>
                                    <h1 className="font-inter text-black font-bold leading-6">{item.name}</h1>
                                    <p className="mt-[6px] font-inter text-xs leading-6">
                                      From: {formatDate(item.dateStart)} - To: {formatDate(item.dateEnd)}
                                    </p>
                                    <div className="line mt-4 mb-2"></div>
                                    <div className="flex justify-between">
                                      <div className="flex items-center gap-2">
                                        <img src={ChatIcon} alt="" className="w-[14px]" />
                                        <p className="font-inter text-[8px] leading-6 font-medium text-[#838995]">
                                          {item.noOfComments} comments
                                        </p>
                                      </div>
                                      <p className="text-sm text-[#838995] font-medium leading-6 font-inter">
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
        </div>
      </div>
    </>
  );
};

export default PurchaseRequisition;
