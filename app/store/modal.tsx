import { createContext, useState, useEffect, type ReactNode } from "react";
import { type ModalType, modalTypeConstant } from "@/interfaces/modal";

export type Modal = {
  isModalOpen: boolean;
  modalType: ModalType;
  setModalType: (modalType: ModalType) => void;
  setIsModalOpen: (isModalOpen: boolean) => void;
  openModal: (type: ModalType) => void;
  closeModal: () => void;
}

export const ModalContext = createContext<Modal>({
  isModalOpen: false,
  modalType: modalTypeConstant.CREATE,
  setModalType: () => {},
  setIsModalOpen: () => {},
  openModal: () => {},
  closeModal: () => {},
})

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<ModalType>(null);

  function openModal(type: ModalType) {
    setModalType(type);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setModalType(null);
  }

  useEffect(() => {    
    if (localStorage.getItem("stockList")) {
      return;
    }
    openModal("welcome");
  }, []);

  return (
    <ModalContext.Provider value={{ isModalOpen, setIsModalOpen, modalType, setModalType, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  )
}