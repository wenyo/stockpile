
export const modalTypeConstant: Record<string, string> = {
  STOCK: "stock",
  WELCOME: "welcome",
  DEMO_CHECK: "demoCheck",
  DELETE_CHECK: "deleteCheck",
  STATUS_INFO: "statusInfo",
  FAMILY: "Family",
}

export type ModalType = typeof modalTypeConstant[keyof typeof modalTypeConstant] | null;
