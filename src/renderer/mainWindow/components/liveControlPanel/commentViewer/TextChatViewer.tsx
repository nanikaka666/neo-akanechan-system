import { Virtuoso } from "react-virtuoso";
import { ExtendedChatItemText } from "../../../../../types/liveChatItem";
import { TextChatItem } from "./TextChatItem";
import { useListRange } from "../../../hooks/useListRange";
import { useJumpToLatestButton } from "../../../hooks/useJumpToLatestButton";
import { JumpToLatestButton } from "./JumpToLatestButton";

interface TextChatViewerProps {
  textChats: ExtendedChatItemText[];
}

export function TextChatViewer({ textChats }: TextChatViewerProps) {
  const [_, rangeUpdator] = useListRange();

  const [ref, isShownJumpButton, onAtBottomStateChanged] = useJumpToLatestButton();

  return (
    <div>
      <Virtuoso
        className="virtuoso"
        ref={ref}
        data={textChats}
        atBottomThreshold={50}
        atBottomStateChange={onAtBottomStateChanged}
        style={{ height: "95vh" }}
        followOutput={(isAtBottom) => {
          return isAtBottom ? "smooth" : false;
        }}
        rangeChanged={rangeUpdator}
        itemContent={(index, textChat) => {
          return <TextChatItem item={textChat} key={textChat.id.id} />;
        }}
      />
      {isShownJumpButton && <JumpToLatestButton ref={ref} lastIndex={textChats.length - 1} />}
    </div>
  );
}
