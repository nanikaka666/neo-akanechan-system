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
  const [superChatAndStickersNum, setSuperChatAndStickersNum] = useState(0);

  const [membershipsAndGifts, setMembershipsAndGifts] = useState<ExtendedMembershipAndGiftItem[]>(
    [],
  );
  const [membershipsAndGiftsNum, setMembershipsAndGiftsNum] = useState(0);

  const [stocks, setStocks] = useState<ExtendedChatItemText[]>([]);
  const [stocksNum, setStocksNum] = useState(0);

  const [focus, setFocus] = useState<FocusedOnChatItem>();

  const selectOptions = useMemo<ViewerModeSelectOption[]>(() => {
    return [
      { viewerMode: "text", label: "テキストチャット", disabled: false, itemNum: textChatNum },
      {
        viewerMode: "superchatAndStickers",
        label: "スパチャ & Sticker",
        disabled: superChatAndStickersNum === 0,
        itemNum: superChatAndStickersNum,
      },
      { viewerMode: "stocks", label: "ストック", disabled: stocksNum === 0, itemNum: stocksNum },
      {
        viewerMode: "membershipsAndGifts",
        label: "メンバーシップ & ギフト",
        disabled: membershipsAndGiftsNum === 0,
        itemNum: membershipsAndGiftsNum,
      },
      { viewerMode: "focus", label: "フォーカス中", disabled: !focus, itemNum: focus ? 1 : 0 },
    ];
  }, [textChatNum, superChatAndStickersNum, membershipsAndGiftsNum, stocksNum, focus]);

  useEffect(() => {
    window.ipcApi.registerTextChatsListener((e, newTextChats, newTextChatNum) => {
      setTextChats((_) => newTextChats);
      setTextChatNum((_) => newTextChatNum);
    });
    window.ipcApi.registerSuperChatsListener((e, newSuperChats, newSuperChatsNum) => {
      setSuperChatAndStickers((_) => newSuperChats);
      setSuperChatAndStickersNum((_) => newSuperChatsNum);
    });
    window.ipcApi.registerMembershipsAndGiftsListener(
      (e, newMembershipsAndGifts, newMembershipsAndGiftsNum) => {
        setMembershipsAndGifts((_) => newMembershipsAndGifts);
        setMembershipsAndGiftsNum((_) => newMembershipsAndGiftsNum);
      },
    );
    window.ipcApi.registerStocksListener((e, newStocks, newStocksNum) => {
      setStocks((_) => newStocks);
      setStocksNum((_) => newStocksNum);
    });
    window.ipcApi.registerFocusListener((e, newFocus) => {
      setFocus((_) => newFocus);
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
        <SuperChatAndStickersViewer
          superChatAndStickers={superChatAndStickers}
          superChatAndStickersNum={superChatAndStickersNum}
        />
      </div>
      <div style={viewerMode !== "stocks" ? displayNone : {}}>
        <TextChatViewer textChats={stocks} textChatNum={stocksNum} />
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
