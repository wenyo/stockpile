import React, { type ReactNode } from "react";
export function ModalProvider({ children }: { children: ReactNode }) { return <>{children}</>; }
export default function App() { return <ModalProvider><div/></ModalProvider>; }
