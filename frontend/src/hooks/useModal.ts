import { create } from 'zustand';

interface useModalProps {
  isOpen: boolean;
  data: any;
  closable: boolean;
  onOpen: () => void;
  onClose: () => void;
  setData: (data: any) => void;
  setClosable: (closable: boolean) => void;
}

export const useModal = create<useModalProps>((set) => ({
  isOpen: false,
  data: null,
  closable: true,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false, closable: true }),
  setClosable: (closable: boolean) => set({ closable }),
  setData: (data: any) => set({ data }),
}));
