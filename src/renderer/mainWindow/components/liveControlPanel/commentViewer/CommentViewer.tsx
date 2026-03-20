import { CSSProperties } from "react";
import { TextChatViewer } from "./TextChatViewer";
import { SuperChatAndStickersViewer } from "./SuperChatAndStickersViewer";
import { MembershipsAndGiftsViewer } from "./MembershipsAndGiftsViewer";
import { ChatItemCount, ViewerModeSelector } from "./ViewerModeSelector";
import { useCommentViewerMode } from "../../../hooks/useCommentViewerMode";
import { FocusViewer } from "./FocusViewer";
import { useChats } from "../../../hooks/useChats";
import { useMembershipsAndGifts } from "../../../hooks/useMembershipsAndGifts";

const displayNone: CSSProperties = { display: "none" };

export function CommentViewer() {
  const [currentViewerMode, viewerModeUpdator, allViewerMode] = useCommentViewerMode();

  const [textChats, textChatNum, superChatAndStickers, stocks, focus] = useChats();
  const membershipsAndGifts = useMembershipsAndGifts();

  const itemCounts: ChatItemCount = {
    text: textChatNum,
    superChatAndSticker: superChatAndStickers.length,
    membershipAndGift: membershipsAndGifts.length,
    stock: stocks.length,
    focus: focus ? 1 : 0,
  };

  return (
    <div>
      <ViewerModeSelector
        currentViewerMode={currentViewerMode}
        itemCounts={itemCounts}
        viewerModeUpdator={viewerModeUpdator}
      />
      {allViewerMode.map((viewerMode) => {
        return (
          <div key={viewerMode} style={viewerMode === currentViewerMode ? {} : displayNone}>
            {viewerMode === "text" ? (
              <TextChatViewer textChats={textChats} />
            ) : viewerMode === "superchatAndStickers" ? (
              <SuperChatAndStickersViewer superChatAndStickers={superChatAndStickers} />
            ) : viewerMode === "stocks" ? (
              <TextChatViewer textChats={stocks} />
            ) : viewerMode === "membershipsAndGifts" ? (
              <MembershipsAndGiftsViewer membershipsAndGifts={membershipsAndGifts} />
            ) : (
              <FocusViewer focus={focus} />
            )}
          </div>
        );
      })}
    </div>
  );
}
