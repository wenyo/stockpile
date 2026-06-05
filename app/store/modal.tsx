import { createContext, useState, type ReactNode } from "react";

export type Modal = {
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
}

export const ModalContext = createContext<Modal>({
  isModalOpen: false,
  setIsModalOpen: () => {},
})

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <ModalContext.Provider value={{ isModalOpen, setIsModalOpen }}>
      {children}
    </ModalContext.Provider>
  )
}