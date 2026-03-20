import { useEffect, useState } from "react";
import { MembershipAndGiftItem } from "../../../../types/liveChatItem";

export function useMembershipsAndGifts() {
  const [membershipsAndGifts, setMembershipsAndGifts] = useState<MembershipAndGiftItem[]>([]);

  useEffect(() => {
    const remover = window.ipcApi.lcp.registerMembershipsAndGiftsListener(
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
