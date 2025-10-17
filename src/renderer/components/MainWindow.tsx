import { ChangeEvent, MouseEvent, useState } from "react";
import { ChannelSummary } from "../../ipcEvent";
import { ChannelId } from "youtube-live-scraper";

export function MainWindow() {
  const [input, setInput] = useState("");
  const [errorMessage, setErrorMessage] = useState<string>();
  const [channelData, setChannelData] = useState<ChannelSummary>();

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    setInput((_) => e.target.value);
  }

  async function onClick(e: MouseEvent) {
    e.preventDefault();

    try {
      const channelId = new ChannelId(input);
      const res = await window.ipcApi.requestConfirmingInputChannelId(channelId);

      if (res === undefined) {
        const msg = channelId.isHandle
          ? `入力されたYoutubeハンドル ${channelId.id} に該当するチャンネルが見つかりませんでした`
          : `入力されたチャンネルID ${channelId.id} に該当するチャンネルが見つかりませんでした`;
        setErrorMessage((_) => msg);
      } else {
        setErrorMessage((_) => undefined);
        setChannelData((_) => res);
      }
    } catch {
      setErrorMessage((_) => `入力された ${input} の形式が正しくありません`);
    }

    setInput((_) => "");
  }

  return channelData === undefined ? (
    <div>
      {errorMessage !== undefined && <div>{errorMessage}</div>}
      Input ChannelId: <input type="text" value={input} onChange={onChange}></input>
      <button onClick={onClick} disabled={input === ""}>
        Submit
      </button>
    </div>
  ) : (
    <div>
      <div>
        <img src={channelData.ownerIcon} style={{ width: "64px", height: "64px" }}></img>
      </div>
      <div>{channelData.channelTitle.title}</div>
      <div>{channelData.subscribersCount} 人</div>
      <div>このチャンネルをアプリに登録しますか？</div>
      <button>OK</button>
      <button>NO</button>
    </div>
  );
}
