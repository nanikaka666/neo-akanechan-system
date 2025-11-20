import { CSSProperties, useEffect, useMemo, useState } from "react";
import { TextChatViewer } from "./TextChatViewer";
import {
  ExtendedChatItemText,
  ExtendedMembershipAndGiftItem,
  ExtendedSuperItem,
} from "../../../../ipcEvent";
import { SuperChatAndStickersViewer } from "./SuperChatAndStickersViewer";
import { MembershipsAndGiftsViewer } from "./MembershipsAndGiftsViewer";

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

type ViewerMode = "text" | "superchatAndStickers" | "stocks" | "membershipsAndGifts";

interface ViewerModeSelectOption {
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
    ];
  }, [textChatNum, superChatAndStickersNum, membershipsAndGiftsNum, stocksNum]);

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
      console.log(newStocks);
      setStocks((_) => newStocks);
      setStocksNum((_) => newStocksNum);
    });
  }, []);

  return (
    <div>
      <div style={{ height: "50px" }}>
        <label>
          <select
            value={viewerMode}
            onChange={(e) => {
              setViewerMode((_) => e.target.value as ViewerMode);
            }}
            style={{ border: "none" }}
          >
            {selectOptions.map((optionItem) => {
              return (
                <option
                  key={optionItem.viewerMode}
                  value={optionItem.viewerMode satisfies ViewerMode}
                  disabled={optionItem.disabled}
                >
                  {optionItem.label} ({optionItem.itemNum})
                </option>
              );
            })}
          </select>
        </label>
      </div>
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
    </div>
  );
}
