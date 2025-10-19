import { ChannelId } from "youtube-live-scraper";

export function MainChannelTop({ mainChannelId }: { mainChannelId: ChannelId }) {
  return <div>メインチャンネル: {mainChannelId.id}</div>;
}
