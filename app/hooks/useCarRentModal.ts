import { create } from 'zustand';

interface CarRentModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useCarRentModal = create<CarRentModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false })
}));


export default useCarRentModal;