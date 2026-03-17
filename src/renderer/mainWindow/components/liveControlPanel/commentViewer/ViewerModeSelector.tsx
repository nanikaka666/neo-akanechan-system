import { Dispatch, SetStateAction } from "react";
import { ViewerMode } from "../../hooks/useCommentViewerMode";

interface ViewerModeSelectOption {
  viewerMode: ViewerMode;
  label: string;
  itemNum: number;
}

export interface ChatItemCount {
  text: number;
  superChatAndSticker: number;
  membershipAndGift: number;
  stock: number;
  focus: 0 | 1;
}

interface ViewerModeSelectorProps {
  currentViewerMode: ViewerMode;
  setViewerMode: Dispatch<SetStateAction<ViewerMode>>;
  itemCounts: ChatItemCount;
}

export function ViewerModeSelector({
  currentViewerMode,
  setViewerMode,
  itemCounts,
}: ViewerModeSelectorProps) {
  const selectOptions: ViewerModeSelectOption[] = [
    { viewerMode: "text", label: "テキストチャット", itemNum: itemCounts.text },
    {
      viewerMode: "superchatAndStickers",
      label: "スパチャ & Sticker",
      itemNum: itemCounts.superChatAndSticker,
    },
    {
      viewerMode: "stocks",
      label: "ストック",
      itemNum: itemCounts.stock,
    },
    {
      viewerMode: "membershipsAndGifts",
      label: "メンバーシップ & ギフト",
      itemNum: itemCounts.membershipAndGift,
    },
    { viewerMode: "focus", label: "フォーカス中", itemNum: itemCounts.focus },
  ];

  return (
    <div style={{ height: "50px", display: "flex" }}>
      {selectOptions.map((option) => {
        return (
          <div
            key={option.viewerMode}
            style={
              option.viewerMode === currentViewerMode
                ? { backgroundColor: "yellow" }
                : option.itemNum === 0
                  ? { backgroundColor: "gray" }
                  : {}
            }
            onClick={() => {
              if (option.itemNum === 0) {
                return;
              }
              setViewerMode((_) => option.viewerMode);
            }}
          >
            {`${option.label} (${option.itemNum})`}
          </div>
        );
      })}
    </div>
  );
}
