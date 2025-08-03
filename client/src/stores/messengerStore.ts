import { create } from 'zustand';

interface MessengerState {
  isOpen: boolean;
  selectedServiceId: string | null;
  selectedServiceName: string | null;
  
  // Actions
  openMessenger: (serviceId?: string, serviceName?: string) => void;
  closeMessenger: () => void;
  setSelectedService: (serviceId: string, serviceName: string) => void;
}

export const useMessengerStore = create<MessengerState>((set) => ({
  isOpen: false,
  selectedServiceId: null,
  selectedServiceName: null,

  openMessenger: (serviceId?: string, serviceName?: string) => {
    set({
      isOpen: true,
      selectedServiceId: serviceId || null,
      selectedServiceName: serviceName || null,
    });
  },

  closeMessenger: () => {
    set({
      isOpen: false,
      selectedServiceId: null,
      selectedServiceName: null,
    });
  },

  setSelectedService: (serviceId: string, serviceName: string) => {
    set({
      selectedServiceId: serviceId,
      selectedServiceName: serviceName,
    });
  },
})); 