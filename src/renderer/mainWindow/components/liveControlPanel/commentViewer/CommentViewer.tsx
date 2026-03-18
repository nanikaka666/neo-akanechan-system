import { CSSProperties } from "react";
import { TextChatViewer } from "./TextChatViewer";
import { SuperChatAndStickersViewer } from "./SuperChatAndStickersViewer";
import { MembershipsAndGiftsViewer } from "./MembershipsAndGiftsViewer";
import { ChatItemCount, ViewerModeSelector } from "./ViewerModeSelector";
import { useCommentViewerMode } from "../../hooks/useCommentViewerMode";
import { FocusViewer } from "./FocusViewer";
import { useChats } from "../../hooks/useChats";
import { useMembershipsAndGifts } from "../../hooks/useMembershipsAndGifts";

const displayNone: CSSProperties = { display: "none" };

export function CommentViewer() {
  const [viewerMode, modeUpdator] = useCommentViewerMode();

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
        currentViewerMode={viewerMode}
        itemCounts={itemCounts}
        modeUpdator={modeUpdator}
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
