export const modalTypeConstant = {
  STOCK: "stock",
  WELCOME: "welcome",
  DEMO_CHECK: "demoCheck",
  DELETE_CHECK: "deleteCheck",
  STATUS_INFO: "statusInfo",
  FAMILY: "Family",
  PWA_NOTICE: "pwaNotice",
  UPDATE_STOCK: "updateStock",
} as const;

export type ModalType = typeof modalTypeConstant[keyof typeof modalTypeConstant] | null;
