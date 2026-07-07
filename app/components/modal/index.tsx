import { useContext, useEffect } from "react";
import { modalTypeConstant } from "@/interfaces/modal";
import { ModalContext } from "@/store/modal";
import CreateModal from "@/components/modal/createStock";
import CreateFamilyModal from "@/components/modal/createFamily";
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
    (isModalOpen && modalType && <div className="modal">
      {modalType === modalTypeConstant.CREATE && <CreateModal />}
      {modalType === modalTypeConstant.EDIT && <CreateModal />}
      {modalType === modalTypeConstant.WELCOME && <WelcomeModal />}
      {modalType === modalTypeConstant.DEMO_CHECK && <DemoCheckModal />}
      {modalType === modalTypeConstant.DELETE_CHECK && <DeleteCheckModal />}
      {modalType === modalTypeConstant.STATUS_INFO && <StatusInfoModal />}
      {modalType === modalTypeConstant.CREATE_FAMILY && <CreateFamilyModal />}
    </div>)
  )
}