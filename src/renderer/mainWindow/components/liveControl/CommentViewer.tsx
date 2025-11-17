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

export function CommentViewer() {
  return <TextChatViewer />;
}
