import { create } from "zustand";

interface RestaurantSearchModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useRestaurantSearchModal = create<RestaurantSearchModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useRestaurantSearchModal;
