import { CSSProperties, useMemo, useState } from "react";
import { TextChatViewer } from "./TextChatViewer";

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

type ViewerMode = "text" | "superchat" | "supersticker" | "stocks";

interface ViewerModeSelectOption {
  viewerMode: ViewerMode;
  label: string;
  disabled: boolean;
  itemNum: number;
}

const displayNone: CSSProperties = { display: "none" };

export function CommentViewer() {
  const [viewerMode, setViewerMode] = useState<ViewerMode>("text");

  const selectOptions = useMemo<ViewerModeSelectOption[]>(() => {
    return [
      { viewerMode: "text", label: "テキストチャット", disabled: false, itemNum: 123 },
      { viewerMode: "superchat", label: "SuperChat", disabled: false, itemNum: 123 },
      { viewerMode: "supersticker", label: "SuperSticker", disabled: true, itemNum: 0 },
      { viewerMode: "stocks", label: "ストック", disabled: false, itemNum: 123 },
    ];
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
                  value={optionItem.viewerMode}
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
        <TextChatViewer />
      </div>
      <div style={viewerMode !== "superchat" ? displayNone : {}}>Super Chat Viewer</div>
      <div style={viewerMode !== "supersticker" ? displayNone : {}}>Super Sticker Viewer</div>
      <div style={viewerMode !== "stocks" ? displayNone : {}}>Stocks</div>
    </div>
  );
}
