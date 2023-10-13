import fetcher from '@/api/fetcher';
import { create } from 'zustand';

type PurchaseRequisitionColumnsType = {
  [key: string]: {
    title: string;
    items: any;
  };
};

interface usePurchaseRequisitionProps {
  data: PurchaseRequisitionColumnsType;
  originalData: PurchaseRequisitionColumnsType;
  dateStart: Date | null;
  dateEnd: Date | null;
  isFetched: boolean;
  isLoading: boolean;
  fetchData: () => Promise<void>;
  setData: (data: PurchaseRequisitionColumnsType) => void;
  setDateStart: (date: Date | null) => void;
  setDateEnd: (date: Date | null) => void;
  filterDate: () => void;
  approve: (id: string) => void;
  reject: (id: string) => void;
  cancel: (id: string) => void;
  delete: (id: string, column: string) => void;
}

const convertDate = (date: string) => {
  const dateParts = date.split('-').map(Number);
  return new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
};

export const usePurchaseRequisition = create<usePurchaseRequisitionProps>((set, get) => ({
  data: {},
  originalData: {},
  dateStart: null,
  dateEnd: null,
  isFetched: false,
  isLoading: false,
  setDateStart: (date: Date | null) => set({ dateStart: date }),
  setDateEnd: (date: Date | null) => set({ dateEnd: date }),
  fetchData: async () => {
    set({ isLoading: true });
    const response = await fetcher(`/api/purchase-requisition`);
    const data = response.data;

    const filteredData: PurchaseRequisitionColumnsType = {
      DRAFT: {
        title: 'Draft',
        items: data?.filter((item: any) => item.status === 'DRAFT'),
      },
      READY: {
        title: 'Ready',
        items: data?.filter((item: any) => item.status === 'READY'),
      },
      WAITING_TO_APPROVAL: {
        title: 'Waiting to Approval',
        items: data?.filter((item: any) => item.status === 'WAITING_TO_APPROVAL'),
      },
      TO_DO: {
        title: 'To Do',
        items: data?.filter((item: any) => item.status === 'TO_DO'),
      },
      IN_PROGRESS: {
        title: 'In Progress',
        items: data?.filter((item: any) => item.status === 'IN_PROGRESS'),
      },
      ON_HOLD: {
        title: 'On Hold',
        items: data?.filter((item: any) => item.status === 'ON_HOLD'),
      },
      CANCELLED: {
        title: 'Cancelled',
        items: data?.filter((item: any) => item.status === 'CANCELLED'),
      },
      COMPLETED: {
        title: 'Completed',
        items: data?.filter((item: any) => item.status === 'COMPLETED'),
      },
    };

    set({ data: filteredData, originalData: filteredData, isFetched: true, isLoading: false });
  },
  setData: (data: PurchaseRequisitionColumnsType) => set({ data, originalData: data }),
  filterDate: () => {
    const dateStart = get().dateStart;
    const dateEnd = get().dateEnd;

    if (!dateStart && !dateEnd) {
      set({ data: get().originalData });
      return;
    }

    const filteredColumns: { [key: string]: any } = {};

    for (const [key, column] of Object.entries(get().originalData)) {
      const filteredItems = column.items.filter((item: any) => {
        if (!dateStart && dateEnd) return convertDate(item.dueDate) <= dateEnd;
        if (dateStart && !dateEnd) return convertDate(item.targetDate) >= dateStart;
        if (dateStart && dateEnd)
          return convertDate(item.targetDate) >= dateStart && convertDate(item.dueDate) <= dateEnd;
      });

      filteredColumns[key] = {
        ...column,
        items: filteredItems,
      };
    }

    set({ data: filteredColumns });
  },
  approve: (id: string) => {
    const originalData = get().originalData;

    const approvedItem = originalData.WAITING_TO_APPROVAL.items.find((item: any) => item.id === id);

    approvedItem.isApproved = true;
    approvedItem.status = 'IN_PROGRESS';

    const newData = {
      ...originalData,
      WAITING_TO_APPROVAL: {
        ...originalData.WAITING_TO_APPROVAL,
        items: originalData.WAITING_TO_APPROVAL.items.filter((item: any) => item.id !== id),
      },
      IN_PROGRESS: {
        ...originalData.IN_PROGRESS,
        items: [...originalData.IN_PROGRESS.items, approvedItem],
      },
    };

    set({ originalData: newData });

    get().filterDate();
  },
  reject: (id: string) => {
    const originalData = get().originalData;

    const rejectedItem = originalData.WAITING_TO_APPROVAL.items.find((item: any) => item.id === id);

    rejectedItem.isRejected = true;
    rejectedItem.isApproved = false;
    rejectedItem.status = 'CANCELLED';

    const newData = {
      ...originalData,
      WAITING_TO_APPROVAL: {
        ...originalData.WAITING_TO_APPROVAL,
        items: originalData.WAITING_TO_APPROVAL.items.filter((item: any) => item.id !== id),
      },
      CANCELLED: {
        ...originalData.CANCELLED,
        items: [...originalData.CANCELLED.items, rejectedItem],
      },
    };

    set({ originalData: newData });

    get().filterDate();
  },
  cancel: (id: string) => {
    const originalData = get().originalData;

    const cancelledItem = originalData.CANCELLED.items.find((item: any) => item.id === id);

    cancelledItem.isApproved = false;
    cancelledItem.isRejected = true;
    cancelledItem.status = 'CANCELLED';

    const newData = {
      ...originalData,
      CANCELLED: {
        ...originalData.CANCELLED,
        items: [...originalData.CANCELLED.items.filter((item: any) => item.id !== id), cancelledItem],
      },
    };

    set({ originalData: newData });

    get().filterDate();
  },
  delete: (id: string, column: string) => {
    const originalData = get().originalData;

    const newData = {
      ...originalData,
      [column]: {
        ...originalData[column],
        items: originalData[column].items.filter((item: any) => item.id !== id),
      },
    };

    set({ originalData: newData });

    get().filterDate();
  },
}));
