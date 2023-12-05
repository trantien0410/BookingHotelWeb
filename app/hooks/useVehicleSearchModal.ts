import { create } from 'zustand';

interface VehicleSearchModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useVehicleSearchModal = create<VehicleSearchModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false })
}));


export default useVehicleSearchModal;