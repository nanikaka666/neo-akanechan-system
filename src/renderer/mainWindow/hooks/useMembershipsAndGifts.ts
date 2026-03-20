import { useEffect, useState } from "react";
import { MembershipAndGiftItem } from "../../../types/liveChatItem";

export function useMembershipsAndGifts() {
  const [membershipsAndGifts, setMembershipsAndGifts] = useState<MembershipAndGiftItem[]>([]);

  useEffect(() => {
    const remover = window.ipcApi.mainWindow.registerMembershipsAndGiftsListener(
      (e, newMembershipsAndGifts) => {
        setMembershipsAndGifts((_) => newMembershipsAndGifts);
      },
    );
    return () => {
      remover();
    };
  }, []);

  return membershipsAndGifts;
}
