import { RefObject } from "react";
import { VirtuosoHandle } from "react-virtuoso";

interface JumpToLatestButtonProps {
  ref: RefObject<VirtuosoHandle | null>;
  lastIndex: number;
}

export function JumpToLatestButton({ ref, lastIndex }: JumpToLatestButtonProps) {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        ref.current?.scrollIntoView({
          index: lastIndex,
          align: "end",
          behavior: "auto",
        });
      }}
    >
      最新のチャットへ飛ぶ
    </button>
  );
}
