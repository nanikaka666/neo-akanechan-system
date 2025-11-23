import { CSSProperties, useEffect, useMemo, useState } from "react";
import { TextChatViewer } from "./TextChatViewer";
import {
  ExtendedChatItemText,
  ExtendedMembershipAndGiftItem,
  ExtendedSuperItem,
  FocusedOnChatItem,
} from "../../../../ipcEvent";
import { SuperChatAndStickersViewer } from "./SuperChatAndStickersViewer";
import { MembershipsAndGiftsViewer } from "./MembershipsAndGiftsViewer";
import { ViewerModeSelector } from "./ViewerModeSelector";
import { FocusViewer } from "./FocusViewer";

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
  const [textChats, setTextChats] = useState<ExtendedChatItemText[]>([]);
  const [textChatNum, setTextChatNum] = useState(0);

  const [superChatAndStickers, setSuperChatAndStickers] = useState<ExtendedSuperItem[]>([]);

  const [membershipsAndGifts, setMembershipsAndGifts] = useState<ExtendedMembershipAndGiftItem[]>(
    [],
  );
  const [membershipsAndGiftsNum, setMembershipsAndGiftsNum] = useState(0);

  const [stocks, setStocks] = useState<ExtendedChatItemText[]>([]);

  const [focus, setFocus] = useState<FocusedOnChatItem>();

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
        disabled: membershipsAndGiftsNum === 0,
        itemNum: membershipsAndGiftsNum,
      },
      { viewerMode: "focus", label: "フォーカス中", disabled: !focus, itemNum: focus ? 1 : 0 },
    ];
  }, [textChatNum, superChatAndStickers, membershipsAndGiftsNum, stocks, focus]);

  useEffect(() => {
    window.ipcApi.registerMembershipsAndGiftsListener(
      (e, newMembershipsAndGifts, newMembershipsAndGiftsNum) => {
        setMembershipsAndGifts((_) => newMembershipsAndGifts);
        setMembershipsAndGiftsNum((_) => newMembershipsAndGiftsNum);
      },
    );
    window.ipcApi.registerChatsListener((e, chats) => {
      setTextChats((_) => chats.textChats.items);
      setTextChatNum((_) => chats.textChats.num);
      setSuperChatAndStickers((_) => chats.superChatAndStickers);
      setStocks((_) => chats.stocks);
      setFocus((_) => chats.focus);
    });
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
        <MembershipsAndGiftsViewer
          membershipsAndGifts={membershipsAndGifts}
          membershipsAndGiftsNum={membershipsAndGiftsNum}
        />
      </div>
      <div style={viewerMode !== "focus" ? displayNone : {}}>
        <FocusViewer focus={focus} />
      </div>
    </div>
  );
}
