import { ChannelId } from "../../../../main/youtubeApi/model";
import { ChannelList } from "./ChannelList";
import { MainChannelTop } from "./MainChannelTop";

export function MainChannelTopLoader({ mainChannelId }: { mainChannelId: ChannelId }) {
  return (
    <>
      <ChannelList currentMainChannelId={mainChannelId} />
      <MainChannelTop mainChannelId={mainChannelId} key={mainChannelId.id} />
    </>
  );
}
