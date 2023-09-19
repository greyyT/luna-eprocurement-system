import fetcher from '@/api/fetcher';
import { create } from 'zustand';

interface usePurchaseRequisitionInfoProps {
  data: any;
  dataKey: string;
  comments: any;
  commentsKey: string;
  fetchData: (token: string, projectCode: string, id: string) => Promise<void>;
  fetchComments: (
    token: string,
    projectCode: string,
    id: string,
    page: number | string,
    force?: boolean,
  ) => Promise<void>;
}

const usePurchaseRequisitionInfo = create<usePurchaseRequisitionInfoProps>((set, get) => ({
  data: null,
  comments: null,
  dataKey: '',
  commentsKey: '',
  fetchData: async (token: string, projectCode: string, id: string) => {
    const url = `/api/purchase-requisition/${projectCode}/${id}`;
    if (get().dataKey === url) return;

    const response = await fetcher(url, token);

    set({ data: response, dataKey: url });
  },
  fetchComments: async (token: string, projectCode: string, id: string, page: number | string, force?: boolean) => {
    const url = `/api/purchase-requisition/${projectCode}/${id}/comments?page=${page}&size=2`;

    if (!force) {
      if (get().commentsKey === url) return;
    }

    const response = await fetcher(url, token);

    set({ comments: response, commentsKey: url });
  },
}));

export default usePurchaseRequisitionInfo;
