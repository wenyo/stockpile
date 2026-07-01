import { useRegisterSW } from "virtual:pwa-register/react";

export function PWABadge() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl: string) {
      console.log("SW registered:", swUrl);
    },
    onRegisterError(error: any) {
      console.log("SW registration error", error);
    },
  });

  if (!needRefresh) return null;

  return (
    <div className="fixed bottom-4 right-4 rounded-md bg-neutral-800 p-3 text-white shadow-lg">
      <p>有新版本可用</p>
      <button onClick={() => updateServiceWorker(true)}>重新整理更新</button>
    </div>
  );
}