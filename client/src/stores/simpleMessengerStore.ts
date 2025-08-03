import { create } from 'zustand';

interface SimpleMessengerState {
  isOpen: boolean;
  openMessenger: () => void;
  closeMessenger: () => void;
}

export const useSimpleMessengerStore = create<SimpleMessengerState>((set) => ({
  isOpen: false,
  openMessenger: () => set({ isOpen: true }),
  closeMessenger: () => set({ isOpen: false }),
})); 