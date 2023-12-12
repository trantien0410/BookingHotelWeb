import { create } from 'zustand';

interface RestaurantRentModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useRestaurantRentModal = create<RestaurantRentModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false })
}));


export default useRestaurantRentModal;