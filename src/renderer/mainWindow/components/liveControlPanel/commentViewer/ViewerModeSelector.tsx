import { ViewerMode } from "../../../hooks/useCommentViewerMode";

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
  itemCounts: ChatItemCount;
  viewerModeUpdator: (mode: ViewerMode) => void;
}

export function ViewerModeSelector({
  currentViewerMode,
  itemCounts,
  viewerModeUpdator,
}: ViewerModeSelectorProps) {
  const selectOptions: ViewerModeSelectOption[] = [
    { viewerMode: "text", label: "テキスト", itemNum: itemCounts.text },
    {
      viewerMode: "superchatAndStickers",
      label: "スパチャ",
      itemNum: itemCounts.superChatAndSticker,
    },
    {
      viewerMode: "stocks",
      label: "ストック",
      itemNum: itemCounts.stock,
    },
    {
      viewerMode: "membershipsAndGifts",
      label: "メンバー & ギフト",
      itemNum: itemCounts.membershipAndGift,
    },
    { viewerMode: "focus", label: "フォーカス中", itemNum: itemCounts.focus },
  ];

  return (
    <ul className="mode-selector">
      {selectOptions.map((option) => {
        return (
          <li
            key={option.viewerMode}
            value={option.viewerMode}
            className={[
              option.itemNum === 0 ? "disabled" : "",
              currentViewerMode === option.viewerMode ? "selected" : "",
            ].join(" ")}
            onClick={(e) => {
              e.preventDefault();
              if (option.itemNum === 0) {
                return;
              }
              viewerModeUpdator(option.viewerMode);
            }}
          >
            {`${option.label} (${option.itemNum})`}
          </li>
        );
      })}
    </ul>
  );
}
