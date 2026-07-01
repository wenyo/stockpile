import { useContext } from "react";
import { ModalContext } from "@/store/modal";
import CreateModal from "@/components/modal/create";
import WelcomeModal from "@/components/modal/welcome";
import DemoCheckModal from "@/components/modal/demoCheck";
import DeleteCheckModal from "@/components/modal/deleteCheck";

export default function Modal() {
  const { isModalOpen, modalType } = useContext(ModalContext);
  return (
    (isModalOpen && <div className="modal">
      {modalType === "create" && <CreateModal />}
      {modalType === "edit" && <CreateModal />}
      {modalType === "welcome" && <WelcomeModal />}
      {modalType === "demoCheck" && <DemoCheckModal />}
      {modalType === "deleteCheck" && <DeleteCheckModal />}
    </div>)
  )
}