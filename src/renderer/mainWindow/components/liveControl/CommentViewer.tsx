import { CSSProperties, useEffect, useMemo, useState } from "react";
import { TextChatViewer } from "./TextChatViewer";
import {
  ExtendedChatItemText,
  ExtendedMembershipAndGiftItem,
  ExtendedSuperItem,
} from "../../../../ipcEvent";
import { SuperChatsViewer } from "./SuperChatsViewer";
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

type ViewerMode = "text" | "superchat" | "stocks" | "textByMemberships" | "membershipsAndGifts";

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

  const [superChats, setSuperChats] = useState<ExtendedSuperItem[]>([]);
  const [superChatsNum, setSuperChatsNum] = useState(0);

  const [membershipsAndGifts, setMembershipsAndGifts] = useState<ExtendedMembershipAndGiftItem[]>(
    [],
  );
  const [membershipsAndGiftsNum, setMembershipsAndGiftsNum] = useState(0);

  const selectOptions = useMemo<ViewerModeSelectOption[]>(() => {
    return [
      { viewerMode: "text", label: "テキストチャット", disabled: false, itemNum: textChatNum },
      {
        viewerMode: "superchat",
        label: "スパチャ & Sticker",
        disabled: superChatsNum === 0,
        itemNum: superChatsNum,
      },
      { viewerMode: "stocks", label: "ストック", disabled: false, itemNum: 123 },
      {
        viewerMode: "textByMemberships",
        label: "テキストチャット(メンバーシップのみ)",
        disabled: false,
        itemNum: 123,
      },
      {
        viewerMode: "membershipsAndGifts",
        label: "メンバーシップ & ギフト",
        disabled: membershipsAndGiftsNum === 0,
        itemNum: membershipsAndGiftsNum,
      },
    ];
  }, [textChatNum, superChatsNum, membershipsAndGiftsNum]);

  useEffect(() => {
    window.ipcApi.registerTextChatsListener((e, newTextChats, newTextChatNum) => {
      setTextChats((_) => newTextChats);
      setTextChatNum((_) => newTextChatNum);
    });
    window.ipcApi.registerSuperChatsListener((e, newSuperChats, newSuperChatsNum) => {
      setSuperChats((_) => newSuperChats);
      setSuperChatsNum((_) => newSuperChatsNum);
    });
    window.ipcApi.registerMembershipsAndGiftsListener(
      (e, newMembershipsAndGifts, newMembershipsAndGiftsNum) => {
        setMembershipsAndGifts((_) => newMembershipsAndGifts);
        setMembershipsAndGiftsNum((_) => newMembershipsAndGiftsNum);
      },
    );
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
      <div style={viewerMode !== "superchat" ? displayNone : {}}>
        <SuperChatsViewer superChats={superChats} superChatsNum={superChatsNum} />
      </div>
      <div style={viewerMode !== "stocks" ? displayNone : {}}>Stocks</div>
      <div style={viewerMode !== "textByMemberships" ? displayNone : {}}>Chats by memberships</div>
      <div style={viewerMode !== "membershipsAndGifts" ? displayNone : {}}>
        <MembershipsAndGiftsViewer
          membershipsAndGifts={membershipsAndGifts}
          membershipsAndGiftsNum={membershipsAndGiftsNum}
        />
      </div>
    </div>
  );
}
