
export const modalTypeConstant: Record<string, string> = {
  CREATE: "create",
  EDIT: "edit",
  WELCOME: "welcome",
  DEMO_CHECK: "demoCheck",
  DELETE_CHECK: "deleteCheck",
  STATUS_INFO: "statusInfo",
  CREATE_FAMILY: "createFamily",
}

export type ModalType = typeof modalTypeConstant[keyof typeof modalTypeConstant] | null;
