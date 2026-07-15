export const modalTypeConstant = {
  STOCK: "stock",
  WELCOME: "welcome",
  DEMO_CHECK: "demoCheck",
  DELETE_CHECK: "deleteCheck",
  STATUS_INFO: "statusInfo",
  FAMILY: "Family",
} as const;

export type ModalType = typeof modalTypeConstant[keyof typeof modalTypeConstant] | null;
