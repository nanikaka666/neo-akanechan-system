import { CSSProperties, useEffect, useMemo, useState } from "react";
import { TextChatViewer } from "./TextChatViewer";
import { MembershipAndGiftItem } from "../../../../../types/liveChatItem";
import { SuperChatAndStickersViewer } from "./SuperChatAndStickersViewer";
import { MembershipsAndGiftsViewer } from "./MembershipsAndGiftsViewer";
import { ViewerModeSelector } from "./ViewerModeSelector";
import { FocusViewer } from "./FocusViewer";
import { useChats } from "../../hooks/useChats";

export interface RangeInfo {
  time: {
    start: string;
    end: string;
  };
  indexOfWhole: {
    start: number;
    end: number;
  };
}

export type ViewerMode =
  | "text"
  | "superchatAndStickers"
  | "stocks"
  | "membershipsAndGifts"
  | "focus";

export interface ViewerModeSelectOption {
  viewerMode: ViewerMode;
  label: string;
  disabled: boolean;
  itemNum: number;
}

const displayNone: CSSProperties = { display: "none" };

export function CommentViewer() {
  const [viewerMode, setViewerMode] = useState<ViewerMode>("text");

  const [membershipsAndGifts, setMembershipsAndGifts] = useState<MembershipAndGiftItem[]>([]);

  const [textChats, textChatNum, superChatAndStickers, stocks, focus] = useChats();

  const selectOptions = useMemo<ViewerModeSelectOption[]>(() => {
    return [
      { viewerMode: "text", label: "テキストチャット", disabled: false, itemNum: textChatNum },
      {
        viewerMode: "superchatAndStickers",
        label: "スパチャ & Sticker",
        disabled: superChatAndStickers.length === 0,
        itemNum: superChatAndStickers.length,
      },
      {
        viewerMode: "stocks",
        label: "ストック",
        disabled: stocks.length === 0,
        itemNum: stocks.length,
      },
      {
        viewerMode: "membershipsAndGifts",
        label: "メンバーシップ & ギフト",
        disabled: membershipsAndGifts.length === 0,
        itemNum: membershipsAndGifts.length,
      },
      { viewerMode: "focus", label: "フォーカス中", disabled: !focus, itemNum: focus ? 1 : 0 },
    ];
  }, [textChatNum, superChatAndStickers, membershipsAndGifts, stocks, focus]);

  useEffect(() => {
    const membershipsRemover = window.ipcApi.registerMembershipsAndGiftsListener(
      (e, newMembershipsAndGifts) => {
        setMembershipsAndGifts((_) => newMembershipsAndGifts);
      },
    );
    return () => {
      membershipsRemover();
    };
  }, []);

  return (
    <div>
      <ViewerModeSelector
        currentViewerMode={viewerMode}
        options={selectOptions}
        setViewerMode={setViewerMode}
      />
      <div style={viewerMode !== "text" ? displayNone : {}}>
        <TextChatViewer textChats={textChats} textChatNum={textChatNum} />
      </div>
      <div style={viewerMode !== "superchatAndStickers" ? displayNone : {}}>
        <SuperChatAndStickersViewer superChatAndStickers={superChatAndStickers} />
      </div>
      <div style={viewerMode !== "stocks" ? displayNone : {}}>
        <TextChatViewer textChats={stocks} textChatNum={stocks.length} />
      </div>
      <div style={viewerMode !== "membershipsAndGifts" ? displayNone : {}}>
        <MembershipsAndGiftsViewer membershipsAndGifts={membershipsAndGifts} />
      </div>
      <div style={viewerMode !== "focus" ? displayNone : {}}>
        <FocusViewer focus={focus} />
      </div>
    </div>
  );
}
