import { useContext, useEffect } from "react";
import { ModalContext } from "@/store/modal";
import CreateModal from "@/components/modal/create";
import WelcomeModal from "@/components/modal/welcome";
import DemoCheckModal from "@/components/modal/demoCheck";
import DeleteCheckModal from "@/components/modal/deleteCheck";
import StatusInfoModal from "@/components/modal/statusInfo";

export default function Modal() {
  const { isModalOpen, modalType } = useContext(ModalContext);

  // 避免背景滾動
  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "unset";
  }, [isModalOpen]);
  
  return (
    (isModalOpen && <div className="modal">
      {modalType === "create" && <CreateModal />}
      {modalType === "edit" && <CreateModal />}
      {modalType === "welcome" && <WelcomeModal />}
      {modalType === "demoCheck" && <DemoCheckModal />}
      {modalType === "deleteCheck" && <DeleteCheckModal />}
      {modalType === "statusInfo" && <StatusInfoModal />}
    </div>)
  )
}